<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class PaymentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'user_id' => ['required', 'exists:users,id'],
            'property_id' => ['required', 'exists:properties,id'],
            'common_expense_id' => ['required', 'exists:common_expenses,id'],
            'amount' => ['required', 'numeric', 'min:1'],
            'payment_date' => ['required', 'date'],
            'payment_method' => ['required', 'string', 'in:cash,transfer,card,check'],
            'reference' => ['nullable', 'string', 'max:255'],
            'waive_late_fee' => ['nullable', 'boolean'],
            'waive_reason' => ['nullable', 'string', 'max:255'],
        ];
    }
}
