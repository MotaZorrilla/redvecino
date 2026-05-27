<?php

namespace App\Http\Controllers;

use App\Models\Ticket;
use Illuminate\Http\Request;

class TicketController extends Controller
{
    public function index()
    {
        $user = auth()->user();
        $query = Ticket::with(['property', 'creator', 'assignee', 'category', 'attachments']);

        if ($user && !$user->hasAnyPermission(['assign tickets', 'resolve tickets', 'view logs'])) {
            $query->where(function($q) use ($user) {
                $q->where('created_by', $user->id)
                  ->orWhereHas('property.residents', function($rq) use ($user) {
                      $rq->where('user_id', $user->id);
                  })
                  ->orWhereHas('property.owners', function($oq) use ($user) {
                      $oq->where('user_id', $user->id);
                  });
            });
        }

        return $query->paginate(20);
    }

    public function show($id)
    {
        $ticket = Ticket::with(['property', 'creator', 'assignee', 'category', 'attachments.uploader'])->findOrFail($id);
        $user = auth()->user();

        if ($user && !$user->hasAnyPermission(['assign tickets', 'resolve tickets', 'view logs'])) {
            $isCreator = $ticket->created_by === $user->id;
            $isResident = $ticket->property && $ticket->property->residents()->where('user_id', $user->id)->exists();
            $isOwner = $ticket->property && $ticket->property->owners()->where('user_id', $user->id)->exists();

            if (!$isCreator && !$isResident && !$isOwner) {
                abort(403, 'No tienes permiso para ver este ticket.');
            }
        }

        return $ticket;
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'property_id' => 'required|exists:properties,id',
            'created_by' => 'required|exists:users,id',
            'category_id' => 'required|exists:ticket_categories,id',
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'priority' => 'nullable|string|in:low,medium,high,urgent',
        ]);

        return Ticket::create($data)->load(['category', 'creator']);
    }

    public function update(Request $request, $id)
    {
        $ticket = Ticket::findOrFail($id);
        $data = $request->validate([
            'title' => 'sometimes|string|max:255',
            'description' => 'sometimes|string',
            'priority' => 'nullable|string|in:low,medium,high,urgent',
            'status' => 'nullable|string|in:open,in_progress,resolved,closed,cancelled',
        ]);

        $ticket->update($data);
        return $ticket;
    }

    public function assign(Request $request, $id)
    {
        $ticket = Ticket::findOrFail($id);
        $data = $request->validate([
            'assigned_to' => 'required|exists:users,id',
        ]);

        $ticket->update($data);
        return $ticket->load('assignee');
    }

    public function resolve(Request $request, $id)
    {
        $ticket = Ticket::findOrFail($id);
        $data = $request->validate([
            'resolution_notes' => 'required|string',
        ]);

        $ticket->update([
            'status' => 'resolved',
            'resolved_at' => now(),
            'resolution_notes' => $data['resolution_notes'],
        ]);

        return $ticket;
    }
}
