<?php

namespace App\Policies;

use App\Models\Ticket;
use App\Models\User;

class TicketPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->can('create tickets') || $user->can('assign tickets') || $user->can('resolve tickets');
    }

    public function view(User $user, Ticket $model): bool
    {
        if ($user->can('assign tickets') || $user->can('resolve tickets')) {
            return true;
        }

        return $user->can('create tickets') && ($model->created_by === $user->id || $model->assigned_to === $user->id);
    }

    public function create(User $user): bool
    {
        return $user->can('create tickets');
    }

    public function update(User $user, Ticket $model): bool
    {
        if ($user->can('assign tickets') || $user->can('resolve tickets')) {
            return true;
        }

        return $user->can('create tickets') && $model->created_by === $user->id;
    }

    public function delete(User $user, Ticket $model): bool
    {
        return $user->can('assign tickets');
    }
}
