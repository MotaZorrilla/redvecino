<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class UnitProfile extends Model
{
    use HasFactory;

    protected $fillable = [
        'property_id',
        'parking_spot',
        'license_plate',
        'observation',
    ];

    public function property()
    {
        return $this->belongsTo(Property::class);
    }

    public function members()
    {
        return $this->hasMany(UnitMember::class);
    }
}