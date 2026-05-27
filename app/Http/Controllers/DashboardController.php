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

        $allUsers = User::with('roles')->get()->map(function($user) {
            return [
                'id' => $user->id,
                'name' => $user->name,
                'rut' => $user->rut,
                'email' => $user->email,
                'phone' => $user->phone,
                'status' => $user->status,
                'roles' => $user->roles->pluck('name'),
            ];
        });

        $allProperties = Property::with(['condominium', 'owners.user', 'residents.user'])->get()->map(function($prop) {
            return [
                'id' => $prop->id,
                'condominium_id' => $prop->condominium_id,
                'condo_name' => $prop->condominium->name ?? 'Condominio Demo',
                'type' => $prop->type,
                'number' => $prop->number,
                'block' => $prop->block,
                'floor' => $prop->floor,
                'area_sqm' => $prop->area_sqm,
                'status' => $prop->status,
                'owners' => $prop->owners->map(function($profile) {
                    return $profile->user->name ?? 'Sin asignar';
                }),
                'residents' => $prop->residents->map(function($profile) {
                    return $profile->user->name ?? 'Sin asignar';
                }),
            ];
        });

        $allMessages = Message::with(['sender', 'receiver'])->latest()->get()->map(function($msg) {
            return [
                'id' => $msg->id,
                'sender_id' => $msg->sender_id,
                'sender_name' => $msg->sender->name ?? 'Usuario de Baja',
                'receiver_id' => $msg->receiver_id,
                'receiver_name' => $msg->receiver->name ?? 'Usuario de Baja',
                'content' => $msg->content,
                'is_read' => $msg->is_read,
                'time' => $msg->created_at ? $msg->created_at->format('H:i') : now()->format('H:i'),
                'date' => $msg->created_at ? $msg->created_at->format('d/m/Y') : now()->format('d/m/Y'),
            ];
        });

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
            'allUsers' => $allUsers,
            'allProperties' => $allProperties,
            'allMessages' => $allMessages,
        ]);
    }
}
