<?php

namespace App\Policies;

use App\Models\TicketCategory;
use App\Models\User;

class TicketCategoryPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->can('create tickets') || $user->can('assign tickets') || $user->can('resolve tickets');
    }

    public function view(User $user, TicketCategory $model): bool
    {
        return $user->can('create tickets') || $user->can('assign tickets') || $user->can('resolve tickets');
    }

    public function create(User $user): bool
    {
        return $user->can('assign tickets');
    }

    public function update(User $user, TicketCategory $model): bool
    {
        return $user->can('assign tickets');
    }

    public function delete(User $user, TicketCategory $model): bool
    {
        return $user->can('assign tickets');
    }
}
