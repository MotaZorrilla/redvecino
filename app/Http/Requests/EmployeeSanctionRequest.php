<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class EmployeeSanctionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    public function rules(): array
    {
        return [
            'condominium_id' => 'required|exists:condominiums,id',
            'employee_profile_id' => 'required|exists:employee_profiles,id',
            'date' => 'required|date',
            'time' => 'nullable|string|max:10',
            'reason' => 'required|string|max:255',
            'description' => 'required|string|max:2000',
            'document' => 'nullable|file|mimes:pdf,jpg,jpeg,png|max:10240',
        ];
    }

    public function messages(): array
    {
        return [
            'condominium_id.required' => 'El condominio es obligatorio.',
            'condominium_id.exists' => 'El condominio especificado no existe.',
            'employee_profile_id.required' => 'El colaborador es obligatorio.',
            'employee_profile_id.exists' => 'El colaborador especificado no existe.',
            'date.required' => 'La fecha de la amonestación es obligatoria.',
            'date.date' => 'La fecha de la amonestación no es válida.',
            'reason.required' => 'El motivo de la amonestación es obligatorio.',
            'description.required' => 'La descripción de los hechos es obligatoria.',
            'document.mimes' => 'El archivo de respaldo debe ser un documento PDF o imagen (JPG, PNG).',
            'document.max' => 'El archivo de respaldo no puede superar los 10 MB.',
        ];
    }
}
