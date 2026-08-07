<?php

namespace App\Support;

class Rut
{
    /**
     * Calcula el dígito verificador (DV) chileno según el algoritmo módulo 11.
     */
    public static function dvFor(int $body): string
    {
        $sum = 0;
        $parts = str_split((string) $body);
        $weights = [2, 3, 4, 5, 6, 7];
        $i = count($parts) - 1;
        $wi = 0;

        while ($i >= 0) {
            $sum += (int) $parts[$i] * $weights[$wi % 6];
            $wi++;
            $i--;
        }

        $remainder = $sum % 11;
        $dv = 11 - $remainder;

        if ($dv === 11) {
            return '0';
        }
        if ($dv === 10) {
            return 'K';
        }

        return (string) $dv;
    }

    /**
     * Genera un RUT formateado a partir de su serie + DV válido.
     */
    public static function generate(int $body): string
    {
        $formatted = number_format($body, 0, ',', '.');

        return $formatted . '-' . self::dvFor($body);
    }

    /**
     * Valida un RUT completo (con o sin punto) usando el algoritmo módulo 11.
     */
    public static function validate(string $rut): bool
    {
        $cleaned = preg_replace('/[^0-9kK]/', '', $rut);
        if (strlen($cleaned) < 2) {
            return false;
        }

        $dv = strtoupper(substr($cleaned, -1));
        $body = (int) substr($cleaned, 0, -1);

        $expected = self::dvFor($body);

        return $expected === $dv;
    }
}