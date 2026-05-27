<?php

namespace App\Http\Controllers;

use App\Models\Announcement;
use App\Models\CommonExpense;
use App\Models\Condominium;
use App\Models\Fine;
use App\Models\Message;
use App\Models\Payment;
use App\Models\Property;
use App\Models\Ticket;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Spatie\Permission\Models\Role;

class DashboardController extends Controller
{
    public function index()
    {
        $totalUsers = User::count();
        $activeUsers = User::where('status', 'active')->count();
        $usersByRole = Role::withCount('users')->get()->pluck('users_count', 'name');

        $totalProperties = Property::count();
        $occupiedProperties = Property::where('status', 'occupied')->count();
        $vacantProperties = Property::where('status', 'vacant')->count();

        $totalCondominiums = Condominium::count();

        $totalExpenses = CommonExpense::sum('amount');
        $pendingExpenses = CommonExpense::where('status', 'pending')->count();

        $totalPayments = Payment::sum('amount');
        $pendingPayments = Payment::where('status', 'pending')->count();
        $overduePayments = Payment::where('status', 'overdue')->count();

        $totalFines = Fine::sum('amount');
        $pendingFines = Fine::where('status', 'pending')->count();

        $openTickets = Ticket::where('status', 'open')->count();
        $inProgressTickets = Ticket::where('status', 'in_progress')->count();
        $resolvedTickets = Ticket::where('status', 'resolved')->count();
        $highPriorityTickets = Ticket::where('priority', 'high')->orWhere('priority', 'urgent')->count();

        $recentTickets = Ticket::with(['creator', 'category', 'property.condominium'])
            ->latest()
            ->take(10)
            ->get();

        $recentAnnouncements = Announcement::with('creator')
            ->where('published_at', '<=', now())
            ->latest('published_at')
            ->take(5)
            ->get();

        $recentPayments = Payment::with(['user', 'property', 'commonExpense'])
            ->latest()
            ->take(10)
            ->get();

        $upcomingExpenses = CommonExpense::with('condominium')
            ->where('status', 'pending')
            ->where('due_date', '>=', now())
            ->orderBy('due_date')
            ->take(5)
            ->get();

        $unreadMessages = Message::where('receiver_id', auth()->id())
            ->where('is_read', false)
            ->count();

        return Inertia::render('Dashboard', [
            'stats' => [
                'users' => [
                    'total' => $totalUsers,
                    'active' => $activeUsers,
                ],
                'usersByRole' => $usersByRole,
                'properties' => [
                    'total' => $totalProperties,
                    'occupied' => $occupiedProperties,
                    'vacant' => $vacantProperties,
                ],
                'condominiums' => $totalCondominiums,
                'finances' => [
                    'totalExpenses' => $totalExpenses,
                    'pendingExpenses' => $pendingExpenses,
                    'totalPayments' => $totalPayments,
                    'pendingPayments' => $pendingPayments,
                    'overduePayments' => $overduePayments,
                    'totalFines' => $totalFines,
                    'pendingFines' => $pendingFines,
                ],
                'tickets' => [
                    'open' => $openTickets,
                    'inProgress' => $inProgressTickets,
                    'resolved' => $resolvedTickets,
                    'highPriority' => $highPriorityTickets,
                ],
                'unreadMessages' => $unreadMessages,
            ],
            'recentTickets' => $recentTickets,
            'recentAnnouncements' => $recentAnnouncements,
            'recentPayments' => $recentPayments,
            'upcomingExpenses' => $upcomingExpenses,
        ]);
    }
}
