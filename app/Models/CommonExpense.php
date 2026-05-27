<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class CommonExpense extends Model
{
    use HasFactory;
    protected $fillable = [
        'condominium_id',
        'period',
        'amount',
        'description',
        'due_date',
        'status',
    ];

    public function condominium()
    {
        return $this->belongsTo(Condominium::class);
    }

    public function items()
    {
        return $this->hasMany(ExpenseItem::class);
    }

    public function payments()
    {
        return $this->hasMany(Payment::class);
    }
}
