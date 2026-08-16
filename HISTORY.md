# 📜 Historial de Versiones y Changelog — RedVecino & MiVecino

Todas las modificaciones notables y evoluciones de este proyecto se documentan formalmente en este archivo siguiendo la especificación [SemVer (Semantic Versioning)](https://semver.org/) y el formato de [Keep a Changelog](https://keepachangelog.com/es-ES/1.0.0/).

---

## [0.1.0-RC1] — 2026-08-16

### 🚀 Novedades y Certificación de Release (Fases 4, 5 y 6 del Plan Maestro)

#### 🏛️ Asambleas y Votaciones por Unidad (Ley 21.442)
- **Motor de Votación por Unidad:** Implementación estricta de **1 unidad = 1 voto ponderado por alícuota** (Art. 15 Ley 21.442) con índice de unicidad relacional `[assembly_voting_id, property_id]`.
- **Cálculo de Quórum Legal en Tiempo Real:** Determinación de mayorías absolutas y relativas con barras de porcentaje ponderadas y bloqueo automático al cierre.
- **Libro Digital de Actas:** Historial de deliberaciones con generación y descarga de actas formales en PDF.

#### 💬 Mensajería Interna Segura (Alternativa a WhatsApp)
- **Canales Internos Protegidos:** Comunicación directa Conserjería $\leftrightarrow$ Unidad protegiendo la privacidad de los teléfonos celulares, Canal Oficial de Administración y Canal Privado del Comité.
- **Evidencias y Adjuntos:** Soporte para fotografías y documentos adjuntos en conversaciones.

#### 👤 Perfil de Administrador con Avatar & Limpieza de Legacy
- **Carga de Avatar y Perfil:** Subida y persistencia de fotografías de perfil con storage público seguro, previsualización reactiva y edición de datos de contacto.
- **Retiro Quirúrgico de Legacy:** Eliminación de `RoadmapFeaturesController.php` y `Api/PackageCustodyController.php`.
- **FormRequests Dedicados (100% Skinny Controllers):** `ExpenseRequest`, `FineRequest`, `PaymentRequest`, `FacilityRequest`, `MessageRequest`, `AssemblyVotingRequest`, `EmployeeSanctionRequest`, `SupplyOrderRequest`.

#### 🏗️ Arquitectura "Skinny Resources & Skinny Database"
- **Modularización de Componentes:** Descomposición de componentes monolíticos (`CondoProfilePanel.jsx` y `RedVecinoLayout.jsx`) en subcomponentes atómicos (`CondoGeneralTab`, `CondoUnitTypesTab`, `CondoCommonAreasTab`, `CondoStaffRolesTab`, `CondoLateFeeTab`, `AdminProfileModal`, `CondoSelectorModal`).

#### 🧪 Aseguramiento de Calidad
- **Suite Automatizada 100% en Verde:** Más de **710 tests combinados** (>525 tests Pest v3 en backend y 186 tests Vitest en frontend) pasando sin fallas.

---

## [0.0.15-dev] — 2026-08-16

### 🚀 Novedades y Funcionalidades (Fases 1, 2 y 3 del Plan Maestro)

#### 👥 Recursos Humanos, Colaboradores & Asistencia
- **Amonestaciones Laborales Formale (`EmployeeSanctions`):** Registro de sanciones a colaboradores con motivo, descripción, hora y respaldo en PDF/imagen (firmado) conforme a exigencias de la Inspección del Trabajo.
- **Reloj Control y Asistencia Móvil (`EmployeeAttendance`):** Marcación de entrada y salida con captura de IP, hora y estado de turno.
- **Solicitud de Insumos & Carrito de Aprobación en Lote (`SupplyOrders`):** Flujo de solicitud desde la vista móvil con alerta destacada en el panel de administración, aprobación masiva y deducción automática como gasto contable en `condo_expenses`.

#### 🏢 Unidades, Residentes y Tenencia Responsable (Ley 21.442)
- **Estacionamientos y Bodegas Múltiples:** Soporte dinámico de 1 o más puestos de estacionamiento, patentes asociadas y bodegas anexas por departamento.
- **Límite Estricto de 3 Residentes Autorizados:** Validación de un máximo de 3 integrantes por unidad para evitar saturación y mantener la seguridad en conserjería.
- **Registro Sanitario de Mascotas (Ley Cholito):** Módulo de registro para perros, gatos y otras mascotas con N° de Microchip oficial de 15 dígitos y carnet de vacunas adjunto.
- **Supermodal 360° de Propiedades:** Navegación por botones bajo demanda (Copropietario, Residentes, Física & Alícuota, Gastos Comunes, Multas, Tickets y Mascotas).

#### 🏊 Áreas Comunes, Checklists y Garantías
- **Protocolo de Inspección Check-In y Check-Out (`FacilityChecklist`):** Evaluación de inventario de quinchos y salas multiuso (mobiliario, parrillas, iluminación, aseo).
- **Gestión y Retención de Garantías:** Liberación o cobro automático de costos de reparación imputados al residente en caso de daños con respaldo fotográfico.

#### 📦 Conserjería & Encomiendas
- **Módulo Desacoplado de Paquetería (`PackageCustody`):** Registro de paquetes por transportista (Chilexpress, Starken, Blue Express, MercadoLibre) con captura fotográfica y confirmación de entrega con firma digital.

#### 💼 Herramientas Comerciales
- **Cuenta Demo Comercial (`demo@redvecino.cl`):** Usuario preconfigurado para presentaciones de venta y demostraciones en vivo de René Ambiado con 2 condominios realistas cargados.

#### 🎨 Identidad & UI
- **Identificador de Versión en Sidebar:** Badge discreto en el pie del sidebar con indicador de estado operativo en tiempo real (`v0.0.15-dev · Build 2026.08`).

---

## [0.0.10-alpha] — 2026-08-05
- **Motor Financiero:** Emisión y cálculo de gastos comunes por coeficiente de alícuota.
- **Matriz RBAC de 6 Roles:** Administrador, Propietario, Residente, Comité, Colaborador y TI con Spatie Permission.
- **Libro Diario Contable:** Ingresos y egresos con conciliación bancaria.
- **Gestión de Incidencias:** Ciclo de vida de tickets de soporte e incidencias edilicias.
