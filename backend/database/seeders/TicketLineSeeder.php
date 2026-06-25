<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class TicketLineSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('Ticket_lines')->insert([
            [
                'id_Ticket' => 1,
                'id_producto' => 1,
                'quantity' => 2,
                'price' => 5.00,
                'deleted' => 0,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id_Ticket' => 1,
                'id_producto' => 2,
                'quantity' => 1,
                'price' => 5.50,
                'deleted' => 0,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id_Ticket' => 2,
                'id_producto' => 3,
                'quantity' => 4,
                'price' => 10.00,
                'deleted' => 0,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
