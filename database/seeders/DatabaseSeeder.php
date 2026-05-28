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
use App\Models\Announcement;
use App\Models\CondoIncome;
use App\Models\CondoExpense;
use App\Models\Message;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Run Spatie Role and Permission Seeder
        $this->call([
            RolePermissionSeeder::class,
        ]);

        $this->command->info('Roles and permissions seeded.');

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
        ]);

        EmployeeProfile::create([
            'user_id' => $employeeSupervisor->id,
            'position' => 'Jefe de Conserjería',
            'supervisor_id' => null,
            'contract_type' => 'indefinido',
            'shift' => 'rotativo',
            'salary' => 950000.00,
            'hire_date' => '2024-06-01',
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

            for ($i = 1; $i <= 20; $i++) {
                $aptNumber = 'Apt ' . ($i + 100);
                
                $property = Property::create([
                    'condominium_id' => $condo->id,
                    'type' => 'departamento',
                    'number' => $aptNumber,
                    'block' => 'Torre A',
                    'floor' => intval(ceil($i / 4)),
                    'area_sqm' => 60.50 + ($i * 2.5),
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
                $ownerRut = fake()->numberBetween(10, 25) . '.' . fake()->numberBetween(100, 999) . '.' . fake()->numberBetween(100, 999) . '-' . fake()->randomElement(['0','1','2','3','4','5','6','7','8','9','K']);

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
                    $resRut = fake()->numberBetween(10, 25) . '.' . fake()->numberBetween(100, 999) . '.' . fake()->numberBetween(100, 999) . '-' . fake()->randomElement(['0','1','2','3','4','5','6','7','8','9','K']);

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
                    'type' => 'estacionamiento',
                    'number' => 'E-' . $i,
                    'block' => 'Subterráneo -1',
                    'floor' => null,
                    'area_sqm' => 12.50,
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
                    'type' => 'bodega',
                    'number' => 'B-' . $i,
                    'block' => 'Subterráneo -1',
                    'floor' => null,
                    'area_sqm' => 6.00,
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
        $periods = ['2026-03', '2026-04', '2026-05'];
        $expenseCategories = [
            ['category' => 'Seguridad', 'description' => 'Servicios de conserjería y vigilancia 24/7 de empresa contratada.'],
            ['category' => 'Aseo y Áreas Comunes', 'description' => 'Insumos de limpieza y personal de aseo diario.'],
            ['category' => 'Administración', 'description' => 'Honorarios de la administración del condominio.'],
            ['category' => 'Mantención Ascensores', 'description' => 'Contrato mensual Schindler y reparaciones menores.'],
            ['category' => 'Consumo Eléctrico', 'description' => 'Iluminación de pasillos comunes y estacionamientos.']
        ];

        foreach ($condos as $condo) {
            foreach ($periods as $periodIdx => $period) {
                // March & April are paid. May is pending.
                $isCurrent = ($period === '2026-05');
                $status = $isCurrent ? 'pending' : 'paid';
                $dueDate = match ($period) {
                    '2026-03' => '2026-04-05',
                    '2026-04' => '2026-05-05',
                    '2026-05' => '2026-06-05',
                };

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
                            $paymentDate = fake()->dateTimeBetween('2026-05-15', 'now')->format('Y-m-d');
                            $method = fake()->randomElement(['transferencia', 'tarjeta_debito']);
                            $ref = 'TXN-' . fake()->numberBetween(100000, 999999);
                        } else {
                            $paymentStatus = 'pending';
                        }
                    }

                    Payment::create([
                        'user_id' => $ownerProfile->user_id,
                        'property_id' => $property->id,
                        'common_expense_id' => $commonExpense->id,
                        'amount' => $aliquot,
                        'payment_date' => $paymentDate ?? now()->format('Y-m-d'),
                        'payment_method' => $method,
                        'reference' => $ref,
                        'status' => $paymentStatus,
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
        $apartments = Property::where('type', 'departamento')->get();
        for ($i = 1; $i <= 6; $i++) {
            $property = $apartments->random();
            $ownerProfile = OwnerProfile::where('property_id', $property->id)->first();
            if (!$ownerProfile) continue;

            $issued = fake()->dateTimeBetween('-2 months', 'now');
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
                'issued_date' => '2026-05-10',
                'due_date' => '2026-05-25',
                'status' => 'pending',
            ]);
        }

        // ─── SEED CONDO INCOMES FROM PAYMENTS & FINES ──────────────────────
        foreach (Payment::where('status', 'approved')->get() as $payment) {
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

        foreach (Fine::where('status', 'paid')->get() as $fine) {
            $property = $fine->property;
            if (!$property) continue;

            CondoIncome::create([
                'condominium_id' => $property->condominium_id,
                'category' => 'multas',
                'subcategory' => 'Multa por infracción',
                'amount' => $fine->amount,
                'date' => $fine->issued_date,
                'description' => 'Multa: ' . $fine->reason,
                'property_id' => $fine->property_id,
                'user_id' => $fine->user_id,
            ]);
        }

        $this->command->info('Condo incomes seeded from payments and fines.');

        // ─── SEED CONDO EXPENSES FROM EXPENSE ITEMS ─────────────────────
        foreach (ExpenseItem::all() as $item) {
            $commonExpense = $item->commonExpense;
            if (!$commonExpense) continue;

            CondoExpense::create([
                'condominium_id' => $commonExpense->condominium_id,
                'category' => 'administracion',
                'subcategory' => $item->category,
                'amount' => $item->amount,
                'date' => $commonExpense->due_date,
                'description' => $item->description ?? $item->category,
                'common_expense_id' => $commonExpense->id,
                'expense_item_id' => $item->id,
            ]);
        }

        $this->command->info('Condo expenses seeded from expense items.');

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

        // 9. Generate Announcements
        $announcementsData = [
            [
                'title' => 'Mantención Semestral de Calderas y Corte de Agua Caliente',
                'content' => 'Estimados vecinos, les informamos que el día miércoles 27 de mayo se realizará la mantención semestral reglamentaria a la caldera central del edificio. Debido a esto, el servicio de agua caliente se suspenderá entre las 08:30 y las 14:00 horas. Agradecemos su comprensión.',
                'priority' => 'high',
            ],
            [
                'title' => 'Campaña de Vacunación contra la Influenza en Sala Multiuso',
                'content' => 'Nos complace informar que, gracias a gestiones con el CESFAM comunal, se realizará un operativo de vacunación escolar y de adultos mayores contra la influenza el próximo sábado 30 de mayo de 09:00 a 13:00 en la sala multiuso. Vacunas gratuitas e ilimitadas para copropietarios.',
                'priority' => 'normal',
            ],
            [
                'title' => 'Modificación del Reglamento Interno sobre Mudanzas y Ruidos',
                'content' => 'El Comité de Administración recuerda a todos los residentes que las mudanzas solo están permitidas de lunes a viernes de 09:00 a 18:00 y sábados de 09:00 a 14:00. Cualquier mudanza fuera de este horario o que no cuente con las lonas de protección de ascensor instaladas será sancionada.',
                'priority' => 'normal',
            ],
            [
                'title' => 'Pintura y Reparación de Fachada del Acceso Peatonal',
                'content' => 'Durante toda esta semana se realizarán trabajos de hidrolavado y pintura en el portal de acceso principal del condominio. Rogamos transitar con precaución y respetar las señales de advertencia de pintura fresca colocadas por el personal de obras.',
                'priority' => 'low',
            ],
        ];

        foreach ($condos as $condo) {
            foreach ($announcementsData as $ann) {
                Announcement::create([
                    'condominium_id' => $condo->id,
                    'created_by' => $demoUsers['Administrador']->id,
                    'title' => $ann['title'],
                    'content' => $ann['content'],
                    'priority' => $ann['priority'],
                    'published_at' => now()->subDays(fake()->numberBetween(1, 10)),
                    'expires_at' => now()->addDays(15),
                ]);
            }
        }

        $this->command->info('Community announcements seeded.');

        // 10. Generate Internal Messages
        $messageSubjectContent = [
            ['subject' => 'Consulta sobre cobro de Gasto Común de Mayo', 'content' => 'Estimado Administrador, le escribo para consultar sobre un recargo por concepto de mantención extraordinaria reflejado en mi última liquidación. ¿Podría facilitarme el detalle de dicha factura? Atentamente.'],
            ['subject' => 'Reserva de Quincho aprobada', 'content' => 'Hola, le informamos que su solicitud para la reserva del Quincho N°2 para el próximo viernes en la tarde ha sido aprobada con éxito. Recuerde respetar el aforo máximo de 15 personas y entregar limpio el sector a medianoche.'],
            ['subject' => 'Aviso de reparación de ascensor', 'content' => 'Estimado Presidente del Comité, le escribo para avisar que el técnico de Otis ya resolvió el problema del sensor de puerta en el ascensor 1 y quedó funcionando al 100% en fase de pruebas.'],
            ['subject' => 'Reporte de ruido molesto / Vecino Depto 402', 'content' => 'Hola conserjería, quería reportar que en el departamento 402 tienen música en volumen muy alto y ruidos de taconeo molestos. Es día de semana y ya son pasadas las 12:30 AM. ¿Podrían llamarlos? Gracias.'],
        ];

        // Seed some random messages
        $allUsers = User::all();
        for ($i = 0; $i < 8; $i++) {
            $sender = $allUsers->random();
            $receiver = $allUsers->where('id', '!=', $sender->id)->random();
            if (!$sender || !$receiver) continue;

            $template = $messageSubjectContent[$i % count($messageSubjectContent)];

            Message::create([
                'sender_id' => $sender->id,
                'receiver_id' => $receiver->id,
                'subject' => $template['subject'],
                'content' => $template['content'],
                'is_read' => fake()->boolean(60),
                'read_at' => fake()->dateTimeBetween('-10 days', 'now'),
            ]);
        }

        // Add 1 unread message specifically for our Demo Propietario from the Admin
        Message::create([
            'sender_id' => $demoUsers['Administrador']->id,
            'receiver_id' => $demoUsers['Propietario']->id,
            'subject' => 'Notificación de Regularización de Pago Pendiente',
            'content' => 'Estimado propietario, le saludamos cordialmente. Le escribimos para recordarle amablemente que mantiene un saldo pendiente por concepto de multas de convivencia del mes anterior. Le solicitamos regularizar su situación en el portal de pagos en línea.',
            'is_read' => false,
            'read_at' => null,
        ]);

        $this->command->info('Internal communication messages seeded.');
        $this->command->info('Database seeding completed with gorgeous hyperrealistic data!');
    }
}
