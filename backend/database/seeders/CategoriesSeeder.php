<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Carbon;

class CategoriesSeeder extends Seeder
{
    public function run()
    {
        $this->command->info('Fetching categories in English and Spanish from TCGdex API...');

        $responseEn = Http::withoutVerifying()->timeout(100)->get('https://api.tcgdex.net/v2/en/sets');
        $responseEs = Http::withoutVerifying()->timeout(100)->get('https://api.tcgdex.net/v2/es/sets');

        if ($responseEn->successful() && $responseEs->successful()) {
            $setsEn = $responseEn->json();
            $setsEs = $responseEs->json();

            // Index Spanish sets by ID for fast lookup
            $setsEsById = [];
            foreach ($setsEs as $setEs) {
                $setsEsById[$setEs['id']] = $setEs;
            }

            // Only seed a select group of popular classic sets to keep seeding fast and stable
            $targetSets = ['base1', 'base2', 'base3', 'neo1', 'ex1', 'swsh1', 'sv01'];

            foreach ($setsEn as $setEn) {
                $setId = $setEn['id'];

                // Check if it is one of our target sets
                if (!in_array($setId, $targetSets)) {
                    continue;
                }

                $setEs = $setsEsById[$setId] ?? null;

                $enName = $setEn['name'];
                $esName = $setEs ? $setEs['name'] : $enName;

                // Store names in both languages as a JSON object
                $namesJson = json_encode([
                    'en' => $enName,
                    'es' => $esName
                ], JSON_UNESCAPED_UNICODE);

                $logoUrl = $setEn['logo'] ?? '';
                if ($logoUrl && !str_ends_with($logoUrl, '.png')) {
                    $logoUrl .= '.png';
                }

                $symbolUrl = $setEn['symbol'] ?? '';
                if ($symbolUrl && !str_ends_with($symbolUrl, '.png')) {
                    $symbolUrl .= '.png';
                }

                DB::table('categories')->updateOrInsert(
                    ['id_set' => $setId],
                    [
                        'name' => $namesJson,
                        'release_date' => Carbon::now()->subYears(10), // Default release date
                        'total_cards' => $setEn['cardCount']['total'] ?? 0,
                        'logo' => $logoUrl,
                        'symbol' => $symbolUrl,
                        'legal' => 1,
                        'deleted' => 0,
                        'created_at' => now(),
                        'updated_at' => now(),
                    ]
                );
                $this->command->info("Seeded category: {$enName} / {$esName}");
            }
        } else {
            $this->command->error('Could not retrieve sets data from TCGdex API.');
        }
    }
}
