# 🤖 AI Agent Profile & Testing Philosophy - RedVecino & MiVecino

Este documento actúa como guía de inducción, perfil de desarrollo y compendio de mejores prácticas para los agentes de Inteligencia Artificial que trabajen en este repositorio. Define las directrices técnicas, la filosofía de desarrollo y la metodología de aseguramiento de calidad (QA) del proyecto.

---

## ⚖️ 1. Filosofía de Testing de Software

Adoptamos un enfoque pragmático del testing enfocado en **prevenir la incertidumbre y habilitar el refactoring seguro**, en lugar de perseguir métricas de cobertura vacías.

### 1.1 Objetivo del Testing
*   **Malla de Seguridad:** Las pruebas deben actuar como una red protectora que detecte errores antes de que lleguen a los usuarios finales.
*   **Seguridad en Cambios:** Un cambio o refactorización del código de producción nunca debería obligar a reescribir decenas de tests, a menos que el contrato público (la API o la lógica de negocio esperada) haya cambiado explícitamente.

### 1.2 Tipologías de Tests y Priorización (El Trofeo de Testing)
*   **Pruebas de Integración (Prioridad Alta):** Son el núcleo de nuestro aseguramiento. Verifican el comportamiento real de múltiples componentes trabajando juntos (ej. enrutamiento HTTP, validadores, ORM Eloquent y persistencia en base de datos). Priorizamos estas pruebas sobre las unitarias porque otorgan mayor confianza de que el sistema funciona bajo condiciones reales.
*   **Pruebas Unitarias (Prioridad Media):** Se reservan para lógica pura y aislada, cálculos matemáticos específicos u operaciones independientes de bases de datos o servicios externos.
*   **Pruebas End-to-End - E2E (Prioridad Media):** Simulan el comportamiento completo del usuario desde la UI interactiva (React) hasta el backend (Laravel).
*   **Pruebas Manuales (Prioridad Baja):** Valiosas para auditorías visuales y de diseño (UI/UX), pero poco scalables para el flujo de integración continua.

### 1.3 La Trampa de los Mocks
*   **Evitar Mocks Excesivos:** Los *mocks* y *stubs* a menudo simplifican la realidad de forma peligrosa y enmascaran errores de integración en producción.
*   **Uso de Entornos Reales:** Siempre que sea posible, probamos contra bases de datos reales populated (usando SQLite en memoria en tests o mediante seeders reales). Esto asegura que restricciones reales de base de datos (claves foráneas, índices únicos, tipos de datos) se ejecuten y validen en el test.

### 1.4 La Trampa del Coverage y Foco en "Unhappy Paths"
*   **No al 100% Artificial:** El 100% de cobertura lineal no garantiza la ausencia de bugs.
*   **Unhappy Paths First:** Es prioritario escribir tests que validen cómo reacciona el sistema ante entradas incorrectas, límites de rango, desbordamientos de datos, ataques de escalación de privilegios y flujos erróneos antes de enfocarse en el "camino feliz".

### 1.5 Rigor en el Código de Test
*   El código de pruebas es tan importante como el código de producción. Debe ser legible, estructurado de forma declarativa, y fácil de mantener.

---

## 🛠️ 2. Implementación Práctica en RedVecino

Nuestra suite de pruebas refleja estrictamente esta filosofía. A continuación, se detallan ejemplos concretos para guiar futuras implementaciones:

### 2.1 Feature / Integration Tests (`tests/Feature`)
Utilizamos las capacidades integradas de Laravel para interactuar con la base de datos de pruebas mediante el rasgo `RefreshDatabase`, poblando el estado mediante semilla determinista (`$this->seed()`).

#### A) Validación de Reglas de Negocio en Finanzas
En [CondoFinancesTest.php](file:///C:/xampp/htdocs/redvecino/tests/Feature/CondoFinancesTest.php), validamos cruzadamente que el motor contable rechace de forma segura cualquier dato inconsistente:
*   **Validación de Límites en Importes (`Amount Boundaries`):**
    *   Montos de `$0` fallan con error de validación (HTTP `422`).
    *   Montos negativos (ej. `-150000`) fallan con error de validación (HTTP `422`).
    *   Valores no numéricos (cadenas de texto) fallan con error de validación (HTTP `422`).
*   **Consistencia del Catálogo Contable (Estructuras):**
    *   No se puede registrar un ingreso o egreso contable con categorías inexistentes.
    *   No se puede asociar una subcategoría a una categoría superior que no le corresponde (ej. intentar guardar la subcategoría `'Quinchos'` bajo la categoría `'multas'`).

#### B) Matriz de Permisos y RBAC Seguro
En [SecurityRbacMatrixTest.php](file:///C:/xampp/htdocs/redvecino/tests/Feature/SecurityRbacMatrixTest.php), evaluamos a fondo la matriz de seguridad cruzando los 6 roles de la plataforma frente a todos los accesos administrativos del dashboard para asegurar el aislamiento estricto de datos.

#### C) Ciclo de Vida de Incidencias e Aislamiento
En [IncidenciasLifecycleTest.php](file:///C:/xampp/htdocs/redvecino/tests/Feature/IncidenciasLifecycleTest.php), verificamos que los copropietarios e inquilinos no puedan visualizar ni interactuar con incidencias de otros departamentos, validando el aislamiento relacional multi-inquilino.

#### D) Pruebas en Sintaxis Pest v3 (`*Pest.php`)
Nuevas suites de integración se escriben en Pest v3. Los archivos usan sufijo `*Pest.php` y se declaran en `phpunit.xml` con `<directory suffix="Pest.php">tests/Feature</directory>`.

Archivos existentes:
*   [FinanzasConsistenciaPest.php](file:///C:/xampp/htdocs/redvecino/tests/Feature/FinanzasConsistenciaPest.php) — 15 tests: montos límite, categorías inválidas, subcategorías, consistencia CRUD.
*   [QuorumExtremosPest.php](file:///C:/xampp/htdocs/redvecino/tests/Feature/QuorumExtremosPest.php) — 11 tests: 50% exacto, 49.99%, 0 asistentes, duplicados, cross-condo, fallback.
*   [RBACMatrizCompletaPest.php](file:///C:/xampp/htdocs/redvecino/tests/Feature/RBACMatrizCompletaPest.php) — 12 tests: matriz 6 roles × ~10 endpoints.
*   [AislamientoMultiCondoPest.php](file:///C:/xampp/htdocs/redvecino/tests/Feature/AislamientoMultiCondoPest.php) — 8 tests: tickets, incomes, expenses, pagos, multas, anuncios, common_expenses.
*   [CoeficienteFallbackPest.php](file:///C:/xampp/htdocs/redvecino/tests/Feature/CoeficienteFallbackPest.php) — 7 tests: cadena completa de fallback.
*   [ConcurrenciaFinancieraPest.php](file:///C:/xampp/htdocs/redvecino/tests/Feature/ConcurrenciaFinancieraPest.php) — 8 tests con `->repeat(3)`/`->repeat(5)`: stress CRUD concurrente.
*   [ConfigMoraMotorPest.php](file:///C:/xampp/htdocs/redvecino/tests/Feature/ConfigMoraMotorPest.php) — 3 tests (`toEqual`): tasa de mora configurada (2.0%→2000), fallback 1.5% (null→1500) y umbral de días de atraso (`due_day`).
*   [CommonExpenseLegacyCharPest.php](file:///C:/xampp/htdocs/redvecino/tests/Feature/CommonExpenseLegacyCharPest.php) — Tests de caracterización para el motor de gastos comunes y unificación aditiva.

Seeders del demo (deterministas e idempotentes, registrados en `DatabaseSeeder::run()`): `FacilitiesSeeder`, `AnnouncementsSeeder`, `MessagesSeeder` (desacoplados), `PayrollBookingsSeeder` (nómina + liquidaciones + bookings), `CommonExpensePeriodReceiptSeeder` (boletas Fase 2 con mora) y `DemoTicketsSeeder` (tickets de residentes demo).

---

## 📊 Estado Actual de la Suite de Pruebas (Verificado en Verde)
- **Backend (PHP / Laravel / Pest v3):** 486 passed (2534 assertions) con `php artisan test`.
- **Frontend (React / Vitest):** 178 passed con `npm run test:frontend`.
- **Verificación obligatoria:** Todo cambio debe mantener la suite 100% en verde antes de cada commit.

---

## 📋 3. Directrices Obligatorias para Futuros Agentes de IA

Si eres un agente de IA trabajando en este proyecto, **debes seguir estas reglas sin excepción**:

1.  **Escribir Tests para Nuevas Funcionalidades:** Toda nueva API, endpoint o regla de negocio crítica debe venir acompañada de sus respectivos Feature / Integration tests.
2.  **Testear Caminos de Error Primero:** Al añadir validación, escribe casos de test para datos corruptos, nulos, desbordados o de roles no autorizados antes de verificar el camino exitoso.
3.  **Verificación Previa al Cierre:** Nunca des por concluida una tarea sin haber ejecutado exitosamente la suite completa de pruebas:
    ```bash
    php artisan test
    ```
4.  **Preservación de Seeders:** Si añades o modificas columnas en la base de datos, actualiza de inmediato `DatabaseSeeder.php` y los archivos de factory asociados para que la suite de test siga levantando con datos de alta fidelidad.
5.  **Mantener la Integridad Histórica:** No borres registros ni destruyas tests existentes para "hacer pasar" un cambio rápido. Adapta la lógica o expande la suite de forma orgánica.
6.  **Pest v3 para Nuevos Tests:** Toda nueva prueba de integración debe escribirse en sintaxis Pest v3 (`describe()`, `it()`, `dataset()`, `->repeat(N)`) con sufijo `*Pest.php`.
7.  **`phpunit.xml`:** Debe tener `<directory suffix="Pest.php">tests/Feature</directory>` para descubrir archivos `*Pest.php`.
8.  **`uses()` Global:** `uses(Tests\TestCase::class)` se declara SOLO en `tests/Pest.php` (global `->in('Feature')`), nunca en archivos individuales.
9.  **Float vs Int en Pest:** Usar `->toEqual()` (igualdad suelta `==`) para valores decimales y `->toBe()` (identidad estricta `===`) para int/string/bool. `80000.0 !== 80000` en PHP.
10. **Datasets en Pest:** No usar closures que llamen `app()` o servicios — se evalúan en carga de clase antes del bootstrap. Preferir bucles inline dentro del test.
11. **Campos Obligatorios:** `payment_method` es requerido en `Payment::create()`. `created_by` es requerido en tickets y announcements.

---

## 🔄 4. Flujo de Trabajo y Sincronización con Repositorio de Prototipos (`redvecino_beta`)

Para la colaboración con el dueño del proyecto que itera rápidamente en un repositorio separado con asistencia de IA:

* **Repositorio de Referencia/Prototipo:** `https://github.com/ambiado/redvecino_beta.git`
* **Ubicación Local Recomendada:** Fuera de este repositorio (ej. `C:\xampp\htdocs\redvecino_beta`) para evitar anidación de repositorios Git, conflictos en el staging o colisiones de dependencias.
* **Modelo Conceptual:** El repositorio `redvecino_beta` actúa como una **especificación funcional viva / mockup interactivo**, mientras que este repositorio (`redvecino`) es la **implementación de producción** (arquitectura robusta, multi-inquilino, RBAC y cobertura total de tests).

### Ciclo de Portado e Integración:
1. **Pull en el Prototipo:** Actualizar la copia local de `redvecino_beta` (`git pull`).
2. **Análisis de Requerimientos:** Identificar las nuevas pantallas, campos o flujos de usuario ideados por el dueño.
3. **Implementación Robusta:** Trasladar la UI y lógica a los componentes React/Inertia y controladores de Laravel en `redvecino`, aplicando validaciones, RBAC y multi-tenancy.
4. **Protección TDD:** Escribir los tests de integración correspondientes en sintaxis Pest (`tests/Feature/*Pest.php`).
5. **Verificación Estricta:** Ejecutar y validar que la suite completa pase al 100%:
   ```bash
   php artisan test
   npm run test:frontend
   ```

---

## 🏗️ 5. Estándares de Arquitectura Limpia, No Monolítica y Plan Maestro TODO

Para mantener la máxima mantenibilidad y evitar la degradación del código:

### 5.1 Principios de Código No Monolítico y Cero Código Espagueti
1. **Backend en Capas Estrictas:**
   - **Controladores Delgados (*Skinny Controllers*):** Máximo 80-100 líneas. Solo orquestan la petición, delegan en FormRequests y devuelven respuestas Inertia/JSON.
   - **Validación Aislada:** Cero validaciones `$request->validate([...])` inline en controladores; usar siempre **FormRequests dedicados** (`app/Http/Requests/*`).
   - **Lógica de Negocio en Servicios:** Cálculos complejos (mora, quórums, liquidaciones, aprobaciones masivas) residen en clases `app/Services/*`.
   - **Aislamiento Multi-Condominio Automático:** Toda consulta a base de datos debe pasar por scopes locales o filtrar explícitamente por `condominium_id`.
2. **Frontend Modular y Atómico (React 18 + Inertia):**
   - **Cero Componentes Monolíticos:** Dividir vistas extensas en subcomponentes atómicos (`Components/*`, `Modals/*`, `Hooks/*`).
   - **Lógica Extraída en Custom Hooks:** Manejo de formularios, llamadas API y estados complejos encapsulados en `resources/js/Hooks/*`.
   - **Estilo de Marca Estricto:** **RedVecino** (`#0F2557` Azul Marino, `#00A896` Teal) para web administrativa; **MiVecino** (`#72B043` Verde Césped, `#EC7A08` Naranja) para web-app móvil. Tipografía `Montserrat`.
3. **Seeders Modulares y Deterministas:**
   - Cada nuevo módulo **debe** contar con su propio seeder (`database/seeders/*Seeder.php`), idempotente, determinista y registrado en `DatabaseSeeder::run()`.
4. **Desarrollo Guiado por Pruebas (TDD):**
   - Nuevos endpoints acompañados de tests `tests/Feature/*Pest.php` probando caminos felices y *unhappy paths* (montos negativos, inyecciones, violaciones RBAC).
   - Componentes frontend acompañados de tests unitarios `resources/js/**/*.test.{js,jsx}` en Vitest.

---

### 📋 5.2 Lista Maestra de Tareas (Master TODO)

#### 🚀 FASE 1: Operaciones de RRHH, Amonestaciones y Pedidos de Insumos (Prioridad P0)
- [x] **1.1 Amonestaciones de Colaboradores (Backend):**
  - [x] Migración `colaborador_amonestaciones` / `employee_sanctions`.
  - [x] Modelo `EmployeeSanction` con relaciones y storage seguro.
  - [x] `EmployeeSanctionRequest` con validaciones de tipo de archivo y fechas.
  - [x] `EmployeeSanctionController` (CRUD con RBAC).
  - [x] Suite de pruebas Pest: `tests/Feature/EmployeeSanctionsPest.php`.
- [x] **1.2 Amonestaciones de Colaboradores (Frontend):**
  - [x] Subcomponente integrado dentro de la ficha de colaboradores.
  - [x] Modal de registro con subida de archivo y visor de adjuntos.
- [x] **1.3 Pedidos de Insumos y Aprobación Masiva (Backend):**
  - [x] Migración `supply_orders` (`condominium_id`, `category`, `items`, `status`, `expense_id`).
  - [x] `SupplyOrderRequest` y `SupplyOrderController` con endpoints de cambio de estado y aprobación masiva.
  - [x] Integración transaccional con el catálogo de `expenses`.
  - [x] Suite de pruebas Pest: `tests/Feature/PedidosInsumosEstadosPest.php`.
- [x] **1.4 Pedidos de Insumos (Frontend):**
  - [x] Formulario de solicitud de insumos en la vista móvil de colaboradores.
  - [x] Bandeja de aprobación de compras tipo carrito en el panel de administrador.
- [x] **1.5 Seeders Fase 1:**
  - [x] Crear `EmployeeSanctionsSeeder.php`, `SupplyOrderSeeder.php` y `CommercialDemoSeeder.php` integrados en `DatabaseSeeder.php`.

#### 🏢 FASE 2: Gestión de Unidades, Residentes y Tenencia Responsable (Prioridad P1)
- [x] **2.1 Estacionamientos y Patentes Dinámicas:**
  - [x] Soporte de asignación múltiple de estacionamientos y patentes por unidad.
  - [x] Validación y gestión dinámica en `UnitDetailModal360.jsx`.
  - [x] Suite Pest: `tests/Feature/EstacionamientosYResidentesLimitePest.php`.
- [x] **2.2 Límite de Residentes por Unidad:**
  - [x] Regla de validación estricta de **máximo 3 residentes autorizados** en `UnitProfileController`.
  - [x] Suite Pest: `tests/Feature/EstacionamientosYResidentesLimitePest.php`.
- [x] **2.3 Mascotas y Registro Sanitario (Ley de Copropiedad):**
  - [x] Migración `unit_pets` con microchip oficial de 15 dígitos y ficha médica.
  - [x] Visualización en la ficha de propiedad bajo demanda (*Supermodal 360°*).
  - [x] Suite Pest: `tests/Feature/MascotasRegistroSanitarioPest.php`.

#### 🏊 FASE 3: Checklist de Amenidades y Entrega de Áreas Comunes (Prioridad P1)
- [x] **3.1 Checklist de Inspección (Backend):**
  - [x] Migración `facility_checklists` con items status, fotos y control de garantías.
  - [x] `FacilityChecklistController` con endpoints de Check-in y Check-out vinculado a reservas (`Booking`).
  - [x] Suite Pest: `tests/Feature/ChecklistAmenidadesPest.php`.
- [x] **3.2 Checklist de Inspección (Frontend):**
  - [x] Modal interactivo `AmenityChecklistModal.jsx` con switches de estado (OK/Dañado) y carga de evidencia fotográfica.
  - [x] Test frontend en Vitest: `AmenityChecklistModal.test.jsx`.
- [x] **3.3 Seeders Fase 3:**
  - [x] Crear `ChecklistsAmenidadesSeeder.php`.

#### 💬 FASE 4: Ecosistema de Comunicación y Encomiendas (Prioridad P2)
- [x] **4.1 Desacople de Encomiendas:**
  - [x] Módulo dedicado de encomiendas de conserjería (`PackageCustody`) con captura fotográfica y firma digital.
  - [x] Suite Pest: `tests/Feature/EncomiendasConserjeriaPest.php`.
- [x] **4.2 Mensajería Interna (Alternativa a WhatsApp):**
  - [x] Chat directo Conserjería $\leftrightarrow$ Unidad con privacidad de teléfonos.
  - [x] Canal oficial de Administración y canal privado del Comité.
  - [x] Suite Pest: `tests/Feature/MensajeriaInternaSeguraPest.php`.

#### 🗳️ FASE 5: Asambleas y Votaciones por Unidad (Prioridad P2)
- [x] **5.1 Votaciones Formales (Ley 21.442):**
  - [x] Motor de votación por Unidad (1 voto por departamento con alícuota proporcional).
  - [x] Registro y visualización en `MeetingsMinutes.jsx` con cálculo de quórum legal.
  - [x] Seeder determinista: `AssemblyVotingsSeeder.php`.
  - [x] Suite Pest: `tests/Feature/AsambleasVotacionesLegalesPest.php`.

#### 💎 FASE 6: Pulido UX, Perfil Admin y Auditorías de Calidad (Prioridad P3)
- [ ] **6.1 Perfil de Administrador:**
  - [ ] Subida de avatar y actualización de datos de contacto del administrador.
- [ ] **6.2 Auditoría de Calidad Completa:**
  - [ ] Auditoría de Rendimiento, Seguridad, SEO/Accesibilidad y Buenas Prácticas Laravel.
  - [ ] Verificación final de suite 100% en verde (>700 tests combinados).
