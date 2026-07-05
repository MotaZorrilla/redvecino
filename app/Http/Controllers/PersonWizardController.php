<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\OwnerProfile;
use App\Models\ResidentProfile;
use App\Models\EmployeeProfile;
use App\Models\CommitteeProfile;
use App\Models\AdminProfile;
use App\Models\TiProfile;
use App\Models\Property;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class PersonWizardController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'nombres' => 'required|string|max:255',
            'apellidos' => 'required|string|max:255',
            'rut' => 'required|string|unique:users,rut',
            'email' => 'required|email|unique:users,email',
            'telefono' => 'nullable|string|max:20',
            'hasAccess' => 'boolean',
            'username' => 'nullable|string|max:255|unique:users,name',
            'password' => 'nullable|string|min:6',
            'sendEmail' => 'boolean',
            'roles' => 'required|array',
            'roles.*' => 'string|in:colaborador,comité,admin,proveedor,resident',
            'asociada' => 'boolean',
            'property_id' => 'nullable|exists:properties,id',
            'relations' => 'nullable|array',
            'relations.*' => 'string',
            // Employee fields
            'cargo' => 'nullable|string',
            'area' => 'nullable|string',
            'fechaIngreso' => 'nullable|date',
            'tipoContrato' => 'nullable|string',
            'externo' => 'boolean',
            // Committee fields
            'comiteCargo' => 'nullable|string',
            'comitePeriodo' => 'nullable|string',
            'comiteFechaInicio' => 'nullable|date',
            // Admin fields
            'adminTipo' => 'nullable|string',
            'adminRpa' => 'nullable|string',
            'adminFechaContrato' => 'nullable|date',
            // Provider fields
            'provEmpresa' => 'nullable|string',
            'provRut' => 'nullable|string',
            'provRubro' => 'nullable|string',
            // Condominium
            'condominium_id' => 'nullable|exists:condominiums,id',
        ]);

        $name = trim($validated['nombres'] . ' ' . $validated['apellidos']);
        $username = $validated['username'] ?? Str::slug($name, '.');
        $password = $validated['password'] ?? Str::random(12);

        $user = User::create([
            'name' => $username,
            'rut' => $validated['rut'],
            'email' => $validated['email'],
            'phone' => $validated['telefono'] ?? '',
            'password' => Hash::make($password),
        ]);

        // Assign roles via Spatie
        foreach ($validated['roles'] as $role) {
            $user->assignRole($role);
        }

        // Create profile based on role
        $propertyId = $validated['property_id'] ?? null;

        if (in_array('colaborador', $validated['roles'])) {
            EmployeeProfile::create([
                'user_id' => $user->id,
                'position' => $validated['cargo'] ?? 'Colaborador',
                'contract_type' => $validated['tipoContrato'] ?? 'full_time',
                'shift' => 'morning',
                'salary' => 0,
                'hire_date' => $validated['fechaIngreso'] ?? now(),
            ]);
        }

        if (in_array('comité', $validated['roles'])) {
            CommitteeProfile::create([
                'user_id' => $user->id,
                'position' => $validated['comiteCargo'] ?? 'vocal',
                'period_start' => $validated['comiteFechaInicio'] ?? now(),
                'period_end' => now()->addYear(),
                'permission_level' => 'read',
            ]);
        }

        if (in_array('admin', $validated['roles'])) {
            AdminProfile::create([
                'user_id' => $user->id,
                'access_level' => $validated['adminTipo'] ?? 'full',
            ]);
        }

        // Create property relationship if associated
        if ($validated['asociada'] && $propertyId) {
            $relations = $validated['relations'] ?? ['propietario'];

            if (in_array('propietario', $relations) || in_array('arrendatario', $relations)) {
                OwnerProfile::create([
                    'user_id' => $user->id,
                    'property_id' => $propertyId,
                    'ownership_percentage' => 100,
                    'financial_status' => 'al_dia',
                ]);
            }

            if (in_array('residente', $relations) || in_array('familiar', $relations) || in_array('otro', $relations)) {
                ResidentProfile::create([
                    'user_id' => $user->id,
                    'property_id' => $propertyId,
                    'resident_type' => $validated['relations'][0] ?? 'owner',
                ]);
            }
        }

        return response()->json([
            'message' => 'Persona creada exitosamente',
            'user' => [
                'id' => $user->id,
                'name' => $name,
                'rut' => $user->rut,
                'email' => $user->email,
                'phone' => $user->phone,
                'status' => 'active',
                'roles' => $validated['roles'],
                'created_at' => $user->created_at,
            ],
        ], 201);
    }
}
