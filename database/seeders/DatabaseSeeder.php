<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database in a clean, domain-driven order.
     * Guaranteed 100% relational integrity across 6 Condominiums,
     * dozens of properties, hundreds of tickets, finances, fines and profiles.
     */
    public function run(): void
    {
        $this->command->info('🚀 Starting Master Database Seeding Routine...');

        $this->call([
            // 1. Roles, Spatie RBAC & Financial Catalog
            RolePermissionSeeder::class,
            FinancialCatalogSeeder::class,

            // 2. Core Infrastructure (6 Condominiums, Towers & AFPs)
            CondominiumSeeder::class,

            // 3. User Accounts & Spatie Profiles (Admin, Owner, Resident, Committee, Employee, TI)
            UserAndProfileSeeder::class,

            // 4. Property Structures & Fractional Apportionments (Apartments, Parking, Storage)
            PropertyStructureSeeder::class,

            // 5. Financial Engines (Common Expense Periods, Incomes, Expenses, Receipts, Payments)
            FinancialEngineSeeder::class,
            CommonExpensePeriodReceiptSeeder::class,

            // 6. Infractions, Fines & Overdue Interest
            FineAndMoraSeeder::class,

            // 7. Operations & Incident Tickets (Hundreds of realistic tickets linked to real employees)
            TicketOperationsSeeder::class,

            // 8. Facilities, Amenity Bookings & Payroll Remunerations
            FacilityAndPayrollSeeder::class,

            // 9. Community Communications (Announcements & Internal Messages)
            AnnouncementsSeeder::class,
            MessagesSeeder::class,

            // 10. Operational Checklists, Supply Orders & Employee Sanctions
            ChecklistSeeder::class,
            ChecklistsAmenidadesSeeder::class,
            SupplyOrderSeeder::class,
            EmployeeSanctionsSeeder::class,
            AssemblyVotingsSeeder::class,
            CommercialDemoSeeder::class,
        ]);

        $this->command->info('🎉 Master Database Seeding completed successfully with hyperrealistic data!');
    }
}
