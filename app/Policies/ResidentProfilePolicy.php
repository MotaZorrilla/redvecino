<?php

namespace App\Policies;

use App\Models\ResidentProfile;
use App\Models\User;

class ResidentProfilePolicy
{
    public function viewAny(User $user): bool
    {
        return $user->can('manage users');
    }

    public function view(User $user, ResidentProfile $model): bool
    {
        return $user->can('manage users') || $model->user_id === $user->id;
    }

    public function create(User $user): bool
    {
        return $user->can('manage users');
    }

    public function update(User $user, ResidentProfile $model): bool
    {
        return $user->can('manage users') || $model->user_id === $user->id;
    }

    public function delete(User $user, ResidentProfile $model): bool
    {
        return $user->can('manage users');
    }
}
