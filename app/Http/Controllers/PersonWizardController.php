<?php

namespace App\Http\Controllers;

use App\Services\PersonWizard\PersonWizardService;
use Illuminate\Http\Request;

class PersonWizardController extends Controller
{
    public function store(Request $request, PersonWizardService $wizardService)
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
            // Employee fields (editables a mano)
            'cargo' => 'nullable|string',
            'area' => 'nullable|string',
            'fechaIngreso' => 'nullable|date',
            'tipoContrato' => 'nullable|string',
            'turno' => 'nullable|string',
            'sueldoBase' => 'nullable|numeric|min:0',
            'externo' => 'boolean',
            // Committee fields
            'comiteCargo' => 'nullable|string',
            'comitePeriodo' => 'nullable|string',
            'comiteFechaInicio' => 'nullable|date',
            'comiteFechaFin' => 'nullable|date',
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

        $result = $wizardService->createPerson($validated);

        return response()->json([
            'message' => 'Persona creada exitosamente',
            'user' => $result,
        ], 201);
    }
}
