<?php

namespace Database\Seeders;

use App\Models\AssemblyUnitVote;
use App\Models\AssemblyVoting;
use App\Models\AssemblyVotingOption;
use App\Models\Condominium;
use App\Models\Property;
use App\Models\User;
use App\Services\UnitCoefficientResolver;
use Illuminate\Database\Seeder;

class AssemblyVotingsSeeder extends Seeder
{
    public function run(): void
    {
        $condo = Condominium::first();
        if (!$condo) {
            return;
        }

        $admin = User::whereHas('roles', fn ($q) => $q->where('name', 'Administrador'))->first();

        // 1. Votación de Asambleas Ordinaria: Aprobación Presupuesto Anual
        $voting1 = AssemblyVoting::updateOrCreate(
            ['condominium_id' => $condo->id, 'title' => 'Aprobación Presupuesto Operacional 2026-2027'],
            [
                'description' => 'Aprobación del presupuesto de mantención, seguridad y mejoras de áreas verdes.',
                'quorum_required_percent' => 50.0,
                'status' => 'open',
                'created_by' => $admin?->id,
                'starts_at' => now()->subDays(2),
                'ends_at' => now()->addDays(5),
            ]
        );

        $optA = AssemblyVotingOption::firstOrCreate([
            'assembly_voting_id' => $voting1->id,
            'title' => 'Aprobar Presupuesto Propuesto ($12.500.000)',
        ]);

        $optB = AssemblyVotingOption::firstOrCreate([
            'assembly_voting_id' => $voting1->id,
            'title' => 'Rechazar y Solicitar Ajuste a la Administración',
        ]);

        // Simular votos de las primeras propiedades
        $properties = Property::where('condominium_id', $condo->id)->take(4)->get();
        foreach ($properties as $idx => $property) {
            $user = $property->residents()->first() ?? $admin;
            $selectedOpt = ($idx % 2 === 0) ? $optA : $optB;
            $weight = UnitCoefficientResolver::resolve($property);

            AssemblyUnitVote::updateOrCreate(
                [
                    'assembly_voting_id' => $voting1->id,
                    'property_id' => $property->id,
                ],
                [
                    'user_id' => $user?->id ?? 1,
                    'assembly_voting_option_id' => $selectedOpt->id,
                    'coefficient_weight' => $weight,
                ]
            );
        }
    }
}
