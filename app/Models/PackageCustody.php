<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class PackageCustody extends Model
{
    use HasFactory;

    protected $fillable = [
        'condominium_id',
        'property_id',
        'recipient_name',
        'carrier',
        'tracking_number',
        'photo_path',
        'notes',
        'status',
        'signature',
        'delivered_at',
    ];

    protected $casts = [
        'delivered_at' => 'datetime',
    ];

    public function condominium()
    {
        return $this->belongsTo(Condominium::class);
    }

    public function property()
    {
        return $this->belongsTo(Property::class);
    }
}
