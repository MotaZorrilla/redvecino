<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreUserRequest extends FormRequest
{
    /**
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'rut' => ['nullable', 'string', 'unique:users'],
            'email' => ['required', 'email', 'unique:users'],
            'phone' => ['nullable', 'string', 'max:20'],
            'password' => ['required', 'string', 'min:8'],
            'status' => ['nullable', 'string', 'in:active,inactive,suspended'],
        ];
    }

    public function authorize(): bool
    {
        return true;
    }
}
