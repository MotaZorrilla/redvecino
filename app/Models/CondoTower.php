<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class CondoTower extends Model
{
    use HasFactory;

    protected $fillable = [
        'condominium_id',
        'name',
        'has_water_meter',
        'has_electricity_meter',
    ];

    protected function casts(): array
    {
        return [
            'has_water_meter' => 'boolean',
            'has_electricity_meter' => 'boolean',
        ];
    }

    public function condominium()
    {
        return $this->belongsTo(Condominium::class);
    }

    public function properties()
    {
        return $this->hasMany(Property::class, 'tower_id');
    }
}
