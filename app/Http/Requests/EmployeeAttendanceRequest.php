<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class EmployeeAttendanceRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    public function rules(): array
    {
        return [
            'condominium_id' => 'required|exists:condominiums,id',
            'employee_profile_id' => 'required|exists:employee_profiles,id',
            'date' => 'sometimes|date',
            'notes' => 'nullable|string|max:500',
        ];
    }
}
