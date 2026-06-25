<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class AddressSeeder extends Seeder
{
    public function run(): void
    {
        // Asegúrate de que existan usuarios con esos IDs
        DB::table('addresses')->insert([
            [
                'address' => '123 Main St',
                'number' => 'A1',
                'id_user' => 1,
                'deleted' => 0,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'address' => '456 Elm St',
                'number' => 'B2',
                'id_user' => 2,
                'deleted' => 0,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'address' => '789 Oak St',
                'number' => 'C3',
                'id_user' => 1,
                'deleted' => 0,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
