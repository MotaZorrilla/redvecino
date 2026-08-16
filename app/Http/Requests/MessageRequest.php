<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class MessageRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    public function rules(): array
    {
        return [
            'condominium_id' => 'required_without:receiver_id|exists:condominiums,id',
            'property_id' => 'nullable|exists:properties,id',
            'channel_type' => 'required_without:receiver_id|string|in:conserjeria_unidad,comite_privado,administracion_oficial,directo',
            'receiver_id' => 'nullable|exists:users,id',
            'subject' => 'nullable|string|max:255',
            'content' => 'required|string',
            'attachment' => 'nullable|file|mimes:jpg,jpeg,png,webp,pdf|max:5120',
        ];
    }

    public function messages(): array
    {
        return [
            'condominium_id.required_without' => 'El condominio es obligatorio.',
            'channel_type.required_without' => 'El tipo de canal es obligatorio.',
            'content.required' => 'El mensaje no puede estar vacío.',
        ];
    }
}
