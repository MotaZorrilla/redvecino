<?php

namespace App\Http\Requests;

use App\Models\EmployeeProfile;
use Illuminate\Foundation\Http\FormRequest;

class SupplyOrderRequest extends FormRequest
{
    public function authorize(): bool
    {
        $user = $this->user();
        if (!$user) {
            return false;
        }

        return $user->hasAnyRole(['Administrador', 'TI', 'Colaborador', 'Comité']);
    }

    public function rules(): array
    {
        return [
            'condominium_id' => 'required|exists:condominiums,id',
            'employee_profile_id' => [
                'nullable',
                'exists:employee_profiles,id',
                function ($attribute, $value, $fail) {
                    if ($value) {
                        $emp = EmployeeProfile::find($value);
                        if ($emp && !$emp->allow_supplies) {
                            $fail('El colaborador no tiene permisos habilitados para solicitar insumos.');
                        }
                    }
                },
            ],
            'description' => 'required|string|max:255',
            'quantity' => 'required|integer|min:1',
            'unit' => 'nullable|string|max:50',
            'category' => 'nullable|string|max:50',
            'notes' => 'nullable|string|max:1000',
        ];
    }

    public function messages(): array
    {
        return [
            'condominium_id.required' => 'El condominio es obligatorio.',
            'description.required' => 'La descripción del insumo es obligatoria.',
            'quantity.required' => 'La cantidad es obligatoria.',
            'quantity.min' => 'La cantidad debe ser al menos 1.',
        ];
    }
}
