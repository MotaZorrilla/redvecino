<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class FineRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $isUpdate = $this->isMethod('PUT') || $this->isMethod('PATCH');

        return [
            'user_id' => [$isUpdate ? 'sometimes' : 'required', 'exists:users,id'],
            'property_id' => [$isUpdate ? 'sometimes' : 'required', 'exists:properties,id'],
            'reason' => [$isUpdate ? 'sometimes' : 'required', 'string'],
            'amount' => [$isUpdate ? 'sometimes' : 'required', 'numeric', 'min:0'],
            'issued_date' => [$isUpdate ? 'sometimes' : 'required', 'date'],
            'due_date' => [$isUpdate ? 'sometimes' : 'required', 'date'],
            'evidences' => ['nullable', 'array', 'max:3'],
            'evidences.*' => ['file', 'mimes:jpg,jpeg,png,webp', 'max:5120'],
        ];
    }
}
