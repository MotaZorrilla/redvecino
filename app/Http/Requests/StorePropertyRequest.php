<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StorePropertyRequest extends FormRequest
{
    /**
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'condominium_id' => ['required', 'exists:condominiums,id'],
            'type' => ['required', 'string', 'in:house,apartment,parking,storage,commercial'],
            'number' => ['required', 'string'],
            'block' => ['nullable', 'string'],
            'floor' => ['nullable', 'integer'],
            'area_sqm' => ['nullable', 'numeric'],
            'status' => ['nullable', 'string', 'in:occupied,vacant,maintenance'],
        ];
    }

    public function authorize(): bool
    {
        return true;
    }
}
