# 📋 Documento de Requisitos del Producto (PRD) - RedVecino & MiVecino

Este documento especifica los requisitos de producto, diseño y técnicos para la suite tecnológica **RedVecino & MiVecino** (Condominio-PRO).

---

## 📖 1. Introducción y Propósito del Producto

El ecosistema **RedVecino / MiVecino** es una suite de gestión y vida comunitaria para condominios y edificios en régimen de copropiedad. Se divide en dos interfaces diferenciadas según las necesidades de los usuarios:

1. **RedVecino (Web Corporativa & Panel de Administración):** Orientada a administradores, comités de copropiedad y personal de soporte TI. Su enfoque es la analítica, la gestión masiva de datos y el control de flujos de trabajo administrativos.
2. **MiVecino (Web-App Móvil Responsive):** Orientada a los copropietarios e inquilinos (residentes). Su enfoque es la simplicidad, la rapidez de acceso a información clave (gastos comunes, comunicados) y la facilidad de interacción (tickets de soporte, mensajería).

### Slogan oficial
> *"Más que vecinos, somos comunidad."*

---

## 🎨 2. Sistema de Identidad Visual y Diseño (Design System)

El producto final debe respetar fielmente las directrices estéticas definidas en el manual de marca para garantizar una experiencia premium y profesional:

*   **Tipografía Oficial:** `Montserrat` (desde Google Fonts).
*   **Paleta de Colores Oficial:**
    *   🔵 **Azul Marino Profundo** (`#0F2557`): Base para la interfaz de RedVecino (Web/Admin).
    *   🟢 **Teal / Turquesa** (`#00A896`): Enlaces, botones tecnológicos y elementos activos.
    *   🍏 **Verde Césped** (`#72B043`): Base para la interfaz de MiVecino (App/Móvil), representando cercanía.
    *   🍊 **Naranja Vibrante** (`#EC7A08`): Estado de alertas, urgencias, notificaciones y llamadas a la acción importantes (CTA).
    *   🟣 **Morado/Violeta** (`#7A5299`): Módulos comunitarios y sociales.
    *   ⚪ **Gris Claro** (`#E2E8F0` / `#F8FAFC`): Fondos de tarjetas, separadores y bordes limpios.

### 2.2 Arquitectura de Layouts UI (Estrategia de Dos Llaves)

El sistema de interfaces se articula en torno a **dos layouts unificados** que concentran toda la lógica de navegación, chromática y responsividad:

*   🔑 **`RedVecinoLayout`** — Para los roles de gestión administrativa: TI, Administrador, Comité, Colaborador. Diseñado para pantalla completa de escritorio con Sidebar izquierdo persistente, Navbar superior con selector de condominio y acento cromático dinámico por rol.
*   🔑 **`MiVecinoLayout`** — Para los roles residenciales: Propietario y Residente. Diseñado Mobile-First con BottomNav fijo en móvil y Sidebar izquierdo en PC. Soporta detección dinámica del rol (Propietario vs Residente) para adaptar las pestañas. Incluye bloqueo de reservas por morosidad integrado a nivel de layout.

---

## 👥 3. Perfiles de Usuario y Roles (RBAC)

El sistema implementa un control de acceso basado en roles (RBAC) gestionado a través de **Spatie Laravel Permission**. Se definen 6 roles prioritarios:

1.  **TI (Soporte Técnico):** Gestión global de condominios, configuración del sistema, visualización de logs de auditoría y personalización de roles.
2.  **Administrador:** Control total de un condominio asignado. CRUD de usuarios locales, carga y generación de gastos comunes, cobro de multas, asignación de tickets de mantenimiento y publicación de comunicados.
3.  **Comité (Comité de Copropiedad):** Acceso de supervisión. Puede visualizar reportes financieros, auditar el flujo de caja (ingresos/egresos), aprobar gastos mayores y redactar comunicados oficiales.
4.  **Colaborador (Conserjes, Personal de Mantenimiento):** Acceso simplificado enfocado a la resolución de problemas. Puede ver los tickets de mantenimiento asignados a él y cambiar sus estados de progreso.
5.  **Propietario:** Dueño de una o más propiedades dentro del condominio. Puede ver el estado de cuenta de sus unidades, registrar comprobantes de pago de gastos comunes, crear tickets de mantenimiento e interactuar en los módulos comunitarios.
6.  **Residente (Arrendatario, Familiares):** Ocupante real de la unidad. Mismas opciones del propietario en cuanto a mantenimiento y comunicaciones, pero limitado en las operaciones financieras directas del propietario.

---

## ⚙️ 4. Módulos y Requisitos Funcionales (Alcance MVP)

### 4.1 Módulo de Gestión de Usuarios y Propiedades (P0 - Crítico)
*   **Gestión Multi-Condominio (Multi-Tenant):** Toda la información transaccional debe estar aislada por condominio utilizando una clave foránea `condominium_id`.
*   **Perfiles por Rol:** Una base común (`users`) enlazada a perfiles específicos (`owner_profiles`, `resident_profiles`, `employee_profiles`, etc.) que almacenan datos específicos del rol.
*   **Asignación de Unidades:** Vinculación de usuarios con departamentos, casas, estacionamientos y bodegas.

### 4.2 Módulo de Finanzas y Pagos (P0 - Crítico)
*   **Catálogo Contable Estandarizado:** Categorización precisa del flujo de caja:
    *   **Ingresos:** Gastos comunes, multas parametrizadas (ruidos molestos, mascotas, mal uso de áreas comunes), arriendo de espacios (quinchos, salón de eventos), intereses por mora, cuotas extraordinarias.
    *   **Egresos:** Sueldos y honorarios, servicios básicos (agua, luz), mantenimiento de áreas comunes (ascensores, portones), seguridad, reparaciones de infraestructura, seguros y gastos administrativos.
*   **Emisión de Gastos Comunes:** Cálculo y distribución del cobro mensual de gastos comunes basado en la alícuota de copropiedad de cada unidad.
*   **Conciliación de Pagos:** Registro de comprobantes de transferencia bancaria por parte de los residentes, y panel de verificación/aprobación por parte del administrador.

### 4.3 Módulo de Tickets de Mantenimiento (P1 - Alto)
*   **Creación de Reportes de Incidencias:** Formulario para que residentes reporten problemas comunes (filtraciones, luminarias apagadas, fallas en ascensores) adjuntando archivos de imagen.
*   **Asignación y Ciclo de Vida:** Flujo de estados para el ticket (`open` → `in_progress` → `resolved` → `closed`). Los administradores asignan el ticket a un Colaborador, quien registra notas de resolución al finalizar el trabajo.

### 4.4 Módulo de Comunicaciones y Comunidad (P1 - Alto)
*   **Tablón de Comunicados:** Sección para publicar circulares y avisos oficiales del condominio con diferentes niveles de prioridad (`normal`, `importante`, `urgente`).
*   **Mensajería Interna:** Canal directo de comunicación segura entre los residentes y la administración.

---

## 🛠️ 5. Requisitos No Funcionales y Arquitectura Técnica

### 5.1 Stack Tecnológico Seleccionado
*   **Backend:** Laravel 12.x / PHP 8.2+.
*   **Frontend:** Inertia.js v2 / React 18 / Tailwind CSS v4 / shadcn/ui / TypeScript.
*   **Base de datos:** SQLite en desarrollo para agilidad, MySQL 8+ en entornos de producción.
*   **Autenticación:** Laravel Breeze con stack React/Inertia.
*   **Entorno de Construcción:** Vite 7 + Vitest v4 para testing frontend.

### 5.2 Filosofía de Calidad y Pruebas (Agente QA)
*   **Prioridad de Integración:** Se exige el desarrollo de Feature/Integration Tests (usando Pest PHP) para validar las reglas de negocio (ej. importes de cobros numéricos mayores a cero, consistencia en subcategorías contables y aislamiento multi-tenant).
*   **No Mocks Innecesarios:** Probar contra bases de datos en memoria hidratadas con datos realistas mediante seeders deterministas.
*   **Suite total:** **376 tests backend** (Pest v3 + PHPUnit) + **29 tests frontend** (Vitest + React Testing Library) = **405 tests, 0 failures.**
*   **arch() tests:** 9 tests estructurales (naming, herencia, Services final, prohibición de debug calls).
*   **Cobertura de controladores API:** 24/24 controladores cubiertos con tests de integración.

---

## 🚫 6. Fuera del Alcance (Out of Scope para el MVP)

Para asegurar la entrega oportuna del MVP, quedan excluidas las siguientes funciones:
*   Integración directa de pasarelas de pago automatizadas (ej. Webpay, Stripe). El pago se valida manualmente subiendo el comprobante de transferencia.
*   Aplicaciones móviles nativas publicadas en App Store o Google Play. El acceso móvil se realiza a través de la Web-App responsive de **MiVecino**.
*   Lectura automatizada de comprobantes bancarios mediante Inteligencia Artificial (OCR). La revisión del comprobante la hace físicamente el administrador.

---

## 🚀 7. Roadmap de Integración v2 (Condominio-PRO v2.0)

Con base en la auditoría comparativa de la propuesta v2 (`zAux/Redvecino idea v2`), se establece el plan maestro para portar los 9 módulos operacionales y contables hacia la arquitectura v1 (Laravel 12 + Inertia v2 + React 18):

### 7.1 Módulos a Portar e Integrar
1. **Módulo 1 — Constructor Visual de Torres y Jerarquía de Propiedades (Prioridad P0 - Crítico):** [✅ COMPLETADO al 100%]
   * Matriz visual interactiva para la creación y edición de condominios, torres (A/B/C o 1/2/3), pisos y unidades.
   * Catálogo de tipos de unidades (`tipos_unidades`) y cálculo de alícuota de prorrateo (%) proporcional a los $m^2$.
2. **Módulo 2 — Motor Contable de Gastos Comunes y Emisión de Boletas por Período (Prioridad P0 - Crítico):** [✅ COMPLETADO al 100%]
   * Emisión masiva mensual de boletas de gastos comunes (`periodos_gasto_comun` y `boletas_gasto_comun`).
   * Aplicación automática del Fondo de Reserva (5%) y cobro de consumo individual.
3. **Módulo 3 — Configuración Paramétrica de Mora (Prioridad P1 - Alto):** [✅ COMPLETADO al 100%]
   * Formulario administrativo para ajustar el día límite de vencimiento e interés de mora mensual en el Perfil del Condominio (Sección 6).
4. **Módulo 4 — Fichas Detalladas de Residentes por Unidad (Prioridad P1 - Alto):** [✅ COMPLETADO al 100%]
   * Desglose de integrantes por departamento (`ficha_residentes` + `integrantes_ficha`), incluyendo asignación de estacionamientos, patentes de vehículos y tipo de acceso.
5. **Módulo 5 — Gestión Administrativa de RRHH y Personal (Prioridad P1 - Alto):** [✅ COMPLETADO al 100%]
   * Panel de administración de colaboradores: creación de contratos (3 meses → indefinido), liquidaciones de remuneración (AFP, Fonasa 7%, AFC 0.6%) y registro de amonestaciones.
6. **Módulo 6 — Pedido de Insumos y Materiales (Prioridad P2 - Medio):** [✅ COMPLETADO al 100%]
   * Flujo de solicitud desde el colaborador hacia el administrador con estados (pendiente, en_compra, comprado) y registro por N° de Factura/Boleta.
7. **Módulo 7 — Checklist de Entrega y Recepción de Áreas Comunes (Prioridad P2 - Medio):**
   * Control de check-in / check-out para reservas de amenidades (estado OK/dañado y soporte de fotografías).
8. **Módulo 8 — Landing / Selector Visual de Portales (Prioridad P3 - Bajo):**
   * Pantalla inicial interactiva para previsualización directa por rol.
9. **Módulo 9 — Onboarding Guiado de Primera Entrada (Prioridad P3 - Bajo):**
   * Asistente de configuración inicial del condominio y categorías contables.

### 7.2 Garantía de Calidad y Pruebas Obligatorias por Módulo (Pest v3)
De acuerdo con las reglas de desarrollo del repositorio (`AGENTS.md`):
* **Cero código sin pruebas:** Cada nuevo endpoint, controlador o regla de negocio implementada debe contar con su correspondiente suite de pruebas de integración escrita en sintaxis **Pest v3** (`describe()`, `it()`, `dataset()`) con el sufijo `*Pest.php`.
* **Criterios de Aceptación:** Se deben evaluar Happy Paths, Unhappy Paths (entradas nulas, montos negativos, accesos no autorizados RBAC) y validaciones de bordes (ej. alícuotas que deben sumar exactamente 100.0000%).

