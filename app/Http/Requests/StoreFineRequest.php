<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreFineRequest extends FormRequest
{
    /**
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'user_id' => ['required', 'exists:users,id'],
            'property_id' => ['required', 'exists:properties,id'],
            'reason' => ['required', 'string'],
            'amount' => ['required', 'numeric'],
            'issued_date' => ['required', 'date'],
            'due_date' => ['required', 'date'],
        ];
    }

    public function authorize(): bool
    {
        return true;
    }
}
