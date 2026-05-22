<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::create([
            'name' => 'Admin',
            'email' => 'admin@test.com',
            'phone' => '123456789',
            'password' => 'password',
            'role' => 'admin',
        ]);
        User::create([
            'name' => 'Manager',
            'email' => 'manager@test.com',
            'phone' => '987654321',
            'password' => 'password',
            'role' => 'manager',
        ]);
    }
}
