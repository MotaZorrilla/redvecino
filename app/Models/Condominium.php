<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Condominium extends Model
{
    use HasFactory;
    protected $table = 'condominiums';

    protected $fillable = [
        'name',
        'address',
        'city',
        'region',
        'postal_code',
        'units_count',
        'status',
        'structure_locked',
        'due_day',
        'late_interest_rate',
    ];

    protected $casts = [
        'structure_locked' => 'boolean',
        'due_day' => 'integer',
        'late_interest_rate' => 'float',
    ];

    public function supplyOrders()
    {
        return $this->hasMany(SupplyOrder::class);
    }

    public function properties()
    {
        return $this->hasMany(Property::class);
    }

    public function commonExpenses()
    {
        return $this->hasMany(CommonExpense::class);
    }

    public function announcements()
    {
        return $this->hasMany(Announcement::class);
    }

    public function tickets()
    {
        return $this->hasManyThrough(Ticket::class, Property::class);
    }

    public function towers()
    {
        return $this->hasMany(CondoTower::class);
    }
}
