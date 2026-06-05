<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class ResidentProfile extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'property_id',
        'resident_type',
        'relationship',
        'lease_start',
        'lease_end',
    ];

    protected function casts(): array
    {
        return [
            'lease_start' => 'date',
            'lease_end' => 'date',
        ];
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function property()
    {
        return $this->belongsTo(Property::class);
    }
}
