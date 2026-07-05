<?php
// config.php - Configuración de la base de datos (SQLite Zero-Config por defecto)

define('UPLOAD_DIR', __DIR__ . '/uploads/');

// Asegurar que el directorio de descargas/comprobantes existe
if (!file_exists(UPLOAD_DIR)) {
    mkdir(UPLOAD_DIR, 0777, true);
}

try {
    // 1. Conectar a la base de datos GLOBAL
    $pdo_global = new PDO("sqlite:" . __DIR__ . "/global.db");
    $pdo_global->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $pdo_global->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
    $pdo_global->exec("PRAGMA foreign_keys = ON;");
    
    // Asegurar existencia de la tabla global de condominios
    $pdo_global->exec("CREATE TABLE IF NOT EXISTS condominio (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre VARCHAR(150) NOT NULL,
        tipo_inmueble VARCHAR(50) NOT NULL,
        direccion TEXT DEFAULT '',
        rut VARCHAR(20) DEFAULT '',
        email VARCHAR(100) DEFAULT '',
        telefono VARCHAR(50) DEFAULT '',
        sitio_web VARCHAR(150) DEFAULT '',
        administrador VARCHAR(150) DEFAULT '',
        descripcion TEXT DEFAULT '',
        detalles_config TEXT DEFAULT '',
        gasto_comun_dia_vencimiento INTEGER DEFAULT 10,
        gasto_comun_interes_mora DECIMAL(5,2) DEFAULT 2.00,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );");
    
    // Si la base global está vacía, insertar un condominio por defecto
    $condos_count = $pdo_global->query("SELECT COUNT(*) FROM condominio")->fetchColumn();
    if ($condos_count == 0) {
        $pdo_global->exec("INSERT INTO condominio (id, nombre, tipo_inmueble) VALUES (1, 'Condominio Principal', 'condominio_edificios')");
    }

    // 2. Determinar condominio activo (de cookies o request)
    $active_condominio_id = intval($_COOKIE['active_condominio_id'] ?? $_REQUEST['condominio_id'] ?? 1);
    if ($active_condominio_id <= 0) {
        $active_condominio_id = 1;
    }
    
    // 3. Conectar a la base de datos LOCAL del condominio
    $condo_db_file = __DIR__ . "/condominio_" . $active_condominio_id . ".db";
    $db_exists = file_exists($condo_db_file);
    
    $pdo = new PDO("sqlite:" . $condo_db_file);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
    $pdo->exec("PRAGMA foreign_keys = ON;");
    
    // Si la base de datos local es nueva o no tiene la tabla 'categorias', correr el esquema
    if (!$db_exists || !tableExists($pdo, 'categorias') || !tableExists($pdo, 'condominio')) {
        $schema_file = __DIR__ . '/schema.sql';
        if (file_exists($schema_file)) {
            $schema_sql = file_get_contents($schema_file);
            $pdo->exec($schema_sql);
        } else {
            throw new Exception("El archivo schema.sql no fue encontrado.");
        }
    }



    // Asegurar la existencia de las nuevas tablas en bases de datos existentes
    $pdo->exec("CREATE TABLE IF NOT EXISTS condominio (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre VARCHAR(150) NOT NULL,
        tipo_inmueble VARCHAR(50) NOT NULL,
        descripcion TEXT,
        detalles_config TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );");

    $pdo->exec("CREATE TABLE IF NOT EXISTS tipos_unidades (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        codigo VARCHAR(50) NOT NULL UNIQUE,
        metros_cuadrados DECIMAL(8, 2) NOT NULL,
        porcentaje_prorrateo DECIMAL(6, 4) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );");

    $pdo->exec("CREATE TABLE IF NOT EXISTS propiedades (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        tipo VARCHAR(50) NOT NULL,
        identificador VARCHAR(100) NOT NULL,
        parent_id INTEGER DEFAULT NULL,
        tipo_unidad_id INTEGER DEFAULT NULL,
        es_arrendable INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(parent_id) REFERENCES propiedades(id) ON DELETE CASCADE,
        FOREIGN KEY(tipo_unidad_id) REFERENCES tipos_unidades(id) ON DELETE SET NULL
    );");

    // Migraciones adicionales para propiedades
    $propCols = [];
    $stmtPropCols = $pdo->query("PRAGMA table_info(propiedades)");
    while ($col = $stmtPropCols->fetch()) {
        $propCols[] = $col['name'];
    }
    if (!in_array('tipo_unidad_id', $propCols)) {
        $pdo->exec("ALTER TABLE propiedades ADD COLUMN tipo_unidad_id INTEGER DEFAULT NULL;");
    }
    if (!in_array('es_arrendable', $propCols)) {
        $pdo->exec("ALTER TABLE propiedades ADD COLUMN es_arrendable INTEGER DEFAULT 0;");
    }
    if (!in_array('piso', $propCols)) {
        $pdo->exec("ALTER TABLE propiedades ADD COLUMN piso INTEGER DEFAULT NULL;");
    }

    // Migraciones adicionales para condominio
    $condoCols = [];
    $stmtCondoCols = $pdo->query("PRAGMA table_info(condominio)");
    while ($col = $stmtCondoCols->fetch()) {
        $condoCols[] = $col['name'];
    }
    if (!in_array('direccion', $condoCols)) {
        $pdo->exec("ALTER TABLE condominio ADD COLUMN direccion TEXT DEFAULT '';");
    }
    if (!in_array('rut', $condoCols)) {
        $pdo->exec("ALTER TABLE condominio ADD COLUMN rut VARCHAR(20) DEFAULT '';");
    }
    if (!in_array('email', $condoCols)) {
        $pdo->exec("ALTER TABLE condominio ADD COLUMN email VARCHAR(100) DEFAULT '';");
    }
    if (!in_array('telefono', $condoCols)) {
        $pdo->exec("ALTER TABLE condominio ADD COLUMN telefono VARCHAR(50) DEFAULT '';");
    }
    if (!in_array('sitio_web', $condoCols)) {
        $pdo->exec("ALTER TABLE condominio ADD COLUMN sitio_web VARCHAR(150) DEFAULT '';");
    }

    // Crear tabla de administrador
    $pdo->exec("CREATE TABLE IF NOT EXISTS administrador (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre VARCHAR(150) NOT NULL,
        empresa_nombre VARCHAR(150),
        rut VARCHAR(20) NOT NULL,
        rnac VARCHAR(50),
        telefono VARCHAR(50),
        telefono_empresa VARCHAR(50),
        email VARCHAR(100),
        email_empresa VARCHAR(100),
        website VARCHAR(150),
        website_empresa VARCHAR(150),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );");

    // Migraciones automáticas para nuevas columnas de administrador
    $adminCols = [];
    if (tableExists($pdo, 'administrador')) {
        $stmtAdminCols = $pdo->query("PRAGMA table_info(administrador)");
        while ($col = $stmtAdminCols->fetch()) {
            $adminCols[] = $col['name'];
        }
        if (!in_array('avatar_path', $adminCols)) {
            $pdo->exec("ALTER TABLE administrador ADD COLUMN avatar_path VARCHAR(255) DEFAULT '';");
        }
    }

    // Migraciones automáticas para nuevas columnas de egresos
    $columns = [];
    $stmtCols = $pdo->query("PRAGMA table_info(egresos)");
    while ($col = $stmtCols->fetch()) {
        $columns[] = $col['name'];
    }
    if (!in_array('tipo_gasto', $columns)) {
        $pdo->exec("ALTER TABLE egresos ADD COLUMN tipo_gasto VARCHAR(20) DEFAULT 'comun';");
    }
    if (!in_array('propiedad_id', $columns)) {
        $pdo->exec("ALTER TABLE egresos ADD COLUMN propiedad_id INTEGER DEFAULT NULL;");
    }

    // Crear tabla de ficha_residentes
    $pdo->exec("CREATE TABLE IF NOT EXISTS ficha_residentes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        propiedad_id INTEGER NOT NULL UNIQUE,
        estacionamiento TEXT DEFAULT NULL,
        patente TEXT DEFAULT NULL,
        observacion TEXT DEFAULT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(propiedad_id) REFERENCES propiedades(id) ON DELETE CASCADE
    );");

    // Crear tabla de integrantes_ficha
    $pdo->exec("CREATE TABLE IF NOT EXISTS integrantes_ficha (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        ficha_id INTEGER NOT NULL,
        nombres TEXT NOT NULL,
        apellidos TEXT NOT NULL,
        rut TEXT NOT NULL,
        fecha_nacimiento DATE NOT NULL,
        telefono TEXT DEFAULT NULL,
        email TEXT DEFAULT NULL,
        tiene_acceso INTEGER DEFAULT 0,
        es_propietario INTEGER DEFAULT 0,
        vive_en_unidad INTEGER DEFAULT 1,
        FOREIGN KEY(ficha_id) REFERENCES ficha_residentes(id) ON DELETE CASCADE
    );");

    // Migración para columna vive_en_unidad
    $intCols = [];
    if (tableExists($pdo, 'integrantes_ficha')) {
        $stmtIntCols = $pdo->query("PRAGMA table_info(integrantes_ficha)");
        while ($col = $stmtIntCols->fetch()) {
            $intCols[] = $col['name'];
        }
        if (!in_array('vive_en_unidad', $intCols)) {
            $pdo->exec("ALTER TABLE integrantes_ficha ADD COLUMN vive_en_unidad INTEGER DEFAULT 1;");
        }
    }

    // Crear tabla periodos_gasto_comun
    $pdo->exec("CREATE TABLE IF NOT EXISTS periodos_gasto_comun (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        mes VARCHAR(7) NOT NULL UNIQUE,
        fecha_emision DATE NOT NULL,
        fecha_tope DATE NOT NULL,
        interes_mora DECIMAL(5,2) DEFAULT 0.00,
        estado VARCHAR(20) DEFAULT 'borrador',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );");

    // Crear tabla boletas_gasto_comun
    $pdo->exec("CREATE TABLE IF NOT EXISTS boletas_gasto_comun (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        periodo_id INTEGER NOT NULL,
        propiedad_id INTEGER NOT NULL,
        monto_comun DECIMAL(12,2) NOT NULL,
        monto_torre DECIMAL(12,2) NOT NULL,
        monto_unidad DECIMAL(12,2) NOT NULL,
        monto_mora DECIMAL(12,2) DEFAULT 0.00,
        monto_total DECIMAL(12,2) NOT NULL,
        estado VARCHAR(20) DEFAULT 'pendiente',
        fecha_pago DATE DEFAULT NULL,
        FOREIGN KEY(periodo_id) REFERENCES periodos_gasto_comun(id) ON DELETE CASCADE,
        FOREIGN KEY(propiedad_id) REFERENCES propiedades(id) ON DELETE CASCADE,
        UNIQUE(periodo_id, propiedad_id)
    );");

    // Tablas para el Módulo de Colaboradores
    $pdo->exec("CREATE TABLE IF NOT EXISTS cargos_colaboradores (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre VARCHAR(100) NOT NULL UNIQUE
    );");

    $pdo->exec("CREATE TABLE IF NOT EXISTS colaboradores (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombres VARCHAR(100) NOT NULL,
        apellidos VARCHAR(100) NOT NULL,
        fecha_nacimiento DATE NOT NULL,
        telefono VARCHAR(50),
        email VARCHAR(100),
        direccion TEXT,
        contacto_emergencia_nombre VARCHAR(100),
        contacto_emergencia_telefono VARCHAR(50),
        cargo_id INTEGER,
        estado VARCHAR(50) DEFAULT 'activo',
        tipo_contrato VARCHAR(50),
        sueldo_liquido REAL,
        contrato_ruta VARCHAR(255),
        observaciones TEXT,
        horario_trabajo TEXT,
        funciones TEXT,
        permitir_insumos INTEGER DEFAULT 0,
        creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (cargo_id) REFERENCES cargos_colaboradores(id)
    );");

    $pdo->exec("CREATE TABLE IF NOT EXISTS colaborador_amonestaciones (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        colaborador_id INTEGER NOT NULL,
        fecha DATE NOT NULL,
        hora TIME NOT NULL,
        descripcion TEXT NOT NULL,
        archivo_ruta VARCHAR(255),
        creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (colaborador_id) REFERENCES colaboradores(id) ON DELETE CASCADE
    );");

    $pdo->exec("CREATE TABLE IF NOT EXISTS colaborador_liquidaciones (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        colaborador_id INTEGER NOT NULL,
        periodo VARCHAR(7) NOT NULL,
        archivo_ruta VARCHAR(255) NOT NULL,
        creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (colaborador_id) REFERENCES colaboradores(id) ON DELETE CASCADE
    );");

    // Tablas para el Módulo de Arriendo de Áreas Comunes (Ingresos por Arriendo)
    $pdo->exec("CREATE TABLE IF NOT EXISTS areas_comunes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre VARCHAR(100) NOT NULL,
        descripcion TEXT,
        costo DECIMAL(12,2) DEFAULT 0.00,
        color VARCHAR(20) DEFAULT '#3b82f6',
        condicion VARCHAR(50) DEFAULT 'arriendo',
        capacidad_simultanea INTEGER DEFAULT 1,
        creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );");

    $pdo->exec("CREATE TABLE IF NOT EXISTS arriendos_areas (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        area_comun_id INTEGER NOT NULL,
        propiedad_id INTEGER NOT NULL,
        fecha DATE NOT NULL,
        hora_inicio TIME NOT NULL,
        hora_fin TIME NOT NULL,
        monto_pagado DECIMAL(12,2) NOT NULL,
        observaciones TEXT,
        estado VARCHAR(20) DEFAULT 'pendiente',
        creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (area_comun_id) REFERENCES areas_comunes(id) ON DELETE CASCADE,
        FOREIGN KEY (propiedad_id) REFERENCES propiedades(id) ON DELETE CASCADE
    );");

    // Migraciones para áreas comunes
    $acCols = [];
    if (tableExists($pdo, 'areas_comunes')) {
        $stmtAcCols = $pdo->query("PRAGMA table_info(areas_comunes)");
        while ($col = $stmtAcCols->fetch()) {
            $acCols[] = $col['name'];
        }
        if (!in_array('capacidad_simultanea', $acCols)) {
            $pdo->exec("ALTER TABLE areas_comunes ADD COLUMN capacidad_simultanea INTEGER DEFAULT 1;");
        }
    }

    // Migraciones para arriendos_areas
    $aaCols = [];
    if (tableExists($pdo, 'arriendos_areas')) {
        $stmtAaCols = $pdo->query("PRAGMA table_info(arriendos_areas)");
        while ($col = $stmtAaCols->fetch()) {
            $aaCols[] = $col['name'];
        }
        if (!in_array('estado', $aaCols)) {
            $pdo->exec("ALTER TABLE arriendos_areas ADD COLUMN estado VARCHAR(20) DEFAULT 'pendiente';");
        }
    }

    // Tabla para Pedido de Insumos y Repuestos por Colaboradores
    $pdo->exec("CREATE TABLE IF NOT EXISTS pedidos_insumos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        colaborador_id INTEGER NOT NULL,
        item_nombre VARCHAR(150) NOT NULL,
        cantidad INTEGER NOT NULL,
        categoria VARCHAR(50) DEFAULT 'limpieza',
        observaciones TEXT,
        estado VARCHAR(30) DEFAULT 'pendiente',
        fecha_pedido TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        condominio_id INTEGER DEFAULT 1,
        FOREIGN KEY (colaborador_id) REFERENCES colaboradores(id) ON DELETE CASCADE
    );");

    // Tabla para Tickets de Residentes (Quejas, Reclamos, Sugerencias, Consultas)
    $pdo->exec("CREATE TABLE IF NOT EXISTS tickets (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        propiedad_id INTEGER NOT NULL,
        nombre VARCHAR(150) NOT NULL,
        correo VARCHAR(100) NOT NULL,
        tipo_asunto VARCHAR(50) NOT NULL,
        descripcion TEXT NOT NULL,
        estado VARCHAR(20) DEFAULT 'abierto',
        creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (propiedad_id) REFERENCES propiedades(id) ON DELETE CASCADE
    );");

    // Migraciones para la tabla colaboradores (añadir horario_trabajo y funciones si no existen)
    if (tableExists($pdo, 'colaboradores')) {
        $stmtColCols = $pdo->query("PRAGMA table_info(colaboradores)");
        $colCols = [];
        while ($col = $stmtColCols->fetch()) {
            $colCols[] = $col['name'];
        }
        if (!in_array('horario_trabajo', $colCols)) {
            $pdo->exec("ALTER TABLE colaboradores ADD COLUMN horario_trabajo TEXT DEFAULT NULL;");
        }
        if (!in_array('funciones', $colCols)) {
            $pdo->exec("ALTER TABLE colaboradores ADD COLUMN funciones TEXT DEFAULT NULL;");
        }
        if (!in_array('permitir_insumos', $colCols)) {
            $pdo->exec("ALTER TABLE colaboradores ADD COLUMN permitir_insumos INTEGER DEFAULT 0;");
        }
    }

    // Migraciones para la tabla condominio
    $condCols = [];
    if (tableExists($pdo, 'condominio')) {
        $stmtCondCols = $pdo->query("PRAGMA table_info(condominio)");
        while ($col = $stmtCondCols->fetch()) {
            $condCols[] = $col['name'];
        }
        if (!in_array('gasto_comun_dia_vencimiento', $condCols)) {
            $pdo->exec("ALTER TABLE condominio ADD COLUMN gasto_comun_dia_vencimiento INTEGER DEFAULT 10;");
        }
        if (!in_array('gasto_comun_interes_mora', $condCols)) {
            $pdo->exec("ALTER TABLE condominio ADD COLUMN gasto_comun_interes_mora DECIMAL(5,2) DEFAULT 2.00;");
        }
        if (!in_array('direccion', $condCols)) {
            $pdo->exec("ALTER TABLE condominio ADD COLUMN direccion TEXT DEFAULT '';");
        }
        if (!in_array('rut', $condCols)) {
            $pdo->exec("ALTER TABLE condominio ADD COLUMN rut VARCHAR(20) DEFAULT '';");
        }
        if (!in_array('administrador', $condCols)) {
            $pdo->exec("ALTER TABLE condominio ADD COLUMN administrador VARCHAR(150) DEFAULT '';");
        }
    }

    // Migraciones para agregar condominio_id a las tablas operativas
    $tablesToMigrate = ['propiedades', 'colaboradores', 'egresos', 'periodos_gasto_comun', 'areas_comunes', 'arriendos_areas', 'ficha_residentes'];
    foreach ($tablesToMigrate as $tName) {
        if (tableExists($pdo, $tName)) {
            $stmtCols = $pdo->query("PRAGMA table_info({$tName})");
            $cols = [];
            while ($c = $stmtCols->fetch()) {
                $cols[] = $c['name'];
            }
            if (!in_array('condominio_id', $cols)) {
                $pdo->exec("ALTER TABLE {$tName} ADD COLUMN condominio_id INTEGER DEFAULT 1;");
            }
        }
    }

    // Asegurar que el perfil local de condominio existe en la base de datos local
    $has_local_profile = $pdo->query("SELECT COUNT(*) FROM condominio")->fetchColumn() > 0;
    if (!$has_local_profile) {
        $stmtG = $pdo_global->prepare("SELECT * FROM condominio WHERE id = ?");
        $stmtG->execute([$active_condominio_id]);
        $condo_profile = $stmtG->fetch();
        if ($condo_profile) {
            $stmtL = $pdo->prepare("INSERT INTO condominio (id, nombre, tipo_inmueble, direccion, rut, email, telefono, sitio_web, administrador, descripcion, detalles_config, gasto_comun_dia_vencimiento, gasto_comun_interes_mora) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
            $stmtL->execute([
                $condo_profile['id'],
                $condo_profile['nombre'],
                $condo_profile['tipo_inmueble'],
                $condo_profile['direccion'] ?? '',
                $condo_profile['rut'] ?? '',
                $condo_profile['email'] ?? '',
                $condo_profile['telefono'] ?? '',
                $condo_profile['sitio_web'] ?? '',
                $condo_profile['administrador'] ?? '',
                $condo_profile['descripcion'] ?? '',
                $condo_profile['detalles_config'] ?? '',
                $condo_profile['gasto_comun_dia_vencimiento'] ?? 10,
                $condo_profile['gasto_comun_interes_mora'] ?? 2.00
            ]);
        }
    }

    // Asegurar que el perfil local de administrador existe en la base de datos local
    if (tableExists($pdo, 'administrador')) {
        $has_admin_profile = $pdo->query("SELECT COUNT(*) FROM administrador")->fetchColumn() > 0;
        if (!$has_admin_profile) {
            $stmtC = $pdo->query("SELECT administrador, email, telefono, sitio_web, rut FROM condominio LIMIT 1");
            $condo_details = $stmtC->fetch();
            if ($condo_details) {
                $stmtAdminIns = $pdo->prepare("INSERT INTO administrador (nombre, email, telefono, website, rut) VALUES (?, ?, ?, ?, ?)");
                $stmtAdminIns->execute([
                    !empty($condo_details['administrador']) ? $condo_details['administrador'] : 'Administrador',
                    $condo_details['email'] ?? '',
                    $condo_details['telefono'] ?? '',
                    $condo_details['sitio_web'] ?? '',
                    !empty($condo_details['rut']) ? $condo_details['rut'] : '1-9'
                ]);
            }
        }
    }
} catch (Exception $e) {
    header('Content-Type: application/json; charset=utf-8', true, 500);
    echo json_encode([
        'success' => false,
        'message' => 'Error de inicialización de Base de Datos: ' . $e->getMessage()
    ]);
    exit;
}

/**
 * Comprueba si una tabla existe en la base de datos SQLite.
 */
function tableExists($pdo, $table) {
    try {
        $result = $pdo->query("SELECT 1 FROM sqlite_master WHERE type='table' AND name='{$table}'");
        return $result && $result->fetch() !== false;
    } catch (Exception $e) {
        return false;
    }
}
