<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\AdminProfile;

class AdministratorProfileSeeder extends Seeder
{
    public function run(): void
    {
        $adminUser = User::whereHas('roles', fn($q) => $q->where('name', 'Administrador'))->first();
        if (!$adminUser) return;

        AdminProfile::updateOrCreate(
            ['user_id' => $adminUser->id],
            [
                'access_level' => 'full',
            ]
        );
    }
}
