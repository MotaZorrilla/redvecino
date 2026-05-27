<?php

namespace App\Http\Controllers;

use App\Models\Message;
use Illuminate\Http\Request;

class MessageController extends Controller
{
    public function index()
    {
        $userId = request()->user()->id;
        return Message::where('sender_id', $userId)
            ->orWhere('receiver_id', $userId)
            ->with(['sender', 'receiver'])
            ->orderBy('created_at', 'desc')
            ->paginate(20);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'receiver_id' => 'required|exists:users,id',
            'subject' => 'required|string|max:255',
            'content' => 'required|string',
        ]);

        $data['sender_id'] = $request->user()->id;

        return Message::create($data)->load(['sender', 'receiver']);
    }

    public function markAsRead($id)
    {
        $message = Message::findOrFail($id);
        
        if ($message->receiver_id !== auth()->id()) {
            abort(403, 'No puedes marcar como leido un mensaje dirigido a otro usuario.');
        }

        $message->update([
            'is_read' => true,
            'read_at' => now(),
        ]);
        return $message;
    }
}
