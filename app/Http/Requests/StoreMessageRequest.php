<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreMessageRequest extends FormRequest
{
    /**
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'receiver_id' => ['required', 'exists:users,id'],
            'subject' => ['required', 'string', 'max:255'],
            'content' => ['required', 'string'],
        ];
    }

    public function authorize(): bool
    {
        return true;
    }
}
