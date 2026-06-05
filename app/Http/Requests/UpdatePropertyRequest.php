<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class UpdatePropertyRequest extends FormRequest
{
    /**
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'type' => ['sometimes', 'string', 'in:house,apartment,parking,storage,commercial'],
            'number' => ['sometimes', 'string'],
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
