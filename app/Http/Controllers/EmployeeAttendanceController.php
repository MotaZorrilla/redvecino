<?php

namespace App\Http\Controllers;

use App\Http\Requests\EmployeeAttendanceRequest;
use App\Models\EmployeeAttendance;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class EmployeeAttendanceController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $attendances = EmployeeAttendance::with('employeeProfile.user')
            ->when($request->query('condominium_id'), fn ($q, $cid) => $q->where('condominium_id', $cid))
            ->when($request->query('employee_profile_id'), fn ($q, $eid) => $q->where('employee_profile_id', $eid))
            ->when($request->query('date'), fn ($q, $date) => $q->where('date', $date))
            ->latest('date')
            ->latest('check_in_at')
            ->get();

        return response()->json($attendances);
    }

    public function checkIn(EmployeeAttendanceRequest $request): JsonResponse
    {
        $data = $request->validated();
        $today = $data['date'] ?? now()->toDateString();

        $existing = EmployeeAttendance::where('employee_profile_id', $data['employee_profile_id'])
            ->whereDate('date', $today)
            ->first();

        if ($existing && $existing->check_in_at) {
            return response()->json([
                'message' => 'El colaborador ya registró su entrada para la jornada de hoy.',
                'attendance' => $existing,
            ], 422);
        }

        $attendance = EmployeeAttendance::updateOrCreate(
            [
                'employee_profile_id' => $data['employee_profile_id'],
                'date' => $today,
            ],
            [
                'condominium_id' => $data['condominium_id'],
                'check_in_at' => now(),
                'check_in_ip' => $request->ip(),
                'notes' => $data['notes'] ?? null,
                'status' => 'presente',
            ]
        );

        return response()->json([
            'message' => 'Entrada registrada con éxito.',
            'attendance' => $attendance->load('employeeProfile.user'),
        ], 201);
    }

    public function checkOut(Request $request, int $id): JsonResponse
    {
        $attendance = EmployeeAttendance::findOrFail($id);

        if ($attendance->check_out_at) {
            return response()->json([
                'message' => 'La salida ya había sido registrada anteriormente.',
                'attendance' => $attendance,
            ], 422);
        }

        $attendance->update([
            'check_out_at' => now(),
            'check_out_ip' => $request->ip(),
        ]);

        return response()->json([
            'message' => 'Salida registrada con éxito.',
            'attendance' => $attendance->load('employeeProfile.user'),
        ]);
    }

    public function todayStatus(Request $request): JsonResponse
    {
        $employeeId = $request->query('employee_profile_id');
        $today = now()->toDateString();

        $attendance = EmployeeAttendance::where('employee_profile_id', $employeeId)
            ->whereDate('date', $today)
            ->first();

        return response()->json([
            'date' => $today,
            'attendance' => $attendance,
            'has_checked_in' => $attendance && $attendance->check_in_at !== null,
            'has_checked_out' => $attendance && $attendance->check_out_at !== null,
        ]);
    }
}
