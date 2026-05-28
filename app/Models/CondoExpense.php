<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class CondoExpense extends Model
{
    use HasFactory;

    protected $fillable = [
        'condominium_id',
        'category',
        'subcategory',
        'amount',
        'date',
        'description',
        'property_id',
        'user_id',
        'common_expense_id',
        'expense_item_id',
    ];

    protected $casts = [
        'date' => 'date',
        'amount' => 'decimal:2',
    ];

    public function condominium()
    {
        return $this->belongsTo(Condominium::class);
    }

    public function property()
    {
        return $this->belongsTo(Property::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function commonExpense()
    {
        return $this->belongsTo(CommonExpense::class);
    }

    public function expenseItem()
    {
        return $this->belongsTo(ExpenseItem::class);
    }
}
