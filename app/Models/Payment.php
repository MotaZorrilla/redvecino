<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

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
    ];

    protected function casts(): array
    {
        return [
            'payment_date' => 'date',
        ];
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
