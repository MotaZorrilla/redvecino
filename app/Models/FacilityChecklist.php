<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FacilityChecklist extends Model
{
    use HasFactory;

    protected $fillable = [
        'condominium_id',
        'booking_id',
        'facility_name',
        'type',
        'inspected_by',
        'received_by',
        'status',
        'items_status',
        'evidence_photos',
        'deposit_action',
        'deposit_deduction_amount',
        'notes',
    ];

    protected function casts(): array
    {
        return [
            'items_status' => 'array',
            'evidence_photos' => 'array',
            'deposit_deduction_amount' => 'decimal:2',
        ];
    }

    public function condominium()
    {
        return $this->belongsTo(Condominium::class);
    }

    public function booking()
    {
        return $this->belongsTo(Booking::class);
    }

    public function inspector()
    {
        return $this->belongsTo(User::class, 'inspected_by');
    }

    public function receiver()
    {
        return $this->belongsTo(User::class, 'received_by');
    }
}
