<?php

namespace App\Http\Controllers;

use App\Http\Requests\MessageRequest;
use App\Models\Message;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class MessageController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $userId = $request->user()->id;
        $condoId = $request->query('condominium_id');
        $channelType = $request->query('channel_type');
        $propertyId = $request->query('property_id');

        $messages = Message::with(['sender', 'receiver', 'property'])
            ->when($condoId, fn ($q) => $q->where('condominium_id', $condoId))
            ->when($channelType, fn ($q) => $q->where('channel_type', $channelType))
            ->when($propertyId, fn ($q) => $q->where('property_id', $propertyId))
            ->when(!$channelType || $channelType === 'directo', function ($q) use ($userId) {
                $q->where(function ($sub) use ($userId) {
                    $sub->where('sender_id', $userId)
                        ->orWhere('receiver_id', $userId);
                });
            })
            ->latest()
            ->paginate(30);

        return response()->json($messages);
    }

    public function show(int $id): JsonResponse
    {
        $message = Message::with(['sender', 'receiver', 'property'])->findOrFail($id);
        return response()->json($message);
    }

    public function store(MessageRequest $request): JsonResponse
    {
        $data = $request->validated();
        $attachmentPath = null;

        $file = $request->file('attachment') ?? $request->attachment ?? ($data['attachment'] ?? null);
        if ($file instanceof \Illuminate\Http\UploadedFile) {
            $attachmentPath = $file->store('messages', 'public');
        }

        $message = Message::create([
            'condominium_id' => $data['condominium_id'] ?? 1,
            'property_id' => $data['property_id'] ?? null,
            'channel_type' => $data['channel_type'] ?? 'directo',
            'sender_id' => $request->user()->id,
            'receiver_id' => $data['receiver_id'] ?? null,
            'subject' => $data['subject'] ?? 'Mensaje de Comunidad',
            'content' => $data['content'],
            'attachment_path' => $attachmentPath,
            'is_read' => false,
        ]);

        return response()->json($message->load(['sender', 'receiver', 'property']), 201);
    }

    public function markAsRead(Request $request, int $id): JsonResponse
    {
        $message = Message::findOrFail($id);
        $user = $request->user();

        if ($user) {
            if ($message->sender_id === $user->id && $message->receiver_id !== $user->id) {
                abort(403, 'El remitente no puede marcar como leído su propio mensaje.');
            }
            if ($message->receiver_id && $message->receiver_id !== $user->id && !$user->hasRole('Administrador')) {
                abort(403, 'No tienes permiso para marcar este mensaje como leído.');
            }
        }

        $message->update([
            'is_read' => true,
            'read_at' => now(),
        ]);

        return response()->json($message);
    }
}
