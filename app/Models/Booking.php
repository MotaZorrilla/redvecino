<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Booking extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'property_id',
        'condominium_id',
        'area_name',
        'booking_date',
        'time_slot',
        'status',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function property()
    {
        return $this->belongsTo(Property::class);
    }

    public function condominium()
    {
        return $this->belongsTo(Condominium::class);
    }
}
