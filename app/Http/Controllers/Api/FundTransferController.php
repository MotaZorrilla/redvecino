<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\FundTransfer;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

final class FundTransferController extends Controller
{
    /**
     * Transferir fondos contables con persistencia real.
     */
    public function transfer(Request $request)
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
}
