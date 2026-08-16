<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class FacilityRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $isUpdate = $this->isMethod('PUT') || $this->isMethod('PATCH');

        return [
            'condominium_id' => [$isUpdate ? 'sometimes' : 'required', 'exists:condominiums,id'],
            'name' => [$isUpdate ? 'sometimes' : 'required', 'string', 'max:255'],
            'type' => [$isUpdate ? 'sometimes' : 'required', 'string', 'in:quincho,salon_eventos,cancha,piscina,gimnasio,otro'],
            'capacity' => ['nullable', 'integer', 'min:0'],
            'fee' => ['nullable', 'numeric', 'min:0'],
        ];
    }
}
