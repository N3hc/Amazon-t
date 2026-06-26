<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Carbon;
use Illuminate\Http\Client\Pool;

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

            $this->command->info('Fetching details for all sets concurrently...');
            
            // Chunk the sets to avoid overwhelming the API
            $chunks = array_chunk($setsEn, 20);
            
            foreach ($chunks as $chunkIndex => $chunk) {
                $this->command->info("Fetching set details chunk " . ($chunkIndex + 1) . " of " . count($chunks) . "...");
                
                $responses = Http::pool(function (Pool $pool) use ($chunk) {
                    foreach ($chunk as $setEn) {
                        $pool->as($setEn['id'])->withoutVerifying()->timeout(30)->get("https://api.tcgdex.net/v2/en/sets/{$setEn['id']}");
                    }
                });
                
                foreach ($chunk as $setEn) {
                    $setId = $setEn['id'];
                    $setDetailsResponse = $responses[$setId] ?? null;
                    
                    $releaseDate = null;
                    $symbolUrl = '';
                    
                    if ($setDetailsResponse && $setDetailsResponse->successful()) {
                        $details = $setDetailsResponse->json();
                        $releaseDate = $details['releaseDate'] ?? null;
                        $symbolUrl = $details['symbol'] ?? '';
                        if ($symbolUrl && !str_ends_with($symbolUrl, '.png')) {
                            $symbolUrl .= '.png';
                        }
                    } else {
                        // Fallback to construction ONLY if details call failed
                        if (isset($setEn['logo'])) {
                            $logoUrl = $setEn['logo'];
                            $parts = explode('/', str_replace('https://assets.tcgdex.net/', '', $logoUrl));
                            if (count($parts) >= 3) {
                                $serie = $parts[1];
                                $set = $parts[2];
                                $symbolUrl = "https://assets.tcgdex.net/univ/{$serie}/{$set}/symbol.png";
                            }
                        }
                    }
                    
                    $enName = $setEn['name'];
                    $setEs = $setsEsById[$setId] ?? null;
                    $esName = $setEs ? $setEs['name'] : $enName;
                    
                    $namesJson = json_encode([
                        'en' => $enName,
                        'es' => $esName
                    ], JSON_UNESCAPED_UNICODE);
                    
                    $logoUrl = $setEn['logo'] ?? '';
                    if ($logoUrl && !str_ends_with($logoUrl, '.png')) {
                        $logoUrl .= '.png';
                    }
                    
                    DB::table('categories')->updateOrInsert(
                        ['id_set' => $setId],
                        [
                            'name' => $namesJson,
                            'release_date' => $releaseDate ?: Carbon::now()->subYears(10)->format('Y-m-d'),
                            'total_cards' => $setEn['cardCount']['total'] ?? 0,
                            'logo' => $logoUrl,
                            'symbol' => $symbolUrl,
                            'legal' => 1,
                            'deleted' => 0,
                            'created_at' => now(),
                            'updated_at' => now(),
                        ]
                    );
                }
            }
            $this->command->info('All categories seeded successfully!');
        } else {
            $this->command->error('Could not retrieve sets data from TCGdex API.');
        }
    }
}
