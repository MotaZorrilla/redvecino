<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class QrInvitation extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'condominium_id',
        'visitor_name',
        'visitor_rut',
        'code',
        'scanned_count',
        'expires_at',
    ];

    protected $casts = [
        'expires_at' => 'datetime',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function condominium()
    {
        return $this->belongsTo(Condominium::class);
    }
}
