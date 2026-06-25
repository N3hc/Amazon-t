<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class UsersSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $password = 12345678;
        DB::table('users')->insert([
            [
                'username' => 'Admin',
                'name' => 'Admin',
                'surname' => 'Admin',
                'email' => 'admin@admin.com',
                'password' => bcrypt($password),
                'role' => 1,
                'birth_date' => '01/01/01',
                'vendor' => '1',
                'gender' => '1',
            ],
            [
                'username' => 'Ardui',
                'name' => 'Ardui',
                'surname' => 'Pulido',
                'email' => 'ardui@admin.com',
                'password' => bcrypt($password),
                'role' => 1,
                'birth_date' => '01/01/01',
                'vendor' => '1',
                'gender' => '1',
            ],
            [
                'username' => 'ChenPing',
                'name' => 'Chenping',
                'surname' => 'Chenping',
                'email' => 'Chenping@admin.com',
                'password' => bcrypt($password),
                'role' => 1,
                'birth_date' => '01/01/01',
                'vendor' => '1',
                'gender' => '1',
            ],
            [
                'username' => 'Sandra',
                'name' => 'Sandra',
                'surname' => 'Sandra',
                'email' => 'Sandra@user.com',
                'password' => bcrypt($password),
                'role' => 0,
                'birth_date' => '01/01/01',
                'vendor' => '0',
                'gender' => '0',
            ]
        ]);
    }
}
