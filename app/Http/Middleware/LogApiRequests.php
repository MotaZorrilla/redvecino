<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class LogApiRequests
{
    public function handle(Request $request, Closure $next)
    {
        $start = microtime(true);

        $response = $next($request);

        $duration = (microtime(true) - $start) * 1000;

        Log::channel('api')->info('API Request', [
            'method' => $request->method(),
            'url' => $request->fullUrl(),
            'user_id' => $request->user()?->id,
            'ip' => $request->ip(),
            'status' => $response->getStatusCode(),
            'duration_ms' => round($duration, 2),
        ]);

        return $response;
    }
}
