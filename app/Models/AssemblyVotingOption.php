<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AssemblyVotingOption extends Model
{
    use HasFactory;

    protected $fillable = [
        'assembly_voting_id',
        'title',
        'description',
    ];

    public function voting()
    {
        return $this->belongsTo(AssemblyVoting::class, 'assembly_voting_id');
    }

    public function votes()
    {
        return $this->hasMany(AssemblyUnitVote::class, 'assembly_voting_option_id');
    }
}
