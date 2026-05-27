<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ExpenseItem extends Model
{
    protected $fillable = [
        'common_expense_id',
        'category',
        'description',
        'amount',
    ];

    public function commonExpense()
    {
        return $this->belongsTo(CommonExpense::class);
    }
}
