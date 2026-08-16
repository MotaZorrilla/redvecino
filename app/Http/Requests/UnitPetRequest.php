<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UnitPetRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    public function rules(): array
    {
        return [
            'property_id' => 'required|exists:properties,id',
            'name' => 'required|string|max:100',
            'species' => 'required|string|in:perro,gato,ave,otro',
            'breed' => 'nullable|string|max:100',
            'chip_number' => 'nullable|string|max:20',
            'medical_record' => 'nullable|file|mimes:pdf,jpg,jpeg,png|max:5120',
            'is_vaccinated' => 'sometimes|boolean',
            'last_vaccine_date' => 'nullable|date',
        ];
    }

    public function messages(): array
    {
        return [
            'property_id.required' => 'La unidad es obligatoria.',
            'name.required' => 'El nombre de la mascota es obligatorio.',
            'species.required' => 'La especie es obligatoria.',
            'medical_record.mimes' => 'El carnet veterinario debe ser un archivo PDF o imagen.',
        ];
    }
}
