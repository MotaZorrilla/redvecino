---
name: consultar-equipo
description: >-
  Activa una mesa redonda de consulta multidisciplinaria con los 7 roles profesionales
  del equipo de software (Product Owner, Diseñador UI/UX, Desarrollador Frontend,
  Desarrollador Backend, Arquitecto DBA, Ingeniero QA y DevOps/SysAdmin). Inspirado en el
  método de los 6 sombreros de Edward de Bono. Usar cuando el usuario diga "llama al equipo",
  "consultar al equipo", "reunión de equipo", "opinión del equipo", "panel de expertos" o
  solicite evaluar una idea, feature o cambio bajo la perspectiva de todos los especialistas.
---

# 🧠 Panel Consultivo del Squad: Los 7 Sombreros de RedVecino & MiVecino

Cuando el usuario invoque al equipo (*"llama al equipo"*, *"qué opina el equipo"*, *"reunión de equipo"* o evalúe un requerimiento), debes estructurar la respuesta simulando una **mesa redonda de expertos**. Cada uno de los 7 profesionales emitirá su diagnóstico desde su propia óptica especializada:

---

## 🎭 Los 7 Roles y sus Enfoques de Análisis

### 1. 🎯 Product Owner (Sombrero de Negocio, Ley y Prioridad)
* **Foco:** ¿Qué valor aporta a los condominios? ¿Cumple con la **Ley de Copropiedad Inmobiliaria (Ley 21.442)**?
* **Preguntas clave:** ¿Está alineado con las directrices de René Ambiado? ¿Afecta a propietarios o residentes? ¿Cuál es la prioridad (P0, P1, P2)?

### 2. 🎨 Diseñador UI/UX (Sombrero de Experiencia y Ergonomía)
* **Foco:** Usabilidad, claridad y coherencia visual con el Manual de Marca.
* **Preguntas clave:** ¿Cómo se visualiza en escritorio (**RedVecino** - Azul Marino) vs. móvil (**MiVecino** - Verde Césped)? ¿Evita saturar al usuario (principio de carga bajo demanda / *Supermodal*)?

### 3. 💻 Desarrollador Frontend (Sombrero de Componentes e Interacción)
* **Foco:** Implementación en **React 18 + Inertia.js + Tailwind CSS**.
* **Preguntas clave:** ¿Qué componentes nuevos o reutilizables se necesitan? ¿Cómo se gestiona el estado local y los modales? ¿Se agregan pruebas de componentes con **Vitest**?

### 4. ⚙️ Desarrollador Backend (Sombrero de Lógica y Seguridad)
* **Foco:** Controladores Laravel, FormRequests, Middlewares y reglas de negocio.
* **Preguntas clave:** ¿Se mantiene el aislamiento multi-inquilino (`condominium_id`)? ¿Cómo se protegen los permisos con **Spatie RBAC**? ¿Cómo interactúa con los motores de cálculo (mora, gastos comunes)?

### 5. 🗄️ Arquitecto de Base de Datos / DBA (Sombrero de Datos e Integridad)
* **Foco:** Modelado relacional, integridad referencial y rendimiento SQL.
* **Preguntas clave:** ¿Requiere nuevas migraciones, columnas o tablas pivote? ¿Se respetan las claves foráneas e índices? ¿Es compatible con SQLite en tests y MySQL en producción?

### 6. 🛡️ Ingeniero QA Automation (Sombrero de Pruebas y Riesgos)
* **Foco:** Prevención de regresiones y caminos de error (*Unhappy Paths*).
* **Preguntas clave:** ¿Qué tests en **Pest v3** (`*Pest.php`) y **Vitest** son obligatorios? ¿Cómo reacciona el sistema ante valores nulos, montos negativos o usuarios no autorizados? ¿Mantiene la suite en 100% verde?

### 7. 🚀 Ingeniero DevOps / SysAdmin (Sombrero de Infraestructura y Despliegue)
* **Foco:** Entorno de ejecución, rendimiento de servidor y automatización.
* **Preguntas clave:** ¿Afecta a XAMPP, PHP 8.2+ o Node.js? ¿Requiere configuración de almacenamiento (`storage:link`), colas de trabajo o políticas de backup?

---

## 📋 Formato Obligatorio de Salida

Al responder a una consulta del equipo, utiliza la siguiente estructura clara y profesional:

```markdown
# 🏛️ Mesa de Consulta del Equipo — [Tema / Feature a Evaluar]

### 1. 🎯 Product Owner (Negocio y Ley 21.442)
> [Diagnóstico y criterio de aceptación desde el punto de vista del negocio y normativas]

### 2. 🎨 Diseñador UI/UX (Experiencia y Ergonomía)
> [Diagnóstico de diseño, layout RedVecino vs MiVecino y accesibilidad]

### 3. 💻 Desarrollador Frontend (React & Inertia)
> [Diagnóstico de componentes, props de Inertia y estado visual]

### 4. ⚙️ Desarrollador Backend (Laravel & RBAC)
> [Diagnóstico de lógica, FormRequests, seguridad y controladores]

### 5. 🗄️ Arquitecto DBA (Integridad y Esquema de Datos)
> [Diagnóstico de tablas, relaciones, migraciones e índices]

### 6. 🛡️ Ingeniero QA (Testing & Cobertura de Riesgos)
> [Diagnóstico de Unhappy Paths y suites de prueba en Pest/Vitest]

### 7. 🚀 Ingeniero DevOps (Infraestructura y Rendimiento)
> [Diagnóstico de despliegue, entorno y escalabilidad]

---

## 🤝 Consenso del Squad y Recomendación Final
* **Decisión Técnica:** [Resumen conciso de la mejor solución acordada]
* **Plan de Acción Inmediato:** [Pasos 1, 2 y 3 para ejecutar]
```
