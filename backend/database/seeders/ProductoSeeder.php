<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ProductoSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $quantity_registered = rand(250, 1500);
        $users = DB::table('users')->pluck('id');
        $cards = DB::table('cards')->select('id', 'description')->get()->toArray();

        if (empty($users) || empty($cards)) {
            $this->command->error('Se necesitan usuarios y cartas para crear productos.');
            return;
        }

        shuffle($cards); // Mezclamos el array de cartas
        $productos = [];

        for ($i = 0; $i < $quantity_registered;$i++){

            $card = $cards[$i % count($cards)];
            $desc = json_decode($card->description, true);

            $lowPrices = collect($desc['tcgplayer']['prices'] ?? [])
            ->pluck('low')
            ->filter()
            ->values();

            $lowPrice = $lowPrices->first();

            $price = $lowPrice ? round($lowPrice * 1.2 , 2) : rand (5, 1000) /100;

            $productos[] = [
                'id_user' => $users->random(),
                'id_card' => $card->id,
                'quantity' => rand(1, 10),
                'price' => $price,
                'state' => rand(0, 4), // Calidad/Estado de la carta
                'created_at' => now(),
                'updated_at' => now()
            ];
        }

        DB::table('productos')->insert($productos);
    }
}
