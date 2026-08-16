<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ExpenseRequest extends FormRequest
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
            'period' => [$isUpdate ? 'sometimes' : 'required', 'string'],
            'amount' => [$isUpdate ? 'sometimes' : 'required', 'numeric'],
            'description' => ['nullable', 'string'],
            'due_date' => [$isUpdate ? 'sometimes' : 'required', 'date'],
            'items' => ['nullable', 'array'],
            'items.*.category' => ['required_with:items', 'string'],
            'items.*.description' => ['nullable', 'string'],
            'items.*.amount' => ['required_with:items', 'numeric'],
        ];
    }
}
