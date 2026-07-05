<?php

namespace App\Http\Controllers;

use App\Models\EmployeeProfile;
use App\Models\Liquidation;
use App\Models\User;
use Illuminate\Http\Request;

class HRController extends Controller
{
    /**
     * List all employees
     */
    public function employees()
    {
        return EmployeeProfile::with('user')->get();
    }

    /**
     * Create or update an employee profile
     */
    public function saveEmployee(Request $request)
    {
        $data = $request->validate([
            'user_id' => 'required|exists:users,id',
            'position' => 'required|string',
            'contract_type' => 'required|string',
            'salary' => 'required|numeric',
            'hire_date' => 'required|date',
        ]);

        $employee = EmployeeProfile::updateOrCreate(
            ['user_id' => $data['user_id']],
            $data
        );

        return response()->json(['message' => 'Employee saved successfully', 'employee' => $employee]);
    }

    /**
     * Delete an employee profile
     */
    public function deleteEmployee($id)
    {
        $employee = EmployeeProfile::findOrFail($id);
        $employee->delete();
        return response()->json(['message' => 'Employee deleted successfully']);
    }

    /**
     * Get a single employee profile
     */
    public function showEmployee($id)
    {
        $employee = EmployeeProfile::with('user')->findOrFail($id);
        return response()->json($employee);
    }

    /**
     * Update an employee profile
     */
    public function updateEmployee(Request $request, $id)
    {
        $employee = EmployeeProfile::findOrFail($id);

        $data = $request->validate([
            'position' => 'sometimes|string',
            'contract_type' => 'sometimes|string',
            'salary' => 'sometimes|numeric',
            'hire_date' => 'sometimes|date',
        ]);

        $employee->update($data);

        return response()->json(['message' => 'Employee updated successfully', 'employee' => $employee]);
    }

    /**
     * List all liquidations, optionally filtered by employee
     */
    public function listLiquidations(Request $request)
    {
        $query = Liquidation::with('employeeProfile.user');

        if ($request->has('employee_profile_id')) {
            $query->where('employee_profile_id', $request->employee_profile_id);
        }

        return response()->json($query->get());
    }

    /**
     * Get a single liquidation
     */
    public function showLiquidation($id)
    {
        $liquidation = Liquidation::with('employeeProfile.user')->findOrFail($id);
        return response()->json($liquidation);
    }

    /**
     * Upload / Save a liquidation (paystub) for an employee
     */
    public function saveLiquidation(Request $request)
    {
        $data = $request->validate([
            'employee_profile_id' => 'required|exists:employee_profiles,id',
            'period' => 'required|string',
            'sueldo_base' => 'required|numeric',
            'total_imponibles' => 'sometimes|numeric',
            'total_no_imponibles' => 'sometimes|numeric',
            'salud_fonasa' => 'sometimes|numeric',
            'afp_monto' => 'sometimes|numeric',
            'afp_rate' => 'sometimes|numeric',
            'seguro_cesantia' => 'sometimes|numeric',
            'total_previsionales' => 'sometimes|numeric',
            'total_otros_descuentos' => 'sometimes|numeric',
            'sueldo_liquido' => 'required|numeric',
        ]);

        $liquidation = Liquidation::create($data);

        return response()->json(['message' => 'Liquidation saved successfully', 'liquidation' => $liquidation], 201);
    }

    /**
     * Update a liquidation
     */
    public function updateLiquidation(Request $request, $id)
    {
        $liquidation = Liquidation::findOrFail($id);

        $data = $request->validate([
            'period' => 'sometimes|string',
            'sueldo_base' => 'sometimes|numeric',
            'sueldo_liquido' => 'sometimes|numeric',
        ]);

        $liquidation->update($data);

        return response()->json(['message' => 'Liquidation updated successfully', 'liquidation' => $liquidation]);
    }

    /**
     * Delete a liquidation
     */
    public function deleteLiquidation($id)
    {
        $liquidation = Liquidation::findOrFail($id);
        $liquidation->delete();

        return response()->json(null, 204);
    }
}
