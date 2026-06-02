<?php

namespace Tests\Feature;

use App\Models\Condominium;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia;
use Tests\TestCase;

class DashboardPropsTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed();
    }

    /**
     * Helper to get the first user with a given Spatie role.
     */
    private function getUserByRole(string $roleName): User
    {
        $user = User::whereHas('roles', function ($q) use ($roleName) {
            $q->where('name', $roleName);
        })->first();

        if (! $user) {
            $this->fail("No user found with role: {$roleName}");
        }

        return $user;
    }

    // ───────────────────────────────────────────────
    //  UNHAPPY PATHS FIRST
    // ───────────────────────────────────────────────

    /**
     * Unauthenticated visitors must be redirected to the login page.
     */
    public function test_dashboard_unauthenticated_user_redirected(): void
    {
        $response = $this->get('/dashboard');

        $response->assertRedirect('/login');
    }

    // ───────────────────────────────────────────────
    //  HAPPY PATHS — Inertia Component & Props
    // ───────────────────────────────────────────────

    /**
     * The response must render the correct Inertia component name.
     */
    public function test_dashboard_response_is_inertia_dashboard_component(): void
    {
        $admin = $this->getUserByRole('Administrador');

        $response = $this->actingAs($admin)->get('/dashboard');

        $response->assertStatus(200);
        $response->assertInertia(
            fn (AssertableInertia $page) => $page->component('Dashboard')
        );
    }

    /**
     * allCondominiums must be present and contain exactly the 3 condos
     * created by the seeder.
     */
    public function test_dashboard_returns_all_condominiums_prop(): void
    {
        $admin = $this->getUserByRole('Administrador');

        $response = $this->actingAs($admin)->get('/dashboard');

        $response->assertStatus(200);
        $response->assertInertia(
            fn (AssertableInertia $page) => $page
                ->has('allCondominiums', 3)
        );

        // Cross-check against the database
        $this->assertDatabaseCount('condominiums', 3);
    }

    /**
     * Each condominium inside allCondominiums must expose the expected
     * structural fields: id, name, address, city, units_count, status.
     */
    public function test_dashboard_condominiums_have_correct_structure(): void
    {
        $admin = $this->getUserByRole('Administrador');

        $response = $this->actingAs($admin)->get('/dashboard');

        $response->assertStatus(200);
        $response->assertInertia(
            fn (AssertableInertia $page) => $page
                ->has('allCondominiums.0', fn (AssertableInertia $condo) => $condo
                    ->has('id')
                    ->has('name')
                    ->has('address')
                    ->has('city')
                    ->has('units_count')
                    ->has('status')
                    ->etc()
                )
        );
    }

    /**
     * stats must contain all expected nested keys:
     * users (total, active), usersByRole, properties (total, occupied, vacant),
     * condominiums, finances (7 keys), tickets (4 keys), unreadMessages.
     */
    public function test_dashboard_returns_correct_stats_structure(): void
    {
        $admin = $this->getUserByRole('Administrador');

        $response = $this->actingAs($admin)->get('/dashboard');

        $response->assertStatus(200);
        $response->assertInertia(
            fn (AssertableInertia $page) => $page
                ->has('stats', fn (AssertableInertia $stats) => $stats
                    // users block
                    ->has('users', fn (AssertableInertia $u) => $u
                        ->has('total')
                        ->has('active')
                    )
                    // usersByRole
                    ->has('usersByRole')
                    // properties block
                    ->has('properties', fn (AssertableInertia $p) => $p
                        ->has('total')
                        ->has('occupied')
                        ->has('vacant')
                    )
                    // single integer
                    ->has('condominiums')
                    // finances block
                    ->has('finances', fn (AssertableInertia $f) => $f
                        ->has('totalExpenses')
                        ->has('pendingExpenses')
                        ->has('totalPayments')
                        ->has('pendingPayments')
                        ->has('overduePayments')
                        ->has('totalFines')
                        ->has('pendingFines')
                    )
                    // tickets block
                    ->has('tickets', fn (AssertableInertia $t) => $t
                        ->has('open')
                        ->has('inProgress')
                        ->has('resolved')
                        ->has('highPriority')
                    )
                    // unread messages counter
                    ->has('unreadMessages')
                )
        );
    }

    /**
     * recentTickets must be loaded with their 'creator' and 'category'
     * relationships (eager-loaded by the controller).
     */
    public function test_dashboard_returns_recent_tickets_with_relations(): void
    {
        $admin = $this->getUserByRole('Administrador');

        $response = $this->actingAs($admin)->get('/dashboard');

        $response->assertStatus(200);
        $response->assertInertia(
            fn (AssertableInertia $page) => $page
                ->has('recentTickets')
                ->has('recentTickets.0', fn (AssertableInertia $ticket) => $ticket
                    ->has('creator')
                    ->has('category')
                    ->etc()
                )
        );
    }

    /**
     * Each user inside allUsers must include a 'roles' field
     * (plucked role names via Spatie).
     */
    public function test_dashboard_all_users_include_roles(): void
    {
        $admin = $this->getUserByRole('Administrador');

        $response = $this->actingAs($admin)->get('/dashboard');

        $response->assertStatus(200);
        $response->assertInertia(
            fn (AssertableInertia $page) => $page
                ->has('allUsers')
                ->has('allUsers.0', fn (AssertableInertia $user) => $user
                    ->has('id')
                    ->has('name')
                    ->has('email')
                    ->has('roles')
                    ->etc()
                )
        );
    }

    /**
     * Each property inside allProperties must have a 'condo_name' field
     * (resolved from the condominium relationship by the controller map).
     */
    public function test_dashboard_all_properties_include_condo_name(): void
    {
        $admin = $this->getUserByRole('Administrador');

        $response = $this->actingAs($admin)->get('/dashboard');

        $response->assertStatus(200);
        $response->assertInertia(
            fn (AssertableInertia $page) => $page
                ->has('allProperties')
                ->has('allProperties.0', fn (AssertableInertia $prop) => $prop
                    ->has('id')
                    ->has('condominium_id')
                    ->has('condo_name')
                    ->has('type')
                    ->has('number')
                    ->has('status')
                    ->etc()
                )
        );
    }

    /**
     * allPayments must be present and contain critical fields.
     */
    public function test_dashboard_returns_all_payments_prop(): void
    {
        $admin = $this->getUserByRole('Administrador');

        $response = $this->actingAs($admin)->get('/dashboard');

        $response->assertStatus(200);
        $response->assertInertia(
            fn (AssertableInertia $page) => $page
                ->has('allPayments')
                ->has('allPayments.0', fn (AssertableInertia $payment) => $payment
                    ->has('id')
                    ->has('user_id')
                    ->has('property_id')
                    ->has('amount')
                    ->has('payment_method')
                    ->has('status')
                    ->etc()
                )
        );
    }
}
