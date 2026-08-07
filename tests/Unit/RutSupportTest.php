<?php

use App\Support\Rut;

describe('Support\Rut — algoritmo módulo 11 chileno', function () {

    it('calcula el digito verificador correcto para RUTs conocidos', function () {
        $cases = [
            [11111111, '1'],
            [12345678, '5'],
            [16111111, '2'],
            [10000000, '8'],
        ];

        foreach ($cases as [$body, $expectedDv]) {
            expect(Rut::dvFor((int) $body))->toBe($expectedDv);
        }
    });

    it('construye un RUT formateado válido con su DV', function () {
        $rut = Rut::generate(12345678);
        expect($rut)->toBe('12.345.678-5');
    });

    it('comprueba que un RUT bien formateado es válido', function () {
        expect(Rut::validate('11.111.111-1'))->toBeTrue();
        expect(Rut::validate('12.345.678-5'))->toBeTrue();
    });

    it('rechaza RUTs con DV incorrecto o formato inválido', function () {
        expect(Rut::validate('11.111.111-7'))->toBeFalse();
        expect(Rut::validate('12.345.678-9'))->toBeFalse();
        expect(Rut::validate('sin-formato'))->toBeFalse();
        expect(Rut::validate(''))->toBeFalse();
    });
});