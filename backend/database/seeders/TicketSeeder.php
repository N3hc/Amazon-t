<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class TicketSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('Tickets')->insert([
            [
                'id_user' => 1,
                'id_address' => 1,
                'total' => 15.50,
                'completed' => 0,
                'deleted' => 0,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id_user' => 2,
                'id_address' => 2,
                'total' => 40.00,
                'completed' => 1,
                'deleted' => 0,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
