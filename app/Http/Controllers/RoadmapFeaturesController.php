<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Property;
use App\Models\Condominium;
use App\Models\CommonExpense;
use App\Models\Payment;
use App\Models\Booking;
use App\Models\QrInvitation;
use App\Models\PackageCustody;
use App\Models\FundTransfer;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Carbon\Carbon;

class RoadmapFeaturesController extends Controller
{
    /**
     * 1. Acceso Preferencial: Login con RUT y PIN de 4 dígitos.
     */
    public function loginPin(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'rut' => 'required|string',
            'pin' => 'required|string|numeric|digits:4',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'La validación falló.',
                'errors' => $validator->errors()
            ], 422);
        }

        $user = User::where('rut', $request->rut)->first();

        if (!$user || $user->pin !== $request->pin) {
            return response()->json([
                'message' => 'Credenciales incorrectas.'
            ], 401);
        }

        $token = $user->createToken('pin-auth')->plainTextToken;

        return response()->json([
            'message' => 'Login exitoso.',
            'token' => $token,
            'user' => $user->load('roles')
        ], 200);
    }

    /**
     * 2. Alertas de Morosidad & Areas Comunes: Listar reservas.
     */
    public function listBookings(Request $request)
    {
        $user = auth()->user();
        return Booking::where('user_id', $user->id)->get();
    }

    /**
     * 2. Alertas de Morosidad & Areas Comunes: Crear reserva.
     */
    public function storeBooking(Request $request)
    {
        $user = auth()->user();
        
        $request->validate([
            'property_id' => 'required|exists:properties,id',
            'area_name' => 'required|string',
            'booking_date' => 'required|date|after_or_equal:today',
            'time_slot' => 'required|string',
        ]);

        $property = Property::findOrFail($request->property_id);
        
        $allExpenses = CommonExpense::where('condominium_id', $property->condominium_id)->get();
        $unpaidCount = 0;
        foreach ($allExpenses as $expense) {
            $hasPaid = Payment::where('property_id', $property->id)
                ->where('common_expense_id', $expense->id)
                ->where('status', 'completed')
                ->exists();
            if (!$hasPaid) {
                $unpaidCount++;
            }
        }

        if ($unpaidCount >= 3) {
            return response()->json([
                'message' => 'El uso de áreas comunes está bloqueado para esta propiedad debido a morosidad (3 o más meses de gastos comunes pendientes).'
            ], 403);
        }

        $booking = Booking::create([
            'user_id' => $user->id,
            'property_id' => $property->id,
            'condominium_id' => $property->condominium_id,
            'area_name' => $request->area_name,
            'booking_date' => $request->booking_date,
            'time_slot' => $request->time_slot,
            'status' => 'approved',
        ]);

        return response()->json($booking, 201);
    }

    /**
     * 3. Control de Accesos Físicos: Registrar invitación QR.
     */
    public function storeQrInvitation(Request $request)
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
     * 3. Control de Accesos Físicos: Verificar invitación QR (Single-use check).
     */
    public function verifyQrInvitation(Request $request)
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

    /**
     * 4. Front Desk - Conserjería OCR & Custodia: Registrar encomienda.
     */
    public function storePackageCustody(Request $request)
    {
        $request->validate([
            'condominium_id' => 'required|exists:condominiums,id',
            'property_id' => 'required|exists:properties,id',
            'recipient_name' => 'required|string',
            'carrier' => 'nullable|string',
            'tracking_number' => 'nullable|string',
        ]);

        $custody = PackageCustody::create([
            'condominium_id' => $request->condominium_id,
            'property_id' => $request->property_id,
            'recipient_name' => $request->recipient_name,
            'carrier' => $request->carrier,
            'tracking_number' => $request->tracking_number,
            'status' => 'custody',
        ]);

        return response()->json($custody, 201);
    }

    /**
     * 4. Front Desk - Conserjería OCR & Custodia: Entregar encomienda.
     */
    public function deliverPackageCustody(Request $request, $id)
    {
        $custody = PackageCustody::findOrFail($id);

        $request->validate([
            'signature' => 'required|string',
        ]);

        $custody->update([
            'status' => 'delivered',
            'signature' => $request->signature,
            'delivered_at' => now(),
        ]);

        return response()->json($custody, 200);
    }

    /**
     * 5. Gobernanza y Votaciones: Calcular quórum de asamblea.
     */
    public function calculateQuorum(Request $request)
    {
        $request->validate([
            'condominium_id' => 'required|exists:condominiums,id',
            'attendees' => 'required|array',
        ]);

        $condo = Condominium::findOrFail($request->condominium_id);
        $totalUnits = Property::where('condominium_id', $condo->id)->count();

        $attendingUnitsCount = count($request->attendees);
        $headcountQuorum = $totalUnits > 0 ? ($attendingUnitsCount / $totalUnits) * 100.0 : 0.0;

        $totalCoefficient = 0.0;
        foreach ($request->attendees as $propertyId) {
            $property = Property::find($propertyId);
            if ($property) {
                $coefficient = $this->resolveCoefficient($property);
                $totalCoefficient += $coefficient;
            }
        }

        return response()->json([
            'total_units' => $totalUnits,
            'attending_units' => $attendingUnitsCount,
            'headcount_quorum_percentage' => round($headcountQuorum, 2),
            'coefficient_quorum_percentage' => round($totalCoefficient * 100, 2),
            'has_quorum' => ($headcountQuorum >= 50.0 && ($totalCoefficient * 100) >= 50.0),
        ]);
    }

    /**
     * 6. Contabilidad por Partida Doble: Transferir fondos con persistencia real.
     */
    public function transferFunds(Request $request)
    {
        $request->validate([
            'condominium_id' => 'required|exists:condominiums,id',
            'amount' => 'required|numeric|min:1',
            'source_fund' => 'required|string|in:operational,reserve',
            'destination_fund' => 'required|string|in:operational,reserve',
            'committee_approved' => 'required|boolean',
        ]);

        if ($request->source_fund === 'reserve' && !$request->committee_approved) {
            return response()->json([
                'message' => 'No está autorizado transferir fondos desde el Fondo de Reserva sin la aprobación explícita del Comité.'
            ], 403);
        }

        $transfer = DB::transaction(function () use ($request) {
            return FundTransfer::create([
                'condominium_id' => $request->condominium_id,
                'user_id' => auth()->id(),
                'amount' => $request->amount,
                'source_fund' => $request->source_fund,
                'destination_fund' => $request->destination_fund,
                'committee_approved' => $request->committee_approved,
            ]);
        });

        return response()->json([
            'message' => 'Transferencia realizada con éxito.',
            'transfer' => $transfer,
        ], 200);
    }

    private function resolveCoefficient(Property $property): float
    {
        return \App\Services\UnitCoefficientResolver::resolve($property);
    }
}
