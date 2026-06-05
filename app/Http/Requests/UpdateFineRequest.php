<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class UpdateFineRequest extends FormRequest
{
    /**
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'user_id' => ['sometimes', 'exists:users,id'],
            'property_id' => ['sometimes', 'exists:properties,id'],
            'reason' => ['sometimes', 'string'],
            'amount' => ['sometimes', 'numeric'],
            'issued_date' => ['sometimes', 'date'],
            'due_date' => ['sometimes', 'date'],
        ];
    }

    public function authorize(): bool
    {
        return true;
    }
}
