<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;

class CategoriesSeeder extends Seeder
{
    public function run()
    {
        $response = Http::withoutVerifying()->timeout(100)->get('https://api.pokemontcg.io/v2/sets');


        if ($response->successful()) {
            $sets = $response->json()['data'];

            foreach ($sets as $set) {
                DB::table('categories')->updateOrInsert(
                    ['id_set' => $set['id']],
                    [
                        'name' => $set['name'],
                        'release_date' => isset($set['releaseDate']) ? Carbon::parse($set['releaseDate']) : now(),
                        'total_cards' => $set['total'] ?? 0,
                        'logo' => $set['images']['logo'] ?? '',
                        'symbol' => $set['images']['symbol'] ?? '',
                        'legal' => isset($set['legal']) ? 1 : 1, // no hay flag directo, lo dejamos en 1 por default
                        'deleted' => 0,
                        'created_at' => now(),
                        'updated_at' => now(),
                    ]
                );
            }
        } else {
            $this->command->error('No se pudo obtener la data de la API.');
        }
    }
}

