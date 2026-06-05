<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateUserRequest extends FormRequest
{
    /**
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => ['sometimes', 'string', 'max:255'],
            'rut' => ['nullable', 'string', Rule::unique('users')->ignore($this->route('id'))],
            'email' => ['sometimes', 'email', Rule::unique('users')->ignore($this->route('id'))],
            'phone' => ['nullable', 'string', 'max:20'],
            'password' => ['nullable', 'string', 'min:8'],
            'status' => ['nullable', 'string', 'in:active,inactive,suspended'],
        ];
    }

    public function authorize(): bool
    {
        return true;
    }
}
