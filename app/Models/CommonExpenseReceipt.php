<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CommonExpenseReceipt extends Model
{
    use HasFactory;

    protected $table = 'common_expense_receipts';

    protected $fillable = [
        'period_id',
        'condominium_id',
        'property_id',
        'alicuota_pct',
        'base_amount',
        'reserve_fund_amount',
        'individual_consumption',
        'previous_balance',
        'interest_amount',
        'total_amount',
        'due_date',
        'status',
        'paid_at',
    ];

    protected $casts = [
        'alicuota_pct' => 'decimal:6',
        'base_amount' => 'decimal:2',
        'reserve_fund_amount' => 'decimal:2',
        'individual_consumption' => 'decimal:2',
        'previous_balance' => 'decimal:2',
        'interest_amount' => 'decimal:2',
        'total_amount' => 'decimal:2',
        'due_date' => 'date',
        'paid_at' => 'datetime',
    ];

    public function period()
    {
        return $this->belongsTo(CommonExpensePeriod::class, 'period_id');
    }

    public function condominium()
    {
        return $this->belongsTo(Condominium::class);
    }

    public function property()
    {
        return $this->belongsTo(Property::class);
    }
}
