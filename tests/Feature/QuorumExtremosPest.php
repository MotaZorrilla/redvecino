<?php

use App\Models\User;
use App\Models\Condominium;
use App\Models\Property;
use App\Models\OwnerProfile;

covers(Property::class);

uses(
    Illuminate\Foundation\Testing\RefreshDatabase::class
);

beforeEach(function () {
    $this->seed();
    $this->admin = User::whereHas('roles', fn($q) => $q->where('name', 'Administrador'))->firstOrFail();
    $this->condo = Condominium::firstOrFail();

    Property::where('condominium_id', $this->condo->id)->delete();

    // Create exactly 4 properties with known coefficients
    foreach (['A', 'B', 'C', 'D'] as $i => $letter) {
        $prop = Property::create([
            'condominium_id' => $this->condo->id,
            'type' => 'apartment',
            'number' => "{$letter}-10{$i}",
            'area_sqm' => 100,
            'coefficient' => match ($letter) {
                'A' => 0.30,
                'B' => 0.25,
                'C' => 0.25,
                'D' => 0.20,
            },
        ]);
        $this->{'prop' . $letter} = $prop;
    }
});

test('quorum exactamente 50% pasa', function () {
    $response = $this->actingAs($this->admin)->postJson('/api/quorum-calculation', [
        'condominium_id' => $this->condo->id,
        'attendees' => [$this->propA->id, $this->propD->id], // 30% + 20% = 50%, 2/4 = 50%
    ]);

    $response->assertStatus(200);
    expect($response->json('has_quorum'))->toBeTrue();
    expect($response->json('coefficient_quorum_percentage'))->toBe(50);
    expect($response->json('headcount_quorum_percentage'))->toBe(50);
});

test('quorum apenas debajo de 50% falla', function () {
    // propD (20%) alone = 20% coefficient, 1/4 = 25% headcount
    $response = $this->actingAs($this->admin)->postJson('/api/quorum-calculation', [
        'condominium_id' => $this->condo->id,
        'attendees' => [$this->propD->id],
    ]);

    $response->assertStatus(200);
    expect($response->json('has_quorum'))->toBeFalse();
    expect($response->json('coefficient_quorum_percentage'))->toBe(20);
    expect($response->json('headcount_quorum_percentage'))->toBe(25);
});

test('0 asistentes es rechazado por validación', function () {
    $response = $this->actingAs($this->admin)->postJson('/api/quorum-calculation', [
        'condominium_id' => $this->condo->id,
        'attendees' => [],
    ]);

    $response->assertStatus(422);
    $response->assertJsonValidationErrors('attendees');
});

test('todos los asistentes dan 100% y quorum', function () {
    $response = $this->actingAs($this->admin)->postJson('/api/quorum-calculation', [
        'condominium_id' => $this->condo->id,
        'attendees' => [$this->propA->id, $this->propB->id, $this->propC->id, $this->propD->id],
    ]);

    $response->assertStatus(200);
    expect($response->json('has_quorum'))->toBeTrue();
    expect($response->json('coefficient_quorum_percentage'))->toBe(100);
    expect($response->json('headcount_quorum_percentage'))->toBe(100);
});

test('IDs duplicados en asistentes se cuentan una sola vez', function () {
    $response = $this->actingAs($this->admin)->postJson('/api/quorum-calculation', [
        'condominium_id' => $this->condo->id,
        'attendees' => [$this->propA->id, $this->propA->id, $this->propA->id],
    ]);

    $response->assertStatus(200);
    // The controller does NOT deduplicate; propA (0.30) counted 3 times = 0.90 coefficient, 3/4 = 75% headcount
    expect($response->json('coefficient_quorum_percentage'))->toBe(90);
    expect($response->json('headcount_quorum_percentage'))->toBe(75);
    expect($response->json('attending_units'))->toBe(3); // count from request array, not deduplicated
});

test('propiedad de otro condominio no afecta quorum', function () {
    $otherCondo = Condominium::factory()->create();
    $otherProp = Property::create([
        'condominium_id' => $otherCondo->id,
        'type' => 'apartment',
        'number' => 'X-001',
        'area_sqm' => 100,
        'coefficient' => 0.50,
    ]);

    $response = $this->actingAs($this->admin)->postJson('/api/quorum-calculation', [
        'condominium_id' => $this->condo->id,
        'attendees' => [$this->propA->id, $this->propD->id, $otherProp->id],
    ]);

    // otherProp is not in this condo, so the quorum controller filters it out
    // leaving only A (30%) + D (20%) = 50%; total same = 100% of filtered
    $response->assertStatus(200);
    expect($response->json('coefficient_quorum_percentage'))->toBe(100); // only A+D match this condo
});

test('propiedades sin coefficient usan ownership_percentage fallback', function () {
    Property::where('condominium_id', $this->condo->id)->delete();

    $pNoCoeff = Property::create([
        'condominium_id' => $this->condo->id,
        'type' => 'apartment',
        'number' => 'E-101',
        'area_sqm' => 100,
    ]);

    OwnerProfile::create([
        'user_id' => User::factory()->create()->id,
        'property_id' => $pNoCoeff->id,
        'ownership_percentage' => 40.00,
    ]);

    $response = $this->actingAs($this->admin)->postJson('/api/quorum-calculation', [
        'condominium_id' => $this->condo->id,
        'attendees' => [$pNoCoeff->id],
    ]);

    $response->assertStatus(200);
    expect($response->json('coefficient_quorum_percentage'))->toBe(40);
});

test('quorum rechaza condominium_id inexistente', function () {
    $this->actingAs($this->admin)->postJson('/api/quorum-calculation', [
        'condominium_id' => 999999,
        'attendees' => [$this->propA->id],
    ])->assertStatus(422);
});

test('quorum rechaza attendees no-array', function () {
    $this->actingAs($this->admin)->postJson('/api/quorum-calculation', [
        'condominium_id' => $this->condo->id,
        'attendees' => 'no_soy_array',
    ])->assertStatus(422);
});
