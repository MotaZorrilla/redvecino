# Módulo de Egresos - Administrador de Condominios

Este proyecto implementa el módulo de **Gestión de Egresos** (gastos del condominio) de manera profesional, con una experiencia de usuario (UX/UI) moderna, limpia y responsiva en Dark Mode.

## Características Principales

1. **Flujo de Onboarding de Primera Entrada**:
   - Si no existen categorías de gastos configuradas, el sistema entra en modo de onboarding, mostrando un mensaje informativo de pantalla completa y bloqueando el menú de egresos hasta que se defina la primera categoría principal.
2. **Gestión de Categorías y Subcategorías**:
   - Permite crear categorías principales (ej. *Servicios Básicos*) y vincular subcategorías específicas (ej. *Electricidad*, *Agua*, *Gas*).
3. **Registro Guiado de Egresos (Wizard)**:
   - Formulario de pasos (1, 2 y 3) interactivo que guía al administrador:
     - **Paso 1**: Fecha, Categoría, Subcategoría (filtrada dinámicamente) y Monto.
     - **Paso 2**: Referencia de cotizaciones relacionadas y observaciones adicionales.
     - **Paso 3**: Prorrateo/Financiamiento (dividir cobro en meses) y adjuntar archivo digital del comprobante (Factura/Boleta).
4. **Dashboard Financiero e Histórico**:
   - Tarjetas de KPIs con cálculos dinámicos (Gasto del mes, Gasto mes anterior con indicador porcentual de variación, conteo de documentos y cantidad de gastos prorrateados).
   - Gráfico de distribución de egresos por categoría principal (Doughnut chart).
   - Historial de egresos de los últimos 6 meses (Bar chart).
5. **Tabla Interactiva y Filtros**:
   - Buscador textual de egresos por descripción o referencia.
   - Filtros dinámicos por Categoría, Subcategoría y rangos de Fecha.
   - Eliminación física de egresos y archivos adjuntos asociados.

---

## Requisitos Técnicos

- **PHP 8.0** o superior.
- Extensión **PDO_SQLITE** habilitada en su configuración de PHP (generalmente activa por defecto).
- Permisos de escritura en la carpeta del proyecto para que PHP pueda crear el archivo de base de datos `egresos.db` y la carpeta `uploads/` para los comprobantes.

---

## Guía de Instalación y Uso (Zero-Config)

Para ejecutar la aplicación localmente de forma inmediata:

1. Abra una terminal o consola de comandos en la carpeta raíz del proyecto.
2. Inicie el servidor web embebido de PHP ejecutando el siguiente comando:
   ```bash
   php -S localhost:8000
   ```
3. Abra su navegador web y acceda a la dirección:
   ```
   http://localhost:8000
   ```
4. **Inicialización Automática**: Al ingresar por primera vez, el sistema detectará que no existe la base de datos, creará el archivo `egresos.db`, ejecutará las instrucciones del archivo `schema.sql` y le mostrará la bienvenida guiada para crear su primera categoría.

---

## Archivos del Módulo

- [schema.sql](file:///c:/Users/ambia/Downloads/REDVECINO/EGRESOS/schema.sql): Esquema inicial de las tablas de datos.
- [config.php](file:///c:/Users/ambia/Downloads/REDVECINO/EGRESOS/config.php): Conexión PDO a SQLite con validación de tablas y habilitación de llaves foráneas.
- [api.php](file:///c:/Users/ambia/Downloads/REDVECINO/EGRESOS/api.php): Controlador AJAX con las rutas y endpoints del backend.
- [index.php](file:///c:/Users/ambia/Downloads/REDVECINO/EGRESOS/index.php): Vista principal que maneja los estilos CSS y la interactividad JS.
