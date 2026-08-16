<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CastUnitVoteRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    public function rules(): array
    {
        return [
            'property_id' => 'required|exists:properties,id',
            'assembly_voting_option_id' => 'required|exists:assembly_voting_options,id',
        ];
    }
}
