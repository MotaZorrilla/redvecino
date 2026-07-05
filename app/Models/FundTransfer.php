<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class FundTransfer extends Model
{
    protected $fillable = [
        'condominium_id',
        'user_id',
        'amount',
        'source_fund',
        'destination_fund',
        'committee_approved',
    ];

    public function condominium()
    {
        return $this->belongsTo(Condominium::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
