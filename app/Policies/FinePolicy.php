<?php

namespace App\Policies;

use App\Models\Fine;
use App\Models\User;

class FinePolicy
{
    public function viewAny(User $user): bool
    {
        return $user->can('view financial reports');
    }

    public function view(User $user, Fine $model): bool
    {
        return $user->can('view financial reports') || $model->user_id === $user->id;
    }

    public function create(User $user): bool
    {
        return $user->can('approve expenses');
    }

    public function update(User $user, Fine $model): bool
    {
        return $user->can('approve expenses');
    }

    public function delete(User $user, Fine $model): bool
    {
        return $user->can('approve expenses');
    }
}
