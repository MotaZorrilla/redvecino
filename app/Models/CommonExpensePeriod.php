<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CommonExpensePeriod extends Model
{
    use HasFactory;

    protected $table = 'common_expense_periods';

    protected $fillable = [
        'condominium_id',
        'period',
        'status',
        'total_expenses',
        'reserve_fund_pct',
        'due_date',
        'created_by',
    ];

    protected $casts = [
        'total_expenses' => 'decimal:2',
        'reserve_fund_pct' => 'decimal:2',
        'due_date' => 'date',
    ];

    public function condominium()
    {
        return $this->belongsTo(Condominium::class);
    }

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function receipts()
    {
        return $this->hasMany(CommonExpenseReceipt::class, 'period_id');
    }
}
