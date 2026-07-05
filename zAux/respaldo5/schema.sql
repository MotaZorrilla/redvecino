-- Tabla de Condominio
CREATE TABLE IF NOT EXISTS condominio (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre VARCHAR(150) NOT NULL,
    tipo_inmueble VARCHAR(50) NOT NULL, -- 'torre', 'condominio_edificios', 'condominio_casas'
    direccion TEXT,
    rut VARCHAR(20),
    email VARCHAR(100),
    telefono VARCHAR(50),
    sitio_web VARCHAR(150),
    administrador VARCHAR(150),
    descripcion TEXT,
    detalles_config TEXT, -- Formato JSON para campos dinámicos
    gasto_comun_dia_vencimiento INTEGER DEFAULT 10,
    gasto_comun_interes_mora DECIMAL(5,2) DEFAULT 2.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Tipos de Unidades (Alícuotas / Prorrateo)
CREATE TABLE IF NOT EXISTS tipos_unidades (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    codigo VARCHAR(50) NOT NULL UNIQUE,
    metros_cuadrados DECIMAL(8, 2) NOT NULL,
    porcentaje_prorrateo DECIMAL(6, 4) NOT NULL, -- Ej: 1.2500 para 1.25%
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Propiedades (Unidades, áreas comunes, seguridad)
CREATE TABLE IF NOT EXISTS propiedades (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    tipo VARCHAR(50) NOT NULL, -- 'torre', 'departamento', 'casa', 'local_comercial', 'area_comun', 'seguridad', 'otro'
    identificador VARCHAR(100) NOT NULL, -- Ej: 'Torre A', 'Depto 102', 'Piscina'
    parent_id INTEGER DEFAULT NULL, -- Relación jerárquica (ej: depto pertenece a torre)
    tipo_unidad_id INTEGER DEFAULT NULL, -- Relación con su alícuota/tipo de prorrateo
    es_arrendable INTEGER DEFAULT 0, -- 0 = Gratis, 1 = Arrendable
    piso INTEGER DEFAULT NULL, -- Nivel/Piso en el que se encuentra
    condominio_id INTEGER DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(parent_id) REFERENCES propiedades(id) ON DELETE CASCADE,
    FOREIGN KEY(tipo_unidad_id) REFERENCES tipos_unidades(id) ON DELETE SET NULL
);

-- Tabla de Categorías Principales
CREATE TABLE IF NOT EXISTS categorias (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre VARCHAR(100) NOT NULL UNIQUE,
    descripcion VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Subcategorías
CREATE TABLE IF NOT EXISTS subcategorias (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    categoria_id INTEGER NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (categoria_id) REFERENCES categorias(id) ON DELETE CASCADE,
    UNIQUE(categoria_id, nombre)
);

-- Tabla de Egresos
CREATE TABLE IF NOT EXISTS egresos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    fecha DATE NOT NULL,
    subcategoria_id INTEGER NOT NULL,
    descripcion VARCHAR(255) NOT NULL,
    monto DECIMAL(12, 2) NOT NULL,
    observaciones TEXT,
    referencia_cotizacion VARCHAR(100),
    dividir_meses INTEGER NOT NULL DEFAULT 1,
    tiene_documento INTEGER NOT NULL DEFAULT 0, -- 0 = No, 1 = Sí
    documento_ruta VARCHAR(255),
    tipo_gasto VARCHAR(20) DEFAULT 'comun', -- 'comun', 'especifico'
    propiedad_id INTEGER DEFAULT NULL, -- Relación con la propiedad asignada
    condominio_id INTEGER DEFAULT 1,
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (subcategoria_id) REFERENCES subcategorias(id) ON DELETE RESTRICT,
    FOREIGN KEY (propiedad_id) REFERENCES propiedades(id) ON DELETE SET NULL
);

-- Tabla de Administrador
CREATE TABLE IF NOT EXISTS administrador (
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
    avatar_path VARCHAR(255) DEFAULT '',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Ficha de Residentes
CREATE TABLE IF NOT EXISTS ficha_residentes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    propiedad_id INTEGER NOT NULL UNIQUE,
    estacionamiento TEXT DEFAULT NULL,
    patente TEXT DEFAULT NULL,
    observacion TEXT DEFAULT NULL,
    condominio_id INTEGER DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(propiedad_id) REFERENCES propiedades(id) ON DELETE CASCADE
);

-- Tabla de Integrantes de Ficha
CREATE TABLE IF NOT EXISTS integrantes_ficha (
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
);
