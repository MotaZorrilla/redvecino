<?php
// api.php - Controlador de API backend para el sistema de egresos
require_once __DIR__ . '/config.php';

header('Content-Type: application/json; charset=utf-8');

$action = $_GET['action'] ?? '';

$active_condominio_id = intval($_COOKIE['active_condominio_id'] ?? $_REQUEST['condominio_id'] ?? 1);
if ($active_condominio_id <= 0) {
    $active_condominio_id = 1;
}

// Estructura de respuesta común
function sendResponse($success, $message = '', $data = [], $statusCode = 200) {
    http_response_code($statusCode);
    echo json_encode([
        'success' => $success,
        'message' => $message,
        'data' => $data
    ]);
    exit;
}

try {
    switch ($action) {
        
        // 1. Verificar si requiere onboarding (si no hay condominio o categorías creadas)
        case 'check_onboarding':
            $stmtCond = $pdo->query("SELECT COUNT(*) as total FROM condominio");
            $hasCond = ($stmtCond->fetch()['total'] > 0);
            
            $stmtCat = $pdo->query("SELECT COUNT(*) as total FROM categorias");
            $hasCat = ($stmtCat->fetch()['total'] > 0);
            
            sendResponse(true, '', [
                'needs_condominio_setup' => !$hasCond,
                'needs_categorias_setup' => !$hasCat,
                'needs_onboarding' => (!$hasCond || !$hasCat)
            ]);
            break;

        // 1.5. Configurar condominio y generar propiedades jerárquicamente
        case 'setup_condominio':
            if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
                sendResponse(false, 'Método no permitido', [], 405);
            }
            
            $tipo_inmueble = $_POST['tipo_inmueble'] ?? '';
            $nombre = trim($_POST['nombre'] ?? '');
            $descripcion = trim($_POST['descripcion'] ?? '');
            
            if (empty($tipo_inmueble) || empty($nombre)) {
                sendResponse(false, 'El tipo de inmueble y el nombre son obligatorios.');
            }
            
            // Recoger toda la metadata de configuración
            $detalles_config = [];
            foreach ($_POST as $key => $val) {
                if ($key !== 'tipo_inmueble' && $key !== 'nombre' && $key !== 'descripcion') {
                    $detalles_config[$key] = $val;
                }
            }
            $detalles_config_json = json_encode($detalles_config);
            
            $pdo->beginTransaction();
            try {
                // Insertar condominio
                $stmt = $pdo->prepare("INSERT INTO condominio (nombre, tipo_inmueble, descripcion, detalles_config) VALUES (?, ?, ?, ?)");
                $stmt->execute([$nombre, $tipo_inmueble, $descripcion, $detalles_config_json]);
                
                // 1. Guardar tipos de unidades definidos
                $tipos_unidades_str = $_POST['tipos_unidades'] ?? '[]';
                $tipos_unidades = json_decode($tipos_unidades_str, true) ?: [];
                $default_tipo_unidad_id = null;
                
                $stmtType = $pdo->prepare("INSERT INTO tipos_unidades (codigo, metros_cuadrados, porcentaje_prorrateo) VALUES (?, ?, ?)");
                foreach ($tipos_unidades as $ut) {
                    $codigo_ut = trim($ut['codigo'] ?? '');
                    $metros_ut = floatval($ut['metros'] ?? 0);
                    $prorrateo_ut = floatval($ut['prorrateo'] ?? 0);
                    if (!empty($codigo_ut) && $metros_ut > 0) {
                        try {
                            $stmtType->execute([$codigo_ut, $metros_ut, $prorrateo_ut / 100]); // Convertir % a alícuota decimal (ej: 1.25% -> 0.0125)
                            $ut_id = $pdo->lastInsertId();
                            if ($default_tipo_unidad_id === null) {
                                $default_tipo_unidad_id = $ut_id;
                            }
                        } catch (Exception $exType) {
                            // Si ya existe por código, obtener su id
                            $stmtFind = $pdo->prepare("SELECT id FROM tipos_unidades WHERE codigo = ?");
                            $stmtFind->execute([$codigo_ut]);
                            $ut_id = $stmtFind->fetchColumn();
                            if ($ut_id && $default_tipo_unidad_id === null) {
                                $default_tipo_unidad_id = $ut_id;
                            }
                        }
                    }
                }
                
                // Fallback si no definieron al menos una unidad
                if ($default_tipo_unidad_id === null) {
                    try {
                        $stmtType->execute(['STD', 70, 0.0100]);
                        $default_tipo_unidad_id = $pdo->lastInsertId();
                    } catch (Exception $exStd) {
                        $stmtFind = $pdo->prepare("SELECT id FROM tipos_unidades LIMIT 1");
                        $stmtFind->execute();
                        $default_tipo_unidad_id = $stmtFind->fetchColumn();
                    }
                }

                // Generar propiedades
                if ($tipo_inmueble === 'torre') {
                    $pisos = intval($_POST['pisos'] ?? 0);
                    $habitacionales = intval($_POST['habitacionales'] ?? 0);
                    $comerciales = intval($_POST['comerciales'] ?? 0);
                    
                    // Insertar Torre Principal
                    $stmtProp = $pdo->prepare("INSERT INTO propiedades (tipo, identificador, parent_id, tipo_unidad_id) VALUES (?, ?, ?, ?)");
                    $stmtProp->execute(['torre', $nombre, null, null]);
                    $torre_id = $pdo->lastInsertId();
                    
                    // Generar Unidades Habitacionales (Departamentos)
                    if ($pisos > 0 && $habitacionales > 0) {
                        $depto_por_piso = ceil($habitacionales / $pisos);
                        $depto_count = 0;
                        for ($p = 1; $p <= $pisos; $p++) {
                            for ($d = 1; $d <= $depto_por_piso; $d++) {
                                if ($depto_count >= $habitacionales) break;
                                $num = sprintf("%d%02d", $p, $d);
                                $stmtProp->execute(['departamento', "Depto " . $num, $torre_id, $default_tipo_unidad_id]);
                                $depto_count++;
                            }
                        }
                    }
                    
                    // Generar Unidades Comerciales
                    for ($c = 1; $c <= $comerciales; $c++) {
                        $stmtProp->execute(['local_comercial', "Local Comercial " . $c, $torre_id, null]);
                    }
                    
                } elseif ($tipo_inmueble === 'condominio_edificios') {
                    $num_torres = intval($_POST['num_torres'] ?? 0);
                    $id_torres_tipo = $_POST['id_torres_tipo'] ?? 'letras';
                    $habitacionales = intval($_POST['habitacionales'] ?? 0);
                    $comerciales = intval($_POST['comerciales'] ?? 0);
                    
                    $torre_ids = [];
                    for ($t = 1; $t <= $num_torres; $t++) {
                        $torre_label = ($id_torres_tipo === 'letras') ? chr(64 + $t) : (string)$t;
                        $torre_name = "Torre " . $torre_label;
                        
                        $stmtProp = $pdo->prepare("INSERT INTO propiedades (tipo, identificador, parent_id, tipo_unidad_id) VALUES (?, ?, ?, ?)");
                        $stmtProp->execute(['torre', $torre_name, null, null]);
                        $torre_ids[] = $pdo->lastInsertId();
                    }
                    
                    if ($num_torres > 0) {
                        // Distribuir departamentos entre las torres
                        $deptos_por_torre = floor($habitacionales / $num_torres);
                        $deptos_resto = $habitacionales % $num_torres;
                        
                        // Distribuir locales comerciales entre las torres
                        $com_por_torre = floor($comerciales / $num_torres);
                        $com_resto = $comerciales % $num_torres;
                        
                        $stmtSubProp = $pdo->prepare("INSERT INTO propiedades (tipo, identificador, parent_id, tipo_unidad_id) VALUES (?, ?, ?, ?)");
                        
                        for ($idx = 0; $idx < $num_torres; $idx++) {
                            $t_id = $torre_ids[$idx];
                            $t_label = ($id_torres_tipo === 'letras') ? chr(64 + $idx + 1) : (string)($idx + 1);
                            
                            // Cantidad para esta torre
                            $cant_deptos = $deptos_por_torre + ($idx < $deptos_resto ? 1 : 0);
                            $cant_com = $com_por_torre + ($idx < $com_resto ? 1 : 0);
                            
                            // Generar departamentos
                            for ($d = 1; $d <= $cant_deptos; $d++) {
                                $stmtSubProp->execute(['departamento', "Depto " . $t_label . "-" . $d, $t_id, $default_tipo_unidad_id]);
                            }
                            
                            // Generar locales comerciales
                            for ($c = 1; $c <= $cant_com; $c++) {
                                $stmtSubProp->execute(['local_comercial', "Local " . $t_label . "-" . $c, $t_id, null]);
                            }
                        }
                    }
                    
                } elseif ($tipo_inmueble === 'condominio_casas') {
                    $num_casas = intval($_POST['num_casas'] ?? 0);
                    $stmtProp = $pdo->prepare("INSERT INTO propiedades (tipo, identificador, parent_id, tipo_unidad_id) VALUES (?, ?, ?, ?)");
                    for ($c = 1; $c <= $num_casas; $c++) {
                        $stmtProp->execute(['casa', "Casa " . $c, null, $default_tipo_unidad_id]);
                    }
                }
                
                // Generar Equipamiento y Áreas Comunes dinámicos
                $equipamiento_str = $_POST['equipamiento'] ?? '[]';
                $equipamiento = json_decode($equipamiento_str, true) ?: [];
                
                $stmtPropCommon = $pdo->prepare("INSERT INTO propiedades (tipo, identificador, parent_id, tipo_unidad_id, es_arrendable) VALUES (?, ?, ?, ?, ?)");
                foreach ($equipamiento as $eq) {
                    $tipo_eq = trim($eq['tipo'] ?? 'area_comun');
                    $nombre_eq = trim($eq['nombre'] ?? '');
                    $es_arrendable_eq = intval($eq['es_arrendable'] ?? 0);
                    
                    if (!empty($nombre_eq)) {
                        $stmtPropCommon->execute([$tipo_eq, ucwords($nombre_eq), null, null, $es_arrendable_eq]);
                    }
                }
                
                $pdo->commit();
                sendResponse(true, 'Condominio estructurado y creado con éxito.');
            } catch (Exception $ex) {
                $pdo->rollBack();
                sendResponse(false, 'Error al crear la estructura del condominio: ' . $ex->getMessage());
            }
            break;

        // 1.6. Obtener listado de todas las propiedades/unidades
        case 'get_propiedades':
            $stmt = $pdo->prepare("SELECT * FROM propiedades WHERE condominio_id = ? ORDER BY tipo ASC, identificador ASC");
            $stmt->execute([$active_condominio_id]);
            sendResponse(true, '', ['propiedades' => $stmt->fetchAll()]);
            break;

        // 1.7. Obtener perfil completo del condominio
        case 'get_condominio_profile':
            $stmt = $pdo->query("SELECT * FROM condominio LIMIT 1");
            $condo = $stmt->fetch();
            if (!$condo) {
                sendResponse(false, 'Condominio no configurado.');
            }
            
            // Obtener tipos de unidades
            $stmtType = $pdo->query("SELECT * FROM tipos_unidades ORDER BY codigo ASC");
            $tipos = $stmtType->fetchAll();
            
            // Obtener equipamientos y áreas comunes (excluyendo torres y departamentos/casas físicas para simplificar)
            $stmtEq = $pdo->query("SELECT * FROM propiedades WHERE tipo IN ('area_comun', 'seguridad', 'otro') ORDER BY tipo ASC, identificador ASC");
            $equipamiento = $stmtEq->fetchAll();
            
            sendResponse(true, '', [
                'condominio' => $condo,
                'tipos_unidades' => $tipos,
                'equipamiento' => $equipamiento
            ]);
            break;

        // 1.8. Actualizar perfil del condominio
        case 'update_condominio_profile':
            if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
                sendResponse(false, 'Método no permitido', [], 405);
            }
            
            $nombre = trim($_POST['nombre'] ?? '');
            $tipo_inmueble = trim($_POST['tipo_inmueble'] ?? 'torre');
            $direccion = trim($_POST['direccion'] ?? '');
            $rut = trim($_POST['rut'] ?? '');
            $email = trim($_POST['email'] ?? '');
            $telefono = trim($_POST['telefono'] ?? '');
            $sitio_web = trim($_POST['sitio_web'] ?? '');
            $descripcion = trim($_POST['descripcion'] ?? '');
            
            if (empty($nombre)) {
                sendResponse(false, 'El nombre del condominio es obligatorio.');
            }
            
            $tipos_unidades_str = $_POST['tipos_unidades'] ?? '[]';
            $tipos_unidades = json_decode($tipos_unidades_str, true) ?: [];
            
            $equipamiento_str = $_POST['equipamiento'] ?? '[]';
            $equipamiento = json_decode($equipamiento_str, true) ?: [];
            
            // Obtener detalles_config actual para no perder configuraciones como torres_estructura
            $stmtCurrent = $pdo->query("SELECT detalles_config FROM condominio LIMIT 1");
            $detalles_config_json_curr = $stmtCurrent->fetchColumn() ?: '{}';
            $detalles_config = json_decode($detalles_config_json_curr, true) ?: [];
            
            // Recoger toda la metadata de configuración física
            $exclude_keys = ['nombre', 'tipo_inmueble', 'direccion', 'rut', 'email', 'telefono', 'sitio_web', 'descripcion', 'tipos_unidades', 'equipamiento'];
            foreach ($_POST as $key => $val) {
                if (!in_array($key, $exclude_keys)) {
                    $detalles_config[$key] = $val;
                }
            }
            
            // Limpiar claves obsoletas
            unset($detalles_config['pisos_por_torre']);
            unset($detalles_config['depto_por_piso']);
            unset($detalles_config['perfil-edif-pisos-por-torre']);
            unset($detalles_config['perfil-edif-depto-por-piso']);
            
            $detalles_config_json = json_encode($detalles_config);

            $pdo->beginTransaction();
            try {
                // Actualizar condominio (primer registro)
                $stmt = $pdo->query("SELECT id FROM condominio LIMIT 1");
                $condo_id = $stmt->fetchColumn();
                if ($condo_id) {
                    $stmtUpdate = $pdo->prepare("UPDATE condominio SET nombre = ?, tipo_inmueble = ?, direccion = ?, rut = ?, email = ?, telefono = ?, sitio_web = ?, descripcion = ?, detalles_config = ? WHERE id = ?");
                    $stmtUpdate->execute([$nombre, $tipo_inmueble, $direccion, $rut, $email, $telefono, $sitio_web, $descripcion, $detalles_config_json, $condo_id]);
                } else {
                    $stmtInsert = $pdo->prepare("INSERT INTO condominio (nombre, tipo_inmueble, direccion, rut, email, telefono, sitio_web, descripcion, detalles_config) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
                    $stmtInsert->execute([$nombre, $tipo_inmueble, $direccion, $rut, $email, $telefono, $sitio_web, $descripcion, $detalles_config_json]);
                }

                // Sincronizar con base de datos global
                global $pdo_global, $active_condominio_id;
                if (isset($pdo_global)) {
                    $stmtGlobalUpdate = $pdo_global->prepare("UPDATE condominio SET nombre = ?, tipo_inmueble = ?, direccion = ?, rut = ?, email = ?, telefono = ?, sitio_web = ?, descripcion = ?, detalles_config = ? WHERE id = ?");
                    $stmtGlobalUpdate->execute([$nombre, $tipo_inmueble, $direccion, $rut, $email, $telefono, $sitio_web, $descripcion, $detalles_config_json, $active_condominio_id]);
                }
                
                // Procesar tipos de unidades
                $stmtDelType = $pdo->prepare("DELETE FROM tipos_unidades WHERE id = ?");
                $stmtUpdType = $pdo->prepare("UPDATE tipos_unidades SET codigo = ?, metros_cuadrados = ?, porcentaje_prorrateo = ? WHERE id = ?");
                $stmtInsType = $pdo->prepare("INSERT INTO tipos_unidades (codigo, metros_cuadrados, porcentaje_prorrateo) VALUES (?, ?, ?)");
                
                foreach ($tipos_unidades as $ut) {
                    $ut_id = isset($ut['id']) && $ut['id'] !== '' ? intval($ut['id']) : null;
                    $ut_codigo = trim($ut['codigo'] ?? '');
                    $ut_meters = floatval($ut['meters'] ?? 0);
                    $ut_prorrateo = floatval($ut['prorrateo'] ?? 0);
                    
                    if (isset($ut['deleted']) && $ut['deleted'] === true) {
                        if ($ut_id) {
                            $stmtDelType->execute([$ut_id]);
                        }
                    } elseif (!empty($ut_codigo) && $ut_meters > 0) {
                        if ($ut_id) {
                            $stmtUpdType->execute([$ut_codigo, $ut_meters, $ut_prorrateo / 100, $ut_id]);
                        } else {
                            $stmtInsType->execute([$ut_codigo, $ut_meters, $ut_prorrateo / 100]);
                        }
                    }
                }
                
                // Procesar equipamiento
                $stmtDelEq = $pdo->prepare("DELETE FROM propiedades WHERE id = ?");
                $stmtUpdEq = $pdo->prepare("UPDATE propiedades SET tipo = ?, identificador = ?, es_arrendable = ? WHERE id = ?");
                $stmtInsEq = $pdo->prepare("INSERT INTO propiedades (tipo, identificador, parent_id, tipo_unidad_id, es_arrendable) VALUES (?, ?, null, null, ?)");
                
                foreach ($equipamiento as $eq) {
                    $eq_id = isset($eq['id']) && $eq['id'] !== '' ? intval($eq['id']) : null;
                    $eq_tipo = trim($eq['tipo'] ?? 'area_comun');
                    $eq_nombre = trim($eq['nombre'] ?? '');
                    $eq_es_arrendable = intval($eq['es_arrendable'] ?? 0);
                    
                    if (isset($eq['deleted']) && $eq['deleted'] === true) {
                        if ($eq_id) {
                            $stmtDelEq->execute([$eq_id]);
                        }
                    } elseif (!empty($eq_nombre)) {
                        if ($eq_id) {
                            $stmtUpdEq->execute([$eq_tipo, ucwords($eq_nombre), $eq_es_arrendable, $eq_id]);
                        } else {
                            $stmtInsEq->execute([$eq_tipo, ucwords($eq_nombre), $eq_es_arrendable]);
                        }
                    }
                }
                // Sincronizar torres si es un condominio de edificios
                if ($tipo_inmueble === 'condominio_edificios') {
                    $num_torres = intval($_POST['num_torres'] ?? 0);
                    $id_torres_tipo = $_POST['id_torres_tipo'] ?? 'letras';
                    
                    if ($num_torres > 0) {
                        // Obtener torres existentes
                        $stmtT = $pdo->prepare("SELECT id, identificador FROM propiedades WHERE tipo = 'torre' ORDER BY id ASC");
                        $stmtT->execute();
                        $existing_towers = $stmtT->fetchAll();
                        $existing_count = count($existing_towers);
                        
                        // Si faltan torres, agregarlas
                        if ($existing_count < $num_torres) {
                            for ($t = $existing_count + 1; $t <= $num_torres; $t++) {
                                $label = ($id_torres_tipo === 'letras') ? chr(64 + $t) : (string)$t;
                                $name = "Torre " . $label;
                                $stmtInsT = $pdo->prepare("INSERT INTO propiedades (tipo, identificador, parent_id, tipo_unidad_id) VALUES ('torre', ?, null, null)");
                                $stmtInsT->execute([$name]);
                            }
                        }
                        
                        // Si sobran torres, eliminarlas
                        if ($existing_count > $num_torres) {
                            for ($i = $num_torres; $i < $existing_count; $i++) {
                                $t_id = $existing_towers[$i]['id'];
                                $stmtDelDeps = $pdo->prepare("DELETE FROM propiedades WHERE parent_id = ?");
                                $stmtDelDeps->execute([$t_id]);
                                $stmtDelTorre = $pdo->prepare("DELETE FROM propiedades WHERE id = ?");
                                $stmtDelTorre->execute([$t_id]);
                            }
                        }
                        
                        // Sincronizar nombres de torres y departamentos restantes
                        $stmtT->execute();
                        $updated_towers = $stmtT->fetchAll();
                        for ($t = 0; $t < count($updated_towers); $t++) {
                            $t_id = $updated_towers[$t]['id'];
                            $old_name = $updated_towers[$t]['identificador'];
                            $label = ($id_torres_tipo === 'letras') ? chr(64 + ($t + 1)) : (string)($t + 1);
                            $new_name = "Torre " . $label;
                            
                            if ($old_name !== $new_name) {
                                $stmtUpdT = $pdo->prepare("UPDATE propiedades SET identificador = ? WHERE id = ?");
                                $stmtUpdT->execute([$new_name, $t_id]);
                                
                                // Actualizar departamentos vinculados
                                $stmtDeps = $pdo->prepare("SELECT id, identificador FROM propiedades WHERE parent_id = ? AND tipo = 'departamento'");
                                $stmtDeps->execute([$t_id]);
                                $deps = $stmtDeps->fetchAll();
                                foreach ($deps as $dep) {
                                    $old_dep_name = $dep['identificador'];
                                    $old_label = str_replace("Torre ", "", $old_name);
                                    
                                    $new_dep_name = str_replace($old_name, $new_name, $old_dep_name);
                                    $parts = explode(" - Depto ", $new_dep_name);
                                    if (count($parts) > 1) {
                                        $piso_unidad = substr($parts[1], strlen($old_label));
                                        $new_code = $label . $piso_unidad;
                                        $new_dep_name = $parts[0] . " - Depto " . $new_code;
                                    }
                                    
                                    $stmtUpdDep = $pdo->prepare("UPDATE propiedades SET identificador = ? WHERE id = ?");
                                    $stmtUpdDep->execute([$new_dep_name, $dep['id']]);
                                }
                            }
                        }
                    }
                }
                
                $pdo->commit();
                sendResponse(true, 'Perfil del condominio actualizado con éxito.');
            } catch (Exception $ex) {
                $pdo->rollBack();
                sendResponse(false, 'Error al actualizar el perfil del condominio: ' . $ex->getMessage());
            }
            break;

        // 1.8a. Guardar estructura de pisos de una torre
        case 'save_tower_structure':
            if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
                sendResponse(false, 'Método no permitido', [], 405);
            }
            $torre_id = intval($_POST['torre_id'] ?? 0);
            $pisos = intval($_POST['pisos'] ?? 0);
            $locked = intval($_POST['locked'] ?? 0);
            
            if ($torre_id <= 0) {
                sendResponse(false, 'Torre ID inválida.');
            }
            
            // Obtener detalles_config actual
            $stmt = $pdo->query("SELECT detalles_config FROM condominio LIMIT 1");
            $detalles_config_json = $stmt->fetchColumn() ?: '{}';
            $detalles_config = json_decode($detalles_config_json, true) ?: [];
            
            if (!isset($detalles_config['torres_estructura'])) {
                $detalles_config['torres_estructura'] = [];
            }
            
            if (!isset($detalles_config['torres_estructura'][$torre_id])) {
                $detalles_config['torres_estructura'][$torre_id] = [
                    'locked' => false,
                    'pisos' => 0,
                    'pisos_config' => []
                ];
            }
            
            $detalles_config['torres_estructura'][$torre_id]['pisos'] = $pisos;
            $detalles_config['torres_estructura'][$torre_id]['locked'] = ($locked === 1);
            
            // Si redujo el número de pisos y no está bloqueado, recortar pisos_config
            $pisos_config = $detalles_config['torres_estructura'][$torre_id]['pisos_config'] ?? [];
            $new_pisos_config = [];
            for ($p = 1; $p <= $pisos; $p++) {
                $new_pisos_config[(string)$p] = $pisos_config[(string)$p] ?? ['units' => 0, 'locked' => false];
            }
            $detalles_config['torres_estructura'][$torre_id]['pisos_config'] = $new_pisos_config;
            
            $detalles_config_json = json_encode($detalles_config);
            $stmtUpdate = $pdo->prepare("UPDATE condominio SET detalles_config = ?");
            $stmtUpdate->execute([$detalles_config_json]);
            
            sendResponse(true, 'Estructura de la torre actualizada.');
            break;

        // 1.8e. Bloquear/Desbloquear y generar torres del condominio
        case 'lock_condominio_towers':
            if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
                sendResponse(false, 'Método no permitido', [], 405);
            }
            $num_torres = intval($_POST['num_torres'] ?? 0);
            $id_torres_tipo = $_POST['id_torres_tipo'] ?? 'letras';
            $locked = intval($_POST['locked'] ?? 0);
            
            if ($locked === 1 && $num_torres <= 0) {
                sendResponse(false, 'La cantidad de torres debe ser mayor a 0.');
            }
            
            $pdo->beginTransaction();
            try {
                // Obtener detalles_config actual y actualizar el estado
                $stmt = $pdo->query("SELECT detalles_config FROM condominio LIMIT 1");
                $detalles_config_json = $stmt->fetchColumn() ?: '{}';
                $detalles_config = json_decode($detalles_config_json, true) ?: [];
                
                $detalles_config['num_torres'] = $num_torres;
                $detalles_config['id_torres_tipo'] = $id_torres_tipo;
                $detalles_config['torres_locked'] = ($locked === 1);
                
                if ($locked === 0) {
                    $detalles_config['torres_estructura'] = [];
                }
                
                // Eliminar todas las torres y departamentos existentes en la base de datos
                $pdo->exec("DELETE FROM propiedades WHERE tipo IN ('torre', 'departamento')");
                
                // Si se está bloqueando, generar las torres en la base de datos
                if ($locked === 1) {
                    $stmtInsert = $pdo->prepare("INSERT INTO propiedades (tipo, identificador, parent_id, tipo_unidad_id) VALUES ('torre', ?, null, null)");
                    for ($t = 1; $t <= $num_torres; $t++) {
                        $torre_label = ($id_torres_tipo === 'letras') ? chr(64 + $t) : (string)$t;
                        $torre_name = "Torre " . $torre_label;
                        $stmtInsert->execute([$torre_name]);
                    }
                }
                
                // Guardar detalles_config
                $detalles_config_json = json_encode($detalles_config);
                $stmtUpdate = $pdo->prepare("UPDATE condominio SET detalles_config = ?");
                $stmtUpdate->execute([$detalles_config_json]);
                
                $pdo->commit();
                sendResponse(true, $locked === 1 ? 'Torres bloqueadas y creadas en la base de datos.' : 'Torres desbloqueadas y eliminadas.');
            } catch (Exception $ex) {
                $pdo->rollBack();
                sendResponse(false, 'Error al actualizar el estado de las torres: ' . $ex->getMessage());
            }
            break;

        // 1.8b. Bloquear/Desbloquear y generar unidades de un piso
        case 'lock_floor_units':
            if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
                sendResponse(false, 'Método no permitido', [], 405);
            }
            $torre_id = intval($_POST['torre_id'] ?? 0);
            $piso = intval($_POST['piso'] ?? 0);
            $units = intval($_POST['units'] ?? 0);
            $locked = intval($_POST['locked'] ?? 0);
            
            if ($torre_id <= 0 || $piso <= 0) {
                sendResponse(false, 'Parámetros inválidos.');
            }
            
            $pdo->beginTransaction();
            try {
                // Obtener detalles_config actual y actualizar el estado
                $stmt = $pdo->query("SELECT detalles_config FROM condominio LIMIT 1");
                $detalles_config_json = $stmt->fetchColumn() ?: '{}';
                $detalles_config = json_decode($detalles_config_json, true) ?: [];
                
                if (!isset($detalles_config['torres_estructura'])) {
                    $detalles_config['torres_estructura'] = [];
                }
                if (!isset($detalles_config['torres_estructura'][$torre_id])) {
                    $detalles_config['torres_estructura'][$torre_id] = [
                        'locked' => true,
                        'pisos' => $piso,
                        'pisos_config' => []
                    ];
                }
                
                $detalles_config['torres_estructura'][$torre_id]['pisos_config'][(string)$piso] = [
                    'units' => $units,
                    'locked' => ($locked === 1)
                ];
                
                // Obtener la etiqueta/nombre de la torre
                $stmtTorre = $pdo->prepare("SELECT identificador FROM propiedades WHERE id = ? AND tipo = 'torre'");
                $stmtTorre->execute([$torre_id]);
                $torre_name = $stmtTorre->fetchColumn();
                if (!$torre_name) {
                    throw new Exception("Torre no encontrada.");
                }
                
                $torre_label = str_replace("Torre ", "", $torre_name);
                
                // Eliminar unidades existentes para este piso en esta torre
                $stmtGetExisting = $pdo->prepare("SELECT id FROM propiedades WHERE parent_id = ? AND tipo = 'departamento' AND piso = ?");
                $stmtGetExisting->execute([$torre_id, $piso]);
                $existing_ids = $stmtGetExisting->fetchAll(PDO::FETCH_COLUMN) ?: [];
                if (count($existing_ids) > 0) {
                    $inQuery = implode(',', array_fill(0, count($existing_ids), '?'));
                    $stmtDelete = $pdo->prepare("DELETE FROM propiedades WHERE id IN ($inQuery)");
                    $stmtDelete->execute($existing_ids);
                }
                
                // Si se está bloqueando, generar las unidades
                if ($locked === 1 && $units > 0) {
                    $stmtFirstType = $pdo->query("SELECT id FROM tipos_unidades ORDER BY id ASC LIMIT 1");
                    $default_tipo_unidad_id = $stmtFirstType->fetchColumn() ?: null;
                    
                    $stmtInsert = $pdo->prepare("INSERT INTO propiedades (tipo, identificador, parent_id, tipo_unidad_id, piso) VALUES ('departamento', ?, ?, ?, ?)");
                    for ($u = 1; $u <= $units; $u++) {
                        $depto_num = $torre_label . $piso . $u;
                        $identificador = $torre_name . " - Depto " . $depto_num;
                        $stmtInsert->execute([$identificador, $torre_id, $default_tipo_unidad_id, $piso]);
                    }
                }
                
                // Guardar detalles_config
                $detalles_config_json = json_encode($detalles_config);
                $stmtUpdate = $pdo->prepare("UPDATE condominio SET detalles_config = ?");
                $stmtUpdate->execute([$detalles_config_json]);
                
                $pdo->commit();
                sendResponse(true, 'Estado del piso actualizado correctamente.');
            } catch (Exception $ex) {
                $pdo->rollBack();
                sendResponse(false, 'Error al actualizar el estado del piso: ' . $ex->getMessage());
            }
            break;

        // 1.8c. Copiar estructura completa de una torre a otra
        case 'copy_tower_structure':
            if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
                sendResponse(false, 'Método no permitido', [], 405);
            }
            $from_torre_id = intval($_POST['from_torre_id'] ?? 0);
            $to_torre_id = intval($_POST['to_torre_id'] ?? 0);
            
            if ($from_torre_id <= 0 || $to_torre_id <= 0 || $from_torre_id === $to_torre_id) {
                sendResponse(false, 'IDs de torres inválidas.');
            }
            
            $pdo->beginTransaction();
            try {
                // Obtener detalles_config actual
                $stmt = $pdo->query("SELECT detalles_config FROM condominio LIMIT 1");
                $detalles_config_json = $stmt->fetchColumn() ?: '{}';
                $detalles_config = json_decode($detalles_config_json, true) ?: [];
                
                $estructura = $detalles_config['torres_estructura'] ?? [];
                if (!isset($estructura[$from_torre_id])) {
                    throw new Exception("La torre de origen no tiene una estructura configurada.");
                }
                
                $source_struct = $estructura[$from_torre_id];
                
                // Obtener nombres de las torres
                $stmtTorre = $pdo->prepare("SELECT identificador FROM propiedades WHERE id = ? AND tipo = 'torre'");
                
                $stmtTorre->execute([$from_torre_id]);
                $from_name = $stmtTorre->fetchColumn();
                
                $stmtTorre->execute([$to_torre_id]);
                $to_name = $stmtTorre->fetchColumn();
                
                if (!$from_name || !$to_name) {
                    throw new Exception("Torres no encontradas.");
                }
                
                $to_label = str_replace("Torre ", "", $to_name);
                
                // Eliminar todos los departamentos de la torre de destino
                $stmtDeleteDest = $pdo->prepare("DELETE FROM propiedades WHERE parent_id = ? AND tipo = 'departamento'");
                $stmtDeleteDest->execute([$to_torre_id]);
                
                // Copiar estructura en detalles_config
                $detalles_config['torres_estructura'][$to_torre_id] = $source_struct;
                
                // Generar los departamentos en la torre de destino para los pisos bloqueados
                $stmtFirstType = $pdo->query("SELECT id FROM tipos_unidades ORDER BY id ASC LIMIT 1");
                $default_tipo_unidad_id = $stmtFirstType->fetchColumn() ?: null;
                
                $stmtInsert = $pdo->prepare("INSERT INTO propiedades (tipo, identificador, parent_id, tipo_unidad_id, piso) VALUES ('departamento', ?, ?, ?, ?)");
                
                $pisos_config = $source_struct['pisos_config'] ?? [];
                foreach ($pisos_config as $piso_str => $floorEst) {
                    $piso = intval($piso_str);
                    if ($floorEst['locked'] && $floorEst['units'] > 0) {
                        for ($u = 1; $u <= $floorEst['units']; $u++) {
                            $depto_num = $to_label . $piso . $u;
                            $identificador = $to_name . " - Depto " . $depto_num;
                            $stmtInsert->execute([$identificador, $to_torre_id, $default_tipo_unidad_id, $piso]);
                        }
                    }
                }
                
                // Guardar detalles_config
                $detalles_config_json = json_encode($detalles_config);
                $stmtUpdate = $pdo->prepare("UPDATE condominio SET detalles_config = ?");
                $stmtUpdate->execute([$detalles_config_json]);
                
                $pdo->commit();
                sendResponse(true, 'Estructura copiada con éxito de ' . $from_name . ' a ' . $to_name . '.');
            } catch (Exception $ex) {
                $pdo->rollBack();
                sendResponse(false, 'Error al copiar la estructura: ' . $ex->getMessage());
            }
            break;

        // 1.8d. Copiar estructura de un piso a otra torre (o a todos los pisos de ella)
        case 'copy_floor_structure':
            if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
                sendResponse(false, 'Método no permitido', [], 405);
            }
            $from_torre_id = intval($_POST['from_torre_id'] ?? 0);
            $from_piso = intval($_POST['from_piso'] ?? 0);
            $to_torre_id = intval($_POST['to_torre_id'] ?? 0);
            $target_scope = $_POST['target_scope'] ?? 'same_floor'; // 'same_floor' o 'all_floors'
            
            if ($from_torre_id <= 0 || $from_piso <= 0 || $to_torre_id <= 0) {
                sendResponse(false, 'Parámetros de origen/destino inválidos.');
            }
            
            $pdo->beginTransaction();
            try {
                // Obtener detalles_config actual
                $stmt = $pdo->query("SELECT detalles_config FROM condominio LIMIT 1");
                $detalles_config_json = $stmt->fetchColumn() ?: '{}';
                $detalles_config = json_decode($detalles_config_json, true) ?: [];
                
                $estructura = $detalles_config['torres_estructura'] ?? [];
                if (!isset($estructura[$from_torre_id]) || !isset($estructura[$from_torre_id]['pisos_config'][(string)$from_piso])) {
                    throw new Exception("La configuración del piso de origen no existe.");
                }
                
                $source_floor_config = $estructura[$from_torre_id]['pisos_config'][(string)$from_piso];
                
                if (!isset($detalles_config['torres_estructura'][$to_torre_id])) {
                    $detalles_config['torres_estructura'][$to_torre_id] = [
                        'locked' => false,
                        'pisos' => $from_piso,
                        'pisos_config' => []
                    ];
                }
                
                $dest_torre_pisos = $detalles_config['torres_estructura'][$to_torre_id]['pisos'] ?? 0;
                
                // Obtener nombres de las torres
                $stmtTorre = $pdo->prepare("SELECT identificador FROM propiedades WHERE id = ? AND tipo = 'torre'");
                $stmtTorre->execute([$to_torre_id]);
                $to_name = $stmtTorre->fetchColumn();
                if (!$to_name) {
                    throw new Exception("Torre destino no encontrada.");
                }
                $to_label = str_replace("Torre ", "", $to_name);
                
                $floors_to_update = [];
                if ($target_scope === 'all_floors') {
                    for ($p = 1; $p <= $dest_torre_pisos; $p++) {
                        $floors_to_update[] = $p;
                    }
                } else {
                    $floors_to_update[] = $from_piso;
                }
                
                $stmtFirstType = $pdo->query("SELECT id FROM tipos_unidades ORDER BY id ASC LIMIT 1");
                $default_tipo_unidad_id = $stmtFirstType->fetchColumn() ?: null;
                
                $stmtInsert = $pdo->prepare("INSERT INTO propiedades (tipo, identificador, parent_id, tipo_unidad_id, piso) VALUES ('departamento', ?, ?, ?, ?)");
                
                foreach ($floors_to_update as $piso) {
                    // Actualizar detalles_config
                    $detalles_config['torres_estructura'][$to_torre_id]['pisos_config'][(string)$piso] = $source_floor_config;
                    
                    // Eliminar departamentos existentes en este piso
                    $stmtGetExisting = $pdo->prepare("SELECT id FROM propiedades WHERE parent_id = ? AND tipo = 'departamento' AND piso = ?");
                    $stmtGetExisting->execute([$to_torre_id, $piso]);
                    $existing_ids = $stmtGetExisting->fetchAll(PDO::FETCH_COLUMN) ?: [];
                    if (count($existing_ids) > 0) {
                        $inQuery = implode(',', array_fill(0, count($existing_ids), '?'));
                        $stmtDelete = $pdo->prepare("DELETE FROM propiedades WHERE id IN ($inQuery)");
                        $stmtDelete->execute($existing_ids);
                    }
                    
                    // Si el origen estaba bloqueado, regenerar en el destino
                    if ($source_floor_config['locked'] && $source_floor_config['units'] > 0) {
                        for ($u = 1; $u <= $source_floor_config['units']; $u++) {
                            $depto_num = $to_label . $piso . $u;
                            $identificador = $to_name . " - Depto " . $depto_num;
                            $stmtInsert->execute([$identificador, $to_torre_id, $default_tipo_unidad_id, $piso]);
                        }
                    }
                }
                
                // Guardar detalles_config
                $detalles_config_json = json_encode($detalles_config);
                $stmtUpdate = $pdo->prepare("UPDATE condominio SET detalles_config = ?");
                $stmtUpdate->execute([$detalles_config_json]);
                
                $pdo->commit();
                sendResponse(true, 'Distribución de piso copiada con éxito.');
            } catch (Exception $ex) {
                $pdo->rollBack();
                sendResponse(false, 'Error al copiar la distribución del piso: ' . $ex->getMessage());
            }
            break;

        // 1.9. Obtener perfil del administrador
        case 'get_administrador_profile':
            $stmt = $pdo->query("SELECT * FROM administrador LIMIT 1");
            $admin = $stmt->fetch() ?: [
                'nombre' => '',
                'empresa_nombre' => '',
                'rut' => '',
                'rnac' => '',
                'telefono' => '',
                'telefono_empresa' => '',
                'email' => '',
                'email_empresa' => '',
                'website' => '',
                'website_empresa' => '',
                'avatar_path' => ''
            ];
            sendResponse(true, '', ['administrador' => $admin]);
            break;

        // 1.10. Actualizar perfil del administrador
        case 'update_administrador_profile':
            if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
                sendResponse(false, 'Método no permitido', [], 405);
            }
            
            $nombre = trim($_POST['nombre'] ?? '');
            $empresa_nombre = trim($_POST['empresa_nombre'] ?? '');
            $rut = trim($_POST['rut'] ?? '');
            $rnac = trim($_POST['rnac'] ?? '');
            $telefono = trim($_POST['telefono'] ?? '');
            $telefono_empresa = trim($_POST['telefono_empresa'] ?? '');
            $email = trim($_POST['email'] ?? '');
            $email_empresa = trim($_POST['email_empresa'] ?? '');
            $website = trim($_POST['website'] ?? '');
            $website_empresa = trim($_POST['website_empresa'] ?? '');
            
            if (empty($nombre) || empty($rut)) {
                sendResponse(false, 'El nombre y el RUT del administrador son obligatorios.');
            }
            
            try {
                $pdo->beginTransaction();
                $stmt = $pdo->query("SELECT id FROM administrador LIMIT 1");
                $admin_id = $stmt->fetchColumn();
                if ($admin_id) {
                    $stmtUpdate = $pdo->prepare("UPDATE administrador SET nombre = ?, empresa_nombre = ?, rut = ?, rnac = ?, telefono = ?, telefono_empresa = ?, email = ?, email_empresa = ?, website = ?, website_empresa = ? WHERE id = ?");
                    $stmtUpdate->execute([$nombre, $empresa_nombre, $rut, $rnac, $telefono, $telefono_empresa, $email, $email_empresa, $website, $website_empresa, $admin_id]);
                } else {
                    $stmtInsert = $pdo->prepare("INSERT INTO administrador (nombre, empresa_nombre, rut, rnac, telefono, telefono_empresa, email, email_empresa, website, website_empresa) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
                    $stmtInsert->execute([$nombre, $empresa_nombre, $rut, $rnac, $telefono, $telefono_empresa, $email, $email_empresa, $website, $website_empresa]);
                }

                // Sincronizar con datos del condominio local
                $stmtUpdateCondo = $pdo->prepare("UPDATE condominio SET administrador = ?, email = ?, telefono = ?, sitio_web = ? WHERE id = (SELECT id FROM condominio LIMIT 1)");
                $stmtUpdateCondo->execute([$nombre, $email, $telefono, $website]);

                // Sincronizar con datos del condominio global
                global $pdo_global, $active_condominio_id;
                if (isset($pdo_global)) {
                    $stmtGlobalUpdateCondo = $pdo_global->prepare("UPDATE condominio SET administrador = ?, email = ?, telefono = ?, sitio_web = ? WHERE id = ?");
                    $stmtGlobalUpdateCondo->execute([$nombre, $email, $telefono, $website, $active_condominio_id]);
                }

                $pdo->commit();
                sendResponse(true, 'Perfil del administrador guardado y sincronizado con éxito.');
            } catch (Exception $ex) {
                if ($pdo->inTransaction()) {
                    $pdo->rollBack();
                }
                sendResponse(false, 'Error al guardar el perfil del administrador: ' . $ex->getMessage());
            }
            break;

        // 1.11. Subir avatar del administrador
        case 'upload_avatar':
            if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
                sendResponse(false, 'Método no permitido', [], 405);
            }
            
            if (!isset($_FILES['avatar']) || $_FILES['avatar']['error'] !== UPLOAD_ERR_OK) {
                sendResponse(false, 'Debe proporcionar una imagen válida.');
            }
            
            $fileTmpPath = $_FILES['avatar']['tmp_name'];
            $fileName = $_FILES['avatar']['name'];
            $fileNameCmps = explode(".", $fileName);
            $fileExtension = strtolower(end($fileNameCmps));
            
            $newFileName = 'avatar_' . time() . '_' . md5(uniqid()) . '.' . $fileExtension;
            $allowedExtensions = ['jpg', 'jpeg', 'png', 'gif'];
            
            if (!in_array($fileExtension, $allowedExtensions)) {
                sendResponse(false, 'Formato de imagen no permitido. Use JPG, PNG o GIF.');
            }
            
            if (!is_dir(UPLOAD_DIR)) {
                mkdir(UPLOAD_DIR, 0755, true);
            }
            
            $dest_path = UPLOAD_DIR . $newFileName;
            if (move_uploaded_file($fileTmpPath, $dest_path)) {
                $avatar_path = 'uploads/' . $newFileName;
                
                $stmt = $pdo->query("SELECT id FROM administrador LIMIT 1");
                $admin_id = $stmt->fetchColumn();
                
                if ($admin_id) {
                    // Borrar avatar viejo si existe
                    $stmtOld = $pdo->prepare("SELECT avatar_path FROM administrador WHERE id = ?");
                    $stmtOld->execute([$admin_id]);
                    $old_avatar = $stmtOld->fetchColumn();
                    if ($old_avatar && file_exists(__DIR__ . '/' . $old_avatar)) {
                        unlink(__DIR__ . '/' . $old_avatar);
                    }
                    
                    $stmtUpdate = $pdo->prepare("UPDATE administrador SET avatar_path = ? WHERE id = ?");
                    $stmtUpdate->execute([$avatar_path, $admin_id]);
                } else {
                    $stmtInsert = $pdo->prepare("INSERT INTO administrador (nombre, rut, avatar_path) VALUES (?, ?, ?)");
                    $stmtInsert->execute(['Administrador', '1-9', $avatar_path]);
                }
                
                sendResponse(true, 'Imagen de perfil actualizada con éxito.', ['avatar_path' => $avatar_path]);
            } else {
                sendResponse(false, 'Error al guardar la imagen en el servidor.');
            }
            break;

        // 2. Obtener categorías con sus subcategorías asociadas
        case 'get_categories_with_sub':
            $stmt = $pdo->query("SELECT * FROM categorias ORDER BY nombre ASC");
            $categorias = $stmt->fetchAll();
            
            $stmtSub = $pdo->prepare("SELECT * FROM subcategorias WHERE categoria_id = ? ORDER BY nombre ASC");
            
            foreach ($categorias as &$cat) {
                $stmtSub->execute([$cat['id']]);
                $cat['subcategorias'] = $stmtSub->fetchAll();
            }
            
            sendResponse(true, '', ['categorias' => $categorias]);
            break;

        case 'setup_default_categories_redvecino':
            if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
                sendResponse(false, 'Método no permitido', [], 405);
            }

            try {
                $pdo->beginTransaction();

                // Verificar si hay egresos ya registrados
                $checkEgresos = $pdo->query("SELECT COUNT(*) FROM egresos")->fetchColumn();
                if ($checkEgresos > 0) {
                    sendResponse(false, 'No se puede sobreescribir la estructura porque ya existen egresos registrados en el sistema.');
                }

                // Eliminar subcategorías y categorías actuales para evitar duplicados
                $pdo->exec("DELETE FROM subcategorias");
                $pdo->exec("DELETE FROM categorias");

                $estructura = [
                    '1 - Remuneraciones / Administración y Personal' => [
                        '1.1 - Sueldos',
                        '1.2 - Cotizaciones / Leyes sociales',
                        '1.3 - Seguridad',
                        '1.4 - Mantenimiento',
                        '1.5 - Honorarios'
                    ],
                    '2 - Servicios Básicos / Areas comunes' => [
                        '2.1 - Agua',
                        '2.2 - Luz',
                        '2.3 - Gas'
                    ],
                    '3 - Mantenciones / Reparaciones / Seguros' => [
                        '3.1 - Asensores',
                        '3.2 - Portones',
                        '3.3 - Piscinas',
                        '3.4 - Bombas de Agua',
                        '3.5 - Seguros',
                        '3.6 - Insumos Varios',
                        '3.7 - Certificaciones'
                    ],
                    '4 - Fondos / Multas' => [
                        '4.1 - Fondo común de reserva',
                        '4.2 - Arriendos',
                        '4.3 - Multas',
                        '4.4 - Intereses'
                    ]
                ];

                $stmtCat = $pdo->prepare("INSERT INTO categorias (nombre, descripcion) VALUES (?, ?)");
                $stmtSub = $pdo->prepare("INSERT INTO subcategorias (categoria_id, nombre) VALUES (?, ?)");

                foreach ($estructura as $catNombre => $subs) {
                    $stmtCat->execute([$catNombre, 'Estructura oficial de cobro']);
                    $catId = $pdo->lastInsertId();
                    foreach ($subs as $subNombre) {
                        $stmtSub->execute([$catId, $subNombre]);
                    }
                }

                $pdo->commit();
                sendResponse(true, 'Estructura oficial de RedVecino cargada con éxito.');
            } catch (Exception $e) {
                if ($pdo->inTransaction()) {
                    $pdo->rollBack();
                }
                sendResponse(false, 'Error al configurar la estructura: ' . $e->getMessage());
            }
            break;

        // 3. Crear Categoría Principal
        case 'add_category':
            if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
                sendResponse(false, 'Método no permitido', [], 405);
            }
            
            $nombre = trim($_POST['nombre'] ?? '');
            $descripcion = trim($_POST['descripcion'] ?? '');
            
            if (empty($nombre)) {
                sendResponse(false, 'El nombre de la categoría es requerido.');
            }
            
            // Verificar si ya existe
            $check = $pdo->prepare("SELECT COUNT(*) FROM categorias WHERE nombre = ?");
            $check->execute([$nombre]);
            if ($check->fetchColumn() > 0) {
                sendResponse(false, 'Ya existe una categoría con este nombre.');
            }
            
            $stmt = $pdo->prepare("INSERT INTO categorias (nombre, descripcion) VALUES (?, ?)");
            $stmt->execute([$nombre, $descripcion]);
            
            sendResponse(true, 'Categoría creada con éxito', ['id' => $pdo->lastInsertId()]);
            break;

        // 3.5. Editar Categoría Principal
        case 'update_category':
            if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
                sendResponse(false, 'Método no permitido', [], 405);
            }
            
            $id = intval($_POST['id'] ?? 0);
            $nombre = trim($_POST['nombre'] ?? '');
            $descripcion = trim($_POST['descripcion'] ?? '');
            
            if ($id <= 0 || empty($nombre)) {
                sendResponse(false, 'ID y nombre de categoría son requeridos.');
            }
            
            // Verificar si ya existe otra categoría con este nombre
            $check = $pdo->prepare("SELECT COUNT(*) FROM categorias WHERE nombre = ? AND id != ?");
            $check->execute([$nombre, $id]);
            if ($check->fetchColumn() > 0) {
                sendResponse(false, 'Ya existe otra categoría con este nombre.');
            }
            
            $stmt = $pdo->prepare("UPDATE categorias SET nombre = ?, descripcion = ? WHERE id = ?");
            $stmt->execute([$nombre, $descripcion, $id]);
            
            sendResponse(true, 'Categoría actualizada con éxito.');
            break;

        // 4. Crear Subcategoría
        case 'add_subcategory':
            if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
                sendResponse(false, 'Método no permitido', [], 405);
            }
            
            $categoria_id = intval($_POST['categoria_id'] ?? 0);
            $nombre = trim($_POST['nombre'] ?? '');
            
            if ($categoria_id <= 0 || empty($nombre)) {
                sendResponse(false, 'Categoría y nombre de subcategoría son requeridos.');
            }
            
            // Verificar si la categoría existe
            $checkCat = $pdo->prepare("SELECT COUNT(*) FROM categorias WHERE id = ?");
            $checkCat->execute([$categoria_id]);
            if ($checkCat->fetchColumn() == 0) {
                sendResponse(false, 'La categoría seleccionada no existe.');
            }
            
            // Verificar si ya existe la subcategoría en esa categoría
            $check = $pdo->prepare("SELECT COUNT(*) FROM subcategorias WHERE categoria_id = ? AND nombre = ?");
            $check->execute([$categoria_id, $nombre]);
            if ($check->fetchColumn() > 0) {
                sendResponse(false, 'Esta subcategoría ya existe en la categoría seleccionada.');
            }
            
            $stmt = $pdo->prepare("INSERT INTO subcategorias (categoria_id, nombre) VALUES (?, ?)");
            $stmt->execute([$categoria_id, $nombre]);
            
            sendResponse(true, 'Subcategoría creada con éxito', ['id' => $pdo->lastInsertId()]);
            break;

        // 4.5. Editar Subcategoría
        case 'update_subcategory':
            if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
                sendResponse(false, 'Método no permitido', [], 405);
            }
            
            $id = intval($_POST['id'] ?? 0);
            $categoria_id = intval($_POST['categoria_id'] ?? 0);
            $nombre = trim($_POST['nombre'] ?? '');
            
            if ($id <= 0 || $categoria_id <= 0 || empty($nombre)) {
                sendResponse(false, 'ID, Categoría y nombre de subcategoría son requeridos.');
            }
            
            // Verificar si la categoría existe
            $checkCat = $pdo->prepare("SELECT COUNT(*) FROM categorias WHERE id = ?");
            $checkCat->execute([$categoria_id]);
            if ($checkCat->fetchColumn() == 0) {
                sendResponse(false, 'La categoría seleccionada no existe.');
            }
            
            // Verificar si ya existe otra subcategoría con este nombre en esta categoría
            $check = $pdo->prepare("SELECT COUNT(*) FROM subcategorias WHERE categoria_id = ? AND nombre = ? AND id != ?");
            $check->execute([$categoria_id, $nombre, $id]);
            if ($check->fetchColumn() > 0) {
                sendResponse(false, 'Esta subcategoría ya existe en la categoría seleccionada.');
            }
            
            $stmt = $pdo->prepare("UPDATE subcategorias SET categoria_id = ?, nombre = ? WHERE id = ?");
            $stmt->execute([$categoria_id, $nombre, $id]);
            
            sendResponse(true, 'Subcategoría actualizada con éxito.');
            break;

        // 5. Registrar un Nuevo Egreso (con campos requeridos y opcionales + comprobante)
        case 'add_egreso':
            if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
                sendResponse(false, 'Método no permitido', [], 405);
            }
            
            $fecha = $_POST['fecha'] ?? '';
            $subcategoria_id = intval($_POST['subcategoria_id'] ?? 0);
            $descripcion = trim($_POST['descripcion'] ?? '');
            $monto = floatval($_POST['monto'] ?? 0);
            $observaciones = trim($_POST['observaciones'] ?? '');
            $referencia_cotizacion = trim($_POST['referencia_cotizacion'] ?? '');
            $dividir_meses = intval($_POST['dividir_meses'] ?? 1);
            $tiene_documento = intval($_POST['tiene_documento'] ?? 0);
            
            $tipo_gasto = trim($_POST['tipo_gasto'] ?? 'comun');
            $propiedad_id = !empty($_POST['propiedad_id']) ? intval($_POST['propiedad_id']) : null;
            
            // Validaciones básicas
            if (empty($fecha)) {
                sendResponse(false, 'La fecha es obligatoria.');
            }
            if ($subcategoria_id <= 0) {
                sendResponse(false, 'Debe seleccionar una categoría y subcategoría válidas.');
            }
            if (empty($descripcion)) {
                sendResponse(false, 'La descripción es obligatoria.');
            }
            if ($monto <= 0) {
                sendResponse(false, 'El monto debe ser mayor a cero.');
            }
            if ($dividir_meses < 1) {
                $dividir_meses = 1;
            }
            if ($tipo_gasto !== 'comun' && $tipo_gasto !== 'especifico') {
                $tipo_gasto = 'comun';
            }
            
            // Procesamiento de archivo si tiene_documento es 1
            $documento_ruta = null;
            if ($tiene_documento === 1 && isset($_FILES['documento']) && $_FILES['documento']['error'] === UPLOAD_ERR_OK) {
                $fileTmpPath = $_FILES['documento']['tmp_name'];
                $fileName = $_FILES['documento']['name'];
                $fileSize = $_FILES['documento']['size'];
                $fileType = $_FILES['documento']['type'];
                
                $fileNameCmps = explode(".", $fileName);
                $fileExtension = strtolower(end($fileNameCmps));
                
                // Sanitizar nombre de archivo y hacerlo único
                $newFileName = 'comprobante_' . time() . '_' . md5(uniqid()) . '.' . $fileExtension;
                
                $allowedExtensions = ['jpg', 'jpeg', 'png', 'pdf', 'doc', 'docx', 'xls', 'xlsx'];
                if (in_array($fileExtension, $allowedExtensions)) {
                    $dest_path = UPLOAD_DIR . $newFileName;
                    if (move_uploaded_file($fileTmpPath, $dest_path)) {
                        $documento_ruta = 'uploads/' . $newFileName;
                    } else {
                        sendResponse(false, 'Error al mover el archivo de comprobante cargado.');
                    }
                } else {
                    sendResponse(false, 'Extensión de archivo no permitida. Formatos válidos: ' . implode(', ', $allowedExtensions));
                }
            } elseif ($tiene_documento === 1) {
                sendResponse(false, 'Indicó que tiene un documento adjunto pero no se subió ningún archivo o hubo un error al procesarlo.');
            }
            
            // Insertar egreso en la base de datos
            $sql = "INSERT INTO egresos (fecha, subcategoria_id, descripcion, monto, observaciones, referencia_cotizacion, dividir_meses, tiene_documento, documento_ruta, tipo_gasto, propiedad_id) 
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
            $stmt = $pdo->prepare($sql);
            $stmt->execute([
                $fecha,
                $subcategoria_id,
                $descripcion,
                $monto,
                $observaciones,
                $referencia_cotizacion,
                $dividir_meses,
                $tiene_documento,
                $documento_ruta,
                $tipo_gasto,
                $propiedad_id
            ]);
            
            sendResponse(true, 'Egreso registrado correctamente', ['id' => $pdo->lastInsertId()]);
            break;

        // 6. Obtener listado de egresos con filtros
        case 'get_egresos':
            $categoria_id = intval($_GET['categoria_id'] ?? 0);
            $subcategoria_id = intval($_GET['subcategoria_id'] ?? 0);
            $fecha_inicio = $_GET['fecha_inicio'] ?? '';
            $fecha_fin = $_GET['fecha_fin'] ?? '';
            $search = trim($_GET['search'] ?? '');
            
            $sql = "SELECT e.*, s.nombre as subcategoria_nombre, c.nombre as categoria_nombre, c.id as categoria_id,
                           p.tipo as propiedad_tipo, p.identificador as propiedad_identificador
                    FROM egresos e
                    JOIN subcategorias s ON e.subcategoria_id = s.id
                    JOIN categorias c ON s.categoria_id = c.id
                    LEFT JOIN propiedades p ON e.propiedad_id = p.id
                    WHERE e.condominio_id = ?";
            
            $params = [$active_condominio_id];
            
            if ($categoria_id > 0) {
                $sql .= " AND c.id = ?";
                $params[] = $categoria_id;
            }
            if ($subcategoria_id > 0) {
                $sql .= " AND e.subcategoria_id = ?";
                $params[] = $subcategoria_id;
            }
            if (!empty($fecha_inicio)) {
                $sql .= " AND e.fecha >= ?";
                $params[] = $fecha_inicio;
            }
            if (!empty($fecha_fin)) {
                $sql .= " AND e.fecha <= ?";
                $params[] = $fecha_fin;
            }
            if (!empty($search)) {
                $sql .= " AND (e.descripcion LIKE ? OR e.observaciones LIKE ? OR e.referencia_cotizacion LIKE ?)";
                $params[] = "%{$search}%";
                $params[] = "%{$search}%";
                $params[] = "%{$search}%";
            }
            
            $sql .= " ORDER BY e.fecha DESC, e.id DESC";
            
            $stmt = $pdo->prepare($sql);
            $stmt->execute($params);
            $egresos = $stmt->fetchAll();
            
            sendResponse(true, '', ['egresos' => $egresos]);
            break;

        // 7. Eliminar un Egreso
        case 'delete_egreso':
            if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
                sendResponse(false, 'Método no permitido', [], 405);
            }
            
            $id = intval($_POST['id'] ?? 0);
            if ($id <= 0) {
                sendResponse(false, 'ID de egreso inválido.');
            }
            
            // Primero, buscar si tiene archivo adjunto para borrarlo del servidor físico
            $stmt = $pdo->prepare("SELECT documento_ruta FROM egresos WHERE id = ?");
            $stmt->execute([$id]);
            $documento_ruta = $stmt->fetchColumn();
            
            if ($documento_ruta && file_exists(__DIR__ . '/' . $documento_ruta)) {
                unlink(__DIR__ . '/' . $documento_ruta);
            }
            
            $stmtDelete = $pdo->prepare("DELETE FROM egresos WHERE id = ?");
            $stmtDelete->execute([$id]);
            
            sendResponse(true, 'Egreso eliminado correctamente.');
            break;

        // 8. Obtener estadísticas / KPIs para el Dashboard
        case 'get_kpis':
            $currentMonth = date('Y-m');
            $lastMonth = date('Y-m', strtotime('first day of last month'));
            
            // KPI 1: Egresos del mes actual
            $stmt = $pdo->prepare("SELECT SUM(monto) FROM egresos WHERE strftime('%Y-%m', fecha) = ?");
            $stmt->execute([$currentMonth]);
            $totalMesActual = floatval($stmt->fetchColumn() ?: 0);
            
            // KPI 2: Egresos del mes anterior
            $stmt = $pdo->prepare("SELECT SUM(monto) FROM egresos WHERE strftime('%Y-%m', fecha) = ?");
            $stmt->execute([$lastMonth]);
            $totalMesAnterior = floatval($stmt->fetchColumn() ?: 0);
            
            // KPI 3: Total de gastos acumulados divididos
            // (Para saber cuántos egresos están prorrateados en cuotas > 1)
            $stmt = $pdo->query("SELECT COUNT(*) FROM egresos WHERE dividir_meses > 1");
            $egresosProrrateados = intval($stmt->fetchColumn() ?: 0);
            
            // KPI 4: Conteo de Egresos en el Mes
            $stmt = $pdo->prepare("SELECT COUNT(*) FROM egresos WHERE strftime('%Y-%m', fecha) = ?");
            $stmt->execute([$currentMonth]);
            $conteoEgresosMes = intval($stmt->fetchColumn() ?: 0);
            
            // Gráfico 1: Egresos por Categoría Principal (Distribución)
            $sqlCat = "SELECT c.nombre as categoria, SUM(e.monto) as total
                       FROM egresos e
                       JOIN subcategorias s ON e.subcategoria_id = s.id
                       JOIN categorias c ON s.categoria_id = c.id
                       GROUP BY c.id
                       ORDER BY total DESC";
            $distribucionCategorias = $pdo->query($sqlCat)->fetchAll();
            
            // Gráfico 2: Histórico de los últimos 6 meses
            $historicoMeses = [];
            for ($i = 5; $i >= 0; $i--) {
                $monthStr = date('Y-m', strtotime("-$i months"));
                $monthLabel = date('M Y', strtotime("-$i months"));
                
                $stmtH = $pdo->prepare("SELECT SUM(monto) FROM egresos WHERE strftime('%Y-%m', fecha) = ?");
                $stmtH->execute([$monthStr]);
                $montoH = floatval($stmtH->fetchColumn() ?: 0);
                
                $historicoMeses[] = [
                    'mes_key' => $monthStr,
                    'mes_label' => $monthLabel,
                    'total' => $montoH
                ];
            }
            
            sendResponse(true, '', [
                'kpis' => [
                    'total_mes_actual' => $totalMesActual,
                    'total_mes_anterior' => $totalMesAnterior,
                    'egresos_prorrateados' => $egresosProrrateados,
                    'conteo_egresos_mes' => $conteoEgresosMes
                ],
                'graficos' => [
                    'categorias' => $distribucionCategorias,
                    'historico' => $historicoMeses
                ]
            ]);
            break;

        // 7.5. Editar Egreso existente
        case 'update_egreso':
            if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
                sendResponse(false, 'Método no permitido', [], 405);
            }
            
            $id = intval($_POST['id'] ?? 0);
            $fecha = $_POST['fecha'] ?? '';
            $subcategoria_id = intval($_POST['subcategoria_id'] ?? 0);
            $descripcion = trim($_POST['descripcion'] ?? '');
            $monto = floatval($_POST['monto'] ?? 0);
            $observaciones = trim($_POST['observaciones'] ?? '');
            $referencia_cotizacion = trim($_POST['referencia_cotizacion'] ?? '');
            $dividir_meses = intval($_POST['dividir_meses'] ?? 1);
            $tiene_documento = intval($_POST['tiene_documento'] ?? 0);
            
            $tipo_gasto = trim($_POST['tipo_gasto'] ?? 'comun');
            $propiedad_id = !empty($_POST['propiedad_id']) ? intval($_POST['propiedad_id']) : null;
            
            if ($id <= 0) {
                sendResponse(false, 'ID de egreso inválido.');
            }
            if (empty($fecha)) {
                sendResponse(false, 'La fecha es obligatoria.');
            }
            if ($subcategoria_id <= 0) {
                sendResponse(false, 'Debe seleccionar una categoría y subcategoría válidas.');
            }
            if (empty($descripcion)) {
                sendResponse(false, 'La descripción es obligatoria.');
            }
            if ($monto <= 0) {
                sendResponse(false, 'El monto debe ser mayor a cero.');
            }
            if ($dividir_meses < 1) {
                $dividir_meses = 1;
            }
            if ($tipo_gasto !== 'comun' && $tipo_gasto !== 'especifico') {
                $tipo_gasto = 'comun';
            }
            
            // Obtener el estado del egreso actual
            $stmtCurrent = $pdo->prepare("SELECT tiene_documento, documento_ruta FROM egresos WHERE id = ?");
            $stmtCurrent->execute([$id]);
            $currentEgreso = $stmtCurrent->fetch();
            
            if (!$currentEgreso) {
                sendResponse(false, 'El egreso a editar no existe.');
            }
            
            $documento_ruta = $currentEgreso['documento_ruta'];
            
            if ($tiene_documento === 1) {
                // Si subió un nuevo archivo
                if (isset($_FILES['documento']) && $_FILES['documento']['error'] === UPLOAD_ERR_OK) {
                    // Borrar el archivo viejo si existía
                    if ($documento_ruta && file_exists(__DIR__ . '/' . $documento_ruta)) {
                        unlink(__DIR__ . '/' . $documento_ruta);
                    }
                    
                    $fileTmpPath = $_FILES['documento']['tmp_name'];
                    $fileName = $_FILES['documento']['name'];
                    $fileNameCmps = explode(".", $fileName);
                    $fileExtension = strtolower(end($fileNameCmps));
                    
                    $newFileName = 'comprobante_' . time() . '_' . md5(uniqid()) . '.' . $fileExtension;
                    
                    $allowedExtensions = ['jpg', 'jpeg', 'png', 'pdf', 'doc', 'docx', 'xls', 'xlsx'];
                    if (in_array($fileExtension, $allowedExtensions)) {
                        $dest_path = UPLOAD_DIR . $newFileName;
                        if (move_uploaded_file($fileTmpPath, $dest_path)) {
                            $documento_ruta = 'uploads/' . $newFileName;
                        } else {
                            sendResponse(false, 'Error al mover el nuevo archivo de comprobante.');
                        }
                    } else {
                        sendResponse(false, 'Extensión de archivo no permitida.');
                    }
                }
                // Si no subió archivo nuevo pero ya tenía uno de antes, se mantiene $documento_ruta actual.
                // Si no tenía uno de antes y no subió nada ahora, lanzar error
                if (!$documento_ruta) {
                    sendResponse(false, 'Debe adjuntar un archivo de respaldo.');
                }
            } else {
                // Si ya no tiene documento, borrar el archivo anterior si existía
                if ($documento_ruta && file_exists(__DIR__ . '/' . $documento_ruta)) {
                    unlink(__DIR__ . '/' . $documento_ruta);
                }
                $documento_ruta = null;
            }
            
            $sql = "UPDATE egresos SET 
                        fecha = ?, 
                        subcategoria_id = ?, 
                        descripcion = ?, 
                        monto = ?, 
                        observaciones = ?, 
                        referencia_cotizacion = ?, 
                        dividir_meses = ?, 
                        tiene_documento = ?, 
                        documento_ruta = ?,
                        tipo_gasto = ?,
                        propiedad_id = ?
                    WHERE id = ?";
            $stmt = $pdo->prepare($sql);
            $stmt->execute([
                $fecha,
                $subcategoria_id,
                $descripcion,
                $monto,
                $observaciones,
                $referencia_cotizacion,
                $dividir_meses,
                $tiene_documento,
                $documento_ruta,
                $tipo_gasto,
                $propiedad_id,
                $id
            ]);
            
            sendResponse(true, 'Egreso actualizado correctamente.');
        // 7.6. Guardar/Editar Unidad Manual
        case 'save_unidad':
            if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
                sendResponse(false, 'Método no permitido', [], 405);
            }
            $id = intval($_POST['id'] ?? 0);
            $parent_id = !empty($_POST['parent_id']) ? intval($_POST['parent_id']) : null;
            $numero = trim($_POST['numero'] ?? '');
            $tipo_unidad_id = intval($_POST['tipo_unidad_id'] ?? 0);
            
            if (empty($numero)) {
                sendResponse(false, 'El número de la unidad es requerido.');
            }
            if ($tipo_unidad_id <= 0) {
                sendResponse(false, 'El tipo de unidad (alícuota) es requerido.');
            }
            
            // Construir identificador
            if ($parent_id !== null) {
                $stmtTorre = $pdo->prepare("SELECT identificador FROM propiedades WHERE id = ? AND tipo = 'torre'");
                $stmtTorre->execute([$parent_id]);
                $torre_identificador = $stmtTorre->fetchColumn();
                if (!$torre_identificador) {
                    sendResponse(false, 'La torre seleccionada no es válida.');
                }
                $identificador = $torre_identificador . " - Depto " . $numero;
                $tipo = 'departamento';
            } else {
                $identificador = "Casa " . $numero;
                $tipo = 'casa';
            }
            
            if ($id > 0) {
                // Editar
                $stmt = $pdo->prepare("UPDATE propiedades SET parent_id = ?, identificador = ?, tipo_unidad_id = ?, tipo = ? WHERE id = ?");
                $stmt->execute([$parent_id, $identificador, $tipo_unidad_id, $tipo, $id]);
                sendResponse(true, 'Unidad actualizada con éxito.');
            } else {
                // Crear
                $stmt = $pdo->prepare("INSERT INTO propiedades (tipo, identificador, parent_id, tipo_unidad_id) VALUES (?, ?, ?, ?)");
                $stmt->execute([$tipo, $identificador, $parent_id, $tipo_unidad_id]);
                sendResponse(true, 'Unidad creada con éxito.');
            }
            break;
            
        // 7.7. Eliminar Unidad Manual
        case 'delete_unidad':
            if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
                sendResponse(false, 'Método no permitido', [], 405);
            }
            $id = intval($_POST['id'] ?? 0);
            if ($id <= 0) {
                sendResponse(false, 'ID de unidad inválido.');
            }
            
            $stmt = $pdo->prepare("DELETE FROM propiedades WHERE id = ?");
            $stmt->execute([$id]);
            sendResponse(true, 'Unidad eliminada con éxito.');
            break;

        // 7.8. Obtener Ficha de Residentes
        case 'get_resident_ficha':
            $propiedad_id = intval($_GET['propiedad_id'] ?? 0);
            if ($propiedad_id <= 0) {
                sendResponse(false, 'Propiedad ID inválida.');
            }
            
            // Buscar ficha
            $stmtFicha = $pdo->prepare("SELECT * FROM ficha_residentes WHERE propiedad_id = ?");
            $stmtFicha->execute([$propiedad_id]);
            $ficha = $stmtFicha->fetch(PDO::FETCH_ASSOC);
            
            if (!$ficha) {
                sendResponse(true, '', ['ficha' => null, 'integrantes' => []]);
            }
            
            // Buscar integrantes
            $stmtInt = $pdo->prepare("SELECT * FROM integrantes_ficha WHERE ficha_id = ? ORDER BY id ASC");
            $stmtInt->execute([$ficha['id']]);
            $integrantes = $stmtInt->fetchAll(PDO::FETCH_ASSOC);
            
            sendResponse(true, '', ['ficha' => $ficha, 'integrantes' => $integrantes]);
            break;

        // 7.10. Obtener Listado de Propietarios Reporte
        case 'get_propietarios_report':
            $sql = "SELECT 
                        p.id AS propiedad_id,
                        p.identificador AS propiedad_nombre,
                        p.piso AS propiedad_piso,
                        parent.identificador AS torre_nombre,
                        f.estacionamiento,
                        f.observacion AS observaciones_ficha,
                        i.nombres,
                        i.apellidos,
                        i.rut,
                        i.telefono,
                        i.email,
                        i.vive_en_unidad
                    FROM integrantes_ficha i
                    JOIN ficha_residentes f ON i.ficha_id = f.id
                    JOIN propiedades p ON f.propiedad_id = p.id
                    LEFT JOIN propiedades parent ON p.parent_id = parent.id
                    WHERE i.es_propietario = 1
                    ORDER BY 
                        CASE WHEN parent.identificador IS NULL THEN 1 ELSE 0 END, parent.identificador ASC,
                        CASE WHEN p.piso IS NULL THEN 1 ELSE 0 END, p.piso ASC,
                        p.identificador ASC";
            $stmt = $pdo->query($sql);
            $list = $stmt->fetchAll(PDO::FETCH_ASSOC);
            sendResponse(true, '', $list);
            break;

        // 7.11. Buscar Residentes Global
        case 'search_residentes':
            $query = trim($_GET['query'] ?? '');
            if (strlen($query) < 2) {
                sendResponse(true, '', []);
            }
            
            $sql = "SELECT 
                        i.nombres,
                        i.apellidos,
                        i.rut,
                        p.id AS propiedad_id,
                        p.identificador AS propiedad_nombre,
                        f.estacionamiento
                    FROM integrantes_ficha i
                    JOIN ficha_residentes f ON i.ficha_id = f.id
                    JOIN propiedades p ON f.propiedad_id = p.id
                    WHERE i.nombres LIKE ? OR i.apellidos LIKE ?
                    LIMIT 20";
            
            $searchTerm = "%{$query}%";
            $stmt = $pdo->prepare($sql);
            $stmt->execute([$searchTerm, $searchTerm]);
            $results = $stmt->fetchAll(PDO::FETCH_ASSOC);
            sendResponse(true, '', $results);
            break;
            
        // 7.9. Guardar/Actualizar Ficha de Residentes
        case 'save_resident_ficha':
            if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
                sendResponse(false, 'Método no permitido', [], 405);
            }
            
            $propiedad_id = intval($_POST['propiedad_id'] ?? 0);
            $estacionamiento = trim($_POST['estacionamiento'] ?? '');
            $patente = trim($_POST['patente'] ?? '');
            $observacion = trim($_POST['observacion'] ?? '');

            // Validar unicidad del número de estacionamiento si no está vacío
            if (!empty($estacionamiento)) {
                $stmtCheckEst = $pdo->prepare("
                    SELECT p.identificador 
                    FROM ficha_residentes f
                    JOIN propiedades p ON f.propiedad_id = p.id
                    WHERE UPPER(TRIM(f.estacionamiento)) = UPPER(TRIM(?))
                      AND f.propiedad_id != ?
                ");
                $stmtCheckEst->execute([$estacionamiento, $propiedad_id]);
                $dupUnit = $stmtCheckEst->fetchColumn();
                if ($dupUnit) {
                    sendResponse(false, 'El número de estacionamiento "' . $estacionamiento . '" ya está asignado a la unidad: ' . $dupUnit);
                }
            }
            $integrantes_json = $_POST['integrantes'] ?? '[]';
            
            if ($propiedad_id <= 0) {
                sendResponse(false, 'Propiedad ID requerida.');
            }
            
            $integrantes = json_decode($integrantes_json, true) ?: [];
            
            $pdo->beginTransaction();
            try {
                // Verificar si ya existe
                $stmtCheck = $pdo->prepare("SELECT id FROM ficha_residentes WHERE propiedad_id = ?");
                $stmtCheck->execute([$propiedad_id]);
                $ficha_id = $stmtCheck->fetchColumn();
                
                if ($ficha_id) {
                    // Actualizar
                    $stmtUpd = $pdo->prepare("UPDATE ficha_residentes SET estacionamiento = ?, patente = ?, observacion = ? WHERE id = ?");
                    $stmtUpd->execute([$estacionamiento, $patente, $observacion, $ficha_id]);
                } else {
                    // Insertar
                    $stmtIns = $pdo->prepare("INSERT INTO ficha_residentes (propiedad_id, estacionamiento, patente, observacion) VALUES (?, ?, ?, ?)");
                    $stmtIns->execute([$propiedad_id, $estacionamiento, $patente, $observacion]);
                    $ficha_id = $pdo->lastInsertId();
                }
                
                // Limpiar integrantes anteriores
                $stmtDel = $pdo->prepare("DELETE FROM integrantes_ficha WHERE ficha_id = ?");
                $stmtDel->execute([$ficha_id]);
                
                // Insertar nuevos integrantes
                $stmtInsInt = $pdo->prepare("INSERT INTO integrantes_ficha (ficha_id, nombres, apellidos, rut, fecha_nacimiento, telefono, email, tiene_acceso, es_propietario, vive_en_unidad) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
                foreach ($integrantes as $i) {
                    $nombres = trim($i['nombres'] ?? '');
                    $apellidos = trim($i['apellidos'] ?? '');
                    $rut = trim($i['rut'] ?? '');
                    $dob = trim($i['fecha_nacimiento'] ?? '');
                    $telefono = trim($i['telefono'] ?? '');
                    $email = trim($i['email'] ?? '');
                    $tiene_acceso = intval($i['tiene_acceso'] ?? 0);
                    $es_propietario = intval($i['es_propietario'] ?? 0);
                    $vive_en_unidad = intval($i['vive_en_unidad'] ?? 1);
                    
                    if (empty($nombres) || empty($apellidos) || empty($rut) || empty($dob)) {
                        throw new Exception("Todos los integrantes deben tener nombres, apellidos, RUT y fecha de nacimiento completos.");
                    }
                    
                    $stmtInsInt->execute([
                        $ficha_id,
                        $nombres,
                        $apellidos,
                        $rut,
                        $dob,
                        !empty($telefono) ? $telefono : null,
                        !empty($email) ? $email : null,
                        $tiene_acceso,
                        $es_propietario,
                        $vive_en_unidad
                    ]);
                }
                
                $pdo->commit();
                sendResponse(true, 'Ficha de residentes guardada con éxito.');
            } catch (Exception $ex) {
                $pdo->rollBack();
                sendResponse(false, 'Error al guardar la ficha de residentes: ' . $ex->getMessage());
            }
            break;
            
        // ================= GASTOS COMUNES (INGRESOS) =================
        
        // 8.1. Guardar Configuración de Gastos Comunes
        case 'save_gasto_comun_config':
            if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
                sendResponse(false, 'Método no permitido', [], 405);
            }
            $dia = intval($_POST['dia_vencimiento'] ?? 10);
            $interes = floatval($_POST['interes_mora'] ?? 2.00);

            $stmtId = $pdo->query("SELECT id FROM condominio LIMIT 1");
            $condo_id = $stmtId->fetchColumn();
            if (!$condo_id) {
                sendResponse(false, 'Condominio no configurado.');
            }

            $stmt = $pdo->prepare("UPDATE condominio SET gasto_comun_dia_vencimiento = ?, gasto_comun_interes_mora = ? WHERE id = ?");
            $stmt->execute([$dia, $interes, $condo_id]);
            sendResponse(true, 'Configuración de Gastos Comunes guardada con éxito.');
            break;

        // 8.2. Obtener Periodos de Gastos Comunes
        case 'get_gasto_comun_periods':
            $stmt = $pdo->query("SELECT * FROM periodos_gasto_comun ORDER BY mes DESC");
            $periods = $stmt->fetchAll(PDO::FETCH_ASSOC);
            sendResponse(true, '', $periods);
            break;

        // 8.3. Generar Periodo de Gasto Común
        case 'generate_gasto_comun_period':
            if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
                sendResponse(false, 'Método no permitido', [], 405);
            }
            $mes = trim($_POST['mes'] ?? ''); // YYYY-MM
            $fecha_emision = trim($_POST['fecha_emision'] ?? '');
            $fecha_tope = trim($_POST['fecha_tope'] ?? '');

            if (empty($mes) || empty($fecha_emision) || empty($fecha_tope)) {
                sendResponse(false, 'Mes, fecha de emisión y fecha tope son requeridos.');
            }

            // Validar formato mes YYYY-MM
            if (!preg_match('/^\d{4}-\d{2}$/', $mes)) {
                sendResponse(false, 'Formato de mes inválido (debe ser AAAA-MM).');
            }

            // Verificar si el período ya existe
            $stmtCheck = $pdo->prepare("SELECT id FROM periodos_gasto_comun WHERE mes = ?");
            $stmtCheck->execute([$mes]);
            if ($stmtCheck->fetch()) {
                sendResponse(false, "El período de Gasto Común para {$mes} ya ha sido generado.");
            }

            // Obtener configuración de mora
            $stmtCond = $pdo->query("SELECT gasto_comun_interes_mora FROM condominio LIMIT 1");
            $interes_mora = floatval($stmtCond->fetchColumn() ?: 2.00);

            // Obtener todas las unidades (departamento, casa, local_comercial)
            // Necesitamos su ID, parent_id (Torre) y el prorrateo de su tipo de unidad
            $sqlUnits = "
                SELECT p.id, p.parent_id, tu.porcentaje_prorrateo 
                FROM propiedades p
                LEFT JOIN tipos_unidades tu ON p.tipo_unidad_id = tu.id
                WHERE p.tipo IN ('departamento', 'casa', 'local_comercial')
            ";
            $units = $pdo->query($sqlUnits)->fetchAll(PDO::FETCH_ASSOC);

            if (empty($units)) {
                sendResponse(false, 'No existen unidades (departamento, casa, local) registradas para facturar.');
            }

            // Obtener egresos del mes correspondiente
            $stmtEgresos = $pdo->prepare("
                SELECT id, monto, propiedad_id 
                FROM egresos 
                WHERE strftime('%Y-%m', fecha) = ?
            ");
            $stmtEgresos->execute([$mes]);
            $egresos = $stmtEgresos->fetchAll(PDO::FETCH_ASSOC);

            // Dividir egresos en:
            // - Globales: propiedad_id IS NULL
            // - Por propiedad: propiedad_id IS NOT NULL
            $egresos_globales_total = 0;
            $egresos_por_propiedad = []; // propiedad_id => sum(monto)

            foreach ($egresos as $e) {
                $monto = floatval($e['monto']);
                if ($e['propiedad_id'] === null || $e['propiedad_id'] === '') {
                    $egresos_globales_total += $monto;
                } else {
                    $pid = intval($e['propiedad_id']);
                    if (!isset($egresos_por_propiedad[$pid])) {
                        $egresos_por_propiedad[$pid] = 0;
                    }
                    $egresos_por_propiedad[$pid] += $monto;
                }
            }

            $pdo->beginTransaction();
            try {
                // Insertar período
                $stmtPeriod = $pdo->prepare("
                    INSERT INTO periodos_gasto_comun (mes, fecha_emision, fecha_tope, interes_mora, estado)
                    VALUES (?, ?, ?, ?, 'borrador')
                ");
                $stmtPeriod->execute([$mes, $fecha_emision, $fecha_tope, $interes_mora]);
                $periodo_id = $pdo->lastInsertId();

                // Insertar boleta para cada unidad
                $stmtBoleta = $pdo->prepare("
                    INSERT INTO boletas_gasto_comun (periodo_id, propiedad_id, monto_comun, monto_torre, monto_unidad, monto_mora, monto_total, estado)
                    VALUES (?, ?, ?, ?, ?, 0.00, ?, 'pendiente')
                ");

                foreach ($units as $u) {
                    $prorrateo = floatval($u['porcentaje_prorrateo'] ?? 0); // Ya guardado como fracción (ej: 0.02)
                    
                    // Gasto Común Global prorrateado
                    $monto_comun = $egresos_globales_total * $prorrateo;

                    // Gasto de Torre prorrateado (si pertenece a una torre y hay egresos asignados a esa torre)
                    $monto_torre = 0;
                    if ($u['parent_id']) {
                        $parent_id = intval($u['parent_id']);
                        $torre_egresos_sum = floatval($egresos_por_propiedad[$parent_id] ?? 0);
                        $monto_torre = $torre_egresos_sum * $prorrateo;
                    }

                    // Gasto / Multa directa a la unidad (al 100%)
                    $u_id = intval($u['id']);
                    $monto_unidad = floatval($egresos_por_propiedad[$u_id] ?? 0);

                    // Total boleta
                    $monto_total = $monto_comun + $monto_torre + $monto_unidad;

                    $stmtBoleta->execute([
                        $periodo_id,
                        $u['id'],
                        $monto_comun,
                        $monto_torre,
                        $monto_unidad,
                        $monto_total
                    ]);
                }

                $pdo->commit();
                sendResponse(true, "Periodo de gasto común para {$mes} generado y emitido con éxito.");
            } catch (Exception $ex) {
                $pdo->rollBack();
                sendResponse(false, 'Error al generar el periodo de facturación: ' . $ex->getMessage());
            }
            break;

        // 8.4. Obtener Boletas de un Periodo
        case 'get_period_boletas':
            $periodo_id = intval($_GET['periodo_id'] ?? 0);
            if ($periodo_id <= 0) {
                sendResponse(false, 'Periodo ID inválido.');
            }

            // Obtener datos del periodo
            $stmtPeriod = $pdo->prepare("SELECT * FROM periodos_gasto_comun WHERE id = ?");
            $stmtPeriod->execute([$periodo_id]);
            $period = $stmtPeriod->fetch(PDO::FETCH_ASSOC);
            if (!$period) {
                sendResponse(false, 'Periodo no encontrado.');
            }

            // Obtener todas las boletas con la info de la unidad
            $sql = "
                SELECT 
                    b.id, b.propiedad_id, b.monto_comun, b.monto_torre, b.monto_unidad, b.monto_mora, b.monto_total, b.estado, b.fecha_pago,
                    p.identificador AS propiedad_nombre, p.piso AS propiedad_piso,
                    parent.identificador AS torre_nombre,
                    (
                        SELECT i.nombres || ' ' || i.apellidos 
                        FROM integrantes_ficha i 
                        JOIN ficha_residentes f ON i.ficha_id = f.id 
                        WHERE f.propiedad_id = p.id AND i.es_propietario = 1 
                        LIMIT 1
                    ) AS propietario_nombre
                FROM boletas_gasto_comun b
                JOIN propiedades p ON b.propiedad_id = p.id
                LEFT JOIN propiedades parent ON p.parent_id = parent.id
                WHERE b.periodo_id = ?
                ORDER BY 
                    CASE WHEN parent.identificador IS NULL THEN 1 ELSE 0 END, parent.identificador ASC,
                    CASE WHEN p.piso IS NULL THEN 1 ELSE 0 END, p.piso ASC,
                    p.identificador ASC
            ";
            $stmt = $pdo->prepare($sql);
            $stmt->execute([$periodo_id]);
            $boletas = $stmt->fetchAll(PDO::FETCH_ASSOC);

            // Calcular mora dinámica para las que están pendientes y vencidas
            $hoy = date('Y-m-d');
            $fecha_tope = $period['fecha_tope'];
            $interes_pct = floatval($period['interes_mora']);

            foreach ($boletas as &$b) {
                if ($b['estado'] === 'pendiente' && $hoy > $fecha_tope) {
                    // Calcular interés por mora
                    $subtotal = floatval($b['monto_comun']) + floatval($b['monto_torre']) + floatval($b['monto_unidad']);
                    $b['monto_mora'] = round($subtotal * $interes_pct / 100, 2);
                    $b['monto_total'] = $subtotal + $b['monto_mora'];
                    $b['vencido'] = true;
                } else {
                    $b['vencido'] = ($b['estado'] === 'pendiente' && $hoy > $fecha_tope);
                }
            }

            sendResponse(true, '', [
                'periodo' => $period,
                'boletas' => $boletas
            ]);
            break;

        // 8.5. Registrar Pago de Boleta
        case 'pay_boleta':
            if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
                sendResponse(false, 'Método no permitido', [], 405);
            }
            $boleta_id = intval($_POST['boleta_id'] ?? 0);
            if ($boleta_id <= 0) {
                sendResponse(false, 'ID de boleta inválido.');
            }

            // Obtener la boleta y el periodo
            $stmtB = $pdo->prepare("
                SELECT b.*, p.fecha_tope, p.interes_mora 
                FROM boletas_gasto_comun b
                JOIN periodos_gasto_comun p ON b.periodo_id = p.id
                WHERE b.id = ?
            ");
            $stmtB->execute([$boleta_id]);
            $boleta = $stmtB->fetch(PDO::FETCH_ASSOC);

            if (!$boleta) {
                sendResponse(false, 'Boleta no encontrada.');
            }

            if ($boleta['estado'] === 'pagado') {
                sendResponse(false, 'Esta boleta ya está pagada.');
            }

            $hoy = date('Y-m-d');
            $mora = 0.00;
            $subtotal = floatval($boleta['monto_comun']) + floatval($boleta['monto_torre']) + floatval($boleta['monto_unidad']);
            $total = $subtotal;

            if ($hoy > $boleta['fecha_tope']) {
                $mora = round($subtotal * floatval($boleta['interes_mora']) / 100, 2);
                $total = $subtotal + $mora;
            }

            $stmtUpdate = $pdo->prepare("
                UPDATE boletas_gasto_comun 
                SET estado = 'pagado', fecha_pago = ?, monto_mora = ?, monto_total = ?
                WHERE id = ?
            ");
            $stmtUpdate->execute([$hoy, $mora, $total, $boleta_id]);

            sendResponse(true, 'Pago registrado con éxito.');
            break;

        // 8.6. Obtener Detalle de Boleta para Recibo
        case 'get_boleta_detalle':
            $boleta_id = intval($_GET['boleta_id'] ?? 0);
            if ($boleta_id <= 0) {
                sendResponse(false, 'ID de boleta inválido.');
            }

            // Obtener boleta
            $stmtB = $pdo->prepare("SELECT * FROM boletas_gasto_comun WHERE id = ?");
            $stmtB->execute([$boleta_id]);
            $boleta = $stmtB->fetch(PDO::FETCH_ASSOC);

            if (!$boleta) {
                sendResponse(false, 'Boleta no encontrada.');
            }

            // Obtener periodo
            $stmtP = $pdo->prepare("SELECT * FROM periodos_gasto_comun WHERE id = ?");
            $stmtP->execute([$boleta['periodo_id']]);
            $period = $stmtP->fetch(PDO::FETCH_ASSOC);

            // Obtener condominio
            $stmtC = $pdo->query("SELECT * FROM condominio LIMIT 1");
            $condo = $stmtC->fetch(PDO::FETCH_ASSOC);

            // Obtener propiedad y parent
            $stmtProp = $pdo->prepare("
                SELECT p.*, parent.identificador AS torre_nombre, tu.porcentaje_prorrateo, tu.codigo AS tipo_unidad_codigo
                FROM propiedades p
                LEFT JOIN propiedades parent ON p.parent_id = parent.id
                LEFT JOIN tipos_unidades tu ON p.tipo_unidad_id = tu.id
                WHERE p.id = ?
            ");
            $stmtProp->execute([$boleta['propiedad_id']]);
            $prop = $stmtProp->fetch(PDO::FETCH_ASSOC);

            // Obtener propietario
            $stmtOwner = $pdo->prepare("
                SELECT i.nombres || ' ' || i.apellidos AS nombres, i.rut, i.email, i.telefono, i.vive_en_unidad
                FROM integrantes_ficha i
                JOIN ficha_residentes f ON i.ficha_id = f.id
                WHERE f.propiedad_id = ? AND i.es_propietario = 1
                LIMIT 1
            ");
            $stmtOwner->execute([$boleta['propiedad_id']]);
            $owner = $stmtOwner->fetch(PDO::FETCH_ASSOC) ?: [
                'nombres' => 'Sin Propietario Asignado',
                'rut' => '-',
                'email' => '-',
                'telefono' => '-',
                'vive_en_unidad' => 1
            ];

            // Obtener egresos del mes para el desglose
            $stmtEgresos = $pdo->prepare("
                SELECT 
                    e.id, e.fecha, e.monto, e.descripcion, e.tipo_gasto, e.propiedad_id,
                    c.nombre AS categoria_nombre,
                    s.nombre AS subcategoria_nombre
                FROM egresos e
                JOIN subcategorias s ON e.subcategoria_id = s.id
                JOIN categorias c ON s.categoria_id = c.id
                WHERE strftime('%Y-%m', e.fecha) = ?
            ");
            $stmtEgresos->execute([$period['mes']]);
            $egresos = $stmtEgresos->fetchAll(PDO::FETCH_ASSOC);

            // Desglosar
            $egresos_globales = [];
            $egresos_torre = [];
            $egresos_unidad = [];

            $parent_id = $prop['parent_id'] ? intval($prop['parent_id']) : null;
            $unit_id = intval($prop['id']);

            foreach ($egresos as $e) {
                $pid = $e['propiedad_id'] ? intval($e['propiedad_id']) : null;
                if ($pid === null) {
                    $egresos_globales[] = $e;
                } elseif ($parent_id && $pid === $parent_id) {
                    $egresos_torre[] = $e;
                } elseif ($pid === $unit_id) {
                    $egresos_unidad[] = $e;
                }
            }

            // Calcular si corresponde mora (si sigue pendiente y ya venció)
            $hoy = date('Y-m-d');
            $mora_calculada = floatval($boleta['monto_mora']);
            $total_calculado = floatval($boleta['monto_total']);
            $vencido = false;

            if ($boleta['estado'] === 'pendiente' && $hoy > $period['fecha_tope']) {
                $subtotal = floatval($boleta['monto_comun']) + floatval($boleta['monto_torre']) + floatval($boleta['monto_unidad']);
                $mora_calculada = round($subtotal * floatval($period['interes_mora']) / 100, 2);
                $total_calculado = $subtotal + $mora_calculada;
                $vencido = true;
            } elseif ($boleta['estado'] === 'pendiente' && $hoy <= $period['fecha_tope']) {
                // Asegurar que no muestre mora si no ha vencido
                $mora_calculada = 0.00;
                $total_calculado = floatval($boleta['monto_comun']) + floatval($boleta['monto_torre']) + floatval($boleta['monto_unidad']);
            }

            sendResponse(true, '', [
                'boleta' => array_merge($boleta, [
                    'monto_mora' => $mora_calculada,
                    'monto_total' => $total_calculado,
                    'vencido' => $vencido
                ]),
                'periodo' => $period,
                'condominio' => $condo,
                'propiedad' => $prop,
                'propietario' => $owner,
                'egresos_globales' => $egresos_globales,
                'egresos_torre' => $egresos_torre,
                'egresos_unidad' => $egresos_unidad
            ]);
            break;

        case 'generate_boleta_pdf':
            $boleta_id = intval($_GET['id'] ?? 0);
            if ($boleta_id <= 0) {
                die('ID de boleta inválido.');
            }

            $stmtB = $pdo->prepare("SELECT * FROM boletas_gasto_comun WHERE id = ?");
            $stmtB->execute([$boleta_id]);
            $boleta = $stmtB->fetch(PDO::FETCH_ASSOC);

            if (!$boleta) {
                die('Boleta no encontrada.');
            }

            $stmtP = $pdo->prepare("SELECT * FROM periodos_gasto_comun WHERE id = ?");
            $stmtP->execute([$boleta['periodo_id']]);
            $period = $stmtP->fetch(PDO::FETCH_ASSOC);

            $stmtC = $pdo->query("SELECT * FROM condominio LIMIT 1");
            $condo = $stmtC->fetch(PDO::FETCH_ASSOC);

            $stmtProp = $pdo->prepare("
                SELECT p.*, parent.identificador AS torre_nombre, tu.porcentaje_prorrateo, tu.codigo AS tipo_unidad_codigo
                FROM propiedades p
                LEFT JOIN propiedades parent ON p.parent_id = parent.id
                LEFT JOIN tipos_unidades tu ON p.tipo_unidad_id = tu.id
                WHERE p.id = ?
            ");
            $stmtProp->execute([$boleta['propiedad_id']]);
            $prop = $stmtProp->fetch(PDO::FETCH_ASSOC);

            $stmtOwner = $pdo->prepare("
                SELECT i.nombres || ' ' || i.apellidos AS nombres, i.rut, i.email, i.telefono
                FROM integrantes_ficha i
                JOIN ficha_residentes f ON i.ficha_id = f.id
                WHERE f.propiedad_id = ? AND i.es_propietario = 1
                LIMIT 1
            ");
            $stmtOwner->execute([$boleta['propiedad_id']]);
            $owner = $stmtOwner->fetch(PDO::FETCH_ASSOC) ?: [
                'nombres' => 'Sin Propietario Asignado',
                'rut' => '-',
                'email' => '-',
                'telefono' => '-'
            ];

            $stmtEgresos = $pdo->prepare("
                SELECT 
                    e.id, e.fecha, e.monto, e.descripcion, e.tipo_gasto, e.propiedad_id,
                    c.nombre AS categoria_nombre,
                    s.nombre AS subcategoria_nombre
                FROM egresos e
                JOIN subcategorias s ON e.subcategoria_id = s.id
                JOIN categorias c ON s.categoria_id = c.id
                WHERE strftime('%Y-%m', e.fecha) = ? AND e.condominio_id = ?
            ");
            $stmtEgresos->execute([$period['mes'], $active_condominio_id]);
            $egresos = $stmtEgresos->fetchAll(PDO::FETCH_ASSOC);

            $egresos_globales = [];
            $egresos_torre = [];
            $egresos_unidad = [];

            $parent_id = $prop['parent_id'] ? intval($prop['parent_id']) : null;
            $unit_id = intval($prop['id']);

            foreach ($egresos as $e) {
                $pid = $e['propiedad_id'] ? intval($e['propiedad_id']) : null;
                if ($pid === null) {
                    $egresos_globales[] = $e;
                } elseif ($parent_id && $pid === $parent_id) {
                    $egresos_torre[] = $e;
                } elseif ($pid === $unit_id) {
                    $egresos_unidad[] = $e;
                }
            }

            $bloques = [
                '1' => ['nombre' => '1 - Remuneraciones / Administración y Personal', 'egresos' => [], 'total' => 0],
                '2' => ['nombre' => '2 - Servicios Básicos / Areas comunes', 'egresos' => [], 'total' => 0],
                '3' => ['nombre' => '3 - Mantenciones / Reparaciones / Seguros', 'egresos' => [], 'total' => 0],
                '4' => ['nombre' => '4 - Fondos / Multas', 'egresos' => [], 'total' => 0],
                'otro' => ['nombre' => 'Otros Egresos', 'egresos' => [], 'total' => 0]
            ];

            foreach ($egresos as $e) {
                $nombre_cat = $e['categoria_nombre'];
                $char = substr(trim($nombre_cat), 0, 1);
                if (in_array($char, ['1', '2', '3', '4'])) {
                    $bloques[$char]['egresos'][] = $e;
                    $bloques[$char]['total'] += floatval($e['monto']);
                } else {
                    $bloques['otro']['egresos'][] = $e;
                    $bloques['otro']['total'] += floatval($e['monto']);
                }
            }

            $sumGlobales = array_sum(array_column($egresos_globales, 'monto'));
            $sumTorre = array_sum(array_column($egresos_torre, 'monto'));
            $sumUnidad = array_sum(array_column($egresos_unidad, 'monto'));

            $prorrateoFraccion = floatval($prop['porcentaje_prorrateo']);
            $baseSuma = $sumGlobales + $sumTorre;
            $comunProrrateado = $baseSuma * $prorrateoFraccion;

            $hoy = date('Y-m-d');
            $mora_calculada = floatval($boleta['monto_mora']);
            $total_calculado = floatval($boleta['monto_total']);
            if ($boleta['estado'] === 'pendiente' && $hoy > $period['fecha_tope']) {
                $subtotal = $comunProrrateado + $sumUnidad;
                $mora_calculada = round($subtotal * floatval($period['interes_mora']) / 100, 2);
                $total_calculado = $subtotal + $mora_calculada;
            } elseif ($boleta['estado'] === 'pendiente' && $hoy <= $period['fecha_tope']) {
                $mora_calculada = 0.00;
                $total_calculado = $comunProrrateado + $sumUnidad;
            }

            $meses = [
                '01' => 'Enero', '02' => 'Febrero', '03' => 'Marzo', '04' => 'Abril',
                '05' => 'Mayo', '06' => 'Junio', '07' => 'Julio', '08' => 'Agosto',
                '09' => 'Septiembre', '10' => 'Octubre', '11' => 'Noviembre', '12' => 'Diciembre'
            ];
            $parts = explode('-', $period['mes']);
            $mes_nombre = ($meses[$parts[1]] ?? '') . ' ' . $parts[0];
            ?>
            <!DOCTYPE html>
            <html lang="es">
            <head>
                <meta charset="UTF-8">
                <title>Recibo Gasto Común - <?php echo htmlspecialchars($prop['identificador']); ?></title>
                <style>
                    body {
                        font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
                        color: #333;
                        margin: 2rem;
                        line-height: 1.5;
                        font-size: 13px;
                    }
                    .header-table, .meta-table, .desglose-table, .liquidacion-table {
                        width: 100%;
                        border-collapse: collapse;
                        margin-bottom: 1.5rem;
                    }
                    .meta-card {
                        border: 1px solid #ddd;
                        padding: 0.75rem;
                        border-radius: 6px;
                        background: #fafafa;
                    }
                    .badge {
                        padding: 0.2rem 0.5rem;
                        border-radius: 4px;
                        font-weight: bold;
                        font-size: 11px;
                        text-transform: uppercase;
                    }
                    .badge-success { background: #d1fae5; color: #065f46; }
                    .badge-danger { background: #fee2e2; color: #991b1b; }
                    th {
                        background: #f3f4f6;
                        color: #000;
                        font-weight: bold;
                        text-align: left;
                        padding: 0.5rem;
                        font-size: 11px;
                        border: 1px solid #ddd;
                    }
                    td {
                        padding: 0.5rem;
                        border: 1px solid #ddd;
                    }
                    .text-right { text-align: right; }
                    .text-center { text-align: center; }
                    .title-block {
                        font-size: 14px;
                        font-weight: bold;
                        margin-top: 1.5rem;
                        margin-bottom: 0.5rem;
                        color: #000;
                        border-bottom: 2px solid #333;
                        padding-bottom: 0.25rem;
                        text-transform: uppercase;
                    }
                    .subtitle-block {
                        font-size: 12px;
                        font-weight: bold;
                        margin-top: 1rem;
                        margin-bottom: 0.25rem;
                        color: #2563eb;
                    }
                    @media print {
                        body { margin: 1cm; }
                        .no-print { display: none; }
                    }
                </style>
            </head>
            <body onload="window.print()">
                <div class="no-print" style="margin-bottom: 1.5rem; text-align: right;">
                    <button onclick="window.print()" style="padding: 0.5rem 1rem; font-weight: bold; cursor: pointer; background: #0284c7; color: #fff; border: none; border-radius: 4px;">Imprimir / Guardar PDF</button>
                </div>

                <!-- Cabecera -->
                <table class="header-table" style="border: none;">
                    <tr style="border: none;">
                        <td style="border: none; padding: 0;">
                            <h1 style="font-size: 20px; font-weight: bold; margin: 0; color: #000;"><?php echo htmlspecialchars($condo['nombre']); ?></h1>
                            <p style="margin: 0.25rem 0 0 0; color: #666; font-size: 12px;"><?php echo htmlspecialchars($condo['direccion']); ?></p>
                            <p style="margin: 0.25rem 0 0 0; color: #666; font-size: 12px;">RUT: <?php echo htmlspecialchars($condo['rut']); ?></p>
                        </td>
                        <td style="border: none; padding: 0; text-align: right; vertical-align: top;">
                            <div style="background: #f0f0f0; padding: 0.5rem 1rem; border-radius: 6px; font-weight: bold; font-size: 14px; color: #000; display: inline-block; text-transform: uppercase;">
                                Recibo Gasto Común
                            </div>
                            <p style="margin: 0.5rem 0 0 0; font-size: 13px; font-weight: bold;">Mes: <?php echo htmlspecialchars($mes_nombre); ?></p>
                        </td>
                    </tr>
                </table>

                <!-- Grid de Datos -->
                <table style="width: 100%; border-collapse: collapse; margin-bottom: 1.5rem; border: none;">
                    <tr style="border: none;">
                        <td style="width: 50%; border: none; padding: 0 0.75rem 0 0; vertical-align: top;">
                            <div class="meta-card">
                                <h4 style="margin: 0 0 0.5rem 0; font-size: 13px; font-weight: bold; border-bottom: 1px solid #ddd; padding-bottom: 0.25rem; color: #000;">Identificación de la Unidad</h4>
                                <table style="width: 100%; border: none; margin: 0;">
                                    <tr style="border: none;"><td style="padding: 0.2rem 0; border: none; font-weight: bold; width: 100px;">Unidad:</td><td style="padding: 0.2rem 0; border: none;"><?php echo htmlspecialchars($prop['identificador']); ?></td></tr>
                                    <tr style="border: none;"><td style="padding: 0.2rem 0; border: none; font-weight: bold;">Torre/Edif:</td><td style="padding: 0.2rem 0; border: none;"><?php echo htmlspecialchars($prop['torre_nombre'] ?: 'Ninguna / Casa'); ?></td></tr>
                                    <tr style="border: none;"><td style="padding: 0.2rem 0; border: none; font-weight: bold;">Propietario:</td><td style="padding: 0.2rem 0; border: none;"><?php echo htmlspecialchars($owner['nombres']); ?></td></tr>
                                    <tr style="border: none;"><td style="padding: 0.2rem 0; border: none; font-weight: bold;">RUT:</td><td style="padding: 0.2rem 0; border: none;"><?php echo htmlspecialchars($owner['rut']); ?></td></tr>
                                </table>
                            </div>
                        </td>
                        <td style="width: 50%; border: none; padding: 0 0 0 0.75rem; vertical-align: top;">
                            <div class="meta-card">
                                <h4 style="margin: 0 0 0.5rem 0; font-size: 13px; font-weight: bold; border-bottom: 1px solid #ddd; padding-bottom: 0.25rem; color: #000;">Información de Cobro</h4>
                                <table style="width: 100%; border: none; margin: 0;">
                                    <tr style="border: none;"><td style="padding: 0.2rem 0; border: none; font-weight: bold; width: 110px;">F. Emisión:</td><td style="padding: 0.2rem 0; border: none;"><?php echo date('d-m-Y', strtotime($period['fecha_emision'])); ?></td></tr>
                                    <tr style="border: none;"><td style="padding: 0.2rem 0; border: none; font-weight: bold;">F. Vencimiento:</td><td style="padding: 0.2rem 0; border: none;"><?php echo date('d-m-Y', strtotime($period['fecha_tope'])); ?></td></tr>
                                    <tr style="border: none;"><td style="padding: 0.2rem 0; border: none; font-weight: bold;">Prorrateo:</td><td style="padding: 0.2rem 0; border: none;"><?php echo number_format($prorrateoFraccion * 100, 4); ?> % (<?php echo htmlspecialchars($prop['tipo_unidad_codigo'] ?: 'Por Defecto'); ?>)</td></tr>
                                    <tr style="border: none;"><td style="padding: 0.2rem 0; border: none; font-weight: bold;">Estado Pago:</td><td style="padding: 0.2rem 0; border: none;">
                                        <span class="badge <?php echo $boleta['estado'] === 'pagado' ? 'badge-success' : 'badge-danger'; ?>">
                                            <?php echo $boleta['estado'] === 'pagado' ? 'PAGADO' : 'PENDIENTE'; ?>
                                        </span>
                                    </td></tr>
                                </table>
                            </div>
                        </td>
                    </tr>
                </table>

                <!-- Resumen por Bloques de Cobro -->
                <div class="title-block">Resumen de Bloques de Cobro del Periodo</div>
                <table class="desglose-table">
                    <thead>
                        <tr>
                            <th>Bloque de Cobro</th>
                            <th class="text-right">Monto Total Condominio ($)</th>
                            <th class="text-right">Mi Prorrateo Directo ($)</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php
                        $subtotalCondo = 0;
                        $subtotalMiProrrateo = 0;

                        foreach ($bloques as $key => $bloque) {
                            if ($key === 'otro' && empty($bloque['egresos'])) continue;
                            
                            $montoBloque = $bloque['total'];
                            $globalInBloque = 0;
                            foreach ($bloque['egresos'] as $eg) {
                                if ($eg['propiedad_id'] === null || $eg['propiedad_id'] === '') {
                                    $globalInBloque += floatval($eg['monto']);
                                }
                            }
                            $prorrateoBloque = $globalInBloque * $prorrateoFraccion;
                            
                            $subtotalCondo += $montoBloque;
                            $subtotalMiProrrateo += $prorrateoBloque;
                            ?>
                            <tr>
                                <td style="font-weight: bold;"><?php echo htmlspecialchars($bloque['nombre']); ?></td>
                                <td class="text-right">$<?php echo number_format($montoBloque, 0, ',', '.'); ?></td>
                                <td class="text-right">$<?php echo number_format($prorrateoBloque, 0, ',', '.'); ?></td>
                            </tr>
                            <?php
                        }
                        ?>
                        <tr style="font-weight: bold; background: #fafafa; border-top: 2px solid #ddd;">
                            <td>Subtotal Prorrateable:</td>
                            <td class="text-right">$<?php echo number_format($subtotalCondo, 0, ',', '.'); ?></td>
                            <td class="text-right">$<?php echo number_format($subtotalMiProrrateo, 0, ',', '.'); ?></td>
                        </tr>
                    </tbody>
                </table>

                <!-- Detalle de Egresos por Bloque -->
                <div class="title-block">Detalle Cronológico de Egresos</div>
                <?php
                foreach ($bloques as $key => $bloque) {
                    if (empty($bloque['egresos'])) continue;
                    ?>
                    <div class="subtitle-block"><?php echo htmlspecialchars($bloque['nombre']); ?></div>
                    <table class="desglose-table" style="margin-bottom: 1rem;">
                        <thead>
                            <tr>
                                <th style="width: 80px;">Fecha</th>
                                <th style="width: 150px;">Subcategoría</th>
                                <th>Descripción</th>
                                <th style="width: 100px;" class="text-right">Monto ($)</th>
                            </tr>
                        </thead>
                        <tbody>
                            <?php
                            foreach ($bloque['egresos'] as $e) {
                                ?>
                                <tr>
                                    <td><?php echo date('d-m-Y', strtotime($e['fecha'])); ?></td>
                                    <td><?php echo htmlspecialchars($e['subcategoria_nombre']); ?></td>
                                    <td><?php echo htmlspecialchars($e['descripcion']); ?></td>
                                    <td class="text-right">$<?php echo number_format(floatval($e['monto']), 0, ',', '.'); ?></td>
                                </tr>
                                <?php
                            }
                            ?>
                        </tbody>
                    </table>
                    <?php
                }
                ?>

                <!-- Liquidación de Cuentas -->
                <div style="margin-top: 2rem; display: flex; justify-content: flex-end;">
                    <div style="width: 350px; border: 1px solid #ddd; border-radius: 6px; padding: 1rem; background: #f9f9f9; font-size: 13px;">
                        <table style="width: 100%; border: none; margin: 0; border-collapse: collapse;">
                            <tr style="border: none;">
                                <td style="padding: 0.35rem 0; border: none;">Base Prorrateable del Mes:</td>
                                <td style="padding: 0.35rem 0; text-align: right; border: none;">$<?php echo number_format($baseSuma, 0, ',', '.'); ?></td>
                            </tr>
                            <tr style="border: none;">
                                <td style="padding: 0.35rem 0; border: none;">Prorrateo de la Unidad (<?php echo number_format($prorrateoFraccion * 100, 4); ?>%):</td>
                                <td style="padding: 0.35rem 0; text-align: right; border: none;">$<?php echo number_format($comunProrrateado, 0, ',', '.'); ?></td>
                            </tr>
                            <tr style="border: none;">
                                <td style="padding: 0.35rem 0; border: none;">Cargos Directos y Multas:</td>
                                <td style="padding: 0.35rem 0; text-align: right; border: none;">$<?php echo number_format($sumUnidad, 0, ',', '.'); ?></td>
                            </tr>
                            <?php if ($mora_calculada > 0): ?>
                            <tr style="border: none; color: #ef4444; font-weight: bold;">
                                <td style="padding: 0.35rem 0; border: none;">Interés Mora Vencido (<?php echo number_format(floatval($period['interes_mora']), 2); ?>%):</td>
                                <td style="padding: 0.35rem 0; text-align: right; border: none;">+$<?php echo number_format($mora_calculada, 0, ',', '.'); ?></td>
                            </tr>
                            <?php endif; ?>
                            <tr style="border-top: 2px solid #333; font-weight: bold; font-size: 15px; color: #000;">
                                <td style="padding: 0.5rem 0 0 0; border: none;">Total Gasto Común Cobrado:</td>
                                <td style="padding: 0.5rem 0 0 0; text-align: right; border: none;">$<?php echo number_format($total_calculado, 0, ',', '.'); ?></td>
                            </tr>
                        </table>
                    </div>
                </div>

                <!-- Footer -->
                <div style="text-align: center; margin-top: 3rem; border-top: 1px solid #eee; padding-top: 1rem; font-size: 11px; color: #888;">
                    Este documento sirve de cobro oficial y respaldo de gastos comunes del mes. RedVecino S.A.
                </div>
            </body>
            </html>
            <?php
            exit;

        // 8.7. Publicar Periodo de Gasto Común (Aceptar y Generar)
        case 'publish_gasto_comun_period':
            if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
                sendResponse(false, 'Método no permitido', [], 405);
            }
            $periodo_id = intval($_POST['periodo_id'] ?? 0);
            if ($periodo_id <= 0) {
                sendResponse(false, 'ID de periodo inválido.');
            }

            $stmt = $pdo->prepare("UPDATE periodos_gasto_comun SET estado = 'emitido' WHERE id = ?");
            $stmt->execute([$periodo_id]);
            sendResponse(true, 'Gastos comunes publicados y emitidos con éxito.');
            break;

        // 8.8. Obtener Boletas Emitidas de una Propiedad
        case 'get_propiedad_boletas':
            $propiedad_id = intval($_GET['propiedad_id'] ?? 0);
            if ($propiedad_id <= 0) {
                sendResponse(false, 'ID de propiedad inválida.');
            }

            $sql = "
                SELECT 
                    b.id, b.monto_comun, b.monto_torre, b.monto_unidad, b.monto_mora, b.monto_total, b.estado, b.fecha_pago,
                    p.mes, p.fecha_emision, p.fecha_tope, p.interes_mora
                FROM boletas_gasto_comun b
                JOIN periodos_gasto_comun p ON b.periodo_id = p.id
                WHERE b.propiedad_id = ? AND p.estado = 'emitido'
                ORDER BY p.mes DESC
            ";
            $stmt = $pdo->prepare($sql);
            $stmt->execute([$propiedad_id]);
            $boletas = $stmt->fetchAll(PDO::FETCH_ASSOC);

            // Calcular mora dinámica
            $hoy = date('Y-m-d');
            foreach ($boletas as &$b) {
                if ($b['estado'] === 'pendiente' && $hoy > $b['fecha_tope']) {
                    $subtotal = floatval($b['monto_comun']) + floatval($b['monto_torre']) + floatval($b['monto_unidad']);
                    $b['monto_mora'] = round($subtotal * floatval($b['interes_mora']) / 100, 2);
                    $b['monto_total'] = $subtotal + $b['monto_mora'];
                    $b['vencido'] = true;
                } else {
                    $b['vencido'] = ($b['estado'] === 'pendiente' && $hoy > $b['fecha_tope']);
                }
            }

            sendResponse(true, '', $boletas);
            break;

        // ================= MÓDULO COLABORADORES =================

        // 9.1. Obtener Cargos
        case 'get_cargos':
            $stmt = $pdo->query("SELECT * FROM cargos_colaboradores ORDER BY nombre ASC");
            sendResponse(true, '', $stmt->fetchAll(PDO::FETCH_ASSOC));
            break;

        // 9.2. Guardar Cargo
        case 'save_cargo':
            if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
                sendResponse(false, 'Método no permitido', [], 405);
            }
            $nombre = trim($_POST['nombre'] ?? '');
            if (empty($nombre)) {
                sendResponse(false, 'El nombre del cargo es requerido.');
            }

            try {
                $stmt = $pdo->prepare("INSERT INTO cargos_colaboradores (nombre) VALUES (?)");
                $stmt->execute([$nombre]);
                sendResponse(true, 'Cargo registrado con éxito.', ['id' => $pdo->lastInsertId(), 'nombre' => $nombre]);
            } catch (PDOException $e) {
                if ($e->errorInfo[1] === 19) { // Constraint violation (unique)
                    sendResponse(false, 'El cargo ya se encuentra registrado.');
                }
                throw $e;
            }
            break;

        // 9.3. Eliminar Cargo
        case 'delete_cargo':
            if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
                sendResponse(false, 'Método no permitido', [], 405);
            }
            $id = intval($_POST['id'] ?? 0);
            if ($id <= 0) {
                sendResponse(false, 'ID de cargo inválido.');
            }

            // Verificar si el cargo está asignado a algún colaborador
            $stmtCheck = $pdo->prepare("SELECT COUNT(*) FROM colaboradores WHERE cargo_id = ?");
            $stmtCheck->execute([$id]);
            if (intval($stmtCheck->fetchColumn()) > 0) {
                sendResponse(false, 'No se puede eliminar el cargo porque tiene colaboradores asociados.');
            }

            $stmtDel = $pdo->prepare("DELETE FROM cargos_colaboradores WHERE id = ?");
            $stmtDel->execute([$id]);
            sendResponse(true, 'Cargo eliminado con éxito.');
            break;

        // 9.4. Obtener Colaboradores
        case 'get_colaboradores':
            $sql = "
                SELECT c.*, cg.nombre AS cargo_nombre
                FROM colaboradores c
                LEFT JOIN cargos_colaboradores cg ON c.cargo_id = cg.id
                WHERE c.condominio_id = ?
                ORDER BY c.apellidos ASC, c.nombres ASC
            ";
            $stmt = $pdo->prepare($sql);
            $stmt->execute([$active_condominio_id]);
            sendResponse(true, '', $stmt->fetchAll(PDO::FETCH_ASSOC));
            break;

        // 9.5. Obtener un Colaborador Específico con Historiales
        case 'get_colaborador':
            $id = intval($_GET['id'] ?? 0);
            if ($id <= 0) {
                sendResponse(false, 'ID de colaborador inválido.');
            }

            // Datos principales
            $stmt = $pdo->prepare("SELECT c.*, cg.nombre AS cargo_nombre FROM colaboradores c LEFT JOIN cargos_colaboradores cg ON c.cargo_id = cg.id WHERE c.id = ?");
            $stmt->execute([$id]);
            $colaborador = $stmt->fetch(PDO::FETCH_ASSOC);

            if (!$colaborador) {
                sendResponse(false, 'Colaborador no encontrado.');
            }

            // Amonestaciones
            $stmtAmon = $pdo->prepare("SELECT * FROM colaborador_amonestaciones WHERE colaborador_id = ? ORDER BY fecha DESC, hora DESC");
            $stmtAmon->execute([$id]);
            $amonestaciones = $stmtAmon->fetchAll(PDO::FETCH_ASSOC);

            // Liquidaciones
            $stmtLiq = $pdo->prepare("SELECT * FROM colaborador_liquidaciones WHERE colaborador_id = ? ORDER BY periodo DESC");
            $stmtLiq->execute([$id]);
            $liquidaciones = $stmtLiq->fetchAll(PDO::FETCH_ASSOC);

            sendResponse(true, '', [
                'colaborador' => $colaborador,
                'amonestaciones' => $amonestaciones,
                'liquidaciones' => $liquidaciones
            ]);
            break;

        // 9.6. Guardar Colaborador (Crear / Editar)
        case 'save_colaborador':
            if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
                sendResponse(false, 'Método no permitido', [], 405);
            }

            $id = intval($_POST['id'] ?? 0);
            $nombres = trim($_POST['nombres'] ?? '');
            $apellidos = trim($_POST['apellidos'] ?? '');
            $fecha_nacimiento = trim($_POST['fecha_nacimiento'] ?? '');
            $telefono = trim($_POST['telefono'] ?? '');
            $email = trim($_POST['email'] ?? '');
            $direccion = trim($_POST['direccion'] ?? '');
            $contacto_emergencia_nombre = trim($_POST['contacto_emergencia_nombre'] ?? '');
            $contacto_emergencia_telefono = trim($_POST['contacto_emergencia_telefono'] ?? '');
            $cargo_id = !empty($_POST['cargo_id']) ? intval($_POST['cargo_id']) : null;
            $estado = trim($_POST['estado'] ?? 'activo');
            $tipo_contrato = trim($_POST['tipo_contrato'] ?? '');
            $sueldo_liquido = !empty($_POST['sueldo_liquido']) ? floatval($_POST['sueldo_liquido']) : 0.00;
            $observaciones = trim($_POST['observaciones'] ?? '');
            $horario_trabajo = trim($_POST['horario_trabajo'] ?? '');
            $funciones = trim($_POST['funciones'] ?? '');
            $permitir_insumos = isset($_POST['permitir_insumos']) ? intval($_POST['permitir_insumos']) : 0;

            if (empty($nombres) || empty($apellidos) || empty($fecha_nacimiento)) {
                sendResponse(false, 'Nombres, apellidos y fecha de nacimiento son obligatorios.');
            }

            // Procesar archivo de contrato si se sube
            $contrato_ruta = null;
            if (isset($_FILES['contrato']) && $_FILES['contrato']['error'] === UPLOAD_ERR_OK) {
                $fileTmpPath = $_FILES['contrato']['tmp_name'];
                $fileName = $_FILES['contrato']['name'];
                $fileNameCmps = explode(".", $fileName);
                $fileExtension = strtolower(end($fileNameCmps));
                
                $newFileName = 'contrato_' . time() . '_' . md5(uniqid()) . '.' . $fileExtension;
                
                if (!is_dir(UPLOAD_DIR)) {
                    mkdir(UPLOAD_DIR, 0755, true);
                }
                
                if (move_uploaded_file($fileTmpPath, UPLOAD_DIR . $newFileName)) {
                    $contrato_ruta = 'uploads/' . $newFileName;
                }
            }

            if ($id > 0) {
                // Actualizar
                if ($contrato_ruta) {
                    // Borrar anterior si existe
                    $stmtOld = $pdo->prepare("SELECT contrato_ruta FROM colaboradores WHERE id = ?");
                    $stmtOld->execute([$id]);
                    $old_path = $stmtOld->fetchColumn();
                    if ($old_path && file_exists(__DIR__ . '/' . $old_path)) {
                        @unlink(__DIR__ . '/' . $old_path);
                    }

                    $sql = "UPDATE colaboradores SET nombres=?, apellidos=?, fecha_nacimiento=?, telefono=?, email=?, direccion=?, contacto_emergencia_nombre=?, contacto_emergencia_telefono=?, cargo_id=?, estado=?, tipo_contrato=?, sueldo_liquido=?, observaciones=?, horario_trabajo=?, funciones=?, permitir_insumos=?, contrato_ruta=? WHERE id=?";
                    $params = [$nombres, $apellidos, $fecha_nacimiento, $telefono, $email, $direccion, $contacto_emergencia_nombre, $contacto_emergencia_telefono, $cargo_id, $estado, $tipo_contrato, $sueldo_liquido, $observaciones, $horario_trabajo, $funciones, $permitir_insumos, $contrato_ruta, $id];
                } else {
                    $sql = "UPDATE colaboradores SET nombres=?, apellidos=?, fecha_nacimiento=?, telefono=?, email=?, direccion=?, contacto_emergencia_nombre=?, contacto_emergencia_telefono=?, cargo_id=?, estado=?, tipo_contrato=?, sueldo_liquido=?, observaciones=?, horario_trabajo=?, funciones=?, permitir_insumos=? WHERE id=?";
                    $params = [$nombres, $apellidos, $fecha_nacimiento, $telefono, $email, $direccion, $contacto_emergencia_nombre, $contacto_emergencia_telefono, $cargo_id, $estado, $tipo_contrato, $sueldo_liquido, $observaciones, $horario_trabajo, $funciones, $permitir_insumos, $id];
                }
                $stmt = $pdo->prepare($sql);
                $stmt->execute($params);
                sendResponse(true, 'Ficha del colaborador actualizada con éxito.', ['id' => $id]);
            } else {
                // Crear
                $sql = "INSERT INTO colaboradores (nombres, apellidos, fecha_nacimiento, telefono, email, direccion, contacto_emergencia_nombre, contacto_emergencia_telefono, cargo_id, estado, tipo_contrato, sueldo_liquido, observaciones, horario_trabajo, funciones, permitir_insumos, contrato_ruta, condominio_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
                $stmt = $pdo->prepare($sql);
                $stmt->execute([$nombres, $apellidos, $fecha_nacimiento, $telefono, $email, $direccion, $contacto_emergencia_nombre, $contacto_emergencia_telefono, $cargo_id, $estado, $tipo_contrato, $sueldo_liquido, $observaciones, $horario_trabajo, $funciones, $permitir_insumos, $contrato_ruta, $active_condominio_id]);
                sendResponse(true, 'Colaborador registrado con éxito.', ['id' => $pdo->lastInsertId()]);
            }
            break;

        // 9.7. Eliminar Colaborador
        case 'delete_colaborador':
            if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
                sendResponse(false, 'Método no permitido', [], 405);
            }
            $id = intval($_POST['id'] ?? 0);
            if ($id <= 0) {
                sendResponse(false, 'ID de colaborador inválido.');
            }

            // Eliminar archivos asociados
            // 1. Contrato
            $stmtC = $pdo->prepare("SELECT contrato_ruta FROM colaboradores WHERE id = ?");
            $stmtC->execute([$id]);
            $c_ruta = $stmtC->fetchColumn();
            if ($c_ruta && file_exists(__DIR__ . '/' . $c_ruta)) {
                @unlink(__DIR__ . '/' . $c_ruta);
            }

            // 2. Liquidaciones
            $stmtL = $pdo->prepare("SELECT archivo_ruta FROM colaborador_liquidaciones WHERE colaborador_id = ?");
            $stmtL->execute([$id]);
            while ($l_ruta = $stmtL->fetchColumn()) {
                if ($l_ruta && file_exists(__DIR__ . '/' . $l_ruta)) {
                    @unlink(__DIR__ . '/' . $l_ruta);
                }
            }

            // 3. Amonestaciones
            $stmtA = $pdo->prepare("SELECT archivo_ruta FROM colaborador_amonestaciones WHERE colaborador_id = ?");
            $stmtA->execute([$id]);
            while ($a_ruta = $stmtA->fetchColumn()) {
                if ($a_ruta && file_exists(__DIR__ . '/' . $a_ruta)) {
                    @unlink(__DIR__ . '/' . $a_ruta);
                }
            }

            $stmtDel = $pdo->prepare("DELETE FROM colaboradores WHERE id = ?");
            $stmtDel->execute([$id]);
            sendResponse(true, 'Colaborador eliminado con éxito.');
            break;

        // 9.8. Guardar Amonestación (Crear)
        case 'save_amonestacion':
            if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
                sendResponse(false, 'Método no permitido', [], 405);
            }
            $colaborador_id = intval($_POST['colaborador_id'] ?? 0);
            $fecha = trim($_POST['fecha'] ?? '');
            $hora = trim($_POST['hora'] ?? '');
            $descripcion = trim($_POST['descripcion'] ?? '');

            if ($colaborador_id <= 0 || empty($fecha) || empty($hora) || empty($descripcion)) {
                sendResponse(false, 'Todos los campos de la amonestación (fecha, hora, descripción) son obligatorios.');
            }

            // Procesar archivo adjunto si existe
            $archivo_ruta = null;
            if (isset($_FILES['archivo']) && $_FILES['archivo']['error'] === UPLOAD_ERR_OK) {
                $fileTmpPath = $_FILES['archivo']['tmp_name'];
                $fileName = $_FILES['archivo']['name'];
                $fileNameCmps = explode(".", $fileName);
                $fileExtension = strtolower(end($fileNameCmps));
                
                $newFileName = 'amonestacion_' . time() . '_' . md5(uniqid()) . '.' . $fileExtension;
                
                if (!is_dir(UPLOAD_DIR)) {
                    mkdir(UPLOAD_DIR, 0755, true);
                }
                
                if (move_uploaded_file($fileTmpPath, UPLOAD_DIR . $newFileName)) {
                    $archivo_ruta = 'uploads/' . $newFileName;
                }
            }

            $stmt = $pdo->prepare("INSERT INTO colaborador_amonestaciones (colaborador_id, fecha, hora, descripcion, archivo_ruta) VALUES (?, ?, ?, ?, ?)");
            $stmt->execute([$colaborador_id, $fecha, $hora, $descripcion, $archivo_ruta]);
            sendResponse(true, 'Amonestación registrada con éxito.');
            break;

        // 9.9. Eliminar Amonestación
        case 'delete_amonestacion':
            if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
                sendResponse(false, 'Método no permitido', [], 405);
            }
            $id = intval($_POST['id'] ?? 0);
            if ($id <= 0) {
                sendResponse(false, 'ID de amonestación inválido.');
            }

            // Borrar archivo
            $stmtF = $pdo->prepare("SELECT archivo_ruta FROM colaborador_amonestaciones WHERE id = ?");
            $stmtF->execute([$id]);
            $ruta = $stmtF->fetchColumn();
            if ($ruta && file_exists(__DIR__ . '/' . $ruta)) {
                @unlink(__DIR__ . '/' . $ruta);
            }

            $stmtDel = $pdo->prepare("DELETE FROM colaborador_amonestaciones WHERE id = ?");
            $stmtDel->execute([$id]);
            sendResponse(true, 'Amonestación eliminada con éxito.');
            break;

        // 9.10. Subir Liquidación
        case 'upload_liquidacion':
            if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
                sendResponse(false, 'Método no permitido', [], 405);
            }
            $colaborador_id = intval($_POST['colaborador_id'] ?? 0);
            $periodo = trim($_POST['periodo'] ?? ''); // YYYY-MM

            if ($colaborador_id <= 0 || empty($periodo) || !preg_match('/^\d{4}-\d{2}$/', $periodo)) {
                sendResponse(false, 'El colaborador ID y el período (AAAA-MM) son obligatorios.');
            }

            if (!isset($_FILES['archivo']) || $_FILES['archivo']['error'] !== UPLOAD_ERR_OK) {
                sendResponse(false, 'Debe proporcionar un archivo de liquidación válido.');
            }

            $fileTmpPath = $_FILES['archivo']['tmp_name'];
            $fileName = $_FILES['archivo']['name'];
            $fileNameCmps = explode(".", $fileName);
            $fileExtension = strtolower(end($fileNameCmps));
            
            $newFileName = 'liq_' . $periodo . '_' . time() . '_' . md5(uniqid()) . '.' . $fileExtension;
            
            if (!is_dir(UPLOAD_DIR)) {
                mkdir(UPLOAD_DIR, 0755, true);
            }
            
            if (move_uploaded_file($fileTmpPath, UPLOAD_DIR . $newFileName)) {
                $archivo_ruta = 'uploads/' . $newFileName;
                
                $stmt = $pdo->prepare("INSERT INTO colaborador_liquidaciones (colaborador_id, periodo, archivo_ruta) VALUES (?, ?, ?)");
                $stmt->execute([$colaborador_id, $periodo, $archivo_ruta]);
                sendResponse(true, 'Liquidación registrada con éxito.');
            } else {
                sendResponse(false, 'Error al mover el archivo subido.');
            }
            break;

        // 9.11. Eliminar Liquidación
        case 'delete_liquidacion':
            if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
                sendResponse(false, 'Método no permitido', [], 405);
            }
            $id = intval($_POST['id'] ?? 0);
            if ($id <= 0) {
                sendResponse(false, 'ID de liquidación inválido.');
            }

            // Borrar archivo
            $stmtF = $pdo->prepare("SELECT archivo_ruta FROM colaborador_liquidaciones WHERE id = ?");
            $stmtF->execute([$id]);
            $ruta = $stmtF->fetchColumn();
            if ($ruta && file_exists(__DIR__ . '/' . $ruta)) {
                @unlink(__DIR__ . '/' . $ruta);
            }

            $stmtDel = $pdo->prepare("DELETE FROM colaborador_liquidaciones WHERE id = ?");
            $stmtDel->execute([$id]);
            sendResponse(true, 'Liquidación eliminada con éxito.');
            break;

        // 10. Módulo de Áreas Comunes e Ingresos por Arriendo
        case 'get_areas_comunes':
            $stmt = $pdo->query("SELECT * FROM areas_comunes ORDER BY nombre ASC");
            $areas = $stmt->fetchAll(PDO::FETCH_ASSOC);
            
            $stmtProps = $pdo->query("SELECT * FROM propiedades WHERE es_arrendable = 1 AND tipo = 'area_comun'");
            $props = $stmtProps->fetchAll(PDO::FETCH_ASSOC);
            
            $existing_names = array_map(function($a) {
                return strtolower(trim($a['nombre']));
            }, $areas);
            
            $colors = ['#3b82f6', '#10b981', '#fbbf24', '#ef4444', '#8b5cf6', '#ec4899'];
            $idx = count($areas);
            
            $stmtIns = $pdo->prepare("INSERT INTO areas_comunes (nombre, descripcion, costo, color, condicion) VALUES (?, ?, ?, ?, ?)");
            $has_inserted = false;
            
            foreach ($props as $p) {
                $p_name = trim($p['identificador']);
                if (!in_array(strtolower($p_name), $existing_names)) {
                    $color = $colors[$idx % count($colors)];
                    $stmtIns->execute([$p_name, 'Área común auto-generada desde perfil', 0.00, $color, 'arriendo']);
                    $idx++;
                    $has_inserted = true;
                }
            }
            
            if ($has_inserted) {
                $stmt = $pdo->query("SELECT * FROM areas_comunes ORDER BY nombre ASC");
                $areas = $stmt->fetchAll(PDO::FETCH_ASSOC);
            }

            $areas_with_items = [];
            foreach ($areas as $a) {
                $stmtItems = $pdo->prepare("SELECT * FROM checklist_items WHERE area_comun_id = ? ORDER BY id ASC");
                $stmtItems->execute([$a['id']]);
                $a['checklist_items'] = $stmtItems->fetchAll(PDO::FETCH_ASSOC);
                $areas_with_items[] = $a;
            }
            
            sendResponse(true, '', $areas_with_items);
            break;

        case 'save_area_comun':
            if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
                sendResponse(false, 'Método no permitido', [], 405);
            }
            $id = intval($_POST['id'] ?? 0);
            $nombre = trim($_POST['nombre'] ?? '');
            $descripcion = trim($_POST['descripcion'] ?? '');
            $costo = floatval($_POST['costo'] ?? 0);
            $color = trim($_POST['color'] ?? '#3b82f6');
            $condicion = trim($_POST['condicion'] ?? 'arriendo');

            if (empty($nombre)) {
                sendResponse(false, 'El nombre del área común es obligatorio.');
            }

            $capacidad_simultanea = isset($_POST['capacidad_simultanea']) ? intval($_POST['capacidad_simultanea']) : 1;
            if ($capacidad_simultanea <= 0) $capacidad_simultanea = 1;

            if ($id > 0) {
                $stmt = $pdo->prepare("UPDATE areas_comunes SET nombre = ?, descripcion = ?, costo = ?, color = ?, condicion = ?, capacidad_simultanea = ? WHERE id = ?");
                $stmt->execute([$nombre, $descripcion, $costo, $color, $condicion, $capacidad_simultanea, $id]);
                $target_id = $id;
            } else {
                $stmt = $pdo->prepare("INSERT INTO areas_comunes (nombre, descripcion, costo, color, condicion, capacidad_simultanea) VALUES (?, ?, ?, ?, ?, ?)");
                $stmt->execute([$nombre, $descripcion, $costo, $color, $condicion, $capacidad_simultanea]);
                $target_id = $pdo->lastInsertId();
            }

            if (isset($_POST['checklist_items'])) {
                $stmtDel = $pdo->prepare("DELETE FROM checklist_items WHERE area_comun_id = ?");
                $stmtDel->execute([$target_id]);

                $items = json_decode($_POST['checklist_items'], true) ?: [];
                $stmtInsItem = $pdo->prepare("INSERT INTO checklist_items (area_comun_id, item_nombre) VALUES (?, ?)");
                foreach ($items as $item_name) {
                    $item_name = trim($item_name);
                    if (!empty($item_name)) {
                        $stmtInsItem->execute([$target_id, $item_name]);
                    }
                }
            }

            sendResponse(true, $id > 0 ? 'Área común actualizada con éxito.' : 'Área común agregada con éxito.', ['id' => $target_id]);
            break;

        case 'delete_area_comun':
            if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
                sendResponse(false, 'Método no permitido', [], 405);
            }
            $id = intval($_POST['id'] ?? 0);
            if ($id <= 0) {
                sendResponse(false, 'ID de área común inválido.');
            }
            $stmt = $pdo->prepare("DELETE FROM areas_comunes WHERE id = ?");
            $stmt->execute([$id]);
            sendResponse(true, 'Área común eliminada con éxito.');
            break;

        case 'get_arriendos':
            $sql = "
                SELECT aa.*, ac.nombre AS area_nombre, ac.color AS area_color, ac.costo AS area_costo,
                       p.identificador AS propiedad_identificador, p.tipo AS propiedad_tipo
                FROM arriendos_areas aa
                JOIN areas_comunes ac ON aa.area_comun_id = ac.id
                JOIN propiedades p ON aa.propiedad_id = p.id
                ORDER BY aa.fecha ASC, aa.hora_inicio ASC
            ";
            $stmt = $pdo->query($sql);
            sendResponse(true, '', $stmt->fetchAll(PDO::FETCH_ASSOC));
            break;

        case 'save_arriendo':
            if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
                sendResponse(false, 'Método no permitido', [], 405);
            }
            $id = intval($_POST['id'] ?? 0);
            $area_comun_id = intval($_POST['area_comun_id'] ?? 0);
            $propiedad_id = intval($_POST['propiedad_id'] ?? 0);
            $fecha = $_POST['fecha'] ?? '';
            $hora_inicio = $_POST['hora_inicio'] ?? '';
            $hora_fin = $_POST['hora_fin'] ?? '';
            $monto_pagado = floatval($_POST['monto_pagado'] ?? 0);
            $observaciones = trim($_POST['observaciones'] ?? '');
            $estado = trim($_POST['estado'] ?? 'pendiente');

            if ($area_comun_id <= 0 || $propiedad_id <= 0 || empty($fecha) || empty($hora_inicio) || empty($hora_fin)) {
                sendResponse(false, 'Todos los campos obligatorios (Área, Unidad, Fecha, Hora Inicio, Hora Fin) son requeridos.');
            }

            // Obtener capacidad simultánea del área común
            $stmtCap = $pdo->prepare("SELECT capacidad_simultanea FROM areas_comunes WHERE id = ?");
            $stmtCap->execute([$area_comun_id]);
            $capacidad = intval($stmtCap->fetchColumn() ?: 1);

            // Validar cruce de horarios: (hora_inicio < hora_fin_new AND hora_fin > hora_inicio_new)
            $conflictSql = "
                SELECT COUNT(*) as total 
                FROM arriendos_areas 
                WHERE area_comun_id = ? 
                  AND fecha = ? 
                  AND id != ?
                  AND (
                    (hora_inicio < ? AND hora_fin > ?)
                  )
            ";
            $stmtCheck = $pdo->prepare($conflictSql);
            $stmtCheck->execute([$area_comun_id, $fecha, $id, $hora_fin, $hora_inicio]);
            $conflictCount = $stmtCheck->fetch()['total'];

            if ($conflictCount >= $capacidad) {
                sendResponse(false, 'Conflicto de reserva: Se ha superado el límite de capacidad de reservas simultáneas para este rango horario.');
            }

            if ($id > 0) {
                $stmt = $pdo->prepare("UPDATE arriendos_areas SET area_comun_id = ?, propiedad_id = ?, fecha = ?, hora_inicio = ?, hora_fin = ?, monto_pagado = ?, observaciones = ?, estado = ? WHERE id = ?");
                $stmt->execute([$area_comun_id, $propiedad_id, $fecha, $hora_inicio, $hora_fin, $monto_pagado, $observaciones, $estado, $id]);
                sendResponse(true, 'Reserva de arriendo actualizada con éxito.', ['id' => $id]);
            } else {
                $stmt = $pdo->prepare("INSERT INTO arriendos_areas (area_comun_id, propiedad_id, fecha, hora_inicio, hora_fin, monto_pagado, observaciones, estado) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
                $stmt->execute([$area_comun_id, $propiedad_id, $fecha, $hora_inicio, $hora_fin, $monto_pagado, $observaciones, $estado]);
                sendResponse(true, 'Reserva de arriendo registrada con éxito.', ['id' => $pdo->lastInsertId()]);
            }
            break;

        case 'update_arriendo_estado':
            if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
                sendResponse(false, 'Método no permitido', [], 405);
            }
            $id = intval($_POST['id'] ?? 0);
            $estado = trim($_POST['estado'] ?? 'pendiente');

            if ($id <= 0) {
                sendResponse(false, 'ID de arriendo inválido.');
            }

            $stmt = $pdo->prepare("UPDATE arriendos_areas SET estado = ? WHERE id = ?");
            $stmt->execute([$estado, $id]);
            sendResponse(true, 'Estado de la reserva actualizado con éxito.');
            break;

        case 'delete_arriendo':
            if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
                sendResponse(false, 'Método no permitido', [], 405);
            }
            $id = intval($_POST['id'] ?? 0);
            if ($id <= 0) {
                sendResponse(false, 'ID de arriendo inválido.');
            }
            $stmt = $pdo->prepare("DELETE FROM arriendos_areas WHERE id = ?");
            $stmt->execute([$id]);
            sendResponse(true, 'Reserva de arriendo eliminada con éxito.');
            break;

        case 'get_condominios':
            global $pdo_global;
            $stmt = $pdo_global->query("SELECT * FROM condominio ORDER BY nombre ASC");
            sendResponse(true, '', $stmt->fetchAll(PDO::FETCH_ASSOC));
            break;

        case 'save_condominio':
            if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
                sendResponse(false, 'Método no permitido', [], 405);
            }
            global $pdo_global;
            $id = intval($_POST['id'] ?? 0);
            $nombre = trim($_POST['nombre'] ?? '');
            $tipo_inmueble = trim($_POST['tipo_inmueble'] ?? 'torre');
            $descripcion = trim($_POST['descripcion'] ?? '');
            $direccion = trim($_POST['direccion'] ?? '');
            $rut = trim($_POST['rut'] ?? '');
            $administrador = trim($_POST['administrador'] ?? '');
            $email = trim($_POST['email'] ?? '');
            $telefono = trim($_POST['telefono'] ?? '');
            $sitio_web = trim($_POST['sitio_web'] ?? '');

            if (empty($nombre) || empty($tipo_inmueble)) {
                sendResponse(false, 'El nombre y el tipo de condominio son obligatorios.');
            }

            if ($id > 0) {
                // Actualizar en global
                $stmt = $pdo_global->prepare("UPDATE condominio SET nombre = ?, tipo_inmueble = ?, descripcion = ?, direccion = ?, rut = ?, administrador = ?, email = ?, telefono = ?, sitio_web = ? WHERE id = ?");
                $stmt->execute([$nombre, $tipo_inmueble, $descripcion, $direccion, $rut, $administrador, $email, $telefono, $sitio_web, $id]);
                
                // Actualizar en local si existe
                $condo_db_file = __DIR__ . "/condominio_" . $id . ".db";
                if (file_exists($condo_db_file)) {
                    $pdo_local = new PDO("sqlite:" . $condo_db_file);
                    $pdo_local->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
                    $stmtLocal = $pdo_local->prepare("UPDATE condominio SET nombre = ?, tipo_inmueble = ?, descripcion = ?, direccion = ?, rut = ?, administrador = ?, email = ?, telefono = ?, sitio_web = ? WHERE id = ?");
                    $stmtLocal->execute([$nombre, $tipo_inmueble, $descripcion, $direccion, $rut, $administrador, $email, $telefono, $sitio_web, $id]);
                    
                    // Actualizar o insertar en tabla administrador local
                    $stmtAdminCheck = $pdo_local->query("SELECT id FROM administrador LIMIT 1");
                    $admin_id = $stmtAdminCheck->fetchColumn();
                    if ($admin_id) {
                        $stmtAdminUpdate = $pdo_local->prepare("UPDATE administrador SET nombre = ?, email = ?, telefono = ?, website = ? WHERE id = ?");
                        $stmtAdminUpdate->execute([$administrador, $email, $telefono, $sitio_web, $admin_id]);
                    } else {
                        $stmtAdminInsert = $pdo_local->prepare("INSERT INTO administrador (nombre, email, telefono, website, rut) VALUES (?, ?, ?, ?, ?)");
                        $stmtAdminInsert->execute([$administrador, $email, $telefono, $sitio_web, $rut]);
                    }
                }
                
                sendResponse(true, 'Condominio actualizado con éxito.', ['id' => $id]);
            } else {
                // Insertar en global
                $stmt = $pdo_global->prepare("INSERT INTO condominio (nombre, tipo_inmueble, descripcion, direccion, rut, administrador, email, telefono, sitio_web) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
                $stmt->execute([$nombre, $tipo_inmueble, $descripcion, $direccion, $rut, $administrador, $email, $telefono, $sitio_web]);
                $new_id = $pdo_global->lastInsertId();

                // Crear y conectar a base de datos local
                $condo_db_file = __DIR__ . "/condominio_" . $new_id . ".db";
                $pdo_local = new PDO("sqlite:" . $condo_db_file);
                $pdo_local->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
                $pdo_local->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
                
                // Correr esquema local
                $schema_file = __DIR__ . '/schema.sql';
                if (file_exists($schema_file)) {
                    $schema_sql = file_get_contents($schema_file);
                    $pdo_local->exec($schema_sql);
                }

                // Asegurar tablas locales complementarias
                $pdo_local->exec("CREATE TABLE IF NOT EXISTS periodos_gasto_comun (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    mes VARCHAR(7) NOT NULL UNIQUE,
                    fecha_emision DATE NOT NULL,
                    fecha_tope DATE NOT NULL,
                    interes_mora DECIMAL(5,2) DEFAULT 0.00,
                    estado VARCHAR(20) DEFAULT 'borrador',
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    condominio_id INTEGER DEFAULT 1
                );");

                $pdo_local->exec("CREATE TABLE IF NOT EXISTS boletas_gasto_comun (
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

                $pdo_local->exec("CREATE TABLE IF NOT EXISTS cargos_colaboradores (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    nombre VARCHAR(100) NOT NULL UNIQUE
                );");

                $pdo_local->exec("CREATE TABLE IF NOT EXISTS colaboradores (
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
                    condominio_id INTEGER DEFAULT 1,
                    FOREIGN KEY (cargo_id) REFERENCES cargos_colaboradores(id)
                );");

                $pdo_local->exec("CREATE TABLE IF NOT EXISTS colaborador_amonestaciones (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    colaborador_id INTEGER NOT NULL,
                    fecha DATE NOT NULL,
                    hora TIME NOT NULL,
                    descripcion TEXT NOT NULL,
                    archivo_ruta VARCHAR(255),
                    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (colaborador_id) REFERENCES colaboradores(id) ON DELETE CASCADE
                );");

                $pdo_local->exec("CREATE TABLE IF NOT EXISTS colaborador_liquidaciones (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    colaborador_id INTEGER NOT NULL,
                    periodo VARCHAR(7) NOT NULL,
                    archivo_ruta VARCHAR(255) NOT NULL,
                    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (colaborador_id) REFERENCES colaboradores(id) ON DELETE CASCADE
                );");

                $pdo_local->exec("CREATE TABLE IF NOT EXISTS areas_comunes (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    nombre VARCHAR(100) NOT NULL,
                    descripcion TEXT,
                    costo DECIMAL(12,2) DEFAULT 0.00,
                    color VARCHAR(20) DEFAULT '#3b82f6',
                    condicion VARCHAR(50) DEFAULT 'arriendo',
                    capacidad_simultanea INTEGER DEFAULT 1,
                    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    condominio_id INTEGER DEFAULT 1
                );");

                $pdo_local->exec("CREATE TABLE IF NOT EXISTS arriendos_areas (
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
                    condominio_id INTEGER DEFAULT 1,
                    FOREIGN KEY (area_comun_id) REFERENCES areas_comunes(id) ON DELETE CASCADE,
                    FOREIGN KEY (propiedad_id) REFERENCES propiedades(id) ON DELETE CASCADE
                );");

                $pdo_local->exec("CREATE TABLE IF NOT EXISTS pedidos_insumos (
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

                $pdo_local->exec("CREATE TABLE IF NOT EXISTS tickets (
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

                $pdo_local->exec("CREATE TABLE IF NOT EXISTS checklist_items (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    area_comun_id INTEGER NOT NULL,
                    item_nombre VARCHAR(150) NOT NULL,
                    FOREIGN KEY (area_comun_id) REFERENCES areas_comunes(id) ON DELETE CASCADE
                );");

                $pdo_local->exec("CREATE TABLE IF NOT EXISTS checklist_registros (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    arriendo_id INTEGER NOT NULL,
                    colaborador_id INTEGER NOT NULL,
                    tipo VARCHAR(20) NOT NULL,
                    fecha_hora TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (arriendo_id) REFERENCES arriendos_areas(id) ON DELETE CASCADE,
                    FOREIGN KEY (colaborador_id) REFERENCES colaboradores(id) ON DELETE CASCADE
                );");

                $pdo_local->exec("CREATE TABLE IF NOT EXISTS checklist_registro_detalles (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    registro_id INTEGER NOT NULL,
                    item_id INTEGER NOT NULL,
                    estado VARCHAR(20) DEFAULT 'ok',
                    comentarios TEXT,
                    foto_ruta VARCHAR(255),
                    FOREIGN KEY (registro_id) REFERENCES checklist_registros(id) ON DELETE CASCADE,
                    FOREIGN KEY (item_id) REFERENCES checklist_items(id) ON DELETE CASCADE
                );");

                $pdo_local->exec("CREATE TABLE IF NOT EXISTS tipos_unidades (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    codigo VARCHAR(50) NOT NULL UNIQUE,
                    metros_cuadrados DECIMAL(8, 2) NOT NULL,
                    porcentaje_prorrateo DECIMAL(6, 4) NOT NULL,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                );");

                // Insertar perfil del condominio localmente
                $stmtLocalInsert = $pdo_local->prepare("INSERT INTO condominio (id, nombre, tipo_inmueble, descripcion, direccion, rut, administrador, email, telefono, sitio_web) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
                $stmtLocalInsert->execute([$new_id, $nombre, $tipo_inmueble, $descripcion, $direccion, $rut, $administrador, $email, $telefono, $sitio_web]);

                // Insertar perfil del administrador localmente
                $stmtAdminInsert = $pdo_local->prepare("INSERT INTO administrador (nombre, email, telefono, website, rut) VALUES (?, ?, ?, ?, ?)");
                $stmtAdminInsert->execute([$administrador, $email, $telefono, $sitio_web, $rut]);

                // Inicializar propiedades estándar para este nuevo condominio
                $stmtProp = $pdo_local->prepare("INSERT INTO propiedades (tipo, identificador, parent_id, tipo_unidad_id, condominio_id, es_arrendable, piso) VALUES (?, ?, ?, ?, ?, ?, ?)");
                
                // Tipo Unidad
                $pdo_local->exec("INSERT INTO tipos_unidades (codigo, metros_cuadrados, porcentaje_prorrateo) VALUES ('STD', 70.00, 0.0100)");
                $type_id = $pdo_local->lastInsertId();

                if ($tipo_inmueble === 'condominio_casas') {
                    // 16 casas por defecto (sin parent_id / torre)
                    for ($c = 1; $c <= 16; $c++) {
                        $stmtProp->execute(['casa', "Casa " . $c, null, $type_id, $new_id, 0, null]);
                    }
                } else {
                    // Edificios/Torres
                    // Torre Principal
                    $stmtProp->execute(['torre', 'Torre A', null, null, $new_id, 0, null]);
                    $parent_id = $pdo_local->lastInsertId();

                    // 16 departamentos por defecto
                    for ($p = 1; $p <= 4; $p++) {
                        for ($d = 1; $d <= 4; $d++) {
                            $num = sprintf("%d%02d", $p, $d);
                            $stmtProp->execute(['departamento', "Depto " . $num, $parent_id, $type_id, $new_id, 0, $p]);
                        }
                    }
                }

                // Áreas comunes estándar
                $stmtProp->execute(['area_comun', 'Quincho', null, null, $new_id, 1, null]);
                $stmtProp->execute(['area_comun', 'Sala de Eventos', null, null, $new_id, 1, null]);

                sendResponse(true, 'Condominio creado y base de datos independiente inicializada con éxito.', ['id' => $new_id]);
            }
            break;

        case 'delete_condominio':
            if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
                sendResponse(false, 'Método no permitido', [], 405);
            }
            global $pdo_global;
            $id = intval($_POST['id'] ?? 0);
            if ($id <= 0) {
                sendResponse(false, 'ID de condominio inválido.');
            }
            
            // Eliminar de global
            $stmt = $pdo_global->prepare("DELETE FROM condominio WHERE id = ?");
            $stmt->execute([$id]);
            
            // Eliminar archivo de base de datos
            $condo_db_file = __DIR__ . "/condominio_" . $id . ".db";
            if (file_exists($condo_db_file)) {
                @unlink($condo_db_file);
            }
            
            sendResponse(true, 'Condominio y su base de datos independiente eliminados con éxito.');
            break;

        case 'get_pedidos_insumos':
            $colaborador_id = intval($_GET['colaborador_id'] ?? 0);
            if ($colaborador_id > 0) {
                $stmt = $pdo->prepare("
                    SELECT pi.*, COALESCE(c.nombres || ' ' || c.apellidos, 'Colaborador #' || pi.colaborador_id) AS colaborador_nombre 
                    FROM pedidos_insumos pi
                    LEFT JOIN colaboradores c ON pi.colaborador_id = c.id
                    WHERE pi.colaborador_id = ? AND pi.condominio_id = ?
                    ORDER BY pi.fecha_pedido DESC
                ");
                $stmt->execute([$colaborador_id, $active_condominio_id]);
            } else {
                $stmt = $pdo->prepare("
                    SELECT pi.*, COALESCE(c.nombres || ' ' || c.apellidos, 'Colaborador #' || pi.colaborador_id) AS colaborador_nombre 
                    FROM pedidos_insumos pi
                    LEFT JOIN colaboradores c ON pi.colaborador_id = c.id
                    WHERE pi.condominio_id = ?
                    ORDER BY pi.fecha_pedido DESC
                ");
                $stmt->execute([$active_condominio_id]);
            }
            sendResponse(true, '', $stmt->fetchAll(PDO::FETCH_ASSOC));
            break;

        case 'save_pedido_insumos':
            if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
                sendResponse(false, 'Método no permitido', [], 405);
            }
            $colaborador_id = intval($_POST['colaborador_id'] ?? 0);
            $item_nombre = trim($_POST['item_nombre'] ?? '');
            $cantidad = intval($_POST['cantidad'] ?? 1);
            $categoria = trim($_POST['categoria'] ?? 'limpieza');
            $observaciones = trim($_POST['observaciones'] ?? '');

            if ($colaborador_id <= 0 || empty($item_nombre) || $cantidad <= 0) {
                sendResponse(false, 'Colaborador, Nombre del Insumo y Cantidad son campos obligatorios.');
            }

            $stmt = $pdo->prepare("INSERT INTO pedidos_insumos (colaborador_id, item_nombre, cantidad, categoria, observaciones, condominio_id) VALUES (?, ?, ?, ?, ?, ?)");
            $stmt->execute([$colaborador_id, $item_nombre, $cantidad, $categoria, $observaciones, $active_condominio_id]);
            sendResponse(true, 'Pedido de insumo registrado con éxito.', ['id' => $pdo->lastInsertId()]);
            break;

        case 'update_pedido_insumos_estado':
            if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
                sendResponse(false, 'Método no permitido', [], 405);
            }
            $id = intval($_POST['id'] ?? 0);
            $estado = trim($_POST['estado'] ?? 'pendiente');

            if ($id <= 0) {
                sendResponse(false, 'ID de pedido inválido.');
            }

            $stmt = $pdo->prepare("UPDATE pedidos_insumos SET estado = ? WHERE id = ?");
            $stmt->execute([$estado, $id]);
            sendResponse(true, 'Estado del pedido actualizado con éxito.');
            break;

        case 'delete_pedido_insumo':
            if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
                sendResponse(false, 'Método no permitido', [], 405);
            }
            $id = intval($_POST['id'] ?? 0);
            if ($id <= 0) {
                sendResponse(false, 'ID de pedido inválido.');
            }

            $stmtCheck = $pdo->prepare("SELECT estado FROM pedidos_insumos WHERE id = ?");
            $stmtCheck->execute([$id]);
            $pedido = $stmtCheck->fetch(PDO::FETCH_ASSOC);

            if (!$pedido) {
                sendResponse(false, 'El pedido no existe.');
            }

            if ($pedido['estado'] !== 'pendiente') {
                sendResponse(false, 'No se puede eliminar un pedido que ya está en proceso de compra.');
            }

            $stmtDel = $pdo->prepare("DELETE FROM pedidos_insumos WHERE id = ?");
            $stmtDel->execute([$id]);
            sendResponse(true, 'Artículo eliminado de la lista con éxito.');
            break;

        case 'bulk_approve_pedidos_insumos':
            if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
                sendResponse(false, 'Método no permitido', [], 405);
            }
            $colaborador_id = intval($_POST['colaborador_id'] ?? 0);
            if ($colaborador_id <= 0) {
                sendResponse(false, 'ID de colaborador inválido.');
            }

            $stmtUpd = $pdo->prepare("UPDATE pedidos_insumos SET estado = 'en_compra' WHERE colaborador_id = ? AND estado = 'pendiente' AND condominio_id = ?");
            $stmtUpd->execute([$colaborador_id, $active_condominio_id]);

            sendResponse(true, 'Lista de compras marcada como "Visto y Ejecutar Compra" con éxito.');
            break;

        case 'mark_pedidos_comprados':
            if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
                sendResponse(false, 'Método no permitido', [], 405);
            }
            $ids_raw = $_POST['ids'] ?? '';
            $ids = [];
            if (is_array($ids_raw)) {
                $ids = array_map('intval', $ids_raw);
            } else {
                $ids = array_filter(array_map('intval', explode(',', $ids_raw)));
            }
            $numero_documento = trim($_POST['numero_documento'] ?? '');

            if (empty($ids)) {
                sendResponse(false, 'Debe seleccionar al menos un artículo.');
            }
            if (empty($numero_documento)) {
                sendResponse(false, 'El número de factura o boleta es obligatorio.');
            }

            $placeholders = implode(',', array_fill(0, count($ids), '?'));
            $sql = "UPDATE pedidos_insumos SET estado = 'comprado', numero_documento = ? WHERE id IN ($placeholders) AND condominio_id = ?";
            
            $stmt = $pdo->prepare($sql);
            $params = array_merge([$numero_documento], $ids, [$active_condominio_id]);
            $stmt->execute($params);

            sendResponse(true, 'Artículos marcados como comprados con el documento #' . $numero_documento);
            break;

        case 'mark_pedido_recibido':
            if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
                sendResponse(false, 'Método no permitido', [], 405);
            }
            $id = intval($_POST['id'] ?? 0);
            if ($id <= 0) {
                sendResponse(false, 'ID de artículo inválido.');
            }

            $stmtCheck = $pdo->prepare("SELECT estado FROM pedidos_insumos WHERE id = ?");
            $stmtCheck->execute([$id]);
            $pedido = $stmtCheck->fetch(PDO::FETCH_ASSOC);

            if (!$pedido) {
                sendResponse(false, 'El pedido no existe.');
            }
            if ($pedido['estado'] !== 'comprado') {
                sendResponse(false, 'Solo se pueden marcar como recibidos los artículos que ya han sido comprados.');
            }

            $stmtUpd = $pdo->prepare("UPDATE pedidos_insumos SET estado = 'recibido' WHERE id = ?");
            $stmtUpd->execute([$id]);

            sendResponse(true, 'Artículo marcado como recibido con éxito.');
            break;

        case 'get_tickets':
            $stmt = $pdo->query("
                SELECT t.*, p.identificador AS unidad_nombre 
                FROM tickets t
                JOIN propiedades p ON t.propiedad_id = p.id
                ORDER BY t.creado_en DESC
            ");
            sendResponse(true, '', $stmt->fetchAll(PDO::FETCH_ASSOC));
            break;

        case 'save_ticket':
            if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
                sendResponse(false, 'Método no permitido', [], 405);
            }
            $propiedad_id = intval($_POST['propiedad_id'] ?? 0);
            $nombre = trim($_POST['nombre'] ?? '');
            $correo = trim($_POST['correo'] ?? '');
            $tipo_asunto = trim($_POST['tipo_asunto'] ?? '');
            $descripcion = trim($_POST['descripcion'] ?? '');

            if ($propiedad_id <= 0 || empty($nombre) || empty($correo) || empty($tipo_asunto) || empty($descripcion)) {
                sendResponse(false, 'Todos los campos son obligatorios.');
            }

            $stmt = $pdo->prepare("INSERT INTO tickets (propiedad_id, nombre, correo, tipo_asunto, descripcion) VALUES (?, ?, ?, ?, ?)");
            $stmt->execute([$propiedad_id, $nombre, $correo, $tipo_asunto, $descripcion]);
            sendResponse(true, 'Ticket registrado con éxito.', ['id' => $pdo->lastInsertId()]);
            break;

        case 'save_checklist_registro':
            if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
                sendResponse(false, 'Método no permitido', [], 405);
            }
            $arriendo_id = intval($_POST['arriendo_id'] ?? 0);
            $colaborador_id = intval($_POST['colaborador_id'] ?? 0);
            $tipo = trim($_POST['tipo'] ?? '');
            $detalles_json = $_POST['detalles'] ?? '[]';

            if ($arriendo_id <= 0 || $colaborador_id <= 0 || !in_array($tipo, ['entrega', 'recepcion'])) {
                sendResponse(false, 'Parámetros inválidos para el registro de checklist.');
            }

            $detalles = json_decode($detalles_json, true) ?: [];

            $pdo->beginTransaction();
            try {
                $stmtReg = $pdo->prepare("INSERT INTO checklist_registros (arriendo_id, colaborador_id, tipo) VALUES (?, ?, ?)");
                $stmtReg->execute([$arriendo_id, $colaborador_id, $tipo]);
                $registro_id = $pdo->lastInsertId();

                $stmtDet = $pdo->prepare("INSERT INTO checklist_registro_detalles (registro_id, item_id, estado, comentarios, foto_ruta) VALUES (?, ?, ?, ?, ?)");
                
                foreach ($detalles as $d) {
                    $item_id = intval($d['item_id'] ?? 0);
                    $estado = trim($d['estado'] ?? 'ok');
                    $comentarios = trim($d['comentarios'] ?? '');
                    
                    $foto_ruta = '';
                    $file_key = "foto_item_" . $item_id;
                    if (isset($_FILES[$file_key]) && $_FILES[$file_key]['error'] === UPLOAD_ERR_OK) {
                        $file_tmp = $_FILES[$file_key]['tmp_name'];
                        $file_name = $_FILES[$file_key]['name'];
                        $ext = strtolower(pathinfo($file_name, PATHINFO_EXTENSION));
                        
                        if (in_array($ext, ['png', 'jpg', 'jpeg', 'gif', 'webp'])) {
                            $upload_dir = __DIR__ . '/uploads/checklists';
                            if (!is_dir($upload_dir)) {
                                mkdir($upload_dir, 0777, true);
                            }
                            $new_file_name = uniqid('chk_', true) . '.' . $ext;
                            $dest = $upload_dir . '/' . $new_file_name;
                            if (move_uploaded_file($file_tmp, $dest)) {
                                $foto_ruta = 'uploads/checklists/' . $new_file_name;
                            }
                        }
                    }
                    
                    $stmtDet->execute([$registro_id, $item_id, $estado, $comentarios, $foto_ruta]);
                }

                $nuevo_estado_arriendo = ($tipo === 'entrega') ? 'entregado' : 'realizado';
                $stmtArr = $pdo->prepare("UPDATE arriendos_areas SET estado = ? WHERE id = ?");
                $stmtArr->execute([$nuevo_estado_arriendo, $arriendo_id]);

                $pdo->commit();
                sendResponse(true, 'Registro de checklist guardado y estado actualizado con éxito.', ['registro_id' => $registro_id]);
            } catch (Exception $e) {
                $pdo->rollBack();
                sendResponse(false, 'Error al guardar el registro de checklist: ' . $e->getMessage());
            }
            break;

        case 'get_checklist_registros':
            $arriendo_id = intval($_GET['arriendo_id'] ?? 0);
            if ($arriendo_id <= 0) {
                sendResponse(false, 'ID de arriendo inválido.');
            }

            $stmtRegs = $pdo->prepare("
                SELECT cr.*, c.nombres || ' ' || c.apellidos AS colaborador_nombre
                FROM checklist_registros cr
                JOIN colaboradores c ON cr.colaborador_id = c.id
                WHERE cr.arriendo_id = ?
                ORDER BY cr.fecha_hora ASC
            ");
            $stmtRegs->execute([$arriendo_id]);
            $registros = $stmtRegs->fetchAll(PDO::FETCH_ASSOC);

            $result = [];
            foreach ($registros as $r) {
                $stmtDets = $pdo->prepare("
                    SELECT crd.*, ci.item_nombre
                    FROM checklist_registro_detalles crd
                    JOIN checklist_items ci ON crd.item_id = ci.id
                    WHERE crd.registro_id = ?
                    ORDER BY crd.id ASC
                ");
                $stmtDets->execute([$r['id']]);
                $r['detalles'] = $stmtDets->fetchAll(PDO::FETCH_ASSOC);
                $result[] = $r;
            }

            sendResponse(true, '', $result);
            break;

        default:
            sendResponse(false, 'Acción no soportada.', [], 404);
            break;
    }
} catch (Exception $e) {
    sendResponse(false, 'Error interno del servidor: ' . $e->getMessage(), [], 500);
}
