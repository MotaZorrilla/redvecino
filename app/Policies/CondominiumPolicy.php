<?php

namespace App\Policies;

use App\Models\Condominium;
use App\Models\User;

class CondominiumPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->can('view financial reports');
    }

    public function view(User $user, Condominium $model): bool
    {
        return $user->can('view financial reports');
    }

    public function create(User $user): bool
    {
        return $user->can('approve expenses');
    }

    public function update(User $user, Condominium $model): bool
    {
        return $user->can('approve expenses');
    }

    public function delete(User $user, Condominium $model): bool
    {
        return $user->can('approve expenses');
    }
}
