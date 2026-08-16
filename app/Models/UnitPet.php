<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UnitPet extends Model
{
    use HasFactory;

    protected $fillable = [
        'property_id',
        'name',
        'species',
        'breed',
        'chip_number',
        'medical_record_path',
        'is_vaccinated',
        'last_vaccine_date',
    ];

    protected function casts(): array
    {
        return [
            'is_vaccinated' => 'boolean',
            'last_vaccine_date' => 'date',
        ];
    }

    public function property()
    {
        return $this->belongsTo(Property::class);
    }
}
