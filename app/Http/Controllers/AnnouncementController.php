<?php

namespace App\Http\Controllers;

use App\Models\Announcement;
use Illuminate\Http\Request;

class AnnouncementController extends Controller
{
    public function index()
    {
        return Announcement::with('creator')->orderBy('published_at', 'desc')->paginate(20);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'condominium_id' => 'required|exists:condominiums,id',
            'created_by' => 'required|exists:users,id',
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'priority' => 'nullable|string|in:normal,important,urgent',
            'expires_at' => 'nullable|date',
        ]);

        $data['published_at'] = now();

        return Announcement::create($data)->load('creator');
    }
}
