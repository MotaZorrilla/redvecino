<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Condominium;
use App\Models\Property;
use App\Models\OwnerProfile;
use App\Models\ResidentProfile;
use App\Models\CommitteeProfile;
use App\Models\EmployeeProfile;
use App\Models\AdminProfile;
use App\Models\TiProfile;
use App\Models\CommonExpense;
use App\Models\ExpenseItem;
use App\Models\Payment;
use App\Models\Fine;
use App\Models\TicketCategory;
use App\Models\Ticket;
use App\Models\CondoIncome;
use App\Models\CondoExpense;
use App\Models\Afp;
use App\Models\CondoTower;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    private int $rutCounter = 0;

    private function uniqueRut(): string
    {
        $this->rutCounter++;
        $base = 10000000 + $this->rutCounter;
        return \App\Support\Rut::generate($base);
    }

    public function run(): void
    {
        // 1. Run Spatie Role and Permission Seeder
        $this->call([
            RolePermissionSeeder::class,
            FinancialCatalogSeeder::class,
        ]);

        $this->command->info('Roles, permissions, and financial catalog seeded.');

        // 1.5. Create standard AFPs
        $afpHabitat = Afp::create(['name' => 'Habitat', 'commission_rate' => 10.00]);
        $afpCapital = Afp::create(['name' => 'Capital', 'commission_rate' => 11.44]);
        $afpModelo = Afp::create(['name' => 'Modelo', 'commission_rate' => 10.58]);
        
        $this->command->info('AFPs seeded.');

        // 2. Create standard Demo Users (password is 'password')
        $demoUsersData = [
            [
                'name' => 'Administrador General',
                'rut' => '11.111.111-1',
                'email' => 'admin@redvecino.cl',
                'phone' => '+56911111111',
                'role' => 'Administrador',
            ],
            [
                'name' => 'Propietario Demo',
                'rut' => '22.222.222-2',
                'email' => 'propietario@redvecino.cl',
                'phone' => '+56922222222',
                'role' => 'Propietario',
            ],
            [
                'name' => 'Residente Demo',
                'rut' => '33.333.333-3',
                'email' => 'residente@redvecino.cl',
                'phone' => '+56933333333',
                'role' => 'Residente',
            ],
            [
                'name' => 'Miembro del Comité',
                'rut' => '44.444.444-4',
                'email' => 'comite@redvecino.cl',
                'phone' => '+56944444444',
                'role' => 'Comité',
            ],
            [
                'name' => 'Conserje Principal',
                'rut' => '55.555.555-5',
                'email' => 'colaborador@redvecino.cl',
                'phone' => '+56955555555',
                'role' => 'Colaborador',
            ],
            [
                'name' => 'Soporte TI',
                'rut' => '66.666.666-6',
                'email' => 'ti@redvecino.cl',
                'phone' => '+56966666666',
                'role' => 'TI',
            ],
        ];

        $demoUsers = [];
        foreach ($demoUsersData as $data) {
            $user = User::create([
                'name' => $data['name'],
                'rut' => $data['rut'],
                'email' => $data['email'],
                'phone' => $data['phone'],
                'password' => bcrypt('password'),
                'status' => 'active',
                'email_verified_at' => now(),
            ]);

            $user->assignRole($data['role']);
            $demoUsers[$data['role']] = $user;
        }

        // Attach profiles to Demo Users
        AdminProfile::create([
            'user_id' => $demoUsers['Administrador']->id,
            'access_level' => 'full',
        ]);

        CommitteeProfile::create([
            'user_id' => $demoUsers['Comité']->id,
            'position' => 'Presidente del Comité',
            'period_start' => '2026-01-01',
            'period_end' => '2026-12-31',
            'permission_level' => 'full',
        ]);

        $employeeSupervisor = User::create([
            'name' => 'Supervisor de Operaciones',
            'rut' => '77.777.777-7',
            'email' => 'supervisor@redvecino.cl',
            'phone' => '+56977777777',
            'password' => bcrypt('password'),
            'status' => 'active',
            'email_verified_at' => now(),
        ]);
        $employeeSupervisor->assignRole('Colaborador');

        EmployeeProfile::create([
            'user_id' => $demoUsers['Colaborador']->id,
            'position' => 'Conserje Turno Día',
            'supervisor_id' => $employeeSupervisor->id,
            'contract_type' => 'indefinido',
            'shift' => 'mañana-tarde',
            'salary' => 650000.00,
            'hire_date' => '2025-03-15',
            'afp_id' => $afpHabitat->id,
            'bank_name' => 'Banco Estado',
            'account_type' => 'Cuenta Rut',
            'account_number' => '12345678',
            'payment_method' => 'Transferencia Electrónica',
        ]);

        EmployeeProfile::create([
            'user_id' => $employeeSupervisor->id,
            'position' => 'Jefe de Conserjería',
            'supervisor_id' => null,
            'contract_type' => 'indefinido',
            'shift' => 'rotativo',
            'salary' => 950000.00,
            'hire_date' => '2024-06-01',
            'afp_id' => $afpCapital->id,
            'bank_name' => 'Banco de Chile',
            'account_type' => 'Cuenta Corriente',
            'account_number' => '987654321',
            'payment_method' => 'Transferencia Electrónica',
        ]);

        TiProfile::create([
            'user_id' => $demoUsers['TI']->id,
            'access_level' => 'root',
            'system_logs_permission' => true,
        ]);

        $this->command->info('Demo accounts and profiles created.');

        // 3. Create 3 Condominiums
        $condo1 = Condominium::create([
            'name' => 'Condominio Alameda Loft',
            'address' => 'Av. Libertador Bernardo O\'Higgins 1420',
            'city' => 'Santiago Centro',
            'region' => 'Metropolitana',
            'postal_code' => '8320000',
            'units_count' => 30,
            'status' => 'active',
        ]);

        $condo2 = Condominium::create([
            'name' => 'Condominio Parque del Inca',
            'address' => 'Av. Apoquindo 4500',
            'city' => 'Las Condes',
            'region' => 'Metropolitana',
            'postal_code' => '7550000',
            'units_count' => 30,
            'status' => 'active',
        ]);

        $condo3 = Condominium::create([
            'name' => 'Condominio Providencia Plaza',
            'address' => 'Av. Providencia 1230',
            'city' => 'Providencia',
            'region' => 'Metropolitana',
            'postal_code' => '7500000',
            'units_count' => 30,
            'status' => 'active',
        ]);

        $condos = [$condo1, $condo2, $condo3];
        $this->command->info('3 Condominiums created.');

        // 3.5 Create Towers for each Condo
        $condoTowers = [];
        foreach ($condos as $condo) {
            $towerA = CondoTower::create([
                'condominium_id' => $condo->id,
                'name' => 'Torre A',
                'has_water_meter' => true,
                'has_electricity_meter' => true,
            ]);
            $towerB = CondoTower::create([
                'condominium_id' => $condo->id,
                'name' => 'Torre B',
                'has_water_meter' => true,
                'has_electricity_meter' => false,
            ]);
            $towerC = CondoTower::create([
                'condominium_id' => $condo->id,
                'name' => 'Torre C',
                'has_water_meter' => false,
                'has_electricity_meter' => false,
            ]);
            $condoTowers[$condo->id] = [$towerA, $towerB, $towerC];
        }
        $this->command->info('Condo Towers created.');

        // 4. Create Ticket Categories
        $categoriesData = [
            ['name' => 'Fontanería e Instalaciones Sanitarias', 'description' => 'Filtraciones, llaves de paso, desagües, grifería y problemas de agua potable.'],
            ['name' => 'Electricidad e Iluminación', 'description' => 'Ampolletas quemadas, cortocircuitos, enchufes y tableros eléctricos comunes.'],
            ['name' => 'Ascensores y Portones Automáticos', 'description' => 'Fallas mecánicas de ascensores, brazos hidráulicos y portones vehiculares.'],
            ['name' => 'Climatización y Ventilación', 'description' => 'Extractores de aire, calderas, calefacción central y aire acondicionado.'],
            ['name' => 'Áreas Verdes y Piscinas', 'description' => 'Riego, piscinas comunes, mantenimiento de jardines y quinchos.'],
            ['name' => 'Seguridad y Conserjería', 'description' => 'Cámaras de vigilancia CCTV, citófonos, alarmas y llaves de acceso.'],
            ['name' => 'Administración y Convivencia', 'description' => 'Consultas de cobros, multas, reservas de espacios y reclamos entre vecinos.'],
        ];

        $categories = [];
        foreach ($categoriesData as $catData) {
            $categories[] = TicketCategory::create($catData);
        }
        $this->command->info('Ticket Categories created.');

        // 5. Generate Properties, Owners, and Residents
        $allProperties = [];
        
        // Let's keep track of generated properties to assign our Demo Propietario and Residente
        $demoProperty = null;

        // Names to generate realistic owners
        $ownerNames = [
            'Camila Vergara', 'Sebastián Muñoz', 'Francisca Silva', 'Matías Contreras',
            'Constanza Flores', 'Nicolás Morales', 'Valentina Reyes', 'Javier Gutiérrez',
            'Ignacio Fuentes', 'Fernanda Soto', 'Diego Alarcón', 'Catalina Herrera',
            'Felipe Carrasco', 'Sofía Valenzuela', 'Andrés Martínez', 'Alejandra Pérez'
        ];

        // Names to generate realistic residents (tenants)
        $residentNames = [
            'Gabriel Castillo', 'Carolina Orellana', 'Gonzalo Espinoza', 'Javiera Núñez',
            'Rodrigo Tapia', 'Patricia Vera', 'Joaquín Gómez', 'María José Arriagada',
            'Álvaro Venegas', 'Paulina Sandoval'
        ];

        foreach ($condos as $condoIdx => $condo) {
            $this->command->info("Generating properties for: {$condo->name}");

            // Generate exactly 30 properties per condo:
            // 20 apartments, 5 parking spots, 5 storage rooms.
            // Sum of ownership_percentage should be 100%.
            // Apartments: 4.5% each (total 90%)
            // Parking: 1.0% each (total 5%)
            // Storage: 1.0% each (total 5%)

            // ALÍCUOTAS POR MODELO (fuente única de coefficient, suma = 100%):
            //   apt  → 4.5%  = 0.045 (20 uds = 90%)
            //   park → 1.0%  = 0.010 ( 5 uds =  5%)
            //   bodega → 1.0% = 0.010 ( 5 uds =  5%)
            // Estos valores alimentan el motor Fase 2 (boletas que suman al total).

            for ($i = 1; $i <= 20; $i++) {
                $aptNumber = 'Apt ' . ($i + 100);
                
                $towerList = $condoTowers[$condo->id];
                $towerIdx = ($i - 1) % 3;
                $tower = $towerList[$towerIdx];

                $property = Property::create([
                    'condominium_id' => $condo->id,
                    'tower_id' => $tower->id,
                    'type' => 'apartment',
                    'number' => $aptNumber,
                    'block' => $tower->name,
                    'floor' => intval(ceil($i / 4)),
                    'area_sqm' => 60.50 + ($i * 2.5),
                    'coefficient' => 0.045,
                    'status' => 'occupied',
                ]);

                $allProperties[] = $property;

                // For the very first apartment in Condo 1, assign our Demo Propietario and Residente!
                if ($condoIdx === 0 && $i === 1) {
                    $demoProperty = $property;

                    OwnerProfile::create([
                        'user_id' => $demoUsers['Propietario']->id,
                        'property_id' => $property->id,
                        'ownership_percentage' => 4.50,
                        'financial_status' => 'al_dia',
                    ]);

                    ResidentProfile::create([
                        'user_id' => $demoUsers['Residente']->id,
                        'property_id' => $property->id,
                        'resident_type' => 'inquilino',
                        'relationship' => 'arrendatario',
                        'lease_start' => '2025-01-01',
                        'lease_end' => '2026-12-31',
                    ]);
                    
                    continue;
                }

                // Create a random owner
                $ownerName = $ownerNames[($i + $condoIdx) % count($ownerNames)];
                $ownerEmail = Str::slug($ownerName) . '.' . $condoIdx . '.' . $i . '@email.test';
                $ownerRut = $this->uniqueRut();

                $ownerUser = User::create([
                    'name' => $ownerName,
                    'rut' => $ownerRut,
                    'email' => $ownerEmail,
                    'phone' => '+569' . fake()->numberBetween(60000000, 99999999),
                    'password' => bcrypt('password'),
                    'status' => 'active',
                    'email_verified_at' => now(),
                ]);
                $ownerUser->assignRole('Propietario');

                OwnerProfile::create([
                    'user_id' => $ownerUser->id,
                    'property_id' => $property->id,
                    'ownership_percentage' => 4.50,
                    'financial_status' => fake()->randomElement(['al_dia', 'al_dia', 'al_dia', 'atrasado']),
                ]);

                // Determine if owner lives there or if there is a tenant
                $hasTenant = fake()->boolean(30); // 30% chance of a tenant
                if ($hasTenant) {
                    $resName = $residentNames[($i + $condoIdx) % count($residentNames)];
                    $resEmail = Str::slug($resName) . '.' . $condoIdx . '.' . $i . '@email.test';
                    $resRut = $this->uniqueRut();

                    $residentUser = User::create([
                        'name' => $resName,
                        'rut' => $resRut,
                        'email' => $resEmail,
                        'phone' => '+569' . fake()->numberBetween(60000000, 99999999),
                        'password' => bcrypt('password'),
                        'status' => 'active',
                        'email_verified_at' => now(),
                    ]);
                    $residentUser->assignRole('Residente');

                    ResidentProfile::create([
                        'user_id' => $residentUser->id,
                        'property_id' => $property->id,
                        'resident_type' => 'inquilino',
                        'relationship' => 'arrendatario',
                        'lease_start' => '2025-03-01',
                        'lease_end' => '2027-02-28',
                    ]);
                } else {
                    // Owner is the resident
                    ResidentProfile::create([
                        'user_id' => $ownerUser->id,
                        'property_id' => $property->id,
                        'resident_type' => 'propietario',
                        'relationship' => 'propietario',
                        'lease_start' => null,
                        'lease_end' => null,
                    ]);
                }
            }

            // Create 5 parking slots
            for ($i = 1; $i <= 5; $i++) {
                $property = Property::create([
                    'condominium_id' => $condo->id,
                    'type' => 'parking',
                    'number' => 'E-' . $i,
                    'block' => 'Subterráneo -1',
                    'floor' => null,
                    'area_sqm' => 12.50,
                    'coefficient' => 0.010,
                    'status' => 'occupied',
                ]);

                // Link to a random owner in the same condo
                $randomOwner = OwnerProfile::whereHas('property', function ($query) use ($condo) {
                    $query->where('condominium_id', $condo->id);
                })->inRandomOrder()->first();

                if ($randomOwner) {
                    OwnerProfile::create([
                        'user_id' => $randomOwner->user_id,
                        'property_id' => $property->id,
                        'ownership_percentage' => 1.00,
                        'financial_status' => $randomOwner->financial_status,
                    ]);
                }
            }

            // Create 5 storage units
            for ($i = 1; $i <= 5; $i++) {
                $property = Property::create([
                    'condominium_id' => $condo->id,
                    'type' => 'storage',
                    'number' => 'B-' . $i,
                    'block' => 'Subterráneo -1',
                    'floor' => null,
                    'area_sqm' => 6.00,
                    'coefficient' => 0.010,
                    'status' => 'occupied',
                ]);

                // Link to a random owner in the same condo
                $randomOwner = OwnerProfile::whereHas('property', function ($query) use ($condo) {
                    $query->where('condominium_id', $condo->id);
                })->inRandomOrder()->first();

                if ($randomOwner) {
                    OwnerProfile::create([
                        'user_id' => $randomOwner->user_id,
                        'property_id' => $property->id,
                        'ownership_percentage' => 1.00,
                        'financial_status' => $randomOwner->financial_status,
                    ]);
                }
            }
        }

        $this->command->info('Properties, Owners, and Residents seeded.');

// 6. Generate Financial Records (Common Expenses, Expense Items, Payments)
        $anchorYear = config('demo.anchor_year');
        $periods = [
            ['period' => ($anchorYear - 1) . '-03', 'due_day' => 5, 'status' => 'paid'],
            ['period' => ($anchorYear - 1) . '-04', 'due_day' => 5, 'status' => 'paid'],
            ['period' => ($anchorYear - 1) . '-05', 'due_day' => 5, 'status' => 'pending'],
        ];
        $expenseCategories = [
            ['category' => 'Seguridad', 'description' => 'Servicios de conserjería y vigilancia 24/7 de empresa contratada.'],
            ['category' => 'Aseo y Áreas Comunes', 'description' => 'Insumos de limpieza y personal de aseo diario.'],
            ['category' => 'Administración', 'description' => 'Honorarios de la administración del condominio.'],
            ['category' => 'Mantención Ascensores', 'description' => 'Contrato mensual Schindler y reparaciones menores.'],
            ['category' => 'Consumo Eléctrico', 'description' => 'Iluminación de pasillos comunes y estacionamientos.']
        ];

        foreach ($condos as $condo) {
            foreach ($periods as $periodIdx => $periodData) {
                $period = $periodData['period'];
                $dueDay = $periodData['due_day'];
                $status = $periodData['status'];
                $isCurrent = ($periodData['status'] === 'pending');
                $dueDate = date('Y-m-d', strtotime("{$period}-{$dueDay}"));

                // Base global amount
                $baseAmount = match ($condo->name) {
                    'Condominio Alameda Loft' => 2000000.00,
                    'Condominio Parque del Inca' => 3500000.00,
                    'Condominio Providencia Plaza' => 2800000.00,
                };

                // Add minor variation per month
                $variation = ($periodIdx * 54320.00) - 20000.00;
                $totalAmount = $baseAmount + $variation;

                $commonExpense = CommonExpense::create([
                    'condominium_id' => $condo->id,
                    'period' => $period,
                    'amount' => $totalAmount,
                    'description' => "Gasto Común General correspondiente al periodo {$period}. Incluye mantenciones, servicios básicos y administración.",
                    'due_date' => $dueDate,
                    'status' => $status,
                ]);

                // Create Expense Items detailing where the money goes
                foreach ($expenseCategories as $idx => $cat) {
                    // Divide total amount among categories with some weights
                    $weight = match ($cat['category']) {
                        'Seguridad' => 0.40,
                        'Aseo y Áreas Comunes' => 0.25,
                        'Administración' => 0.15,
                        'Mantención Ascensores' => 0.12,
                        'Consumo Eléctrico' => 0.08,
                    };

                    ExpenseItem::create([
                        'common_expense_id' => $commonExpense->id,
                        'category' => $cat['category'],
                        'description' => $cat['description'],
                        'amount' => $totalAmount * $weight,
                    ]);
                }

                // Now create Payment invoices/records for ALL properties in this condo for this period.
                // Each property pays based on its ownership_percentage.
                $condoProperties = Property::where('condominium_id', $condo->id)->get();
                
                foreach ($condoProperties as $property) {
                    // Get the owner of this property
                    $ownerProfile = OwnerProfile::where('property_id', $property->id)->first();
                    if (!$ownerProfile) continue;

                    // Calculate the aliquot share: totalAmount * ownership_percentage / 100
                    $aliquot = $totalAmount * ($ownerProfile->ownership_percentage / 100.0);

                    // Determine payment status and dates based on period
                    $paymentStatus = 'pending';
                    $paymentDate = null;
                    $method = 'transferencia';
                    $ref = null;

                    if ($period === '2026-03' || $period === '2026-04') {
                        // Historically 95% paid. For others, it's overdue (still pending)
                        $isPaid = fake()->boolean(95);
                        
                        // Ensure our Demo Propietario paid all past bills
                        if ($ownerProfile->user_id === $demoUsers['Propietario']->id) {
                            $isPaid = true;
                        }

                        if ($isPaid) {
                            $paymentStatus = 'approved';
                            $paymentDate = fake()->dateTimeBetween($dueDate . ' - 5 days', $dueDate)->format('Y-m-d');
                            $method = fake()->randomElement(['transferencia', 'tarjeta_debito', 'tarjeta_credito']);
                            $ref = 'TXN-' . fake()->numberBetween(100000, 999999);
                        } else {
                            $paymentStatus = 'pending';
                        }
                    } else {
                        // Current month (May). Some have paid early, some are pending.
                        $isPaid = fake()->boolean(40);
                        
                        // For our Demo Propietario, make it pending so they can test the payment button!
                        if ($ownerProfile->user_id === $demoUsers['Propietario']->id) {
                            $isPaid = false;
                        }

                        if ($isPaid) {
                            $paymentStatus = 'approved';
                            $currentPeriodStart = ($anchorYear - 1) . '-05-01';
                            $currentPeriodEnd = ($anchorYear - 1) . '-05-31';
                            $paymentDate = fake()->dateTimeBetween($currentPeriodStart, $currentPeriodEnd)->format('Y-m-d');
                            $method = fake()->randomElement(['transferencia', 'tarjeta_debito']);
                            $ref = 'TXN-' . fake()->numberBetween(100000, 999999);
                        } else {
                            $paymentStatus = 'pending';
                        }
                    }

                    $payDate = $paymentDate ?? now()->format('Y-m-d');

                    Payment::create([
                        'user_id' => $ownerProfile->user_id,
                        'property_id' => $property->id,
                        'common_expense_id' => $commonExpense->id,
                        'amount' => $aliquot,
                        'payment_date' => $payDate,
                        'payment_method' => $method,
                        'reference' => $ref,
                        'status' => $paymentStatus,
                        'created_at' => \Illuminate\Support\Carbon::parse($payDate),
                        'updated_at' => \Illuminate\Support\Carbon::parse($payDate),
                    ]);
                }
            }
        }

        $this->command->info('Financial ledgers (Common Expenses & Payments) populated.');

        // 7. Generate Fines
        $fineReasons = [
            'Ruidos molestos emitidos en horario de silencio establecido (música a alto volumen después de las 02:00 AM).',
            'Vehículo de residente estacionado en espacio reservado exclusivamente para visitas por más de 12 horas consecutivas.',
            'Mascota suelta y sin correa en áreas comunes de la torre principal.',
            'Disposición incorrecta de residuos domiciliarios fuera de los contenedores o ductos asignados.',
            'Uso no autorizado ni reservado del sector Quincho y daños leves en el mobiliario común.'
        ];

        // Seed 6 realistic fines
        $apartments = Property::where('type', 'apartment')->get();
        $fineStartDate = ($anchorYear - 1) . '-01-01';
        $fineEndDate = ($anchorYear - 1) . '-12-31';
        for ($i = 1; $i <= 6; $i++) {
            $property = $apartments->random();
            $ownerProfile = OwnerProfile::where('property_id', $property->id)->first();
            if (!$ownerProfile) continue;

            $issued = fake()->dateTimeBetween($fineStartDate, $fineEndDate);
            $due = clone $issued;
            $due->modify('+15 days');

            Fine::create([
                'user_id' => $ownerProfile->user_id,
                'property_id' => $property->id,
                'reason' => $fineReasons[$i % count($fineReasons)],
                'amount' => fake()->randomElement([35000.00, 50000.00, 75000.00]),
                'issued_date' => $issued->format('Y-m-d'),
                'due_date' => $due->format('Y-m-d'),
                'status' => fake()->randomElement(['pending', 'paid', 'appealed']),
            ]);
        }

        // Add 1 pending fine specifically for our Demo Propietario to see in the dashboard
        if ($demoProperty) {
            Fine::create([
                'user_id' => $demoUsers['Propietario']->id,
                'property_id' => $demoProperty->id,
                'reason' => 'Ruidos molestos y ruidos de construcción fuera del horario autorizado de mudanzas (Sábado por la tarde).',
                'amount' => 45000.00,
                'issued_date' => ($anchorYear - 1) . '-05-10',
                'due_date' => '2026-05-25',
                'status' => 'pending',
            ]);
        }

        // ─── SEED CONDO INCOMES FROM PAYMENTS & FINES ──────────────────────
        foreach (Payment::where('status', 'approved')->with(['property', 'commonExpense', 'user'])->get() as $payment) {
            $property = $payment->property;
            if (!$property) continue;

            CondoIncome::create([
                'condominium_id' => $property->condominium_id,
                'category' => 'gastos_comunes',
                'subcategory' => 'Pago Gasto Común - ' . ($payment->commonExpense->period ?? ''),
                'amount' => $payment->amount,
                'date' => $payment->payment_date ?? $payment->created_at->format('Y-m-d'),
                'description' => 'Pago registrado por ' . ($payment->user->name ?? 'Usuario') . ' - Ref: ' . ($payment->reference ?? 'N/A'),
                'property_id' => $property->id,
                'user_id' => $payment->user_id,
            ]);
        }

        foreach (Fine::where('status', 'paid')->with('property')->get() as $fine) {
            $property = $fine->property;
            if (!$property) continue;

            CondoIncome::create([
                'condominium_id' => $property->condominium_id,
                'category' => 'multas',
                'subcategory' => 'Ruidos molestos',
                'amount' => $fine->amount,
                'date' => $fine->issued_date,
                'description' => 'Multa: ' . $fine->reason,
                'property_id' => $fine->property_id,
                'user_id' => $fine->user_id,
            ]);
        }

        $this->command->info('Condo incomes seeded from payments and fines.');

        // ─── SEED CONDO EXPENSES FROM EXPENSE ITEMS ─────────────────────
        foreach (ExpenseItem::with('commonExpense')->get() as $item) {
            $commonExpense = $item->commonExpense;
            if (!$commonExpense) continue;

            $categoryMap = match ($item->category) {
                'Seguridad' => 'seguridad',
                'Aseo y Áreas Comunes' => 'mantencion',
                'Administración' => 'administracion',
                'Mantención Ascensores' => 'mantencion',
                'Consumo Eléctrico' => 'servicios_basicos',
                default => 'administracion',
            };

            $subcategoryMap = match ($item->category) {
                'Seguridad' => 'Guardias y Conserjería',
                'Aseo y Áreas Comunes' => 'Limpieza y Aseo',
                'Administración' => 'Honorarios',
                'Mantención Ascensores' => 'Ascensores',
                'Consumo Eléctrico' => 'Electricidad',
                default => $item->category,
            };

            CondoExpense::create([
                'condominium_id' => $commonExpense->condominium_id,
                'category' => $categoryMap,
                'subcategory' => $subcategoryMap,
                'amount' => $item->amount,
                'date' => $commonExpense->due_date,
                'description' => $item->description ?? $item->category,
                'common_expense_id' => $commonExpense->id,
                'expense_item_id' => $item->id,
            ]);
        }

        $this->command->info('Condo expenses seeded from expense items.');

        // ─── SEED ADDITIONAL RICHER FINANCIAL DATA ──────────────────────
        $this->command->info('Seeding additional rich financial transactions...');
        foreach ($condos as $condo) {
            // Additional Incomes
            // 1. Arriendos de Espacios Comunes
            CondoIncome::create([
                'condominium_id' => $condo->id,
                'category' => 'arriendo_espacios',
                'subcategory' => 'Quinchos',
                'amount' => 35000.00,
                'date' => '2026-03-12',
                'description' => 'Arriendo Quincho N°1 - Residente Apt 102',
                'property_id' => Property::where('condominium_id', $condo->id)->where('type', 'apartment')->inRandomOrder()->first()->id ?? null,
            ]);
            CondoIncome::create([
                'condominium_id' => $condo->id,
                'category' => 'arriendo_espacios',
                'subcategory' => 'Salón de eventos',
                'amount' => 60000.00,
                'date' => '2026-04-18',
                'description' => 'Arriendo Salón de Eventos - Copropietario Apt 105',
                'property_id' => Property::where('condominium_id', $condo->id)->where('type', 'apartment')->inRandomOrder()->first()->id ?? null,
            ]);

            // 2. Intereses por Mora
            CondoIncome::create([
                'condominium_id' => $condo->id,
                'category' => 'intereses_mora',
                'subcategory' => 'Gastos Comunes',
                'amount' => 5400.00,
                'date' => '2026-04-10',
                'description' => 'Cobro intereses por pago atrasado Gasto Común de Marzo',
            ]);

            // 3. Cuotas Extraordinarias
            CondoIncome::create([
                'condominium_id' => $condo->id,
                'category' => 'cuotas_extraordinarias',
                'subcategory' => 'Reparaciones mayores',
                'amount' => 50000.00,
                'date' => '2026-04-01',
                'description' => 'Aporte cuota extraordinaria aprobada en Asamblea Extraordinaria N°3',
            ]);

            // 4. Publicidad o Convenios
            CondoIncome::create([
                'condominium_id' => $condo->id,
                'category' => 'publicidad_convenio',
                'subcategory' => 'Máquinas expendedoras',
                'amount' => 25000.00,
                'date' => '2026-05-02',
                'description' => 'Comisión mensual por máquinas de café y bebidas en conserjería',
            ]);

            // 5. Otros Ingresos
            CondoIncome::create([
                'condominium_id' => $condo->id,
                'category' => 'otro',
                'subcategory' => 'Otros',
                'amount' => 18500.00,
                'date' => '2026-05-15',
                'description' => 'Venta de cartón, vidrio y plástico reciclado de la comunidad',
            ]);

            // Additional Expenses
            // 1. Sueldos y Honorarios (personal)
            CondoExpense::create([
                'condominium_id' => $condo->id,
                'category' => 'personal',
                'subcategory' => 'Administrador',
                'amount' => 450000.00,
                'date' => '2026-03-31',
                'description' => 'Honorarios mensuales de administración externa del condominio',
            ]);
            CondoExpense::create([
                'condominium_id' => $condo->id,
                'category' => 'personal',
                'subcategory' => 'Conserjes',
                'amount' => 850000.00,
                'date' => '2026-04-30',
                'description' => 'Pago de sueldos y cotizaciones del personal de conserjería',
            ]);

            // 2. Servicios Básicos
            CondoExpense::create([
                'condominium_id' => $condo->id,
                'category' => 'servicios_basicos',
                'subcategory' => 'Agua',
                'amount' => 125000.00,
                'date' => '2026-03-25',
                'description' => 'Consumo mensual de agua potable matriz común de la comunidad',
            ]);
            CondoExpense::create([
                'condominium_id' => $condo->id,
                'category' => 'servicios_basicos',
                'subcategory' => 'Electricidad',
                'amount' => 380000.00,
                'date' => '2026-04-20',
                'description' => 'Consumo eléctrico del alumbrado y ascensores comunes',
            ]);

            // 3. Seguridad
            CondoExpense::create([
                'condominium_id' => $condo->id,
                'category' => 'seguridad',
                'subcategory' => 'CCTV',
                'amount' => 95000.00,
                'date' => '2026-04-05',
                'description' => 'Mantenimiento preventivo mensual de cámaras y DVR central',
            ]);

            // 4. Limpieza y Aseo (limpieza)
            CondoExpense::create([
                'condominium_id' => $condo->id,
                'category' => 'limpieza',
                'subcategory' => 'Productos de limpieza',
                'amount' => 45000.00,
                'date' => '2026-04-12',
                'description' => 'Compra mensual de insumos de aseo y cloro para piscina',
            ]);

            // 5. Reparaciones (reparacion)
            CondoExpense::create([
                'condominium_id' => $condo->id,
                'category' => 'reparacion',
                'subcategory' => 'Cañerías',
                'amount' => 150000.00,
                'date' => '2026-05-10',
                'description' => 'Reparación de filtración urgente en cañería matriz de patio central',
            ]);

            // 6. Seguros (seguros)
            CondoExpense::create([
                'condominium_id' => $condo->id,
                'category' => 'seguros',
                'subcategory' => 'Incendio',
                'amount' => 220000.00,
                'date' => '2026-03-10',
                'description' => 'Pago póliza semestral de seguro obligatorio contra incendios de bienes comunes',
            ]);

            // 7. Fondo de Reserva (fondo_reserva)
            CondoExpense::create([
                'condominium_id' => $condo->id,
                'category' => 'fondo_reserva',
                'subcategory' => 'Emergencias',
                'amount' => 180000.00,
                'date' => '2026-04-15',
                'description' => 'Aporte al fondo de reserva para contingencias futuras',
            ]);
        }

        $this->command->info('Infractions and Fines seeded.');

        // 8. Generate support Tickets
        $ticketTemplates = [
            [
                'title' => 'Filtración de agua en ducto de baño',
                'description' => 'Se observa humedad en el cielo falso del baño principal. Gotea constantemente y la mancha de humedad ha crecido en las últimas 24 horas. Solicitamos el envío de un técnico de mantención a la brevedad.',
                'cat' => 'Fontanería e Instalaciones Sanitarias',
                'priority' => 'high',
            ],
            [
                'title' => 'Citófono no suena al recibir llamadas de conserjería',
                'description' => 'El citófono ubicado en el comedor no timbra cuando llaman desde conserjería. Los conserjes indican que da tono pero adentro no suena nada. Por favor revisar cableado del departamento.',
                'cat' => 'Security and Conserjería', // will resolve by name matching or fallback
                'priority' => 'medium',
            ],
            [
                'title' => 'Ampolleta quemada en pasillo del piso 3',
                'description' => 'La luz común fuera de la puerta de mi departamento se encuentra totalmente quemada desde el fin de semana pasado. Agradecemos su cambio rápido ya que queda muy oscuro.',
                'cat' => 'Electricidad e Iluminación',
                'priority' => 'low',
            ],
            [
                'title' => 'Portón vehicular de acceso norte abre con extrema lentitud',
                'description' => 'El portón automático de salida de vehículos tarda el doble de tiempo de lo normal en abrir. A veces se frena a mitad de recorrido y los sensores de seguridad fallan. Requiere revisión técnica.',
                'cat' => 'Ascensores y Portones Automáticos',
                'priority' => 'high',
            ],
            [
                'title' => 'Extractor de aire de cocina común del quincho no enciende',
                'description' => 'Hicimos uso del quincho 1 el día de ayer y nos percatamos de que el extractor de humos principal está apagado y el interruptor no responde. Se llena de humo el área común.',
                'cat' => 'Climatización y Ventilación',
                'priority' => 'low',
            ],
            [
                'title' => 'Solicitud de copia de llave inteligente / tag de acceso',
                'description' => 'Necesitamos adquirir dos tags de acceso adicionales para miembros de la familia que se mudaron recientemente. Solicitamos indicaciones para el pago y la entrega del chip encriptado.',
                'cat' => 'Administración y Convivencia',
                'priority' => 'medium',
            ],
        ];

        // Seed 12 support tickets
        $colaboradores = User::role('Colaborador')->get();
        for ($i = 1; $i <= 12; $i++) {
            $property = $apartments->random();
            $residentProfile = ResidentProfile::where('property_id', $property->id)->first();
            $creatorUser = $residentProfile ? $residentProfile->user : User::role('Propietario')->inRandomOrder()->first();
            if (!$creatorUser) continue;

            $tpl = $ticketTemplates[$i % count($ticketTemplates)];
            $status = fake()->randomElement(['open', 'in_progress', 'resolved', 'closed']);
            
            $assignedTo = null;
            if ($status !== 'open') {
                $assignedTo = $colaboradores->random()->id;
            }

            $resolvedAt = null;
            $notes = null;
            if (in_array($status, ['resolved', 'closed'])) {
                $resolvedAt = fake()->dateTimeBetween('-20 days', 'now');
                $notes = 'Incidencia atendida y resuelta por conserjería/técnico contratado. Se aplicó solución correctiva y se validó conformidad de los residentes.';
            }

            $catModel = TicketCategory::where('name', 'like', "%{$tpl['cat']}%")->first() ?? $categories[0];

            Ticket::create([
                'property_id' => $property->id,
                'created_by' => $creatorUser->id,
                'assigned_to' => $assignedTo,
                'category_id' => $catModel->id,
                'title' => $tpl['title'],
                'description' => $tpl['description'],
                'priority' => $tpl['priority'],
                'status' => $status,
                'resolved_at' => $resolvedAt,
                'resolution_notes' => $notes,
            ]);
        }

        // Add 1 active high priority ticket specifically for our Demo Residente
        if ($demoProperty) {
            $catPlumbing = TicketCategory::where('name', 'like', '%Fontanería%')->first() ?? $categories[0];
            
            Ticket::create([
                'property_id' => $demoProperty->id,
                'created_by' => $demoUsers['Residente']->id,
                'assigned_to' => $demoUsers['Colaborador']->id, // assigned to our demo conserje!
                'category_id' => $catPlumbing->id,
                'title' => 'Filtración de agua activa en cañería del calefont',
                'description' => 'Hay una filtración constante en la manguera flexible de entrada de agua fría del calefont en la logia. Está escurriendo agua hacia la pared. Solicitamos un gasfiter autorizado de urgencia.',
                'priority' => 'high',
                'status' => 'in_progress',
                'resolved_at' => null,
                'resolution_notes' => null,
            ]);
        }

$this->command->info('Support tickets seeded.');

        // 9/10. Generate Announcements & Internal Messages
        $this->call(AnnouncementsSeeder::class);
        $this->call(MessagesSeeder::class);

        // Seed facilities for condominiums
        $this->call(FacilitiesSeeder::class);

        // 7. Seeders extendidos según Análisis v2
        $this->call([
            BudgetSeeder::class,
            CommonExpensePeriodSeeder::class,
            SupplyOrderSeeder::class,
            ChecklistSeeder::class,
            UnitProfileSeeder::class,
            FineAndMoraSeeder::class,
            AdministratorProfileSeeder::class,
            PayrollBookingsSeeder::class,
            CommonExpensePeriodReceiptSeeder::class,
            DemoTicketsSeeder::class,
        ]);

        $this->command->info('Database seeding completed with gorgeous hyperrealistic data!');
    }
}

