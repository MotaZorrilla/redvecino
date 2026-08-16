<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class SupplyOrder extends Model
{
    use HasFactory;

    protected $fillable = [
        'condominium_id',
        'employee_profile_id',
        'description',
        'quantity',
        'unit',
        'category',
        'notes',
        'status',
        'purchase_document',
        'condo_expense_id',
    ];

    public function condominium()
    {
        return $this->belongsTo(Condominium::class);
    }

    public function employeeProfile()
    {
        return $this->belongsTo(EmployeeProfile::class);
    }

    public function condoExpense()
    {
        return $this->belongsTo(CondoExpense::class, 'condo_expense_id');
    }
}