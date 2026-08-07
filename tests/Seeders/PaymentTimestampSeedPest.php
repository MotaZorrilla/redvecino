<?php

use App\Models\Condominium;
use App\Models\Payment;
use Illuminate\Support\Carbon;

uses(Illuminate\Foundation\Testing\RefreshDatabase::class);

describe('Integridad temporal de pagos en el seeder', function () {

    it('created_at es igual a payment_date (nunca posterior)', function () {
        $this->seed();

        $payments = Payment::all();
        expect($payments->count())->toBeGreaterThan(0);

        foreach ($payments as $payment) {
            $created = $payment->created_at;
            $paid = $payment->payment_date;

            // Ambos deben parsearse como fechas y coincidir en el día
            if ($paid) {
                expect($created->isSameDay($paid))
                    ->toBeTrue("created_at {$created} debe coincidir con payment_date {$paid}");
            }
        }
    });

    it('la fecha del seeder no produce pagos con fechas futuras respecto a su período', function () {
        $this->seed();

        foreach (Payment::all() as $payment) {
            $paid = $payment->payment_date;
            if ($paid) {
                // Ningún pago aprobado puede tener una fecha posterior a hoy
                expect($paid->isFuture())->toBeFalse("Pago {$payment->id} tiene payment_date futura");
            }
        }
    });
});