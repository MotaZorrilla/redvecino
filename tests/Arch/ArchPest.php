<?php

arch('Controllers naming')
    ->expect('App\Http\Controllers')
    ->toHaveSuffix('Controller');

arch('Models inheritance')
    ->expect('App\Models')
    ->toExtend(Illuminate\Database\Eloquent\Model::class)
    ->ignoring('App\Models\User')
    ->ignoring('App\Models\Condominium');

arch('Services should be final')
    ->expect('App\Services')
    ->toBeClasses()
    ->classes->toBeFinal();

arch('No debug calls in app')
    ->expect('App')
    ->not->toUse(['dd', 'dump', 'var_dump', 'exit', 'die'])
    ->ignoring('App\Console\Commands');

arch('No debug calls in Models')
    ->expect('App\Models')
    ->not->toUse(['dd', 'dump', 'var_dump', 'exit', 'die']);

arch('No debug calls in Services')
    ->expect('App\Services')
    ->not->toUse(['dd', 'dump', 'var_dump', 'exit', 'die']);

arch('No debug calls in Controllers')
    ->expect('App\Http\Controllers')
    ->not->toUse(['dd', 'dump', 'var_dump', 'exit', 'die']);

arch('Controllers avoid DB facade except for transactions')
    ->expect('App\Http\Controllers')
    ->not->toUse(['Illuminate\Support\Facades\DB', 'DB'])
    ->ignoring('App\Http\Controllers\CondominiumSetupController')
    ->ignoring('App\Http\Controllers\RoadmapFeaturesController')
    ->ignoring('App\Http\Controllers\CommonExpenseController');

arch('Controllers avoid raw SQL queries')
    ->expect('App\Http\Controllers')
    ->not->toUse(['DB::raw', 'DB::select', 'DB::statement']);
