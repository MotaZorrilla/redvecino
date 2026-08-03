# RedVecino & MiVecino - EspecificaciÃ³n TÃ©cnica del Proyecto (Condominio-PRO)

Este proyecto desarrolla una suite tecnolÃ³gica integrada para la gestiÃ³n, administraciÃ³n y vida comunitaria en condominios, estructurada en dos grandes interfaces de usuario alineadas bajo un ecosistema comÃºn:
1. **RedVecino:** Plataforma web corporativa y panel de administraciÃ³n avanzado para administradores y comitÃ©s de copropiedad. Robustez, analÃ­tica y control total.
2. **MiVecino:** AplicaciÃ³n mÃ³vil (Web-App responsive) para residentes y copropietarios. Interfaz cercana, amigable, simple e interactiva.

---

## ðŸŽ¨ Sistema de Identidad Visual (Design Board)

Basado en el manual de identidad del proyecto, las especificaciones estÃ©ticas obligatorias a implementar en el stack React (Tailwind v4 + shadcn/ui) son:

*   **TipografÃ­a Oficial:** `Montserrat` (Cargada desde Google Fonts). Una tipografÃ­a geomÃ©trica, moderna y de alta legibilidad.
*   **Slogan de Marca:** *"MÃ¡s que vecinos, somos comunidad."*
*   **Paleta de Colores Oficial:**
    *   ðŸ”µ **Azul Marino Profundo** (`#0F2557`): Color de estructura, base para el portal web de RedVecino.
    *   ðŸŸ¢ **Teal / Turquesa** (`#00A896`): Color moderno de enlace tecnolÃ³gico.
    *   ðŸ **Verde CÃ©sped** (`#72B043`): Identidad para MiVecino, representa cercanÃ­a y ecologÃ­a.
    *   ðŸŠ **Naranja Vibrante** (`#EC7A08`): Color de acento para notificaciones, llamados a la acciÃ³n (CTA) e incidencias urgentes.
    *   ðŸŸ£ **Morado/Violeta** (`#7A5299`): CategorizaciÃ³n de mÃ³dulos sociales y comunitarios.
    *   âšª **Gris Claro** (`#E2E8F0` / `#F8FAFC`): Para tarjetas, fondos limpios y bordes.

---

## 1. AnÃ¡lisis EstratÃ©gico (Six Thinking Hats - RedVecino & MiVecino)

### Sombrero Blanco - Analista Racional

- **RedVecino (Web/Admin):** Panel web responsive en React que controla los mÃ³dulos crÃ­ticos (Finanzas, Usuarios, Propiedades y Reportes de Incidencias).
- **MiVecino (App/Residentes):** Interfaz mÃ³vil en React orientada al usuario final con cuadrÃ­cula tÃ¡ctil (6 botones principales) y barra inferior fija.
- **Stack tecnolÃ³gico definido:** Laravel 12 (backend), Inertia.js v2 + React 18 + Tailwind CSS 3 (frontend web), SQLite (Desarrollo) y MySQL (ProducciÃ³n).
- **Arquitectura de usuarios con 6 roles principales:** Propietario, Residente, ComitÃ©, Colaborador, Administrador, TI.
- **Modelo de Datos:** Multi-condominio preparado a nivel de base de datos (`condominium_id` en todas las tablas transaccionales).

### Sombrero Rojo - Mente Emocional

- Gran entusiasmo al unificar las dos marcas (MiVecino y RedVecino) en un ecosistema cohesivo que "se siente profesional y premium".
- Ansiedad por reflejar perfectamente los detalles estÃ©ticos del Branding Board en el cÃ³digo React.
- PreocupaciÃ³n por coordinar adecuadamente las dos vistas (Admin Web vs App MÃ³vil) compartiendo el mismo backend.

### Sombrero Negro - CrÃ­tico EstratÃ©gico

- **Sobrecarga de alcance visual:** Intentar que el MVP mÃ³vil y web emule el 100% de los mockups en el primer sprint puede retrasar las funcionalidades bÃ¡sicas.
- **Complejidad del responsive selectivo:** Redirigir condicionalmente segÃºn rol a una plantilla web de escritorio o mÃ³vil-first requiere un ruteo muy preciso en Inertia.js.
- **Multitenancy prematuro:** Mantener el aislamiento estricto por condominio es complejo y requiere polÃ­ticas de Laravel muy robustas (`Policies`).

### Sombrero Amarillo - Optimista EstratÃ©gico

- La diferenciaciÃ³n es radical: en lugar de un software genÃ©rico de administraciÃ³n de edificios, se entrega una suite premium con dos experiencias nativas diferenciadas.
- La paleta de colores y tipografÃ­a predefinidas aceleran el desarrollo de la UI con Tailwind v4.

### 1.4 Adaptacion Estetica del Prototipo (zAux/respaldo5)
- **Fondo Oscuro:** La vista migrada del prototipo introducira una capa estetica adicional (#090d16) al dashboard de administracion web, para resaltar los datos financieros.
- **Tipografia Mixta:** Se mantendra Montserrat como fuente primaria para cohesion de la marca, pero se podran emplear trazos de Outfit si los componentes financieros (tablas, graficos) del prototipo lo requieren por legibilidad.
- **Transicion a Tailwind v4:** Todo el CSS puro de espaldo5/index.php debera ser re-escrito a clases utilitarias nativas de Tailwind CSS.
- La automatizaciÃ³n de comunicados y tickets reducirÃ¡ en un 60% la fricciÃ³n administrativa real del condominio.

### Sombrero Verde - Pensamiento Creativo

- Desarrollar un sistema de templates dinÃ¡mico donde el administrador en RedVecino pueda personalizar ligeramente los colores (Azul corporativo o Teal tecnolÃ³gico) del portal mÃ³vil MiVecino de su comunidad.
- Facilitar el registro de pagos mediante la subida de un comprobante escaneado por el celular, extrayendo el cÃ³digo QR del banco.

### Sombrero Azul - Director EstratÃ©gico

**Puntos clave del anÃ¡lisis:**
1. El proyecto tiene una identidad visual impecable que debe ser respetada minuciosamente.
2. La arquitectura tÃ©cnica debe implementar ruteo y vistas diferenciadas basadas en roles.
3. El MVP mantendrÃ¡ un alcance centrado en los 4 mÃ³dulos nÃºcleo: GestiÃ³n de Usuarios/Propiedades, Finanzas (gastos comunes y pagos), Mantenimiento (tickets) y Comunicaciones (comunicados oficiales).

**DecisiÃ³n final de Alcance:**
- **RedVecino (Dashboard Web):** Destinado a Administrador, ComitÃ© y TI. Control total, carga masiva, analÃ­ticas financieras.
- **MiVecino (Layout MÃ³vil):** Destinado a Residentes y Propietarios. MenÃº grid interactivo de 6 opciones, barra inferior flotante y notificaciones.
- **Colaboradores:** Acceso web/mÃ³vil simplificado para ver y resolver los tickets de mantenimiento asignados.

---

## 2. Glosario de TÃ©rminos

| TÃ©rmino | DefiniciÃ³n |
|---------|------------|
| **RUT** | Rol Ãšnico Tributario - Identificador nacional chileno |
| **Copropiedad** | RÃ©gimen de propiedad compartida en condominios |
| **Gastos Comunes** | Cuota mensual que paga cada unidad por mantenimiento del condominio |
| **ComitÃ©** | Grupo de residentes elegidos para representar al condominio |
| **Multi-tenant** | Arquitectura donde mÃºltiples clientes comparten la misma infraestructura con datos aislados |
| **SaaS** | Software as a Service - Modelo de suscripciÃ³n en la nube |
| **MVP** | Minimum Viable Product - Producto mÃ­nimo viable |
| **RBAC** | Role-Based Access Control - Control de acceso basado en roles |

---

## 3. Requerimientos Organizados

### 3.1 Roles del Sistema

| Rol | DescripciÃ³n | Acceso Principal |
|-----|-------------|------------------|
| **Propietario** | DueÃ±o de apartamentos/unidades | Ver su unidad, pagar gastos comunes, crear tickets |
| **Residente** | Propietario, arrendatario, familiar u otro ocupante | Similar a propietario segÃºn tipo |
| **ComitÃ©** | ComitÃ© administrativo del condominio | Supervisar finanzas, aprobar gastos, ver reportes |
| **Colaborador** | Personal de mantenimiento, conserjes, otros | Ver tickets asignados, reportar estado |
| **Administrador** | Administrador del condominio | GestiÃ³n completa del condominio |
| **TI** | Gestor del sistema (soporte tÃ©cnico) | ConfiguraciÃ³n del sistema, logs, usuarios |

### 3.2 MÃ³dulos del MVP

| MÃ³dulo | DescripciÃ³n | Prioridad |
|--------|-------------|-----------|
| **Usuarios y Propiedades** | CRUD de usuarios, roles dinÃ¡micos, formularios condicionales, propiedades | P0 - CrÃ­tico |
| **Datos Comunes y Pagos** | Gastos comunes, pagos, estados de cuenta, multas | P0 - CrÃ­tico |
| **Tickets de Mantenimiento** | CreaciÃ³n, categorizaciÃ³n, estados, seguimiento, asignaciÃ³n | P1 - Alto |
| **Panel Administrativo** | Dashboard bÃ¡sico con resumen de actividad | P1 - Alto |

### 3.3 CaracterÃ­sticas TÃ©cnicas

| Componente | TecnologÃ­a | JustificaciÃ³n |
|------------|-------------|---------------|
| Backend | Laravel 13.x | Framework robusto, modular, excelente para SaaS |
| Frontend | Inertia.js v3 + React 18 + TypeScript | SPA sin API REST separada, desarrollo mÃ¡s rÃ¡pido |
| Base de datos | SQLite (dev) â†’ MySQL (prod) | RÃ¡pido desarrollo local, producciÃ³n escalable |
| AutenticaciÃ³n | Laravel 13 Starter Kit (React/Inertia) | Starter kit oficial con Inertia v3, React 18, shadcn/ui |
| Roles y permisos | Spatie Laravel Permission v7 | Paquete estÃ¡ndar de la industria para RBAC |
| Estilo | Tailwind CSS v4 + shadcn/ui | Framework CSS utility-first con componentes de UI modernos |
| Testing | Pest PHP v4 + PHPUnit | Testing moderno y elegante, sintaxis simplificada |

### 3.4 Estructura de Usuario

```
USUARIO (Base)
â”œâ”€â”€ Datos obligatorios
â”‚   â”œâ”€â”€ Nombre
â”‚   â”œâ”€â”€ RUT / ID
â”‚   â”œâ”€â”€ Email
â”‚   â”œâ”€â”€ TelÃ©fono
â”‚   â”œâ”€â”€ ContraseÃ±a
â”‚   â”œâ”€â”€ Foto
â”‚   â””â”€â”€ Estado
â”‚
â””â”€â”€ Roles (mÃºltiples)
    â”œâ”€â”€ Propietario â†’ owner_profiles
    â”œâ”€â”€ Residente â†’ resident_profiles
    â”œâ”€â”€ ComitÃ© â†’ committee_profiles
    â”œâ”€â”€ Colaborador â†’ employee_profiles
    â”œâ”€â”€ Administrador â†’ admin_profiles
    â””â”€â”€ TI â†’ ti_profiles
```

### 3.5 Flujo de Registro de Usuarios

```
1. TI crea usuario base
2. Asigna rol(es)
3. Sistema muestra formularios adicionales segÃºn rol
4. Usuario completa informaciÃ³n especÃ­fica
5. Sistema valida y activa
```

---

## 4. Arquitectura TÃ©cnica

### 4.1 Stack TecnolÃ³gico

| Capa | TecnologÃ­a |
|------|------------|
| Framework | Laravel 12.x (PHP 8.2+) |
| Frontend | Inertia.js v2 + React 18 + Tailwind CSS 3 + shadcn/ui |
| Base de datos | SQLite (dev) / MySQL 8+ (prod) |
| AutenticaciÃ³n | Laravel Breeze (React/Inertia) |
| Roles y permisos | Spatie Laravel Permission v6 |
| Testing | PHPUnit 11 + Pest |
| Build | Vite 7 + laravel-vite-plugin |
| Deployment | Docker / Servidor Linux (Apache/Nginx) |

### 4.2 ConfiguraciÃ³n del Stack Frontend (Laravel 13 + Inertia v3 + React + Tailwind v4)

#### InstalaciÃ³n del proyecto
```bash
# Crear proyecto con Laravel 13 - seleccionar React stack interactivamente
composer global require laravel/installer
laravel new condominio-pro

# Durante la instalaciÃ³n interactiva seleccionar:
# - Starter kit: React (Inertia v3, React 18, TypeScript, Tailwind v4, shadcn/ui)
# - Database: SQLite
```

#### ConfiguraciÃ³n de Tailwind CSS v4 (sin tailwind.config.js)
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

#### Estructura Frontend Actual
```
resources/js/
â”œâ”€â”€ Components/      # Componentes React reutilizables
â”‚   â”œâ”€â”€ Admin/       # Componentes del panel de administraciÃ³n
â”‚   â”œâ”€â”€ Colaborador/ # Componentes del panel del colaborador
â”‚   â”œâ”€â”€ Comite/      # Componentes del panel del comitÃ©
â”‚   â”œâ”€â”€ Propietario/ # Componentes del panel del propietario
â”‚   â”œâ”€â”€ Residente/   # Componentes del portal MiVecino
â”‚   â”œâ”€â”€ RolePages/   # PÃ¡ginas de dashboard por rol (F4)
â”‚   â”‚   â”œâ”€â”€ SuperUsuarioDashboard.jsx
â”‚   â”‚   â”œâ”€â”€ TiDashboard.jsx
â”‚   â”‚   â”œâ”€â”€ AdminDashboard.jsx
â”‚   â”‚   â”œâ”€â”€ ComiteDashboard.jsx
â”‚   â”‚   â”œâ”€â”€ ColaboradorDashboard.jsx
â”‚   â”‚   â”œâ”€â”€ PropietarioDashboard.jsx
â”‚   â”‚   â””â”€â”€ ResidenteDashboard.jsx
â”‚   â”œâ”€â”€ Ti/          # Componentes del panel de TI
â”‚   â”œâ”€â”€ DashboardShared.jsx
â”‚   â”œâ”€â”€ ApplicationLogo.jsx
â”‚   â”œâ”€â”€ Modal.jsx
â”‚   â”œâ”€â”€ Dropdown.jsx
â”‚   â”œâ”€â”€ Toast.jsx
â”‚   â””â”€â”€ ConfirmDialog.jsx
â”œâ”€â”€ Hooks/           # Custom hooks de React
â”œâ”€â”€ Layouts/         # Layouts estandarizados del ecosistema
â”‚   â”œâ”€â”€ RedVecinoLayout.jsx  â†  Unificado para gestiÃ³n (TI, Admin, ComitÃ©, Colaborador)
â”‚   â”œâ”€â”€ MiVecinoLayout.jsx   â†  Unificado para residencial (Propietario, Residente)
â”‚   â””â”€â”€ SuperUsuarioLayout.jsx
â”œâ”€â”€ Pages/           # Componentes de pÃ¡gina (Inertia)
â”‚   â”œâ”€â”€ Auth/
â”‚   â”œâ”€â”€ Dashboard.jsx  â† Orquestador (~480 lÃ­neas)
â”‚   â”œâ”€â”€ Welcome.jsx
â”‚   â””â”€â”€ Profile/
â”œâ”€â”€ utils/           # Utilidades y helpers
â”‚   â”œâ”€â”€ helpers.js
â”‚   â”œâ”€â”€ notify.js
â”‚   â””â”€â”€ constants.js
â””â”€â”€ bootstrap.js     # ConfiguraciÃ³n de Axios
```

#### ConfiguraciÃ³n de Inertia v3
El archivo `config/inertia.php` cambiÃ³ en v3:
```php
// Antes (v2)
'testing' => [
    'ensure_pages_exist' => true,
    'page_paths' => [resource_path('js/Pages')],
    'page_extensions' => ['js', 'jsx', 'svelte', 'ts', 'tsx', 'vue'],
],

// DespuÃ©s (v3)
'pages' => [
    'ensure_pages_exist' => false,
    'paths' => [resource_path('js/Pages')],
    'extensions' => ['js', 'jsx', 'ts', 'tsx'],
],
'testing' => [
    'ensure_pages_exist' => true,
],
```

#### Entry point de la aplicaciÃ³n (app.tsx)
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

#### ConfiguraciÃ³n de shadcn/ui (incluido en Starter Kit)
Aunque el Starter Kit de Laravel 13 ya incluye shadcn/ui, se puede inicializar manualmente en proyectos existentes:

```bash
# Inicializar shadcn/ui en proyecto existente
npx shadcn@latest init

# Instalar dependencias adicionales si no estÃ¡n presentes
npm install class-variance-authority clsx tailwind-merge lucide-react tw-animate-css
```

Archivo de configuraciÃ³n `components.json` (generado por `npx shadcn@latest init`):

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

Agregar componentes vÃ­a CLI:

```bash
npx shadcn@latest add button card dialog input select table form
```

### 4.3 Estructura Completa de Base de Datos

#### Tablas Core

```
users
â”œâ”€â”€ id (PK, BIGINT)
â”œâ”€â”€ name (VARCHAR)
â”œâ”€â”€ rut (VARCHAR, UNIQUE)
â”œâ”€â”€ email (VARCHAR, UNIQUE)
â”œâ”€â”€ phone (VARCHAR)
â”œâ”€â”€ password (VARCHAR)
â”œâ”€â”€ photo (VARCHAR, nullable)
â”œâ”€â”€ status (ENUM: active, inactive, suspended)
â”œâ”€â”€ email_verified_at (TIMESTAMP, nullable)
â”œâ”€â”€ created_at (TIMESTAMP)
â”œâ”€â”€ updated_at (TIMESTAMP)
â”œâ”€â”€ deleted_at (TIMESTAMP, nullable - soft deletes)

roles (Spatie)
â”œâ”€â”€ id (PK)
â”œâ”€â”€ name (VARCHAR)
â”œâ”€â”€ guard_name (VARCHAR)

permissions (Spatie)
â”œâ”€â”€ id (PK)
â”œâ”€â”€ name (VARCHAR)
â”œâ”€â”€ guard_name (VARCHAR)

model_has_roles (Spatie)
â”œâ”€â”€ role_id (FK)
â”œâ”€â”€ model_type (VARCHAR)
â”œâ”€â”€ model_id (FK)

model_has_permissions (Spatie)
â”œâ”€â”€ permission_id (FK)
â”œâ”€â”€ model_type (VARCHAR)
â”œâ”€â”€ model_id (FK)

role_has_permissions (Spatie)
â”œâ”€â”€ permission_id (FK)
â”œâ”€â”€ role_id (FK)
```

#### Perfiles por Rol

```
owner_profiles
â”œâ”€â”€ id (PK)
â”œâ”€â”€ user_id (FK â†’ users)
â”œâ”€â”€ property_id (FK â†’ properties)
â”œâ”€â”€ parking_id (FK â†’ properties, nullable)
â”œâ”€â”€ storage_id (FK â†’ properties, nullable)
â”œâ”€â”€ ownership_percentage (DECIMAL)
â”œâ”€â”€ financial_status (ENUM: al_dia, moroso, en_proceso)
â”œâ”€â”€ created_at, updated_at

resident_profiles
â”œâ”€â”€ id (PK)
â”œâ”€â”€ user_id (FK â†’ users)
â”œâ”€â”€ property_id (FK â†’ properties)
â”œâ”€â”€ resident_type (ENUM: owner, tenant, family, other)
â”œâ”€â”€ relationship (VARCHAR, nullable)
â”œâ”€â”€ lease_start (DATE, nullable)
â”œâ”€â”€ lease_end (DATE, nullable)
â”œâ”€â”€ created_at, updated_at

committee_profiles
â”œâ”€â”€ id (PK)
â”œâ”€â”€ user_id (FK â†’ users)
â”œâ”€â”€ position (VARCHAR: presidente, secretario, tesorero, vocal)
â”œâ”€â”€ period_start (DATE)
â”œâ”€â”€ period_end (DATE)
â”œâ”€â”€ permission_level (ENUM: read, write, approve)
â”œâ”€â”€ created_at, updated_at

employee_profiles
â”œâ”€â”€ id (PK)
â”œâ”€â”€ user_id (FK â†’ users)
â”œâ”€â”€ position (VARCHAR)
â”œâ”€â”€ supervisor_id (FK â†’ users, nullable)
â”œâ”€â”€ contract_type (ENUM: full_time, part_time, contract, temporary)
â”œâ”€â”€ shift (ENUM: morning, afternoon, night, rotating)
â”œâ”€â”€ salary (DECIMAL)
â”œâ”€â”€ hire_date (DATE)
â”œâ”€â”€ created_at, updated_at

admin_profiles
â”œâ”€â”€ id (PK)
â”œâ”€â”€ user_id (FK â†’ users)
â”œâ”€â”€ access_level (ENUM: full, limited)
â”œâ”€â”€ created_at, updated_at

ti_profiles
â”œâ”€â”€ id (PK)
â”œâ”€â”€ user_id (FK â†’ users)
â”œâ”€â”€ access_level (ENUM: full, limited)
â”œâ”€â”€ system_logs_permission (BOOLEAN)
â”œâ”€â”€ created_at, updated_at
```

#### Propiedades y Condominio

```
condominiums
â”œâ”€â”€ id (PK)
â”œâ”€â”€ name (VARCHAR)
â”œâ”€â”€ address (VARCHAR)
â”œâ”€â”€ city (VARCHAR)
â”œâ”€â”€ region (VARCHAR)
â”œâ”€â”€ postal_code (VARCHAR, nullable)
â”œâ”€â”€ units_count (INTEGER)
â”œâ”€â”€ status (ENUM: active, inactive)
â”œâ”€â”€ created_at, updated_at

properties
├── id (PK)
├── condominium_id (FK → condominiums)
├── type (ENUM: house, apartment, parking, storage, commercial)
├── number (VARCHAR)
├── block (VARCHAR, nullable)
├── floor (INTEGER, nullable)
├── area_sqm (DECIMAL, nullable)
├── coefficient (DECIMAL, nullable) — factor de prorrateo individual
├── ownership_percentage (DECIMAL, nullable) — porcentaje de copropiedad
├── status (ENUM: occupied, vacant, maintenance)
├── created_at, updated_at
```

#### Finanzas

```
common_expenses
â”œâ”€â”€ id (PK)
â”œâ”€â”€ condominium_id (FK â†’ condominiums)
â”œâ”€â”€ period (VARCHAR: YYYY-MM)
â”œâ”€â”€ amount (DECIMAL)
â”œâ”€â”€ description (TEXT)
â”œâ”€â”€ due_date (DATE)
â”œâ”€â”€ status (ENUM: pending, approved, paid)
â”œâ”€â”€ created_at, updated_at

expense_items
â”œâ”€â”€ id (PK)
â”œâ”€â”€ common_expense_id (FK â†’ common_expenses)
â”œâ”€â”€ category (VARCHAR: mantenimiento, seguridad, limpieza, servicios, otros)
â”œâ”€â”€ description (TEXT)
â”œâ”€â”€ amount (DECIMAL)
â”œâ”€â”€ created_at, updated_at

payments
â”œâ”€â”€ id (PK)
â”œâ”€â”€ user_id (FK â†’ users)
â”œâ”€â”€ property_id (FK â†’ properties)
â”œâ”€â”€ common_expense_id (FK â†’ common_expenses)
â”œâ”€â”€ amount (DECIMAL)
â”œâ”€â”€ payment_date (DATE)
â”œâ”€â”€ payment_method (ENUM: cash, transfer, card, check)
â”œâ”€â”€ reference (VARCHAR, nullable)
â”œâ”€â”€ status (ENUM: pending, completed, rejected, refunded)
â”œâ”€â”€ created_at, updated_at

fines
â”œâ”€â”€ id (PK)
â”œâ”€â”€ user_id (FK â†’ users)
â”œâ”€â”€ property_id (FK â†’ properties)
â”œâ”€â”€ reason (TEXT)
â”œâ”€â”€ amount (DECIMAL)
â”œâ”€â”€ issued_date (DATE)
â”œâ”€â”€ due_date (DATE)
â”œâ”€â”€ status (ENUM: pending, paid, appealed, cancelled)
â”œâ”€â”€ created_at, updated_at

condo_incomes
â”œâ”€â”€ id (PK)
â”œâ”€â”€ condominium_id (FK â†’ condominiums)
â”œâ”€â”€ category (VARCHAR: multas, gastos_comunes, arriendo_espacios, intereses_mora, cuotas_extraordinarias, publicidad_convenio, otro)
â”œâ”€â”€ subcategory (VARCHAR, nullable)
â”œâ”€â”€ amount (DECIMAL)
â”œâ”€â”€ date (DATE)
â”œâ”€â”€ description (TEXT, nullable)
â”œâ”€â”€ property_id (FK â†’ properties, nullable)
â”œâ”€â”€ user_id (FK â†’ users, nullable)
â”œâ”€â”€ created_at, updated_at

condo_expenses
â”œâ”€â”€ id (PK)
â”œâ”€â”€ condominium_id (FK â†’ condominiums)
â”œâ”€â”€ category (VARCHAR: personal, mantencion, servicios_basicos, seguridad, administracion, otro)
â”œâ”€â”€ subcategory (VARCHAR, nullable)
â”œâ”€â”€ amount (DECIMAL)
â”œâ”€â”€ date (DATE)
â”œâ”€â”€ description (TEXT, nullable)
â”œâ”€â”€ property_id (FK â†’ properties, nullable)
â”œâ”€â”€ user_id (FK â†’ users, nullable)
â”œâ”€â”€ common_expense_id (FK â†’ common_expenses, nullable)
â”œâ”€â”€ expense_item_id (FK â†’ expense_items, nullable)
â”œâ”€â”€ created_at, updated_at

financial_catalog
â”œâ”€â”€ id (PK)
â”œâ”€â”€ type (VARCHAR: income, expense)
â”œâ”€â”€ category (VARCHAR)
â”œâ”€â”€ description (TEXT, nullable)
â”œâ”€â”€ created_at, updated_at

fund_transfers
â”œâ”€â”€ id (PK)
â”œâ”€â”€ condominium_id (FK â†’ condominiums)
â”œâ”€â”€ from_fund (ENUM: operational, reserve)
â”œâ”€â”€ to_fund (ENUM: operational, reserve)
â”œâ”€â”€ amount (DECIMAL)
â”œâ”€â”€ reason (TEXT)
â”œâ”€â”€ approved_by (FK â†’ users, nullable)
â”œâ”€â”€ transferred_at (TIMESTAMP)
â”œâ”€â”€ created_at, updated_at

facilities
â”œâ”€â”€ id (PK)
â”œâ”€â”€ condominium_id (FK â†’ condominiums)
â”œâ”€â”€ name (VARCHAR)
â”œâ”€â”€ type (VARCHAR: quincho, salon_eventos, cancha, piscina, gimnasio, otro)
â”œâ”€â”€ capacity (INTEGER, nullable)
â”œâ”€â”€ description (TEXT, nullable)
â”œâ”€â”€ status (ENUM: active, maintenance, inactive)
â”œâ”€â”€ created_at, updated_at
```

#### ClasificaciÃ³n EstÃ¡ndar de Finanzas (Ingresos y Egresos BÃ¡sicos)

Esta secciÃ³n define el catÃ¡logo estructurado de cuentas financieras base que opera en la plataforma RedVecino/MiVecino para el registro, categorizaciÃ³n y visualizaciÃ³n del flujo de caja.

##### Ingresos de un Condominio (BÃ¡sico)

1. **Gastos Comunes** (`gastos_comunes`)
   * Pago mensual realizado por propietarios o residentes para el funcionamiento del condominio.
2. **Multas** (`multas`)
   * Cobros por incumplimientos del reglamento, categorizados en:
     * Ruidos molestos
     * Mal uso de Ã¡reas comunes
     * Estacionamientos indebidos
     * Malos olores
     * Problemas con mascotas
     * Actividades fuera de horario
     * Incumplimiento de normas del reglamento
3. **Arriendos de Espacios Comunes** (`arriendo_espacios`)
   * Ingresos por uso de:
     * Quinchos
     * SalÃ³n de eventos
     * Canchas
     * Estacionamientos de visita
4. **Intereses por Mora** (`intereses_mora`)
   * Cobros adicionales por pagos atrasados de gastos comunes.
5. **Cuotas Extraordinarias** (`cuotas_extraordinarias`)
   * Pagos especiales aprobados para:
     * Reparaciones mayores
     * Mejoras
     * Emergencias
6. **Publicidad o Convenios** (`publicidad_convenio`)
   * Ingresos por:
     * MÃ¡quinas expendedoras
     * Antenas
     * Publicidad interna
     * Convenios con empresas

##### Egresos de un Condominio (BÃ¡sico)

1. **Sueldos y Honorarios** (`personal`)
   * Pagos a:
     * Conserjes
     * Personal de aseo
     * Jardineros
     * Administrador
     * TÃ©cnicos externos
2. **Servicios BÃ¡sicos** (`servicios_basicos`)
   * Pagos de:
     * Agua
     * Electricidad
     * Gas
     * Internet
     * TelefonÃ­a
3. **MantenciÃ³n** (`mantencion`)
   * Gastos en:
     * Ascensores
     * Bombas de agua
     * Portones elÃ©ctricos
     * CÃ¡maras de seguridad
     * Jardines
4. **Seguridad** (`seguridad`)
   * Costos relacionados con:
     * Guardias
     * CCTV
     * Alarmas
     * Control de acceso
5. **Limpieza y Aseo** (`limpieza` / `otro`)
   * Compra de:
     * Productos de limpieza
     * Bolsas de basura
     * Implementos de aseo
6. **Reparaciones** (`mantencion` / `otro`)
   * Arreglos de:
     * CaÃ±erÃ­as
     * Techos
     * IluminaciÃ³n
     * Infraestructura comÃºn
7. **Seguros** (`administracion` / `otro`)
   * Pago de seguros:
     * Incendio
     * Responsabilidad civil
     * Equipos
8. **Gastos Administrativos** (`administracion`)
   * Incluye:
     * PapelerÃ­a
     * Software
     * Bancos
     * Contabilidad
     * Impresiones
9. **Fondo de Reserva** (`fondo_reserva` / `otro`)
   * Dinero destinado a emergencias o proyectos futuros.

---

#### Tickets de Mantenimiento

```
ticket_categories
â”œâ”€â”€ id (PK)
â”œâ”€â”€ name (VARCHAR: electricidad, plomerÃ­a, jardinerÃ­a, limpieza, seguridad, otros)
â”œâ”€â”€ description (TEXT, nullable)
â”œâ”€â”€ created_at, updated_at

tickets
â”œâ”€â”€ id (PK)
â”œâ”€â”€ property_id (FK â†’ properties)
â”œâ”€â”€ created_by (FK â†’ users)
â”œâ”€â”€ assigned_to (FK â†’ users, nullable)
â”œâ”€â”€ category_id (FK â†’ ticket_categories)
â”œâ”€â”€ title (VARCHAR)
â”œâ”€â”€ description (TEXT)
â”œâ”€â”€ priority (ENUM: low, medium, high, urgent)
â”œâ”€â”€ status (ENUM: open, in_progress, resolved, closed, cancelled)
â”œâ”€â”€ resolved_at (TIMESTAMP, nullable)
â”œâ”€â”€ resolution_notes (TEXT, nullable)
â”œâ”€â”€ created_at, updated_at

ticket_attachments
â”œâ”€â”€ id (PK)
â”œâ”€â”€ ticket_id (FK â†’ tickets)
â”œâ”€â”€ file_path (VARCHAR)
â”œâ”€â”€ file_name (VARCHAR)
â”œâ”€â”€ file_size (INTEGER)
â”œâ”€â”€ uploaded_by (FK â†’ users)
â”œâ”€â”€ created_at
```

#### Comunicaciones Internas

```
announcements
â”œâ”€â”€ id (PK)
â”œâ”€â”€ condominium_id (FK â†’ condominiums)
â”œâ”€â”€ created_by (FK â†’ users)
â”œâ”€â”€ title (VARCHAR)
â”œâ”€â”€ content (TEXT)
â”œâ”€â”€ priority (ENUM: normal, important, urgent)
â”œâ”€â”€ published_at (TIMESTAMP)
â”œâ”€â”€ expires_at (TIMESTAMP, nullable)
â”œâ”€â”€ created_at, updated_at

messages
â”œâ”€â”€ id (PK)
â”œâ”€â”€ sender_id (FK â†’ users)
â”œâ”€â”€ receiver_id (FK â†’ users)
â”œâ”€â”€ subject (VARCHAR)
â”œâ”€â”€ content (TEXT)
â”œâ”€â”€ is_read (BOOLEAN)
â”œâ”€â”€ read_at (TIMESTAMP, nullable)
â”œâ”€â”€ created_at, updated_at
```

### 4.4 Matriz de Permisos por Rol

| Permiso | Propietario | Residente | ComitÃ© | Colaborador | Administrador | TI |
|---------|:-----------:|:---------:|:------:|:-----------:|:-------------:|:--:|
| Ver perfil propio | âœ… | âœ… | âœ… | âœ… | âœ… | âœ… |
| Editar perfil propio | âœ… | âœ… | âœ… | âœ… | âœ… | âœ… |
| Ver propiedades asignadas | âœ… | âœ… | âœ… | âŒ | âœ… | âœ… |
| Pagar gastos comunes | âœ… | âœ… | âœ… | âŒ | âœ… | âŒ |
| Ver estados de cuenta | âœ… | âœ… | âœ… | âŒ | âœ… | âŒ |
| Crear tickets | âœ… | âœ… | âœ… | âœ… | âœ… | âœ… |
| Ver tickets propios | âœ… | âœ… | âœ… | âœ… | âœ… | âœ… |
| Asignar tickets | âŒ | âŒ | âŒ | âŒ | âœ… | âŒ |
| Resolver tickets | âŒ | âŒ | âŒ | âœ… | âœ… | âŒ |
| Ver reportes financieros | âŒ | âŒ | âœ… | âŒ | âœ… | âŒ |
| Aprobar gastos | âŒ | âŒ | âœ… | âŒ | âœ… | âŒ |
| Gestionar usuarios | âŒ | âŒ | âŒ | âŒ | âœ… | âœ… |
| Configurar sistema | âŒ | âŒ | âŒ | âŒ | âŒ | âœ… |
| Ver logs del sistema | âŒ | âŒ | âŒ | âŒ | âŒ | âœ… |
| Gestionar roles | âŒ | âŒ | âŒ | âŒ | âŒ | âœ… |
| Publicar comunicados | âŒ | âŒ | âœ… | âŒ | âœ… | âŒ |
| Enviar mensajes internos | âœ… | âœ… | âœ… | âœ… | âœ… | âœ… |

### 4.5 Endpoints API (Web + API)

#### AutenticaciÃ³n

| MÃ©todo | Endpoint | DescripciÃ³n | Auth |
|--------|----------|-------------|------|
| POST | `/login` | Iniciar sesiÃ³n | âŒ |
| POST | `/register` | Registrar usuario | âŒ |
| POST | `/logout` | Cerrar sesiÃ³n | âœ… |
| POST | `/forgot-password` | Recuperar contraseÃ±a | âŒ |
| POST | `/reset-password` | Resetear contraseÃ±a | âŒ |

#### Usuarios

| MÃ©todo | Endpoint | DescripciÃ³n | Auth |
|--------|----------|-------------|------|
| GET | `/api/users` | Listar usuarios | âœ… Admin/TI |
| GET | `/api/users/{id}` | Ver usuario | âœ… Admin/TI |
| POST | `/api/users` | Crear usuario | âœ… Admin/TI |
| PUT | `/api/users/{id}` | Actualizar usuario | âœ… Admin/TI |
| DELETE | `/api/users/{id}` | Eliminar usuario | âœ… TI |
| POST | `/api/users/{id}/assign-role` | Asignar rol | âœ… Admin/TI |

#### Propiedades

| MÃ©todo | Endpoint | DescripciÃ³n | Auth |
|--------|----------|-------------|------|
| GET | `/api/properties` | Listar propiedades | âœ… |
| GET | `/api/properties/{id}` | Ver propiedad | âœ… |
| POST | `/api/properties` | Crear propiedad | âœ… Admin |
| PUT | `/api/properties/{id}` | Actualizar propiedad | âœ… Admin |
| DELETE | `/api/properties/{id}` | Eliminar propiedad | âœ… Admin |

#### Finanzas

| MÃ©todo | Endpoint | DescripciÃ³n | Auth |
|--------|----------|-------------|------|
| GET | `/api/expenses` | Listar gastos comunes | âœ… |
| POST | `/api/expenses` | Crear gasto comÃºn | âœ… Admin/ComitÃ© |
| POST | `/api/expenses/show/{id}` | Ver detalle de gasto | âœ… Admin/ComitÃ© |
| PUT | `/api/expenses/{id}` | Actualizar gasto | âœ… Admin/ComitÃ© |
| DELETE | `/api/expenses/{id}` | Eliminar gasto | âœ… Admin/ComitÃ© |
| GET | `/api/payments` | Listar pagos | âœ… |
| POST | `/api/payments` | Registrar pago | âœ… |
| PUT | `/api/payments/{id}/reconcile` | Conciliar pago | âœ… Admin/ComitÃ© |
| GET | `/api/account-statement/{user_id}` | Estado de cuenta | âœ… Admin/Propietario |
| GET | `/api/fines` | Listar multas | âœ… |
| POST | `/api/fines` | Crear multa | âœ… Admin/ComitÃ© |
| GET | `/api/fines/{id}` | Ver multa | âœ… |
| PUT | `/api/fines/{id}` | Actualizar multa | âœ… Admin/ComitÃ© |
| DELETE | `/api/fines/{id}` | Eliminar multa | âœ… Admin/ComitÃ© |
| GET | `/api/condo-finances/catalog` | CatÃ¡logo contable | âœ… |
| GET | `/api/condo-finances/summary` | Resumen financiero | âœ… |
| GET | `/api/condo-finances/incomes` | Listar ingresos | âœ… |
| GET | `/api/condo-finances/expenses` | Listar egresos | âœ… |
| POST | `/api/condo-finances/incomes` | Crear ingreso | âœ… Admin/ComitÃ© |
| PUT | `/api/condo-finances/incomes/{id}` | Actualizar ingreso | âœ… Admin/ComitÃ© |
| DELETE | `/api/condo-finances/incomes/{id}` | Eliminar ingreso | âœ… Admin/ComitÃ© |
| POST | `/api/condo-finances/expenses` | Crear egreso | âœ… Admin/ComitÃ© |
| PUT | `/api/condo-finances/expenses/{id}` | Actualizar egreso | âœ… Admin/ComitÃ© |
| DELETE | `/api/condo-finances/expenses/{id}` | Eliminar egreso | âœ… Admin/ComitÃ© |

#### DevOps / TI

| MÃ©todo | Endpoint | DescripciÃ³n | Auth |
|--------|----------|-------------|------|
| POST | `/api/ti/command` | Ejecutar comando seguro | âœ… TI (`can:view logs`) |
| GET | `/api/ti/roles-permissions` | Matriz Spatie en vivo | âœ… TI (`can:view logs`) |
| POST | `/api/ti/roles-permissions/toggle` | Alternar permiso en rol | âœ… TI (`can:view logs`)

#### Tickets

| MÃ©todo | Endpoint | DescripciÃ³n | Auth |
|--------|----------|-------------|------|
| GET | `/api/tickets` | Listar tickets | âœ… |
| POST | `/api/tickets` | Crear ticket | âœ… |
| GET | `/api/tickets/{id}` | Ver ticket | âœ… |
| PUT | `/api/tickets/{id}` | Actualizar ticket | âœ… |
| PUT | `/api/tickets/{id}/assign` | Asignar ticket | âœ… Admin |
| PUT | `/api/tickets/{id}/resolve` | Resolver ticket | âœ… Admin/Colaborador |
| GET | `/api/ticket-categories` | Listar categorÃ­as | âœ… |
| POST | `/api/ticket-categories` | Crear categorÃ­a | âœ… Admin |

#### Comunicaciones

| MÃ©todo | Endpoint | DescripciÃ³n | Auth |
|--------|----------|-------------|------|
| GET | `/api/announcements` | Listar comunicados | âœ… |
| POST | `/api/announcements` | Crear comunicado | âœ… Admin/ComitÃ© |
| GET | `/api/messages` | Listar mensajes | âœ… |
| POST | `/api/messages` | Enviar mensaje | âœ… |
| PUT | `/api/messages/{id}/read` | Marcar como leÃ­do | âœ… |

### 4.6 Estructura de Directorios del Proyecto

```
redvecino/
â”œâ”€â”€ app/
â”‚   â”œâ”€â”€ Http/
â”‚   â”‚   â”œâ”€â”€ Controllers/
â”‚   â”‚   â”‚   â”œâ”€â”€ Auth/
â”‚   â”‚   â”‚   â”œâ”€â”€ UserController.php
â”‚   â”‚   â”‚   â”œâ”€â”€ PropertyController.php
â”‚   â”‚   â”‚   â”œâ”€â”€ ExpenseController.php
â”‚   â”‚   â”‚   â”œâ”€â”€ PaymentController.php
â”‚   â”‚   â”‚   â”œâ”€â”€ TicketController.php
â”‚   â”‚   â”‚   â””â”€â”€ AnnouncementController.php
â”‚   â”‚   â”œâ”€â”€ Middleware/
â”‚   â”‚   â”‚   â”œâ”€â”€ CheckRole.php
â”‚   â”‚   â”‚   â”œâ”€â”€ CheckPermission.php
â”‚   â”‚   â”‚   â””â”€â”€ LogApiRequests.php
â”‚   â”‚   â””â”€â”€ Requests/
â”‚   â”‚       â”œâ”€â”€ StoreUserRequest.php
â”‚   â”‚       â”œâ”€â”€ UpdateUserRequest.php
â”‚   â”‚       â”œâ”€â”€ StoreTicketRequest.php
â”‚   â”‚       â”œâ”€â”€ StorePaymentRequest.php
â”‚   â”‚       â”œâ”€â”€ StoreFineRequest.php
â”‚   â”‚       â”œâ”€â”€ UpdateFineRequest.php
â”‚   â”‚       â”œâ”€â”€ StoreExpenseRequest.php
â”‚   â”‚       â”œâ”€â”€ UpdateExpenseRequest.php
â”‚   â”‚       â”œâ”€â”€ StorePropertyRequest.php
â”‚   â”‚       â”œâ”€â”€ UpdatePropertyRequest.php
â”‚   â”‚       â”œâ”€â”€ UpdateTicketRequest.php
â”‚   â”‚       â”œâ”€â”€ AssignTicketRequest.php
â”‚   â”‚       â”œâ”€â”€ ResolveTicketRequest.php
â”‚   â”‚       â”œâ”€â”€ StoreTicketCategoryRequest.php
â”‚   â”‚       â”œâ”€â”€ StoreAnnouncementRequest.php
â”‚   â”‚       â”œâ”€â”€ StoreMessageRequest.php
â”‚   â”‚       â””â”€â”€ Auth/
â”‚   â”œâ”€â”€ Models/
â”‚   â”‚   â”œâ”€â”€ User.php
â”‚   â”‚   â”œâ”€â”€ Property.php
â”‚   â”‚   â”œâ”€â”€ Condominium.php
â”‚   â”‚   â”œâ”€â”€ CommonExpense.php
â”‚   â”‚   â”œâ”€â”€ ExpenseItem.php
â”‚   â”‚   â”œâ”€â”€ Payment.php
â”‚   â”‚   â”œâ”€â”€ Fine.php
â”‚   â”‚   â”œâ”€â”€ Ticket.php
â”‚   â”‚   â”œâ”€â”€ TicketCategory.php
â”‚   â”‚   â”œâ”€â”€ TicketAttachment.php
â”‚   â”‚   â”œâ”€â”€ Announcement.php
â”‚   â”‚   â”œâ”€â”€ Message.php
â”‚   â”‚   â”œâ”€â”€ CondoIncome.php
â”‚   â”‚   â”œâ”€â”€ CondoExpense.php
â”‚   â”‚   â”œâ”€â”€ AdminProfile.php
â”‚   â”‚   â”œâ”€â”€ CommitteeProfile.php
â”‚   â”‚   â”œâ”€â”€ EmployeeProfile.php
â”‚   â”‚   â”œâ”€â”€ OwnerProfile.php
â”‚   â”‚   â”œâ”€â”€ ResidentProfile.php
â”‚   â”‚   â””â”€â”€ TiProfile.php
â”‚   â”œâ”€â”€ Policies/
â”‚   â”‚   â”œâ”€â”€ UserPolicy.php
â”‚   â”‚   â”œâ”€â”€ PropertyPolicy.php
â”‚   â”‚   â”œâ”€â”€ TicketPolicy.php
â”‚   â”‚   â”œâ”€â”€ PaymentPolicy.php
â”‚   â”‚   â”œâ”€â”€ FinePolicy.php
â”‚   â”‚   â”œâ”€â”€ AnnouncementPolicy.php
â”‚   â”‚   â”œâ”€â”€ MessagePolicy.php
â”‚   â”‚   â”œâ”€â”€ CondoExpensePolicy.php
â”‚   â”‚   â”œâ”€â”€ CondoIncomePolicy.php
â”‚   â”‚   â”œâ”€â”€ CommonExpensePolicy.php
â”‚   â”‚   â””â”€â”€ ... (20 total, 1 por modelo)
â”‚   â”œâ”€â”€ Services/
â”‚   â”‚   â””â”€â”€ CondoFinanceService.php
â”‚   â””â”€â”€ Enums/
â”‚       â”œâ”€â”€ UserStatus.php
â”‚       â”œâ”€â”€ PropertyType.php
â”‚       â”œâ”€â”€ TicketStatus.php
â”‚       â”œâ”€â”€ TicketPriority.php
â”‚       â””â”€â”€ PaymentStatus.php
â”œâ”€â”€ database/
â”‚   â”œâ”€â”€ migrations/
â”‚   â”œâ”€â”€ seeders/
â”‚   â””â”€â”€ factories/
â”œâ”€â”€ resources/
â”‚   â”œâ”€â”€ js/
â”‚   â”‚   â”œâ”€â”€ Pages/
â”‚   â”‚   â”‚   â”œâ”€â”€ Auth/
â”‚   â”‚   â”‚   â”œâ”€â”€ Dashboard.jsx
â”‚   â”‚   â”‚   â”œâ”€â”€ Welcome.jsx
â”‚   â”‚   â”‚   â””â”€â”€ Profile/
â”‚   â”‚   â”œâ”€â”€ Components/
â”‚   â”‚   â”‚   â”œâ”€â”€ Admin/
â”‚   â”‚   â”‚   â”œâ”€â”€ Ti/
â”‚   â”‚   â”‚   â”œâ”€â”€ Colaborador/
â”‚   â”‚   â”‚   â”œâ”€â”€ Comite/
â”‚   â”‚   â”‚   â”œâ”€â”€ Propietario/
â”‚   â”‚   â”‚   â”œâ”€â”€ Residente/
â”‚   â”‚   â”‚   â”œâ”€â”€ RolePages/
â”‚   â”‚   â”‚   â”œâ”€â”€ DashboardShared.jsx
â”‚   â”‚   â”‚   â””â”€â”€ ApplicationLogo.jsx
â”‚   â”‚   â”œâ”€â”€ Layouts/       (7 layouts por rol)
â”‚   â”‚   â”œâ”€â”€ Hooks/
â”‚   â”‚   â””â”€â”€ utils/
â”‚   â”‚       â”œâ”€â”€ helpers.js
â”‚   â”‚       â”œâ”€â”€ notify.js
â”‚   â”‚       â””â”€â”€ constants.js
â”‚   â””â”€â”€ views/
â”‚       â””â”€â”€ app.blade.php
â”œâ”€â”€ routes/
â”‚   â”œâ”€â”€ web.php
â”‚   â””â”€â”€ api.php
â”œâ”€â”€ tests/
â”‚   â”œâ”€â”€ Feature/
â”‚   â””â”€â”€ Unit/
â””â”€â”€ ...
```

---

## 5. Historias de Usuario

### MÃ³dulo: Usuarios y Propiedades

| # | Historia | Criterios de AceptaciÃ³n |
|---|----------|------------------------|
| U01 | Como TI, puedo crear un usuario con datos base para que tenga acceso al sistema | Formulario con nombre, RUT, email, telÃ©fono, contraseÃ±a. ValidaciÃ³n de RUT Ãºnico y email Ãºnico. |
| U02 | Como TI, puedo asignar uno o mÃ¡s roles a un usuario para habilitar sus permisos | SelecciÃ³n mÃºltiple de roles. Al guardar, se muestran formularios condicionales segÃºn rol. |
| U03 | Como usuario, puedo ver y editar mi perfil para mantener mi informaciÃ³n actualizada | Solo campos permitidos por rol. No puede cambiar su propio rol. |
| U04 | Como Administrador, puedo crear y gestionar propiedades del condominio | CRUD completo con tipo, nÃºmero, bloque, piso, Ã¡rea, estado. |
| U05 | Como TI, puedo asignar un usuario a una propiedad para vincularlo | Un usuario puede tener mÃºltiples propiedades. Una propiedad puede tener mÃºltiples residentes. |

### MÃ³dulo: Finanzas

| # | Historia | Criterios de AceptaciÃ³n |
|---|----------|------------------------|
| F01 | Como Administrador, puedo crear un gasto comÃºn mensual para cobrar a las unidades | PerÃ­odo, monto, descripciÃ³n, fecha de vencimiento. Se genera automÃ¡ticamente para todas las unidades. |
| F02 | Como Propietario, puedo ver mis gastos comunes pendientes para saber cuÃ¡nto debo | Lista de gastos con estado, monto, fecha de vencimiento. Total adeudado visible. |
| F03 | Como Propietario, puedo registrar un pago para saldar mi deuda | Monto, mÃ©todo de pago, referencia. Estado cambia a "completado". Genera comprobante. |
| F04 | Como Administrador, puedo ver el estado de cuenta de cualquier unidad | Resumen de cargos, pagos, multas y saldo total. Exportable a PDF. |
| F05 | Como Administrador/ComitÃ©, puedo crear una multa para una unidad | RazÃ³n, monto, fecha de emisiÃ³n, fecha de vencimiento. NotificaciÃ³n al usuario. |

### MÃ³dulo: Tickets de Mantenimiento

| # | Historia | Criterios de AceptaciÃ³n |
|---|----------|------------------------|
| T01 | Como cualquier usuario, puedo crear un ticket de mantenimiento para reportar un problema | TÃ­tulo, descripciÃ³n, categorÃ­a, prioridad, propiedad afectada. Adjuntar fotos. |
| T02 | Como Administrador, puedo asignar un ticket a un colaborador para que lo resuelva | Lista de colaboradores disponibles. NotificaciÃ³n al asignado. |
| T03 | Como Colaborador, puedo ver los tickets asignados y actualizar su estado | Cambiar estado: abierto â†’ en progreso â†’ resuelto. Agregar notas de resoluciÃ³n. |
| T04 | Como usuario, puedo ver el estado de mis tickets para saber su progreso | Lista con estado, prioridad, asignado, fecha de creaciÃ³n. |
| T05 | Como Administrador, puedo crear categorÃ­as de tickets para organizar los reportes | CRUD de categorÃ­as con nombre y descripciÃ³n. |

### MÃ³dulo: Comunicaciones

| # | Historia | Criterios de AceptaciÃ³n |
|---|----------|------------------------|
| C01 | Como Administrador/ComitÃ©, puedo publicar un comunicado para informar a los residentes | TÃ­tulo, contenido, prioridad, fecha de expiraciÃ³n opcional. Visible en dashboard. |
| C02 | Como usuario, puedo ver los comunicados publicados para estar informado | Lista ordenada por fecha. Indicador de prioridad. |
| C03 | Como usuario, puedo enviar un mensaje interno a otro usuario | Destinatario, asunto, contenido. NotificaciÃ³n al receptor. |
| C04 | Como usuario, puedo ver mis mensajes recibidos y enviados | Bandeja de entrada y enviados. Marcar como leÃ­do. |

---

## 6. Alcance del MVP

### 6.1 Incluir (Fase 1-4)

- [x] Sistema de autenticaciÃ³n completo
- [x] CRUD de usuarios con roles dinÃ¡micos
- [x] CRUD de propiedades (unidades)
- [x] AsignaciÃ³n de usuarios a propiedades
- [x] Registro de gastos comunes
- [x] Registro de pagos
- [x] Estados de cuenta
- [x] Multas
- [x] Tickets de mantenimiento
- [x] Panel administrativo bÃ¡sico
- [x] Comunicados internos
- [x] MensajerÃ­a interna

### 6.2 Excluir (para versiÃ³n 2.0)

- [ ] WhatsApp API / Telegram
- [ ] Reservas (quincho, piscina, etc.)
- [ ] Seguridad (visitas, accesos, CCTV)
- [ ] RRHH y personal (turnos, sueldos)
- [ ] IA y automatizaciones
- [ ] AnalÃ­ticas y dashboards avanzados
- [ ] Emergencias y alertas masivas
- [ ] IoT y Smart Condo
- [ ] Multi-condominio (SaaS)
- [ ] App mÃ³vil nativa

---

## 7. Plan de ImplementaciÃ³n

### Fase 1: Setup y Core (Semana 1-2)

| Tarea | DescripciÃ³n | Estado |
|-------|-------------|--------|
| 1.1 | Crear proyecto Laravel 13 (`laravel new` â†’ seleccionar React stack) | â¬œ |
| 1.2 | Configurar SQLite + migraciÃ³n a MySQL futura | â¬œ |
| 1.3 | Starter kit React incluido (Inertia v3, React 18, TypeScript, shadcn/ui) | â¬œ |
| 1.4 | Instalar Spatie Laravel Permission v7 | â¬œ |
| 1.5 | Configurar Tailwind CSS v4 (vÃ­a `@import "tailwindcss"`, sin tailwind.config.js) | â¬œ |
| 1.6 | Crear migraciones de tablas core | â¬œ |
| 1.7 | Crear seeders de roles y permisos | â¬œ |
| 1.8 | Configurar estructura de directorios | â¬œ |

### Fase 2: Usuarios y Propiedades (Semana 3-4)

| Tarea | DescripciÃ³n | Estado |
|-------|-------------|--------|
| 2.1 | CRUD usuarios base | â¬œ |
| 2.2 | Sistema de roles dinÃ¡micos | â¬œ |
| 2.3 | Formularios condicionales por rol | â¬œ |
| 2.4 | CRUD propiedades | â¬œ |
| 2.5 | AsignaciÃ³n usuario-propiedad | â¬œ |
| 2.6 | Perfiles extendidos por rol | â¬œ |
| 2.7 | Tests de usuarios y propiedades | â¬œ |

### Fase 3: Finanzas (Semana 5-6)

| Tarea | DescripciÃ³n | Estado |
|-------|-------------|--------|
| 3.1 | CRUD gastos comunes | â¬œ |
| 3.2 | CRUD pagos | â¬œ |
| 3.3 | Estados de cuenta | â¬œ |
| 3.4 | CRUD multas | â¬œ |
| 3.5 | Reportes financieros bÃ¡sicos | â¬œ |
| 3.6 | Tests de finanzas | â¬œ |

### Fase 4: Mantenimiento y Comunicaciones (Semana 7-8)

| Tarea | DescripciÃ³n | Estado |
|-------|-------------|--------|
| 4.1 | CRUD tickets | â¬œ |
| 4.2 | CategorÃ­as y estados | â¬œ |
| 4.3 | AsignaciÃ³n a colaboradores | â¬œ |
| 4.4 | Adjuntar archivos a tickets | â¬œ |
| 4.5 | Comunicados internos | â¬œ |
| 4.6 | MensajerÃ­a interna | â¬œ |
| 4.7 | Dashboard bÃ¡sico | â¬œ |
| 4.8 | Tests de mantenimiento | â¬œ |

### Fase 5: Testing y Deploy (Semana 9-10)

| Tarea | DescripciÃ³n | Estado |
|-------|-------------|--------|
| 5.1 | Tests de integraciÃ³n completos | â¬œ |
| 5.2 | Tests de seguridad y permisos | â¬œ |
| 5.3 | OptimizaciÃ³n de rendimiento | â¬œ |
| 5.4 | DocumentaciÃ³n tÃ©cnica | â¬œ |
| 5.5 | ConfiguraciÃ³n de producciÃ³n (MySQL) | â¬œ |
| 5.6 | Deploy a servidor | â¬œ |
| 5.7 | Pruebas de aceptaciÃ³n | â¬œ |

---

## 8. Estrategia de Testing

> **Nota:** Pest PHP v4 requiere **PHP 8.3+** (compatible con Laravel 13). MigraciÃ³n desde v3: actualizar `pestphp/pest` a `^4.0` y `pestphp/pest-plugin-laravel` a `^4.0`.

### 8.1 Tipos de Tests

| Tipo | Herramienta | Cobertura Objetivo |
|------|-------------|-------------------|
| Unit | Pest v4 / PHPUnit | Models, Services, Enums |
| Feature | Pest v4 (Laravel plugin) | Controllers, API endpoints |
| Browser | Laravel Dusk | Flujos crÃ­ticos de usuario |
| Integration | Pest v4 / PHPUnit | Relaciones entre mÃ³dulos |

### 8.2 Tests CrÃ­ticos a Implementar

```
âœ… AutenticaciÃ³n y autorizaciÃ³n
âœ… CRUD de usuarios con validaciÃ³n de roles
âœ… AsignaciÃ³n de permisos por rol
âœ… CRUD de propiedades
âœ… Registro de pagos y actualizaciÃ³n de estado
âœ… CreaciÃ³n y asignaciÃ³n de tickets
âœ… Middleware de protecciÃ³n de rutas
âœ… Formularios condicionales por rol
âœ… Estados de cuenta correctos
âœ… Notificaciones internas
```

### 8.3 Comandos de Testing

```bash
# Ejecutar todos los tests
php artisan test

# Ejecutar tests de un mÃ³dulo especÃ­fico
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

### 9.1 Requisitos de ProducciÃ³n

| Componente | Requisito |
|------------|-----------|
| Servidor | Linux (Ubuntu 22.04+) |
| Web Server | Nginx o Apache |
| PHP | 8.3+ (Laravel 13 requiere PHP 8.3 mÃ­nimo) |
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
- [ ] APP_DEBUG=false en producciÃ³n
- [ ] SSL configurado
- [ ] Backups automÃ¡ticos de BD configurados
- [ ] Logs monitoreados
- [ ] Usuario admin inicial creado
- [ ] Roles y permisos seed ejecutados
- [ ] Assets compilados y optimizados
- [ ] CachÃ© de configuraciÃ³n generado

---

## 10. Timeline Estimado

| Fase | DuraciÃ³n | Fecha Inicio | Fecha Fin |
|------|----------|--------------|-----------|
| Setup y Core | 2 semanas | Semana 1 | Semana 2 |
| Usuarios y Propiedades | 2 semanas | Semana 3 | Semana 4 |
| Finanzas | 2 semanas | Semana 5 | Semana 6 |
| Mantenimiento y Comunicaciones | 2 semanas | Semana 7 | Semana 8 |
| Testing y Deploy | 2 semanas | Semana 9 | Semana 10 |

**Total estimado: 10 semanas**

---

## 11. Decisiones TÃ©cnicas Clave

| DecisiÃ³n | OpciÃ³n Elegida | RazÃ³n |
|----------|---------------|-------|
| Framework | Laravel 13.x | Ãšltima versiÃ³n estable, PHP 8.3+, nuevas caracterÃ­sticas |
| Frontend | Inertia.js v3 + React 18 + TypeScript | SPA sin API separada, tipado estÃ¡tico, componentes modernos |
| Base de datos dev | SQLite | RÃ¡pido, sin configuraciÃ³n, ideal para desarrollo |
| Base de datos prod | MySQL 8+ | Escalable, compatible con SaaS futuro |
| AutenticaciÃ³n | Laravel 13 Starter Kit (React) | Incluye Inertia v3, React 18, shadcn/ui, TypeScript |
| Permisos | Spatie Laravel Permission v7 | EstÃ¡ndar de la industria, bien documentado |
| UI Components | shadcn/ui | Componentes modernos, accesibles, personalizables, port oficial de shadcn para React |
| Estilo | Tailwind CSS v4 | Utility-first, sin config file, @import basado |
| Build | Vite 8 + laravel-vite-plugin | Vite 8 usa Rolldown (bundler en Rust) para builds ultra-rÃ¡pidos, HMR nativo |
| Testing | Pest PHP v4 + PHPUnit | Sintaxis moderna, mejor DX, integraciÃ³n Laravel |
| Arquitectura | Monolito modular | MÃ¡s simple que microservicios, fÃ¡cil de escalar despuÃ©s |
| Multi-tenant | Post-MVP | Complejidad innecesaria para MVP |

---

## 12. Riesgos y MitigaciÃ³n

| Riesgo | Probabilidad | Impacto | MitigaciÃ³n |
|--------|-------------|---------|------------|
| Scope creep | Alta | Alto | Mantener lista de "excluidos" visible, revisar en cada sprint |
| Complejidad de formularios dinÃ¡micos | Media | Medio | Usar componentes React reutilizables + shadcn/ui, validar en backend |
| Problemas de rendimiento con Spatie | Baja | Bajo | Cachear permisos vÃ­a `php artisan permission:cache-reset`, usar Ã­ndices en BD |
| Cambio de requisitos | Media | Alto | Documentar todo, mantener comunicaciÃ³n constante |
| Falta de validaciÃ³n de mercado | Alta | Alto | Buscar primer cliente piloto durante desarrollo |

---

## 13. Estrategia de Crecimiento y Embudo (GTM & Sales Funnel)

Basado en la planeaciÃ³n estratÃ©gica analizada de la suite, se establece un embudo de conversiÃ³n estructurado para escalar el negocio desde el MVP:

1. **AtracciÃ³n (Conciencia):** GeneraciÃ³n de contenidos Ãºtiles y testimonios sobre la digitalizaciÃ³n inmobiliaria para atraer a juntas de vigilancia y comitÃ©s.
2. **InterÃ©s (ConsideraciÃ³n):** DemostraciÃ³n del valor diferenciado de tener el portal corporativo **RedVecino** para administraciÃ³n y el portal del residente **MiVecino**.
3. **Captura de Leads (ConversiÃ³n Inicial):** UtilizaciÃ³n de formularios interactivos y la simulaciÃ³n interactiva local para registrar datos de administradores interesados.
4. **NutriciÃ³n (RelaciÃ³n):** AutomatizaciÃ³n de correos electrÃ³nicos informativos y demostraciones personalizadas.
5. **ConversiÃ³n (DecisiÃ³n):** PresentaciÃ³n del retorno de inversiÃ³n (ROI) en eficiencia y mitigaciÃ³n de morosidad para cerrar contratos comerciales.
6. **FidelizaciÃ³n y RecomendaciÃ³n (Lealtad):** Soporte tÃ©cnico permanente, capacitaciÃ³n y programa de referidos de condominio a condominio.

---

## 14. Estrategia de Marketing Digital (Social Media & Reels)

Se incorpora la planificaciÃ³n publicitaria de redes sociales para posicionar las marcas de forma coordinada:

*   **IdentificaciÃ³n del Dolor (Problema):** *"Â¿Muchos avisos por todos lados?"* (descontrol de informaciÃ³n en chats informales).
*   **PresentaciÃ³n de SoluciÃ³n:** *"La app que organiza tu condominio: MiVecino. MÃ¡s simple, mÃ¡s rÃ¡pida, mÃ¡s cerca."*
*   **Evidencias de Valor (Beneficios):**
    *   Pagos seguros con comprobante al instante.
    *   Trazabilidad de incidencias (electricidad, ascensores, portones).
    *   Muro digital de avisos con notificaciones automÃ¡ticas en el celular.
*   **Llamado a la AcciÃ³n (CTA):** *"Ãšnete a la comunidad inteligente. Descarga la app y Ãºnete hoy."*

---

## 15. Especificaciones Avanzadas de IngenierÃ­a PropTech (EstÃ¡ndar Empresarial)

Para robustecer la suite hacia un nivel corporativo y prepararla para su escalabilidad como plataforma SaaS de alta disponibilidad, se incorporan las siguientes especificaciones tÃ©cnicas de diseÃ±o de software y lÃ³gica de negocio descritas en el reporte de IngenierÃ­a PropTech:

### 15.1 GestiÃ³n Financiera y Contabilidad Automatizada
*   **Partida Doble Real:** El motor financiero debe segregar de forma estricta el fondo operativo ordinario del fondo de reserva extraordinario del condominio. Cada movimiento de caja debe registrarse con su correspondiente dÃ©bito y crÃ©dito, haciÃ©ndolo 100% auditable por terceros.
*   **CÃ¡lculo de Cuota Ordinaria por Coeficiente de Copropiedad:**
    El prorrateo automÃ¡tico de los gastos comunes mensuales presupuestados se rige bajo la siguiente fÃ³rmula matemÃ¡tica obligatoria:
    $$\text{Coeficiente}_i = \frac{\text{Ãrea Privada}_i}{\sum_{j=1}^{N} \text{Ãrea Privada}_j}$$
    Donde $N$ es el total de unidades habitacionales o comerciales del condominio, y la suma de todos los coeficientes individuales debe ser estrictamente equivalente a la unidad ($1.00$ o $100\%$).
*   **Motor de Reglas de Morosidad:**
    *   **CÃ¡lculo de Intereses:** Al detectarse el vencimiento de una cuota (ordinaria o extraordinaria), el motor de reglas calcula en caliente los intereses moratorios acumulados con base en las tasas parametrizadas segÃºn el reglamento del condominio.
    *   **SuspensiÃ³n de Beneficios:** El sistema bloquea de forma autÃ³noma accesos no esenciales (como reservas de Ã¡reas comunes) e inhabilita las credenciales de dispositivos de apertura remota (portones/puertas) vinculados a la propiedad que acumule **3 meses de morosidad**.

### 15.2 Mantenimiento de Activos y Control de Campo
*   **Asistencia por IA:** Un servicio de inteligencia artificial asiste en la asignaciÃ³n inteligente y programaciÃ³n de tareas correctivas y preventivas (ej: ascensores, bombas de agua).
*   **Lista de VerificaciÃ³n con Evidencia FotogrÃ¡fica:** El flujo de los colaboradores tÃ©cnicos exige completar una lista de verificaciÃ³n digital (Checklist) en su dispositivo mÃ³vil y la carga obligatoria de fotografÃ­as del activo **antes y despuÃ©s** del servicio para certificar el rendimiento de los contratistas.
*   **Alianzas Integradas:** Canales de conexiÃ³n de software con entidades bancarias para apertura de cuentas corrientes de comunidades, integraciones con aseguradoras de bienes comunes y alianzas legales para recuperaciÃ³n de cartera.

### 15.3 ConserjerÃ­a Inteligente y Seguridad Perimetral
*   **CÃ³digos QR DinÃ¡micos:** GeneraciÃ³n de invitaciones de un solo uso para visitas peatonales y vehiculares, con opciÃ³n de envÃ­o directo por servicios de mensajerÃ­a (WhatsApp), reduciendo el criterio manual del guardia.
*   **GestiÃ³n de PaqueterÃ­a OCR:**
    *   El conserje captura la etiqueta del paquete con la cÃ¡mara del dispositivo mÃ³vil.
    *   Un motor de **Reconocimiento Ã“ptico de Caracteres (OCR)** procesa y asocia automÃ¡ticamente el paquete al departamento correspondiente.
    *   Se captura la firma digital del guardia que lo recibe y se dispara una alerta push inmediata al residente, manteniendo una cadena de custodia ininterrumpida hasta la entrega fÃ­sica final.
*   **Rondas con NFC:** Puntos de control perimetrales mediante etiquetas NFC pasivas distribuidas en el condominio. El guardia debe tocarlas fÃ­sicamente con su smartphone mÃ³vil para registrar y verificar sus patrullajes presenciales en tiempo real en la central de seguridad.

### 15.4 Arquitectura de Datos Local-First y SincronizaciÃ³n Delta
*   **Persistencia Local Primaria:** Para entornos con conectividad nula o intermitente (sÃ³tanos, bÃºnkeres de servicios, elevadores), la aplicaciÃ³n mÃ³vil adopta el paradigma **Local-First** utilizando motores de persistencia local de alto rendimiento (como RxDB, IndexedDB o MMKV para estados clave-valor rÃ¡pidos).
*   **Cola de Transacciones Outbound:** Las operaciones fuera de lÃ­nea se guardan secuencialmente en una cola FIFO local (*Outbound Queue* - Append-Only Log) y se reflejan de inmediato en la UI con actualizaciones optimistas.
*   **SincronizaciÃ³n Incremental por Lotes (Delta Sync):** Al recuperar conexiÃ³n, la app empaqueta la cola y la envÃ­a por lotes, solicitando al servidor central Ãºnicamente las modificaciones registradas desde su Ãºltimo timestamp exitoso.
*   **ResoluciÃ³n de Conflictos:** AplicaciÃ³n del algoritmo *Last-Write-Wins (LWW)* basado en el timestamp mÃ¡s reciente para datos transaccionales bÃ¡sicos, y estructuras *Conflict-Free Replicated Data Types (CRDT)* para datos concurrentes crÃ­ticos (como inventarios de Ã¡reas comunes).
*   **MitigaciÃ³n de Red:** Algoritmo de retroceso exponencial (*Exponential Backoff*) para reintentos de conexiÃ³n ordenados, preservando la baterÃ­a del dispositivo y recursos del procesador.

### 15.5 Gobernanza Legal y Votaciones en Asambleas Virtuales
*   **Censo y QuÃ³rum en Vivo:** ValidaciÃ³n en tiempo real del censo de propietarios e inquilinos acreditados mediante cartas poder. Los usuarios con deudas morosas al inicio de la asamblea pierden derecho a voto y sus coeficientes se restan para la consolidaciÃ³n de quÃ³rums.
*   **AutenticaciÃ³n Fuerte de Identidad:** VerificaciÃ³n de identidad con certificados digitales y credenciales fuertes para evitar impugnaciones legales de actas de asamblea.
*   **CÃ¡lculo de MayorÃ­a Doble Ponderada:** Los acuerdos en asambleas exigen el cumplimiento simultÃ¡neo de dos umbrales matemÃ¡ticos:
    -   *QuÃ³rum por Cabezas:* $\sum_{i \in A} U_i > \text{Umbral Legal}$ (donde $U_i$ representa el voto nominal unitario por unidad, usualmente 1).
    -   *QuÃ³rum por Coeficiente:* $\sum_{i \in A} C_i > \text{Umbral Legal}$ (donde $C_i$ es el coeficiente especÃ­fico de copropiedad de la unidad).
    Para asambleas extraordinarias de obras mayores, el sistema eleva de forma automatizada estos umbrales al **75%** de coeficientes presentes.
*   **Audit Trail Inmutable:** GrabaciÃ³n automatizada en audio y video de la asamblea enlazada con sellado de tiempo oficial, y generaciÃ³n automÃ¡tica de actas de votaciones con hashes Ãºnicos inmutables por cada voto emitido.

### 15.6 Frontera de APIs MÃ³viles y Seguridad (Mobile Attestation)
*   **Filtro Antifraude de Clientes:** Para prevenir fuga de datos financieros o manipulaciÃ³n de votos, las APIs REST de la nube implementan tecnologÃ­as avanzadas de **App Attestation**.
*   **CertificaciÃ³n de Dispositivo:** El SDK mÃ³vil integrado solicita una firma criptogrÃ¡fica nativa del hardware del telÃ©fono (DeviceCheck en iOS o Play Integrity en Google).
*   **Bloqueo de Entornos Vulnerables:** El servidor central rechaza de inmediato cualquier peticiÃ³n que no contenga una firma criptogrÃ¡fica vÃ¡lida o que sea iniciada desde dispositivos con Root, Jailbreak, emuladores maliciosos o con inyecciÃ³n activa de scripts.

### 15.7 Adaptaciones Avanzadas de Inteligencia Artificial (zAux GuÃ­a 2)
Para elevar el valor competitivo de la plataforma en el sector PropTech, se incorporan las siguientes adaptaciones funcionales basadas en la GuÃ­a 2 del Curso de IA de Mayo 2026:
*   **Gastos Comunes e Incidencias por Voz:** IntegraciÃ³n de un motor de reconocimiento de voz y procesamiento de lenguaje natural (NLP) que permite a los administradores registrar egresos contables dictando Ã³rdenes simples y a los residentes reportar desperfectos en su condominio de forma oral, auto-categorizando los reportes con prioridad y asignaciÃ³n automatizada.
*   **Actas Automatizadas de Asambleas de Copropietarios:** Procesamiento de grabaciones de audio de asambleas virtuales para la generaciÃ³n automÃ¡tica de actas PDF estructuradas. Incluye: cÃ¡lculo matemÃ¡tico de quÃ³rum doble ponderado (cabezas y coeficientes), resumen de acuerdos aprobados, y lista de responsables asignados, almacenÃ¡ndose de forma inmutable en la biblioteca del condominio.
*   **Insights de Morosidad Vecinal Predictiva:** Modelado inteligente del historial de pagos y mensajerÃ­a en chat de residentes. Permite emitir resÃºmenes predictivos al administrador recomendando acciones de cobranza personalizadas y selectivas en lugar de alertas automÃ¡ticas punitivas.
*   **BoletÃ­n en VÃ­deo Comunitario (fal.ai API):** IntegraciÃ³n con la API externa de fal.ai para la sÃ­ntesis automatizada de boletines semanales en formato de vÃ­deo animado con avatares integrados que resumen las circulares largas publicadas por la administraciÃ³n en MiVecino.

### 15.8 BitÃ¡cora de Despliegue y Correcciones de la ReuniÃ³n (zAux 27/05)
Derivado de la auditorÃ­a tÃ©cnica de la reuniÃ³n presencial de HÃ©ctor y RenÃ© del 27 de mayo de 2026, se especifican las siguientes directrices operativas y de seguridad obligatorias:
*   **UnificaciÃ³n Visual en Enlace de Logos:** En la barra superior y logos de RedVecino, el punto de la letra "i" simularÃ¡ la silueta de un vecino de color Verde CÃ©sped (o Celeste/Turquesa), consolidando la identidad del portal con el diseÃ±o mÃ³vil de MiVecino.
*   **Control Riguroso de Roles e Impedimento de Fugas de Acceso (Bug Rodrigo #1):** Aislamiento total de accesos basados en roles. El middleware de Laravel bloquearÃ¡ estrictamente que cuentas de tipo "cliente" (residentes y propietarios) accedan a rutas administrativas globales de RedVecino (`/api/users`, `/api/properties`, etc.).
*   **CorrecciÃ³n de Duplicados en Reportes PDF (Bug Rodrigo #2):** AuditorÃ­a de los bucles de renderizaciÃ³n Blade y eventos de disparo JS en el frontend para erradicar la duplicaciÃ³n de datos al exportar listados de deudas y estados de cuenta.
*   **Consola de Emergencia TI Web:** Interfaz para el rol de TI sÃºper usuario con un menÃº interactivo para la ejecuciÃ³n segura de comandos artisan (`database status`, `cache:clear`, `permissions:reset`) para el mantenimiento de producciÃ³n en servidores compartidos sin acceso SSH terminal.
*   **Estructura de Tres Canales para el Sistema de Tickets:** El mÃ³dulo de tickets se segrega estrictamente en:
    1.  *Tickets de Mantenimiento:* Reportes vecinales de averÃ­as edilicias.
    2.  *Tickets de Pago:* NotificaciÃ³n del copropietario reportando comprobantes de depÃ³sitos para su conciliaciÃ³n de gastos.
    3.  *Tickets de TI (AverÃ­as de Plataforma):* Incidencias del administrador dirigidas directamente al soporte de ingenierÃ­a de RedVecino.
*   **Flujo de Correspondencia OCR:** Registro e inventario automatizado en conserjerÃ­a para paqueterÃ­a, guardando la empresa de courier, datos del destinatario, firma del guardia y firma digital del residente.

### 15.9 Especificaciones de la EstaciÃ³n de Trabajo del Administrador, ImpersonaciÃ³n TI y SEO Avanzado (zAux 31/05)
Derivado de la refactorizaciÃ³n e ingenierÃ­a de interfaz de la estaciÃ³n de trabajo y optimizaciones SEO del 31 de mayo de 2026, se especifican las siguientes normas tÃ©cnicas obligatorias:
*   **Layout Widescreen Adaptativo de PC:** El portal administrativo de RedVecino para pantallas de PC implementa un esquema de dos paneles horizontales:
    -   *Panel Lateral Izquierdo (Sidebar):* Un menÃº vertical de ancho fijo (`w-64`) en fondo oscuro (`slate-950`), el cual integra el logotipo de la marca con animaciÃ³n de pulso activo, el selector desplegable de condominio activo y los enlaces principales de operaciÃ³n con fuente tipogrÃ¡fica Montserrat.
    -   *Panel de Contenido Derecho (Main Area):* Un contenedor flexible widescreen con un ancho de visualizaciÃ³n mÃ¡ximo de `max-w-[1700px]`, con scroll interno y cabeceras dinÃ¡micas que se ajustan reactivamente segÃºn la pestaÃ±a de navegaciÃ³n activa.
*   **IntegraciÃ³n de ConfiguraciÃ³n de Cuenta en Perfil:** Se erradica el acceso redundante a Ajustes del menÃº lateral y se integra como un disparador interactivo en la tarjeta de perfil administrativo al fondo del sidebar. Esta tarjeta implementa transiciones hover de escala y un indicador visual de engrane `âš™ï¸` que redirecciona a la secciÃ³n de configuraciÃ³n de cuenta, la cual porta un formulario dual de datos de perfil y ajustes del motor de base de datos y alertas por email.
*   **SincronizaciÃ³n DinÃ¡mica de Entornos TI (Impersonation):** La interfaz de sÃºper usuario TI se vincula reactivamente a travÃ©s de un hook de efecto (`useEffect`) al rol del usuario en sesiÃ³n (`isTiRole`). Al activar la impersonaciÃ³n de un residente o un administrador de condominio, el entorno TI debe apagar automÃ¡ticamente el portal DevOps TI para desplegar con absoluta fidelidad y consistencia el portal o la app mÃ³vil del usuario simulado, restaurÃ¡ndose de inmediato una vez se abandona la impersonaciÃ³n.
*   **EstÃ¡ndares de SEO y Favicon de PestaÃ±as:** 
    -   *PÃ¡ginas PÃºblicas (Welcome):* Deben contener un marcado SEO robusto inyectando etiquetas de descripciÃ³n, palabras clave (keywords), tarjetas sociales Open Graph (Facebook/LinkedIn) y Twitter Cards, vinculando la imagen principal de marca y el favicon oficial `/images/logo_redvecino.png`.
    -   *PÃ¡ginas Privadas (Dashboard/Admin):* Deben incorporar tÃ­tulos dinÃ¡micos detallados para el navegador (ej: *"Dashboard RedVecino - GestiÃ³n de Condominio"*) y forzar de manera obligatoria la directiva de meta-robots `<meta name="robots" content="noindex, nofollow" />` para asegurar que las consolas administrativas internas de copropietarios y administraciÃ³n no sean rastreadas ni indexadas por raÃ­ces de bÃºsqueda pÃºblicos.

### 15.10 Especificaciones del Manual Operativo y Contable y Remuneraciones (zAux 02/06)
Derivado de la incorporaciÃ³n de las directrices operativas, contables y laborales del 2 de junio de 2026, se especifican las siguientes directrices y reglas tÃ©cnicas:
*   **JerarquÃ­a de Roles de Alta Densidad (TI, SÃºper Usuario, Administrador):**
    -   *TI:* Administra la telemetrÃ­a, soporte tÃ©cnico, y posee la facultad de crear la cuenta del **SÃºper Usuario** del servicio.
    -   *SÃºper Usuario:* ActÃºa como licenciatario comercial de la suite SaaS. Crea, modifica, suspende o elimina cuentas de administradores.
    -   *Administrador:* Ejecuta la definiciÃ³n paramÃ©trica del condominio (RUT, prorrateo por $m^2$, correlativos de unidades) y la operaciÃ³n financiera (ingresos/egresos) y laboral.
*   **Esquema de ContrataciÃ³n de Colaboradores:**
    -   El motor de recursos humanos exige que para puestos como conserjes, recepcionistas y personal de mantenimiento, se generen **dos contratos iniciales de plazo fijo de 3 meses cada uno** antes de emitir la vinculaciÃ³n contractual definitiva indefinida.
*   **Algoritmo del Motor de Cobros de Gastos Comunes ($Total_{unidad}$):**
    El cÃ¡lculo por unidad integra la fÃ³rmula de Prorrateo, un Fondo de Reserva extraordinario del 5% y consumos de cargos individuales de la unidad:
    -   *Gasto ComÃºn Base ($G$):* $G = E_{total} \times P_{unidad}$
    -   *Fondo de Reserva ($FR$):* $FR = (E_{total} \times 0.05) \times P_{unidad}$
    -   *ObligaciÃ³n EconÃ³mica Mensual ($T_{mes}$):* $T_{mes} = G + FR + C_{ind}$
*   **Motor de RemuneraciÃ³n y Cotizaciones Legales:**
    El cÃ¡lculo de la liquidaciÃ³n de remuneraciÃ³n de colaboradores sigue los porcentajes previsionales de la legislaciÃ³n chilena (Fonasa y AFC):
    -   *Total Haberes ($H_{total}$):* $H_{total} = \text{Sueldo Base Imponible} + \text{LocomociÃ³n} + \text{ColaciÃ³n}$
    -   *CotizaciÃ³n de Salud (Fonasa):* $7.00\%$ sobre el Sueldo Base Imponible.
    -   *Fondo de PensiÃ³n (AFP):* $11.44\%$ (AFP Capital) sobre el Sueldo Base Imponible.
    -   *Seguro de CesantÃ­a (AFC):* $0.60\%$ sobre el Sueldo Base Imponible.
    -   *Sueldo LÃ­quido ($S_{liquido}$):* $S_{liquido} = H_{total} - (\text{Salud} + \text{PensiÃ³n} + \text{CesantÃ­a})$

### 15.11 Consola DevOps ProgramÃ¡tica, Matriz Real Spatie y SincronizaciÃ³n Reactiva de SesiÃ³n (zAux 04/06)
Derivado de la integraciÃ³n de herramientas de diagnÃ³stico y auditorÃ­a de permisos de la sesiÃ³n de junio de 2026, se definen las siguientes especificaciones tÃ©cnicas:
*   **Consola de Emergencia TI ProgramÃ¡tica (VPS Attestation):**
    -   *Endpoint Seguro:* `POST /api/ti/command` protegido bajo el middleware `auth:sanctum` y validaciÃ³n de rol de TI.
    -   *DiagnÃ³stico de Logs sin SSH:* El comando `logs:view` ejecuta un puntero nativo PHP (`fseek` con lectura de buffer reversible) para extraer las Ãºltimas 50 lÃ­neas de `storage/logs/laravel.log`. Esto previene la inyecciÃ³n de comandos y funciona bajo configuraciones restrictivas de VPS que inhabilitan `shell_exec`.
    -   *Comandos Artisan Permitidos:* `db:status`, `cache:clear`, `system:info`, `auth:permissions`, `logs:view`, `logs:clear`, `db:migrate` (con `--force`), y `db:seed`.
*   **Matriz Real Spatie RBAC y Persistencia de Permisos:**
    -   *Arquitectura de API:* `GET /api/ti/roles-permissions` y `POST /api/ti/roles-permissions/toggle`.
    -   *Toggles de Roles:* Modifica las relaciones Spatie de forma persistente llamando a `givePermissionTo` y `revokePermissionTo` en el kernel Eloquent, vaciando automÃ¡ticamente la cachÃ© del package mediante `forgetCachedPermissions()`.
    -   *SincronizaciÃ³n Reactiva (Session Reload):* Para evitar inconsistencias de visualizaciÃ³n (por ejemplo, que el usuario en sesiÃ³n active/desactive un permiso de su propio rol y el menÃº lateral no se entere), la matriz ejecuta una recarga en caliente de props mediante `router.reload()` de Inertia, actualizando las autorizaciones de la SPA en milisegundos.
*   **InspecciÃ³n del Mapa de OcupaciÃ³n Sandbox:**
    -   *Mapeo de Usuarios:* Al clickear una celda de departamento en el Sandbox de InspecciÃ³n, el sistema realiza una bÃºsqueda bidireccional por nombres de dueÃ±os y residentes (`p.owners` y `p.residents`) contra la tabla global de usuarios `usersList`.
    -   *Auto-ImpersonaciÃ³n:* De encontrar coincidencia de usuario activo, la interfaz inicia automÃ¡ticamente la impersonaciÃ³n Spatie de ese residente para auditar sus privilegios y vista PropTech sin salir del sandbox.

### 15.12 EstÃ¡ndares y Directrices de Arquitectura Backend (v1.0)

Derivado de la auditorÃ­a completa del backend del 5 de Junio de 2026 (13 hallazgos corregidos), se establecen las siguientes directrices obligatorias para todo desarrollo futuro del backend Laravel:

#### 15.12.1 OrganizaciÃ³n de Rutas (`routes/api.php`)

- Toda ruta API debe usar un **controlador dedicado**, nunca closures inline.
- Las rutas sensibles (admin, TI) deben agruparse bajo `auth:sanctum` y `throttle:60,1`.
- Los comandos TI deben tener rate limiting mÃ¡s restrictivo (`throttle:30,1`).
- Los permisos se asignan vÃ­a middleware `can:permission_name`, no en constructores de controladores (Laravel 11+ no soporta `$this->middleware()` en constructores).
- No deben existir rutas "muertas" (endpoints sin controlador asignado).

**PatrÃ³n obligatorio:**
```php
Route::middleware(['auth:sanctum', 'throttle:60,1'])->group(function () {
    Route::middleware('can:manage users')->group(function () {
        Route::get('/users', [UserController::class, 'index']);
        Route::post('/users', [UserController::class, 'store']);
    });

    Route::prefix('ti')->middleware('throttle:30,1')->group(function () {
        Route::post('/command', [TiCommandController::class, 'execute']);
    });
});
```

#### 15.12.2 Seguridad y Headers

- **CORS:** `config/cors.php` debe existir con `supports_credentials => true`, orÃ­genes dinÃ¡micos vÃ­a `CORS_ALLOWED_ORIGINS`, y `HandleCors` registrado como middleware prepend en el grupo API (`bootstrap/app.php`).
- **Sanctum:** `config/sanctum.php` debe tener `'expiration' => 1440` (24 horas). Nunca `null`.
- **Rate Limiting:** Configurar `RateLimiter::for('api')` con 60 req/min por usuario/IP en `AppServiceProvider::boot()`.

#### 15.12.3 PolÃ­ticas de AutorizaciÃ³n (Policies)

- **Una Policy por modelo.** Cada modelo Eloquent debe tener su clase Policy en `app/Policies/`.
- Toda Policy debe verificar permisos Spatie: `$user->can('permission_name')`.
- Para recursos con owner, la Policy debe verificar ownership ademÃ¡s del permiso:
```php
public function view(User $user, Ticket $ticket): bool
{
    return $user->can('create tickets') || $user->id === $ticket->created_by;
}
```

#### 15.12.4 Form Requests de ValidaciÃ³n

- **Un FormRequest por operaciÃ³n CRUD** (ej. `StoreUserRequest`, `UpdateUserRequest`).
- Nunca usar `$request->validate()` inline en controladores.
- `authorize()` debe retornar `true` (permisos se controlan vÃ­a middleware).

#### 15.12.5 Capa de Servicios

- La lÃ³gica de negocio compleja debe extraerse a clases Service en `app/Services/`.
- Los controladores deben delegar en servicios y solo manejar concerns HTTP (request, response, status codes, JSON formatting).
- Los servicios deben ser inyectables vÃ­a constructor, sin estado HTTP.
```php
class CondoFinanceController extends Controller
{
    public function __construct(
        protected CondoFinanceService $service
    ) {}
}
```

#### 15.12.6 Modelos Eloquent

- Todo modelo debe usar `use HasFactory;` e importar su Factory.
- Todo modelo debe definir el mÃ©todo `casts(): array` con tipos explÃ­citos (date, datetime, decimal:2, boolean, integer).
```php
protected function casts(): array
{
    return [
        'amount' => 'decimal:2',
        'issued_date' => 'date',
        'due_date' => 'date',
        'is_active' => 'boolean',
    ];
}
```

#### 15.12.7 Factories

- **Una Factory por modelo.** Toda factory debe residir en `database/factories/`.
- Usar `User::factory()` para relaciones forÃ¡neas, no IDs hardcodeados.
- Usar `fake()` para datos de prueba con tipos locales (`es_CL`).

#### 15.12.8 Testing

- **Priorizar Feature/Integration tests sobre Unit tests.** Los tests de feature verifican el comportamiento real del sistema (ruta + controlador + DB + autorizaciÃ³n).
- Usar `RefreshDatabase` + `$this->seed()` para estado determinista.
- **Testear caminos de error primero** (unhappy paths): 401 (unauthenticated), 403 (unauthorized), 422 (validation).
- Cada nuevo endpoint debe tener al menos: test de autorizaciÃ³n (403), test de autenticaciÃ³n (401), test de validaciÃ³n (422), test de Ã©xito (200/201).
- No usar mocks para Eloquent o base de datos â€” probar contra SQLite en memoria.

#### 15.12.9 Middleware

- El logging de API debe implementarse como middleware dedicado (`LogApiRequests`), registrado en el grupo API de `bootstrap/app.php`.
- Usar canales de log separados por dominio (`api` â†’ `storage/logs/api.log`) con rotaciÃ³n diaria.
```php
'api' => [
    'driver' => 'daily',
    'path' => storage_path('logs/api.log'),
    'level' => env('LOG_LEVEL', 'info'),
    'days' => 14,
],
```

#### 15.12.10 Registro de Middleware en Laravel 11+

En `bootstrap/app.php`, el middleware se configura mediante mÃ©todos fluidos, no mediante `$middleware` arrays de kernel:
```php
->withMiddleware(function (Middleware $middleware): void {
    $middleware->api(prepend: [
        \Illuminate\Http\Middleware\HandleCors::class,
    ]);
    $middleware->api(append: [
        \App\Http\Middleware\LogApiRequests::class,
    ]);
})
```

---

### 15.13 EspecificaciÃ³n de Reglas Financieras y Remuneraciones Avanzadas (zAux 05/06)

Derivado de la incorporaciÃ³n de las directrices e infografÃ­as de la sesiÃ³n del 5 de junio de 2026, se especifican de manera obligatoria las siguientes reglas de negocio y cÃ¡lculo:

#### 15.13.1 Motor Financiero de Gastos Comunes (GGCC)
El cÃ¡lculo mensual para cada unidad habitacional o comercial se estructura en base a las siguientes directrices y fases:

1.  **ParametrizaciÃ³n Inicial del Condominio:**
    *   **Tipos de Unidad ($m^2$):** CatÃ¡logo de unidades con coeficiente de prorrateo asociado:
        *   *Tipo A:* $60\text{ m}^2$ $\rightarrow$ $0.80\%$ de alÃ­cuota.
        *   *Tipo B:* $80\text{ m}^2$ $\rightarrow$ $1.05\%$ de alÃ­cuota.
        *   *Tipo C:* $120\text{ m}^2$ $\rightarrow$ $1.50\%$ de alÃ­cuota.
    *   **ConfiguraciÃ³n de Medidores por Torre:** Permite mapear consumos independientes por torre (ej. Torre A con medidor de agua y electricidad; Torre B solo con agua; Torre C sin medidores).
    *   **Reglas Financieras del PerÃ­odo:**
        *   *Fondo de Reserva ($FR_{pct}$):* $5.0\%$ sobre los gastos comunes del perÃ­odo.
        *   *InterÃ©s Moratorio ($Int_{mora}$):* $1.5\%$ mensual aplicable sobre saldos vencidos.
        *   *DÃ­as de Gracia:* $10$ dÃ­as tras el vencimiento.
    *   **GestiÃ³n de Espacios Comunes:** Registro de Ã¡reas comunes indicando si generan ingresos por arriendo (ej. Sala de eventos, Quinchos y Canchas $\rightarrow$ SÃ­; Gimnasio y Piscina $\rightarrow$ No).

2.  **Registro de Movimientos con Reglas de DistribuciÃ³n:**
    Cada ingreso y egreso del perÃ­odo debe registrarse con: Fecha, DescripciÃ³n, Monto, Documento de Respaldo y un **MÃ©todo de DistribuciÃ³n**:
    *   `prorated` (Prorrateado): Distribuido segÃºn el $\%$ de alÃ­cuota de cada unidad.
    *   `equal` (Igualitario): Dividido en partes iguales entre todas las unidades.
    *   `tower_specific` (Torre EspecÃ­fica): Dividido Ãºnicamente entre las unidades asociadas a una torre en particular.
    *   `unit_specific` (Unidad EspecÃ­fica): Cobro directo y exclusivo a una unidad privativa (ej. multas, copias de llaves).
    *   `exempt` (No participa): Exento de cobro ordinario.

3.  **Algoritmo del CÃ¡lculo del Gasto ComÃºn por Unidad ($Total_{unidad}$):**
    *   **Paso 1 (Base Distribuible):**
        $$Base_{distribuible} = \text{Egresos Totales} - \text{Ingresos Totales}$$
    *   **Paso 2 (DistribuciÃ³n Principal):**
        $$Subtotal_{unidad} = \sum (\text{Movimientos Prorrateados} \times P_{unidad}) + \sum \left( \frac{\text{Movimientos Igualitarios}}{N_{total\_unidades}} \right)$$
    *   **Paso 3 (Fondo de Reserva del PerÃ­odo):**
        $$FondoReserva_{unidad} = Subtotal_{unidad} \times 0.05$$
    *   **Paso 4 (Total Gastos Comunes PerÃ­odo):**
        $$TotalPeriodo_{unidad} = Subtotal_{unidad} + FondoReserva_{unidad}$$
    *   **Paso 5 (AdiciÃ³n de Cargos Posteriores - Exentos de Fondo de Reserva):**
        $$CargosPosteriores_{unidad} = GastoTorre_{unidad} + Multa_{unidad} + DeudaAnterior_{unidad} + InteresMora_{unidad}$$
        Donde:
        $$InteresMora_{unidad} = DeudaAnterior_{unidad} \times 0.015 \quad (\text{si } \text{dÃ­as\_mora} > 10)$$
    *   **Paso 6 (Total ObligaciÃ³n a Pagar):**
        $$Total_{unidad} = TotalPeriodo_{unidad} + CargosPosteriores_{unidad}$$

#### 15.13.2 Motor de Remuneraciones y LiquidaciÃ³n de Sueldos
La generaciÃ³n de liquidaciones de sueldo de colaboradores sigue el estÃ¡ndar de la legislaciÃ³n laboral chilena, parametrizando los conceptos bajo la siguiente jerarquÃ­a contable:

1.  **Haberes Imponibles:**
    *   *Sueldo Base:* Pago pactado contractualmente por la jornada de trabajo ordinaria.
    *   *AsignaciÃ³n de Responsabilidad:* Bono imponible asignado al cargo.
    *   *Horas Extras:* Recargo por jornada extraordinaria.
    *   $$\text{Total Imponibles } (H_{imp}) = \text{Sueldo Base} + \text{Asig. Responsabilidad} + \text{Horas Extras}$$

2.  **Haberes No Imponibles:**
    *   *AsignaciÃ³n de ColaciÃ³n:* AsignaciÃ³n para alimentaciÃ³n diaria.
    *   *AsignaciÃ³n de MovilizaciÃ³n:* AsignaciÃ³n para traslados y locomociÃ³n.
    *   *AsignaciÃ³n de Vestuario:* AsignaciÃ³n para uniforme o ropa de trabajo.
    *   $$\text{Total No Imponibles } (H_{no\_imp}) = \text{ColaciÃ³n} + \text{MovilizaciÃ³n} + \text{Vestuario}$$

3.  **Descuentos Previsionales (Cotizaciones de Salud y PensiÃ³n sobre $H_{imp}$):**
    *   *Salud (Fonasa):* $7.00\%$ de $H_{imp}$.
    *   *PensiÃ³n (AFP):* ComisiÃ³n porcentual dinÃ¡mica segÃºn la entidad del colaborador (ej. Habitat $10.00\%$ base de capitalizaciÃ³n individual; Capital $11.44\%$ total).
    *   *Seguro de CesantÃ­a (AFC Colaborador):* $0.60\%$ de $H_{imp}$ para contratos indefinidos (en plazo fijo es financiado $100\%$ por el empleador).
    *   $$\text{Total Previsionales } (D_{prev}) = \text{Salud} + \text{PensiÃ³n} + \text{CesantÃ­a}$$

4.  **Otros Descuentos Financieros:**
    *   *Anticipos:* Adelantos de sueldo entregados durante el mes.
    *   *PrÃ©stamos:* Cuotas de prÃ©stamos internos otorgados por la administraciÃ³n.
    *   *Multas u Atrasos:* Descuentos por ausencias injustificadas u atrasos.
    *   $$\text{Total Otros Descuentos } (D_{otros}) = \text{Anticipos} + \text{PrÃ©stamos} + \text{Multas\_Atrasos}$$

5.  **CÃ¡lculo de Sueldo LÃ­quido Final:**
    $$S_{liquido} = (H_{imp} + H_{no\_imp}) - (D_{prev} + D_{otros})$$

---

**Fecha de creaciÃ³n:** Mayo 2026
**Ãšltima actualizaciÃ³n:** 8 de Junio de 2026 (IntegraciÃ³n de Reglas Financieras y Remuneracionales Avanzadas - v10.0)
**VersiÃ³n:** 10.0 (zAux 05/06 Integration)
**Estado:** Listo para desarrollo (Modelado contable consolidado, 179 tests estables en verde, especificaciones actualizadas)