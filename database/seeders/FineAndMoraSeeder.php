<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Property;
use App\Models\User;
use App\Models\Fine;

class FineAndMoraSeeder extends Seeder
{
    public function run(): void
    {
        $property = Property::first();
        $user = User::first();
        if (!$property || !$user) return;

        Fine::firstOrCreate([
            'user_id' => $user->id,
            'property_id' => $property->id,
            'reason' => 'Ruidos molestos fuera de horario (fiesta)',
        ], [
            'amount' => 50000,
            'issued_date' => now()->subDays(10),
            'due_date' => now()->addDays(5),
            'status' => 'pending',
            'created_at' => now()->subDays(10),
        ]);

        Fine::firstOrCreate([
            'user_id' => $user->id,
            'property_id' => $property->id,
            'reason' => 'Uso indebido de estacionamiento de visitas',
        ], [
            'amount' => 25000,
            'issued_date' => now()->subDays(30),
            'due_date' => now()->subDays(15),
            'status' => 'paid',
            'created_at' => now()->subDays(30),
        ]);
    }
}
