<?php

namespace App\Http\Controllers;

use App\Models\Property;
use App\Models\UnitMember;
use App\Models\UnitProfile;
use Illuminate\Http\Request;

class UnitProfileController extends Controller
{
    public function show($propertyId)
    {
        $property = Property::findOrFail($propertyId);

        $profile = UnitProfile::with('members')
            ->where('property_id', $property->id)
            ->first();

        if (!$profile) {
            return response()->json([
                'property_id' => $property->id,
                'parking_spot' => null,
                'license_plate' => null,
                'observation' => null,
                'members' => [],
            ]);
        }

        return response()->json($profile);
    }

    public function upsert(Request $request, $propertyId)
    {
        $property = Property::findOrFail($propertyId);

        $data = $request->validate([
            'parking_spot' => 'nullable|string|max:255',
            'license_plate' => 'nullable|string|max:10',
            'observation' => 'nullable|string',
            'members' => 'nullable|array',
            'members.*.first_name' => 'required_with:members|string|max:255',
            'members.*.last_name' => 'required_with:members|string|max:255',
            'members.*.rut' => 'required_with:members|string|max:12',
            'members.*.birth_date' => 'required_with:members|date',
            'members.*.is_owner' => 'sometimes|boolean',
            'members.*.lives_in_unit' => 'sometimes|boolean',
        ]);

        $profile = UnitProfile::updateOrCreate(
            ['property_id' => $property->id],
            [
                'parking_spot' => $data['parking_spot'] ?? null,
                'license_plate' => $data['license_plate'] ?? null,
                'observation' => $data['observation'] ?? null,
            ]
        );

        if (array_key_exists('members', $data)) {
            $profile->members()->delete();
            foreach ($data['members'] as $member) {
                UnitMember::create([
                    'unit_profile_id' => $profile->id,
                    'first_name' => $member['first_name'],
                    'last_name' => $member['last_name'],
                    'rut' => $member['rut'],
                    'birth_date' => $member['birth_date'],
                    'is_owner' => $member['is_owner'] ?? false,
                    'lives_in_unit' => $member['lives_in_unit'] ?? false,
                ]);
            }
        }

        return response()->json($profile->load('members'), 201);
    }
}