<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Lead;



class LeadSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $user = User::where('role', 'manager')
            ->first();

        Lead::create([
            'full_name' => 'Ivan Ivannov',
            'phone' => '+7 (981) 967-87-55',
            'email'=> 'ivan@gmail.com',
            'event_id'=> 1,
            'company'=> 'Yandex',
            'position'=> 'position1',
            'user_id' => $user->id,
        ]);
        Lead::create([
            'full_name' => 'Nana Banana',
            'phone' => '+7 (981) 977-77-55',
            'email'=> 'nana@gmail.com',
            'event_id'=> 1,
            'company'=> 'StreamTelecom',
            'position'=> 'position1',
            'user_id' => $user->id,
        ]);
        Lead::create([
            'full_name' => 'Bebra Bebrovna',
            'phone' => '+7 (981) 966-66-55',
            'email'=> 'bebra@gmail.com',
            'event_id'=> 1,
            'company'=> 'Babracom',
            'position'=> 'position1',
            'user_id' => $user->id,
        ]);


    }
}
