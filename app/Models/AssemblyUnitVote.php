<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AssemblyUnitVote extends Model
{
    use HasFactory;

    protected $fillable = [
        'assembly_voting_id',
        'property_id',
        'user_id',
        'assembly_voting_option_id',
        'coefficient_weight',
    ];

    protected function casts(): array
    {
        return [
            'coefficient_weight' => 'float',
        ];
    }

    public function voting()
    {
        return $this->belongsTo(AssemblyVoting::class, 'assembly_voting_id');
    }

    public function property()
    {
        return $this->belongsTo(Property::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function option()
    {
        return $this->belongsTo(AssemblyVotingOption::class, 'assembly_voting_option_id');
    }
}
