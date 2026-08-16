<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class AssemblyVotingRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    public function rules(): array
    {
        return [
            'condominium_id' => 'required|exists:condominiums,id',
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'quorum_required_percent' => 'nullable|numeric|min:1|max:100',
            'options' => 'required|array|min:2',
            'options.*.title' => 'required|string|max:100',
            'options.*.description' => 'nullable|string|max:255',
        ];
    }
}
