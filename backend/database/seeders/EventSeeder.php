<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Event;


class EventSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Event::create([
            'name' => 'Tech Conference',
            'event_date' => now(),
            'end_date' => now()->addDay(),

        ]);

        Event::create([
            'name' => 'Business Forum',
            'event_date' => now(),
            'end_date' => now()->addDay(),
        ]);
    }
}
