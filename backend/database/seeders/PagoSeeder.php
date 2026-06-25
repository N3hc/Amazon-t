<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Faker\Factory as Faker;
use Carbon\Carbon;

class PagoSeeder extends Seeder
{
    public function run(): void
    {
        $faker = Faker::create();

        $pagos = [];

        for ($i = 0; $i < 10; $i++) {
            $pagos[] = [
                'user_id' => $faker->numberBetween(1, 3), // Ajusta según usuarios existentes
                'name' => $faker->name(),
                'number' => $faker->creditcardNumber(),
                'expiration_date' => $faker->dateTimeBetween('now', '+5 years')->format('Y-m-d'),
                'cvv' => $faker->numberBetween(100, 999),
                'deleted' => 0,
                'created_at' => now(),
                'updated_at' => now(),
            ];
        }

        DB::table('pagos')->insert($pagos);
    }
}
