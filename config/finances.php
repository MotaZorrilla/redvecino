<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Parámetros Financieros y de Negocio por Defecto
    |--------------------------------------------------------------------------
    |
    | Centraliza los valores sugeridos por defecto para montos, porcentajes
    | previsionales, intereses de mora y días de vencimiento. Todos estos
    | valores son libremente modificables desde la interfaz de administración.
    |
    */

    'late_interest_rate_default' => (float) env('FINANCE_LATE_INTEREST_RATE', 0.015), // 1.5%
    'reserve_fund_pct_default' => (float) env('FINANCE_RESERVE_FUND_PCT', 5.0),       // 5.0%
    'days_overdue_threshold_default' => (int) env('FINANCE_DAYS_OVERDUE', 10),        // 10 días

    'hr' => [
        'fonasa_pct' => (float) env('HR_FONASA_PCT', 0.07),       // 7%
        'afp_pct' => (float) env('HR_AFP_PCT', 0.10),             // 10%
        'unemployment_insurance_pct' => (float) env('HR_UI_PCT', 0.006), // 0.6%
    ],

    'amenities' => [
        'default_quincho_fee' => (float) env('AMENITY_QUINCHO_FEE', 15000),
        'default_piscina_fee' => (float) env('AMENITY_PISCINA_FEE', 5000),
        'default_sala_eventos_fee' => (float) env('AMENITY_SALA_EVENTOS_FEE', 25000),
    ],
];
