# 🏢 RedVecino & MiVecino - Plataforma Integral de Gestión de Condominios

Plataforma SaaS full-stack para la administración inteligente, financiera, operativa y comunitaria de condominios y edificios.

---

## 📌 Estado Actual del Proyecto (`v0.0.15-dev` · Build 2026.08)
- **Arquitectura Backend:** Laravel 11 con autenticación multi-rol (RBAC de 6 roles: Superadmin, Administrador, Comité, Conserje, Copropietario, Residente/Inquilino).
- **Arquitectura Frontend:** React 18 + Inertia.js + Tailwind CSS, con diseño diferenciado entre portal web administrativo (**RedVecino**) y vista móvil optimizada (**MiVecino**).
- **Malla de Seguridad y Calidad (QA 100% Verde):**
  - **Backend (Pest v3 / PHPUnit):** **>520 tests pasando al 100%** (`php artisan test`).
  - **Frontend (Vitest / Testing Library):** **186 tests pasando al 100%** en 25 suites (`npm run test:frontend`).
  - Aislamiento multi-condominio verificado, validaciones financieras estrictas, cálculo de quórum legal (Ley 21.442) y control de votaciones por unidad.

---

## 🔄 Resumen de Módulos Implementados (Fases 1 a 5)

1. **Recursos Humanos & Colaboradores (Fase 1):**
   - Amonestaciones laborales formales con respaldo en PDF/imagen.
   - Reloj control con marcación de turnos (check-in / check-out con IP).
   - Solicitud de insumos móviles y carrito de compras para aprobación masiva con imputación automática al libro de egresos.
   - Condonación de mora justificada y multas con hasta 3 evidencias fotográficas.
   - Cuenta demo comercial (`demo@redvecino.cl`) para presentaciones en vivo.

2. **Unidades, Residentes y Mascotas (Fase 2):**
   - Estacionamientos y bodegas múltiples con asignación dinámica de patentes vehiculares.
   - Límite legal y de seguridad de máximo 3 residentes autorizados por unidad.
   - Registro Sanitario de Mascotas (Ley Cholito) con N° de Microchip oficial de 15 dígitos y ficha médica adjunta.
   - *Supermodal 360°* de propiedades con navegación por tabs bajo demanda.

3. **Amenidades, Checklists y Garantías (Fase 3):**
   - Inspección digital de entrega y devolución de quinchos/salas multiuso con switches de estado (OK/Dañado) y fotos.
   - Retención, cobro de reparaciones y liberación de depósitos de garantía vinculado a reservas (`Booking`).

4. **Conserjería y Mensajería Interna Segura (Fase 4):**
   - Módulo desacoplado de Encomiendas y Paquetería (`PackageCustody`) con fotografía del paquete y firma digital de recepción.
   - Mensajería interna estructurada: Canal Conserjería $\leftrightarrow$ Unidad (privacidad total sin exponer teléfonos personales), Canal Oficial de Administración y Canal Privado del Comité.

5. **Asambleas y Votaciones por Unidad (Fase 5 - Ley 21.442):**
   - Motor de votación con **1 voto por departamento ponderado por coeficiente de alícuota legal**.
   - Conteo en tiempo real, cálculo de quórum y libro digital de actas de asamblea.

6. **Sistema de Versionado:**
   - Changelog SemVer registrado en [`HISTORY.md`](./HISTORY.md).
   - Badge de versión visible y discreto en el sidebar administrativo (`v0.0.15-dev`).

---

## 🎯 Decisiones Clave Recientes
1. **Privacidad Telefónica:** La comunicación interna entre conserjería y residentes se asocia a la Unidad (ej. *"Depto 501"*) sin revelar números de WhatsApp o celulares particulares.
2. **Votaciones por Unidad:** Conforme al Art. 15 de la Ley 21.442, el voto lo emite la propiedad, impidiendo duplicidad de votos entre múltiples residentes de la misma unidad y ponderando por el porcentaje de alícuota.
3. **Limpieza de Código Legacy:** Se unificaron las rutas de paquetería y mensajería eliminando controladores provisionales antiguos.

---

## 🚀 Próximo Paso Inmediato
- **Fase 6 (Pulido UX, Perfil Admin y Auditorías de Calidad):**
  1. Implementar la subida y visualización del Avatar del Administrador en el modal de perfil.
  2. Ejecutar la auditoría de 6 niveles (Frontend/UX, Calidad de Código, SEO/Accesibilidad, Laravel Best Practices, Seguridad y Rendimiento).
