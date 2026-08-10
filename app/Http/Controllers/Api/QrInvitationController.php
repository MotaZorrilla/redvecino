<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\QrInvitation;
use Illuminate\Http\Request;

final class QrInvitationController extends Controller
{
    /**
     * Registrar invitación con código QR.
     */
    public function store(Request $request)
    {
        $user = auth()->user();
        
        $request->validate([
            'condominium_id' => 'required|exists:condominiums,id',
            'visitor_name' => 'required|string',
            'visitor_rut' => 'nullable|string',
            'expires_in_hours' => 'nullable|integer|min:1|max:48',
        ]);

        $expiresInHours = $request->get('expires_in_hours', 24);

        $invitation = QrInvitation::create([
            'user_id' => $user->id,
            'condominium_id' => $request->condominium_id,
            'visitor_name' => $request->visitor_name,
            'visitor_rut' => $request->visitor_rut,
            'code' => bin2hex(random_bytes(16)),
            'scanned_count' => 0,
            'expires_at' => now()->addHours($expiresInHours),
        ]);

        return response()->json($invitation, 201);
    }

    /**
     * Verificar invitación QR (Single-use check).
     */
    public function verify(Request $request)
    {
        $request->validate([
            'code' => 'required|string|exists:qr_invitations,code',
        ]);

        $invitation = QrInvitation::where('code', $request->code)->firstOrFail();

        if ($invitation->expires_at->isPast()) {
            return response()->json([
                'message' => 'El código QR ha expirado.'
            ], 410);
        }

        if ($invitation->scanned_count >= 1) {
            return response()->json([
                'message' => 'Este código QR ya ha sido utilizado.'
            ], 410);
        }

        $invitation->increment('scanned_count');

        return response()->json([
            'message' => 'Invitación válida. Acceso permitido.',
            'invitation' => $invitation
        ], 200);
    }
}
