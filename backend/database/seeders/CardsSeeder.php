<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\DB;

class CardsSeeder extends Seeder
{
    public function run()
    {
        // Obtenemos los sets desde la base de datos
        $sets = DB::table('categories')->select('id', 'id_set')->get();

        foreach ($sets as $set) {
            $page = 1;
            $allcards = []; // Array para acumular todas las cartas

            do {
                $response = Http::withoutVerifying()->timeout(600)->get('https://api.pokemontcg.io/v2/cards', [
                    'q' => 'set.id:' . $set->id_set,
                    'page' => $page,
                    'pageSize' => 250
                ]);

                if (!$response->successful()) {
                    break;
                }

                $cards = $response->json()['data'];

                foreach ($cards as $card) {
                    $allcards[] = [
                        'id_card' => $card['id'],
                        'id_set' => $set->id,
                        'name' => $card['name'],
                        'image_small' => $card['images']['small'] ?? '',
                        'image_large' => $card['images']['large'] ?? '',
                        'description' => json_encode($card),
                        'deleted' => 0,
                        'created_at' => now(),
                        'updated_at' => now(),
                    ];
                }

                $hasMore = count($cards) === 250;
                $page++;
            } while ($hasMore);

            // Inserta todas las cartas del set actual en una sola operación
            DB::table('cards')->upsert($allcards, ['id_card'], [
                'id_set', 'name', 'image_small', 'image_large', 'description', 'deleted', 'updated_at'
            ]);
        }
    }
}
