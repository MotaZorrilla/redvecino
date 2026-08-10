<?php

namespace App\Http\Controllers;

use App\Services\DashboardQueryService;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index(DashboardQueryService $dashboardService)
    {
        $user = auth()->user();
        $dashboardData = $dashboardService->getDashboardData($user);

        return Inertia::render('Dashboard', $dashboardData);
    }
}
