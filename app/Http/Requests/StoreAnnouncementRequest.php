<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreAnnouncementRequest extends FormRequest
{
    /**
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'condominium_id' => ['required', 'exists:condominiums,id'],
            'created_by' => ['required', 'exists:users,id'],
            'title' => ['required', 'string', 'max:255'],
            'content' => ['required', 'string'],
            'priority' => ['nullable', 'string', 'in:normal,important,urgent'],
            'published_at' => ['nullable', 'date'],
            'expires_at' => ['nullable', 'date'],
        ];
    }

    public function authorize(): bool
    {
        return true;
    }
}
