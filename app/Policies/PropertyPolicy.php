<?php

namespace App\Policies;

use App\Models\Property;
use App\Models\User;

class PropertyPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->can('configure system');
    }

    public function view(User $user, Property $model): bool
    {
        return $user->can('configure system');
    }

    public function create(User $user): bool
    {
        return $user->can('configure system');
    }

    public function update(User $user, Property $model): bool
    {
        return $user->can('configure system');
    }

    public function delete(User $user, Property $model): bool
    {
        return $user->can('configure system');
    }
}
