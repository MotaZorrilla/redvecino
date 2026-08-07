<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Demo Configuration
    |--------------------------------------------------------------------------
    |
    | Configuration for demo data seeding. Allows the demo to be perpetually
    | current by anchoring dates to a configurable year.
    |
    */
    'anchor_year' => env('DEMO_ANCHOR_YEAR', (int) date('Y')),
];