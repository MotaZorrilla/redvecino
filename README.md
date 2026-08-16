# 🏢 RedVecino & MiVecino - Plataforma Integral de Gestión de Condominios

Plataforma SaaS full-stack para la administración inteligente, financiera, operativa y comunitaria de condominios y edificios.

---

## 📌 Estado Actual del Proyecto (`v0.1.0-RC1` · Build 2026.08)
- **Certificación de Versión:** Release Candidate `v0.1.0-RC1` con el 100% del Plan Maestro completado (Fases 1 a 6).
- **Arquitectura Backend:** Laravel 11 con autenticación multi-rol (RBAC de 6 roles: Superadmin, Administrador, Comité, Conserje, Copropietario, Residente/Inquilino).
- **Arquitectura Frontend:** React 18 + Inertia.js + Tailwind CSS, bajo la estrategia de Dos Llaves (**RedVecino** para administración web y **MiVecino** para residentes móviles).
- **Filosofía "Skinny Code" (Resources & Database):**
  - **Skinny Controllers (<100L):** Controladores delgados que delegan validaciones en FormRequests dedicados y lógica en Servicios.
  - **Skinny Resources (<120L):** Componentes atómicos desacoplados (`CondoGeneralTab`, `CondoUnitTypesTab`, `CondoCommonAreasTab`, `CondoStaffRolesTab`, `CondoLateFeeTab`, `AdminProfileModal`, `CondoSelectorModal`).
  - **Skinny Database:** Migraciones atómicas y seeders deterministas modulares registrados en `DatabaseSeeder`.
- **Malla de Seguridad y Calidad (QA 100% Verde):**
  - **Backend (Pest v3 / PHPUnit):** **>525 tests pasando al 100%** (`php artisan test`).
  - **Frontend (Vitest / Testing Library):** **186 tests pasando al 100%** en 25 suites (`npm run test:frontend`).
  - **Build de Producción:** Compilación exitosa con Vite (`npm run build`).

---

## 🔄 Resumen de Módulos Implementados (Fases 1 a 6)

1. **Recursos Humanos & Colaboradores (Fase 1):**
   - Amonestaciones laborales formales con respaldo en PDF/imagen.
   - Reloj control con marcación de turnos (check-in / check-out con IP).
   - Solicitud de insumos móviles y carrito de compras para aprobación masiva con imputación automática al libro de egresos.
   - Condonación de mora justificada y multas con hasta 3 evidencias fotográficas.
   - Cuenta demo comercial (`demo@redvecino.cl`) para presentaciones en vivo.

2. **Unidades, Residentes y Mascotas (Fase 2):**
   - Estacionamientos y bodegas múltiples con asignación dinámica de patentes vehiculares.
   - Límite legal y de seguridad de máximo 3 residentes autorizados por unidad.
   - Registro Sanitario de Mascotas (Ley Cholito) con N° de Microchip oficial de 15 dígitos y carnet de vacunas adjunto.
   - *Supermodal 360°* de propiedades con navegación por tabs bajo demanda.

3. **Amenidades, Checklists y Garantías (Fase 3):**
   - Inspección digital de entrega y devolución de quinchos/salas multiuso con switches de estado (OK/Dañado) y fotos.
   - Retención, cobro de reparaciones y liberación de depósitos de garantía vinculado a reservas (`Booking`).

4. **Conserjería y Mensajería Interna Segura (Fase 4):**
   - Módulo desacoplado de Encomiendas y Paquetería (`PackageCustody`) con fotografía del paquete y firma digital de recepción.
   - Mensajería interna estructurada: Canal Conserjería $\leftrightarrow$ Unidad (privacidad total sin exponer teléfonos personales), Canal Oficial de Administración y Canal Privado del Comité.

5. **Asambleas y Votaciones por Unidad (Fase 5 - Ley 21.442):**
   - Motor de votación con **1 voto por departamento ponderado por coeficiente de alícuota legal**.
   - Conteo en tiempo real, cálculo de quórum legal y libro digital de actas de asamblea con generación PDF.

6. **Pulido UX, Perfil Admin, Arquitectura Skinny y Auditorías (Fase 6):**
   - Perfil de Administrador con carga y almacenamiento de Avatar (`avatar_path`) y edición de datos de contacto.
   - Auditoría de Calidad en 6 niveles aprobada: Frontend/UX, Calidad de Código, SEO/Accesibilidad, Buenas Prácticas Laravel, Seguridad y Rendimiento.
   - Estandarización de arquitectura modular "Skinny" en todas las capas del sistema.

---

## 🎯 Decisiones Clave Recientes
1. **Adopción de "Skinny Resources & Skinny Database":** Se modularizaron los componentes extensos (`CondoProfilePanel.jsx` de 820 líneas y `RedVecinoLayout.jsx` de 600 líneas) en subcomponentes atómicos de menos de 100-120 líneas.
2. **Cero Controladores Monolíticos:** Todos los endpoints operan con FormRequests dedicados (`ExpenseRequest`, `FineRequest`, `PaymentRequest`, `FacilityRequest`, `MessageRequest`, `AssemblyVotingRequest`, `EmployeeSanctionRequest`, `SupplyOrderRequest`).
3. **Privacidad Telefónica & Votaciones por Unidad:** Estricta confidencialidad de datos personales en el módulo de mensajería y cumplimiento cabal del Art. 15 de la Ley 21.442 en votaciones de asamblea.

---

## 🚀 Próximo Paso Inmediato
- **Despliegue a Staging / Producción:**
  1. Configuración de variables de entorno productivas (`.env.production`).
  2. Ejecución de migraciones y seeders de arranque en el servidor final.
  3. Pruebas de aceptación de usuario (UAT) y presentaciones comerciales con la cuenta demo.
