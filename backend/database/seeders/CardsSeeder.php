<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\DB;

class CardsSeeder extends Seeder
{
    public function run()
    {
        ini_set('memory_limit', '512M');
        $this->command->info('Starting CardsSeeder using TCGdex API...');

        // Get sets from the database
        $sets = DB::table('categories')->select('id', 'id_set')->get();

        $targetSets = ['xy1', 'sm1', 'swsh1', 'swsh2', 'sv01', 'sv02'];

        foreach ($sets as $set) {
            $setId = $set->id_set;
            if (!in_array($setId, $targetSets)) {
                continue;
            }
            $this->command->info("Fetching cards for set: {$setId}...");

            $responseEn = Http::withoutVerifying()->timeout(100)->get("https://api.tcgdex.net/v2/en/sets/{$setId}");
            $responseEs = Http::withoutVerifying()->timeout(100)->get("https://api.tcgdex.net/v2/es/sets/{$setId}");

            if (!$responseEn->successful() || !$responseEs->successful()) {
                $this->command->error("Failed to fetch cards for set: {$setId}");
                continue;
            }

            $cardsEn = $responseEn->json()['cards'] ?? [];
            $cardsEs = $responseEs->json()['cards'] ?? [];

            // Index Spanish cards by ID
            $cardsEsById = [];
            foreach ($cardsEs as $cardEs) {
                $cardsEsById[$cardEs['id']] = $cardEs;
            }

            $allCardsData = [];
            $count = 0;

            foreach ($cardsEn as $cardEn) {
                $cardId = $cardEn['id'];
                $cardEs = $cardsEsById[$cardId] ?? null;

                $enName = $cardEn['name'];
                $esName = $cardEs ? $cardEs['name'] : $enName;

                // To make seeding fast and stable, we fetch full details for the first 15 cards of each set.
                // For the remaining cards, we create a lightweight basic card detail object.
                $isDetailed = $count < 15;
                $count++;

                $enDetails = null;
                $esDetails = null;

                if ($isDetailed) {
                    $this->command->info("Fetching full details for card: {$enName} ({$cardId})...");
                    $resCardEn = Http::withoutVerifying()->timeout(30)->get("https://api.tcgdex.net/v2/en/cards/{$cardId}");
                    $resCardEs = Http::withoutVerifying()->timeout(30)->get("https://api.tcgdex.net/v2/es/cards/{$cardId}");

                    if ($resCardEn->successful() && $resCardEs->successful()) {
                        $enDetails = $resCardEn->json();
                        $esDetails = $resCardEs->json();
                    }
                }

                // Map English Details
                $enDesc = $this->mapCardDetails($enDetails, $cardEn, 'en');
                // Map Spanish Details
                $esDesc = $this->mapCardDetails($esDetails, $cardEs ?: $cardEn, 'es');

                // Build translation description object
                $descriptionJson = json_encode([
                    'en' => $enDesc,
                    'es' => $esDesc
                ], JSON_UNESCAPED_UNICODE);

                $namesJson = json_encode([
                    'en' => $enName,
                    'es' => $esName
                ], JSON_UNESCAPED_UNICODE);

                $allCardsData[] = [
                    'id_card' => $cardId,
                    'id_set' => $set->id,
                    'name' => $namesJson,
                    'image_small' => $cardEn['image'] . '/low.webp',
                    'image_large' => $cardEn['image'] . '/high.webp',
                    'description' => $descriptionJson,
                    'deleted' => 0,
                    'created_at' => now(),
                    'updated_at' => now(),
                ];
            }

            if (!empty($allCardsData)) {
                DB::table('cards')->upsert($allCardsData, ['id_card'], [
                    'id_set', 'name', 'image_small', 'image_large', 'description', 'deleted', 'updated_at'
                ]);
                $this->command->info("Successfully seeded " . count($allCardsData) . " cards for set {$setId}.");
            }

            // Clean memory
            unset($allCardsData);
            gc_collect_cycles();
        }
    }

    private function mapCardDetails($details, $summary, $lang)
    {
        $name = $details['name'] ?? $summary['name'];
        $image = $details['image'] ?? $summary['image'];

        // Base structure
        $mapped = [
            'id' => $details['id'] ?? $summary['id'],
            'name' => $name,
            'supertype' => $details['category'] ?? ($lang === 'es' ? 'Entrenador/Pokémon' : 'Trainer/Pokémon'),
            'subtypes' => isset($details['stage']) ? [$details['stage']] : [],
            'evolvesFrom' => $details['evolveFrom'] ?? null,
            'rarity' => $details['rarity'] ?? ($lang === 'es' ? 'Común' : 'Common'),
            'images' => [
                'small' => $image . '/low.webp',
                'large' => $image . '/high.webp'
            ],
            'abilities' => [],
            'attacks' => []
        ];

        // Map abilities
        if (isset($details['abilities']) && is_array($details['abilities'])) {
            foreach ($details['abilities'] as $ab) {
                $mapped['abilities'][] = [
                    'name' => $ab['name'] ?? '',
                    'text' => $ab['effect'] ?? '',
                    'type' => $ab['type'] ?? 'Ability'
                ];
            }
        }

        // Map attacks
        if (isset($details['attacks']) && is_array($details['attacks'])) {
            foreach ($details['attacks'] as $at) {
                $mapped['attacks'][] = [
                    'name' => $at['name'] ?? '',
                    'text' => $at['effect'] ?? '',
                    'damage' => $at['damage'] ?? '',
                    'cost' => $at['cost'] ?? []
                ];
            }
        }

        return $mapped;
    }
}
