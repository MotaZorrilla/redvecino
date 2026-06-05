<?php

namespace App\Policies;

use App\Models\TiProfile;
use App\Models\User;

class TiProfilePolicy
{
    public function viewAny(User $user): bool
    {
        return $user->can('manage users');
    }

    public function view(User $user, TiProfile $model): bool
    {
        return $user->can('manage users') || $model->user_id === $user->id;
    }

    public function create(User $user): bool
    {
        return $user->can('manage users');
    }

    public function update(User $user, TiProfile $model): bool
    {
        return $user->can('manage users') || $model->user_id === $user->id;
    }

    public function delete(User $user, TiProfile $model): bool
    {
        return $user->can('manage users');
    }
}
