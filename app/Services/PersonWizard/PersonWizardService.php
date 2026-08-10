<?php

namespace App\Services\PersonWizard;

use App\Models\User;
use App\Models\OwnerProfile;
use App\Models\ResidentProfile;
use App\Models\EmployeeProfile;
use App\Models\CommitteeProfile;
use App\Models\AdminProfile;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

final class PersonWizardService
{
    /**
     * Procesa la creación de un nuevo usuario y sus perfiles asociados.
     */
    public function createPerson(array $data): array
    {
        $name = trim($data['nombres'] . ' ' . $data['apellidos']);
        $username = $data['username'] ?? Str::slug($name, '.');
        $password = $data['password'] ?? Str::random(12);

        $user = User::create([
            'name' => $username,
            'rut' => $data['rut'],
            'email' => $data['email'],
            'phone' => $data['telefono'] ?? '',
            'password' => Hash::make($password),
        ]);

        // Asignar roles vía Spatie
        foreach ($data['roles'] as $role) {
            $user->assignRole($role);
        }

        // Crear perfiles según los roles seleccionados
        $this->createRoleProfiles($user, $data);

        // Crear relaciones de propiedad si se seleccionó asociar
        $this->createPropertyRelations($user, $data);

        return [
            'id' => $user->id,
            'name' => $name,
            'rut' => $user->rut,
            'email' => $user->email,
            'phone' => $user->phone,
            'status' => 'active',
            'roles' => $data['roles'],
            'created_at' => $user->created_at,
        ];
    }

    private function createRoleProfiles(User $user, array $data): void
    {
        $roles = $data['roles'] ?? [];

        if (in_array('colaborador', $roles)) {
            EmployeeProfile::create([
                'user_id' => $user->id,
                'position' => $data['cargo'] ?? 'Colaborador',
                'contract_type' => $data['tipoContrato'] ?? 'full_time',
                'shift' => $data['turno'] ?? 'morning',
                'salary' => (float) ($data['sueldoBase'] ?? 0),
                'hire_date' => $data['fechaIngreso'] ?? now(),
            ]);
        }

        if (in_array('comité', $roles)) {
            CommitteeProfile::create([
                'user_id' => $user->id,
                'position' => $data['comiteCargo'] ?? 'vocal',
                'period_start' => $data['comiteFechaInicio'] ?? now(),
                'period_end' => isset($data['comiteFechaFin']) ? $data['comiteFechaFin'] : now()->addYear(),
                'permission_level' => 'read',
            ]);
        }

        if (in_array('admin', $roles)) {
            AdminProfile::create([
                'user_id' => $user->id,
                'access_level' => $data['adminTipo'] ?? 'full',
            ]);
        }
    }

    private function createPropertyRelations(User $user, array $data): void
    {
        $propertyId = $data['property_id'] ?? null;
        if (!($data['asociada'] ?? false) || !$propertyId) {
            return;
        }

        $relations = $data['relations'] ?? ['propietario'];

        if (in_array('propietario', $relations) || in_array('arrendatario', $relations)) {
            OwnerProfile::create([
                'user_id' => $user->id,
                'property_id' => $propertyId,
                'ownership_percentage' => (float) ($data['ownership_percentage'] ?? 100),
                'financial_status' => 'al_dia',
            ]);
        }

        if (in_array('residente', $relations) || in_array('familiar', $relations) || in_array('otro', $relations)) {
            ResidentProfile::create([
                'user_id' => $user->id,
                'property_id' => $propertyId,
                'resident_type' => $relations[0] ?? 'owner',
            ]);
        }
    }
}
