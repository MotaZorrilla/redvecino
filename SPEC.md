# RedVecino & MiVecino - Especificación Técnica del Proyecto (Condominio-PRO)

Este proyecto desarrolla una suite tecnológica integrada para la gestión, administración y vida comunitaria en condominios, estructurada en dos grandes interfaces de usuario alineadas bajo un ecosistema común:
1. **RedVecino:** Plataforma web corporativa y panel de administración avanzado para administradores y comités de copropiedad. Robustez, analítica y control total.
2. **MiVecino:** Aplicación móvil (Web-App responsive) para residentes y copropietarios. Interfaz cercana, amigable, simple e interactiva.

---

## 🎨 Sistema de Identidad Visual (Design Board)

Basado en el manual de identidad del proyecto, las especificaciones estéticas obligatorias a implementar en el stack React (Tailwind v4 + shadcn/ui) son:

*   **Tipografía Oficial:** `Montserrat` (Cargada desde Google Fonts). Una tipografía geométrica, moderna y de alta legibilidad.
*   **Slogan de Marca:** *"Más que vecinos, somos comunidad."*
*   **Paleta de Colores Oficial:**
    *   🔵 **Azul Marino Profundo** (`#0F2557`): Color de estructura, base para el portal web de RedVecino.
    *   🟢 **Teal / Turquesa** (`#00A896`): Color moderno de enlace tecnológico.
    *   🍏 **Verde Césped** (`#72B043`): Identidad para MiVecino, representa cercanía y ecología.
    *   🍊 **Naranja Vibrante** (`#EC7A08`): Color de acento para notificaciones, llamados a la acción (CTA) e incidencias urgentes.
    *   🟣 **Morado/Violeta** (`#7A5299`): Categorización de módulos sociales y comunitarios.
    *   ⚪ **Gris Claro** (`#E2E8F0` / `#F8FAFC`): Para tarjetas, fondos limpios y bordes.

---

## 1. Análisis Estratégico (Six Thinking Hats - RedVecino & MiVecino)

### Sombrero Blanco - Analista Racional

- **RedVecino (Web/Admin):** Panel web responsive en React que controla los módulos críticos (Finanzas, Usuarios, Propiedades y Reportes de Incidencias).
- **MiVecino (App/Residentes):** Interfaz móvil en React orientada al usuario final con cuadrícula táctil (6 botones principales) y barra inferior fija.
- **Stack tecnológico definido:** Laravel 13 (backend), Inertia.js v3 + React 18 + TypeScript + shadcn/ui (frontend web), SQLite (Desarrollo) y MySQL (Producción).
- **Arquitectura de usuarios con 6 roles principales:** Propietario, Residente, Comité, Colaborador, Administrador, TI.
- **Modelo de Datos:** Multi-condominio preparado a nivel de base de datos (`condominium_id` en todas las tablas transaccionales).

### Sombrero Rojo - Mente Emocional

- Gran entusiasmo al unificar las dos marcas (MiVecino y RedVecino) en un ecosistema cohesivo que "se siente profesional y premium".
- Ansiedad por reflejar perfectamente los detalles estéticos del Branding Board en el código React.
- Preocupación por coordinar adecuadamente las dos vistas (Admin Web vs App Móvil) compartiendo el mismo backend.

### Sombrero Negro - Crítico Estratégico

- **Sobrecarga de alcance visual:** Intentar que el MVP móvil y web emule el 100% de los mockups en el primer sprint puede retrasar las funcionalidades básicas.
- **Complejidad del responsive selectivo:** Redirigir condicionalmente según rol a una plantilla web de escritorio o móvil-first requiere un ruteo muy preciso en Inertia.js.
- **Multitenancy prematuro:** Mantener el aislamiento estricto por condominio es complejo y requiere políticas de Laravel muy robustas (`Policies`).

### Sombrero Amarillo - Optimista Estratégico

- La diferenciación es radical: en lugar de un software genérico de administración de edificios, se entrega una suite premium con dos experiencias nativas diferenciadas.
- La paleta de colores y tipografía predefinidas aceleran el desarrollo de la UI con Tailwind v4.
- La automatización de comunicados y tickets reducirá en un 60% la fricción administrativa real del condominio.

### Sombrero Verde - Pensamiento Creativo

- Desarrollar un sistema de templates dinámico donde el administrador en RedVecino pueda personalizar ligeramente los colores (Azul corporativo o Teal tecnológico) del portal móvil MiVecino de su comunidad.
- Facilitar el registro de pagos mediante la subida de un comprobante escaneado por el celular, extrayendo el código QR del banco.

### Sombrero Azul - Director Estratégico

**Puntos clave del análisis:**
1. El proyecto tiene una identidad visual impecable que debe ser respetada minuciosamente.
2. La arquitectura técnica debe implementar ruteo y vistas diferenciadas basadas en roles.
3. El MVP mantendrá un alcance centrado en los 4 módulos núcleo: Gestión de Usuarios/Propiedades, Finanzas (gastos comunes y pagos), Mantenimiento (tickets) y Comunicaciones (comunicados oficiales).

**Decisión final de Alcance:**
- **RedVecino (Dashboard Web):** Destinado a Administrador, Comité y TI. Control total, carga masiva, analíticas financieras.
- **MiVecino (Layout Móvil):** Destinado a Residentes y Propietarios. Menú grid interactivo de 6 opciones, barra inferior flotante y notificaciones.
- **Colaboradores:** Acceso web/móvil simplificado para ver y resolver los tickets de mantenimiento asignados.

---

## 2. Glosario de Términos

| Término | Definición |
|---------|------------|
| **RUT** | Rol Único Tributario - Identificador nacional chileno |
| **Copropiedad** | Régimen de propiedad compartida en condominios |
| **Gastos Comunes** | Cuota mensual que paga cada unidad por mantenimiento del condominio |
| **Comité** | Grupo de residentes elegidos para representar al condominio |
| **Multi-tenant** | Arquitectura donde múltiples clientes comparten la misma infraestructura con datos aislados |
| **SaaS** | Software as a Service - Modelo de suscripción en la nube |
| **MVP** | Minimum Viable Product - Producto mínimo viable |
| **RBAC** | Role-Based Access Control - Control de acceso basado en roles |

---

## 3. Requerimientos Organizados

### 3.1 Roles del Sistema

| Rol | Descripción | Acceso Principal |
|-----|-------------|------------------|
| **Propietario** | Dueño de apartamentos/unidades | Ver su unidad, pagar gastos comunes, crear tickets |
| **Residente** | Propietario, arrendatario, familiar u otro ocupante | Similar a propietario según tipo |
| **Comité** | Comité administrativo del condominio | Supervisar finanzas, aprobar gastos, ver reportes |
| **Colaborador** | Personal de mantenimiento, conserjes, otros | Ver tickets asignados, reportar estado |
| **Administrador** | Administrador del condominio | Gestión completa del condominio |
| **TI** | Gestor del sistema (soporte técnico) | Configuración del sistema, logs, usuarios |

### 3.2 Módulos del MVP

| Módulo | Descripción | Prioridad |
|--------|-------------|-----------|
| **Usuarios y Propiedades** | CRUD de usuarios, roles dinámicos, formularios condicionales, propiedades | P0 - Crítico |
| **Datos Comunes y Pagos** | Gastos comunes, pagos, estados de cuenta, multas | P0 - Crítico |
| **Tickets de Mantenimiento** | Creación, categorización, estados, seguimiento, asignación | P1 - Alto |
| **Panel Administrativo** | Dashboard básico con resumen de actividad | P1 - Alto |

### 3.3 Características Técnicas

| Componente | Tecnología | Justificación |
|------------|-------------|---------------|
| Backend | Laravel 13.x | Framework robusto, modular, excelente para SaaS |
| Frontend | Inertia.js v3 + React 18 + TypeScript | SPA sin API REST separada, desarrollo más rápido |
| Base de datos | SQLite (dev) → MySQL (prod) | Rápido desarrollo local, producción escalable |
| Autenticación | Laravel 13 Starter Kit (React/Inertia) | Starter kit oficial con Inertia v3, React 18, shadcn/ui |
| Roles y permisos | Spatie Laravel Permission v7 | Paquete estándar de la industria para RBAC |
| Estilo | Tailwind CSS v4 + shadcn/ui | Framework CSS utility-first con componentes de UI modernos |
| Testing | Pest PHP v4 + PHPUnit | Testing moderno y elegante, sintaxis simplificada |

### 3.4 Estructura de Usuario

```
USUARIO (Base)
├── Datos obligatorios
│   ├── Nombre
│   ├── RUT / ID
│   ├── Email
│   ├── Teléfono
│   ├── Contraseña
│   ├── Foto
│   └── Estado
│
└── Roles (múltiples)
    ├── Propietario → owner_profiles
    ├── Residente → resident_profiles
    ├── Comité → committee_profiles
    ├── Colaborador → employee_profiles
    ├── Administrador → admin_profiles
    └── TI → ti_profiles
```

### 3.5 Flujo de Registro de Usuarios

```
1. TI crea usuario base
2. Asigna rol(es)
3. Sistema muestra formularios adicionales según rol
4. Usuario completa información específica
5. Sistema valida y activa
```

---

## 4. Arquitectura Técnica

### 4.1 Stack Tecnológico

| Capa | Tecnología |
|------|------------|
| Framework | Laravel 13.x (PHP 8.3+) |
| Frontend | Inertia.js v3 + React 18 + TypeScript + Tailwind CSS v4 + shadcn/ui |
| Base de datos | SQLite (dev) / MySQL 8+ (prod) |
| Autenticación | Laravel 13 Starter Kit (React/Inertia) |
| Roles y permisos | Spatie Laravel Permission v7 |
| Testing | Pest PHP v4 + PHPUnit |
| Build | Vite 8 + laravel-vite-plugin |
| Deployment | Docker / Servidor Linux (Apache/Nginx) |

### 4.2 Configuración del Stack Frontend (Laravel 13 + Inertia v3 + React + Tailwind v4)

#### Instalación del proyecto
```bash
# Crear proyecto con Laravel 13 - seleccionar React stack interactivamente
composer global require laravel/installer
laravel new condominio-pro

# Durante la instalación interactiva seleccionar:
# - Starter kit: React (Inertia v3, React 18, TypeScript, Tailwind v4, shadcn/ui)
# - Database: SQLite
```

#### Configuración de Tailwind CSS v4 (sin tailwind.config.js)
En Tailwind v4 ya no se usa `tailwind.config.js` ni directivas `@tailwind`. Se configura desde CSS:

```css
/* resources/css/app.css */
@import "tailwindcss";
```

```ts
// vite.config.ts
import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [
        laravel({
            input: 'resources/js/app.tsx',
            ssr: 'resources/js/ssr.tsx',
            refresh: true,
        }),
        tailwindcss(),
        react(),
    ],
});
```

#### Estructura del Starter Kit React (Laravel 13)
```
resources/js/
├── components/      # Componentes React reutilizables
├── hooks/           # Custom hooks de React
├── layouts/         # Layouts de la aplicación
├── lib/             # Utilidades y configuración
├── pages/           # Componentes de página (Inertia)
│   ├── Auth/
│   ├── Users/
│   ├── Properties/
│   ├── Expenses/
│   ├── Tickets/
│   └── Dashboard.tsx
└── types/           # Definiciones TypeScript
```

#### Configuración de Inertia v3
El archivo `config/inertia.php` cambió en v3:
```php
// Antes (v2)
'testing' => [
    'ensure_pages_exist' => true,
    'page_paths' => [resource_path('js/Pages')],
    'page_extensions' => ['js', 'jsx', 'svelte', 'ts', 'tsx', 'vue'],
],

// Después (v3)
'pages' => [
    'ensure_pages_exist' => false,
    'paths' => [resource_path('js/Pages')],
    'extensions' => ['js', 'jsx', 'ts', 'tsx'],
],
'testing' => [
    'ensure_pages_exist' => true,
],
```

#### Entry point de la aplicación (app.tsx)
```tsx
import { createRoot } from 'react-dom/client';
import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';

createInertiaApp({
    resolve: (name) => resolvePageComponent(
        `./Pages/${name}.tsx`,
        import.meta.glob('./Pages/**/*.tsx')
    ),
    setup({ el, App, props }) {
        createRoot(el).render(<App {...props} />);
    },
});
```

#### Configuración de shadcn/ui (incluido en Starter Kit)
Aunque el Starter Kit de Laravel 13 ya incluye shadcn/ui, se puede inicializar manualmente en proyectos existentes:

```bash
# Inicializar shadcn/ui en proyecto existente
npx shadcn@latest init

# Instalar dependencias adicionales si no están presentes
npm install class-variance-authority clsx tailwind-merge lucide-react tw-animate-css
```

Archivo de configuración `components.json` (generado por `npx shadcn@latest init`):

```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "new-york",
  "rsc": false,
  "tsx": true,
  "tailwind": {
    "config": "",
    "css": "resources/css/app.css",
    "baseColor": "neutral",
    "cssVariables": true,
    "prefix": ""
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/ui",
    "lib": "@/lib",
    "hooks": "@/hooks"
  },
  "iconLibrary": "lucide"
}
```

Agregar componentes vía CLI:

```bash
npx shadcn@latest add button card dialog input select table form
```

### 4.3 Estructura Completa de Base de Datos

#### Tablas Core

```
users
├── id (PK, BIGINT)
├── name (VARCHAR)
├── rut (VARCHAR, UNIQUE)
├── email (VARCHAR, UNIQUE)
├── phone (VARCHAR)
├── password (VARCHAR)
├── photo (VARCHAR, nullable)
├── status (ENUM: active, inactive, suspended)
├── email_verified_at (TIMESTAMP, nullable)
├── created_at (TIMESTAMP)
├── updated_at (TIMESTAMP)
├── deleted_at (TIMESTAMP, nullable - soft deletes)

roles (Spatie)
├── id (PK)
├── name (VARCHAR)
├── guard_name (VARCHAR)

permissions (Spatie)
├── id (PK)
├── name (VARCHAR)
├── guard_name (VARCHAR)

model_has_roles (Spatie)
├── role_id (FK)
├── model_type (VARCHAR)
├── model_id (FK)

model_has_permissions (Spatie)
├── permission_id (FK)
├── model_type (VARCHAR)
├── model_id (FK)

role_has_permissions (Spatie)
├── permission_id (FK)
├── role_id (FK)
```

#### Perfiles por Rol

```
owner_profiles
├── id (PK)
├── user_id (FK → users)
├── property_id (FK → properties)
├── parking_id (FK → properties, nullable)
├── storage_id (FK → properties, nullable)
├── ownership_percentage (DECIMAL)
├── financial_status (ENUM: al_dia, moroso, en_proceso)
├── created_at, updated_at

resident_profiles
├── id (PK)
├── user_id (FK → users)
├── property_id (FK → properties)
├── resident_type (ENUM: owner, tenant, family, other)
├── relationship (VARCHAR, nullable)
├── lease_start (DATE, nullable)
├── lease_end (DATE, nullable)
├── created_at, updated_at

committee_profiles
├── id (PK)
├── user_id (FK → users)
├── position (VARCHAR: presidente, secretario, tesorero, vocal)
├── period_start (DATE)
├── period_end (DATE)
├── permission_level (ENUM: read, write, approve)
├── created_at, updated_at

employee_profiles
├── id (PK)
├── user_id (FK → users)
├── position (VARCHAR)
├── supervisor_id (FK → users, nullable)
├── contract_type (ENUM: full_time, part_time, contract, temporary)
├── shift (ENUM: morning, afternoon, night, rotating)
├── salary (DECIMAL)
├── hire_date (DATE)
├── created_at, updated_at

admin_profiles
├── id (PK)
├── user_id (FK → users)
├── access_level (ENUM: full, limited)
├── created_at, updated_at

ti_profiles
├── id (PK)
├── user_id (FK → users)
├── access_level (ENUM: full, limited)
├── system_logs_permission (BOOLEAN)
├── created_at, updated_at
```

#### Propiedades y Condominio

```
condominiums
├── id (PK)
├── name (VARCHAR)
├── address (VARCHAR)
├── city (VARCHAR)
├── region (VARCHAR)
├── postal_code (VARCHAR, nullable)
├── units_count (INTEGER)
├── status (ENUM: active, inactive)
├── created_at, updated_at

properties
├── id (PK)
├── condominium_id (FK → condominiums)
├── type (ENUM: house, apartment, parking, storage, commercial)
├── number (VARCHAR)
├── block (VARCHAR, nullable)
├── floor (INTEGER, nullable)
├── area_sqm (DECIMAL, nullable)
├── status (ENUM: occupied, vacant, maintenance)
├── created_at, updated_at
```

#### Finanzas

```
common_expenses
├── id (PK)
├── condominium_id (FK → condominiums)
├── period (VARCHAR: YYYY-MM)
├── amount (DECIMAL)
├── description (TEXT)
├── due_date (DATE)
├── status (ENUM: pending, approved, paid)
├── created_at, updated_at

expense_items
├── id (PK)
├── common_expense_id (FK → common_expenses)
├── category (VARCHAR: mantenimiento, seguridad, limpieza, servicios, otros)
├── description (TEXT)
├── amount (DECIMAL)
├── created_at, updated_at

payments
├── id (PK)
├── user_id (FK → users)
├── property_id (FK → properties)
├── common_expense_id (FK → common_expenses)
├── amount (DECIMAL)
├── payment_date (DATE)
├── payment_method (ENUM: cash, transfer, card, check)
├── reference (VARCHAR, nullable)
├── status (ENUM: pending, completed, rejected, refunded)
├── created_at, updated_at

fines
├── id (PK)
├── user_id (FK → users)
├── property_id (FK → properties)
├── reason (TEXT)
├── amount (DECIMAL)
├── issued_date (DATE)
├── due_date (DATE)
├── status (ENUM: pending, paid, appealed, cancelled)
├── created_at, updated_at
```

#### Tickets de Mantenimiento

```
ticket_categories
├── id (PK)
├── name (VARCHAR: electricidad, plomería, jardinería, limpieza, seguridad, otros)
├── description (TEXT, nullable)
├── created_at, updated_at

tickets
├── id (PK)
├── property_id (FK → properties)
├── created_by (FK → users)
├── assigned_to (FK → users, nullable)
├── category_id (FK → ticket_categories)
├── title (VARCHAR)
├── description (TEXT)
├── priority (ENUM: low, medium, high, urgent)
├── status (ENUM: open, in_progress, resolved, closed, cancelled)
├── resolved_at (TIMESTAMP, nullable)
├── resolution_notes (TEXT, nullable)
├── created_at, updated_at

ticket_attachments
├── id (PK)
├── ticket_id (FK → tickets)
├── file_path (VARCHAR)
├── file_name (VARCHAR)
├── file_size (INTEGER)
├── uploaded_by (FK → users)
├── created_at
```

#### Comunicaciones Internas

```
announcements
├── id (PK)
├── condominium_id (FK → condominiums)
├── created_by (FK → users)
├── title (VARCHAR)
├── content (TEXT)
├── priority (ENUM: normal, important, urgent)
├── published_at (TIMESTAMP)
├── expires_at (TIMESTAMP, nullable)
├── created_at, updated_at

messages
├── id (PK)
├── sender_id (FK → users)
├── receiver_id (FK → users)
├── subject (VARCHAR)
├── content (TEXT)
├── is_read (BOOLEAN)
├── read_at (TIMESTAMP, nullable)
├── created_at, updated_at
```

### 4.4 Matriz de Permisos por Rol

| Permiso | Propietario | Residente | Comité | Colaborador | Administrador | TI |
|---------|:-----------:|:---------:|:------:|:-----------:|:-------------:|:--:|
| Ver perfil propio | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Editar perfil propio | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Ver propiedades asignadas | ✅ | ✅ | ✅ | ❌ | ✅ | ✅ |
| Pagar gastos comunes | ✅ | ✅ | ✅ | ❌ | ✅ | ❌ |
| Ver estados de cuenta | ✅ | ✅ | ✅ | ❌ | ✅ | ❌ |
| Crear tickets | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Ver tickets propios | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Asignar tickets | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ |
| Resolver tickets | ❌ | ❌ | ❌ | ✅ | ✅ | ❌ |
| Ver reportes financieros | ❌ | ❌ | ✅ | ❌ | ✅ | ❌ |
| Aprobar gastos | ❌ | ❌ | ✅ | ❌ | ✅ | ❌ |
| Gestionar usuarios | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ |
| Configurar sistema | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |
| Ver logs del sistema | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |
| Gestionar roles | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |
| Publicar comunicados | ❌ | ❌ | ✅ | ❌ | ✅ | ❌ |
| Enviar mensajes internos | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |

### 4.5 Endpoints API (Web + API)

#### Autenticación

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| POST | `/login` | Iniciar sesión | ❌ |
| POST | `/register` | Registrar usuario | ❌ |
| POST | `/logout` | Cerrar sesión | ✅ |
| POST | `/forgot-password` | Recuperar contraseña | ❌ |
| POST | `/reset-password` | Resetear contraseña | ❌ |

#### Usuarios

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| GET | `/api/users` | Listar usuarios | ✅ Admin/TI |
| GET | `/api/users/{id}` | Ver usuario | ✅ Admin/TI |
| POST | `/api/users` | Crear usuario | ✅ Admin/TI |
| PUT | `/api/users/{id}` | Actualizar usuario | ✅ Admin/TI |
| DELETE | `/api/users/{id}` | Eliminar usuario | ✅ TI |
| POST | `/api/users/{id}/assign-role` | Asignar rol | ✅ Admin/TI |

#### Propiedades

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| GET | `/api/properties` | Listar propiedades | ✅ |
| GET | `/api/properties/{id}` | Ver propiedad | ✅ |
| POST | `/api/properties` | Crear propiedad | ✅ Admin |
| PUT | `/api/properties/{id}` | Actualizar propiedad | ✅ Admin |
| DELETE | `/api/properties/{id}` | Eliminar propiedad | ✅ Admin |

#### Finanzas

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| GET | `/api/expenses` | Listar gastos comunes | ✅ |
| POST | `/api/expenses` | Crear gasto común | ✅ Admin/Comité |
| GET | `/api/payments` | Listar pagos | ✅ |
| POST | `/api/payments` | Registrar pago | ✅ |
| GET | `/api/account-statement/{user_id}` | Estado de cuenta | ✅ Admin/Propietario |
| GET | `/api/fines` | Listar multas | ✅ |
| POST | `/api/fines` | Crear multa | ✅ Admin/Comité |

#### Tickets

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| GET | `/api/tickets` | Listar tickets | ✅ |
| POST | `/api/tickets` | Crear ticket | ✅ |
| GET | `/api/tickets/{id}` | Ver ticket | ✅ |
| PUT | `/api/tickets/{id}` | Actualizar ticket | ✅ |
| PUT | `/api/tickets/{id}/assign` | Asignar ticket | ✅ Admin |
| PUT | `/api/tickets/{id}/resolve` | Resolver ticket | ✅ Admin/Colaborador |
| GET | `/api/ticket-categories` | Listar categorías | ✅ |
| POST | `/api/ticket-categories` | Crear categoría | ✅ Admin |

#### Comunicaciones

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| GET | `/api/announcements` | Listar comunicados | ✅ |
| POST | `/api/announcements` | Crear comunicado | ✅ Admin/Comité |
| GET | `/api/messages` | Listar mensajes | ✅ |
| POST | `/api/messages` | Enviar mensaje | ✅ |
| PUT | `/api/messages/{id}/read` | Marcar como leído | ✅ |

### 4.6 Estructura de Directorios del Proyecto

```
condominio-pro/
├── app/
│   ├── Http/
│   │   ├── Controllers/
│   │   │   ├── Auth/
│   │   │   ├── UserController.php
│   │   │   ├── PropertyController.php
│   │   │   ├── ExpenseController.php
│   │   │   ├── PaymentController.php
│   │   │   ├── TicketController.php
│   │   │   └── AnnouncementController.php
│   │   ├── Middleware/
│   │   │   ├── CheckRole.php
│   │   │   └── CheckPermission.php
│   │   └── Requests/
│   │       ├── StoreUserRequest.php
│   │       ├── UpdateUserRequest.php
│   │       ├── StoreTicketRequest.php
│   │       └── StorePaymentRequest.php
│   ├── Models/
│   │   ├── User.php
│   │   ├── Property.php
│   │   ├── Condominium.php
│   │   ├── CommonExpense.php
│   │   ├── ExpenseItem.php
│   │   ├── Payment.php
│   │   ├── Fine.php
│   │   ├── Ticket.php
│   │   ├── TicketCategory.php
│   │   ├── TicketAttachment.php
│   │   ├── Announcement.php
│   │   └── Message.php
│   ├── Policies/
│   │   ├── UserPolicy.php
│   │   ├── PropertyPolicy.php
│   │   ├── TicketPolicy.php
│   │   └── PaymentPolicy.php
│   ├── Services/
│   │   ├── UserService.php
│   │   ├── PaymentService.php
│   │   └── TicketService.php
│   └── Enums/
│       ├── UserStatus.php
│       ├── PropertyType.php
│       ├── TicketStatus.php
│       ├── TicketPriority.php
│       └── PaymentStatus.php
├── database/
│   ├── migrations/
│   ├── seeders/
│   └── factories/
├── resources/
│   ├── js/
│   │   ├── Pages/
│   │   │   ├── Auth/
│   │   │   ├── Users/
│   │   │   ├── Properties/
│   │   │   ├── Expenses/
│   │   │   ├── Tickets/
│   │   │   └── Dashboard.tsx
│   │   ├── Components/
│   │   ├── Composables/
│   │   ├── Layouts/
│   │   ├── Lib/
│   │   └── Types/
│   └── views/
│       └── app.blade.php
├── routes/
│   ├── web.php
│   └── api.php
├── tests/
│   ├── Feature/
│   └── Unit/
└── ...
```

---

## 5. Historias de Usuario

### Módulo: Usuarios y Propiedades

| # | Historia | Criterios de Aceptación |
|---|----------|------------------------|
| U01 | Como TI, puedo crear un usuario con datos base para que tenga acceso al sistema | Formulario con nombre, RUT, email, teléfono, contraseña. Validación de RUT único y email único. |
| U02 | Como TI, puedo asignar uno o más roles a un usuario para habilitar sus permisos | Selección múltiple de roles. Al guardar, se muestran formularios condicionales según rol. |
| U03 | Como usuario, puedo ver y editar mi perfil para mantener mi información actualizada | Solo campos permitidos por rol. No puede cambiar su propio rol. |
| U04 | Como Administrador, puedo crear y gestionar propiedades del condominio | CRUD completo con tipo, número, bloque, piso, área, estado. |
| U05 | Como TI, puedo asignar un usuario a una propiedad para vincularlo | Un usuario puede tener múltiples propiedades. Una propiedad puede tener múltiples residentes. |

### Módulo: Finanzas

| # | Historia | Criterios de Aceptación |
|---|----------|------------------------|
| F01 | Como Administrador, puedo crear un gasto común mensual para cobrar a las unidades | Período, monto, descripción, fecha de vencimiento. Se genera automáticamente para todas las unidades. |
| F02 | Como Propietario, puedo ver mis gastos comunes pendientes para saber cuánto debo | Lista de gastos con estado, monto, fecha de vencimiento. Total adeudado visible. |
| F03 | Como Propietario, puedo registrar un pago para saldar mi deuda | Monto, método de pago, referencia. Estado cambia a "completado". Genera comprobante. |
| F04 | Como Administrador, puedo ver el estado de cuenta de cualquier unidad | Resumen de cargos, pagos, multas y saldo total. Exportable a PDF. |
| F05 | Como Administrador/Comité, puedo crear una multa para una unidad | Razón, monto, fecha de emisión, fecha de vencimiento. Notificación al usuario. |

### Módulo: Tickets de Mantenimiento

| # | Historia | Criterios de Aceptación |
|---|----------|------------------------|
| T01 | Como cualquier usuario, puedo crear un ticket de mantenimiento para reportar un problema | Título, descripción, categoría, prioridad, propiedad afectada. Adjuntar fotos. |
| T02 | Como Administrador, puedo asignar un ticket a un colaborador para que lo resuelva | Lista de colaboradores disponibles. Notificación al asignado. |
| T03 | Como Colaborador, puedo ver los tickets asignados y actualizar su estado | Cambiar estado: abierto → en progreso → resuelto. Agregar notas de resolución. |
| T04 | Como usuario, puedo ver el estado de mis tickets para saber su progreso | Lista con estado, prioridad, asignado, fecha de creación. |
| T05 | Como Administrador, puedo crear categorías de tickets para organizar los reportes | CRUD de categorías con nombre y descripción. |

### Módulo: Comunicaciones

| # | Historia | Criterios de Aceptación |
|---|----------|------------------------|
| C01 | Como Administrador/Comité, puedo publicar un comunicado para informar a los residentes | Título, contenido, prioridad, fecha de expiración opcional. Visible en dashboard. |
| C02 | Como usuario, puedo ver los comunicados publicados para estar informado | Lista ordenada por fecha. Indicador de prioridad. |
| C03 | Como usuario, puedo enviar un mensaje interno a otro usuario | Destinatario, asunto, contenido. Notificación al receptor. |
| C04 | Como usuario, puedo ver mis mensajes recibidos y enviados | Bandeja de entrada y enviados. Marcar como leído. |

---

## 6. Alcance del MVP

### 6.1 Incluir (Fase 1-4)

- [x] Sistema de autenticación completo
- [x] CRUD de usuarios con roles dinámicos
- [x] CRUD de propiedades (unidades)
- [x] Asignación de usuarios a propiedades
- [x] Registro de gastos comunes
- [x] Registro de pagos
- [x] Estados de cuenta
- [x] Multas
- [x] Tickets de mantenimiento
- [x] Panel administrativo básico
- [x] Comunicados internos
- [x] Mensajería interna

### 6.2 Excluir (para versión 2.0)

- [ ] WhatsApp API / Telegram
- [ ] Reservas (quincho, piscina, etc.)
- [ ] Seguridad (visitas, accesos, CCTV)
- [ ] RRHH y personal (turnos, sueldos)
- [ ] IA y automatizaciones
- [ ] Analíticas y dashboards avanzados
- [ ] Emergencias y alertas masivas
- [ ] IoT y Smart Condo
- [ ] Multi-condominio (SaaS)
- [ ] App móvil nativa

---

## 7. Plan de Implementación

### Fase 1: Setup y Core (Semana 1-2)

| Tarea | Descripción | Estado |
|-------|-------------|--------|
| 1.1 | Crear proyecto Laravel 13 (`laravel new` → seleccionar React stack) | ⬜ |
| 1.2 | Configurar SQLite + migración a MySQL futura | ⬜ |
| 1.3 | Starter kit React incluido (Inertia v3, React 18, TypeScript, shadcn/ui) | ⬜ |
| 1.4 | Instalar Spatie Laravel Permission v7 | ⬜ |
| 1.5 | Configurar Tailwind CSS v4 (vía `@import "tailwindcss"`, sin tailwind.config.js) | ⬜ |
| 1.6 | Crear migraciones de tablas core | ⬜ |
| 1.7 | Crear seeders de roles y permisos | ⬜ |
| 1.8 | Configurar estructura de directorios | ⬜ |

### Fase 2: Usuarios y Propiedades (Semana 3-4)

| Tarea | Descripción | Estado |
|-------|-------------|--------|
| 2.1 | CRUD usuarios base | ⬜ |
| 2.2 | Sistema de roles dinámicos | ⬜ |
| 2.3 | Formularios condicionales por rol | ⬜ |
| 2.4 | CRUD propiedades | ⬜ |
| 2.5 | Asignación usuario-propiedad | ⬜ |
| 2.6 | Perfiles extendidos por rol | ⬜ |
| 2.7 | Tests de usuarios y propiedades | ⬜ |

### Fase 3: Finanzas (Semana 5-6)

| Tarea | Descripción | Estado |
|-------|-------------|--------|
| 3.1 | CRUD gastos comunes | ⬜ |
| 3.2 | CRUD pagos | ⬜ |
| 3.3 | Estados de cuenta | ⬜ |
| 3.4 | CRUD multas | ⬜ |
| 3.5 | Reportes financieros básicos | ⬜ |
| 3.6 | Tests de finanzas | ⬜ |

### Fase 4: Mantenimiento y Comunicaciones (Semana 7-8)

| Tarea | Descripción | Estado |
|-------|-------------|--------|
| 4.1 | CRUD tickets | ⬜ |
| 4.2 | Categorías y estados | ⬜ |
| 4.3 | Asignación a colaboradores | ⬜ |
| 4.4 | Adjuntar archivos a tickets | ⬜ |
| 4.5 | Comunicados internos | ⬜ |
| 4.6 | Mensajería interna | ⬜ |
| 4.7 | Dashboard básico | ⬜ |
| 4.8 | Tests de mantenimiento | ⬜ |

### Fase 5: Testing y Deploy (Semana 9-10)

| Tarea | Descripción | Estado |
|-------|-------------|--------|
| 5.1 | Tests de integración completos | ⬜ |
| 5.2 | Tests de seguridad y permisos | ⬜ |
| 5.3 | Optimización de rendimiento | ⬜ |
| 5.4 | Documentación técnica | ⬜ |
| 5.5 | Configuración de producción (MySQL) | ⬜ |
| 5.6 | Deploy a servidor | ⬜ |
| 5.7 | Pruebas de aceptación | ⬜ |

---

## 8. Estrategia de Testing

> **Nota:** Pest PHP v4 requiere **PHP 8.3+** (compatible con Laravel 13). Migración desde v3: actualizar `pestphp/pest` a `^4.0` y `pestphp/pest-plugin-laravel` a `^4.0`.

### 8.1 Tipos de Tests

| Tipo | Herramienta | Cobertura Objetivo |
|------|-------------|-------------------|
| Unit | Pest v4 / PHPUnit | Models, Services, Enums |
| Feature | Pest v4 (Laravel plugin) | Controllers, API endpoints |
| Browser | Laravel Dusk | Flujos críticos de usuario |
| Integration | Pest v4 / PHPUnit | Relaciones entre módulos |

### 8.2 Tests Críticos a Implementar

```
✅ Autenticación y autorización
✅ CRUD de usuarios con validación de roles
✅ Asignación de permisos por rol
✅ CRUD de propiedades
✅ Registro de pagos y actualización de estado
✅ Creación y asignación de tickets
✅ Middleware de protección de rutas
✅ Formularios condicionales por rol
✅ Estados de cuenta correctos
✅ Notificaciones internas
```

### 8.3 Comandos de Testing

```bash
# Ejecutar todos los tests
php artisan test

# Ejecutar tests de un módulo específico
php artisan test --filter=UserTest

# Ejecutar tests con cobertura
php artisan test --coverage

# Ejecutar tests de feature
php artisan test tests/Feature

# Ejecutar tests de unidad
php artisan test tests/Unit

# Generar test con Pest
php artisan pest:test UsersTest
php artisan pest:test UsersTest --unit
```

---

## 9. Estrategia de Deploy

### 9.1 Requisitos de Producción

| Componente | Requisito |
|------------|-----------|
| Servidor | Linux (Ubuntu 22.04+) |
| Web Server | Nginx o Apache |
| PHP | 8.3+ (Laravel 13 requiere PHP 8.3 mínimo) |
| Base de datos | MySQL 8.0+ |
| Node.js | 20+ (para build de assets) |
| Composer | 2.5+ |
| SSL | Let's Encrypt (gratuito) |

### 9.2 Variables de Entorno (.env)

```env
APP_NAME="Gestor Condominios PRO"
APP_ENV=production
APP_KEY=
APP_DEBUG=false
APP_URL=https://tudominio.com

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=condominio_pro
DB_USERNAME=
DB_PASSWORD=

MAIL_MAILER=smtp
MAIL_HOST=
MAIL_PORT=587
MAIL_USERNAME=
MAIL_PASSWORD=
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=noreply@tudominio.com
```

### 9.3 Pasos de Deploy

```bash
# 1. Clonar repositorio
git clone https://github.com/tu-repo/condominio-pro.git
cd condominio-pro

# 2. Instalar dependencias PHP
composer install --optimize-autoloader --no-dev

# 3. Instalar dependencias Node y build
npm install
npm run build

# 4. Configurar entorno
cp .env.example .env
php artisan key:generate

# 5. Migrar base de datos
php artisan migrate --force

# 6. Seed inicial (roles, permisos)
php artisan db:seed --class=RoleSeeder --force

# 7. Optimizar (Laravel 13)
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan event:cache

# 8. Configurar permisos
chown -R www-data:www-data storage bootstrap/cache
chmod -R 775 storage bootstrap/cache
```

### 9.4 Checklist Pre-Deploy

- [ ] Todos los tests pasan
- [ ] APP_DEBUG=false en producción
- [ ] SSL configurado
- [ ] Backups automáticos de BD configurados
- [ ] Logs monitoreados
- [ ] Usuario admin inicial creado
- [ ] Roles y permisos seed ejecutados
- [ ] Assets compilados y optimizados
- [ ] Caché de configuración generado

---

## 10. Timeline Estimado

| Fase | Duración | Fecha Inicio | Fecha Fin |
|------|----------|--------------|-----------|
| Setup y Core | 2 semanas | Semana 1 | Semana 2 |
| Usuarios y Propiedades | 2 semanas | Semana 3 | Semana 4 |
| Finanzas | 2 semanas | Semana 5 | Semana 6 |
| Mantenimiento y Comunicaciones | 2 semanas | Semana 7 | Semana 8 |
| Testing y Deploy | 2 semanas | Semana 9 | Semana 10 |

**Total estimado: 10 semanas**

---

## 11. Decisiones Técnicas Clave

| Decisión | Opción Elegida | Razón |
|----------|---------------|-------|
| Framework | Laravel 13.x | Última versión estable, PHP 8.3+, nuevas características |
| Frontend | Inertia.js v3 + React 18 + TypeScript | SPA sin API separada, tipado estático, componentes modernos |
| Base de datos dev | SQLite | Rápido, sin configuración, ideal para desarrollo |
| Base de datos prod | MySQL 8+ | Escalable, compatible con SaaS futuro |
| Autenticación | Laravel 13 Starter Kit (React) | Incluye Inertia v3, React 18, shadcn/ui, TypeScript |
| Permisos | Spatie Laravel Permission v7 | Estándar de la industria, bien documentado |
| UI Components | shadcn/ui | Componentes modernos, accesibles, personalizables, port oficial de shadcn para React |
| Estilo | Tailwind CSS v4 | Utility-first, sin config file, @import basado |
| Build | Vite 8 + laravel-vite-plugin | Vite 8 usa Rolldown (bundler en Rust) para builds ultra-rápidos, HMR nativo |
| Testing | Pest PHP v4 + PHPUnit | Sintaxis moderna, mejor DX, integración Laravel |
| Arquitectura | Monolito modular | Más simple que microservicios, fácil de escalar después |
| Multi-tenant | Post-MVP | Complejidad innecesaria para MVP |

---

## 12. Riesgos y Mitigación

| Riesgo | Probabilidad | Impacto | Mitigación |
|--------|-------------|---------|------------|
| Scope creep | Alta | Alto | Mantener lista de "excluidos" visible, revisar en cada sprint |
| Complejidad de formularios dinámicos | Media | Medio | Usar componentes React reutilizables + shadcn/ui, validar en backend |
| Problemas de rendimiento con Spatie | Baja | Bajo | Cachear permisos vía `php artisan permission:cache-reset`, usar índices en BD |
| Cambio de requisitos | Media | Alto | Documentar todo, mantener comunicación constante |
| Falta de validación de mercado | Alta | Alto | Buscar primer cliente piloto durante desarrollo |

---

## 13. Estrategia de Crecimiento y Embudo (GTM & Sales Funnel)

Basado en la planeación estratégica analizada de la suite, se establece un embudo de conversión estructurado para escalar el negocio desde el MVP:

1. **Atracción (Conciencia):** Generación de contenidos útiles y testimonios sobre la digitalización inmobiliaria para atraer a juntas de vigilancia y comités.
2. **Interés (Consideración):** Demostración del valor diferenciado de tener el portal corporativo **RedVecino** para administración y el portal del residente **MiVecino**.
3. **Captura de Leads (Conversión Inicial):** Utilización de formularios interactivos y la simulación interactiva local para registrar datos de administradores interesados.
4. **Nutrición (Relación):** Automatización de correos electrónicos informativos y demostraciones personalizadas.
5. **Conversión (Decisión):** Presentación del retorno de inversión (ROI) en eficiencia y mitigación de morosidad para cerrar contratos comerciales.
6. **Fidelización y Recomendación (Lealtad):** Soporte técnico permanente, capacitación y programa de referidos de condominio a condominio.

---

## 14. Estrategia de Marketing Digital (Social Media & Reels)

Se incorpora la planificación publicitaria de redes sociales para posicionar las marcas de forma coordinada:

*   **Identificación del Dolor (Problema):** *"¿Muchos avisos por todos lados?"* (descontrol de información en chats informales).
*   **Presentación de Solución:** *"La app que organiza tu condominio: MiVecino. Más simple, más rápida, más cerca."*
*   **Evidencias de Valor (Beneficios):**
    *   Pagos seguros con comprobante al instante.
    *   Trazabilidad de incidencias (electricidad, ascensores, portones).
    *   Muro digital de avisos con notificaciones automáticas en el celular.
*   **Llamado a la Acción (CTA):** *"Únete a la comunidad inteligente. Descarga la app y únete hoy."*

---

## 15. Especificaciones Avanzadas de Ingeniería PropTech (Estándar Empresarial)

Para robustecer la suite hacia un nivel corporativo y prepararla para su escalabilidad como plataforma SaaS de alta disponibilidad, se incorporan las siguientes especificaciones técnicas de diseño de software y lógica de negocio descritas en el reporte de Ingeniería PropTech:

### 15.1 Gestión Financiera y Contabilidad Automatizada
*   **Partida Doble Real:** El motor financiero debe segregar de forma estricta el fondo operativo ordinario del fondo de reserva extraordinario del condominio. Cada movimiento de caja debe registrarse con su correspondiente débito y crédito, haciéndolo 100% auditable por terceros.
*   **Cálculo de Cuota Ordinaria por Coeficiente de Copropiedad:**
    El prorrateo automático de los gastos comunes mensuales presupuestados se rige bajo la siguiente fórmula matemática obligatoria:
    $$\text{Coeficiente}_i = \frac{\text{Área Privada}_i}{\sum_{j=1}^{N} \text{Área Privada}_j}$$
    Donde $N$ es el total de unidades habitacionales o comerciales del condominio, y la suma de todos los coeficientes individuales debe ser estrictamente equivalente a la unidad ($1.00$ o $100\%$).
*   **Motor de Reglas de Morosidad:**
    *   **Cálculo de Intereses:** Al detectarse el vencimiento de una cuota (ordinaria o extraordinaria), el motor de reglas calcula en caliente los intereses moratorios acumulados con base en las tasas parametrizadas según el reglamento del condominio.
    *   **Suspensión de Beneficios:** El sistema bloquea de forma autónoma accesos no esenciales (como reservas de áreas comunes) e inhabilita las credenciales de dispositivos de apertura remota (portones/puertas) vinculados a la propiedad que acumule **3 meses de morosidad**.

### 15.2 Mantenimiento de Activos y Control de Campo
*   **Asistencia por IA:** Un servicio de inteligencia artificial asiste en la asignación inteligente y programación de tareas correctivas y preventivas (ej: ascensores, bombas de agua).
*   **Lista de Verificación con Evidencia Fotográfica:** El flujo de los colaboradores técnicos exige completar una lista de verificación digital (Checklist) en su dispositivo móvil y la carga obligatoria de fotografías del activo **antes y después** del servicio para certificar el rendimiento de los contratistas.
*   **Alianzas Integradas:** Canales de conexión de software con entidades bancarias para apertura de cuentas corrientes de comunidades, integraciones con aseguradoras de bienes comunes y alianzas legales para recuperación de cartera.

### 15.3 Conserjería Inteligente y Seguridad Perimetral
*   **Códigos QR Dinámicos:** Generación de invitaciones de un solo uso para visitas peatonales y vehiculares, con opción de envío directo por servicios de mensajería (WhatsApp), reduciendo el criterio manual del guardia.
*   **Gestión de Paquetería OCR:**
    *   El conserje captura la etiqueta del paquete con la cámara del dispositivo móvil.
    *   Un motor de **Reconocimiento Óptico de Caracteres (OCR)** procesa y asocia automáticamente el paquete al departamento correspondiente.
    *   Se captura la firma digital del guardia que lo recibe y se dispara una alerta push inmediata al residente, manteniendo una cadena de custodia ininterrumpida hasta la entrega física final.
*   **Rondas con NFC:** Puntos de control perimetrales mediante etiquetas NFC pasivas distribuidas en el condominio. El guardia debe tocarlas físicamente con su smartphone móvil para registrar y verificar sus patrullajes presenciales en tiempo real en la central de seguridad.

### 15.4 Arquitectura de Datos Local-First y Sincronización Delta
*   **Persistencia Local Primaria:** Para entornos con conectividad nula o intermitente (sótanos, búnkeres de servicios, elevadores), la aplicación móvil adopta el paradigma **Local-First** utilizando motores de persistencia local de alto rendimiento (como RxDB, IndexedDB o MMKV para estados clave-valor rápidos).
*   **Cola de Transacciones Outbound:** Las operaciones fuera de línea se guardan secuencialmente en una cola FIFO local (*Outbound Queue* - Append-Only Log) y se reflejan de inmediato en la UI con actualizaciones optimistas.
*   **Sincronización Incremental por Lotes (Delta Sync):** Al recuperar conexión, la app empaqueta la cola y la envía por lotes, solicitando al servidor central únicamente las modificaciones registradas desde su último timestamp exitoso.
*   **Resolución de Conflictos:** Aplicación del algoritmo *Last-Write-Wins (LWW)* basado en el timestamp más reciente para datos transaccionales básicos, y estructuras *Conflict-Free Replicated Data Types (CRDT)* para datos concurrentes críticos (como inventarios de áreas comunes).
*   **Mitigación de Red:** Algoritmo de retroceso exponencial (*Exponential Backoff*) para reintentos de conexión ordenados, preservando la batería del dispositivo y recursos del procesador.

### 15.5 Gobernanza Legal y Votaciones en Asambleas Virtuales
*   **Censo y Quórum en Vivo:** Validación en tiempo real del censo de propietarios e inquilinos acreditados mediante cartas poder. Los usuarios con deudas morosas al inicio de la asamblea pierden derecho a voto y sus coeficientes se restan para la consolidación de quórums.
*   **Autenticación Fuerte de Identidad:** Verificación de identidad con certificados digitales y credenciales fuertes para evitar impugnaciones legales de actas de asamblea.
*   **Cálculo de Mayoría Doble Ponderada:** Los acuerdos en asambleas exigen el cumplimiento simultáneo de dos umbrales matemáticos:
    -   *Quórum por Cabezas:* $\sum_{i \in A} U_i > \text{Umbral Legal}$ (donde $U_i$ representa el voto nominal unitario por unidad, usualmente 1).
    -   *Quórum por Coeficiente:* $\sum_{i \in A} C_i > \text{Umbral Legal}$ (donde $C_i$ es el coeficiente específico de copropiedad de la unidad).
    Para asambleas extraordinarias de obras mayores, el sistema eleva de forma automatizada estos umbrales al **75%** de coeficientes presentes.
*   **Audit Trail Inmutable:** Grabación automatizada en audio y video de la asamblea enlazada con sellado de tiempo oficial, y generación automática de actas de votaciones con hashes únicos inmutables por cada voto emitido.

### 15.6 Frontera de APIs Móviles y Seguridad (Mobile Attestation)
*   **Filtro Antifraude de Clientes:** Para prevenir fuga de datos financieros o manipulación de votos, las APIs REST de la nube implementan tecnologías avanzadas de **App Attestation**.
*   **Certificación de Dispositivo:** El SDK móvil integrado solicita una firma criptográfica nativa del hardware del teléfono (DeviceCheck en iOS o Play Integrity en Google).
*   **Bloqueo de Entornos Vulnerables:** El servidor central rechaza de inmediato cualquier petición que no contenga una firma criptográfica válida o que sea iniciada desde dispositivos con Root, Jailbreak, emuladores maliciosos o con inyección activa de scripts.

### 15.7 Adaptaciones Avanzadas de Inteligencia Artificial (zAux Guía 2)
Para elevar el valor competitivo de la plataforma en el sector PropTech, se incorporan las siguientes adaptaciones funcionales basadas en la Guía 2 del Curso de IA de Mayo 2026:
*   **Gastos Comunes e Incidencias por Voz:** Integración de un motor de reconocimiento de voz y procesamiento de lenguaje natural (NLP) que permite a los administradores registrar egresos contables dictando órdenes simples y a los residentes reportar desperfectos en su condominio de forma oral, auto-categorizando los reportes con prioridad y asignación automatizada.
*   **Actas Automatizadas de Asambleas de Copropietarios:** Procesamiento de grabaciones de audio de asambleas virtuales para la generación automática de actas PDF estructuradas. Incluye: cálculo matemático de quórum doble ponderado (cabezas y coeficientes), resumen de acuerdos aprobados, y lista de responsables asignados, almacenándose de forma inmutable en la biblioteca del condominio.
*   **Insights de Morosidad Vecinal Predictiva:** Modelado inteligente del historial de pagos y mensajería en chat de residentes. Permite emitir resúmenes predictivos al administrador recomendando acciones de cobranza personalizadas y selectivas en lugar de alertas automáticas punitivas.
*   **Boletín en Vídeo Comunitario (fal.ai API):** Integración con la API externa de fal.ai para la síntesis automatizada de boletines semanales en formato de vídeo animado con avatares integrados que resumen las circulares largas publicadas por la administración en MiVecino.

### 15.8 Bitácora de Despliegue y Correcciones de la Reunión (zAux 27/05)
Derivado de la auditoría técnica de la reunión presencial de Héctor y René del 27 de mayo de 2026, se especifican las siguientes directrices operativas y de seguridad obligatorias:
*   **Unificación Visual en Enlace de Logos:** En la barra superior y logos de RedVecino, el punto de la letra "i" simulará la silueta de un vecino de color Verde Césped (o Celeste/Turquesa), consolidando la identidad del portal con el diseño móvil de MiVecino.
*   **Control Riguroso de Roles e Impedimento de Fugas de Acceso (Bug Rodrigo #1):** Aislamiento total de accesos basados en roles. El middleware de Laravel bloqueará estrictamente que cuentas de tipo "cliente" (residentes y propietarios) accedan a rutas administrativas globales de RedVecino (`/api/users`, `/api/properties`, etc.).
*   **Corrección de Duplicados en Reportes PDF (Bug Rodrigo #2):** Auditoría de los bucles de renderización Blade y eventos de disparo JS en el frontend para erradicar la duplicación de datos al exportar listados de deudas y estados de cuenta.
*   **Consola de Emergencia TI Web:** Interfaz para el rol de TI súper usuario con un menú interactivo para la ejecución segura de comandos artisan (`database status`, `cache:clear`, `permissions:reset`) para el mantenimiento de producción en servidores compartidos sin acceso SSH terminal.
*   **Estructura de Tres Canales para el Sistema de Tickets:** El módulo de tickets se segrega estrictamente en:
    1.  *Tickets de Mantenimiento:* Reportes vecinales de averías edilicias.
    2.  *Tickets de Pago:* Notificación del copropietario reportando comprobantes de depósitos para su conciliación de gastos.
    3.  *Tickets de TI (Averías de Plataforma):* Incidencias del administrador dirigidas directamente al soporte de ingeniería de RedVecino.
*   **Flujo de Correspondencia OCR:** Registro e inventario automatizado en conserjería para paquetería, guardando la empresa de courier, datos del destinatario, firma del guardia y firma digital del residente.

---

**Fecha de creación:** Mayo 2026
**Última actualización:** 28 de Mayo de 2026 (Actualizado con la Estrategia de Lanzamiento, Embudo de Ventas, Marketing Digital, Especificaciones Avanzadas de Ingeniería PropTech de RedVecino & MiVecino, y Adaptaciones e Incidencias del zAux 27/05/2026 y Guía 2 IA)
**Versión:** 5.0 (Enterprise Spec & IA Ready)
**Estado:** Listo para desarrollo (Con base de datos en SQLite/MySQL, suite de pruebas automatizadas y especificación de alta fidelidad PropTech)