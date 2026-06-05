<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class UpdateExpenseRequest extends FormRequest
{
    /**
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'condominium_id' => ['sometimes', 'exists:condominiums,id'],
            'period' => ['sometimes', 'string'],
            'amount' => ['sometimes', 'numeric'],
            'description' => ['nullable', 'string'],
            'due_date' => ['sometimes', 'date'],
            'items' => ['nullable', 'array'],
            'items.*.category' => ['required_with:items', 'string'],
            'items.*.description' => ['nullable', 'string'],
            'items.*.amount' => ['required_with:items', 'numeric'],
        ];
    }

    public function authorize(): bool
    {
        return true;
    }
}
