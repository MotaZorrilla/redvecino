<?php

namespace App\Policies;

use App\Models\TicketAttachment;
use App\Models\User;

class TicketAttachmentPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->can('create tickets') || $user->can('assign tickets') || $user->can('resolve tickets');
    }

    public function view(User $user, TicketAttachment $model): bool
    {
        if ($user->can('assign tickets') || $user->can('resolve tickets')) {
            return true;
        }

        return $user->can('create tickets') && $model->uploaded_by === $user->id;
    }

    public function create(User $user): bool
    {
        return $user->can('create tickets');
    }

    public function update(User $user, TicketAttachment $model): bool
    {
        if ($user->can('assign tickets') || $user->can('resolve tickets')) {
            return true;
        }

        return $user->can('create tickets') && $model->uploaded_by === $user->id;
    }

    public function delete(User $user, TicketAttachment $model): bool
    {
        if ($user->can('assign tickets')) {
            return true;
        }

        return $user->can('create tickets') && $model->uploaded_by === $user->id;
    }
}
