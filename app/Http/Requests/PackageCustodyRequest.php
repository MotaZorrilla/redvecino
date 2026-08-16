<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class PackageCustodyRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    public function rules(): array
    {
        return [
            'condominium_id' => 'required|exists:condominiums,id',
            'property_id' => 'required|exists:properties,id',
            'recipient_name' => 'required|string|max:255',
            'carrier' => 'nullable|string|max:100', // Chilexpress, Starken, Blue Express, MercadoLibre, etc.
            'tracking_number' => 'nullable|string|max:100',
            'notes' => 'nullable|string|max:1000',
            'photo' => 'nullable|file|max:5120',
        ];
    }

    public function messages(): array
    {
        return [
            'condominium_id.required' => 'El condominio es obligatorio.',
            'property_id.required' => 'La unidad de destino es obligatoria.',
            'recipient_name.required' => 'El nombre del destinatario es obligatorio.',
        ];
    }
}
