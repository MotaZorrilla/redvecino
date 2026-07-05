# ðŸ›¡ï¸ Plan de Reforzamiento y ExpansiÃ³n de Pruebas (QA Hardening Plan)

Este plan de trabajo detalla la estrategia para robustecer la suite de pruebas existente del proyecto **RedVecino & MiVecino**, intensificando las validaciones en los mÃ³dulos principales, y especificando las nuevas pruebas necesarias para las caracterÃ­sticas pendientes de la hoja de ruta.

> **Estado actual (Julio 2026):** Se implementaron 6 nuevas suites en Pest v3 cubriendo gran parte de las Ã¡reas identificadas. Ver secciÃ³n 3.20 de HISTORY.md y archivos `*Pest.php` en `tests/Feature/`. La suite total es de **337 tests, 0 failures**.

---

```mermaid
graph TD
    subgraph Suite de QA Hardening
        A[Pruebas de MÃ³dulos Core] --> A1["Hardening de Finanzas (LÃ­mites, Desbordamientos)"]
        A --> A2["Hardening de RBAC & Aislamiento (Seguridad Multi-condominio)"]
        A --> A3["Hardening de Incidencias (Estados, Adjuntos)"]
        
        B[Nuevas Pruebas (Hoja de Ruta)] --> B1["Acceso Preferencial (PIN Auth & Rate Limit)"]
        B --> B2["Bloqueo por Morosidad (RestricciÃ³n de Reservas)"]
        B --> B3["ConserjerÃ­a OCR & Custodia (Encomiendas)"]
        B --> B4["Control de Accesos FÃ­sicos (QR Single-Use)"]
        B --> B5["Gobernanza y QuÃ³rum Ponderado (Asambleas)"]
        B --> B6["Contabilidad por Partida Doble (Fondos)"]
    end
    
    style A fill:#0F2557,stroke:#fff,stroke-width:2px,color:#fff
    style B fill:#72B043,stroke:#fff,stroke-width:2px,color:#fff
    style A1 fill:#1e293b,stroke:#00A896,stroke-width:1px,color:#fff
    style B1 fill:#1e293b,stroke:#00A896,stroke-width:1px,color:#fff
```

---

## ðŸ”’ Parte 1: Reforzamiento de Pruebas Existentes (QA Hardening)

El objetivo es intensificar la cobertura aÃ±adiendo validaciones redundantes, lÃ­mites de datos (edge cases) y caminos de error extremos (*Unhappy Paths*).

### 1.1 Robustecimiento del MÃ³dulo de Finanzas y Remuneraciones
*   **Validaciones de LÃ­mites en Cuentas:**
    *   Verificar comportamiento ante montos extremadamente altos (desbordamiento de enteros/decimales de base de datos en liquidaciones o gastos comunes).
    *   Verificar cÃ¡lculos exactos ante retenciones de impuestos y variaciones centesimales en la tasa de cotizaciÃ³n de AFP (tasas dinÃ¡micas reales).
*   **Redundancia de Consistencia:**
    *   Validar que el saldo neto de caja (`Ingresos - Egresos`) coincida exactamente con la sumatoria de tablas antes y despuÃ©s de cada transacciÃ³n financiera, detectando fugas contables menores.
    *   Validar que la anulaciÃ³n de un pago reverse de forma limpia el estado de deuda del copropietario y que no queden residuos en las tablas de auditorÃ­a.

### 1.2 Robustecimiento de la Seguridad, ImpersonaciÃ³n y Multi-condominio
*   **SimulaciÃ³n de InyecciÃ³n de Headers:**
    *   Verificar que cambiar variables de sesiÃ³n o inyectar ID de condominios diferentes en peticiones HTTP API sea rechazado inmediatamente con HTTP `403`.
*   **Hardening de ImpersonaciÃ³n:**
    *   Probar casos de carrera donde el usuario TI se auto-impersona a sÃ­ mismo o intenta impersonar a otro usuario TI (acciÃ³n prohibida).
    *   Probar que al restaurar la sesiÃ³n (des-impersonar) se limpie por completo la memoria cachÃ© de permisos de Laravel.

### 1.3 Robustecimiento del MÃ³dulo de Incidencias
*   **Transiciones de Estado Restringidas:

### 1.4 Robustecimiento del Onboarding Estructural (Torres y Unidades)
*   **Aislamiento y Bloqueo:**
    *   Verificar que una vez configuradas las torres y unidades por el Administrador (y guardado definitivo), se bloquee la edicion estructural masiva para evitar corrupcion de dependencias.
*   **Copia de Estructuras:**
    *   Verificar que la logica de copiado de estructura de pisos (copy_floor_structure) replique exactamente las propiedades sin alterar datos de otras torres.

### 1.5 Robustecimiento del Calculo de Prorrateo (Gastos Comunes)
*   **Precision Matematica de Distribucion:**
    *   Asegurar que la sumatoria de las fracciones de cobro de todas las unidades sea exactamente igual al Gasto Comun Total del condominio en un periodo dado.
    *   Manejo de redondeo: validar la asignacion correcta de diferencias por redondeo centesimal para no dejar saldos flotantes sin asignar.**
    *   Verificar que un ticket no pueda saltarse estados lÃ³gicos (ej: pasar de `open` a `resolved` sin pasar por `in_progress` o sin un colaborador asignado).
*   **LÃ­mites de Carga de Archivos (Adjuntos):**
    *   Validar la carga de archivos maliciosos (ej: scripts `.php` simulados como imÃ¡genes `.png`) y verificar que el sistema los bloquee con HTTP `422`.
    *   Verificar el comportamiento cuando se supera el lÃ­mite fÃ­sico de tamaÃ±o (ej: imÃ¡genes de mÃ¡s de 10 MB).

---

## ðŸš€ Parte 2: Nuevas Pruebas para Funcionalidades de la Hoja de Ruta

Estas pruebas se crearÃ¡n en paralelo con el desarrollo de las funcionalidades pendientes.

### 2.1 Acceso Preferencial (PIN Auth Test Suite)
*   **Ruta:** `tests/Feature/PinAuthTest.php`
*   **Casos CrÃ­ticos:**
    *   `test_user_can_login_with_rut_and_pin`: Login exitoso con RUT y PIN de 4 dÃ­gitos.
    *   `test_pin_must_be_numeric_and_four_digits`: Rechazo de PINs con texto, de menor o mayor longitud (HTTP `422`).
    *   `test_brute_force_protection_on_pin`: Bloqueo automÃ¡tico de IP/Usuario tras 5 intentos fallidos de PIN (Rate Limiting HTTP `429`).

### 2.2 LÃ³gica de Alertas de Morosidad (Morosidad Test Suite)
*   **Ruta:** `tests/Feature/MorosidadBlockTest.php`
*   **Casos CrÃ­ticos:**
    *   `test_resident_with_three_or_more_unpaid_months_is_flagged`: Validar que el estado del residente cambie a moroso crÃ­tico en base de datos al acumular $\ge 3$ gastos comunes impagos.
    *   `test_moroso_cannot_book_common_areas`: Intentos de reservar Ã¡reas comunes (Piscina, Quincho) devuelven HTTP `403` (Prohibido) con mensaje especÃ­fico.
    *   `test_paying_bills_restores_booking_access`: Pagar la deuda acumulada restaura automÃ¡ticamente el derecho a reserva en tiempo real.

### 2.3 Mantenimiento y AuditorÃ­as de Campo (Evidencia FotogrÃ¡fica)
*   **Ruta:** `tests/Feature/FieldAuditsTest.php`
*   **Casos CrÃ­ticos:**
    *   `test_employee_cannot_resolve_ticket_without_after_photo`: Rechazo (HTTP `422`) si el colaborador intenta cerrar la incidencia sin adjuntar la foto de evidencia de reparaciÃ³n ("DespuÃ©s").
    *   `test_admin_notified_upon_ticket_resolution`: VerificaciÃ³n del disparo de eventos de notificaciÃ³n tras completarse la auditorÃ­a de campo.

### 2.4 Control de Accesos FÃ­sicos (QR Invitations Test Suite)
*   **Ruta:** `tests/Feature/QrInvitationsTest.php`
*   **Casos CrÃ­ticos:**
    *   `test_resident_can_generate_single_use_qr_invitation`: CreaciÃ³n y firma criptogrÃ¡fica del cÃ³digo QR.
    *   `test_qr_first_scan_is_allowed`: El primer escaneo en el sistema del Front Desk retorna Ã©xito.
    *   `test_qr_second_scan_is_rejected_as_expired`: El segundo intento de escaneo del mismo cÃ³digo QR devuelve HTTP `410` (Gone).
    *   `test_expired_qr_is_rejected`: ValidaciÃ³n de vencimiento por tiempo (ej: pase de visita vencido por superar las 24 horas).

### 2.5 Front Desk - ConserjerÃ­a OCR & Custodia (Encomiendas)
*   **Ruta:** `tests/Feature/ConserjerÃ­aOcrTest.php`
*   **Casos CrÃ­ticos:**
    *   `test_conserje_can_register_package_custody`: Registro del paquete.
    *   `test_resident_notified_on_package_arrival`: EnvÃ­o automÃ¡tico de notificaciÃ³n push/email al residente asociado.
    *   `test_package_delivery_requires_digital_signature`: Impedir marcar el paquete como entregado si no se envÃ­a la firma digital del residente.

### 2.6 Gobernanza y Validez de Votaciones (QuÃ³rum Doble Ponderado)
*   **Ruta:** `tests/Feature/AssemblyGovernanceTest.php`
*   **Casos CrÃ­ticos:**
    *   `test_quorum_calculation_by_headcount_and_coefficient`: Validar que la matemÃ¡tica interna calcule correctamente si se cumple el quÃ³rum mÃ­nimo de asistencia (ej: 50% de los residentes + 60% del coeficiente de copropiedad total).
    *   `test_voting_closes_automatically_on_deadline`: Cierre automÃ¡tico y sellado de tiempo criptogrÃ¡fico de la votaciÃ³n para evitar alteraciones.

### 2.7 Contabilidad por Partida Doble
*   **Ruta:** `tests/Feature/DoubleEntryAccountingTest.php`
*   **Casos CrÃ­ticos:**
    *   `test_reserve_fund_is_isolated_from_operational_fund`: Bloqueo de transferencias directas de dinero desde el fondo de reserva sin un voto de aprobaciÃ³n registrado del ComitÃ©.

---

> [!IMPORTANT]
> **AlineaciÃ³n de QA:**
> Este plan asegura que cada nueva lÃ­nea de cÃ³digo transaccional sea respaldada por una red de seguridad robusta, previniendo regresiones durante actualizaciones de paquetes en producciÃ³n en el VPS.
