<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class ExpenseItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'common_expense_id',
        'category',
        'description',
        'amount',
    ];

    protected function casts(): array
    {
        return [
            'amount' => 'decimal:2',
        ];
    }

    public function commonExpense()
    {
        return $this->belongsTo(CommonExpense::class);
    }
}
