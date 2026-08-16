<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Carbon\Carbon;

class Payment extends Model
{
    use HasFactory;
    protected $fillable = [
        'user_id',
        'property_id',
        'common_expense_id',
        'amount',
        'payment_date',
        'payment_method',
        'reference',
        'status',
        'waive_late_fee',
        'waive_reason',
    ];

    protected function casts(): array
    {
        return [
            'payment_date' => 'date',
            'waive_late_fee' => 'boolean',
        ];
    }

    protected static function booted(): void
    {
        static::creating(function (self $payment) {
            if ($payment->payment_date) {
                $parsed = Carbon::parse($payment->payment_date);
                $payment->created_at = $parsed;
                $payment->updated_at = $parsed;
            }
        });
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function property()
    {
        return $this->belongsTo(Property::class);
    }

    public function commonExpense()
    {
        return $this->belongsTo(CommonExpense::class);
    }
}
