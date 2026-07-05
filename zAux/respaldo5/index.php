<?php
// index.php - Interfaz de Usuario Principal
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Egresos | Administrador de Condominios</title>
    
    <!-- Google Fonts - Outfit -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    
    <!-- Lucide Icons -->
    <script src="https://unpkg.com/lucide@latest"></script>
    
    <!-- Chart.js -->
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>

    <style>
        :root {
            --bg-primary: #090d16;
            --bg-secondary: #0f1524;
            --bg-card: rgba(255, 255, 255, 0.03);
            --bg-card-hover: rgba(255, 255, 255, 0.06);
            --border-color: rgba(255, 255, 255, 0.07);
            --text-primary: #f3f4f6;
            --text-secondary: #9ca3af;
            --text-muted: #6b7280;
            --accent-color: #3b82f6;
            --accent-gradient: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
            --accent-glow: rgba(59, 130, 246, 0.15);
            --emerald-gradient: linear-gradient(135deg, #10b981 0%, #059669 100%);
            --rose-gradient: linear-gradient(135deg, #f43f5e 0%, #e11d48 100%);
            --accent-hover: #2563eb;
            --danger: #ef4444;
            --warning: #f59e0b;
            --success: #10b981;
            --font-main: 'Outfit', sans-serif;
            --transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            --shadow-sm: 0 2px 8px -1px rgba(0, 0, 0, 0.2);
            --shadow-md: 0 4px 16px -2px rgba(0, 0, 0, 0.3);
            --shadow-lg: 0 10px 32px -4px rgba(0, 0, 0, 0.4);
            --sidebar-width: 260px;
        }

        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            font-family: var(--font-main);
        }

        body {
            background-color: var(--bg-primary);
            color: var(--text-primary);
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            overflow-x: hidden;
            overflow-y: auto;
        }

        /* Scrollbar personalizado */
        ::-webkit-scrollbar {
            width: 8px;
            height: 8px;
        }
        ::-webkit-scrollbar-track {
            background: var(--bg-primary);
        }
        ::-webkit-scrollbar-thumb {
            background: var(--border-color);
            border-radius: 4px;
        }
        ::-webkit-scrollbar-thumb:hover {
            background: var(--text-muted);
        }

        /* Contenedor Principal Layout */
        .app-container {
            display: flex;
            width: 100%;
            position: relative;
        }

        /* ================= SIDEBAR ================= */
        .sidebar {
            width: var(--sidebar-width);
            background-color: var(--bg-secondary);
            border-right: 1px solid var(--border-color);
            height: 100vh;
            position: fixed;
            left: 0;
            top: 0;
            display: flex;
            flex-direction: column;
            padding: 2rem 1.5rem;
            z-index: 100;
            transition: var(--transition);
        }

        .brand {
            display: flex;
            align-items: center;
            gap: 0.75rem;
            margin-bottom: 3rem;
        }

        .brand-logo {
            width: 40px;
            height: 40px;
            background: var(--accent-gradient);
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
        }

        .brand-logo i {
            color: #fff;
            stroke-width: 2.5;
        }

        .brand-name {
            font-size: 1.25rem;
            font-weight: 700;
            background: linear-gradient(to right, #fff, #9ca3af);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            letter-spacing: -0.5px;
        }

        .menu-list {
            list-style: none;
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
        }

        .menu-item {
            width: 100%;
        }

        .menu-link {
            display: flex;
            align-items: center;
            gap: 1rem;
            padding: 0.85rem 1.25rem;
            color: var(--text-secondary);
            text-decoration: none;
            border-radius: 12px;
            font-weight: 500;
            font-size: 0.95rem;
            transition: var(--transition);
            cursor: pointer;
        }

        .menu-link:hover {
            color: var(--text-primary);
            background-color: var(--bg-card);
        }

        .menu-link.active {
            color: #fff;
            background: var(--accent-gradient);
            box-shadow: 0 4px 15px var(--accent-glow);
        }

        .menu-link i {
            width: 20px;
            height: 20px;
        }

        .sidebar-footer {
            margin-top: auto;
            border-top: 1px solid var(--border-color);
            padding-top: 1.5rem;
            display: flex;
            align-items: center;
            gap: 0.75rem;
        }

        .admin-avatar {
            width: 42px;
            height: 42px;
            border-radius: 50%;
            background-color: var(--accent-color);
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 600;
            color: #fff;
            position: relative;
            cursor: pointer;
            overflow: hidden;
            min-width: 42px;
        }

        .admin-avatar:hover .avatar-edit-overlay {
            opacity: 1 !important;
        }

        .admin-edit-link {
            display: flex;
            align-items: center;
            gap: 4px;
            font-size: 0.75rem;
            color: var(--accent-color);
            cursor: pointer;
            text-decoration: none;
            margin-top: 4px;
            font-weight: 500;
            transition: var(--transition);
        }

        .admin-edit-link:hover, .admin-edit-link.active {
            color: #fff;
            text-decoration: underline;
        }

        .admin-info {
            display: flex;
            flex-direction: column;
        }

        .admin-name {
            font-size: 0.85rem;
            font-weight: 600;
            color: var(--text-primary);
        }

        .admin-role {
            font-size: 0.75rem;
            color: var(--text-muted);
        }

        /* ================= MAIN CONTENT ================= */
        .main-content {
            margin-left: var(--sidebar-width);
            flex: 1;
            padding: 2.5rem;
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            gap: 2rem;
            max-width: 1400px;
            width: calc(100% - var(--sidebar-width));
        }

        .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .header-title h1 {
            font-size: 1.75rem;
            font-weight: 700;
            letter-spacing: -0.5px;
        }

        .header-title p {
            color: var(--text-secondary);
            font-size: 0.95rem;
            margin-top: 0.25rem;
        }

        .header-actions {
            display: flex;
            gap: 1rem;
            align-items: center;
        }

        /* Botones Comunes */
        .btn {
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
            padding: 0.75rem 1.25rem;
            border-radius: 12px;
            font-size: 0.9rem;
            font-weight: 600;
            cursor: pointer;
            transition: var(--transition);
            border: none;
            outline: none;
        }

        .btn-primary {
            background: var(--accent-gradient);
            color: #fff;
            box-shadow: 0 4px 12px var(--accent-glow);
        }

        .btn-primary:hover {
            opacity: 0.9;
            transform: translateY(-1px);
        }

        .btn-secondary {
            background-color: var(--bg-card);
            border: 1px solid var(--border-color);
            color: var(--text-primary);
        }

        .btn-secondary:hover {
            background-color: var(--bg-card-hover);
        }

        .btn-icon {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 28px;
            height: 28px;
            border-radius: 6px;
            background: rgba(255, 255, 255, 0.02);
            border: 1px solid var(--border-color);
            color: var(--text-primary);
            cursor: pointer;
            transition: var(--transition);
        }
        .btn-icon:hover {
            background: rgba(255, 255, 255, 0.06);
            border-color: var(--text-secondary);
        }

        /* ================= CARDS & KPIS ================= */
        .kpi-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
            gap: 1.5rem;
        }

        .kpi-card {
            background-color: var(--bg-secondary);
            border: 1px solid var(--border-color);
            border-radius: 16px;
            padding: 1.5rem;
            display: flex;
            flex-direction: column;
            gap: 1rem;
            position: relative;
            overflow: hidden;
            transition: var(--transition);
        }

        .kpi-card:hover {
            transform: translateY(-4px);
            border-color: rgba(59, 130, 246, 0.3);
            box-shadow: var(--shadow-md);
        }

        .kpi-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .kpi-title {
            font-size: 0.85rem;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            color: var(--text-secondary);
        }

        .kpi-icon {
            width: 36px;
            height: 36px;
            border-radius: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .kpi-value {
            font-size: 1.75rem;
            font-weight: 700;
            color: #fff;
        }

        .kpi-change {
            font-size: 0.8rem;
            font-weight: 600;
            display: flex;
            align-items: center;
            gap: 0.25rem;
        }

        .kpi-change.up {
            color: var(--success);
        }

        .kpi-change.down {
            color: var(--danger);
        }

        /* ================= SECCIÓN GRÁFICOS ================= */
        .dashboard-grid {
            display: grid;
            grid-template-columns: 1.6fr 1fr;
            gap: 1.5rem;
        }

        .card-panel {
            background-color: var(--bg-secondary);
            border: 1px solid var(--border-color);
            border-radius: 18px;
            padding: 1.75rem;
            display: flex;
            flex-direction: column;
            gap: 1.25rem;
        }

        .panel-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 1px solid var(--border-color);
            padding-bottom: 1rem;
        }

        .panel-title {
            font-size: 1.1rem;
            font-weight: 600;
        }

        .chart-container {
            position: relative;
            width: 100%;
            height: 300px;
        }

        /* ================= VISTA CATEGORÍAS ================= */
        .categories-grid {
            display: grid;
            grid-template-columns: 1fr 1.5fr;
            gap: 1.5rem;
        }

        .form-group {
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
            margin-bottom: 1.25rem;
        }

        .form-group label {
            font-size: 0.85rem;
            font-weight: 600;
            color: var(--text-secondary);
        }

        .form-control {
            background-color: var(--bg-primary);
            border: 1px solid var(--border-color);
            border-radius: 10px;
            padding: 0.75rem 1rem;
            color: var(--text-primary);
            outline: none;
            font-size: 0.9rem;
            transition: var(--transition);
        }

        .form-control:focus {
            border-color: var(--accent-color);
            box-shadow: 0 0 0 3px var(--accent-glow);
        }

        textarea.form-control {
            resize: none;
            min-height: 80px;
        }

        .category-list {
            display: flex;
            flex-direction: column;
            gap: 1rem;
            max-height: 600px;
            overflow-y: auto;
            padding-right: 0.5rem;
        }

        .category-card {
            background-color: var(--bg-primary);
            border: 1px solid var(--border-color);
            border-radius: 12px;
            padding: 1.25rem;
            display: flex;
            flex-direction: column;
            gap: 0.75rem;
        }

        .cat-card-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .cat-card-title {
            font-weight: 600;
            font-size: 1rem;
            color: #fff;
        }

        .cat-card-desc {
            font-size: 0.85rem;
            color: var(--text-secondary);
        }

        .subcategories-container {
            display: flex;
            flex-wrap: wrap;
            gap: 0.5rem;
            border-top: 1px solid var(--border-color);
            padding-top: 0.75rem;
        }

        .subcategory-badge {
            background-color: var(--bg-card-hover);
            border: 1px solid var(--border-color);
            padding: 0.35rem 0.75rem;
            border-radius: 20px;
            font-size: 0.8rem;
            color: var(--text-primary);
            display: inline-flex;
            align-items: center;
            gap: 0.35rem;
        }

        /* ================= VISTA EGRESOS & TABLAS ================= */
        .filters-panel {
            background-color: var(--bg-secondary);
            border: 1px solid var(--border-color);
            border-radius: 14px;
            padding: 1.25rem;
            display: flex;
            flex-wrap: wrap;
            gap: 1rem;
            align-items: flex-end;
        }

        .filters-panel .form-group {
            margin-bottom: 0;
            flex: 1;
            min-width: 150px;
        }

        .table-responsive {
            width: 100%;
            overflow-x: auto;
            background-color: var(--bg-secondary);
            border: 1px solid var(--border-color);
            border-radius: 14px;
            box-shadow: var(--shadow-sm);
        }

        .table {
            width: 100%;
            border-collapse: collapse;
            text-align: left;
            font-size: 0.9rem;
        }

        .table th {
            background-color: rgba(255, 255, 255, 0.01);
            color: var(--text-secondary);
            font-weight: 600;
            padding: 1rem 1.25rem;
            border-bottom: 1px solid var(--border-color);
            font-size: 0.8rem;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        .table td {
            padding: 1rem 1.25rem;
            border-bottom: 1px solid var(--border-color);
            color: var(--text-primary);
            vertical-align: middle;
        }

        .table tr:last-child td {
            border-bottom: none;
        }

        .table tr:hover td {
            background-color: rgba(255, 255, 255, 0.015);
        }

        .badge-double {
            display: flex;
            flex-direction: column;
            gap: 0.15rem;
        }

        .badge-cat {
            font-size: 0.75rem;
            font-weight: 600;
            color: var(--accent-color);
        }

        .badge-subcat {
            font-size: 0.85rem;
            font-weight: 500;
            color: #fff;
        }

        .td-amount {
            font-weight: 700;
            font-size: 0.95rem;
            color: #fff;
        }

        .td-split {
            font-size: 0.8rem;
            color: var(--warning);
            font-weight: 500;
            display: flex;
            align-items: center;
            gap: 0.25rem;
        }

        .action-btns {
            display: flex;
            gap: 0.5rem;
        }

        .btn-icon {
            width: 32px;
            height: 32px;
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            border: 1px solid var(--border-color);
            background-color: var(--bg-card);
            color: var(--text-secondary);
            cursor: pointer;
            transition: var(--transition);
        }

        .btn-icon:hover {
            background-color: var(--bg-card-hover);
            color: var(--text-primary);
        }

        .btn-icon-danger:hover {
            background-color: rgba(239, 68, 68, 0.15);
            border-color: var(--danger);
            color: var(--danger);
        }

        /* ================= MODALES & FORMULARIOS GUÍAS ================= */
        .modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background-color: rgba(9, 13, 22, 0.8);
            backdrop-filter: blur(8px);
            z-index: 1000;
            display: flex;
            align-items: center;
            justify-content: center;
            opacity: 0;
            pointer-events: none;
            transition: var(--transition);
        }

        .modal-overlay.active {
            opacity: 1;
            pointer-events: auto;
        }

        .modal-card {
            background-color: var(--bg-secondary);
            border: 1px solid var(--border-color);
            border-radius: 20px;
            width: 100%;
            max-width: 600px;
            box-shadow: var(--shadow-lg);
            transform: scale(0.95);
            transition: var(--transition);
            overflow: hidden;
            display: flex;
            flex-direction: column;
        }

        .modal-overlay.active .modal-card {
            transform: scale(1);
        }

        .modal-header {
            padding: 1.5rem 1.75rem;
            border-bottom: 1px solid var(--border-color);
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .modal-title {
            font-size: 1.2rem;
            font-weight: 600;
            color: #fff;
        }

        .modal-close {
            background: none;
            border: none;
            color: var(--text-secondary);
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: var(--transition);
        }

        .modal-close:hover {
            color: var(--text-primary);
        }

        .modal-body {
            padding: 1.75rem;
            max-height: 70vh;
            overflow-y: auto;
        }

        .modal-footer {
            padding: 1.25rem 1.75rem;
            border-top: 1px solid var(--border-color);
            display: flex;
            justify-content: flex-end;
            gap: 1rem;
            background-color: rgba(0, 0, 0, 0.1);
        }

        /* Pasos del Modal Formulario (Wizard-like) */
        .step-indicators {
            display: flex;
            justify-content: space-between;
            margin-bottom: 1.5rem;
            position: relative;
        }

        .step-indicators::before {
            content: '';
            position: absolute;
            top: 14px;
            left: 0;
            right: 0;
            height: 2px;
            background-color: var(--border-color);
            z-index: 1;
        }

        .step-ind {
            width: 30px;
            height: 30px;
            border-radius: 50%;
            background-color: var(--bg-primary);
            border: 2px solid var(--border-color);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 0.8rem;
            font-weight: 600;
            color: var(--text-secondary);
            position: relative;
            z-index: 2;
            transition: var(--transition);
        }

        .step-ind.active {
            border-color: var(--accent-color);
            background-color: var(--accent-color);
            color: #fff;
            box-shadow: 0 0 10px var(--accent-glow);
        }

        .step-ind.completed {
            border-color: var(--success);
            background-color: var(--success);
            color: #fff;
        }

        .form-step {
            display: none;
        }

        .form-step.active {
            display: block;
            animation: fadeIn 0.4s ease;
        }

        /* Toggle switches */
        .toggle-container {
            display: flex;
            align-items: center;
            justify-content: space-between;
            background-color: var(--bg-primary);
            padding: 1rem;
            border-radius: 12px;
            border: 1px solid var(--border-color);
            margin-bottom: 1.25rem;
        }

        .toggle-info {
            display: flex;
            flex-direction: column;
            gap: 0.15rem;
        }

        .toggle-title {
            font-size: 0.9rem;
            font-weight: 600;
            color: #fff;
        }

        .toggle-desc {
            font-size: 0.75rem;
            color: var(--text-secondary);
        }

        .switch {
            position: relative;
            display: inline-block;
            width: 46px;
            height: 24px;
        }

        .switch input {
            opacity: 0;
            width: 0;
            height: 0;
        }

        .slider {
            position: absolute;
            cursor: pointer;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: var(--border-color);
            transition: .3s;
            border-radius: 34px;
        }

        .slider:before {
            position: absolute;
            content: "";
            height: 18px;
            width: 18px;
            left: 3px;
            bottom: 3px;
            background-color: white;
            transition: .3s;
            border-radius: 50%;
        }

        input:checked + .slider {
            background-color: var(--accent-color);
        }

        input:checked + .slider:before {
            transform: translateX(22px);
        }

        /* ================= TOAST NOTIFICATION ================= */
        .toast-container {
            position: fixed;
            bottom: 2rem;
            right: 2rem;
            display: flex;
            flex-direction: column;
            gap: 0.75rem;
            z-index: 9999;
        }

        .toast {
            background-color: var(--bg-secondary);
            border: 1px solid var(--border-color);
            border-left: 4px solid var(--accent-color);
            padding: 1rem 1.5rem;
            border-radius: 12px;
            box-shadow: var(--shadow-lg);
            display: flex;
            align-items: center;
            gap: 0.75rem;
            color: #fff;
            font-size: 0.9rem;
            min-width: 280px;
            animation: slideInRight 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            transition: var(--transition);
        }

        .toast.success {
            border-left-color: var(--success);
        }

        .toast.error {
            border-left-color: var(--danger);
        }

        .toast.warning {
            border-left-color: var(--warning);
        }

        /* ================= ONBOARDING OVERLAY ================= */
        .onboarding-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background-color: rgba(9, 13, 22, 0.9);
            backdrop-filter: blur(12px);
            z-index: 99999;
            display: flex;
            align-items: center;
            justify-content: center;
            opacity: 0;
            pointer-events: none;
            transition: var(--transition);
        }

        .onboarding-overlay.active {
            opacity: 1;
            pointer-events: auto;
        }

        .onboarding-card {
            background: linear-gradient(135deg, var(--bg-secondary) 0%, rgba(25, 30, 48, 0.95) 100%);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 24px;
            width: 90%;
            max-width: 550px;
            padding: 3rem 2.5rem;
            text-align: center;
            box-shadow: var(--shadow-lg);
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 1.5rem;
            transform: scale(0.9);
            transition: var(--transition);
        }

        .onboarding-overlay.active .onboarding-card {
            transform: scale(1);
        }

        .onboarding-logo {
            width: 64px;
            height: 64px;
            background: var(--accent-gradient);
            border-radius: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 8px 24px rgba(59, 130, 246, 0.4);
            margin-bottom: 0.5rem;
        }

        .onboarding-logo i {
            color: #fff;
            stroke-width: 2.2;
        }

        .onboarding-card h2 {
            font-size: 1.6rem;
            font-weight: 700;
            color: #fff;
        }

        .onboarding-card p {
            color: var(--text-secondary);
            font-size: 0.95rem;
            line-height: 1.6;
        }

        /* Animations */
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(8px); }
            to { opacity: 1; transform: translateY(0); }
        }

        @keyframes slideInRight {
            from { opacity: 0; transform: translateX(100%); }
            to { opacity: 1; transform: translateX(0); }
        }

        /* Responsiveness */
        @media (max-width: 1024px) {
            .dashboard-grid, .categories-grid {
                grid-template-columns: 1fr;
            }
        }

        @media (max-width: 768px) {
            .sidebar {
                transform: translateX(-100%);
            }
            .sidebar.mobile-open {
                transform: translateX(0);
            }
            .main-content {
                margin-left: 0;
                width: 100%;
                padding: 1.5rem;
            }
        }

        /* Estilos para Onboarding Condominio */
        .inmueble-type-card {
            background-color: var(--bg-card-hover);
            border: 1px solid var(--border-color);
            border-radius: 16px;
            padding: 1.5rem 1rem;
            display: flex;
            flex-direction: column;
            align-items: center;
            cursor: pointer;
            transition: var(--transition);
            text-align: center;
        }
        .inmueble-type-card:hover {
            border-color: var(--accent-color);
            background-color: rgba(59, 130, 246, 0.05);
            transform: translateY(-2px);
        }
        .inmueble-type-card.selected {
            border-color: var(--accent-color);
            background-color: rgba(59, 130, 246, 0.1);
            box-shadow: 0 0 12px var(--accent-glow);
        }
        .checkbox-grid label {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            font-size: 0.85rem;
            color: var(--text-secondary);
            cursor: pointer;
            padding: 0.25rem 0;
        }
        .checkbox-grid input[type="checkbox"] {
            accent-color: var(--accent-color);
            width: 15px;
            height: 15px;
            cursor: pointer;
        }
        .wizard-actions {
            display: flex;
            justify-content: space-between;
            gap: 1rem;
        }
        .wizard-actions button {
            flex: 1;
            padding: 0.75rem;
            font-weight: 600;
        }
    </style>
</head>
<body>

    <!-- ================= PORTAL ROLE SELECTOR ================= -->
    <div id="portal-role-container" style="display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 100vh; background: radial-gradient(circle at top right, #1e1b4b, #09090b); padding: 2rem; font-family: 'Outfit', sans-serif;">
        <div style="text-align: center; margin-bottom: 3rem; max-width: 600px;">
            <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); padding: 0.8rem; border-radius: 50%; width: 64px; height: 64px; display: flex; align-items: center; justify-content: center; margin: 0 auto 1rem; box-shadow: 0 8px 32px rgba(0,0,0,0.5);">
                <i data-lucide="building-2" style="width: 32px; height: 32px; color: var(--accent-color);"></i>
            </div>
            <h1 style="font-size: 2.2rem; font-weight: 800; color: #fff; margin-bottom: 0.5rem; letter-spacing: -0.025em; background: linear-gradient(135deg, #fff, #a1a1aa); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">Portal de Acceso RedVecino</h1>
            <p style="font-size: 0.95rem; color: var(--text-secondary);">Seleccione el perfil de acceso correspondiente para ingresar a la plataforma.</p>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 1.5rem; max-width: 1100px; width: 100%;">
            <!-- Card TI -->
            <div onclick="switchRole('ti')" style="background: rgba(30,27,75,0.25); border: 1px solid rgba(139,92,246,0.15); border-radius: 16px; padding: 2rem; cursor: pointer; transition: all 0.3s; position: relative; overflow: hidden; display: flex; flex-direction: column; justify-content: space-between; min-height: 240px; backdrop-filter: blur(12px);" onmouseover="this.style.transform='translateY(-6px)'; this.style.borderColor='rgba(139,92,246,0.5)'; this.style.boxShadow='0 20px 40px rgba(139,92,246,0.15)';" onmouseout="this.style.transform='translateY(0)'; this.style.borderColor='rgba(139,92,246,0.15)'; this.style.boxShadow='none';">
                <div>
                    <div style="background: linear-gradient(135deg, #8b5cf6, #6366f1); border-radius: 12px; width: 44px; height: 44px; display: flex; align-items: center; justify-content: center; margin-bottom: 1.5rem; box-shadow: 0 4px 12px rgba(139,92,246,0.3);">
                        <i data-lucide="terminal" style="width: 22px; height: 22px; color: #fff;"></i>
                    </div>
                    <h3 style="font-size: 1.15rem; font-weight: 700; color: #fff; margin-bottom: 0.5rem;">Súper Administrador TI</h3>
                    <p style="font-size: 0.85rem; color: var(--text-secondary); line-height: 1.5;">Configuración de condominios, asignación de administradores y accesos de soporte técnico global.</p>
                </div>
                <div style="display: flex; align-items: center; gap: 0.25rem; font-size: 0.8rem; font-weight: 600; color: #a78bfa; margin-top: 1.5rem;">
                    <span>Ingresar</span> <i data-lucide="arrow-right" style="width: 14px; height: 14px;"></i>
                </div>
            </div>

            <!-- Card Admin -->
            <div onclick="openSelectCondominioAdminModal()" style="background: rgba(3,105,161,0.15); border: 1px solid rgba(14,165,233,0.15); border-radius: 16px; padding: 2rem; cursor: pointer; transition: all 0.3s; position: relative; overflow: hidden; display: flex; flex-direction: column; justify-content: space-between; min-height: 240px; backdrop-filter: blur(12px);" onmouseover="this.style.transform='translateY(-6px)'; this.style.borderColor='rgba(14,165,233,0.5)'; this.style.boxShadow='0 20px 40px rgba(14,165,233,0.15)';" onmouseout="this.style.transform='translateY(0)'; this.style.borderColor='rgba(14,165,233,0.15)'; this.style.boxShadow='none';">
                <div>
                    <div style="background: linear-gradient(135deg, #0ea5e9, #2563eb); border-radius: 12px; width: 44px; height: 44px; display: flex; align-items: center; justify-content: center; margin-bottom: 1.5rem; box-shadow: 0 4px 12px rgba(14,165,233,0.3);">
                        <i data-lucide="shield-check" style="width: 22px; height: 22px; color: #fff;"></i>
                    </div>
                    <h3 style="font-size: 1.15rem; font-weight: 700; color: #fff; margin-bottom: 0.5rem;">Administración de Condominio</h3>
                    <p style="font-size: 0.85rem; color: var(--text-secondary); line-height: 1.5;">Gestión operativa del condominio, control de egresos, cobro de gastos comunes y personal.</p>
                </div>
                <div style="display: flex; align-items: center; gap: 0.25rem; font-size: 0.8rem; font-weight: 600; color: #38bdf8; margin-top: 1.5rem;">
                    <span>Ingresar</span> <i data-lucide="arrow-right" style="width: 14px; height: 14px;"></i>
                </div>
            </div>

            <!-- Card Copropietario -->
            <div onclick="switchRole('usuario')" style="background: rgba(6,78,59,0.15); border: 1px solid rgba(16,185,129,0.15); border-radius: 16px; padding: 2rem; cursor: pointer; transition: all 0.3s; position: relative; overflow: hidden; display: flex; flex-direction: column; justify-content: space-between; min-height: 240px; backdrop-filter: blur(12px);" onmouseover="this.style.transform='translateY(-6px)'; this.style.borderColor='rgba(16,185,129,0.5)'; this.style.boxShadow='0 20px 40px rgba(16,185,129,0.15)';" onmouseout="this.style.transform='translateY(0)'; this.style.borderColor='rgba(16,185,129,0.15)'; this.style.boxShadow='none';">
                <div>
                    <div style="background: linear-gradient(135deg, #10b981, #059669); border-radius: 12px; width: 44px; height: 44px; display: flex; align-items: center; justify-content: center; margin-bottom: 1.5rem; box-shadow: 0 4px 12px rgba(16,185,129,0.3);">
                        <i data-lucide="users" style="width: 22px; height: 22px; color: #fff;"></i>
                    </div>
                    <h3 style="font-size: 1.15rem; font-weight: 700; color: #fff; margin-bottom: 0.5rem;">Portal de Copropietarios</h3>
                    <p style="font-size: 0.85rem; color: var(--text-secondary); line-height: 1.5;">Consulta tus estados de pago, descarga boletas históricas y reserva áreas comunes en tiempo real.</p>
                </div>
                <div style="display: flex; align-items: center; gap: 0.25rem; font-size: 0.8rem; font-weight: 600; color: #34d399; margin-top: 1.5rem;">
                    <span>Ingresar</span> <i data-lucide="arrow-right" style="width: 14px; height: 14px;"></i>
                </div>
            </div>

            <!-- Card Colaborador -->
            <div onclick="switchRole('colaborador')" style="background: rgba(120,53,4,0.15); border: 1px solid rgba(245,158,11,0.15); border-radius: 16px; padding: 2rem; cursor: pointer; transition: all 0.3s; position: relative; overflow: hidden; display: flex; flex-direction: column; justify-content: space-between; min-height: 240px; backdrop-filter: blur(12px);" onmouseover="this.style.transform='translateY(-6px)'; this.style.borderColor='rgba(245,158,11,0.5)'; this.style.boxShadow='0 20px 40px rgba(245,158,11,0.15)';" onmouseout="this.style.transform='translateY(0)'; this.style.borderColor='rgba(245,158,11,0.15)'; this.style.boxShadow='none';">
                <div>
                    <div style="background: linear-gradient(135deg, #f59e0b, #d97706); border-radius: 12px; width: 44px; height: 44px; display: flex; align-items: center; justify-content: center; margin-bottom: 1.5rem; box-shadow: 0 4px 12px rgba(245,158,11,0.3);">
                        <i data-lucide="briefcase" style="width: 22px; height: 22px; color: #fff;"></i>
                    </div>
                    <h3 style="font-size: 1.15rem; font-weight: 700; color: #fff; margin-bottom: 0.5rem;">Portal de Colaboradores</h3>
                    <p style="font-size: 0.85rem; color: var(--text-secondary); line-height: 1.5;">Consulta tus funciones, horarios de trabajo, liquidaciones mensuales e insumos de limpieza.</p>
                </div>
                <div style="display: flex; align-items: center; gap: 0.25rem; font-size: 0.8rem; font-weight: 600; color: #fbbf24; margin-top: 1.5rem;">
                    <span>Ingresar</span> <i data-lucide="arrow-right" style="width: 14px; height: 14px;"></i>
                </div>
            </div>
        </div>
    </div>

    <!-- ================= DASHBOARD DE TI (SÚPER ADMINISTRADOR) ================= -->
    <div id="role-ti-container" style="display: none; min-height: 100vh; background: #09090b; padding: 2rem; font-family: 'Outfit', sans-serif;">
        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border-color); padding-bottom: 1.5rem; margin-bottom: 2rem;">
            <div>
                <h1 style="font-size: 1.8rem; color: #fff; font-weight: 800; margin: 0; display: flex; align-items: center; gap: 0.5rem;">
                    <i data-lucide="terminal" style="color: #8b5cf6;"></i> Control de TI y Condominios
                </h1>
                <span style="font-size: 0.85rem; color: var(--text-secondary);">Súper Administrador / Configuración Global del Sistema.</span>
            </div>
            <button class="btn btn-secondary" onclick="switchRole('portal')" style="display: flex; align-items: center; gap: 0.5rem; font-weight: 600; font-size: 0.85rem; padding: 0.6rem 1.2rem;">
                <i data-lucide="log-out" style="width: 16px; height: 16px;"></i> Volver al Portal
            </button>
        </div>

        <div style="display: flex; flex-direction: column; gap: 2rem;">
            <!-- Panel Condominios -->
            <div class="card-panel" style="padding: 2rem;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; flex-wrap: wrap; gap: 1rem;">
                    <h3 style="margin: 0; font-size: 1.1rem; color: #fff; font-weight: 700; display: flex; align-items: center; gap: 0.5rem;">
                        <i data-lucide="building" style="color: var(--accent-color);"></i> Condominios Registrados en la Plataforma
                    </h3>
                    <button class="btn btn-primary" onclick="clearTICondominioForm()" style="display: flex; align-items: center; gap: 0.5rem; font-size: 0.85rem; box-shadow: 0 4px 12px rgba(139,92,246,0.3);">
                        <i data-lucide="plus-circle" style="width: 16px; height: 16px;"></i> Limpiar Formulario / Crear Nuevo
                    </button>
                </div>

                <div class="table-responsive" style="border: 1px solid var(--border-color); border-radius: 8px;">
                    <table class="table" style="font-size: 0.85rem; margin: 0; min-width: 900px;">
                        <thead>
                            <tr>
                                <th style="padding: 0.8rem 0.5rem;">Nombre</th>
                                <th style="padding: 0.8rem 0.5rem;">RUT</th>
                                <th style="padding: 0.8rem 0.5rem;">Dirección</th>
                                <th style="padding: 0.8rem 0.5rem;">Administrador</th>
                                <th style="padding: 0.8rem 0.5rem; text-align: center;">Tipo</th>
                                <th style="padding: 0.8rem 0.5rem; width: 340px; text-align: center;">Acciones de Acceso y Gestión</th>
                            </tr>
                        </thead>
                        <tbody id="tbody-ti-condominios">
                            <!-- Dinámico -->
                        </tbody>
                    </table>
                </div>
            </div>

            <!-- Panel Formulario: Bloque de Creación Abajo del Primer Bloque -->
            <div class="card-panel" style="padding: 2rem;" id="ti-condo-form-card">
                <h3 id="ti-modal-title" style="margin: 0 0 1.5rem 0; color: #fff; font-size: 1.2rem; font-weight: 700; display: flex; align-items: center; gap: 0.5rem;">
                    <i data-lucide="edit-3" style="color: #8b5cf6; width: 20px; height: 20px;"></i> Registrar Nuevo Condominio
                </h3>
                <form id="form-ti-condominio" onsubmit="submitTICondominio(event)">
                    <input type="hidden" id="ti-condo-id" value="">
                    <div class="grid-2col" style="display: grid; grid-template-columns: 1.2fr 1fr; gap: 1rem;">
                        <div class="form-group">
                            <label for="ti-condo-nombre">Nombre del Condominio *</label>
                            <input type="text" id="ti-condo-nombre" class="form-control" placeholder="Ej: Condominio Las Palmas" required style="height: 38px; font-size: 0.85rem;">
                        </div>
                        <div class="form-group">
                            <label for="ti-condo-rut">RUT *</label>
                            <input type="text" id="ti-condo-rut" class="form-control" placeholder="Ej: 76.543.210-K" required style="height: 38px; font-size: 0.85rem;">
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="ti-condo-direccion">Dirección *</label>
                        <input type="text" id="ti-condo-direccion" class="form-control" placeholder="Ej: Av. Vitacura 1234, Santiago" required style="height: 38px; font-size: 0.85rem;">
                    </div>
                    <div class="grid-2col" style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                        <div class="form-group">
                            <label for="ti-condo-tipo">Tipo de Inmueble *</label>
                            <select id="ti-condo-tipo" class="form-control" required style="height: 38px; font-size: 0.85rem;">
                                <option value="condominio_edificios">Edificios / Torres de Deptos</option>
                                <option value="condominio_casas">Condominio de Casas / Parcelas</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="ti-condo-administrador">Administrador Asignado</label>
                            <input type="text" id="ti-condo-administrador" class="form-control" placeholder="Nombre del administrador" style="height: 38px; font-size: 0.85rem;">
                        </div>
                    </div>
                    <div class="grid-2col" style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                        <div class="form-group">
                            <label for="ti-condo-email">Email de Contacto</label>
                            <input type="email" id="ti-condo-email" class="form-control" placeholder="contacto@condominio.cl" style="height: 38px; font-size: 0.85rem;">
                        </div>
                        <div class="form-group">
                            <label for="ti-condo-telefono">Teléfono</label>
                            <input type="text" id="ti-condo-telefono" class="form-control" placeholder="+56912345678" style="height: 38px; font-size: 0.85rem;">
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="ti-condo-sitio">Sitio Web</label>
                        <input type="text" id="ti-condo-sitio" class="form-control" placeholder="www.condominio.cl" style="height: 38px; font-size: 0.85rem;">
                    </div>
                    <div class="form-group">
                        <label for="ti-condo-descripcion">Descripción / Notas Adicionales</label>
                        <textarea id="ti-condo-descripcion" class="form-control" placeholder="Detalles o especificaciones..." style="font-size: 0.85rem; min-height: 60px;"></textarea>
                    </div>
                    <div style="display: flex; gap: 1rem; justify-content: flex-end; margin-top: 1.5rem;">
                        <button type="button" class="btn btn-secondary" onclick="clearTICondominioForm()" style="font-size: 0.85rem;">Limpiar Formulario</button>
                        <button type="submit" class="btn btn-primary" style="font-size: 0.85rem; background: #8b5cf6; border-color: #8b5cf6;">Guardar Condominio</button>
                    </div>
                </form>
            </div>
        </div>
    </div>

    <!-- ================= PORTAL DE COPROPIETARIOS (USUARIOS) ================= -->
    <div id="role-usuario-container" style="display: none; min-height: 100vh; background: #09090b; padding: 2rem; font-family: 'Outfit', sans-serif;">
        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border-color); padding-bottom: 1.5rem; margin-bottom: 2rem; flex-wrap: wrap; gap: 1rem;">
            <div style="display: flex; align-items: center; gap: 1.5rem; flex-wrap: wrap;">
                <div>
                    <h1 style="font-size: 1.8rem; color: #fff; font-weight: 800; margin: 0; display: flex; align-items: center; gap: 0.5rem;">
                        <i data-lucide="users" style="color: #10b981;"></i> Portal de Copropietarios
                    </h1>
                    <span style="font-size: 0.85rem; color: var(--text-secondary);">Consulta financiera, estado de cuentas y reservas de áreas comunes.</span>
                </div>
                <div class="form-group" style="margin: 0; min-width: 200px;">
                    <label for="portal-usuario-condominio-select" style="font-size: 0.75rem; color: var(--text-secondary); margin-bottom: 0.25rem;">1. Seleccione Condominio</label>
                    <select id="portal-usuario-condominio-select" class="form-control" onchange="onSelectUsuarioCondominio()" style="height: 38px; font-size: 0.85rem; padding: 0.4rem;"></select>
                </div>
                <div class="form-group" style="margin: 0; min-width: 200px;">
                    <label for="portal-usuario-propiedad-select" style="font-size: 0.75rem; color: var(--text-secondary); margin-bottom: 0.25rem;">2. Seleccione su Unidad</label>
                    <select id="portal-usuario-propiedad-select" class="form-control" onchange="onSelectUsuarioPropiedad()" style="height: 38px; font-size: 0.85rem; padding: 0.4rem;"></select>
                </div>
            </div>
            <button class="btn btn-secondary" onclick="switchRole('portal')" style="display: flex; align-items: center; gap: 0.5rem; font-weight: 600; font-size: 0.85rem; padding: 0.6rem 1.2rem;">
                <i data-lucide="log-out" style="width: 16px; height: 16px;"></i> Volver al Portal
            </button>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 2.2fr; gap: 1.5rem; align-items: start;" id="usuario-portal-content">
            <!-- Columna Ficha Unidad -->
            <div style="display: flex; flex-direction: column; gap: 1.5rem;">
                <div class="card-panel" style="padding: 1.5rem;">
                    <h4 style="margin: 0 0 1rem 0; font-size: 0.95rem; color: #fff; font-weight: 700; border-bottom: 1px solid var(--border-color); padding-bottom: 0.5rem; display: flex; align-items: center; gap: 0.5rem;">
                        <i data-lucide="home" style="color: var(--accent-color); width: 18px; height: 18px;"></i> Ficha de Propiedad
                    </h4>
                    <div style="display: flex; flex-direction: column; gap: 0.8rem; font-size: 0.85rem;" id="portal-usuario-ficha-body">
                        <!-- Dinámico -->
                    </div>
                </div>

                <!-- Formulario de Ticket (Sugerencias, Reclamos, etc.) -->
                <div class="card-panel" style="padding: 1.5rem;">
                    <h4 style="margin: 0 0 1rem 0; font-size: 0.95rem; color: #fff; font-weight: 700; border-bottom: 1px solid var(--border-color); padding-bottom: 0.5rem; display: flex; align-items: center; gap: 0.5rem;">
                        <i data-lucide="message-square" style="color: var(--accent-color); width: 18px; height: 18px;"></i> Enviar Ticket de Contacto
                    </h4>
                    <form id="form-resident-ticket" onsubmit="submitResidentTicket(event)">
                        <div class="form-group" style="margin-bottom: 0.75rem;">
                            <label for="ticket-nombre" style="font-size: 0.75rem; color: var(--text-secondary); margin-bottom: 0.25rem; display: block;">Su Nombre *</label>
                            <input type="text" id="ticket-nombre" class="form-control" required placeholder="Ej: Juan Pérez" style="font-size: 0.8rem; padding: 0.4rem 0.6rem;">
                        </div>
                        <div class="form-group" style="margin-bottom: 0.75rem;">
                            <label for="ticket-correo" style="font-size: 0.75rem; color: var(--text-secondary); margin-bottom: 0.25rem; display: block;">Su Correo *</label>
                            <input type="email" id="ticket-correo" class="form-control" required placeholder="Ej: juan@correo.com" style="font-size: 0.8rem; padding: 0.4rem 0.6rem;">
                        </div>
                        <div class="form-group" style="margin-bottom: 0.75rem;">
                            <label for="ticket-asunto-tipo" style="font-size: 0.75rem; color: var(--text-secondary); margin-bottom: 0.25rem; display: block;">Tipo de Asunto *</label>
                            <select id="ticket-asunto-tipo" class="form-control" required style="font-size: 0.8rem; padding: 0.4rem; height: 34px;">
                                <option value="consulta">Consulta</option>
                                <option value="sugerencia">Sugerencia</option>
                                <option value="queja">Queja</option>
                                <option value="reclamo">Reclamo</option>
                            </select>
                        </div>
                        <div class="form-group" style="margin-bottom: 1rem;">
                            <label for="ticket-descripcion" style="font-size: 0.75rem; color: var(--text-secondary); margin-bottom: 0.25rem; display: block;">Descripción *</label>
                            <textarea id="ticket-descripcion" class="form-control" required rows="4" placeholder="Escriba aquí los detalles..." style="font-size: 0.8rem; padding: 0.4rem 0.6rem; resize: vertical;"></textarea>
                        </div>
                        <button class="btn btn-primary" type="submit" style="width: 100%; justify-content: center; font-size: 0.8rem; padding: 0.5rem 1rem;">
                            <i data-lucide="send" style="width: 14px; height: 14px; margin-right: 0.25rem;"></i> Enviar Ticket
                        </button>
                    </form>
                </div>
            </div>

            <!-- Columna Principal de Contenido -->
            <div style="display: flex; flex-direction: column; gap: 1.5rem;">
                <!-- Gastos Comunes -->
                <div class="card-panel" style="padding: 1.5rem;">
                    <h4 style="margin: 0 0 1rem 0; font-size: 0.95rem; color: #fff; font-weight: 700; border-bottom: 1px solid var(--border-color); padding-bottom: 0.5rem; display: flex; align-items: center; gap: 0.5rem;">
                        <i data-lucide="dollar-sign" style="color: #10b981; width: 18px; height: 18px;"></i> Gastos Comunes y Cobros Recientes
                    </h4>
                    <div id="portal-usuario-gastos-recientes" style="margin-bottom: 1.5rem;">
                        <!-- Dinámico (Muestra el mes actual) -->
                    </div>
                    
                    <h5 style="margin: 1.5rem 0 0.75rem 0; font-size: 0.85rem; color: #fff; font-weight: 700;">Historial de Cobros Recibidos</h5>
                    <div class="table-responsive" style="border: 1px solid var(--border-color); border-radius: 8px;">
                        <table class="table" style="font-size: 0.8rem; margin: 0;">
                            <thead>
                                <tr>
                                    <th style="padding: 0.6rem 0.5rem;">Período</th>
                                    <th style="padding: 0.6rem 0.5rem; text-align: center;">Vencimiento</th>
                                    <th style="padding: 0.6rem 0.5rem; text-align: right;">Total Mes</th>
                                    <th style="padding: 0.6rem 0.5rem; text-align: right; color: var(--danger);">Mora</th>
                                    <th style="padding: 0.6rem 0.5rem; text-align: right; font-weight: bold; color: #fff;">Total Cobrado</th>
                                    <th style="padding: 0.6rem 0.5rem; text-align: center;">Estado</th>
                                    <th style="padding: 0.6rem 0.5rem; text-align: center; width: 120px;">Acción</th>
                                </tr>
                            </thead>
                            <tbody id="tbody-portal-usuario-boletas">
                                <!-- Dinámico -->
                            </tbody>
                        </table>
                    </div>
                </div>

                <!-- Arriendo de Áreas Comunes -->
                <div class="card-panel" style="padding: 1.5rem;">
                    <h4 style="margin: 0 0 1rem 0; font-size: 0.95rem; color: #fff; font-weight: 700; border-bottom: 1px solid var(--border-color); padding-bottom: 0.5rem; display: flex; align-items: center; gap: 0.5rem;">
                        <i data-lucide="key" style="color: #fbbf24; width: 18px; height: 18px;"></i> Reservar / Alquilar Área Común
                    </h4>
                    
                    <div style="display: grid; grid-template-columns: 1fr 1.5fr; gap: 1.5rem; align-items: start;">
                        <!-- Formulario de Reserva -->
                        <form id="form-portal-usuario-reserva" onsubmit="submitPortalUsuarioReserva(event)">
                            <div class="form-group">
                                <label for="portal-reserva-area-id">Seleccione Área Común *</label>
                                <select id="portal-reserva-area-id" class="form-control" required onchange="onSelectPortalReservaArea()" style="height: 38px; font-size: 0.85rem; padding: 0.4rem;"></select>
                            </div>
                            <div class="form-group">
                                <label for="portal-reserva-fecha">Fecha del Arriendo *</label>
                                <input type="date" id="portal-reserva-fecha" class="form-control" required onchange="checkPortalReservaConflictHint()" style="height: 38px; font-size: 0.85rem; padding: 0.4rem 0.6rem;">
                            </div>
                            <div class="grid-2col" style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                                <div class="form-group">
                                    <label for="portal-reserva-hora-inicio">Hora Inicio *</label>
                                    <input type="time" id="portal-reserva-hora-inicio" class="form-control" required onchange="checkPortalReservaConflictHint()" style="height: 38px; font-size: 0.85rem; padding: 0.4rem 0.6rem;">
                                </div>
                                <div class="form-group">
                                    <label for="portal-reserva-hora-fin">Hora Fin *</label>
                                    <input type="time" id="portal-reserva-hora-fin" class="form-control" required onchange="checkPortalReservaConflictHint()" style="height: 38px; font-size: 0.85rem; padding: 0.4rem 0.6rem;">
                                </div>
                            </div>
                            <div class="form-group">
                                <label for="portal-reserva-monto">Monto a Pagar ($)</label>
                                <input type="number" id="portal-reserva-monto" class="form-control" readonly style="height: 38px; font-size: 0.85rem; padding: 0.4rem 0.6rem; background: rgba(255,255,255,0.02); color: var(--text-secondary);">
                            </div>
                            <div class="form-group">
                                <label for="portal-reserva-observaciones">Observaciones / Notas</label>
                                <textarea id="portal-reserva-observaciones" class="form-control" placeholder="Ej: Cumpleaños familiar..." style="font-size: 0.85rem; padding: 0.4rem; min-height: 50px;"></textarea>
                            </div>
                            <div id="portal-reserva-conflict-hint" style="display: none; background: rgba(239, 68, 68, 0.1); color: var(--danger); border: 1px solid var(--danger); border-radius: 6px; padding: 0.5rem; font-size: 0.75rem; margin-bottom: 1rem;">
                                ⚠️ Horario no disponible: Esta área ya está arrendada para este tramo.
                            </div>
                            <button type="submit" class="btn btn-primary" style="width: 100%; font-size: 0.85rem; padding: 0.5rem;" id="btn-save-portal-reserva">Confirmar Reserva</button>
                        </form>

                        <!-- Calendario Visual en el Portal -->
                        <div style="border-left: 1px solid var(--border-color); padding-left: 1.5rem;">
                            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                                <div style="display: flex; align-items: center; gap: 0.25rem;">
                                    <button class="btn btn-secondary" onclick="changePortalReservaCalendarMonth(-1)" style="padding: 0.25rem 0.4rem; min-width: auto; height: auto;"><i data-lucide="chevron-left" style="width:12px; height:12px;"></i></button>
                                    <span id="portal-reserva-calendar-title" style="font-size: 0.8rem; font-weight: 600; color: #fff; min-width: 100px; text-align: center;">Mes Año</span>
                                    <button class="btn btn-secondary" onclick="changePortalReservaCalendarMonth(1)" style="padding: 0.25rem 0.4rem; min-width: auto; height: auto;"><i data-lucide="chevron-right" style="width:12px; height:12px;"></i></button>
                                </div>
                                <div id="portal-reserva-areas-legend" style="display: flex; gap: 0.5rem; font-size: 0.7rem; color: var(--text-secondary); flex-wrap: wrap;"></div>
                            </div>
                            <div style="display: grid; grid-template-columns: repeat(7, 1fr); gap: 1px; background: var(--border-color); border: 1px solid var(--border-color); border-radius: 6px; overflow: hidden;" id="portal-reserva-calendar-grid">
                                <!-- Calendario dinámico para el usuario -->
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- ================= PORTAL DE COLABORADORES (TRABAJADORES) ================= -->
    <div id="role-colaborador-container" style="display: none; min-height: 100vh; background: #09090b; padding: 2rem; font-family: 'Outfit', sans-serif;">
        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border-color); padding-bottom: 1.5rem; margin-bottom: 2rem; flex-wrap: wrap; gap: 1rem;">
            <div style="display: flex; align-items: center; gap: 1.5rem; flex-wrap: wrap;">
                <div>
                    <h1 style="font-size: 1.8rem; color: #fff; font-weight: 800; margin: 0; display: flex; align-items: center; gap: 0.5rem;">
                        <i data-lucide="briefcase" style="color: #f59e0b;"></i> Portal de Colaboradores
                    </h1>
                    <span style="font-size: 0.85rem; color: var(--text-secondary);">Consulta tu horario, descarga liquidaciones de sueldo y realiza pedidos de insumos.</span>
                </div>
                <div class="form-group" style="margin: 0; min-width: 200px;">
                    <label for="portal-colaborador-condominio-select" style="font-size: 0.75rem; color: var(--text-secondary); margin-bottom: 0.25rem;">1. Seleccione Condominio</label>
                    <select id="portal-colaborador-condominio-select" class="form-control" onchange="onSelectColaboradorCondominio()" style="height: 38px; font-size: 0.85rem; padding: 0.4rem;"></select>
                </div>
                <div class="form-group" style="margin: 0; min-width: 200px;">
                    <label for="portal-colaborador-select" style="font-size: 0.75rem; color: var(--text-secondary); margin-bottom: 0.25rem;">2. Seleccione su Ficha de Personal</label>
                    <select id="portal-colaborador-select" class="form-control" onchange="onSelectPortalColaborador()" style="height: 38px; font-size: 0.85rem; padding: 0.4rem;"></select>
                </div>
            </div>
            <button class="btn btn-secondary" onclick="switchRole('portal')" style="display: flex; align-items: center; gap: 0.5rem; font-weight: 600; font-size: 0.85rem; padding: 0.6rem 1.2rem;">
                <i data-lucide="log-out" style="width: 16px; height: 16px;"></i> Volver al Portal
            </button>
        </div>

        <div style="display: grid; grid-template-columns: 1.1fr 2fr; gap: 1.5rem; align-items: start;" id="colaborador-portal-content">
            <!-- Columna Ficha y Horario -->
            <div style="display: flex; flex-direction: column; gap: 1.5rem;">
                <!-- Datos personales -->
                <div class="card-panel" style="padding: 1.5rem;">
                    <h4 style="margin: 0 0 1rem 0; font-size: 0.95rem; color: #fff; font-weight: 700; border-bottom: 1px solid var(--border-color); padding-bottom: 0.5rem; display: flex; align-items: center; gap: 0.5rem;">
                        <i data-lucide="user" style="color: var(--accent-color); width: 18px; height: 18px;"></i> Información de Contrato
                    </h4>
                    <div style="display: flex; flex-direction: column; gap: 0.8rem; font-size: 0.85rem;" id="portal-colaborador-ficha-body">
                        <!-- Dinámico -->
                    </div>
                </div>

                <!-- Horario de Trabajo -->
                <div class="card-panel" style="padding: 1.5rem;">
                    <h4 style="margin: 0 0 1rem 0; font-size: 0.95rem; color: #fff; font-weight: 700; border-bottom: 1px solid var(--border-color); padding-bottom: 0.5rem; display: flex; align-items: center; gap: 0.5rem;">
                        <i data-lucide="clock" style="color: var(--accent-color); width: 18px; height: 18px;"></i> Horario Laboral Asignado
                    </h4>
                    <div style="display: flex; flex-direction: column; gap: 0.5rem;" id="portal-colaborador-horario-body">
                        <!-- Dinámico -->
                    </div>
                </div>
            </div>

            <!-- Columna Principal -->
            <div style="display: flex; flex-direction: column; gap: 1.5rem;">
                <!-- Funciones y Documentación -->
                <div class="card-panel" style="padding: 1.5rem;">
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem;">
                        <div>
                            <h4 style="margin: 0 0 1rem 0; font-size: 0.95rem; color: #fff; font-weight: 700; border-bottom: 1px solid var(--border-color); padding-bottom: 0.5rem; display: flex; align-items: center; gap: 0.5rem;">
                                <i data-lucide="check-square" style="color: var(--accent-color); width: 18px; height: 18px;"></i> Funciones Principales
                            </h4>
                            <ul id="portal-colaborador-funciones-list" style="font-size: 0.85rem; padding-left: 1.2rem; display: flex; flex-direction: column; gap: 0.4rem; color: var(--text-secondary);">
                                <!-- Dinámico -->
                            </ul>
                        </div>
                        <div>
                            <h4 style="margin: 0 0 1rem 0; font-size: 0.95rem; color: #fff; font-weight: 700; border-bottom: 1px solid var(--border-color); padding-bottom: 0.5rem; display: flex; align-items: center; gap: 0.5rem;">
                                <i data-lucide="file-text" style="color: var(--accent-color); width: 18px; height: 18px;"></i> Documentación de Liquidación
                            </h4>
                            <div class="table-responsive" style="border: 1px solid var(--border-color); border-radius: 8px;">
                                <table class="table" style="font-size: 0.8rem; margin: 0;">
                                    <thead>
                                        <tr>
                                            <th style="padding: 0.5rem;">Período</th>
                                            <th style="padding: 0.5rem; text-align: center; width: 100px;">Acción</th>
                                        </tr>
                                    </thead>
                                    <tbody id="tbody-portal-colaborador-liquidaciones">
                                        <!-- Dinámico -->
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Pedidos de Insumos -->
                <div class="card-panel" id="portal-colaborador-insumos-panel" style="padding: 1.5rem;">
                    <h4 style="margin: 0 0 1rem 0; font-size: 0.95rem; color: #fff; font-weight: 700; border-bottom: 1px solid var(--border-color); padding-bottom: 0.5rem; display: flex; align-items: center; gap: 0.5rem;">
                        <i data-lucide="shopping-cart" style="color: #fbbf24; width: 18px; height: 18px;"></i> Pedido de Insumos y Repuestos
                    </h4>
                    
                    <div style="display: grid; grid-template-columns: 1.2fr 2fr; gap: 1.5rem; align-items: start;">
                        <!-- Formulario de Pedido -->
                        <form id="form-portal-colaborador-insumos" onsubmit="submitPortalColaboradorInsumo(event)">
                            <div class="form-group">
                                <label for="portal-insumo-categoria">Categoría del Pedido *</label>
                                <select id="portal-insumo-categoria" class="form-control" required style="height: 38px; font-size: 0.85rem; padding: 0.4rem;">
                                    <option value="limpieza">Insumos de Limpieza</option>
                                    <option value="repuesto">Repuestos o Herramientas</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label for="portal-insumo-nombre">Nombre del Artículo / Insumo *</label>
                                <input type="text" id="portal-insumo-nombre" class="form-control" placeholder="Ej: Cloro gel, Mopa, Ampolleta E27" required style="height: 38px; font-size: 0.85rem; padding: 0.4rem 0.6rem;">
                            </div>
                            <div class="form-group">
                                <label for="portal-insumo-cantidad">Cantidad Solicitada *</label>
                                <input type="number" id="portal-insumo-cantidad" class="form-control" min="1" value="1" required style="height: 38px; font-size: 0.85rem; padding: 0.4rem 0.6rem;">
                            </div>
                            <div class="form-group">
                                <label for="portal-insumo-observaciones">Observaciones / Justificación</label>
                                <textarea id="portal-insumo-observaciones" class="form-control" placeholder="Indique la justificación del pedido..." style="font-size: 0.85rem; padding: 0.4rem; min-height: 60px;"></textarea>
                            </div>
                            <button type="submit" class="btn btn-primary" style="width: 100%; font-size: 0.85rem; padding: 0.5rem;">Enviar Solicitud de Pedido</button>
                        </form>

                        <!-- Tabla Historial de Pedidos -->
                        <div style="border-left: 1px solid var(--border-color); padding-left: 1.5rem;">
                            <h5 style="margin: 0 0 0.75rem 0; font-size: 0.85rem; color: #fff; font-weight: 700;">Mis Solicitudes de Insumos</h5>
                            <div class="table-responsive" style="border: 1px solid var(--border-color); border-radius: 8px;">
                                <table class="table" style="font-size: 0.75rem; margin: 0;">
                                    <thead>
                                        <tr>
                                            <th style="padding: 0.5rem;">Artículo</th>
                                            <th style="padding: 0.5rem; text-align: center; width: 50px;">Cant.</th>
                                            <th style="padding: 0.5rem; text-align: center;">Categoría</th>
                                            <th style="padding: 0.5rem; text-align: center; width: 90px;">Estado</th>
                                        </tr>
                                    </thead>
                                    <tbody id="tbody-portal-colaborador-pedidos">
                                        <!-- Dinámico -->
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- ================= CONTEXTO APP ORIGINAL ================= -->
    <div class="app-container" style="display: none;">

        <!-- ================= SIDEBAR ================= -->
        <aside class="sidebar" id="sidebar">
            <div class="brand">
                <div class="brand-logo">
                    <i data-lucide="building-2"></i>
                </div>
                <span class="brand-name">RedVecino</span>
            </div>

            <nav class="menu">
                <ul class="menu-list">
                    <li class="menu-item">
                        <a onclick="switchView('dashboard')" class="menu-link active" id="menu-dashboard">
                            <i data-lucide="layout-dashboard"></i>
                            <span>Dashboard</span>
                        </a>

                    <li class="menu-item">
                        <a onclick="switchView('unidades')" class="menu-link" id="menu-unidades">
                            <i data-lucide="home"></i>
                            <span>Unidades</span>
                        </a>
                    </li>
                    <li class="menu-item">
                        <a onclick="switchView('residentes')" class="menu-link" id="menu-residentes">
                            <i data-lucide="users"></i>
                            <span>Residentes</span>
                        </a>
                    </li>
                    <li class="menu-item">
                        <a onclick="switchView('gasto_comun')" class="menu-link" id="menu-gasto_comun">
                            <i data-lucide="dollar-sign"></i>
                            <span>Gastos Comunes</span>
                        </a>
                    </li>
                    <li class="menu-item">
                        <a onclick="switchView('colaboradores')" class="menu-link" id="menu-colaboradores">
                            <i data-lucide="briefcase"></i>
                            <span>Colaboradores</span>
                        </a>
                    </li>
                    <li class="menu-item">
                        <a onclick="switchView('tickets')" class="menu-link" id="menu-tickets">
                            <i data-lucide="message-square"></i>
                            <span>Tickets</span>
                        </a>
                    </li>
                    <li class="menu-item">
                        <a onclick="switchView('perfil')" class="menu-link" id="menu-perfil">
                            <i data-lucide="settings"></i>
                            <span>Perfil del Condominio</span>
                        </a>
                    </li>
                </ul>
            </nav>

            <div class="sidebar-footer" style="padding-bottom: 1.5rem; display: flex; align-items: center; gap: 0.75rem; border-top: 1px solid var(--border-color); padding-top: 1.5rem; margin-top: auto;">
                <div class="admin-avatar" id="avatar-container" onclick="triggerAvatarUpload()">
                    <img id="avatar-img" src="" style="display: none; width: 100%; height: 100%; object-fit: cover;">
                    <span id="avatar-initials">AD</span>
                    <div class="avatar-edit-overlay">
                        <i data-lucide="pencil" style="width: 14px; height: 14px; color: #fff;"></i>
                    </div>
                </div>
                <input type="file" id="file-input-avatar" style="display: none;" accept="image/*" onchange="uploadAvatarFile(this)">
                <div class="admin-info">
                    <span class="admin-name" style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 120px;">Administrador</span>
                    <span class="admin-role" style="font-size: 0.75rem; color: var(--text-secondary);">Condominio Activo</span>
                    <a onclick="switchView('administrador')" class="admin-edit-link" id="menu-administrador">
                        <i data-lucide="pencil" style="width: 11px; height: 11px;"></i> Perfil
                    </a>
                </div>
            </div>
        </aside>

        <!-- ================= MAIN CONTENT ================= -->
        <main class="main-content">
            
            <!-- HEADER -->
            <header class="header">
                <div class="header-title">
                    <h1 id="view-title">Dashboard de Egresos</h1>
                    <p id="view-subtitle">Resumen financiero y control de gastos generales.</p>
                </div>
                <div class="header-actions" id="header-actions">
                    <button class="btn btn-primary" onclick="openEgresoModal()">
                        <i data-lucide="plus-circle"></i>
                        <span>Registrar Egreso</span>
                    </button>
                </div>
            </header>

            <!-- ================= VIEW: DASHBOARD ================= -->
            <div id="view-dashboard-container" class="view-container">
                <!-- KPIs Grid -->
                <div class="kpi-grid">
                    <!-- KPI 1 -->
                    <div class="kpi-card">
                        <div class="kpi-header">
                            <span class="kpi-title">Egresos este Mes</span>
                            <div class="kpi-icon" style="background: rgba(59, 130, 246, 0.15); color: #3b82f6;">
                                <i data-lucide="trending-up"></i>
                            </div>
                        </div>
                        <div class="kpi-value" id="kpi-mes-actual">$0</div>
                        <div class="kpi-change" id="kpi-comparacion">
                            <!-- Calculado dinámicamente -->
                        </div>
                    </div>
                    <!-- KPI 2 -->
                    <div class="kpi-card">
                        <div class="kpi-header">
                            <span class="kpi-title">Egresos Mes Anterior</span>
                            <div class="kpi-icon" style="background: rgba(139, 92, 246, 0.15); color: #8b5cf6;">
                                <i data-lucide="calendar"></i>
                            </div>
                        </div>
                        <div class="kpi-value" id="kpi-mes-anterior">$0</div>
                        <div class="kpi-change" style="color: var(--text-muted);">
                            Mes finalizado
                        </div>
                    </div>
                    <!-- KPI 3 -->
                    <div class="kpi-card">
                        <div class="kpi-header">
                            <span class="kpi-title">Gastos Prorrateados</span>
                            <div class="kpi-icon" style="background: rgba(245, 158, 11, 0.15); color: #f59e0b;">
                                <i data-lucide="split"></i>
                            </div>
                        </div>
                        <div class="kpi-value" id="kpi-prorrateados">0</div>
                        <div class="kpi-change" style="color: var(--warning);">
                            Cobros diferidos activos
                        </div>
                    </div>
                    <!-- KPI 4 -->
                    <div class="kpi-card">
                        <div class="kpi-header">
                            <span class="kpi-title">Transacciones del Mes</span>
                            <div class="kpi-icon" style="background: rgba(16, 185, 129, 0.15); color: #10b981;">
                                <i data-lucide="file-text"></i>
                            </div>
                        </div>
                        <div class="kpi-value" id="kpi-conteo">0</div>
                        <div class="kpi-change" style="color: var(--success);">
                            Documentos registrados
                        </div>
                    </div>
                </div>

                <!-- Gráficos y Resumen -->
                <div class="dashboard-grid" style="margin-top: 1.5rem;">
                    <!-- Histórico mensual -->
                    <div class="card-panel">
                        <div class="panel-header">
                            <span class="panel-title">Egresos - Historial 6 Meses</span>
                        </div>
                        <div class="chart-container">
                            <canvas id="chart-historico"></canvas>
                        </div>
                    </div>
                    <!-- Distribución Categorías -->
                    <div class="card-panel">
                        <div class="panel-header">
                            <span class="panel-title">Distribución por Categorías</span>
                        </div>
                        <div class="chart-container">
                            <canvas id="chart-categorias"></canvas>
                        </div>
                    </div>
                </div>
            </div>

            <!-- ================= VIEW: EGRESOS ================= -->
            <div id="view-egresos-container" class="view-container" style="display: none;"></div>

            <!-- ================= VIEW: UNIDADES ================= -->
            <div id="view-unidades-container" class="view-container" style="display: none;">
                <!-- Acciones superiores -->
                <div class="filters-panel" style="margin-bottom: 1.5rem; display: flex; justify-content: space-between; align-items: center; gap: 1rem;">
                    <div class="form-group" style="margin: 0; flex: 1; max-width: 300px;">
                        <input type="text" id="search-unidades" class="form-control" placeholder="Buscar por número o torre..." oninput="renderUnidadesGrid()">
                    </div>
                    <div style="display: flex; align-items: center; gap: 1rem;">
                        <span id="unidades-counter-badge" style="background: rgba(255,255,255,0.05); border: 1px solid var(--border-color); color: var(--text-secondary); font-size: 0.85rem; font-weight: 600; padding: 0.5rem 0.9rem; border-radius: 8px;">0 / 0</span>
                        <button class="btn btn-primary" onclick="openAddUnidadModal()" style="display: flex; align-items: center; gap: 0.5rem; box-shadow: 0 4px 12px var(--accent-glow);">
                            <i data-lucide="plus-circle"></i> Agregar Unidad Manual
                        </button>
                    </div>
                </div>

                <!-- Contenedor dinámico de grupos -->
                <div id="unidades-groups-wrapper" style="display: flex; flex-direction: column; gap: 2rem;">
                    <!-- Renderizado dinámico de Torres y Casas en JS -->
                </div>
            </div>

            <!-- ================= VIEW: PERFIL DEL CONDOMINIO ================= -->
            <div id="view-perfil-container" class="view-container" style="display: none;">
                <div class="grid-2col" style="display: grid; grid-template-columns: 1fr 1.25fr; gap: 1.5rem; margin-bottom: 2rem;">
                    
                    <!-- Panel Izquierdo: Información General -->
                    <div class="card-panel" style="padding: 1.5rem;">
                        <div class="panel-header" style="margin-bottom: 1.25rem;">
                            <span class="panel-title" style="display: flex; align-items: center; gap: 0.5rem;">
                                <i data-lucide="info" style="color: var(--accent-color);"></i> Información General
                            </span>
                        </div>
                        <form id="form-perfil-general" onsubmit="event.preventDefault();">
                            <div class="form-group">
                                <label for="perfil-nombre">Nombre del Condominio *</label>
                                <input type="text" id="perfil-nombre" class="form-control" placeholder="Ej: Condominio Las Camelias" required>
                            </div>
                            <div class="form-group">
                                <label for="perfil-tipo-inmueble">Tipo de Inmueble</label>
                                <select id="perfil-tipo-inmueble" class="form-control" required>
                                    <option value="condominio_edificios">Condominio de Edificios</option>
                                    <option value="condominio_casas">Condominio de Casas</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label for="perfil-rut">RUT de Identificación Legal *</label>
                                <input type="text" id="perfil-rut" class="form-control" placeholder="Ej: 76.543.210-K" required>
                            </div>
                            <div class="form-group">
                                <label for="perfil-direccion">Dirección Física *</label>
                                <input type="text" id="perfil-direccion" class="form-control" placeholder="Ej: Av. Collao 1234, Concepción" required>
                            </div>
                            <div class="form-group">
                                <label for="perfil-email">Correo Electrónico *</label>
                                <input type="email" id="perfil-email" class="form-control" placeholder="Ej: contacto@condominio.cl" required>
                            </div>
                            <div class="form-group">
                                <label for="perfil-telefono">Teléfono de Contacto *</label>
                                <input type="text" id="perfil-telefono" class="form-control" placeholder="Ej: +56 9 1234 5678" required>
                            </div>
                            <div class="form-group">
                                <label for="perfil-sitio-web">Sitio Web (Opcional)</label>
                                <input type="url" id="perfil-sitio-web" class="form-control" placeholder="Ej: https://www.condominio.cl">
                            </div>
                            <div class="form-group">
                                <label for="perfil-descripcion">Descripción / Notas</label>
                                <textarea id="perfil-descripcion" class="form-control" rows="3" placeholder="Breve descripción o información relevante del condominio..."></textarea>
                            </div>
                        </form>
                    </div>

                    <!-- Panel Derecho: Edición de Tipos de Unidades y Equipamiento -->
                    <div style="display: flex; flex-direction: column; gap: 1.5rem;">
                        
                        <!-- Sección: Estructura Física -->
                        <div class="card-panel" style="padding: 1.5rem;">
                            <div class="panel-header" style="margin-bottom: 1rem;">
                                <span class="panel-title" style="display: flex; align-items: center; gap: 0.5rem;">
                                    <i data-lucide="home" style="color: var(--accent-color);"></i> Estructura Física
                                </span>
                            </div>
                            
                            <!-- Campos para Torre -->
                            <div id="perfil-fields-torre" style="display: none;">
                                <div class="grid-3col" style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 0.75rem;">
                                    <div class="form-group" id="perfil-group-pisos">
                                        <label for="perfil-torre-pisos">Nro Pisos</label>
                                        <input type="number" id="perfil-torre-pisos" class="form-control" min="1" placeholder="Ej: 10">
                                    </div>
                                    <div class="form-group">
                                        <label for="perfil-torre-hab" id="label-perfil-torre-hab">U. Habitacionales</label>
                                        <input type="number" id="perfil-torre-hab" class="form-control" min="1" placeholder="Ej: 40">
                                    </div>
                                    <div class="form-group">
                                        <label for="perfil-torre-com">U. Comerciales</label>
                                        <input type="number" id="perfil-torre-com" class="form-control" min="0" placeholder="Ej: 2">
                                    </div>
                                </div>
                            </div>
                            
                            <!-- Campos para Condominio de Edificios -->
                            <div id="perfil-fields-edificios" style="display: none;">
                                <div class="grid-2col" style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; margin-bottom: 0;">
                                    <div class="form-group" style="margin-bottom: 0;">
                                        <label for="perfil-edif-num-torres">Número de Torres</label>
                                        <input type="number" id="perfil-edif-num-torres" class="form-control" min="1" placeholder="Ej: 3">
                                    </div>
                                    <div class="form-group" style="margin-bottom: 0;">
                                        <label for="perfil-edif-id-tipo">Identificación de Torres</label>
                                        <select id="perfil-edif-id-tipo" class="form-control">
                                            <option value="letras">Por Letras (A, B, C...)</option>
                                            <option value="numeros">Por Números (1, 2, 3...)</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            
                            <!-- Campos para Condominio de Casas -->
                            <div id="perfil-fields-casas" style="display: none;">
                                <div class="form-group" style="margin-bottom: 0;">
                                    <label for="perfil-casas-num">Número de Casas / Lotes</label>
                                    <input type="number" id="perfil-casas-num" class="form-control" min="1" placeholder="Ej: 50">
                                </div>
                            </div>
                        </div>

                        <!-- Sección: Tipos de Unidades -->
                        <div class="card-panel" style="padding: 1.5rem;">
                            <div class="panel-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                                <span class="panel-title" style="display: flex; align-items: center; gap: 0.5rem;">
                                    <i data-lucide="percent" style="color: var(--accent-color);"></i> Tipos de Unidades (Alícuotas)
                                </span>
                                <button type="button" class="btn btn-secondary" style="font-size: 0.75rem; padding: 0.35rem 0.75rem; min-width: auto;" onclick="addProfileUnitTypeRow()">
                                    <i data-lucide="plus" style="width: 14px; height: 14px; margin-right: 3px;"></i> Agregar
                                </button>
                            </div>
                            <div class="table-responsive" style="border: 1px solid var(--border-color); border-radius: 10px; max-height: 180px; overflow-y: auto;">
                                <table class="table" style="font-size: 0.8rem; min-width: 100%;">
                                    <thead style="position: sticky; top: 0; background: var(--bg-secondary); z-index: 10;">
                                        <tr>
                                            <th style="padding: 0.5rem;">Código</th>
                                            <th style="padding: 0.5rem;">Metros²</th>
                                            <th style="padding: 0.5rem;">% Prorrateo</th>
                                            <th style="padding: 0.5rem; width: 45px; text-align: center;">Acción</th>
                                        </tr>
                                    </thead>
                                    <tbody id="tbody-profile-unit-types">
                                        <!-- Dinámico -->
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <!-- Sección: Equipamiento y Áreas Comunes -->
                        <div class="card-panel" style="padding: 1.5rem;">
                            <div class="panel-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                                <span class="panel-title" style="display: flex; align-items: center; gap: 0.5rem;">
                                    <i data-lucide="key" style="color: var(--accent-color);"></i> Áreas Comunes y Equipamiento
                                </span>
                                <button type="button" class="btn btn-secondary" style="font-size: 0.75rem; padding: 0.35rem 0.75rem; min-width: auto;" onclick="addProfileEquipamientoRow()">
                                    <i data-lucide="plus" style="width: 14px; height: 14px; margin-right: 3px;"></i> Agregar
                                </button>
                            </div>
                            <div class="table-responsive" style="border: 1px solid var(--border-color); border-radius: 10px; max-height: 220px; overflow-y: auto;">
                                <table class="table" style="font-size: 0.8rem; min-width: 100%;">
                                    <thead style="position: sticky; top: 0; background: var(--bg-secondary); z-index: 10;">
                                        <tr>
                                            <th style="padding: 0.5rem;">Clasificación</th>
                                            <th style="padding: 0.5rem;">Nombre</th>
                                            <th style="padding: 0.5rem; width: 120px;">Condición</th>
                                            <th style="padding: 0.5rem; width: 45px; text-align: center;">Acción</th>
                                        </tr>
                                    </thead>
                                    <tbody id="tbody-profile-equipamiento">
                                        <!-- Dinámico -->
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <!-- Sección: Cargos de Colaboradores -->
                        <div class="card-panel" style="padding: 1.5rem; margin-top: 1.5rem;">
                            <div class="panel-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                                <span class="panel-title" style="display: flex; align-items: center; gap: 0.5rem;">
                                    <i data-lucide="briefcase" style="color: var(--accent-color);"></i> Cargos de Colaboradores
                                </span>
                                <button type="button" class="btn btn-secondary" style="font-size: 0.75rem; padding: 0.35rem 0.75rem; min-width: auto;" onclick="addProfileCargo()">
                                    <i data-lucide="plus" style="width: 14px; height: 14px; margin-right: 3px;"></i> Agregar Cargo
                                </button>
                            </div>
                            <div class="table-responsive" style="border: 1px solid var(--border-color); border-radius: 10px; max-height: 200px; overflow-y: auto;">
                                <table class="table" style="font-size: 0.8rem; min-width: 100%;">
                                    <thead style="position: sticky; top: 0; background: var(--bg-secondary); z-index: 10;">
                                        <tr>
                                            <th style="padding: 0.5rem;">Nombre del Cargo</th>
                                            <th style="padding: 0.5rem; width: 45px; text-align: center;">Acción</th>
                                        </tr>
                                    </thead>
                                    <tbody id="tbody-profile-cargos">
                                        <!-- Dinámico -->
                                    </tbody>
                                </table>
                            </div>
                        </div>

                    </div>

                </div>

                <div style="display: flex; justify-content: flex-end; margin-top: 1.5rem;">
                    <button class="btn btn-primary" onclick="saveCondominioProfile()" style="padding: 0.75rem 2rem; font-weight: 600; display: flex; align-items: center; gap: 0.5rem; box-shadow: 0 4px 15px var(--accent-glow);">
                        <i data-lucide="save"></i> Guardar Cambios del Perfil
                    </button>
                </div>
            </div>

            <!-- ================= VIEW: PERFIL DEL ADMINISTRADOR ================= -->
            <div id="view-administrador-container" class="view-container" style="display: none;">
                <div class="grid-2col" style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; margin-bottom: 2rem;">
                    
                    <!-- Panel Izquierdo: Datos del Administrador -->
                    <div class="card-panel" style="padding: 1.5rem;">
                        <div class="panel-header" style="margin-bottom: 1.25rem;">
                            <span class="panel-title" style="display: flex; align-items: center; gap: 0.5rem;">
                                <i data-lucide="user" style="color: var(--accent-color);"></i> Datos del Administrador
                            </span>
                        </div>
                        <form id="form-perfil-admin" onsubmit="event.preventDefault();">
                            <div class="form-group">
                                <label for="admin-nombre">Nombre Completo *</label>
                                <input type="text" id="admin-nombre" class="form-control" placeholder="Ej: Juan Pérez Muñoz" required>
                            </div>
                            <div class="form-group">
                                <label for="admin-rut">RUT Administrador *</label>
                                <input type="text" id="admin-rut" class="form-control" placeholder="Ej: 15.678.901-2" required>
                            </div>
                            <div class="form-group">
                                <label for="admin-rnac">Registro Nacional de Administradores (RNAC)</label>
                                <input type="text" id="admin-rnac" class="form-control" placeholder="Ej: RNAC-2026-9876">
                            </div>
                            <div class="form-group">
                                <label for="admin-telefono">Teléfono de Contacto *</label>
                                <input type="text" id="admin-telefono" class="form-control" placeholder="Ej: +56 9 8765 4321" required>
                            </div>
                            <div class="form-group">
                                <label for="admin-email">Correo Electrónico *</label>
                                <input type="email" id="admin-email" class="form-control" placeholder="Ej: juan.perez@administracion.cl" required>
                            </div>
                            <div class="form-group">
                                <label for="admin-website">Sitio Web Personal (Opcional)</label>
                                <input type="url" id="admin-website" class="form-control" placeholder="Ej: https://www.juanperez.cl">
                            </div>
                        </form>
                    </div>

                    <!-- Panel Derecho: Datos de la Empresa Administradora -->
                    <div class="card-panel" style="padding: 1.5rem;">
                        <div class="panel-header" style="margin-bottom: 1.25rem;">
                            <span class="panel-title" style="display: flex; align-items: center; gap: 0.5rem;">
                                <i data-lucide="briefcase" style="color: var(--accent-color);"></i> Datos de la Empresa (Opcional)
                            </span>
                        </div>
                        <form id="form-perfil-empresa" onsubmit="event.preventDefault();">
                            <div class="form-group">
                                <label for="empresa-nombre">Nombre de la Empresa</label>
                                <input type="text" id="empresa-nombre" class="form-control" placeholder="Ej: Administración y Gestión RedVecino Ltda.">
                            </div>
                            <div class="form-group">
                                <label for="empresa-telefono">Teléfono de la Empresa</label>
                                <input type="text" id="empresa-telefono" class="form-control" placeholder="Ej: +56 41 234 5678">
                            </div>
                            <div class="form-group">
                                <label for="empresa-email">Correo Electrónico de la Empresa</label>
                                <input type="email" id="empresa-email" class="form-control" placeholder="Ej: contacto@redvecinogestion.cl">
                            </div>
                            <div class="form-group">
                                <label for="empresa-website">Sitio Web de la Empresa</label>
                                <input type="url" id="empresa-website" class="form-control" placeholder="Ej: https://www.redvecinogestion.cl">
                            </div>
                        </form>
                    </div>

                </div>

                <div style="display: flex; justify-content: flex-end; margin-top: 1.5rem;">
                    <button class="btn btn-primary" onclick="saveAdministradorProfile()" style="padding: 0.75rem 2rem; font-weight: 600; display: flex; align-items: center; gap: 0.5rem; box-shadow: 0 4px 15px var(--accent-glow);">
                        <i data-lucide="save"></i> Guardar Perfil del Administrador
                    </button>
                </div>
            </div>

            <!-- ================= VIEW: RESIDENTES ================= -->
            <div id="view-residentes-container" class="view-container" style="display: none;">
                <!-- Acciones Superiores de Residentes -->
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; gap: 1rem; flex-wrap: wrap;">
                    <div style="display: flex; gap: 0.75rem; align-items: center; flex-wrap: wrap;">
                        <button class="btn btn-secondary" onclick="newResidentAssignment()" style="display: flex; align-items: center; gap: 0.5rem; font-size: 0.85rem; padding: 0.6rem 1.2rem;">
                            <i data-lucide="plus-circle" style="width: 16px; height: 16px;"></i> Nueva Asignación
                        </button>
                        
                        <!-- Buscador Global de Residentes -->
                        <div style="position: relative; width: 280px; z-index: 50;">
                            <input type="text" id="search-resident-global" class="form-control" placeholder="Buscar residente por nombre..." oninput="searchResidentGlobalChanged()" style="font-size: 0.8rem; height: 38px; padding-right: 2.2rem; margin: 0;">
                            <i data-lucide="search" style="position: absolute; right: 0.75rem; top: 50%; transform: translateY(-50%); width: 15px; height: 15px; color: var(--text-muted); pointer-events: none;"></i>
                            <div id="search-resident-results" style="display: none; position: absolute; top: 100%; left: 0; right: 0; background: var(--bg-secondary); border: 1px solid var(--border-color); border-radius: 8px; box-shadow: 0 10px 25px rgba(0,0,0,0.6); max-height: 220px; overflow-y: auto; margin-top: 0.25rem;"></div>
                        </div>
                    </div>
                    <button class="btn btn-primary" onclick="switchView('propietarios')" style="display: flex; align-items: center; gap: 0.5rem; font-size: 0.85rem; padding: 0.6rem 1.2rem; box-shadow: 0 4px 12px var(--accent-glow);">
                        <i data-lucide="file-text" style="width: 16px; height: 16px;"></i> Listado de Propietarios
                    </button>
                </div>

                <div class="card-panel" style="padding: 1.5rem; margin-bottom: 2rem;">
                    <div class="panel-header" style="margin-bottom: 1.25rem;">
                        <span class="panel-title" style="display: flex; align-items: center; gap: 0.5rem;">
                            <i data-lucide="home" style="color: var(--accent-color);"></i> Datos de la Unidad, Estacionamiento y Vehículo
                        </span>
                    </div>

                    <!-- Fila 1: Selectores e Inputs -->
                    <div style="display: grid; grid-template-columns: 2fr 1fr 1fr; gap: 1rem; align-items: flex-end; margin-bottom: 1.25rem;">
                        
                        <!-- Control Unidad con Candado -->
                        <div style="display: flex; gap: 0.5rem; align-items: flex-end;">
                            <div style="flex: 1;">
                                <label for="residente-propiedad-id" style="font-size: 0.8rem; color: var(--text-secondary);">Seleccionar Unidad *</label>
                                <select id="residente-propiedad-id" class="form-control" onchange="residentePropiedadChanged()" style="font-weight: 500;">
                                    <option value="">Seleccione una unidad...</option>
                                    <!-- Dinámico -->
                                </select>
                            </div>
                            <button type="button" class="btn-icon" id="btn-residente-propiedad-lock" onclick="toggleResidentePropiedadLock()" title="Bloquear Selección de Unidad" style="height: 38px; width: 38px;">
                                <i id="residente-propiedad-lock-icon" data-lucide="unlock" style="width: 16px; height: 16px; color: var(--text-muted);"></i>
                            </button>
                        </div>

                        <!-- Control Estacionamiento con Candado -->
                        <div style="display: flex; gap: 0.5rem; align-items: flex-end;">
                            <div style="flex: 1;">
                                <label for="residente-estacionamiento" style="font-size: 0.8rem; color: var(--text-secondary);">Número de Estacionamiento</label>
                                <input type="text" id="residente-estacionamiento" class="form-control" placeholder="Ej: Estac. 15, Subt 2 o N/A" style="margin: 0;">
                            </div>
                            <button type="button" class="btn-icon" id="btn-residente-estacionamiento-lock" onclick="toggleResidenteEstacionamientoLock()" title="Bloquear Nro Estacionamiento" style="height: 38px; width: 38px;">
                                <i id="residente-estacionamiento-lock-icon" data-lucide="unlock" style="width: 16px; height: 16px; color: var(--text-muted);"></i>
                            </button>
                        </div>

                        <!-- Patente del Vehículo -->
                        <div class="form-group" style="margin: 0;">
                            <label for="residente-patente" style="font-size: 0.8rem; color: var(--text-secondary);">Patente / Placa del Vehículo</label>
                            <input type="text" id="residente-patente" class="form-control" placeholder="Ej: AB-CD-12" style="margin: 0; height: 38px;">
                        </div>
                    </div>

                    <!-- Fila 2: Referencias u Observaciones -->
                    <div class="form-group" style="margin: 0;">
                        <label for="residente-observacion" style="font-size: 0.8rem; color: var(--text-secondary);">Referencias u Observaciones</label>
                        <textarea id="residente-observacion" class="form-control" placeholder="Ej: Mascotas permitidas, arrendatarios, etc. (Máximo 3 líneas)" rows="3" style="min-height: 80px; height: 80px; resize: vertical; margin: 0;"></textarea>
                    </div>
                </div>

                <!-- Ficha: Lista de Residentes / Integrantes -->
                <div class="card-panel" style="padding: 1.5rem;">
                    <div class="panel-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                        <span class="panel-title" style="display: flex; align-items: center; gap: 0.5rem;">
                            <i data-lucide="users" style="color: var(--accent-color);"></i> Integrantes y Residentes de la Unidad
                        </span>
                        <button type="button" class="btn btn-secondary" style="font-size: 0.75rem; padding: 0.35rem 0.75rem; min-width: auto;" onclick="addResidenteIntegranteRow()">
                            <i data-lucide="plus" style="width: 14px; height: 14px; margin-right: 3px;"></i> Agregar Integrante
                        </button>
                    </div>
                    
                    <div class="table-responsive" style="border: 1px solid var(--border-color); border-radius: 10px; max-height: 300px; overflow-y: auto; margin-bottom: 0.5rem;">
                        <table class="table" style="font-size: 0.8rem; min-width: 1000px;">
                            <thead style="position: sticky; top: 0; background: var(--bg-secondary); z-index: 10;">
                                <tr>
                                    <th style="padding: 0.5rem;">Nombres *</th>
                                    <th style="padding: 0.5rem;">Apellidos *</th>
                                    <th style="padding: 0.5rem; width: 120px;">RUT *</th>
                                    <th style="padding: 0.5rem; width: 130px;">Fecha Nacimiento *</th>
                                    <th style="padding: 0.5rem; width: 60px; text-align: center;">Edad</th>
                                    <th style="padding: 0.5rem; width: 120px;">Teléfono (Opcional)</th>
                                    <th style="padding: 0.5rem; width: 160px;">Email (Opcional)</th>
                                    <th style="padding: 0.5rem; width: 90px; text-align: center;">Dueño / Prop.</th>
                                    <th style="padding: 0.5rem; width: 95px; text-align: center;">¿Vive aquí?</th>
                                    <th style="padding: 0.5rem; width: 90px; text-align: center;">Acceso Plat.</th>
                                    <th style="padding: 0.5rem; width: 45px; text-align: center;">Acción</th>
                                </tr>
                            </thead>
                            <tbody id="tbody-residente-integrantes">
                                <!-- Dinámico -->
                            </tbody>
                        </table>
                    </div>
                </div>

                <div style="display: flex; justify-content: flex-end; margin-top: 1.5rem;">
                    <button class="btn btn-primary" onclick="saveResidentFicha()" style="padding: 0.75rem 2rem; font-weight: 600; display: flex; align-items: center; gap: 0.5rem; box-shadow: 0 4px 15px var(--accent-glow);">
                        <i data-lucide="save"></i> Guardar Ficha de Residentes
                    </button>
                </div>

                <!-- Panel de Gastos Comunes de la Unidad Seleccionada -->
                <div class="card-panel" id="residente-gc-history-panel" style="padding: 1.5rem; margin-top: 2rem; display: none;">
                    <div class="panel-header" style="margin-bottom: 1.25rem;">
                        <span class="panel-title" style="display: flex; align-items: center; gap: 0.5rem;">
                            <i data-lucide="file-text" style="color: var(--accent-color);"></i> Gastos Comunes Recientes de la Unidad
                        </span>
                    </div>
                    <div class="table-responsive" style="border: 1px solid var(--border-color); border-radius: 8px;">
                        <table class="table" style="font-size: 0.8rem; margin: 0;">
                            <thead>
                                <tr>
                                    <th style="padding: 0.5rem;">Mes / Período</th>
                                    <th style="padding: 0.5rem;">Fecha Emisión</th>
                                    <th style="padding: 0.5rem;">Vencimiento</th>
                                    <th style="padding: 0.5rem; text-align: right;">Común prorrat.</th>
                                    <th style="padding: 0.5rem; text-align: right;">Torre prorrat.</th>
                                    <th style="padding: 0.5rem; text-align: right;">Cargos Directos</th>
                                    <th style="padding: 0.5rem; text-align: right;">Mora</th>
                                    <th style="padding: 0.5rem; text-align: right;">Total Neto</th>
                                    <th style="padding: 0.5rem; text-align: center;">Estado</th>
                                    <th style="padding: 0.5rem; text-align: center;">Acción</th>
                                </tr>
                            </thead>
                            <tbody id="tbody-residente-gc-list">
                                <!-- Dinámico -->
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <!-- ================= VIEW: PROPIETARIOS ================= -->
            <div id="view-propietarios-container" class="view-container" style="display: none;">
                <!-- Acciones Superiores -->
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; gap: 1rem;">
                    <button class="btn btn-secondary" onclick="switchView('residentes')" style="display: flex; align-items: center; gap: 0.5rem; font-size: 0.85rem; padding: 0.6rem 1.2rem;">
                        <i data-lucide="arrow-left" style="width: 16px; height: 16px;"></i> Volver a Residentes
                    </button>
                </div>

                <!-- Panel de Listado -->
                <div class="card-panel" style="padding: 1.5rem;">
                    <div class="panel-header" style="margin-bottom: 1.25rem;">
                        <span class="panel-title" style="display: flex; align-items: center; gap: 0.5rem;">
                            <i data-lucide="file-text" style="color: var(--accent-color);"></i> Listado Oficial de Propietarios
                        </span>
                    </div>

                    <div class="table-responsive" style="border: 1px solid var(--border-color); border-radius: 8px;">
                        <table class="table" style="font-size: 0.8rem; margin: 0; min-width: 950px;">
                            <thead>
                                <tr>
                                    <th style="padding: 0.6rem 0.5rem;">Ubicación (Torre/Edificio)</th>
                                    <th style="padding: 0.6rem 0.5rem; width: 70px; text-align: center;">Piso</th>
                                    <th style="padding: 0.6rem 0.5rem;">Unidad</th>
                                    <th style="padding: 0.6rem 0.5rem;">Propietario / Dueño</th>
                                    <th style="padding: 0.6rem 0.5rem; width: 110px;">RUT</th>
                                    <th style="padding: 0.6rem 0.5rem;">Contacto</th>
                                    <th style="padding: 0.6rem 0.5rem; width: 90px; text-align: center;">¿Vive ahí?</th>
                                    <th style="padding: 0.6rem 0.5rem; width: 130px;">Estacionamiento</th>
                                    <th style="padding: 0.6rem 0.5rem;">Observaciones de Ficha</th>
                                    <th style="padding: 0.6rem 0.5rem; width: 50px; text-align: center;">Acción</th>
                                </tr>
                            </thead>
                            <tbody id="tbody-reporte-propietarios-full">
                                <!-- Dinámico -->
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <!-- ================= VIEW: TICKETS ================= -->
            <div id="view-tickets-container" class="view-container" style="display: none;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; gap: 1rem; flex-wrap: wrap;">
                    <div>
                        <span style="font-size: 0.85rem; color: var(--text-secondary);">Listado de consultas, sugerencias, quejas y reclamos enviados por los residentes.</span>
                    </div>
                </div>

                <div class="card-panel" style="padding: 1.5rem;">
                    <div class="table-responsive" style="border: 1px solid var(--border-color); border-radius: 8px;">
                        <table class="table" style="font-size: 0.85rem; margin: 0; min-width: 800px;">
                            <thead>
                                <tr>
                                    <th style="width: 120px;">Unidad</th>
                                    <th style="width: 180px;">Nombre</th>
                                    <th>Contacto (Correo)</th>
                                    <th style="width: 130px; text-align: center;">Tipo Asunto</th>
                                    <th>Descripción</th>
                                    <th style="width: 140px; text-align: right;">Fecha</th>
                                </tr>
                            </thead>
                            <tbody id="tbody-tickets-list">
                                <!-- Cargado dinámicamente -->
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <!-- ================= VIEW: COLABORADORES ================= -->
            <div id="view-colaboradores-container" class="view-container" style="display: none;">
                <!-- Acciones Superiores -->
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; gap: 1rem; flex-wrap: wrap;">
                    <div>
                        <span style="font-size: 0.85rem; color: var(--text-secondary);">Administración de personal, sueldos, amonestaciones y contratos.</span>
                    </div>
                    <button class="btn btn-primary" onclick="openColaboradorModal()" style="display: flex; align-items: center; gap: 0.5rem; font-size: 0.85rem; padding: 0.6rem 1.2rem; box-shadow: 0 4px 12px var(--accent-glow);">
                        <i data-lucide="plus-circle" style="width: 16px; height: 16px;"></i> Ingreso de Personal
                    </button>
                </div>

                <!-- Listado de Colaboradores -->
                <div class="card-panel" style="padding: 1.5rem;">
                    <div class="table-responsive" style="border: 1px solid var(--border-color); border-radius: 8px;">
                        <table class="table" style="font-size: 0.85rem; margin: 0; min-width: 900px;">
                            <thead>
                                <tr>
                                    <th style="padding: 0.75rem 0.5rem;">Nombre Completo</th>
                                    <th style="padding: 0.75rem 0.5rem;">Cargo</th>
                                    <th style="padding: 0.75rem 0.5rem; text-align: center; width: 65px;">Edad</th>
                                    <th style="padding: 0.75rem 0.5rem;">Contacto</th>
                                    <th style="padding: 0.75rem 0.5rem;">Contrato</th>
                                    <th style="padding: 0.75rem 0.5rem; text-align: right;">Sueldo Líquido</th>
                                    <th style="padding: 0.75rem 0.5rem; text-align: center;">Estado</th>
                                    <th style="padding: 0.75rem 0.5rem; width: 120px; text-align: center;">Acciones</th>
                                </tr>
                            </thead>
                            <tbody id="tbody-colaboradores">
                                <!-- Dinámico -->
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <!-- ================= VIEW: GASTOS COMUNES (INGRESOS) ================= -->
            <div id="view-gasto_comun-container" class="view-container" style="display: none;">
                <!-- Pestañas del módulo -->
                <div style="display: flex; gap: 1rem; border-bottom: 2px solid var(--border-color); padding-bottom: 0.5rem; margin-bottom: 1.5rem; flex-wrap: wrap;">
                    <button class="btn-secondary" id="tab-btn-gc-periodos" onclick="switchGCTab('periodos')" style="background: none; border: none; padding: 0.5rem 1.25rem; font-size: 0.85rem; display: flex; align-items: center; gap: 0.5rem; color: var(--text-secondary); cursor: pointer; transition: all 0.3s; font-weight: 600; border-bottom: 2px solid transparent;">
                        <i data-lucide="calendar" style="width:16px; height:16px;"></i> Períodos y Facturación
                    </button>
                    <button class="btn-secondary" id="tab-btn-gc-egresos" onclick="switchGCTab('egresos')" style="background: none; border: none; padding: 0.5rem 1.25rem; font-size: 0.85rem; display: flex; align-items: center; gap: 0.5rem; color: var(--text-secondary); cursor: pointer; transition: all 0.3s; font-weight: 600; border-bottom: 2px solid transparent;">
                        <i data-lucide="receipt" style="width:16px; height:16px;"></i> Registro de Egresos
                    </button>
                    <button class="btn-secondary" id="tab-btn-gc-arriendo" onclick="switchGCTab('arriendo')" style="background: none; border: none; padding: 0.5rem 1.25rem; font-size: 0.85rem; display: flex; align-items: center; gap: 0.5rem; color: var(--text-secondary); cursor: pointer; transition: all 0.3s; font-weight: 600; border-bottom: 2px solid transparent;">
                        <i data-lucide="key" style="width:16px; height:16px;"></i> Ingresos por Arriendo
                    </button>
                    <button class="btn-secondary" id="tab-btn-gc-config" onclick="switchGCTab('config')" style="background: none; border: none; padding: 0.5rem 1.25rem; font-size: 0.85rem; display: flex; align-items: center; gap: 0.5rem; color: var(--text-secondary); cursor: pointer; transition: all 0.3s; font-weight: 600; border-bottom: 2px solid transparent;">
                        <i data-lucide="settings" style="width:16px; height:16px;"></i> Configuración de Mora
                    </button>
                </div>

                <!-- Sub-Vista: Configuración de Mora -->
                <div id="gc-tab-config" style="display: none;">
                    <div class="card-panel" style="padding: 1.5rem; max-width: 500px;">
                        <div class="panel-header" style="margin-bottom: 1.25rem;">
                            <span class="panel-title" style="display: flex; align-items: center; gap: 0.5rem;">
                                <i data-lucide="settings" style="color: var(--accent-color);"></i> Parámetros de Gastos Comunes
                            </span>
                        </div>
                        
                        <div class="form-group" style="margin-bottom: 1.25rem;">
                            <label for="gc-config-dia-vencimiento" style="font-size: 0.8rem; color: var(--text-secondary);">Día de Vencimiento Mensual *</label>
                            <input type="number" id="gc-config-dia-vencimiento" class="form-control" min="1" max="28" placeholder="Ej: 10" style="margin: 0;">
                            <small style="color: var(--text-muted); display: block; margin-top: 0.25rem;">Día del mes en que vence el pago antes de aplicar recargos por mora.</small>
                        </div>
                        
                        <div class="form-group" style="margin-bottom: 1.5rem;">
                            <label for="gc-config-interes-mora" style="font-size: 0.8rem; color: var(--text-secondary);">Tasa de Interés de Mora (%) *</label>
                            <input type="number" id="gc-config-interes-mora" class="form-control" min="0" step="0.01" placeholder="Ej: 2.00" style="margin: 0;">
                            <small style="color: var(--text-muted); display: block; margin-top: 0.25rem;">Porcentaje de recargo que se sumará automáticamente si se paga después del vencimiento.</small>
                        </div>

                        <button class="btn btn-primary" onclick="saveGCConfig()" style="width: 100%; display: flex; align-items: center; justify-content: center; gap: 0.5rem; font-weight: 600; box-shadow: 0 4px 12px var(--accent-glow);">
                            <i data-lucide="save"></i> Guardar Parámetros
                        </button>
                    </div>
                </div>

                <!-- Sub-Vista: Periodos de Facturación -->
                <div id="gc-tab-periodos">
                    <!-- Fila de Acciones de Período -->
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; gap: 1rem; flex-wrap: wrap;">
                        <div>
                            <span style="font-size: 0.85rem; color: var(--text-secondary);">Registros históricos de facturación del condominio.</span>
                        </div>
                        <button class="btn btn-primary" onclick="openGeneratePeriodModal()" style="display: flex; align-items: center; gap: 0.5rem; font-size: 0.85rem; padding: 0.6rem 1.2rem; box-shadow: 0 4px 12px var(--accent-glow);">
                            <i data-lucide="plus-circle" style="width: 16px; height: 16px;"></i> Generar Gastos Comunes del Mes
                        </button>
                    </div>

                    <!-- Grilla/Lista de Períodos -->
                    <div class="card-panel" style="padding: 1.5rem;">
                        <div class="table-responsive" style="border: 1px solid var(--border-color); border-radius: 8px;">
                            <table class="table" style="font-size: 0.85rem; margin: 0;">
                                <thead>
                                    <tr>
                                        <th style="padding: 0.75rem 0.5rem;">Período (Mes)</th>
                                        <th style="padding: 0.75rem 0.5rem;">Fecha de Emisión</th>
                                        <th style="padding: 0.75rem 0.5rem;">Fecha Límite de Pago</th>
                                        <th style="padding: 0.75rem 0.5rem; text-align: center;">Tasa Mora Aplicada</th>
                                        <th style="padding: 0.75rem 0.5rem; text-align: center;">Estado</th>
                                        <th style="padding: 0.75rem 0.5rem; width: 140px; text-align: center;">Acción</th>
                                    </tr>
                                </thead>
                                <tbody id="tbody-gc-periodos">
                                    <!-- Dinámico -->
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <!-- Sub-Vista: Boletas de un Periodo Seleccionado (Detalle de Facturación) -->
                <div id="gc-period-details" style="display: none; margin-top: 1rem;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; gap: 1rem; flex-wrap: wrap;">
                        <div style="display: flex; gap: 0.5rem; align-items: center;">
                            <button class="btn btn-secondary" onclick="backToPeriodList()" style="display: flex; align-items: center; gap: 0.5rem; font-size: 0.85rem; padding: 0.6rem 1.2rem;">
                                <i data-lucide="arrow-left" style="width: 16px; height: 16px;"></i> Volver a Períodos
                            </button>
                            <button class="btn btn-primary" id="btn-gc-publish-period" style="display: none; align-items: center; gap: 0.5rem; font-size: 0.85rem; padding: 0.6rem 1.2rem; background: #10b981; box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);" onclick="publishGCPeriodCurrent()">
                                <i data-lucide="send" style="width: 16px; height: 16px;"></i> Aceptar y Generar (Emitir)
                            </button>
                        </div>
                        <div style="text-align: right;">
                            <h3 id="gc-details-title" style="margin: 0; font-size: 1.2rem; color: #fff;">Boletas del Mes</h3>
                            <span id="gc-details-subtitle" style="font-size: 0.8rem; color: var(--text-secondary);">Detalle de cobros por unidad</span>
                        </div>
                    </div>

                    <div class="card-panel" style="padding: 1.5rem;">
                        <div class="table-responsive" style="border: 1px solid var(--border-color); border-radius: 8px;">
                            <table class="table" style="font-size: 0.8rem; margin: 0; min-width: 950px;">
                                <thead>
                                    <tr>
                                        <th style="padding: 0.6rem 0.5rem;">Ubicación</th>
                                        <th style="padding: 0.6rem 0.5rem; text-align: center; width: 60px;">Piso</th>
                                        <th style="padding: 0.6rem 0.5rem;">Unidad</th>
                                        <th style="padding: 0.6rem 0.5rem;">Propietario / Dueño</th>
                                        <th style="padding: 0.6rem 0.5rem; text-align: right;">Común</th>
                                        <th style="padding: 0.6rem 0.5rem; text-align: right;">Torre</th>
                                        <th style="padding: 0.6rem 0.5rem; text-align: right;">Cargos Unidad</th>
                                        <th style="padding: 0.6rem 0.5rem; text-align: right; color: var(--danger);">Mora</th>
                                        <th style="padding: 0.6rem 0.5rem; text-align: right; font-weight: bold; color: #fff;">Total Cobrado</th>
                                        <th style="padding: 0.6rem 0.5rem; text-align: center; width: 100px;">Estado</th>
                                        <th style="padding: 0.6rem 0.5rem; width: 130px; text-align: center;">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody id="tbody-gc-boletas">
                                    <!-- Dinámico -->
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                <!-- Sub-Vista: Registro de Egresos (Pestaña integrada) -->
                <div id="gc-tab-egresos" style="display: none;">
                    <div style="display: flex; justify-content: flex-end; margin-bottom: 1.25rem;">
                        <button class="btn btn-primary" onclick="openEgresoModal()" style="display: flex; align-items: center; gap: 0.5rem; box-shadow: 0 4px 12px var(--accent-glow);">
                            <i data-lucide="plus-circle" style="width: 16px; height: 16px;"></i> Registrar Egreso
                        </button>
                    </div>

                    <!-- Acordeón colapsable para Configurar Categorías y Subcategorías -->
                    <div class="card-panel" style="margin-bottom: 2rem; border-color: rgba(255,255,255,0.05);">
                        <div class="panel-header" onclick="toggleCategoriesCollapse()" style="cursor: pointer; display: flex; justify-content: space-between; align-items: center; user-select: none;">
                            <span class="panel-title" style="display: flex; align-items: center; gap: 0.5rem; font-size: 0.95rem;">
                                <i data-lucide="folder-tree" style="color: var(--accent-color); width: 18px; height: 18px;"></i> Configuración de Categorías y Subcategorías
                            </span>
                            <div style="display: flex; align-items: center; gap: 0.5rem; color: var(--text-secondary); font-size: 0.8rem; font-weight: normal;">
                                <span>Haga clic para expandir / contraer</span>
                                <i id="categories-collapse-icon" data-lucide="chevron-down" style="transition: transform 0.2s; width: 16px; height: 16px;"></i>
                            </div>
                        </div>
                        
                        <div id="categories-collapse-content" style="display: none; margin-top: 1.5rem; border-top: 1px solid var(--border-color); padding-top: 1.5rem;">
                            <div class="categories-grid" style="display: grid; grid-template-columns: 1fr 1.25fr; gap: 1.5rem;">
                                <!-- Formularios de creación -->
                                <div>
                                    <h4 style="font-size: 0.85rem; color: #fff; margin-bottom: 1rem; font-weight: 600;">Definir Nueva Categoría</h4>
                                    <form id="form-category" onsubmit="submitCategory(event)">
                                        <div class="form-group">
                                            <label for="cat-nombre">Nombre de la Categoría Principal</label>
                                            <input type="text" id="cat-nombre" class="form-control" placeholder="Ej: Servicios Públicos, Mantenimiento" required style="font-size: 0.85rem; padding: 0.4rem 0.6rem;">
                                        </div>
                                        <div class="form-group">
                                            <label for="cat-descripcion">Breve Descripción</label>
                                            <textarea id="cat-descripcion" class="form-control" placeholder="Indique qué tipo de gastos agrupa esta categoría..." style="font-size: 0.85rem; padding: 0.4rem 0.6rem; min-height: 50px;"></textarea>
                                        </div>
                                        <button type="submit" class="btn btn-primary" style="width: 100%; font-size: 0.85rem; padding: 0.45rem;">
                                            <i data-lucide="plus-circle" style="width: 14px; height: 14px; margin-right: 3px;"></i> Guardar Categoría Principal
                                        </button>
                                    </form>

                                    <h4 style="font-size: 0.85rem; color: #fff; margin-top: 1.5rem; margin-bottom: 1rem; font-weight: 600;">Agregar Subcategoría</h4>
                                    <form id="form-subcategory" onsubmit="submitSubcategory(event)">
                                        <div class="form-group">
                                            <label for="subcat-parent">Categoría de Origen</label>
                                            <select id="subcat-parent" class="form-control" required style="font-size: 0.85rem; padding: 0.4rem 0.6rem;">
                                                <option value="">Seleccione una categoría principal...</option>
                                                <!-- Cargado dinámicamente -->
                                            </select>
                                        </div>
                                        <div class="form-group">
                                            <label for="subcat-nombre">Nombre de la Subcategoría</label>
                                            <input type="text" id="subcat-nombre" class="form-control" placeholder="Ej: Agua, Luz, Conserjería..." required style="font-size: 0.85rem; padding: 0.4rem 0.6rem;">
                                        </div>
                                        <button type="submit" class="btn btn-secondary" style="width: 100%; font-size: 0.85rem; padding: 0.45rem;">
                                            <i data-lucide="plus" style="width: 14px; height: 14px; margin-right: 3px;"></i> Vincular Subcategoría
                                        </button>
                                    </form>
                                </div>

                                <!-- Panel de visualización de Categorías y Subcategorías -->
                                <div style="border-left: 1px solid var(--border-color); padding-left: 1.5rem;">
                                    <h4 style="font-size: 0.85rem; color: #fff; margin-bottom: 1rem; font-weight: 600;">Estructura de Categorías de Egresos</h4>
                                    <div class="category-list" id="category-list-render" style="max-height: 380px; overflow-y: auto; padding-right: 0.5rem;">
                                        <!-- Render dinámico de las categorías -->
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Panel de Filtros -->
                    <div class="filters-panel">
                        <div class="form-group">
                            <label for="filter-search">Buscar</label>
                            <input type="text" id="filter-search" class="form-control" placeholder="Descripción o referencia..." oninput="loadEgresos()">
                        </div>
                        <div class="form-group">
                            <label for="filter-categoria">Categoría</label>
                            <select id="filter-categoria" class="form-control" onchange="filterCategoryChanged()">
                                <option value="">Todas</option>
                                <!-- Cargado dinámicamente -->
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="filter-subcategoria">Subcategoría</label>
                            <select id="filter-subcategoria" class="form-control" onchange="loadEgresos()">
                                <option value="">Todas</option>
                                <!-- Cargado dinámicamente -->
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="filter-desde">Desde</label>
                            <input type="date" id="filter-desde" class="form-control" onchange="loadEgresos()">
                        </div>
                        <div class="form-group">
                            <label for="filter-hasta">Hasta</label>
                            <input type="date" id="filter-hasta" class="form-control" onchange="loadEgresos()">
                        </div>
                        <button class="btn btn-secondary" onclick="clearFilters()">
                            <i data-lucide="refresh-cw"></i> Limpiar
                        </button>
                    </div>

                    <!-- Contenedor del Historial Desplegable por Categorías -->
                    <div id="egresos-history-container" style="margin-top: 1.5rem;">
                        <!-- Cargado dinámicamente con paneles colapsables -->
                    </div>
                </div>

                <!-- Sub-Vista: Ingresos por Arriendo (Pestaña integrada) -->
                <div id="gc-tab-arriendo" style="display: none;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; gap: 1rem; flex-wrap: wrap;">
                        <div>
                            <span style="font-size: 0.85rem; color: var(--text-secondary);">Gestione el arriendo de áreas comunes y prevenga cruces de horarios.</span>
                        </div>
                        <div style="display: flex; align-items: center; gap: 0.75rem; flex-wrap: wrap;">
                            <div style="background: rgba(16,185,129,0.05); border: 1px solid rgba(16,185,129,0.2); padding: 0.5rem 0.9rem; border-radius: 8px; font-size: 0.8rem; color: #10b981; font-weight: 600; display: flex; align-items: center; gap: 0.4rem;" id="arriendos-total-periodo-container">
                                <i data-lucide="check-circle" style="width: 15px; height: 15px;"></i> Recaudado Realizados: <span id="arriendos-total-periodo-monto">$0</span>
                            </div>
                            <button class="btn btn-secondary" onclick="openAreasComunesModal()" style="display: flex; align-items: center; gap: 0.5rem; font-size: 0.85rem; padding: 0.6rem 1.2rem;">
                                <i data-lucide="layers" style="width: 16px; height: 16px;"></i> Áreas Comunes
                            </button>
                            <button class="btn btn-primary" onclick="openNuevaReservaModal()" style="display: flex; align-items: center; gap: 0.5rem; font-size: 0.85rem; padding: 0.6rem 1.2rem; box-shadow: 0 4px 12px var(--accent-glow);">
                                <i data-lucide="plus-circle" style="width: 16px; height: 16px;"></i> Nueva Reserva
                            </button>
                        </div>
                    </div>

                    <!-- Calendario visual e interactivo -->
                    <div class="card-panel" style="padding: 1.5rem; margin-bottom: 2rem;">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.25rem; flex-wrap: wrap; gap: 1rem;">
                            <div style="display: flex; align-items: center; gap: 0.5rem;">
                                <button class="btn btn-secondary" onclick="changeArriendoCalendarMonth(-1)" style="padding: 0.35rem 0.6rem; min-width: auto; height: auto;">
                                    <i data-lucide="chevron-left" style="width:16px; height:16px;"></i>
                                </button>
                                <h3 id="arriendo-calendar-month-title" style="margin: 0; font-size: 1.05rem; color: #fff; font-weight: 600; min-width: 160px; text-align: center;">Mes Año</h3>
                                <button class="btn btn-secondary" onclick="changeArriendoCalendarMonth(1)" style="padding: 0.35rem 0.6rem; min-width: auto; height: auto;">
                                    <i data-lucide="chevron-right" style="width:16px; height:16px;"></i>
                                </button>
                            </div>
                            <div style="display: flex; gap: 0.75rem; font-size: 0.75rem; color: var(--text-secondary); flex-wrap: wrap; align-items: center;" id="arriendo-areas-legend">
                                <!-- Leyenda generada dinámicamente -->
                            </div>
                        </div>
                        
                        <!-- Calendario Grid -->
                        <div style="display: grid; grid-template-columns: repeat(7, 1fr); gap: 1px; background: var(--border-color); border: 1px solid var(--border-color); border-radius: 8px 8px 0 0; overflow: hidden; margin-bottom: 0px;">
                            <!-- Días de cabecera -->
                            <div style="background: rgba(255,255,255,0.02); padding: 0.6rem; text-align: center; font-size: 0.75rem; font-weight: bold; color: var(--text-secondary);">Lun</div>
                            <div style="background: rgba(255,255,255,0.02); padding: 0.6rem; text-align: center; font-size: 0.75rem; font-weight: bold; color: var(--text-secondary);">Mar</div>
                            <div style="background: rgba(255,255,255,0.02); padding: 0.6rem; text-align: center; font-size: 0.75rem; font-weight: bold; color: var(--text-secondary);">Mié</div>
                            <div style="background: rgba(255,255,255,0.02); padding: 0.6rem; text-align: center; font-size: 0.75rem; font-weight: bold; color: var(--text-secondary);">Jue</div>
                            <div style="background: rgba(255,255,255,0.02); padding: 0.6rem; text-align: center; font-size: 0.75rem; font-weight: bold; color: var(--text-secondary);">Vie</div>
                            <div style="background: rgba(255,255,255,0.02); padding: 0.6rem; text-align: center; font-size: 0.75rem; font-weight: bold; color: var(--text-secondary);">Sáb</div>
                            <div style="background: rgba(255,255,255,0.02); padding: 0.6rem; text-align: center; font-size: 0.75rem; font-weight: bold; color: var(--text-secondary);">Dom</div>
                        </div>
                        <div style="display: grid; grid-template-columns: repeat(7, 1fr); gap: 1px; background: var(--border-color); border: 1px solid var(--border-color); border-radius: 0 0 8px 8px; overflow: hidden;" id="arriendo-calendar-grid">
                            <!-- Carga dinámica -->
                        </div>
                    </div>

                    <!-- Tabla de Arriendos -->
                    <div class="card-panel" style="padding: 1.5rem;">
                        <div class="panel-header" style="margin-bottom: 1rem;">
                            <span class="panel-title" style="display: flex; align-items: center; gap: 0.5rem; font-size: 0.95rem;">
                                <i data-lucide="list" style="color: var(--accent-color); width: 18px; height: 18px;"></i> Historial de Arriendos Registrados
                            </span>
                        </div>
                        <div class="table-responsive" style="border: 1px solid var(--border-color); border-radius: 8px;">
                            <table class="table" style="font-size: 0.8rem; margin: 0; min-width: 800px;">
                                <thead>
                                    <tr>
                                        <th style="padding: 0.65rem 0.5rem;">Área Común</th>
                                        <th style="padding: 0.65rem 0.5rem;">Unidad</th>
                                        <th style="padding: 0.65rem 0.5rem; text-align: center;">Fecha</th>
                                        <th style="padding: 0.65rem 0.5rem; text-align: center;">Horario</th>
                                        <th style="padding: 0.65rem 0.5rem; text-align: right;">Costo Pagado</th>
                                        <th style="padding: 0.65rem 0.5rem;">Observaciones</th>
                                        <th style="padding: 0.65rem 0.5rem; text-align: center; width: 120px;">Estado</th>
                                        <th style="padding: 0.65rem 0.5rem; text-align: center; width: 100px;">Acción</th>
                                    </tr>
                                </thead>
                                <tbody id="tbody-arriendos-list">
                                    <!-- Dinámico -->
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

    <!-- ================= MODAL: GENERAR PERÍODO GASTO COMÚN ================= -->
    <div class="modal-overlay" id="modal-generate-period">
        <div class="modal-card" style="max-width: 480px;">
            <div class="modal-header">
                <span class="modal-title">Generar Gastos Comunes Mensuales</span>
                <button class="modal-close" onclick="closeGeneratePeriodModal()"><i data-lucide="x"></i></button>
            </div>
            <div class="modal-body">
                <form id="form-generate-period" onsubmit="event.preventDefault();">
                    <div class="form-group" style="margin-bottom: 1.25rem;">
                        <label for="gc-gen-mes">Mes de Facturación *</label>
                        <input type="month" id="gc-gen-mes" class="form-control" required onchange="gcPeriodMonthChanged()">
                        <small style="color: var(--text-muted);">Sube todos los egresos del mes correspondiente antes de generar.</small>
                    </div>
                    <div class="form-group" style="margin-bottom: 1.25rem;">
                        <label for="gc-gen-fecha-emision">Fecha de Emisión *</label>
                        <input type="date" id="gc-gen-fecha-emision" class="form-control" required>
                    </div>
                    <div class="form-group" style="margin-bottom: 0;">
                        <label for="gc-gen-fecha-tope">Fecha Límite de Pago (Vencimiento) *</label>
                        <input type="date" id="gc-gen-fecha-tope" class="form-control" required>
                        <small style="color: var(--text-muted);">Pasada esta fecha se aplicará la tasa de interés de mora configurada.</small>
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <button class="btn btn-secondary" onclick="closeGeneratePeriodModal()">Cancelar</button>
                <button class="btn btn-primary" onclick="submitGeneratePeriodForm()">Generar Facturación</button>
            </div>
        </div>
    </div>

    <!-- ================= MODAL: RECIBO GASTO COMÚN DETALLE ================= -->
    <div class="modal-overlay" id="modal-gc-recibo">
        <div class="modal-card" style="max-width: 900px; width: 95%;">
            <div class="modal-header">
                <span class="modal-title">Recibo de Detalle de Gastos Comunes</span>
                <button class="modal-close" onclick="closeGCReciboModal()"><i data-lucide="x"></i></button>
            </div>
            <div class="modal-body" id="gc-recibo-print-area" style="padding: 1.5rem; background: #fff; color: #333; border-radius: 8px; font-family: 'Outfit', sans-serif;">
                <!-- Dinámico y Estilizado para Impresión -->
            </div>
            <div class="modal-footer">
                <button class="btn btn-secondary" onclick="closeGCReciboModal()">Cerrar</button>
                <button class="btn btn-primary" onclick="printGCRecibo()">
                    <i data-lucide="printer"></i> Imprimir Recibo
                </button>
            </div>
        </div>
    </div>

        </main>

    </div>

    <!-- ================= MODAL: REGISTRO DE EGRESO (GUIADO POR PASOS) ================= -->
    <div class="modal-overlay" id="modal-egreso">
        <div class="modal-card">
            
            <div class="modal-header">
                <span class="modal-title">Registrar Nuevo Egreso del Condominio</span>
                <button class="modal-close" onclick="closeEgresoModal()"><i data-lucide="x"></i></button>
            </div>
            
            <div class="modal-body">
                <!-- Indicador de pasos -->
                <div class="step-indicators">
                    <div class="step-ind active" id="ind-step-1">1</div>
                    <div class="step-ind" id="ind-step-2">2</div>
                    <div class="step-ind" id="ind-step-3">3</div>
                </div>

                <form id="form-egreso" enctype="multipart/form-data" onsubmit="event.preventDefault();">
                    
                    <!-- PASO 1: Datos Básicos del Gasto -->
                    <div class="form-step active" id="form-step-1">
                        <h3 style="font-size: 1rem; margin-bottom: 1rem; color: #fff;">Paso 1: Clasificación y Monto</h3>
                        
                        <div class="form-group">
                            <label for="egreso-fecha">Fecha del Egreso *</label>
                            <input type="date" id="egreso-fecha" class="form-control" required value="<?php echo date('Y-m-d'); ?>">
                        </div>

                        <div class="grid-2col" style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                            <div class="form-group">
                                <label for="egreso-categoria">Categoría Principal *</label>
                                <select id="egreso-categoria" class="form-control" onchange="egresoCategoryChanged()" required>
                                    <option value="">Seleccione...</option>
                                    <!-- Dinámico -->
                                </select>
                            </div>
                            <div class="form-group">
                                <label for="egreso-subcategoria">Subcategoría *</label>
                                <select id="egreso-subcategoria" class="form-control" required disabled>
                                    <option value="">Seleccione categoría primero...</option>
                                    <!-- Dinámico -->
                                </select>
                            </div>
                        </div>

                        <div class="form-group">
                            <label for="egreso-tipo-gasto">Clasificación de Gasto *</label>
                            <select id="egreso-tipo-gasto" class="form-control" onchange="toggleAsignacionFields('egreso')" required>
                                <option value="comun">Gasto Común (Aplica a todo el condominio)</option>
                                <option value="especifico">Gasto Específico (Asignado a una unidad)</option>
                            </select>
                        </div>

                        <div id="egreso-asignacion-group" style="display: none; animation: fadeIn 0.3s ease;">
                            <div class="form-group">
                                <label for="egreso-propiedad-id">Asignar a Propiedad / Unidad *</label>
                                <select id="egreso-propiedad-id" class="form-control">
                                    <option value="">Cargando unidades...</option>
                                </select>
                            </div>
                        </div>

                        <div class="form-group">
                            <label for="egreso-descripcion">Descripción corta del gasto *</label>
                            <input type="text" id="egreso-descripcion" class="form-control" placeholder="Ej: Reparación de bomba de agua principal" required>
                        </div>

                        <div class="form-group">
                            <label for="egreso-monto">Monto Total * ($)</label>
                            <input type="number" id="egreso-monto" class="form-control" placeholder="0.00" min="0.01" step="0.01" required style="font-size: 1.1rem; font-weight: bold; color: #fff;">
                        </div>
                    </div>

                    <!-- PASO 2: Referencias y Observaciones -->
                    <div class="form-step" id="form-step-2">
                        <h3 style="font-size: 1rem; margin-bottom: 1rem; color: #fff;">Paso 2: Detalles y Referencias</h3>
                        
                        <div class="form-group">
                            <label for="egreso-referencia">Referencia de Cotización o Presupuesto (Opcional)</label>
                            <input type="text" id="egreso-referencia" class="form-control" placeholder="Ej: Cotización N° 4022 - Gasfitería Pérez">
                        </div>

                        <div class="form-group">
                            <label for="egreso-observaciones">Observaciones adicionales</label>
                            <textarea id="egreso-observaciones" class="form-control" placeholder="Detalles de la garantía del trabajo, condiciones de pago, etc."></textarea>
                        </div>
                    </div>

                    <!-- PASO 3: Prorrateo y Archivo Adjunto -->
                    <div class="form-step" id="form-step-3">
                        <h3 style="font-size: 1rem; margin-bottom: 1rem; color: #fff;">Paso 3: Prorrateo y Documentos</h3>
                        
                        <!-- Toggle de Financiamiento en Meses -->
                        <div class="toggle-container">
                            <div class="toggle-info">
                                <span class="toggle-title">Dividir en Cuotas Mensuales</span>
                                <span class="toggle-desc">Permite prorratear el cobro en varios meses de gastos comunes.</span>
                            </div>
                            <label class="switch">
                                <input type="checkbox" id="egreso-has-split" onchange="toggleSplitInput()">
                                <span class="slider"></span>
                            </label>
                        </div>

                        <div class="form-group" id="split-months-group" style="display: none; animation: fadeIn 0.3s ease;">
                            <label for="egreso-meses">Número de Meses a Dividir</label>
                            <input type="number" id="egreso-meses" class="form-control" value="1" min="1" max="24" placeholder="Ej: 3">
                            <span style="font-size: 0.75rem; color: var(--text-secondary); margin-top: 0.25rem;" id="split-preview-text">
                                Monto mensual estimado: $0.00
                            </span>
                        </div>

                        <!-- Toggle de Documento Adjunto -->
                        <div class="toggle-container">
                            <div class="toggle-info">
                                <span class="toggle-title">¿Tiene Boleta, Factura o Cotización física?</span>
                                <span class="toggle-desc">Marque sí para adjuntar el comprobante o documento de respaldo.</span>
                            </div>
                            <label class="switch">
                                <input type="checkbox" id="egreso-has-doc" onchange="toggleFileInput()">
                                <span class="slider"></span>
                            </label>
                        </div>

                        <div class="form-group" id="file-upload-group" style="display: none; animation: fadeIn 0.3s ease;">
                            <label for="egreso-documento">Subir Archivo de Respaldo</label>
                            <input type="file" id="egreso-documento" class="form-control" accept=".jpg,.jpeg,.png,.pdf,.doc,.docx,.xls,.xlsx">
                            <span style="font-size: 0.75rem; color: var(--text-muted); margin-top: 0.25rem;">
                                Formatos válidos: JPG, PNG, PDF, Word, Excel. Máx 5MB.
                            </span>
                            <div id="edit-egreso-file-preview" style="font-size: 0.85rem; margin-top: 0.5rem; color: var(--success); font-weight: 500;"></div>
                        </div>
                    </div>

                </form>
            </div>
            
            <div class="modal-footer">
                <button class="btn btn-secondary" id="btn-prev-step" onclick="changeStep(-1)" style="display: none;">Atrás</button>
                <button class="btn btn-primary" id="btn-next-step" onclick="changeStep(1)">Siguiente</button>
                <button class="btn btn-primary" id="btn-submit-egreso" onclick="submitEgresoForm()" style="display: none;">Guardar Egreso</button>
            </div>
            
        </div>
    </div>

    <!-- ================= MODAL: AGREGAR UNIDAD MANUAL ================= -->
    <div class="modal-overlay" id="modal-add-unidad">
        <div class="modal-card" style="max-width: 450px;">
            <div class="modal-header">
                <span class="modal-title" id="modal-unidad-title">Agregar Nueva Unidad Manual</span>
                <button class="modal-close" onclick="closeAddUnidadModal()"><i data-lucide="x"></i></button>
            </div>
            <div class="modal-body">
                <form id="form-add-unidad" onsubmit="event.preventDefault();">
                    <input type="hidden" id="edit-unidad-id" value="">
                    
                    <div class="form-group">
                        <label for="unidad-torre-id">Seleccionar Torre / Edificio</label>
                        <select id="unidad-torre-id" class="form-control" onchange="updateUnidadPreviewName()">
                            <!-- Cargado dinámicamente: Torres existentes o "Ninguno / Casa" -->
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label for="unidad-numero">Número de Unidad *</label>
                        <input type="text" id="unidad-numero" class="form-control" placeholder="Ej: 101, 12, A-4" required oninput="updateUnidadPreviewName()">
                    </div>
                    
                    <div class="form-group">
                        <label for="unidad-preview-name">Identificador Generado (Composición)</label>
                        <input type="text" id="unidad-preview-name" class="form-control" style="background: rgba(255,255,255,0.05); color: #fff; border-color: var(--border-color);" readonly>
                        <small style="color: var(--text-secondary); margin-top: 0.25rem; display: block;">
                            Se compone automáticamente de: [Torre] + [Número de unidad].
                        </small>
                    </div>
                    
                    <div class="form-group">
                        <label for="unidad-tipo-unidad-id">Tipo de Unidad (Alícuota) *</label>
                        <select id="unidad-tipo-unidad-id" class="form-control" required>
                            <!-- Cargado dinámicamente desde tipos_unidades -->
                        </select>
                    </div>

                    <!-- Información Adicional de Residentes (Lectura) -->
                    <div id="unidad-adicional-readonly" style="display: none; border-top: 1px solid var(--border-color); padding-top: 1rem; margin-top: 1rem; animation: fadeIn 0.3s ease;">
                        <div class="grid-2col" style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1rem;">
                            <div class="form-group" style="margin-bottom: 0;">
                                <label style="font-size: 0.75rem; color: var(--text-secondary);">Dueño del Departamento</label>
                                <div id="unidad-read-propietario" style="background: rgba(255,255,255,0.03); border: 1px solid var(--border-color); padding: 0.5rem; border-radius: 6px; font-size: 0.85rem; color: #fff; min-height: 38px; display: flex; align-items: center; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">-</div>
                            </div>
                            <div class="form-group" style="margin-bottom: 0;">
                                <label style="font-size: 0.75rem; color: var(--text-secondary);">Estacionamiento</label>
                                <div id="unidad-read-estacionamiento" style="background: rgba(255,255,255,0.03); border: 1px solid var(--border-color); padding: 0.5rem; border-radius: 6px; font-size: 0.85rem; color: #fff; min-height: 38px; display: flex; align-items: center;">-</div>
                            </div>
                        </div>
                        <button type="button" class="btn btn-secondary" onclick="navigateToResidentProfileFromUnitModal()" style="width: 100%; display: flex; align-items: center; justify-content: center; gap: 0.5rem; font-size: 0.8rem; padding: 0.5rem; margin-top: 0.5rem; margin-bottom: 1rem;">
                            <i data-lucide="users" style="width: 15px; height: 15px;"></i> Ver Ficha de Residentes
                        </button>

                        <!-- Sección: Historial de Gastos Comunes Emitidos -->
                        <div id="unidad-gc-history-section" style="border-top: 1px solid var(--border-color); padding-top: 1rem; margin-top: 0.5rem;">
                            <label style="font-size: 0.8rem; font-weight: 600; color: #fff; display: flex; align-items: center; gap: 0.25rem; margin-bottom: 0.5rem;">
                                <i data-lucide="file-text" style="width: 14px; height: 14px; color: var(--accent-color);"></i> Gastos Comunes Emitidos
                            </label>
                            <div id="unidad-gc-list-container" style="max-height: 150px; overflow-y: auto; font-size: 0.8rem; display: flex; flex-direction: column; gap: 0.5rem;">
                                <!-- Dinámico -->
                            </div>
                        </div>
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <button class="btn btn-secondary" onclick="closeAddUnidadModal()">Cancelar</button>
                <button class="btn btn-primary" onclick="submitAddUnidadForm()" id="btn-submit-unidad">Guardar Unidad</button>
            </div>
        </div>
    </div>

    <!-- ================= MODAL: FICHA DE COLABORADOR ================= -->
    <div class="modal-overlay" id="modal-colaborador">
        <div class="modal-card" style="max-width: 900px; width: 90%;">
            <div class="modal-header">
                <span class="modal-title" id="modal-colaborador-title">Ingresar Nuevo Colaborador</span>
                <button class="modal-close" onclick="closeColaboradorModal()"><i data-lucide="x"></i></button>
            </div>
            
            <!-- Pestañas Internas del Modal -->
            <div style="display: flex; gap: 1rem; border-bottom: 1px solid var(--border-color); padding: 0.75rem 1.5rem 0 1.5rem; background: var(--bg-secondary);">
                <button class="tab-btn active" id="tab-btn-colab-principal" onclick="switchColabModalTab('principal')" style="background:none; border:none; color:#fff; padding:0.5rem 1rem; font-size:0.85rem; font-weight:600; cursor:pointer; border-bottom:2px solid var(--accent-color);">
                    Datos Principales
                </button>
                <button class="tab-btn" id="tab-btn-colab-liquidaciones" onclick="switchColabModalTab('liquidaciones')" style="background:none; border:none; color:var(--text-secondary); padding:0.5rem 1rem; font-size:0.85rem; font-weight:600; cursor:pointer; border-bottom:2px solid transparent;">
                    Liquidaciones
                </button>
                <button class="tab-btn" id="tab-btn-colab-amonestaciones" onclick="switchColabModalTab('amonestaciones')" style="background:none; border:none; color:var(--text-secondary); padding:0.5rem 1rem; font-size:0.85rem; font-weight:600; cursor:pointer; border-bottom:2px solid transparent;">
                    Amonestaciones
                </button>
            </div>

            <div class="modal-body" style="padding: 1.5rem; max-height: 70vh; overflow-y: auto;">
                
                <!-- SECCIÓN 1: Datos Principales -->
                <div id="colab-modal-tab-principal">
                    <form id="form-colaborador" onsubmit="event.preventDefault();" enctype="multipart/form-data">
                        <input type="hidden" id="colaborador-id" value="">
                        
                        <h4 style="color: var(--accent-color); font-size: 0.9rem; margin-bottom: 1rem; border-bottom: 1px solid var(--border-color); padding-bottom: 0.25rem;">1. Ficha Personal</h4>
                        <div class="grid-2col" style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1rem;">
                            <div class="form-group">
                                <label for="colaborador-nombres">Nombres *</label>
                                <input type="text" id="colaborador-nombres" class="form-control" required placeholder="Ej: José Luis">
                            </div>
                            <div class="form-group">
                                <label for="colaborador-apellidos">Apellidos *</label>
                                <input type="text" id="colaborador-apellidos" class="form-control" required placeholder="Ej: Muñoz Rojas">
                            </div>
                        </div>

                        <div class="grid-2col" style="display: grid; grid-template-columns: 1.5fr 1fr; gap: 1rem; margin-bottom: 1rem;">
                            <div class="form-group" style="margin: 0;">
                                <label for="colaborador-dob">Fecha de Nacimiento *</label>
                                <div style="display: flex; gap: 0.5rem; align-items: center;">
                                    <input type="date" id="colaborador-dob" class="form-control" required onchange="calculateColabAge()" style="margin: 0;">
                                    <div id="colaborador-age-display" style="background: rgba(255,255,255,0.05); padding: 0.5rem 0.75rem; border-radius: 6px; font-size: 0.8rem; color: var(--text-secondary); border: 1px solid var(--border-color); white-space: nowrap; height: 38px; display: flex; align-items: center;">
                                        Edad: -- años
                                    </div>
                                </div>
                            </div>
                            <div class="form-group">
                                <label for="colaborador-telefono">Teléfono</label>
                                <input type="text" id="colaborador-telefono" class="form-control" placeholder="Ej: +56 9 8765 4321">
                            </div>
                        </div>

                        <div class="grid-2col" style="display: grid; grid-template-columns: 1fr 1.5fr; gap: 1rem; margin-bottom: 1rem;">
                            <div class="form-group">
                                <label for="colaborador-email">Correo Electrónico</label>
                                <input type="email" id="colaborador-email" class="form-control" placeholder="Ej: jose.munoz@gmail.com">
                            </div>
                            <div class="form-group">
                                <label for="colaborador-direccion">Dirección Física</label>
                                <input type="text" id="colaborador-direccion" class="form-control" placeholder="Ej: Av. Las Torres 450, Chiguayante">
                            </div>
                        </div>

                        <h4 style="color: var(--accent-color); font-size: 0.9rem; margin: 1.5rem 0 1rem 0; border-bottom: 1px solid var(--border-color); padding-bottom: 0.25rem;">2. En Caso de Emergencia Avisar A:</h4>
                        <div class="grid-2col" style="display: grid; grid-template-columns: 1.5fr 1fr; gap: 1rem; margin-bottom: 1rem;">
                            <div class="form-group">
                                <label for="colaborador-emergencia-nombre">Nombre de Persona de Contacto</label>
                                <input type="text" id="colaborador-emergencia-nombre" class="form-control" placeholder="Ej: María Rojas (Madre)">
                            </div>
                            <div class="form-group">
                                <label for="colaborador-emergencia-telefono">Teléfono de Emergencia</label>
                                <input type="text" id="colaborador-emergencia-telefono" class="form-control" placeholder="Ej: +56 9 1234 5678">
                            </div>
                        </div>

                        <h4 style="color: var(--accent-color); font-size: 0.9rem; margin: 1.5rem 0 1rem 0; border-bottom: 1px solid var(--border-color); padding-bottom: 0.25rem;">3. Datos Laborales</h4>
                        <div class="grid-3col" style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 1rem; margin-bottom: 1rem;">
                            <div class="form-group">
                                <label for="colaborador-cargo-id">Cargo *</label>
                                <select id="colaborador-cargo-id" class="form-control" required>
                                    <option value="">Seleccione cargo...</option>
                                    <!-- Dinámico -->
                                </select>
                            </div>
                            <div class="form-group">
                                <label for="colaborador-tipo-contrato">Tipo de Contrato</label>
                                <select id="colaborador-tipo-contrato" class="form-control">
                                    <option value="1_mes">1 Mes</option>
                                    <option value="3_meses">3 Meses</option>
                                    <option value="indefinido">Indefinido</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label for="colaborador-sueldo-liquido">Sueldo Líquido ($)</label>
                                <input type="number" id="colaborador-sueldo-liquido" class="form-control" placeholder="0.00" min="0">
                            </div>
                        </div>

                        <div class="grid-2col" style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1.5rem;">
                            <!-- Estado Laboral -->
                            <div class="form-group" style="margin: 0;">
                                <label style="font-size: 0.8rem; color: var(--text-secondary); margin-bottom: 0.5rem; display: block;">Estado Laboral</label>
                                <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
                                    <label class="btn-state" style="display: flex; align-items: center; gap: 0.25rem; font-size: 0.75rem; padding: 0.4rem 0.75rem; border-radius: 6px; border: 1px solid var(--border-color); cursor: pointer; color: var(--text-secondary);">
                                        <input type="radio" name="colaborador-estado" value="activo" checked style="margin:0;"> Activo
                                    </label>
                                    <label class="btn-state" style="display: flex; align-items: center; gap: 0.25rem; font-size: 0.75rem; padding: 0.4rem 0.75rem; border-radius: 6px; border: 1px solid var(--border-color); cursor: pointer; color: var(--text-secondary);">
                                        <input type="radio" name="colaborador-estado" value="vacaciones" style="margin:0;"> Vacaciones
                                    </label>
                                    <label class="btn-state" style="display: flex; align-items: center; gap: 0.25rem; font-size: 0.75rem; padding: 0.4rem 0.75rem; border-radius: 6px; border: 1px solid var(--border-color); cursor: pointer; color: var(--text-secondary);">
                                        <input type="radio" name="colaborador-estado" value="licencia" style="margin:0;"> Licencia
                                    </label>
                                    <label class="btn-state" style="display: flex; align-items: center; gap: 0.25rem; font-size: 0.75rem; padding: 0.4rem 0.75rem; border-radius: 6px; border: 1px solid var(--border-color); cursor: pointer; color: var(--text-secondary);">
                                        <input type="radio" name="colaborador-estado" value="desvinculado" style="margin:0;"> Desvinculado
                                    </label>
                                    <label class="btn-state" style="display: flex; align-items: center; gap: 0.25rem; font-size: 0.75rem; padding: 0.4rem 0.75rem; border-radius: 6px; border: 1px solid var(--border-color); cursor: pointer; color: var(--text-secondary);">
                                        <input type="radio" name="colaborador-estado" value="permiso" style="margin:0;"> Permiso
                                    </label>
                                </div>
                            </div>
                            
                            <!-- Contrato Adjunto -->
                            <div class="form-group" style="margin: 0;">
                                <label for="colaborador-contrato">Documento de Contrato</label>
                                <input type="file" id="colaborador-contrato" class="form-control" style="height: 38px;">
                                <div id="colaborador-contrato-download" style="margin-top: 0.4rem; font-size: 0.8rem; display: none;">
                                    <a href="#" target="_blank" class="text-success" style="display: inline-flex; align-items: center; gap: 0.25rem;">
                                        <i data-lucide="download" style="width: 14px; height: 14px;"></i> Descargar Contrato Vigente
                                    </a>
                                </div>
                            </div>

                            <!-- Permisos adicionales / Pedidos de insumos -->
                            <div class="form-group" style="margin: 0; display: flex; align-items: center; gap: 0.5rem; padding: 0.5rem 0;">
                                <input type="checkbox" id="colaborador-permitir-insumos" style="width: 16px; height: 16px; cursor: pointer; accent-color: var(--accent-color);">
                                <label for="colaborador-permitir-insumos" style="font-size: 0.8rem; color: #fff; cursor: pointer; font-weight: 600; margin: 0;">
                                    Permitir Solicitud y Pedidos de Insumos/Repuestos
                                </label>
                            </div>
                        </div>

                        <h4 style="color: var(--accent-color); font-size: 0.9rem; margin: 1.5rem 0 1rem 0; border-bottom: 1px solid var(--border-color); padding-bottom: 0.25rem;">4. Horario y Funciones de Trabajo</h4>
                        
                        <!-- Configuración de Horario de Trabajo -->
                        <div class="form-group" style="background: rgba(0,0,0,0.15); border: 1px solid var(--border-color); padding: 1.25rem; border-radius: 8px; margin-bottom: 1.5rem;">
                            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; flex-wrap: wrap; gap: 0.5rem;">
                                <label style="font-weight: bold; color: var(--accent-color); font-size: 0.9rem; margin: 0;">Configuración de Horario de Trabajo</label>
                                <div style="font-weight: bold; font-size: 0.85rem; color: #fff; background: rgba(59, 130, 246, 0.2); border: 1px solid #3b82f6; padding: 0.3rem 0.75rem; border-radius: 6px;" id="colab-total-horas-display">
                                    Total Horas: 0 hrs/semana
                                </div>
                            </div>

                            <div class="grid-2col" style="display: grid; grid-template-columns: 1.2fr 1.8fr; gap: 1rem; margin-bottom: 1rem; border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom: 1rem;">
                                <div class="form-group" style="margin: 0;">
                                    <label for="colab-horario-tipo" style="font-size: 0.75rem; color: var(--text-secondary);">Tipo de Horario</label>
                                    <select id="colab-horario-tipo" class="form-control" onchange="toggleScheduleTypeUI()" style="height: 38px;">
                                        <option value="basico">Horario Básico</option>
                                        <option value="por_dias">Horario por Días</option>
                                        <option value="medio_turno">Horario Medio Turno</option>
                                    </select>
                                </div>
                                <div style="font-size: 0.75rem; color: var(--text-secondary); display: flex; align-items: center; line-height: 1.3;">
                                    <span id="colab-horario-tipo-desc">Configure las horas de entrada y salida para cada día de la semana.</span>
                                </div>
                            </div>

                            <!-- PANEL A: Horario Básico & Medio Turno (Lunes a Domingo Vertical) -->
                            <div id="panel-horario-basico" style="display: block;">
                                <div style="display: flex; flex-direction: column; gap: 0.5rem;">
                                    <!-- Header labels -->
                                    <div style="display: grid; grid-template-columns: 30px 1.2fr 1.8fr 1.8fr 1.5fr 1fr; gap: 0.5rem; font-weight: bold; font-size: 0.75rem; color: var(--text-secondary); padding: 0 0.5rem; align-items: center;">
                                        <div style="text-align: center;">Act</div>
                                        <div>Día</div>
                                        <div>Hora Entrada</div>
                                        <div>Hora Salida</div>
                                        <div>Colación (min)</div>
                                        <div style="text-align: right;">Horas</div>
                                    </div>
                                    <!-- Days -->
                                    <!-- Lunes -->
                                    <div class="dia-row" data-dia="lunes" style="display: grid; grid-template-columns: 30px 1.2fr 1.8fr 1.8fr 1.5fr 1fr; gap: 0.5rem; align-items: center; background: rgba(255,255,255,0.02); padding: 0.4rem 0.5rem; border-radius: 6px; border: 1px solid rgba(255,255,255,0.03);">
                                        <div style="display: flex; align-items: center; justify-content: center;"><input type="checkbox" class="colab-dia-check" checked onchange="updateDayRowState('lunes')"></div>
                                        <span style="font-size: 0.8rem; font-weight: 500; color: #fff;">Lunes</span>
                                        <div><input type="time" class="form-control colab-dia-entrada" value="09:00" style="padding: 0.25rem 0.5rem; font-size: 0.8rem; height: auto;" onchange="calculateScheduleHours()"></div>
                                        <div><input type="time" class="form-control colab-dia-salida" value="18:00" style="padding: 0.25rem 0.5rem; font-size: 0.8rem; height: auto;" onchange="calculateScheduleHours()"></div>
                                        <div><input type="number" class="form-control colab-dia-colacion" value="60" min="0" step="5" style="padding: 0.25rem 0.5rem; font-size: 0.8rem; height: auto;" onchange="calculateScheduleHours()"></div>
                                        <div class="colab-dia-horas" style="text-align: right; font-size: 0.8rem; color: var(--text-secondary);">8.0 hrs</div>
                                    </div>
                                    <!-- Martes -->
                                    <div class="dia-row" data-dia="martes" style="display: grid; grid-template-columns: 30px 1.2fr 1.8fr 1.8fr 1.5fr 1fr; gap: 0.5rem; align-items: center; background: rgba(255,255,255,0.02); padding: 0.4rem 0.5rem; border-radius: 6px; border: 1px solid rgba(255,255,255,0.03);">
                                        <div style="display: flex; align-items: center; justify-content: center;"><input type="checkbox" class="colab-dia-check" checked onchange="updateDayRowState('martes')"></div>
                                        <span style="font-size: 0.8rem; font-weight: 500; color: #fff;">Martes</span>
                                        <div><input type="time" class="form-control colab-dia-entrada" value="09:00" style="padding: 0.25rem 0.5rem; font-size: 0.8rem; height: auto;" onchange="calculateScheduleHours()"></div>
                                        <div><input type="time" class="form-control colab-dia-salida" value="18:00" style="padding: 0.25rem 0.5rem; font-size: 0.8rem; height: auto;" onchange="calculateScheduleHours()"></div>
                                        <div><input type="number" class="form-control colab-dia-colacion" value="60" min="0" step="5" style="padding: 0.25rem 0.5rem; font-size: 0.8rem; height: auto;" onchange="calculateScheduleHours()"></div>
                                        <div class="colab-dia-horas" style="text-align: right; font-size: 0.8rem; color: var(--text-secondary);">8.0 hrs</div>
                                    </div>
                                    <!-- Miércoles -->
                                    <div class="dia-row" data-dia="miercoles" style="display: grid; grid-template-columns: 30px 1.2fr 1.8fr 1.8fr 1.5fr 1fr; gap: 0.5rem; align-items: center; background: rgba(255,255,255,0.02); padding: 0.4rem 0.5rem; border-radius: 6px; border: 1px solid rgba(255,255,255,0.03);">
                                        <div style="display: flex; align-items: center; justify-content: center;"><input type="checkbox" class="colab-dia-check" checked onchange="updateDayRowState('miercoles')"></div>
                                        <span style="font-size: 0.8rem; font-weight: 500; color: #fff;">Miércoles</span>
                                        <div><input type="time" class="form-control colab-dia-entrada" value="09:00" style="padding: 0.25rem 0.5rem; font-size: 0.8rem; height: auto;" onchange="calculateScheduleHours()"></div>
                                        <div><input type="time" class="form-control colab-dia-salida" value="18:00" style="padding: 0.25rem 0.5rem; font-size: 0.8rem; height: auto;" onchange="calculateScheduleHours()"></div>
                                        <div><input type="number" class="form-control colab-dia-colacion" value="60" min="0" step="5" style="padding: 0.25rem 0.5rem; font-size: 0.8rem; height: auto;" onchange="calculateScheduleHours()"></div>
                                        <div class="colab-dia-horas" style="text-align: right; font-size: 0.8rem; color: var(--text-secondary);">8.0 hrs</div>
                                    </div>
                                    <!-- Jueves -->
                                    <div class="dia-row" data-dia="jueves" style="display: grid; grid-template-columns: 30px 1.2fr 1.8fr 1.8fr 1.5fr 1fr; gap: 0.5rem; align-items: center; background: rgba(255,255,255,0.02); padding: 0.4rem 0.5rem; border-radius: 6px; border: 1px solid rgba(255,255,255,0.03);">
                                        <div style="display: flex; align-items: center; justify-content: center;"><input type="checkbox" class="colab-dia-check" checked onchange="updateDayRowState('jueves')"></div>
                                        <span style="font-size: 0.8rem; font-weight: 500; color: #fff;">Jueves</span>
                                        <div><input type="time" class="form-control colab-dia-entrada" value="09:00" style="padding: 0.25rem 0.5rem; font-size: 0.8rem; height: auto;" onchange="calculateScheduleHours()"></div>
                                        <div><input type="time" class="form-control colab-dia-salida" value="18:00" style="padding: 0.25rem 0.5rem; font-size: 0.8rem; height: auto;" onchange="calculateScheduleHours()"></div>
                                        <div><input type="number" class="form-control colab-dia-colacion" value="60" min="0" step="5" style="padding: 0.25rem 0.5rem; font-size: 0.8rem; height: auto;" onchange="calculateScheduleHours()"></div>
                                        <div class="colab-dia-horas" style="text-align: right; font-size: 0.8rem; color: var(--text-secondary);">8.0 hrs</div>
                                    </div>
                                    <!-- Viernes -->
                                    <div class="dia-row" data-dia="viernes" style="display: grid; grid-template-columns: 30px 1.2fr 1.8fr 1.8fr 1.5fr 1fr; gap: 0.5rem; align-items: center; background: rgba(255,255,255,0.02); padding: 0.4rem 0.5rem; border-radius: 6px; border: 1px solid rgba(255,255,255,0.03);">
                                        <div style="display: flex; align-items: center; justify-content: center;"><input type="checkbox" class="colab-dia-check" checked onchange="updateDayRowState('viernes')"></div>
                                        <span style="font-size: 0.8rem; font-weight: 500; color: #fff;">Viernes</span>
                                        <div><input type="time" class="form-control colab-dia-entrada" value="09:00" style="padding: 0.25rem 0.5rem; font-size: 0.8rem; height: auto;" onchange="calculateScheduleHours()"></div>
                                        <div><input type="time" class="form-control colab-dia-salida" value="18:00" style="padding: 0.25rem 0.5rem; font-size: 0.8rem; height: auto;" onchange="calculateScheduleHours()"></div>
                                        <div><input type="number" class="form-control colab-dia-colacion" value="60" min="0" step="5" style="padding: 0.25rem 0.5rem; font-size: 0.8rem; height: auto;" onchange="calculateScheduleHours()"></div>
                                        <div class="colab-dia-horas" style="text-align: right; font-size: 0.8rem; color: var(--text-secondary);">8.0 hrs</div>
                                    </div>
                                    <!-- Sábado -->
                                    <div class="dia-row" data-dia="sabado" style="display: grid; grid-template-columns: 30px 1.2fr 1.8fr 1.8fr 1.5fr 1fr; gap: 0.5rem; align-items: center; background: rgba(255,255,255,0.02); padding: 0.4rem 0.5rem; border-radius: 6px; border: 1px solid rgba(255,255,255,0.03);">
                                        <div style="display: flex; align-items: center; justify-content: center;"><input type="checkbox" class="colab-dia-check" onchange="updateDayRowState('sabado')"></div>
                                        <span style="font-size: 0.8rem; font-weight: 500; color: #fff;">Sábado</span>
                                        <div><input type="time" class="form-control colab-dia-entrada" value="09:00" disabled style="padding: 0.25rem 0.5rem; font-size: 0.8rem; height: auto;" onchange="calculateScheduleHours()"></div>
                                        <div><input type="time" class="form-control colab-dia-salida" value="13:00" disabled style="padding: 0.25rem 0.5rem; font-size: 0.8rem; height: auto;" onchange="calculateScheduleHours()"></div>
                                        <div><input type="number" class="form-control colab-dia-colacion" value="60" min="0" step="5" disabled style="padding: 0.25rem 0.5rem; font-size: 0.8rem; height: auto;" onchange="calculateScheduleHours()"></div>
                                        <div class="colab-dia-horas" style="text-align: right; font-size: 0.8rem; color: var(--text-secondary);">0.0 hrs</div>
                                    </div>
                                    <!-- Domingo -->
                                    <div class="dia-row" data-dia="domingo" style="display: grid; grid-template-columns: 30px 1.2fr 1.8fr 1.8fr 1.5fr 1fr; gap: 0.5rem; align-items: center; background: rgba(255,255,255,0.02); padding: 0.4rem 0.5rem; border-radius: 6px; border: 1px solid rgba(255,255,255,0.03);">
                                        <div style="display: flex; align-items: center; justify-content: center;"><input type="checkbox" class="colab-dia-check" onchange="updateDayRowState('domingo')"></div>
                                        <span style="font-size: 0.8rem; font-weight: 500; color: #fff;">Domingo</span>
                                        <div><input type="time" class="form-control colab-dia-entrada" value="09:00" disabled style="padding: 0.25rem 0.5rem; font-size: 0.8rem; height: auto;" onchange="calculateScheduleHours()"></div>
                                        <div><input type="time" class="form-control colab-dia-salida" value="13:00" disabled style="padding: 0.25rem 0.5rem; font-size: 0.8rem; height: auto;" onchange="calculateScheduleHours()"></div>
                                        <div><input type="number" class="form-control colab-dia-colacion" value="60" min="0" step="5" disabled style="padding: 0.25rem 0.5rem; font-size: 0.8rem; height: auto;" onchange="calculateScheduleHours()"></div>
                                        <div class="colab-dia-horas" style="text-align: right; font-size: 0.8rem; color: var(--text-secondary);">0.0 hrs</div>
                                    </div>
                                </div>
                            </div>

                            <!-- PANEL B: Horario por Días (Hora única + Cantidad de Días) -->
                            <div id="panel-horario-por-dias" style="display: none;">
                                <div class="grid-4col" style="display: grid; grid-template-columns: 1fr 1fr 1fr 1fr; gap: 1rem; margin-bottom: 1rem;">
                                    <div class="form-group" style="margin: 0;">
                                        <label for="colab-pd-entrada" style="font-size: 0.75rem; color: var(--text-secondary);">Hora de Entrada</label>
                                        <input type="time" id="colab-pd-entrada" class="form-control" value="08:00" onchange="calculateScheduleHours()" style="height: 38px;">
                                    </div>
                                    <div class="form-group" style="margin: 0;">
                                        <label for="colab-pd-salida" style="font-size: 0.75rem; color: var(--text-secondary);">Hora de Salida</label>
                                        <input type="time" id="colab-pd-salida" class="form-control" value="16:00" onchange="calculateScheduleHours()" style="height: 38px;">
                                    </div>
                                    <div class="form-group" style="margin: 0;">
                                        <label for="colab-pd-dias-cantidad" style="font-size: 0.75rem; color: var(--text-secondary);">Cantidad de Días / Semana</label>
                                        <input type="number" id="colab-pd-dias-cantidad" class="form-control" value="5" min="1" max="7" step="1" onchange="calculateScheduleHours()" style="height: 38px;">
                                    </div>
                                    <div class="form-group" style="margin: 0;">
                                        <label for="colab-pd-colacion" style="font-size: 0.75rem; color: var(--text-secondary);">Colación (min/día)</label>
                                        <input type="number" id="colab-pd-colacion" class="form-control" value="60" min="0" step="5" onchange="calculateScheduleHours()" style="height: 38px;">
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Funciones del Colaborador -->
                        <div class="grid-2col" style="display: grid; grid-template-columns: 1fr; gap: 1rem; margin-bottom: 1rem;">
                            <!-- Agregar Funciones -->
                            <div class="form-group">
                                <label>Funciones / Tareas Asignadas</label>
                                <div style="display: flex; gap: 0.5rem;">
                                    <input type="text" id="colaborador-funcion-input" class="form-control" placeholder="Agregar una función (Ej: Ronda nocturna)...">
                                    <button type="button" class="btn btn-secondary" onclick="addColaboradorFuncionUI()" style="padding: 0 0.75rem; min-width: auto; height: 38px;">
                                        <i data-lucide="plus" style="width: 16px; height: 16px;"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                        
                        <!-- Listado de Funciones cargadas -->
                        <div class="form-group" style="margin-bottom: 1.5rem;">
                            <label style="font-size: 0.75rem; color: var(--text-secondary);">Lista de Funciones Agregadas:</label>
                            <div id="colaborador-funciones-lista" style="background: rgba(0,0,0,0.2); border: 1px solid var(--border-color); border-radius: 6px; padding: 0.75rem; display: flex; flex-direction: column; gap: 0.5rem; max-height: 150px; overflow-y: auto;">
                                <div id="colaborador-funciones-empty" style="color: var(--text-muted); font-size: 0.8rem; font-style: italic;">No se han agregado funciones.</div>
                            </div>
                        </div>

                        <div class="form-group" style="margin-bottom: 0;">
                            <label for="colaborador-observaciones">Observaciones Generales</label>
                            <textarea id="colaborador-observaciones" class="form-control" rows="3" placeholder="Detalles de horarios, bonificaciones, conducta, etc."></textarea>
                        </div>
                    </form>
                </div>

                <!-- SECCIÓN 2: Historial de Liquidaciones -->
                <div id="colab-modal-tab-liquidaciones" style="display: none;">
                    <div style="background: rgba(255,255,255,0.02); border: 1px solid var(--border-color); padding: 1rem; border-radius: 8px; margin-bottom: 1.5rem;">
                        <h4 style="color: #fff; font-size: 0.9rem; margin-bottom: 0.75rem;">Subir Nueva Liquidación Mensual</h4>
                        <form id="form-upload-liq" onsubmit="event.preventDefault();" style="display: flex; gap: 1rem; align-items: flex-end; flex-wrap: wrap;">
                            <div class="form-group" style="margin: 0; flex: 1; min-width: 180px;">
                                <label for="liq-periodo" style="font-size: 0.75rem; color: var(--text-secondary);">Período (Mes/Año)</label>
                                <input type="month" id="liq-periodo" class="form-control" style="margin: 0; height: 38px;">
                            </div>
                            <div class="form-group" style="margin: 0; flex: 2; min-width: 250px;">
                                <label for="liq-archivo" style="font-size: 0.75rem; color: var(--text-secondary);">Archivo (PDF o Imagen)</label>
                                <input type="file" id="liq-archivo" class="form-control" style="margin: 0; height: 38px;">
                            </div>
                            <button type="button" class="btn btn-primary" onclick="submitUploadLiquidacion()" style="height: 38px; display: inline-flex; align-items: center; gap: 0.5rem;">
                                <i data-lucide="upload" style="width:16px; height:16px;"></i> Subir
                            </button>
                        </form>
                    </div>

                    <h4 style="color: var(--text-secondary); font-size: 0.85rem; margin-bottom: 0.75rem;">Historial de Liquidaciones Registradas</h4>
                    <div class="table-responsive" style="border: 1px solid var(--border-color); border-radius: 8px;">
                        <table class="table" style="font-size: 0.8rem; margin: 0;">
                            <thead>
                                <tr>
                                    <th style="padding: 0.5rem;">Mes / Período</th>
                                    <th style="padding: 0.5rem;">Fecha de Carga</th>
                                    <th style="padding: 0.5rem; text-align: center; width: 100px;">Descargar</th>
                                    <th style="padding: 0.5rem; text-align: center; width: 80px;">Acción</th>
                                </tr>
                            </thead>
                            <tbody id="tbody-colab-liquidaciones">
                                <!-- Dinámico -->
                            </tbody>
                        </table>
                    </div>
                </div>

                <!-- SECCIÓN 3: Registro de Amonestaciones -->
                <div id="colab-modal-tab-amonestaciones" style="display: none;">
                    <div style="background: rgba(255,255,255,0.02); border: 1px solid var(--border-color); padding: 1.25rem; border-radius: 8px; margin-bottom: 1.5rem;">
                        <h4 style="color: #fff; font-size: 0.9rem; margin-bottom: 0.75rem;">Registrar Nueva Amonestación</h4>
                        <form id="form-save-amon" onsubmit="event.preventDefault();">
                            <div class="grid-3col" style="display: grid; grid-template-columns: 1fr 1fr 2fr; gap: 1rem; margin-bottom: 1rem; align-items: flex-end;">
                                <div class="form-group" style="margin: 0;">
                                    <label for="amon-fecha" style="font-size: 0.75rem; color: var(--text-secondary);">Fecha</label>
                                    <input type="date" id="amon-fecha" class="form-control" style="margin: 0; height: 38px;">
                                </div>
                                <div class="form-group" style="margin: 0;">
                                    <label for="amon-hora" style="font-size: 0.75rem; color: var(--text-secondary);">Hora</label>
                                    <input type="time" id="amon-hora" class="form-control" style="margin: 0; height: 38px;">
                                </div>
                                <div class="form-group" style="margin: 0;">
                                    <label for="amon-archivo" style="font-size: 0.75rem; color: var(--text-secondary);">Documento de Respaldo (Opcional)</label>
                                    <input type="file" id="amon-archivo" class="form-control" style="margin: 0; height: 38px;">
                                </div>
                            </div>
                            <div class="form-group" style="margin-bottom: 1rem;">
                                <label for="amon-descripcion" style="font-size: 0.75rem; color: var(--text-secondary);">Descripción / Motivo de la Amonestación *</label>
                                <textarea id="amon-descripcion" class="form-control" rows="2" placeholder="Detalle los motivos y faltas cometidas por el colaborador..."></textarea>
                            </div>
                            <div style="display: flex; justify-content: flex-end;">
                                <button type="button" class="btn btn-primary" onclick="submitSaveAmonestacion()" style="display: inline-flex; align-items: center; gap: 0.5rem;">
                                    <i data-lucide="plus-circle" style="width: 16px; height: 16px;"></i> Registrar Amonestación
                                </button>
                            </div>
                        </form>
                    </div>

                    <h4 style="color: var(--text-secondary); font-size: 0.85rem; margin-bottom: 0.75rem;">Historial de Faltas y Amonestaciones</h4>
                    <div class="table-responsive" style="border: 1px solid var(--border-color); border-radius: 8px;">
                        <table class="table" style="font-size: 0.8rem; margin: 0;">
                            <thead>
                                <tr>
                                    <th style="padding: 0.5rem; width: 100px;">Fecha</th>
                                    <th style="padding: 0.5rem; width: 80px;">Hora</th>
                                    <th style="padding: 0.5rem;">Descripción</th>
                                    <th style="padding: 0.5rem; text-align: center; width: 100px;">Respaldo</th>
                                    <th style="padding: 0.5rem; text-align: center; width: 80px;">Acción</th>
                                </tr>
                            </thead>
                            <tbody id="tbody-colab-amonestaciones">
                                <!-- Dinámico -->
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>

            <div class="modal-footer" style="background: var(--bg-secondary);">
                <button class="btn btn-secondary" onclick="closeColaboradorModal()">Cerrar</button>
                <button class="btn btn-primary" id="btn-submit-colaborador" onclick="submitColaboradorForm()">Guardar Ficha</button>
            </div>
        </div>
    </div>



    <!-- ================= ONBOARDING CONDOMINIO OVERLAY ================= -->
    <div class="onboarding-overlay" id="onboarding-condominio-overlay" style="display: none;">
        <div class="onboarding-card" style="max-width: 600px; padding: 2.5rem;">
            <div class="onboarding-logo">
                <i data-lucide="building-2" style="width: 48px; height: 48px; color: var(--accent-color);"></i>
            </div>
            <h2 id="condo-wizard-title" style="margin-bottom: 0.5rem;">Configura tu Condominio</h2>
            <p style="color: var(--text-muted); font-size: 0.9rem; margin-bottom: 2rem; text-align: center;">
                Antes de comenzar, necesitamos definir la estructura física del condominio para gestionar los gastos correctamente.
            </p>

            <div class="step-indicators" style="display: flex; justify-content: center; gap: 2rem; margin-bottom: 2rem; width: 100%;">
                <div class="step-ind active" id="condo-ind-1">1</div>
                <div class="step-ind" id="condo-ind-2">2</div>
                <div class="step-ind" id="condo-ind-3">3</div>
            </div>

            <form id="form-setup-condominio" onsubmit="submitCondominioSetup(event)" style="width: 100%;">
                <!-- PASO 1: Tipo de Inmueble -->
                <div class="condo-step" id="condo-step-1" style="display: block;">
                    <h3 style="font-size: 1rem; color: #fff; margin-bottom: 1rem; text-align: center;">Selecciona el Tipo de Inmueble</h3>
                    
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1.5rem;">
                        <div class="inmueble-type-card" onclick="selectInmuebleType('condominio_edificios')" id="type-card-condominio_edificios">
                            <i data-lucide="layout-grid" style="width: 28px; height: 28px; margin-bottom: 0.5rem; color: var(--accent-color);"></i>
                            <span style="font-weight: 600; font-size: 0.85rem; color: #fff;">Condo Edificios</span>
                            <span style="font-size: 0.7rem; color: var(--text-secondary); margin-top: 0.25rem;">Múltiples torres de edificios</span>
                        </div>
                        <div class="inmueble-type-card" onclick="selectInmuebleType('condominio_casas')" id="type-card-condominio_casas">
                            <i data-lucide="home" style="width: 28px; height: 28px; margin-bottom: 0.5rem; color: var(--accent-color);"></i>
                            <span style="font-weight: 600; font-size: 0.85rem; color: #fff;">Condo Casas</span>
                            <span style="font-size: 0.7rem; color: var(--text-secondary); margin-top: 0.25rem;">Casas individuales</span>
                        </div>
                    </div>
                    <input type="hidden" id="condo-tipo-inmueble" required>
                </div>

                <!-- PASO 2: Datos de Estructura -->
                <div class="condo-step" id="condo-step-2" style="display: none; text-align: left;">
                    <div id="fields-torre" style="display: none;">
                        <div class="form-group">
                            <label for="torre-nombre">Nombre de la Torre / Edificio *</label>
                            <input type="text" id="torre-nombre" class="form-control" placeholder="Ej: Torre San Francisco">
                        </div>
                        <div class="form-group">
                            <label for="torre-descripcion">Descripción corta</label>
                            <input type="text" id="torre-descripcion" class="form-control" placeholder="Ej: Edificio residencial de 15 pisos">
                        </div>
                        <div class="grid-3col" style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 0.75rem;">
                            <div class="form-group">
                                <label for="torre-pisos">Nro Pisos</label>
                                <input type="number" id="torre-pisos" class="form-control" min="1" placeholder="Ej: 10">
                            </div>
                            <div class="form-group">
                                <label for="torre-hab">U. Habitacionales</label>
                                <input type="number" id="torre-hab" class="form-control" min="1" placeholder="Ej: 40">
                            </div>
                            <div class="form-group">
                                <label for="torre-com">U. Comerciales</label>
                                <input type="number" id="torre-com" class="form-control" min="0" placeholder="Ej: 2">
                            </div>
                        </div>
                    </div>

                    <div id="fields-edificios" style="display: none;">
                        <div class="form-group">
                            <label for="edif-nombre">Nombre del Condominio de Edificios *</label>
                            <input type="text" id="edif-nombre" class="form-control" placeholder="Ej: Condominio Vista Hermosa">
                        </div>
                        <div class="grid-2col" style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; margin-bottom: 0.5rem;">
                            <div class="form-group">
                                <label for="edif-num-torres">Número de Torres *</label>
                                <input type="number" id="edif-num-torres" class="form-control" min="1" placeholder="Ej: 3">
                            </div>
                            <div class="form-group">
                                <label for="edif-id-tipo">Identificación de Torres</label>
                                <select id="edif-id-tipo" class="form-control">
                                    <option value="letras">Por Letras (A, B, C...)</option>
                                    <option value="numeros">Por Números (1, 2, 3...)</option>
                                </select>
                            </div>
                        </div>
                        <div class="grid-2col" style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; margin-bottom: 0.5rem;">
                            <div class="form-group">
                                <label for="edif-total-deptos">Total Deptos / Unidades *</label>
                                <input type="number" id="edif-total-deptos" class="form-control" min="1" placeholder="Ej: 120">
                            </div>
                            <div class="form-group">
                                <label for="edif-locales-com">Locales Comerciales</label>
                                <input type="number" id="edif-locales-com" class="form-control" min="0" placeholder="Ej: 0" value="0">
                            </div>
                        </div>
                    </div>

                    <div id="fields-casas" style="display: none;">
                        <div class="form-group">
                            <label for="casas-nombre">Nombre del Condominio de Casas *</label>
                            <input type="text" id="casas-nombre" class="form-control" placeholder="Ej: Condominio Los Alerces">
                        </div>
                        <div class="form-group">
                            <label for="casas-num">Número de Casas / Lotes *</label>
                            <input type="number" id="casas-num" class="form-control" min="1" placeholder="Ej: 50">
                        </div>
                    </div>
                    
                    <div class="form-group" style="margin-top: 1.5rem;">
                        <label style="font-weight: 600; color: #fff; margin-bottom: 0.5rem; display: block;">
                            Tipos de Unidades (Copropiedad / Alícuotas) *
                        </label>
                        <p style="font-size: 0.75rem; color: var(--text-secondary); margin-bottom: 0.75rem; line-height: 1.4;">
                            Define los tipos de unidades, identificados por un código administrativo, sus metros cuadrados y el porcentaje (%) de prorrateo a aplicar en la boleta de gastos comunes.
                        </p>
                        <div class="table-responsive" style="border: 1px solid var(--border-color); border-radius: 10px; margin-bottom: 0.75rem; max-height: 200px; overflow-y: auto;">
                            <table class="table" style="font-size: 0.8rem; min-width: 100%;" id="table-unit-types">
                                <thead style="position: sticky; top: 0; background: var(--bg-secondary); z-index: 10;">
                                    <tr>
                                        <th style="padding: 0.5rem;">Código Tipo</th>
                                        <th style="padding: 0.5rem;">Metros Cuadrados</th>
                                        <th style="padding: 0.5rem;">% Prorrateo</th>
                                        <th style="padding: 0.5rem; width: 50px; text-align: center;">Acción</th>
                                    </tr>
                                </thead>
                                <tbody id="tbody-unit-types">
                                    <!-- Filas dinámicas -->
                                </tbody>
                            </table>
                        </div>
                        <button type="button" class="btn btn-secondary" style="font-size: 0.75rem; padding: 0.5rem 1rem; width: fit-content; display: inline-flex; align-items: center; gap: 0.35rem;" onclick="addUnitTypeRow()">
                            <i data-lucide="plus" style="width: 14px; height: 14px;"></i> Agregar Tipo
                        </button>
                    </div>
                </div>

                <!-- PASO 3: Áreas Comunes, Seguridad y Equipamiento -->
                <div class="condo-step" id="condo-step-3" style="display: none; text-align: left;">
                    <h3 style="font-size: 1rem; color: #fff; margin-bottom: 0.5rem;">Áreas Comunes, Seguridad y Equipamiento</h3>
                    <p style="font-size: 0.75rem; color: var(--text-secondary); margin-bottom: 1rem; line-height: 1.4;">
                        Agrega las áreas comunes, sistemas de seguridad u otros elementos del condominio, indicando si su uso tiene un costo de arriendo o es gratuito.
                    </p>
                    
                    <div class="table-responsive" style="border: 1px solid var(--border-color); border-radius: 10px; margin-bottom: 0.75rem; max-height: 250px; overflow-y: auto;">
                        <table class="table" style="font-size: 0.8rem; min-width: 100%;" id="table-equipamiento">
                            <thead style="position: sticky; top: 0; background: var(--bg-secondary); z-index: 10;">
                                <tr>
                                    <th style="padding: 0.5rem;">Clasificación</th>
                                    <th style="padding: 0.5rem;">Nombre del Elemento</th>
                                    <th style="padding: 0.5rem; text-align: center; width: 125px;">Condición</th>
                                    <th style="padding: 0.5rem; width: 50px; text-align: center;">Acción</th>
                                </tr>
                            </thead>
                            <tbody id="tbody-equipamiento">
                                <!-- Filas dinámicas -->
                            </tbody>
                        </table>
                    </div>
                    <button type="button" class="btn btn-secondary" style="font-size: 0.75rem; padding: 0.5rem 1rem; width: fit-content; display: inline-flex; align-items: center; gap: 0.35rem;" onclick="addEquipamientoRow()">
                        <i data-lucide="plus" style="width: 14px; height: 14px;"></i> Agregar Elemento
                    </button>
                </div>

                <!-- Wizard Actions -->
                <div class="wizard-actions" style="margin-top: 2rem;">
                    <button type="button" class="btn btn-secondary" id="btn-condo-prev" style="display: none;" onclick="changeCondoStep(-1)">
                        Atrás
                    </button>
                    <button type="button" class="btn btn-primary" id="btn-condo-next" onclick="changeCondoStep(1)">
                        Siguiente
                    </button>
                    <button type="submit" class="btn btn-success" id="btn-condo-submit" style="display: none; width: 100%; justify-content: center;">
                        Crear Estructura <i data-lucide="check-circle" style="width: 16px; height: 16px; margin-left: 5px;"></i>
                    </button>
                </div>
            </form>
        </div>
    </div>

    <!-- ================= ONBOARDING OVERLAY (PRIMERA ENTRADA) ================= -->
    <div class="onboarding-overlay" id="onboarding-overlay">
        <div class="onboarding-card">
            <div class="onboarding-logo">
                <i data-lucide="sparkles"></i>
            </div>
            <h2>¡Bienvenido al Panel de Egresos!</h2>
            <p>
                Para comenzar a organizar las finanzas de tu condominio, es fundamental definir primero las <strong>categorías principales y subcategorías</strong> de gastos que utilizará tu administración.
            </p>
            <p style="color: var(--accent-color); font-weight: 500;">
                El menú de egresos estará deshabilitado hasta que agregues al menos una categoría en el sistema.
            </p>
            <button class="btn btn-primary" style="margin-top: 1rem; width: 100%; justify-content: center;" onclick="startOnboarding()">
                Comenzar a Crear Categorías <i data-lucide="arrow-right"></i>
            </button>
        </div>
    </div>

    <!-- ================= MODAL: EDITAR CATEGORÍA ================= -->
    <div class="modal-overlay" id="modal-edit-category">
        <div class="modal-card" style="max-width: 500px;">
            <div class="modal-header">
                <span class="modal-title">Editar Categoría Principal</span>
                <button class="modal-close" onclick="closeEditCategoryModal()"><i data-lucide="x"></i></button>
            </div>
            <div class="modal-body">
                <form id="form-edit-category" onsubmit="submitEditCategory(event)">
                    <input type="hidden" id="edit-cat-id">
                    <div class="form-group">
                        <label for="edit-cat-nombre">Nombre de la Categoría Principal</label>
                        <input type="text" id="edit-cat-nombre" class="form-control" required>
                    </div>
                    <div class="form-group">
                        <label for="edit-cat-descripcion">Breve Descripción</label>
                        <textarea id="edit-cat-descripcion" class="form-control"></textarea>
                    </div>
                    <button type="submit" class="btn btn-primary" style="width: 100%;">Actualizar Categoría</button>
                </form>
            </div>
        </div>
    </div>

    <!-- ================= MODAL: EDITAR SUBCATEGORÍA ================= -->
    <div class="modal-overlay" id="modal-edit-subcategory">
        <div class="modal-card" style="max-width: 500px;">
            <div class="modal-header">
                <span class="modal-title">Editar Subcategoría</span>
                <button class="modal-close" onclick="closeEditSubcategoryModal()"><i data-lucide="x"></i></button>
            </div>
            <div class="modal-body">
                <form id="form-edit-subcategory" onsubmit="submitEditSubcategory(event)">
                    <input type="hidden" id="edit-subcat-id">
                    <div class="form-group">
                        <label for="edit-subcat-parent">Categoría Principal de Destino</label>
                        <select id="edit-subcat-parent" class="form-control" required>
                            <!-- Dinámico -->
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="edit-subcat-nombre">Nombre de la Subcategoría</label>
                        <input type="text" id="edit-subcat-nombre" class="form-control" required>
                    </div>
                    <button type="submit" class="btn btn-primary" style="width: 100%;">Actualizar Subcategoría</button>
                </form>
            </div>
        </div>
    </div>

    <!-- ================= MODAL: COPIAR ESTRUCTURA DE TORRE ================= -->
    <div class="modal-overlay" id="modal-copy-tower">
        <div class="modal-card" style="max-width: 500px;">
            <div class="modal-header">
                <span class="modal-title">Copiar Estructura de Torre</span>
                <button class="modal-close" onclick="closeCopyTowerModal()"><i data-lucide="x"></i></button>
            </div>
            <div class="modal-body">
                <form id="form-copy-tower" onsubmit="submitCopyTower(event)">
                    <input type="hidden" id="copy-tower-from-id">
                    <p style="font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 1rem;">
                        Esto copiará la cantidad de pisos y la cantidad de departamentos de cada piso de la torre de origen a la torre seleccionada. 
                        <span style="color: var(--danger); font-weight: 600;">Se borrarán las unidades existentes en la torre de destino.</span>
                    </p>
                    <div class="form-group">
                        <label for="copy-tower-target">Seleccione Torre de Destino</label>
                        <select id="copy-tower-target" class="form-control" required>
                            <!-- Dinámico -->
                        </select>
                    </div>
                    <button type="submit" class="btn btn-primary" style="width: 100%;">Copiar Estructura</button>
                </form>
            </div>
        </div>
    </div>

    <!-- ================= MODAL: COPIAR DISTRIBUCIÓN DE PISO ================= -->
    <div class="modal-overlay" id="modal-copy-floor">
        <div class="modal-card" style="max-width: 500px;">
            <div class="modal-header">
                <span class="modal-title">Copiar Distribución de Piso</span>
                <button class="modal-close" onclick="closeCopyFloorModal()"><i data-lucide="x"></i></button>
            </div>
            <div class="modal-body">
                <form id="form-copy-floor" onsubmit="submitCopyFloor(event)">
                    <input type="hidden" id="copy-floor-from-torre-id">
                    <input type="hidden" id="copy-floor-from-piso">
                    <p style="font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 1rem;">
                        Copia la distribución de apartamentos y alícuotas del piso seleccionado.
                    </p>
                    <div class="form-group">
                        <label for="copy-floor-target-torre">Torre de Destino</label>
                        <select id="copy-floor-target-torre" class="form-control" required>
                            <!-- Dinámico -->
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="copy-floor-scope">Alcance del Destino</label>
                        <select id="copy-floor-scope" class="form-control" required>
                            <option value="same_floor">Mismo número de piso</option>
                            <option value="all_floors">Todos los pisos de la torre de destino</option>
                        </select>
                    </div>
                    <button type="submit" class="btn btn-primary" style="width: 100%;">Copiar Distribución</button>
                </form>
            </div>
        </div>
    </div>

    <!-- ================= MODAL: GESTIÓN DE ÁREAS COMUNES ================= -->
    <div class="modal-overlay" id="modal-areas-comunes">
        <div class="modal-card" style="max-width: 720px;">
            <div class="modal-header">
                <span class="modal-title">Gestión de Áreas Comunes</span>
                <button class="modal-close" onclick="closeAreasComunesModal()"><i data-lucide="x"></i></button>
            </div>
            <div class="modal-body" style="display: grid; grid-template-columns: 1fr 1.2fr; gap: 1.5rem; padding: 1.5rem;">
                <!-- Formulario para agregar/editar -->
                <div>
                    <h4 style="font-size: 0.85rem; color: #fff; margin-bottom: 1rem; font-weight: 600;" id="area-comun-form-title">Nueva Área Común</h4>
                    <form id="form-area-comun" onsubmit="submitAreaComunForm(event)">
                        <input type="hidden" id="area-comun-id" value="">
                        <div class="form-group">
                            <label for="area-comun-nombre">Nombre *</label>
                            <input type="text" id="area-comun-nombre" class="form-control" placeholder="Ej: Quincho, Cancha de Tenis" required style="font-size: 0.85rem; padding: 0.4rem 0.6rem;">
                        </div>
                        <div class="form-group">
                            <label for="area-comun-descripcion">Descripción</label>
                            <textarea id="area-comun-descripcion" class="form-control" placeholder="Detalles de uso, aforo..." style="font-size: 0.85rem; padding: 0.4rem 0.6rem; min-height: 50px;"></textarea>
                        </div>
                        <div class="form-group">
                            <label for="area-comun-costo">Costo de Arriendo ($) *</label>
                            <input type="number" id="area-comun-costo" class="form-control" min="0" step="0.01" value="0.00" required style="font-size: 0.85rem; padding: 0.4rem 0.6rem;">
                        </div>
                        <div class="form-group">
                            <label for="area-comun-capacidad">Cantidad/Capacidad Simultánea *</label>
                            <input type="number" id="area-comun-capacidad" class="form-control" min="1" value="1" required style="font-size: 0.85rem; padding: 0.4rem 0.6rem;">
                        </div>
                        <div class="form-group">
                            <label for="area-comun-color">Color Identificador (Calendario)</label>
                            <div style="display: flex; gap: 0.5rem; align-items: center;">
                                <input type="color" id="area-comun-color" class="form-control" value="#3b82f6" style="width: 50px; height: 38px; padding: 2px; border: 1px solid var(--border-color); cursor: pointer;">
                                <span style="font-size: 0.75rem; color: var(--text-secondary);">Seleccione el color para el calendario</span>
                            </div>
                        </div>
                        <button type="submit" class="btn btn-primary" style="width: 100%; font-size: 0.85rem; padding: 0.5rem;" id="btn-save-area-comun">
                            Guardar Área Común
                        </button>
                        <button type="button" class="btn btn-secondary" onclick="resetAreaComunForm()" style="width: 100%; font-size: 0.85rem; padding: 0.5rem; margin-top: 0.5rem;">
                            Cancelar / Limpiar
                        </button>
                    </form>
                </div>
                
                <!-- Listado de áreas -->
                <div style="border-left: 1px solid var(--border-color); padding-left: 1.5rem;">
                    <h4 style="font-size: 0.85rem; color: #fff; margin-bottom: 1rem; font-weight: 600;">Áreas Comunes Existentes</h4>
                    <div style="max-height: 380px; overflow-y: auto; display: flex; flex-direction: column; gap: 0.5rem; padding-right: 0.5rem;" id="areas-comunes-render-list">
                        <!-- Carga dinámica -->
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- ================= MODAL: NUEVA RESERVA / ARRIENDO ================= -->
    <div class="modal-overlay" id="modal-arriendo-reserva">
        <div class="modal-card" style="max-width: 480px;">
            <div class="modal-header">
                <span class="modal-title" id="arriendo-reserva-title">Registrar Arriendo de Área Común</span>
                <button class="modal-close" onclick="closeArriendoReservaModal()"><i data-lucide="x"></i></button>
            </div>
            <div class="modal-body" style="padding: 1.5rem;">
                <form id="form-arriendo-reserva" onsubmit="submitArriendoReservaForm(event)">
                    <input type="hidden" id="arriendo-id" value="">
                    <div class="form-group">
                        <label for="arriendo-area-id">Área Común *</label>
                        <select id="arriendo-area-id" class="form-control" required onchange="onSelectArriendoArea()" style="height: 38px;">
                            <option value="">Seleccione área común...</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="arriendo-propiedad-id">Unidad / Copropietario *</label>
                        <select id="arriendo-propiedad-id" class="form-control" required style="height: 38px;">
                            <option value="">Seleccione unidad...</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="arriendo-fecha">Fecha del Arriendo *</label>
                        <input type="date" id="arriendo-fecha" class="form-control" required style="height: 38px;" onchange="checkTimeConflictHint()">
                    </div>
                    <div class="grid-2col" style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                        <div class="form-group">
                            <label for="arriendo-hora-inicio">Hora de Inicio *</label>
                            <input type="time" id="arriendo-hora-inicio" class="form-control" required style="height: 38px;" onchange="checkTimeConflictHint()">
                        </div>
                        <div class="form-group">
                            <label for="arriendo-hora-fin">Hora de Fin *</label>
                            <input type="time" id="arriendo-hora-fin" class="form-control" required style="height: 38px;" onchange="checkTimeConflictHint()">
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="arriendo-monto">Monto a Cobrar ($) *</label>
                        <input type="number" id="arriendo-monto" class="form-control" min="0" step="0.01" required style="height: 38px;">
                        <small style="color: var(--text-muted);">Monto a pagar por la reserva (prellenado por defecto según el área seleccionada).</small>
                    </div>
                    <div class="form-group">
                        <label for="arriendo-observaciones">Observaciones / Notas</label>
                        <textarea id="arriendo-observaciones" class="form-control" placeholder="Ej: Evento familiar, aforo máximo..." style="min-height: 60px;"></textarea>
                    </div>
                    <div id="arriendo-conflict-hint" style="display: none; background: rgba(239, 68, 68, 0.1); color: var(--danger); border: 1px solid var(--danger); border-radius: 6px; padding: 0.5rem; font-size: 0.75rem; margin-bottom: 1rem;">
                        ⚠️ Conflicto detectado: Esta área ya está reservada en este horario.
                    </div>
                    <div style="display: flex; gap: 0.5rem; justify-content: flex-end; margin-top: 1.5rem;">
                        <button type="button" class="btn btn-secondary" onclick="closeArriendoReservaModal()">Cancelar</button>
                        <button type="submit" class="btn btn-primary" id="btn-save-arriendo">Confirmar Reserva</button>
                    </div>
                </form>
            </div>
        </div>
    </div>

    <!-- Contenedor para Notificaciones Toast -->
    <div class="toast-container" id="toast-container"></div>

    <!-- ================= JAVASCRIPT ================= -->
    <script>
        // Variables globales
        let currentStep = 1;
        let currentCondoStep = 1;
        let globalCategories = [];
        let globalEgresos = [];
        let globalPropiedades = [];
        let globalCondominio = null;
        let chartInstCat = null;
        let chartInstHist = null;
        let editingEgresoId = null;

        // Inicializador al cargar el DOM
        document.addEventListener('DOMContentLoaded', () => {
            // Inicializar el portal selector al inicio leyendo de los parámetros URL
            const urlParams = new URLSearchParams(window.location.search);
            const initialRole = urlParams.get('role') || 'portal';
            switchRole(initialRole);

            lucide.createIcons();
            
            // Verificar si el usuario es de primera entrada
            checkOnboardingStatus();
            
            // Cargar datos del sistema
            loadSystemData();
            loadPropiedades();
            
            // Pre-cargar tipo de unidad base por defecto
            addUnitTypeRow('A', 75, 1.0);
            
            // Pre-cargar algunos equipamientos por defecto
            addEquipamientoRow('area_comun', 'Piscina', 'gratis');
            addEquipamientoRow('area_comun', 'Sala de Eventos', 'arriendo');
            addEquipamientoRow('seguridad', 'Cámaras de Vigilancia', 'gratis');
        });

        // ================= CONDOMINIO SETUP WIZARD =================
        function addUnitTypeRow(codigo = '', metros = '', prorrateo = '') {
            const tbody = document.getElementById('tbody-unit-types');
            if (!tbody) return;
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td style="padding: 0.25rem;">
                    <input type="text" class="form-control condo-ut-code" placeholder="Ej: A" value="${codigo}" style="font-size: 0.8rem; padding: 0.35rem 0.5rem;" required>
                </td>
                <td style="padding: 0.25rem;">
                    <input type="number" class="form-control condo-ut-meters" placeholder="Ej: 75" value="${metros}" min="1" step="0.01" style="font-size: 0.8rem; padding: 0.35rem 0.5rem;" required>
                </td>
                <td style="padding: 0.25rem;">
                    <input type="number" class="form-control condo-ut-prorrateo" placeholder="Ej: 1.25" value="${prorrateo}" min="0" max="100" step="0.0001" style="font-size: 0.8rem; padding: 0.35rem 0.5rem;" required>
                </td>
                <td style="padding: 0.25rem; text-align: center; vertical-align: middle;">
                    <button type="button" class="btn btn-secondary" onclick="this.closest('tr').remove(); lucide.createIcons();" style="padding: 0.25rem; width: 30px; height: 30px; min-width: auto; justify-content: center; display: inline-flex; border-color: var(--danger); color: var(--danger); background: transparent;">
                        <i data-lucide="trash-2" style="width: 14px; height: 14px;"></i>
                    </button>
                </td>
            `;
            tbody.appendChild(tr);
            lucide.createIcons();
        }

        function addEquipamientoRow(tipo = 'area_comun', nombre = '', condicion = 'gratis') {
            const tbody = document.getElementById('tbody-equipamiento');
            if (!tbody) return;
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td style="padding: 0.25rem;">
                    <select class="form-control condo-eq-tipo" style="font-size: 0.8rem; padding: 0.35rem 0.5rem;">
                        <option value="area_comun" ${tipo === 'area_comun' ? 'selected' : ''}>Área Común</option>
                        <option value="seguridad" ${tipo === 'seguridad' ? 'selected' : ''}>Seguridad</option>
                        <option value="otro" ${tipo === 'otro' ? 'selected' : ''}>Otro</option>
                    </select>
                </td>
                <td style="padding: 0.25rem;">
                    <input type="text" class="form-control condo-eq-nombre" placeholder="Ej: Quincho Principal" value="${nombre}" style="font-size: 0.8rem; padding: 0.35rem 0.5rem;" required>
                </td>
                <td style="padding: 0.25rem;">
                    <select class="form-control condo-eq-condicion" style="font-size: 0.8rem; padding: 0.35rem 0.5rem;">
                        <option value="gratis" ${condicion === 'gratis' ? 'selected' : ''}>Gratuito</option>
                        <option value="arriendo" ${condicion === 'arriendo' ? 'selected' : ''}>Se Arrienda</option>
                    </select>
                </td>
                <td style="padding: 0.25rem; text-align: center; vertical-align: middle;">
                    <button type="button" class="btn btn-secondary" onclick="this.closest('tr').remove(); lucide.createIcons();" style="padding: 0.25rem; width: 30px; height: 30px; min-width: auto; justify-content: center; display: inline-flex; border-color: var(--danger); color: var(--danger); background: transparent;">
                        <i data-lucide="trash-2" style="width: 14px; height: 14px;"></i>
                    </button>
                </td>
            `;
            tbody.appendChild(tr);
            lucide.createIcons();
        }

        function selectInmuebleType(type) {
            document.getElementById('condo-tipo-inmueble').value = type;
            
            // Estilo de selección
            document.querySelectorAll('.inmueble-type-card').forEach(el => el.classList.remove('selected'));
            document.getElementById(`type-card-${type}`).classList.add('selected');
            
            // Mostrar campos correspondientes en Paso 2
            document.getElementById('fields-torre').style.display = type === 'torre' ? 'block' : 'none';
            document.getElementById('fields-edificios').style.display = type === 'condominio_edificios' ? 'block' : 'none';
            document.getElementById('fields-casas').style.display = type === 'condominio_casas' ? 'block' : 'none';
        }
        
        function changeCondoStep(dir) {
            // Validaciones antes de avanzar
            if (dir === 1) {
                if (currentCondoStep === 1) {
                    const tipo = document.getElementById('condo-tipo-inmueble').value;
                    if (!tipo) {
                        showToast('Por favor, selecciona un tipo de inmueble para continuar.', 'warning');
                        return;
                    }
                } else if (currentCondoStep === 2) {
                    const tipo = document.getElementById('condo-tipo-inmueble').value;
                    if (tipo === 'torre') {
                        const nombre = document.getElementById('torre-nombre').value.trim();
                        const pisos = document.getElementById('torre-pisos').value;
                        const hab = document.getElementById('torre-hab').value;
                        if (!nombre || !pisos || !hab) {
                            showToast('Por favor, completa los campos obligatorios del edificio.', 'warning');
                            return;
                        }
                    } else if (tipo === 'condominio_edificios') {
                        const nombre = document.getElementById('edif-nombre').value.trim();
                        const torres = document.getElementById('edif-num-torres').value;
                        if (!nombre || !torres) {
                            showToast('Por favor, completa los campos obligatorios del condominio.', 'warning');
                            return;
                        }
                    } else if (tipo === 'condominio_casas') {
                        const nombre = document.getElementById('casas-nombre').value.trim();
                        const casas = document.getElementById('casas-num').value;
                        if (!nombre || !casas) {
                            showToast('Por favor, ingresa el nombre y número de casas.', 'warning');
                            return;
                        }
                    }

                    // Validar tipos de unidades
                    const rows = document.querySelectorAll('#tbody-unit-types tr');
                    if (rows.length === 0) {
                        showToast('Por favor, define al menos un tipo de unidad (alícuota).', 'warning');
                        return;
                    }
                    let hasError = false;
                    rows.forEach(row => {
                        const code = row.querySelector('.condo-ut-code').value.trim();
                        const meters = row.querySelector('.condo-ut-meters').value;
                        const prorrateo = row.querySelector('.condo-ut-prorrateo').value;
                        if (!code || !meters || !prorrateo) {
                            hasError = true;
                        }
                    });
                    if (hasError) {
                        showToast('Por favor, completa todos los campos de la tabla de tipos de unidades.', 'warning');
                        return;
                    }
                } else if (currentCondoStep === 3) {
                    // Validar equipamiento
                    const rows = document.querySelectorAll('#tbody-equipamiento tr');
                    let hasError = false;
                    rows.forEach(row => {
                        const name = row.querySelector('.condo-eq-nombre').value.trim();
                        if (!name) {
                            hasError = true;
                        }
                    });
                    if (hasError) {
                        showToast('Por favor, ingresa el nombre de todos los elementos de equipamiento o elimínalos.', 'warning');
                        return;
                    }
                }
            }
            
            // Avanzar paso
            currentCondoStep += dir;
            
            // Ocultar/Mostrar contenedores de paso
            document.querySelectorAll('.condo-step').forEach(el => el.style.display = 'none');
            document.getElementById(`condo-step-${currentCondoStep}`).style.display = 'block';
            
            // Indicadores
            for (let i = 1; i <= 3; i++) {
                const ind = document.getElementById(`condo-ind-${i}`);
                if (i < currentCondoStep) {
                    ind.className = "step-ind completed";
                    ind.innerHTML = '<i data-lucide="check" style="width: 14px; height: 14px;"></i>';
                } else if (i === currentCondoStep) {
                    ind.className = "step-ind active";
                    ind.innerText = i;
                } else {
                    ind.className = "step-ind";
                    ind.innerText = i;
                }
            }
            
            // Manejar visibilidad de botones
            document.getElementById('btn-condo-prev').style.display = currentCondoStep > 1 ? 'block' : 'none';
            document.getElementById('btn-condo-next').style.display = currentCondoStep < 3 ? 'block' : 'none';
            document.getElementById('btn-condo-submit').style.display = currentCondoStep === 3 ? 'block' : 'none';
            
            lucide.createIcons();
        }
        
        function submitCondominioSetup(e) {
            e.preventDefault();
            
            const tipo = document.getElementById('condo-tipo-inmueble').value;
            const formData = new FormData();
            formData.append('tipo_inmueble', tipo);
            
            if (tipo === 'torre') {
                formData.append('nombre', document.getElementById('torre-nombre').value);
                formData.append('descripcion', document.getElementById('torre-descripcion').value);
                formData.append('pisos', document.getElementById('torre-pisos').value);
                formData.append('habitacionales', document.getElementById('torre-hab').value);
                formData.append('comerciales', document.getElementById('torre-com').value);
            } else if (tipo === 'condominio_edificios') {
                formData.append('nombre', document.getElementById('edif-nombre').value);
                formData.append('num_torres', document.getElementById('edif-num-torres').value);
                formData.append('id_torres_tipo', document.getElementById('edif-id-tipo').value);
                formData.append('habitacionales', document.getElementById('edif-total-deptos').value);
                formData.append('comerciales', document.getElementById('edif-locales-com').value);
            } else if (tipo === 'condominio_casas') {
                formData.append('nombre', document.getElementById('casas-nombre').value);
                formData.append('num_casas', document.getElementById('casas-num').value);
            }
            
            // Recoger tipos de unidades
            const tiposUnidades = [];
            document.querySelectorAll('#tbody-unit-types tr').forEach(row => {
                const code = row.querySelector('.condo-ut-code').value.trim();
                const meters = row.querySelector('.condo-ut-meters').value;
                const prorrateo = row.querySelector('.condo-ut-prorrateo').value;
                tiposUnidades.push({
                    codigo: code,
                    meters: parseFloat(meters),
                    prorrateo: parseFloat(prorrateo)
                });
            });
            formData.append('tipos_unidades', JSON.stringify(tiposUnidades));
            
            // Recoger equipamiento / áreas comunes dinámicas
            const equipamiento = [];
            document.querySelectorAll('#tbody-equipamiento tr').forEach(row => {
                const tipoEq = row.querySelector('.condo-eq-tipo').value;
                const nombreEq = row.querySelector('.condo-eq-nombre').value.trim();
                const condicionEq = row.querySelector('.condo-eq-condicion').value;
                if (nombreEq) {
                    equipamiento.push({
                        tipo: tipoEq,
                        nombre: nombreEq,
                        es_arrendable: condicionEq === 'arriendo' ? 1 : 0
                    });
                }
            });
            formData.append('equipamiento', JSON.stringify(equipamiento));
            
            fetch('api.php?action=setup_condominio', {
                method: 'POST',
                body: formData
            })
            .then(res => res.json())
            .then(response => {
                if (response.success) {
                    showToast('Condominio configurado y estructurado con éxito.', 'success');
                    // Cargar propiedades generadas
                    loadPropiedades().then(() => {
                        checkOnboardingStatus();
                    });
                } else {
                    showToast(response.message, 'error');
                }
            })
            .catch(() => showToast('Error al enviar la configuración del condominio', 'error'));
        }
        
        // ================= PERFIL DEL CONDOMINIO EDITOR =================
        let profileDeletedUnitTypes = [];
        let profileDeletedEquipamiento = [];
        
        function updateProfileStructuralFields(type) {
            if (type === 'condominio_edificios') {
                document.getElementById('perfil-fields-torre').style.display = 'block';
                document.getElementById('perfil-group-pisos').style.display = 'none';
                document.getElementById('label-perfil-torre-hab').innerText = 'Total Deptos / Unidades';
                document.getElementById('perfil-fields-edificios').style.display = 'block';
                document.getElementById('perfil-fields-casas').style.display = 'none';
            } else if (type === 'condominio_casas') {
                document.getElementById('perfil-fields-torre').style.display = 'none';
                document.getElementById('perfil-fields-edificios').style.display = 'none';
                document.getElementById('perfil-fields-casas').style.display = 'block';
            } else {
                // Fallback / torre único (histórico)
                document.getElementById('perfil-fields-torre').style.display = 'block';
                document.getElementById('perfil-group-pisos').style.display = 'block';
                document.getElementById('label-perfil-torre-hab').innerText = 'U. Habitacionales';
                document.getElementById('perfil-fields-edificios').style.display = 'none';
                document.getElementById('perfil-fields-casas').style.display = 'none';
            }
        }

        function loadCondominioProfile() {
            return fetch('api.php?action=get_condominio_profile')
                .then(res => res.json())
                .then(response => {
                    if (response.success) {
                        const data = response.data;
                        globalCondominio = data.condominio || null;
                        document.getElementById('perfil-nombre').value = data.condominio.nombre || '';
                        let condoType = data.condominio.tipo_inmueble || 'condominio_edificios';
                        if (condoType === 'torre') {
                            condoType = 'condominio_edificios';
                        }
                        document.getElementById('perfil-tipo-inmueble').value = condoType;
                        document.getElementById('perfil-rut').value = data.condominio.rut || '';
                        document.getElementById('perfil-direccion').value = data.condominio.direccion || '';
                        document.getElementById('perfil-email').value = data.condominio.email || '';
                        document.getElementById('perfil-telefono').value = data.condominio.telefono || '';
                        document.getElementById('perfil-sitio-web').value = data.condominio.sitio_web || '';
                        document.getElementById('perfil-descripcion').value = data.condominio.descripcion || '';
                        
                        // Parsear y rellenar campos estructurales
                        const details = JSON.parse(data.condominio.detalles_config || '{}');
                        document.getElementById('perfil-torre-pisos').value = details.pisos || '';
                        document.getElementById('perfil-torre-hab').value = details.habitacionales || '';
                        document.getElementById('perfil-torre-com').value = details.comerciales || '';
                        document.getElementById('perfil-edif-num-torres').value = details.num_torres || '';
                        document.getElementById('perfil-edif-id-tipo').value = details.id_torres_tipo || 'letras';
                        document.getElementById('perfil-casas-num').value = details.num_casas || '';
                        
                        updateProfileStructuralFields(condoType);
                        
                        // Enlazar evento de cambio si no se ha hecho
                        const tipoSelect = document.getElementById('perfil-tipo-inmueble');
                        if (!tipoSelect.dataset.listener) {
                            tipoSelect.dataset.listener = 'true';
                            tipoSelect.addEventListener('change', function() {
                                updateProfileStructuralFields(this.value);
                            });
                        }
                        
                        // Limpiar tablas
                        document.getElementById('tbody-profile-unit-types').innerHTML = '';
                        document.getElementById('tbody-profile-equipamiento').innerHTML = '';
                        profileDeletedUnitTypes = [];
                        profileDeletedEquipamiento = [];
                        
                        // Renderizar alícuotas
                        data.tipos_unidades.forEach(ut => {
                            addProfileUnitTypeRow(ut.id, ut.codigo, ut.metros_cuadrados, ut.porcentaje_prorrateo * 100);
                        });
                        
                        // Renderizar equipamiento
                        data.equipamiento.forEach(eq => {
                            addProfileEquipamientoRow(eq.id, eq.tipo, eq.identificador, eq.es_arrendable === 1 ? 'arriendo' : 'gratis');
                        });

                        // Cargar cargos de colaboradores
                        loadProfileCargos();
                    } else {
                        showToast(response.message, 'error');
                    }
                })
                .catch(() => showToast('Error al cargar el perfil del condominio.', 'error'));
        }
        
        function addProfileUnitTypeRow(id = '', codigo = '', metros = '', prorrateo = '') {
            const tbody = document.getElementById('tbody-profile-unit-types');
            if (!tbody) return;
            const tr = document.createElement('tr');
            tr.setAttribute('data-id', id);
            tr.innerHTML = `
                <td style="padding: 0.25rem;">
                    <input type="text" class="form-control prof-ut-code" placeholder="Ej: A" value="${codigo}" style="font-size: 0.8rem; padding: 0.35rem 0.5rem;" required>
                </td>
                <td style="padding: 0.25rem;">
                    <input type="number" class="form-control prof-ut-meters" placeholder="Ej: 75" value="${metros}" min="1" step="0.01" style="font-size: 0.8rem; padding: 0.35rem 0.5rem;" required>
                </td>
                <td style="padding: 0.25rem;">
                    <input type="number" class="form-control prof-ut-prorrateo" placeholder="Ej: 1.25" value="${prorrateo}" min="0" max="100" step="0.0001" style="font-size: 0.8rem; padding: 0.35rem 0.5rem;" required>
                </td>
                <td style="padding: 0.25rem; text-align: center; vertical-align: middle;">
                    <button type="button" class="btn btn-secondary" onclick="deleteProfileUnitTypeRow(this)" style="padding: 0.25rem; width: 30px; height: 30px; min-width: auto; justify-content: center; display: inline-flex; border-color: var(--danger); color: var(--danger); background: transparent;">
                        <i data-lucide="trash-2" style="width: 14px; height: 14px;"></i>
                    </button>
                </td>
            `;
            tbody.appendChild(tr);
            lucide.createIcons();
        }
        
        function deleteProfileUnitTypeRow(btn) {
            const tr = btn.closest('tr');
            const id = tr.getAttribute('data-id');
            if (id) {
                profileDeletedUnitTypes.push(id);
            }
            tr.remove();
            lucide.createIcons();
        }
        
        function addProfileEquipamientoRow(id = '', tipo = 'area_comun', nombre = '', condicion = 'gratis') {
            const tbody = document.getElementById('tbody-profile-equipamiento');
            if (!tbody) return;
            const tr = document.createElement('tr');
            tr.setAttribute('data-id', id);
            tr.innerHTML = `
                <td style="padding: 0.25rem;">
                    <select class="form-control prof-eq-tipo" style="font-size: 0.8rem; padding: 0.35rem 0.5rem;">
                        <option value="area_comun" ${tipo === 'area_comun' ? 'selected' : ''}>Área Común</option>
                        <option value="seguridad" ${tipo === 'seguridad' ? 'selected' : ''}>Seguridad</option>
                        <option value="otro" ${tipo === 'otro' ? 'selected' : ''}>Otro</option>
                    </select>
                </td>
                <td style="padding: 0.25rem;">
                    <input type="text" class="form-control prof-eq-nombre" placeholder="Ej: Quincho Principal" value="${nombre}" style="font-size: 0.8rem; padding: 0.35rem 0.5rem;" required>
                </td>
                <td style="padding: 0.25rem;">
                    <select class="form-control prof-eq-condicion" style="font-size: 0.8rem; padding: 0.35rem 0.5rem;">
                        <option value="gratis" ${condicion === 'gratis' ? 'selected' : ''}>Gratuito</option>
                        <option value="arriendo" ${condicion === 'arriendo' ? 'selected' : ''}>Se Arrienda</option>
                    </select>
                </td>
                <td style="padding: 0.25rem; text-align: center; vertical-align: middle;">
                    <button type="button" class="btn btn-secondary" onclick="deleteProfileEquipamientoRow(this)" style="padding: 0.25rem; width: 30px; height: 30px; min-width: auto; justify-content: center; display: inline-flex; border-color: var(--danger); color: var(--danger); background: transparent;">
                        <i data-lucide="trash-2" style="width: 14px; height: 14px;"></i>
                    </button>
                </td>
            `;
            tbody.appendChild(tr);
            lucide.createIcons();
        }
        
        function deleteProfileEquipamientoRow(btn) {
            const tr = btn.closest('tr');
            const id = tr.getAttribute('data-id');
            if (id) {
                profileDeletedEquipamiento.push(id);
            }
            tr.remove();
            lucide.createIcons();
        }
        
        function saveCondominioProfile() {
            const nombre = document.getElementById('perfil-nombre').value.trim();
            const tipo_inmueble = document.getElementById('perfil-tipo-inmueble').value;
            const rut = document.getElementById('perfil-rut').value.trim();
            const direccion = document.getElementById('perfil-direccion').value.trim();
            const email = document.getElementById('perfil-email').value.trim();
            const telefono = document.getElementById('perfil-telefono').value.trim();
            const sitio_web = document.getElementById('perfil-sitio-web').value.trim();
            const descripcion = document.getElementById('perfil-descripcion').value.trim();
            
            if (!nombre || !rut || !direccion || !email || !telefono) {
                showToast('Por favor, completa todos los campos obligatorios del condominio.', 'warning');
                return;
            }
            
            const formData = new FormData();
            formData.append('nombre', nombre);
            formData.append('tipo_inmueble', tipo_inmueble);
            formData.append('rut', rut);
            formData.append('direccion', direccion);
            formData.append('email', email);
            formData.append('telefono', telefono);
            formData.append('sitio_web', sitio_web);
            formData.append('descripcion', descripcion);

            // Recoger campos estructurales dinámicos
            if (tipo_inmueble === 'torre') {
                formData.append('pisos', document.getElementById('perfil-torre-pisos').value);
                formData.append('habitacionales', document.getElementById('perfil-torre-hab').value);
                formData.append('comerciales', document.getElementById('perfil-torre-com').value);
            } else if (tipo_inmueble === 'condominio_edificios') {
                formData.append('num_torres', document.getElementById('perfil-edif-num-torres').value);
                formData.append('id_torres_tipo', document.getElementById('perfil-edif-id-tipo').value);
                formData.append('habitacionales', document.getElementById('perfil-torre-hab').value);
                formData.append('comerciales', document.getElementById('perfil-torre-com').value);
            } else if (tipo_inmueble === 'condominio_casas') {
                formData.append('num_casas', document.getElementById('perfil-casas-num').value);
            }
            
            // Recoger tipos de unidades
            const tiposUnidades = [];
            let hasUtError = false;
            document.querySelectorAll('#tbody-profile-unit-types tr').forEach(row => {
                const id = row.getAttribute('data-id') || '';
                const code = row.querySelector('.prof-ut-code').value.trim();
                const meters = row.querySelector('.prof-ut-meters').value;
                const prorrateo = row.querySelector('.prof-ut-prorrateo').value;
                if (!code || !meters || !prorrateo) {
                    hasUtError = true;
                }
                tiposUnidades.push({
                    id: id,
                    codigo: code,
                    meters: parseFloat(meters),
                    prorrateo: parseFloat(prorrateo)
                });
            });
            
            if (hasUtError) {
                showToast('Por favor, completa todos los campos de la tabla de tipos de unidades.', 'warning');
                return;
            }
            if (tiposUnidades.length === 0) {
                showToast('El condominio debe tener al menos un tipo de unidad definido.', 'warning');
                return;
            }
            
            // Agregar alícuotas eliminadas
            profileDeletedUnitTypes.forEach(id => {
                tiposUnidades.push({ id: id, deleted: true });
            });
            formData.append('tipos_unidades', JSON.stringify(tiposUnidades));
            
            // Recoger equipamiento
            const equipamiento = [];
            let hasEqError = false;
            document.querySelectorAll('#tbody-profile-equipamiento tr').forEach(row => {
                const id = row.getAttribute('data-id') || '';
                const tipo = row.querySelector('.prof-eq-tipo').value;
                const name = row.querySelector('.prof-eq-nombre').value.trim();
                const cond = row.querySelector('.prof-eq-condicion').value;
                if (!name) {
                    hasEqError = true;
                }
                equipamiento.push({
                    id: id,
                    tipo: tipo,
                    nombre: name,
                    es_arrendable: cond === 'arriendo' ? 1 : 0
                });
            });
            
            if (hasEqError) {
                showToast('Por favor, ingresa el nombre de todos los elementos de equipamiento o elimínalos.', 'warning');
                return;
            }
            
            // Agregar equipamientos eliminados
            profileDeletedEquipamiento.forEach(id => {
                equipamiento.push({ id: id, deleted: true });
            });
            formData.append('equipamiento', JSON.stringify(equipamiento));
            
            fetch('api.php?action=update_condominio_profile', {
                method: 'POST',
                body: formData
            })
            .then(res => res.json())
            .then(response => {
                if (response.success) {
                    showToast('Perfil del condominio guardado con éxito.', 'success');
                    loadCondominioProfile().then(() => {
                        loadPropiedades().then(() => {
                            renderUnidadesGrid();
                        });
                    });
                } else {
                    showToast(response.message, 'error');
                }
            })
            .catch(() => showToast('Error al actualizar el perfil del condominio.', 'error'));
        }

        // ================= PERFIL DEL ADMINISTRADOR EDITOR =================
        function loadAdministradorProfile() {
            fetch('api.php?action=get_administrador_profile')
                .then(res => res.json())
                .then(response => {
                    if (response.success) {
                        const admin = response.data.administrador;
                        document.getElementById('admin-nombre').value = admin.nombre || '';
                        document.getElementById('admin-rut').value = admin.rut || '';
                        document.getElementById('admin-rnac').value = admin.rnac || '';
                        document.getElementById('admin-telefono').value = admin.telefono || '';
                        document.getElementById('admin-email').value = admin.email || '';
                        document.getElementById('admin-website').value = admin.website || '';
                        
                        document.getElementById('empresa-nombre').value = admin.empresa_nombre || '';
                        document.getElementById('empresa-telefono').value = admin.telefono_empresa || '';
                        document.getElementById('empresa-email').value = admin.email_empresa || '';
                        document.getElementById('empresa-website').value = admin.website_empresa || '';

                        // Actualizar barra lateral
                        const footerName = document.querySelector('.admin-name');
                        if (footerName) {
                            footerName.textContent = admin.nombre || 'Administrador';
                        }
                        loadAvatarImage(admin.avatar_path, admin.nombre || 'Administrador');
                    } else {
                        showToast(response.message, 'error');
                    }
                })
                .catch(() => showToast('Error al cargar el perfil del administrador.', 'error'));
        }
        
        function saveAdministradorProfile() {
            const nombre = document.getElementById('admin-nombre').value.trim();
            const rut = document.getElementById('admin-rut').value.trim();
            const rnac = document.getElementById('admin-rnac').value.trim();
            const telefono = document.getElementById('admin-telefono').value.trim();
            const email = document.getElementById('admin-email').value.trim();
            const website = document.getElementById('admin-website').value.trim();
            
            const empresa_nombre = document.getElementById('empresa-nombre').value.trim();
            const telefono_empresa = document.getElementById('empresa-telefono').value.trim();
            const email_empresa = document.getElementById('empresa-email').value.trim();
            const website_empresa = document.getElementById('empresa-website').value.trim();
            
            if (!nombre || !rut || !telefono || !email) {
                showToast('Por favor, completa todos los campos obligatorios del administrador.', 'warning');
                return;
            }
            
            const formData = new FormData();
            formData.append('nombre', nombre);
            formData.append('rut', rut);
            formData.append('rnac', rnac);
            formData.append('telefono', telefono);
            formData.append('email', email);
            formData.append('website', website);
            
            formData.append('empresa_nombre', empresa_nombre);
            formData.append('telefono_empresa', telefono_empresa);
            formData.append('email_empresa', email_empresa);
            formData.append('website_empresa', website_empresa);
            
            fetch('api.php?action=update_administrador_profile', {
                method: 'POST',
                body: formData
            })
            .then(res => res.json())
            .then(response => {
                if (response.success) {
                    showToast('Perfil del administrador guardado con éxito.', 'success');
                    // Actualizar el nombre en el footer lateral
                    const footerName = document.querySelector('.admin-name');
                    if (footerName) {
                        footerName.textContent = nombre;
                    }
                    loadAdministradorProfile();
                } else {
                    showToast(response.message, 'error');
                }
            })
            .catch(() => showToast('Error al guardar el perfil del administrador.', 'error'));
        }

        function loadPropiedades() {
            return fetch('api.php?action=get_propiedades')
                .then(res => res.json())
                .then(response => {
                    if (response.success) {
                        globalPropiedades = response.data.propiedades;
                        populatePropiedadesDropdown();
                    }
                });
        }
        
        function populatePropiedadesDropdown() {
            const select = document.getElementById('egreso-propiedad-id');
            if (!select) return;
            select.innerHTML = '<option value="">Seleccione una unidad / área...</option>';
            
            // Agrupar por tipo
            const groups = {};
            globalPropiedades.forEach(prop => {
                if (!groups[prop.tipo]) {
                    groups[prop.tipo] = [];
                }
                groups[prop.tipo].push(prop);
            });
            
            const labels = {
                'torre': 'Torres / Edificios',
                'departamento': 'Departamentos / Apartamentos',
                'casa': 'Casas',
                'local_comercial': 'Locales Comerciales',
                'area_comun': 'Áreas Comunes',
                'seguridad': 'Seguridad y Vigilancia'
            };
            
            for (const tipo in groups) {
                const optgroup = document.createElement('optgroup');
                optgroup.label = labels[tipo] || tipo.toUpperCase();
                
                groups[tipo].forEach(prop => {
                    const opt = document.createElement('option');
                    opt.value = prop.id;
                    opt.textContent = prop.identificador;
                    optgroup.appendChild(opt);
                });
                
                select.appendChild(optgroup);
            }
        }

        // ================= FLUX DE NAVEGACIÓN =================
        function switchView(viewName) {
            // Ocultar todos los contenedores de vista
            document.querySelectorAll('.view-container').forEach(el => el.style.display = 'none');
            
            // Desactivar todos los links de menú
            document.querySelectorAll('.menu-link').forEach(el => el.classList.remove('active'));

            // Mostrar el contenedor seleccionado
            const viewContainer = document.getElementById(`view-${viewName}-container`);
            if (viewContainer) viewContainer.style.display = 'block';
            
            // Activar link de menú
            const menuEl = document.getElementById(`menu-${viewName}`) || document.getElementById('menu-residentes');
            if (menuEl) menuEl.classList.add('active');

            // Configurar títulos y acciones de cabecera
            const viewTitle = document.getElementById('view-title');
            const viewSubtitle = document.getElementById('view-subtitle');
            const headerActions = document.getElementById('header-actions');

            if (viewName === 'dashboard') {
                viewTitle.innerText = "Dashboard de Egresos";
                viewSubtitle.innerText = "Resumen financiero y control de gastos generales.";
                headerActions.style.display = 'flex';
                // Renderizar gráficos si se cambia de vista
                loadDashboardKPIs();
            } else if (viewName === 'egresos') {
                viewTitle.innerText = "Registro de Egresos";
                viewSubtitle.innerText = "Listado completo de egresos, comprobantes y clasificación de gastos.";
                headerActions.style.display = 'flex';
                loadEgresos();
            } else if (viewName === 'perfil') {
                viewTitle.innerText = "Perfil del Condominio";
                viewSubtitle.innerText = "Gestiona los datos principales, alícuotas y áreas comunes de tu administración.";
                headerActions.style.display = 'none';
                loadCondominioProfile();
            } else if (viewName === 'administrador') {
                viewTitle.innerText = "Perfil del Administrador";
                viewSubtitle.innerText = "Gestiona tus datos personales y de tu empresa de administración.";
                headerActions.style.display = 'none';
                loadAdministradorProfile();
            } else if (viewName === 'unidades') {
                viewTitle.innerText = "Unidades del Condominio";
                viewSubtitle.innerText = "Listado completo de unidades habitacionales y comerciales agrupadas.";
                headerActions.style.display = 'none';
                loadUnidadesView();
            } else if (viewName === 'residentes') {
                viewTitle.innerText = "Ficha de Residentes";
                viewSubtitle.innerText = "Administra los habitantes, estacionamientos e información de vehículos de cada unidad.";
                headerActions.style.display = 'none';
                loadResidentesView();
            } else if (viewName === 'propietarios') {
                viewTitle.innerText = "Listado de Propietarios";
                viewSubtitle.innerText = "Listado completo de dueños de propiedades ordenados por ubicación.";
                headerActions.style.display = 'none';
                loadPropietariosView();
            } else if (viewName === 'gasto_comun') {
                viewTitle.innerText = "Gastos Comunes";
                viewSubtitle.innerText = "Facturación mensual, cálculo de prorrateo y control de mora.";
                headerActions.style.display = 'none';
                loadGastoComunView();
            } else if (viewName === 'colaboradores') {
                viewTitle.innerText = "Colaboradores del Condominio";
                viewSubtitle.innerText = "Fichas de personal, contratos, liquidaciones de sueldo e historial de amonestaciones.";
                headerActions.style.display = 'none';
                loadColaboradores();
            } else if (viewName === 'tickets') {
                viewTitle.innerText = "Tickets de Residentes";
                viewSubtitle.innerText = "Listado de consultas, sugerencias, quejas y reclamos recibidos.";
                headerActions.style.display = 'none';
                loadTickets();
            }
            
            // Repintar íconos
            lucide.createIcons();
        }

        // ================= CARGA DE DATOS DE API =================
        function checkOnboardingStatus() {
            fetch('api.php?action=check_onboarding')
                .then(res => res.json())
                .then(response => {
                    if (response.success) {
                        const data = response.data;
                        if (data.needs_condominio_setup) {
                            document.getElementById('onboarding-condominio-overlay').style.display = 'flex';
                            setTimeout(() => {
                                document.getElementById('onboarding-condominio-overlay').classList.add('active');
                            }, 50);
                            document.getElementById('onboarding-overlay').classList.remove('active');
                            
                            // Bloquear menú lateral completamente
                            document.querySelectorAll('.menu-link').forEach(el => {
                                el.style.pointerEvents = 'none';
                                el.style.opacity = '0.5';
                            });
                        } else if (data.needs_categorias_setup) {
                            document.getElementById('onboarding-condominio-overlay').classList.remove('active');
                            document.getElementById('onboarding-condominio-overlay').style.display = 'none';
                            
                            document.getElementById('onboarding-overlay').classList.add('active');
                            // Permitir solo el botón de Registro de Egresos
                            document.querySelectorAll('.menu-link').forEach(el => {
                                if (el.id !== 'menu-egresos') {
                                    el.style.pointerEvents = 'none';
                                    el.style.opacity = '0.5';
                                } else {
                                    el.style.pointerEvents = 'auto';
                                    el.style.opacity = '1';
                                }
                            });
                        } else {
                            document.getElementById('onboarding-condominio-overlay').classList.remove('active');
                            document.getElementById('onboarding-condominio-overlay').style.display = 'none';
                            document.getElementById('onboarding-overlay').classList.remove('active');
                            
                            // Desbloquear menú completamente
                            document.querySelectorAll('.menu-link').forEach(el => {
                                el.style.pointerEvents = 'auto';
                                el.style.opacity = '1';
                            });
                        }
                    }
                })
                .catch(err => showToast('Error de conexión con el servidor', 'error'));
        }

        function loadSystemData() {
            // Cargar categorías y subcategorías
            fetch('api.php?action=get_categories_with_sub')
                .then(res => res.json())
                .then(response => {
                    if (response.success) {
                        globalCategories = response.data.categorias;
                        renderCategoriesView();
                        populateCategoryDropdowns();
                    }
                });

            // Cargar nombre y avatar del administrador para el lateral
            fetch('api.php?action=get_administrador_profile')
                .then(res => res.json())
                .then(response => {
                    if (response.success && response.data.administrador) {
                        const admin = response.data.administrador;
                        const footerName = document.querySelector('.admin-name');
                        if (footerName) {
                            footerName.textContent = admin.nombre || 'Administrador';
                        }
                        loadAvatarImage(admin.avatar_path, admin.nombre || 'Administrador');
                    }
                });
            
            // Cargar KPIs de Dashboard
            loadDashboardKPIs();
        }

        function loadDashboardKPIs() {
            fetch('api.php?action=get_kpis')
                .then(res => res.json())
                .then(response => {
                    if (response.success) {
                        const kpis = response.data.kpis;
                        
                        // Setear valores de KPIs
                        document.getElementById('kpi-mes-actual').innerText = formatCurrency(kpis.total_mes_actual);
                        document.getElementById('kpi-mes-anterior').innerText = formatCurrency(kpis.total_mes_anterior);
                        document.getElementById('kpi-prorrateados').innerText = kpis.egresos_prorrateados;
                        document.getElementById('kpi-conteo').innerText = kpis.conteo_egresos_mes;

                        // Comparar con el mes anterior
                        const comparacionEl = document.getElementById('kpi-comparacion');
                        if (kpis.total_mes_anterior > 0) {
                            const porcentaje = ((kpis.total_mes_actual - kpis.total_mes_anterior) / kpis.total_mes_anterior) * 100;
                            const isUp = porcentaje > 0;
                            comparacionEl.className = `kpi-change ${isUp ? 'up' : 'down'}`;
                            comparacionEl.innerHTML = `
                                <i data-lucide="${isUp ? 'trending-up' : 'trending-down'}"></i>
                                <span>${Math.abs(porcentaje).toFixed(1)}% vs mes anterior</span>
                            `;
                        } else {
                            comparacionEl.className = "kpi-change up";
                            comparacionEl.innerHTML = `<span>Primer mes con egresos</span>`;
                        }

                        // Inicializar Gráficos
                        renderChartsData(response.data.graficos);
                        lucide.createIcons();
                    }
                });
        }

        // ================= RENDERS DE CATEGORÍAS =================
        function toggleCategoriesCollapse() {
            const content = document.getElementById('categories-collapse-content');
            const icon = document.getElementById('categories-collapse-icon');
            if (!content || !icon) return;
            if (content.style.display === 'none') {
                content.style.display = 'block';
                icon.style.transform = 'rotate(180deg)';
            } else {
                content.style.display = 'none';
                icon.style.transform = 'rotate(0deg)';
            }
        }

        function startOnboarding() {
            document.getElementById('onboarding-overlay').classList.remove('active');
            switchView('egresos');
            // Asegurar que el bloque esté visible
            const content = document.getElementById('categories-collapse-content');
            const icon = document.getElementById('categories-collapse-icon');
            if (content && icon) {
                content.style.display = 'block';
                icon.style.transform = 'rotate(180deg)';
            }
            // Hacer foco en el input
            document.getElementById('cat-nombre').focus();
        }

        function renderCategoriesView() {
            const listContainer = document.getElementById('category-list-render');
            if (globalCategories.length === 0) {
                listContainer.innerHTML = `
                    <div style="text-align: center; padding: 2rem; color: var(--text-muted);">
                        <i data-lucide="info" style="width: 48px; height: 48px; stroke-width: 1.5; margin-bottom: 0.5rem;"></i>
                        <p>No existen categorías creadas aún en el sistema.</p>
                    </div>
                `;
                lucide.createIcons();
                return;
            }

            listContainer.innerHTML = '';
            globalCategories.forEach(cat => {
                const subBadges = cat.subcategorias.map(sub => `
                    <span class="subcategory-badge">
                        ${sub.nombre}
                        <i data-lucide="edit-3" style="width: 11px; height: 11px; cursor: pointer; opacity: 0.6; margin-left: 5px;" onclick="openEditSubcategoryModal(${sub.id}, ${sub.categoria_id}, '${sub.nombre.replace(/'/g, "\\'")}')" title="Editar subcategoría"></i>
                    </span>
                `).join('');

                const cardHtml = `
                    <div class="category-card">
                        <div class="cat-card-header">
                            <span class="cat-card-title" style="display: flex; align-items: center; gap: 0.5rem;">
                                ${cat.nombre}
                                <i data-lucide="edit-3" style="width: 13px; height: 13px; cursor: pointer; opacity: 0.6;" onclick="openEditCategoryModal(${cat.id})" title="Editar categoría"></i>
                            </span>
                            <span style="font-size: 0.75rem; color: var(--text-muted);">ID #${cat.id}</span>
                        </div>
                        <p class="cat-card-desc">${cat.descripcion || 'Sin descripción detallada.'}</p>
                        <div class="subcategories-container">
                            ${subBadges || '<span style="font-size: 0.8rem; color: var(--text-muted); font-style: italic;">Sin subcategorías vinculadas</span>'}
                        </div>
                    </div>
                `;
                listContainer.innerHTML += cardHtml;
            });
            lucide.createIcons();
        }

        function populateCategoryDropdowns() {
            const selectSubParent = document.getElementById('subcat-parent');
            const selectFilterCat = document.getElementById('filter-categoria');
            const selectFormCat = document.getElementById('egreso-categoria');

            // Resetear
            selectSubParent.innerHTML = '<option value="">Seleccione una categoría principal...</option>';
            selectFilterCat.innerHTML = '<option value="">Todas</option>';
            selectFormCat.innerHTML = '<option value="">Seleccione...</option>';

            globalCategories.forEach(cat => {
                const option = `<option value="${cat.id}">${cat.nombre}</option>`;
                selectSubParent.innerHTML += option;
                selectFilterCat.innerHTML += option;
                selectFormCat.innerHTML += option;
            });
        }

        // ================= CRUD CATEGORÍAS / SUBCATEGORÍAS =================
        function submitCategory(e) {
            e.preventDefault();
            const nombre = document.getElementById('cat-nombre').value;
            const descripcion = document.getElementById('cat-descripcion').value;

            const formData = new FormData();
            formData.append('nombre', nombre);
            formData.append('descripcion', descripcion);

            fetch('api.php?action=add_category', {
                method: 'POST',
                body: formData
            })
            .then(res => res.json())
            .then(response => {
                if (response.success) {
                    showToast('Categoría guardada con éxito.', 'success');
                    document.getElementById('form-category').reset();
                    // Recargar datos
                    loadSystemData();
                    
                    // Si estábamos en onboarding, verificar si desbloquear el menú
                    fetch('api.php?action=check_onboarding')
                        .then(res => res.json())
                        .then(resCheck => {
                            if (!resCheck.data.needs_onboarding) {
                                // Desbloquear menú
                                document.querySelectorAll('.menu-link').forEach(el => {
                                    el.style.pointerEvents = 'auto';
                                    el.style.opacity = '1';
                                });
                            }
                        });
                } else {
                    showToast(response.message, 'error');
                }
            })
            .catch(() => showToast('Error al enviar la categoría', 'error'));
        }

        function submitSubcategory(e) {
            e.preventDefault();
            const categoria_id = document.getElementById('subcat-parent').value;
            const nombre = document.getElementById('subcat-nombre').value;

            const formData = new FormData();
            formData.append('categoria_id', categoria_id);
            formData.append('nombre', nombre);

            fetch('api.php?action=add_subcategory', {
                method: 'POST',
                body: formData
            })
            .then(res => res.json())
            .then(response => {
                if (response.success) {
                    showToast('Subcategoría vinculada con éxito.', 'success');
                    document.getElementById('form-subcategory').reset();
                    loadSystemData();
                } else {
                    showToast(response.message, 'error');
                }
            })
            .catch(() => showToast('Error al enviar la subcategoría', 'error'));
        }

        // ================= EGRESOS: SELECTS DINÁMICOS =================
        function filterCategoryChanged() {
            const catId = parseInt(document.getElementById('filter-categoria').value);
            const selectSub = document.getElementById('filter-subcategoria');
            selectSub.innerHTML = '<option value="">Todas</option>';
            
            if (catId) {
                const category = globalCategories.find(c => c.id === catId);
                if (category && category.subcategorias) {
                    category.subcategorias.forEach(sub => {
                        selectSub.innerHTML += `<option value="${sub.id}">${sub.nombre}</option>`;
                    });
                }
            }
            loadEgresos();
        }

        function egresoCategoryChanged() {
            const catId = parseInt(document.getElementById('egreso-categoria').value);
            const selectSub = document.getElementById('egreso-subcategoria');
            selectSub.innerHTML = '<option value="">Seleccione...</option>';
            
            if (catId) {
                const category = globalCategories.find(c => c.id === catId);
                if (category && category.subcategorias && category.subcategorias.length > 0) {
                    category.subcategorias.forEach(sub => {
                        selectSub.innerHTML += `<option value="${sub.id}">${sub.nombre}</option>`;
                    });
                    selectSub.disabled = false;
                } else {
                    selectSub.innerHTML = '<option value="">Sin subcategorías. Créela primero.</option>';
                    selectSub.disabled = true;
                }
            } else {
                selectSub.innerHTML = '<option value="">Seleccione categoría primero...</option>';
                selectSub.disabled = true;
            }
        }

        // ================= TABLA DE EGRESOS Y FILTROS =================
        function loadEgresos() {
            const search = document.getElementById('filter-search').value;
            const catId = document.getElementById('filter-categoria').value;
            const subcatId = document.getElementById('filter-subcategoria').value;
            const desde = document.getElementById('filter-desde').value;
            const hasta = document.getElementById('filter-hasta').value;

            let url = `api.php?action=get_egresos&search=${encodeURIComponent(search)}&categoria_id=${catId}&subcategoria_id=${subcatId}&fecha_inicio=${desde}&fecha_fin=${hasta}`;

            fetch(url)
                .then(res => res.json())
                .then(response => {
                    if (response.success) {
                        globalEgresos = response.data.egresos;
                        renderEgresosTable();
                    }
                });
        }

        function clearFilters() {
            document.getElementById('filter-search').value = '';
            document.getElementById('filter-categoria').value = '';
            document.getElementById('filter-subcategoria').innerHTML = '<option value="">Todas</option>';
            document.getElementById('filter-desde').value = '';
            document.getElementById('filter-hasta').value = '';
            loadEgresos();
        }

        function toggleEgresoCategory(id) {
            const content = document.getElementById('content-' + id);
            const icon = document.getElementById('arrow-' + id);
            if (!content || !icon) return;
            if (content.style.display === 'none') {
                content.style.display = 'block';
                icon.style.transform = 'rotate(180deg)';
            } else {
                content.style.display = 'none';
                icon.style.transform = 'rotate(0deg)';
            }
        }

        function renderEgresosTable() {
            const container = document.getElementById('egresos-history-container');
            if (!container) return;

            if (globalEgresos.length === 0) {
                container.innerHTML = `
                    <div class="card-panel" style="text-align: center; padding: 3rem; color: var(--text-muted);">
                        <i data-lucide="info" style="width: 48px; height: 48px; stroke-width: 1.5; margin-bottom: 0.5rem;"></i>
                        <p>No se encontraron egresos con los filtros aplicados.</p>
                    </div>
                `;
                lucide.createIcons();
                return;
            }

            // Agrupar egresos por categoría
            const grouped = {};
            globalEgresos.forEach(eg => {
                const catName = eg.categoria_nombre || 'Sin Categoría';
                const catId = eg.categoria_id || 0;
                if (!grouped[catId]) {
                    grouped[catId] = {
                        id: catId,
                        name: catName,
                        total: 0,
                        items: []
                    };
                }
                grouped[catId].items.push(eg);
                grouped[catId].total += parseFloat(eg.monto);
            });

            container.innerHTML = '';

            Object.values(grouped).forEach(group => {
                const catId = group.id;
                const catName = group.name;
                const catTotal = group.total;

                // Crear elemento del panel de la categoría
                const catBlock = document.createElement('div');
                catBlock.className = 'card-panel';
                catBlock.style.marginBottom = '1rem';
                catBlock.style.borderColor = 'rgba(255,255,255,0.03)';
                catBlock.style.padding = '0'; // para control de bordes internos

                let tableRows = '';
                group.items.forEach(eg => {
                    const docCol = eg.tiene_documento == 1 && eg.documento_ruta 
                        ? `<a href="${eg.documento_ruta}" target="_blank" class="btn-icon" title="Ver Documento"><i data-lucide="file-text" style="color: var(--accent-color);"></i></a>`
                        : '<span style="color: var(--text-muted); font-size: 0.85rem;">Ninguno</span>';

                    const splitCol = eg.dividir_meses > 1
                        ? `<span class="td-split" title="Cobro diferido"><i data-lucide="calendar"></i> ${eg.dividir_meses} meses</span>`
                        : '<span style="color: var(--text-muted); font-size: 0.85rem;">Mes único</span>';

                    const badging = eg.tipo_gasto === 'especifico'
                        ? `<span style="font-size: 0.7rem; color: var(--warning); background: rgba(245, 158, 11, 0.12); padding: 0.15rem 0.35rem; border-radius: 4px; font-weight: 600; width: fit-content; display: inline-flex; align-items: center; gap: 0.15rem; margin-top: 0.25rem;"><i data-lucide="user-check" style="width:10px; height:10px;"></i> ${eg.propiedad_identificador || 'Especifico'}</span>`
                        : `<span style="font-size: 0.7rem; color: var(--success); background: rgba(16, 185, 129, 0.12); padding: 0.15rem 0.35rem; border-radius: 4px; font-weight: 600; width: fit-content; display: inline-flex; align-items: center; gap: 0.15rem; margin-top: 0.25rem;"><i data-lucide="users" style="width:10px; height:10px;"></i> Gasto Común</span>`;

                    tableRows += `
                        <tr>
                            <td style="font-weight: 500; padding-left: 1.25rem;">${formatDateString(eg.fecha)}</td>
                            <td>
                                <div class="badge-double">
                                    <span class="badge-subcat">${eg.subcategoria_nombre}</span>
                                    ${badging}
                                </div>
                            </td>
                            <td>
                                <div style="font-weight: 500; color: #fff;">${eg.descripcion}</div>
                                ${eg.referencia_cotizacion ? `<div style="font-size: 0.75rem; color: var(--text-secondary); display: flex; align-items: center; gap: 0.25rem;"><i data-lucide="link" style="width: 12px; height: 12px;"></i> ${eg.referencia_cotizacion}</div>` : ''}
                            </td>
                            <td>${splitCol}</td>
                            <td class="td-amount">${formatCurrency(eg.monto)}</td>
                            <td style="text-align: center;">${docCol}</td>
                            <td style="padding-right: 1.25rem;">
                                <div class="action-btns" style="justify-content: center;">
                                    <button onclick="editEgreso(${eg.id})" class="btn-icon" title="Editar Egreso">
                                        <i data-lucide="edit-3"></i>
                                    </button>
                                    <button onclick="deleteEgreso(${eg.id})" class="btn-icon btn-icon-danger" title="Eliminar Egreso">
                                        <i data-lucide="trash-2"></i>
                                    </button>
                                </div>
                            </td>
                        </tr>
                    `;
                });

                catBlock.innerHTML = `
                    <div class="panel-header" onclick="toggleEgresoCategory('cat-${catId}')" style="cursor: pointer; display: flex; justify-content: space-between; align-items: center; padding: 1rem 1.25rem; user-select: none;">
                        <span class="panel-title" style="font-size: 0.9rem; font-weight: 600; display: flex; align-items: center; gap: 0.5rem; color: #fff;">
                            <i data-lucide="folder" style="color: var(--accent-color); width: 18px; height: 18px;"></i>
                            ${catName}
                        </span>
                        <div style="display: flex; align-items: center; gap: 1.25rem;">
                            <span style="font-size: 0.9rem; font-weight: 700; color: var(--accent-color);">Total: ${formatCurrency(catTotal)}</span>
                            <i id="arrow-cat-${catId}" data-lucide="chevron-down" style="transition: transform 0.2s; width: 18px; height: 18px; color: var(--text-secondary);"></i>
                        </div>
                    </div>
                    
                    <div id="content-cat-${catId}" style="display: none; border-top: 1px solid var(--border-color);">
                        <div class="table-responsive">
                            <table class="table" style="margin-bottom: 0;">
                                <thead>
                                    <tr>
                                        <th style="padding-left: 1.25rem;">Fecha</th>
                                        <th>Clasificación</th>
                                        <th>Descripción / Ref. Cotización</th>
                                        <th>Financiamiento</th>
                                        <th>Monto</th>
                                        <th style="text-align: center;">Comprobante</th>
                                        <th style="width: 100px; text-align: center; padding-right: 1.25rem;">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${tableRows}
                                </tbody>
                            </table>
                        </div>
                    </div>
                `;

                container.appendChild(catBlock);
            });

            lucide.createIcons();
        }

        function deleteEgreso(id) {
            if (!confirm('¿Está seguro de que desea eliminar este egreso del sistema?')) return;

            const formData = new FormData();
            formData.append('id', id);

            fetch('api.php?action=delete_egreso', {
                method: 'POST',
                body: formData
            })
            .then(res => res.json())
            .then(response => {
                if (response.success) {
                    showToast('Egreso eliminado correctamente.', 'success');
                    loadSystemData();
                    if (document.getElementById('view-egresos-container').style.display !== 'none') {
                        loadEgresos();
                    }
                } else {
                    showToast(response.message, 'error');
                }
            });
        }

        // ================= WIZARD REGISTRO DE EGRESO (MODAL) =================
        function openEgresoModal() {
            if (globalCategories.length === 0) {
                showToast('Debe agregar al menos una categoría primero.', 'warning');
                return;
            }
            
            editingEgresoId = null;
            
            // Configurar textos de creación
            document.querySelector('#modal-egreso .modal-title').innerText = "Registrar Nuevo Egreso del Condominio";
            document.getElementById('btn-submit-egreso').innerText = "Guardar Egreso";
            document.getElementById('edit-egreso-file-preview').innerHTML = "";
            
            // Resetear formulario y pasos
            document.getElementById('form-egreso').reset();
            document.getElementById('egreso-subcategoria').disabled = true;
            document.getElementById('egreso-tipo-gasto').value = 'comun';
            toggleAsignacionFields('egreso');
            currentStep = 1;
            updateStepView();
            
            document.getElementById('modal-egreso').classList.add('active');
        }

        function closeEgresoModal() {
            document.getElementById('modal-egreso').classList.remove('active');
        }

        function editEgreso(id) {
            const eg = globalEgresos.find(x => x.id === id);
            if (!eg) {
                showToast('No se encontró la información del egreso.', 'error');
                return;
            }

            editingEgresoId = id;

            // Configurar textos de edición
            document.querySelector('#modal-egreso .modal-title').innerText = "Editar Egreso del Condominio";
            document.getElementById('btn-submit-egreso').innerText = "Actualizar Egreso";

            // Llenar campos
            document.getElementById('egreso-fecha').value = eg.fecha;
            document.getElementById('egreso-categoria').value = eg.categoria_id;
            
            // Cargar subcategorías y habilitar selector
            egresoCategoryChanged();
            document.getElementById('egreso-subcategoria').value = eg.subcategoria_id;
            
            // Clasificación específica del gasto
            const tipoGasto = eg.tipo_gasto || 'comun';
            document.getElementById('egreso-tipo-gasto').value = tipoGasto;
            document.getElementById('egreso-propiedad-id').value = eg.propiedad_id || '';
            toggleAsignacionFields('egreso');
            
            document.getElementById('egreso-descripcion').value = eg.descripcion;
            document.getElementById('egreso-monto').value = eg.monto;
            document.getElementById('egreso-referencia').value = eg.referencia_cotizacion || '';
            document.getElementById('egreso-observaciones').value = eg.observaciones || '';

            // Prorrateo
            const hasSplit = eg.dividir_meses > 1;
            document.getElementById('egreso-has-split').checked = hasSplit;
            toggleSplitInput();
            if (hasSplit) {
                document.getElementById('egreso-meses').value = eg.dividir_meses;
            }

            // Comprobante
            const hasDoc = eg.tiene_documento == 1;
            document.getElementById('egreso-has-doc').checked = hasDoc;
            toggleFileInput();
            
            const previewEl = document.getElementById('edit-egreso-file-preview');
            if (hasDoc && eg.documento_ruta) {
                previewEl.innerHTML = `
                    <i data-lucide="link" style="width: 14px; height: 14px; display: inline-block; vertical-align: middle;"></i>
                    Archivo actual: <a href="${eg.documento_ruta}" target="_blank" style="color: var(--accent-color); text-decoration: underline;">Ver comprobante</a>.<br>
                    <span style="font-size: 0.75rem; color: var(--text-secondary); font-weight: normal;">
                        Si selecciona un nuevo archivo, se reemplazará el anterior.
                    </span>
                `;
            } else {
                previewEl.innerHTML = "";
            }

            currentStep = 1;
            updateStepView();
            document.getElementById('modal-egreso').classList.add('active');
            lucide.createIcons();
        }

        // ================= EDITAR CATEGORÍA Y SUBCATEGORÍA =================
        function openEditCategoryModal(id) {
            const cat = globalCategories.find(c => c.id === id);
            if (!cat) return;

            document.getElementById('edit-cat-id').value = cat.id;
            document.getElementById('edit-cat-nombre').value = cat.nombre;
            document.getElementById('edit-cat-descripcion').value = cat.descripcion || '';
            
            document.getElementById('modal-edit-category').classList.add('active');
        }

        function toggleAsignacionFields(prefix) {
            const tipo = document.getElementById(`${prefix}-tipo-gasto`).value;
            const group = document.getElementById(`${prefix}-asignacion-group`);
            if (group) {
                group.style.display = tipo === 'especifico' ? 'block' : 'none';
            }
            if (tipo !== 'especifico') {
                const propSelect = document.getElementById(`${prefix}-propiedad-id`);
                if (propSelect) propSelect.value = '';
            }
        }

        function closeEditCategoryModal() {
            document.getElementById('modal-edit-category').classList.remove('active');
        }

        function submitEditCategory(e) {
            e.preventDefault();
            const id = document.getElementById('edit-cat-id').value;
            const nombre = document.getElementById('edit-cat-nombre').value;
            const descripcion = document.getElementById('edit-cat-descripcion').value;

            const formData = new FormData();
            formData.append('id', id);
            formData.append('nombre', nombre);
            formData.append('descripcion', descripcion);

            fetch('api.php?action=update_category', {
                method: 'POST',
                body: formData
            })
            .then(res => res.json())
            .then(response => {
                if (response.success) {
                    showToast('Categoría actualizada con éxito.', 'success');
                    closeEditCategoryModal();
                    loadSystemData();
                } else {
                    showToast(response.message, 'error');
                }
            })
            .catch(() => showToast('Error al actualizar la categoría', 'error'));
        }

        function openEditSubcategoryModal(id, categoria_id, nombre) {
            document.getElementById('edit-subcat-id').value = id;
            document.getElementById('edit-subcat-nombre').value = nombre;
            
            const select = document.getElementById('edit-subcat-parent');
            select.innerHTML = '';
            globalCategories.forEach(cat => {
                select.innerHTML += `<option value="${cat.id}" ${cat.id === categoria_id ? 'selected' : ''}>${cat.nombre}</option>`;
            });

            document.getElementById('modal-edit-subcategory').classList.add('active');
        }

        function closeEditSubcategoryModal() {
            document.getElementById('modal-edit-subcategory').classList.remove('active');
        }

        function submitEditSubcategory(e) {
            e.preventDefault();
            const id = document.getElementById('edit-subcat-id').value;
            const categoria_id = document.getElementById('edit-subcat-parent').value;
            const nombre = document.getElementById('edit-subcat-nombre').value;

            const formData = new FormData();
            formData.append('id', id);
            formData.append('categoria_id', categoria_id);
            formData.append('nombre', nombre);

            fetch('api.php?action=update_subcategory', {
                method: 'POST',
                body: formData
            })
            .then(res => res.json())
            .then(response => {
                if (response.success) {
                    showToast('Subcategoría actualizada con éxito.', 'success');
                    closeEditSubcategoryModal();
                    loadSystemData();
                } else {
                    showToast(response.message, 'error');
                }
            })
            .catch(() => showToast('Error al actualizar la subcategoría', 'error'));
        }

        function changeStep(dir) {
            // Validaciones por paso antes de avanzar
            if (dir === 1) {
                if (currentStep === 1) {
                    const fecha = document.getElementById('egreso-fecha').value;
                    const cat = document.getElementById('egreso-categoria').value;
                    const subcat = document.getElementById('egreso-subcategoria').value;
                    const desc = document.getElementById('egreso-descripcion').value;
                    const monto = document.getElementById('egreso-monto').value;
                    const tipo = document.getElementById('egreso-tipo-gasto').value;
                    const propiedad = document.getElementById('egreso-propiedad-id').value;

                    if (!fecha || !cat || !subcat || !desc || !monto || parseFloat(monto) <= 0 || (tipo === 'especifico' && !propiedad)) {
                        showToast(tipo === 'especifico' && !propiedad ? 'Por favor seleccione la propiedad específica para este egreso.' : 'Por favor complete todos los campos obligatorios.', 'warning');
                        return;
                    }
                }
            }

            currentStep += dir;
            updateStepView();
        }

        function updateStepView() {
            // Mostrar/Ocultar los pasos en el formulario
            document.querySelectorAll('.form-step').forEach(step => step.classList.remove('active'));
            document.getElementById(`form-step-${currentStep}`).classList.add('active');

            // Actualizar indicadores visuales
            for (let i = 1; i <= 3; i++) {
                const ind = document.getElementById(`ind-step-${i}`);
                if (i < currentStep) {
                    ind.className = "step-ind completed";
                    ind.innerHTML = '<i data-lucide="check" style="width: 14px; height: 14px;"></i>';
                } else if (i === currentStep) {
                    ind.className = "step-ind active";
                    ind.innerText = i;
                } else {
                    ind.className = "step-ind";
                    ind.innerText = i;
                }
            }

            // Manejo de botones del footer
            const btnPrev = document.getElementById('btn-prev-step');
            const btnNext = document.getElementById('btn-next-step');
            const btnSubmit = document.getElementById('btn-submit-egreso');

            if (currentStep === 1) {
                btnPrev.style.display = 'none';
                btnNext.style.display = 'block';
                btnSubmit.style.display = 'none';
            } else if (currentStep === 2) {
                btnPrev.style.display = 'block';
                btnNext.style.display = 'block';
                btnSubmit.style.display = 'none';
            } else if (currentStep === 3) {
                btnPrev.style.display = 'block';
                btnNext.style.display = 'none';
                btnSubmit.style.display = 'block';
                // Calcular y mostrar prorrateo preeliminar
                updateSplitPreview();
            }
            
            lucide.createIcons();
        }

        function toggleSplitInput() {
            const hasSplit = document.getElementById('egreso-has-split').checked;
            const splitGroup = document.getElementById('split-months-group');
            splitGroup.style.display = hasSplit ? 'block' : 'none';
            if (!hasSplit) {
                document.getElementById('egreso-meses').value = 1;
            }
        }

        function toggleFileInput() {
            const hasDoc = document.getElementById('egreso-has-doc').checked;
            const fileGroup = document.getElementById('file-upload-group');
            fileGroup.style.display = hasDoc ? 'block' : 'none';
            if (!hasDoc) {
                document.getElementById('egreso-documento').value = '';
            }
        }

        function updateSplitPreview() {
            const monto = parseFloat(document.getElementById('egreso-monto').value) || 0;
            const meses = parseInt(document.getElementById('egreso-meses').value) || 1;
            const label = document.getElementById('split-preview-text');
            
            if (meses > 1 && monto > 0) {
                const porMes = monto / meses;
                label.innerText = `Cobro prorrateado: ${meses} cuotas de ${formatCurrency(porMes)} c/u.`;
            } else {
                label.innerText = 'Cobro directo en el próximo mes de gastos comunes.';
            }
        }

        // Listener para recalcular prorrateo
        document.getElementById('egreso-meses').addEventListener('input', updateSplitPreview);

        function submitEgresoForm() {
            const form = document.getElementById('form-egreso');
            const formData = new FormData();

            formData.append('fecha', document.getElementById('egreso-fecha').value);
            formData.append('subcategoria_id', document.getElementById('egreso-subcategoria').value);
            formData.append('descripcion', document.getElementById('egreso-descripcion').value);
            formData.append('monto', document.getElementById('egreso-monto').value);
            formData.append('observaciones', document.getElementById('egreso-observaciones').value);
            formData.append('referencia_cotizacion', document.getElementById('egreso-referencia').value);
            
            // Clasificación de gasto específico
            const tipo_gasto = document.getElementById('egreso-tipo-gasto').value;
            const propiedad_id = document.getElementById('egreso-propiedad-id').value;
            
            formData.append('tipo_gasto', tipo_gasto);
            formData.append('propiedad_id', propiedad_id);
            
            const hasSplit = document.getElementById('egreso-has-split').checked;
            formData.append('dividir_meses', hasSplit ? document.getElementById('egreso-meses').value : 1);
            
            const hasDoc = document.getElementById('egreso-has-doc').checked;
            formData.append('tiene_documento', hasDoc ? 1 : 0);

            if (hasDoc) {
                const fileInput = document.getElementById('egreso-documento');
                if (fileInput.files.length > 0) {
                    formData.append('documento', fileInput.files[0]);
                } else if (!editingEgresoId) {
                    showToast('Por favor, seleccione un archivo de comprobante.', 'warning');
                    return;
                } else {
                    // Si estamos editando y no subió un nuevo archivo, verificamos si ya tenía uno
                    const eg = globalEgresos.find(x => x.id === editingEgresoId);
                    if (!eg || eg.tiene_documento == 0) {
                        showToast('Por favor, seleccione un archivo de comprobante.', 'warning');
                        return;
                    }
                }
            }

            const actionUrl = editingEgresoId 
                ? 'api.php?action=update_egreso' 
                : 'api.php?action=add_egreso';
            
            if (editingEgresoId) {
                formData.append('id', editingEgresoId);
            }

            fetch(actionUrl, {
                method: 'POST',
                body: formData
            })
            .then(res => res.json())
            .then(response => {
                if (response.success) {
                    showToast(editingEgresoId ? 'Egreso actualizado correctamente.' : 'Egreso registrado correctamente.', 'success');
                    closeEgresoModal();
                    editingEgresoId = null;
                    loadSystemData();
                    // Si estamos en la pestaña egresos, recargar tabla
                    if (document.getElementById('view-egresos-container').style.display !== 'none') {
                        loadEgresos();
                    }
                } else {
                    showToast(response.message, 'error');
                }
            })
            .catch(() => showToast('Error interno al guardar el egreso.', 'error'));
        }

        // ================= RENDERIZADO DE GRÁFICOS (CHART.JS) =================
        function renderChartsData(graficos) {
            // 1. Gráfico Histórico de Egresos
            const ctxHist = document.getElementById('chart-historico').getContext('2d');
            const historicoData = graficos.historico;
            
            if (chartInstHist) chartInstHist.destroy();
            
            chartInstHist = new Chart(ctxHist, {
                type: 'bar',
                data: {
                    labels: historicoData.map(d => d.mes_label),
                    datasets: [{
                        label: 'Monto Total ($)',
                        data: historicoData.map(d => d.total),
                        backgroundColor: 'rgba(59, 130, 246, 0.4)',
                        borderColor: '#3b82f6',
                        borderWidth: 2,
                        borderRadius: 6,
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { display: false }
                    },
                    scales: {
                        y: {
                            grid: { color: 'rgba(255, 255, 255, 0.05)' },
                            ticks: { color: '#9ca3af' }
                        },
                        x: {
                            grid: { display: false },
                            ticks: { color: '#9ca3af' }
                        }
                    }
                }
            });

            // 2. Gráfico Distribución de Categorías
            const ctxCat = document.getElementById('chart-categorias').getContext('2d');
            const catData = graficos.categorias;
            
            if (chartInstCat) chartInstCat.destroy();

            if (catData.length === 0) {
                // Dibujar estado vacío si no hay datos
                chartInstCat = new Chart(ctxCat, {
                    type: 'doughnut',
                    data: {
                        labels: ['Sin datos'],
                        datasets: [{
                            data: [1],
                            backgroundColor: ['rgba(255,255,255,0.05)']
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: { legend: { position: 'bottom', labels: { color: '#9ca3af' } } }
                    }
                });
            } else {
                const colorPalette = [
                    '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', 
                    '#ec4899', '#14b8a6', '#06b6d4', '#6366f1'
                ];

                chartInstCat = new Chart(ctxCat, {
                    type: 'doughnut',
                    data: {
                        labels: catData.map(d => d.categoria),
                        datasets: [{
                            data: catData.map(d => d.total),
                            backgroundColor: colorPalette.slice(0, catData.length),
                            borderWidth: 0
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            legend: {
                                position: 'bottom',
                                labels: { color: '#9ca3af', boxWidth: 12, usePointStyle: true }
                            }
                        }
                    }
                });
            }
        }

        // ================= HELPERS Y NOTIFICACIONES =================
        function formatCurrency(val) {
            return new Intl.NumberFormat('es-CL', {
                style: 'currency',
                currency: 'CLP',
                minimumFractionDigits: 0
            }).format(val);
        }

        function formatNumber(val) {
            const num = parseFloat(val);
            if (isNaN(num)) return '0';
            return new Intl.NumberFormat('es-CL', {
                minimumFractionDigits: 0,
                maximumFractionDigits: 2
            }).format(num);
        }

        function formatDateString(str) {
            if (!str) return '';
            const dates = str.split('-');
            if (dates.length !== 3) return str;
            return `${dates[2]}/${dates[1]}/${dates[0]}`;
        }

        function showToast(msg, type = 'success') {
            const container = document.getElementById('toast-container');
            const toast = document.createElement('div');
            toast.className = `toast ${type}`;
            
            let icon = 'check-circle';
            if (type === 'error') icon = 'x-circle';
            if (type === 'warning') icon = 'alert-triangle';

            toast.innerHTML = `
                <i data-lucide="${icon}"></i>
                <span>${msg}</span>
            `;
            
            container.appendChild(toast);
            lucide.createIcons();

            // Desvanecer y remover
            setTimeout(() => {
                toast.style.opacity = '0';
                setTimeout(() => toast.remove(), 300);
            }, 3000);
        }

        // ================= GESTIÓN DE UNIDADES =================
        let globalTiposUnidades = [];
        const collapsedTowers = {};
        const collapsedFloors = {};

        function toggleTowerCollapse(tId) {
            collapsedTowers[tId] = !collapsedTowers[tId];
            renderUnidadesGrid();
        }

        function toggleFloorCollapse(tId, p) {
            const key = `${tId}-${p}`;
            collapsedFloors[key] = !collapsedFloors[key];
            renderUnidadesGrid();
        }

        function loadUnidadesView() {
            // Cargar tipos de unidades y condominio desde el perfil
            fetch('api.php?action=get_condominio_profile')
                .then(res => res.json())
                .then(response => {
                    if (response.success) {
                        globalTiposUnidades = response.data.tipos_unidades || [];
                        globalCondominio = response.data.condominio || null;
                        // Luego cargar propiedades
                        return loadPropiedades();
                    }
                })
                .then(() => {
                    renderUnidadesGrid();
                })
                .catch(() => showToast('Error al cargar la vista de unidades.', 'error'));
        }

        function inferFloor(name) {
            // Extraer el piso a partir de patrones de número: ej "Depto 101" -> 1, "Depto 1204" -> 12
            const matches = name.match(/\d+/g);
            if (!matches) return 1;
            const numStr = matches[matches.length - 1]; // tomar el último número
            const num = parseInt(numStr, 10);
            if (isNaN(num)) return 1;

            if (numStr.length === 3) {
                return Math.floor(num / 100);
            } else if (numStr.length >= 4) {
                return Math.floor(num / 100);
            } else {
                return 1; // Si tiene 1 o 2 dígitos, va al piso 1
            }
        }

        function getProfileTotalUnitsLimit() {
            let total = 0;
            if (!globalCondominio || !globalCondominio.detalles_config) return 0;
            try {
                const details = JSON.parse(globalCondominio.detalles_config || '{}');
                const type = globalCondominio.tipo_inmueble;
                if (type === 'condominio_casas') {
                    total = parseInt(details.num_casas) || 0;
                } else if (type === 'condominio_edificios' || type === 'torre') {
                    total = (parseInt(details.habitacionales) || 0) + (parseInt(details.comerciales) || 0);
                }
            } catch (e) {
                console.error(e);
            }
            return total;
        }

        function renderUnidadesGrid() {
            const wrapper = document.getElementById('unidades-groups-wrapper');
            if (!wrapper) return;
            wrapper.innerHTML = '';

            const searchQuery = document.getElementById('search-unidades').value.toLowerCase().trim();

            // Filtrar y clasificar propiedades
            const torres = globalPropiedades.filter(p => p.tipo === 'torre');
            const unidades = globalPropiedades.filter(p => p.tipo === 'departamento' || p.tipo === 'casa' || p.tipo === 'local_comercial');

            // Actualizar contador de unidades creadas vs límite del perfil
            const createdCount = unidades.length;
            const profileLimit = getProfileTotalUnitsLimit();
            const counterBadge = document.getElementById('unidades-counter-badge');
            if (counterBadge) {
                counterBadge.textContent = `${createdCount} / ${profileLimit}`;
                if (createdCount > profileLimit) {
                    counterBadge.style.color = '#ef4444'; // var(--danger)
                    counterBadge.style.borderColor = '#ef4444';
                    counterBadge.style.background = 'rgba(239, 68, 68, 0.05)';
                } else if (createdCount === profileLimit) {
                    counterBadge.style.color = '#10b981'; // var(--success)
                    counterBadge.style.borderColor = '#10b981';
                    counterBadge.style.background = 'rgba(16, 185, 129, 0.05)';
                } else {
                    counterBadge.style.color = 'var(--text-secondary)';
                    counterBadge.style.borderColor = 'var(--border-color)';
                    counterBadge.style.background = 'rgba(255,255,255,0.05)';
                }
            }

            // Agrupar unidades por parent_id
            const groups = {};
            torres.forEach(t => {
                groups[t.id] = {
                    torre: t,
                    unidades: []
                };
            });

            const huerfanas = [];
            unidades.forEach(u => {
                const matchesSearch = u.identificador.toLowerCase().includes(searchQuery);
                if (searchQuery && !matchesSearch) return;

                if (u.parent_id && groups[u.parent_id]) {
                    groups[u.parent_id].unidades.push(u);
                } else {
                    huerfanas.push(u);
                }
            });

            // Parsear la estructura general de torres desde detalles_config
            let estructura = {};
            if (globalCondominio && globalCondominio.detalles_config) {
                try {
                    const details = JSON.parse(globalCondominio.detalles_config || '{}');
                    estructura = details.torres_estructura || {};
                } catch (e) {
                    console.error("Error al parsear detalles_config:", e);
                }
            }

            // 1. Renderizar Torres
            for (const id in groups) {
                const group = groups[id];
                const uList = group.unidades;
                const tId = group.torre.id;

                if (searchQuery && uList.length === 0) continue;

                // Estructura de esta torre
                const towerEst = estructura[tId] || { locked: false, pisos: 0, pisos_config: {} };
                if (!towerEst.pisos_config) towerEst.pisos_config = {};

                const card = document.createElement('div');
                card.className = 'card-panel';
                card.style.padding = '1.5rem';
                card.style.marginBottom = '1.5rem';

                // Cabecera de la Torre
                const header = document.createElement('div');
                header.style.display = 'flex';
                header.style.justifyContent = 'space-between';
                header.style.alignItems = 'center';
                header.style.borderBottom = '1px solid var(--border-color)';
                header.style.paddingBottom = '0.75rem';
                header.style.marginBottom = '1.25rem';
                header.style.flexWrap = 'wrap';
                header.style.gap = '0.75rem';

                header.innerHTML = `
                    <span style="font-weight: bold; font-size: 1.1rem; color: #fff; display: flex; align-items: center; gap: 0.5rem;">
                        <i data-lucide="building" style="color: var(--accent-color); width: 20px; height: 20px;"></i> ${group.torre.identificador}
                    </span>
                    
                    <div style="display: flex; align-items: center; gap: 1rem; flex-wrap: wrap;">
                        <!-- Control de Pisos -->
                        <div style="display: flex; align-items: center; gap: 0.4rem;">
                            <label style="font-size: 0.8rem; color: var(--text-secondary); margin: 0;">Pisos:</label>
                            <input type="number" class="form-control" id="pisos-torre-${tId}" value="${towerEst.pisos || 0}" min="0" max="50" style="width: 65px; font-size: 0.8rem; padding: 0.25rem 0.5rem;" ${towerEst.locked ? 'disabled' : ''} onchange="updateTowerPisos(${tId}, this.value)">
                            
                            <!-- Candado Pisos -->
                            <button type="button" class="btn-icon" onclick="toggleTowerLock(${tId})" title="${towerEst.locked ? 'Desbloquear Nro de Pisos' : 'Bloquear Nro de Pisos'}" style="padding: 0.25rem; min-width: auto;">
                                <i data-lucide="${towerEst.locked ? 'lock' : 'unlock'}" style="width: 15px; height: 15px; color: ${towerEst.locked ? 'var(--accent-color)' : 'var(--text-muted)'};"></i>
                            </button>
                        </div>
                        
                        <!-- Copiar Estructura -->
                        <button type="button" class="btn btn-secondary" onclick="openCopyTowerModal(${tId})" style="padding: 0.25rem 0.6rem; font-size: 0.75rem; height: auto; min-width: auto; gap: 0.25rem; display: flex; align-items: center;">
                            <i data-lucide="copy" style="width: 12px; height: 12px;"></i>
                            <span>Copiar Estructura</span>
                        </button>

                        <!-- Botón Desplegar / Colapsar Torre -->
                        <button type="button" class="btn-icon" onclick="toggleTowerCollapse(${tId})" title="Desplegar / Colapsar Pisos" style="padding: 0.25rem; min-width: auto; margin-left: 0.25rem;">
                            <i data-lucide="${collapsedTowers[tId] ? 'chevron-right' : 'chevron-down'}" style="width: 16px; height: 16px; color: var(--text-muted);"></i>
                        </button>
                    </div>
                `;
                card.appendChild(header);

                // Contenedor de Pisos
                const floorsContainer = document.createElement('div');
                floorsContainer.style.display = (collapsedTowers[tId] && !searchQuery) ? 'none' : 'flex';
                floorsContainer.style.flexDirection = 'column';
                floorsContainer.style.gap = '1rem';

                if (towerEst.pisos <= 0) {
                    floorsContainer.innerHTML = `<div style="text-align: center; color: var(--text-muted); font-size: 0.85rem; padding: 1.5rem 0;">Especifique el número de pisos arriba para comenzar a configurar.</div>`;
                } else {
                    for (let p = 1; p <= towerEst.pisos; p++) {
                        const floorEst = towerEst.pisos_config[p] || { units: 0, locked: false };
                        const floorKey = `${tId}-${p}`;
                        const isFloorCollapsed = collapsedFloors[floorKey] && !searchQuery;

                        const row = document.createElement('div');
                        row.style.display = 'flex';
                        row.style.alignItems = 'center';
                        row.style.justifyContent = 'space-between';
                        row.style.gap = '1rem';
                        row.style.borderBottom = '1px dashed rgba(255,255,255,0.03)';
                        row.style.paddingBottom = '0.75rem';
                        row.style.flexWrap = 'wrap';

                        // Columna Controles de Piso
                        const floorControls = document.createElement('div');
                        floorControls.style.display = 'flex';
                        floorControls.style.alignItems = 'center';
                        floorControls.style.gap = '0.5rem';
                        floorControls.style.minWidth = '250px';

                        floorControls.innerHTML = `
                            <span style="font-weight: 600; font-size: 0.85rem; color: var(--accent-color); width: 65px;">Piso ${p}:</span>
                            <div style="display: flex; align-items: center; gap: 0.35rem;">
                                <label style="font-size: 0.75rem; color: var(--text-secondary); margin: 0;">Deptos:</label>
                                <input type="number" class="form-control" id="units-floor-${tId}-${p}" value="${floorEst.units || 0}" min="0" max="30" style="width: 55px; font-size: 0.8rem; padding: 0.2rem 0.4rem;" ${floorEst.locked ? 'disabled' : ''} onchange="updateLocalFloorUnitsState(${tId}, ${p}, this.value)">
                                
                                <!-- Candado de Piso -->
                                <button type="button" class="btn-icon" onclick="toggleFloorLock(${tId}, ${p})" title="${floorEst.locked ? 'Desbloquear Unidades (Eliminará unidades de este piso de la BD)' : 'Bloquear y Generar Unidades en la BD'}" style="padding: 0.2rem; min-width: auto;">
                                    <i data-lucide="${floorEst.locked ? 'lock' : 'unlock'}" style="width: 14px; height: 14px; color: ${floorEst.locked ? 'var(--accent-color)' : 'var(--text-muted)'};"></i>
                                </button>
                                
                                <!-- Copiar Piso -->
                                <button type="button" class="btn-icon" onclick="openCopyFloorModal(${tId}, ${p})" title="Copiar distribución de este piso a otros" style="padding: 0.2rem; min-width: auto; margin-left: 0.25rem;">
                                    <i data-lucide="copy" style="width: 14px; height: 14px; color: var(--text-muted);"></i>
                                </button>

                                <!-- Botón Desplegar / Colapsar Piso -->
                                ${floorEst.locked ? `
                                <button type="button" class="btn-icon" onclick="toggleFloorCollapse(${tId}, ${p})" title="Desplegar / Colapsar Unidades" style="padding: 0.2rem; min-width: auto; margin-left: 0.15rem;">
                                    <i data-lucide="${isFloorCollapsed ? 'chevron-right' : 'chevron-down'}" style="width: 14px; height: 14px; color: var(--text-muted);"></i>
                                </button>
                                ` : ''}
                            </div>
                        `;

                        // Columna Grid de Unidades del Piso
                        const grid = document.createElement('div');
                        grid.style.display = isFloorCollapsed ? 'none' : 'flex';
                        grid.style.flexWrap = 'wrap';
                        grid.style.gap = '0.5rem';
                        grid.style.flex = '1';
                        grid.style.justifyContent = 'flex-start';
                        grid.style.alignItems = 'center';

                        if (floorEst.locked) {
                            // Cargar unidades del piso
                            const floorUnits = uList.filter(u => {
                                const f = u.piso !== null ? parseInt(u.piso) : inferFloor(u.identificador);
                                return f === p;
                            });

                            if (floorUnits.length === 0) {
                                grid.innerHTML = `<span style="color: var(--text-muted); font-size: 0.75rem; font-style: italic;">Generando unidades...</span>`;
                            } else {
                                floorUnits.sort((a, b) => a.identificador.localeCompare(b.identificador, undefined, {numeric: true, sensitivity: 'base'}));
                                floorUnits.forEach(u => {
                                    const badge = createUnidadBadgeHTML(u);
                                    grid.appendChild(badge);
                                });
                            }
                        } else {
                            grid.innerHTML = `<span style="color: var(--text-muted); font-size: 0.75rem; font-style: italic;">Defina las unidades y cierre el candado para crearlas.</span>`;
                        }

                        row.appendChild(floorControls);
                        row.appendChild(grid);
                        floorsContainer.appendChild(row);
                    }
                }

                card.appendChild(floorsContainer);
                wrapper.appendChild(card);
            }

            // 2. Renderizar Casas o Huérfanas
            if (huerfanas.length > 0 || (!searchQuery && torres.length === 0)) {
                const card = document.createElement('div');
                card.className = 'card-panel';
                card.style.padding = '1.5rem';
                card.style.marginBottom = '1.5rem';

                const header = document.createElement('div');
                header.style.display = 'flex';
                header.style.justifyContent = 'space-between';
                header.style.alignItems = 'center';
                header.style.borderBottom = '1px solid var(--border-color)';
                header.style.paddingBottom = '0.75rem';
                header.style.marginBottom = '1.25rem';
                header.innerHTML = `
                    <span style="font-weight: bold; font-size: 1.1rem; color: #fff; display: flex; align-items: center; gap: 0.5rem;">
                        <i data-lucide="home" style="color: var(--accent-color); width: 20px; height: 20px;"></i> Casas / Unidades Individuales
                    </span>
                    <span style="font-size: 0.8rem; color: var(--text-secondary);">${huerfanas.length} Unidades</span>
                `;
                card.appendChild(header);

                const grid = document.createElement('div');
                grid.style.display = 'flex';
                grid.style.flexWrap = 'wrap';
                grid.style.gap = '0.75rem';

                if (huerfanas.length === 0) {
                    grid.innerHTML = `<div style="text-align: center; color: var(--text-muted); font-size: 0.85rem; padding: 1rem 0; width: 100%;">No hay casas registradas.</div>`;
                } else {
                    huerfanas.sort((a, b) => a.identificador.localeCompare(b.identificador, undefined, {numeric: true, sensitivity: 'base'}));
                    huerfanas.forEach(u => {
                        const badge = createUnidadBadgeHTML(u);
                        grid.appendChild(badge);
                    });
                }

                card.appendChild(grid);
                wrapper.appendChild(card);
            }

            lucide.createIcons();
        }

        function createUnidadBadgeHTML(u) {
            const ut = globalTiposUnidades.find(t => t.id === u.tipo_unidad_id);
            const code = ut ? ut.codigo : 'Sin Alícuota';
            
            // Nombre corto para mostrar (ej: "Depto 101" en vez de "Torre A - Depto 101")
            let displayName = u.identificador;
            if (u.parent_id) {
                const parts = u.identificador.split(" - Depto ");
                if (parts.length > 1) {
                    displayName = parts[1];
                }
            } else {
                displayName = displayName.replace("Casa ", "");
            }

            const badge = document.createElement('div');
            badge.style.background = 'rgba(255, 255, 255, 0.02)';
            badge.style.border = '1px solid var(--border-color)';
            badge.style.padding = '0.35rem 0.6rem';
            badge.style.borderRadius = '8px';
            badge.style.display = 'flex';
            badge.style.alignItems = 'center';
            badge.style.gap = '0.4rem';
            badge.style.transition = 'all 0.2s';
            badge.title = u.identificador;

            badge.innerHTML = `
                <span style="font-weight: 600; font-size: 0.8rem; color: #fff;">${displayName}</span>
                <span style="font-size: 0.6rem; background: var(--border-color); color: var(--text-secondary); padding: 0.05rem 0.25rem; border-radius: 4px; font-weight: bold; text-transform: uppercase;">${code}</span>
                <div style="display: flex; gap: 0.15rem; margin-left: 0.35rem; border-left: 1px solid var(--border-color); padding-left: 0.35rem;">
                    <button onclick="navigateToResidentProfileFromBadge(${u.id})" style="background: none; border: none; padding: 0.1rem; color: var(--text-muted); cursor: pointer; display: flex; align-items: center;" title="Ficha de Residentes"><i data-lucide="users" style="width: 11px; height: 11px;"></i></button>
                    <button onclick="openAddUnidadModal(${u.id})" style="background: none; border: none; padding: 0.1rem; color: var(--text-muted); cursor: pointer; display: flex; align-items: center;" title="Editar"><i data-lucide="edit-2" style="width: 11px; height: 11px;"></i></button>
                    <button onclick="deleteUnidad(${u.id})" style="background: none; border: none; padding: 0.1rem; color: var(--text-muted); cursor: pointer; display: flex; align-items: center;" title="Eliminar"><i data-lucide="trash-2" style="width: 11px; height: 11px;"></i></button>
                </div>
            `;

            // Hover effects
            badge.onmouseenter = () => {
                badge.style.borderColor = 'var(--accent-color)';
                badge.style.background = 'rgba(59, 130, 246, 0.05)';
            };
            badge.onmouseleave = () => {
                badge.style.borderColor = 'var(--border-color)';
                badge.style.background = 'rgba(255, 255, 255, 0.02)';
            };

            return badge;
        }

        function openAddUnidadModal(id = null) {
            const modal = document.getElementById('modal-add-unidad');
            const title = document.getElementById('modal-unidad-title');
            const form = document.getElementById('form-add-unidad');
            form.reset();

            document.getElementById('edit-unidad-id').value = id || '';

            // Cargar select de Torres
            const selectTorre = document.getElementById('unidad-torre-id');
            selectTorre.innerHTML = '';

            const torres = globalPropiedades.filter(p => p.tipo === 'torre');
            
            // Opción por defecto (Casas o Sin torre)
            const optNone = document.createElement('option');
            optNone.value = '';
            optNone.textContent = 'Ninguno / Casa';
            selectTorre.appendChild(optNone);

            torres.forEach(t => {
                const opt = document.createElement('option');
                opt.value = t.id;
                opt.textContent = t.identificador;
                selectTorre.appendChild(opt);
            });

            // Cargar select de tipos de unidades
            const selectTipo = document.getElementById('unidad-tipo-unidad-id');
            selectTipo.innerHTML = '<option value="">Seleccione alícuota...</option>';
            globalTiposUnidades.forEach(t => {
                const opt = document.createElement('option');
                opt.value = t.id;
                opt.textContent = `${t.codigo} (${(t.porcentaje_prorrateo * 100).toFixed(4)}%)`;
                selectTipo.appendChild(opt);
            });

            const adicContainer = document.getElementById('unidad-adicional-readonly');
            const propLabel = document.getElementById('unidad-read-propietario');
            const estLabel = document.getElementById('unidad-read-estacionamiento');

            if (id) {
                title.innerText = 'Editar Unidad';
                const unit = globalPropiedades.find(p => p.id === id);
                if (unit) {
                    selectTorre.value = unit.parent_id || '';
                    
                    let num = unit.identificador;
                    if (unit.parent_id) {
                        const parts = num.split(" - Depto ");
                        if (parts.length > 1) num = parts[1];
                    } else {
                        num = num.replace("Casa ", "");
                    }
                    
                    document.getElementById('unidad-numero').value = num;
                    selectTipo.value = unit.tipo_unidad_id || '';
                }

                adicContainer.style.display = 'block';
                propLabel.textContent = 'Cargando...';
                estLabel.textContent = 'Cargando...';

                fetch(`api.php?action=get_resident_ficha&propiedad_id=${id}`)
                    .then(res => res.json())
                    .then(response => {
                        if (response.success && response.data.ficha) {
                            const ficha = response.data.ficha;
                            estLabel.textContent = ficha.estacionamiento || 'No asignado';
                            
                            const propietarios = response.data.integrantes
                                .filter(i => parseInt(i.es_propietario) === 1)
                                .map(i => `${i.nombres} ${i.apellidos}`);
                                
                            propLabel.textContent = propietarios.length > 0 ? propietarios.join(', ') : 'Sin propietario';
                        } else {
                            estLabel.textContent = 'No asignado';
                            propLabel.textContent = 'Sin propietario';
                        }
                    })
                    .catch(() => {
                        estLabel.textContent = 'Error';
                        propLabel.textContent = 'Error';
                    });

                loadUnitGCHistory(id);
            } else {
                title.innerText = 'Agregar Nueva Unidad Manual';
                adicContainer.style.display = 'none';
            }

            updateUnidadPreviewName();
            modal.classList.add('active');
            lucide.createIcons();
        }

        function closeAddUnidadModal() {
            document.getElementById('modal-add-unidad').classList.remove('active');
        }

        function updateUnidadPreviewName() {
            const select = document.getElementById('unidad-torre-id');
            const torreText = select.options[select.selectedIndex]?.text || '';
            const num = document.getElementById('unidad-numero').value.trim();
            const previewInput = document.getElementById('unidad-preview-name');

            if (select.value) {
                previewInput.value = `${torreText} - Depto ${num || '?'}`;
            } else {
                previewInput.value = `Casa ${num || '?'}`;
            }
        }

        function submitAddUnidadForm() {
            const id = document.getElementById('edit-unidad-id').value;
            const parent_id = document.getElementById('unidad-torre-id').value;
            const numero = document.getElementById('unidad-numero').value.trim();
            const tipo_unidad_id = document.getElementById('unidad-tipo-unidad-id').value;

            if (!numero) {
                showToast('Por favor, ingresa el número de unidad.', 'warning');
                return;
            }
            if (!tipo_unidad_id) {
                showToast('Por favor, selecciona el tipo de unidad (alícuota).', 'warning');
                return;
            }

            const formData = new FormData();
            if (id) formData.append('id', id);
            if (parent_id) formData.append('parent_id', parent_id);
            formData.append('numero', numero);
            formData.append('tipo_unidad_id', tipo_unidad_id);

            fetch('api.php?action=save_unidad', {
                method: 'POST',
                body: formData
            })
            .then(res => res.json())
            .then(response => {
                if (response.success) {
                    showToast(response.message, 'success');
                    closeAddUnidadModal();
                    loadUnidadesView();
                } else {
                    showToast(response.message, 'error');
                }
            })
            .catch(() => showToast('Error al procesar la solicitud.', 'error'));
        }

        function deleteUnidad(id) {
            if (!confirm('¿Está seguro de eliminar esta unidad de manera permanente?')) return;

            const formData = new FormData();
            formData.append('id', id);

            fetch('api.php?action=delete_unidad', {
                method: 'POST',
                body: formData
            })
            .then(res => res.json())
            .then(response => {
                if (response.success) {
                    showToast(response.message, 'success');
                    loadUnidadesView();
                } else {
                    showToast(response.message, 'error');
                }
            })
            .catch(() => showToast('Error al eliminar la unidad.', 'error'));
        }

        // ================= AVATAR / LOGO ADMINISTRADOR =================
        function triggerAvatarUpload() {
            document.getElementById('file-input-avatar').click();
        }

        function uploadAvatarFile(input) {
            if (!input.files || !input.files[0]) return;
            
            const file = input.files[0];
            const formData = new FormData();
            formData.append('avatar', file);
            
            fetch('api.php?action=upload_avatar', {
                method: 'POST',
                body: formData
            })
            .then(res => res.json())
            .then(response => {
                if (response.success) {
                    showToast(response.message, 'success');
                    const adminName = document.querySelector('.admin-name')?.textContent || 'Administrador';
                    loadAvatarImage(response.data.avatar_path, adminName);
                } else {
                    showToast(response.message, 'error');
                }
            })
            .catch(() => showToast('Error al subir la imagen de perfil.', 'error'));
        }

        function loadAvatarImage(path, name = 'Administrador') {
            const img = document.getElementById('avatar-img');
            const initials = document.getElementById('avatar-initials');
            if (!img || !initials) return;

            if (path) {
                img.src = path;
                img.style.display = 'block';
                initials.style.display = 'none';
            } else {
                img.src = '';
                img.style.display = 'none';
                initials.style.display = 'block';
                
                // Generar iniciales del nombre
                const parts = name.trim().split(/\s+/);
                let init = '';
                if (parts.length > 0 && parts[0]) init += parts[0][0];
                if (parts.length > 1 && parts[1]) init += parts[1][0];
                
                initials.textContent = init.toUpperCase() || 'AD';
            }
        }

        // ================= OPERACIONES DE ESTRUCTURA DINÁMICA DE TORRES =================
        function updateTowerPisos(torreId, count) {
            const numPisos = parseInt(count) || 0;
            const formData = new FormData();
            formData.append('torre_id', torreId);
            formData.append('pisos', numPisos);
            formData.append('locked', 0); // mantener desbloqueado al editar count

            fetch('api.php?action=save_tower_structure', {
                method: 'POST',
                body: formData
            })
            .then(res => res.json())
            .then(response => {
                if (response.success) {
                    loadUnidadesView();
                } else {
                    showToast(response.message, 'error');
                }
            })
            .catch(() => showToast('Error al actualizar pisos de la torre.', 'error'));
        }

        function toggleTowerLock(torreId) {
            let estructura = {};
            if (globalCondominio && globalCondominio.detalles_config) {
                try {
                    estructura = JSON.parse(globalCondominio.detalles_config).torres_estructura || {};
                } catch(e) {}
            }
            const towerEst = estructura[torreId] || { locked: false, pisos: 0 };
            const nextLocked = towerEst.locked ? 0 : 1;
            const numPisos = parseInt(document.getElementById(`pisos-torre-${torreId}`).value) || 0;

            const formData = new FormData();
            formData.append('torre_id', torreId);
            formData.append('pisos', numPisos);
            formData.append('locked', nextLocked);

            fetch('api.php?action=save_tower_structure', {
                method: 'POST',
                body: formData
            })
            .then(res => res.json())
            .then(response => {
                if (response.success) {
                    showToast(nextLocked ? 'Estructura de pisos bloqueada.' : 'Estructura de pisos desbloqueada.', 'success');
                    loadUnidadesView();
                } else {
                    showToast(response.message, 'error');
                }
            })
            .catch(() => showToast('Error al modificar bloqueo de la torre.', 'error'));
        }

        function updateLocalFloorUnitsState(torreId, piso, count) {
            // Se guardará formalmente al bloquear el piso
        }

        function toggleFloorLock(torreId, piso) {
            let estructura = {};
            if (globalCondominio && globalCondominio.detalles_config) {
                try {
                    estructura = JSON.parse(globalCondominio.detalles_config).torres_estructura || {};
                } catch(e) {}
            }
            const towerEst = estructura[torreId] || { pisos_config: {} };
            const floorEst = (towerEst.pisos_config && towerEst.pisos_config[piso]) || { units: 0, locked: false };
            
            const nextLocked = floorEst.locked ? 0 : 1;
            const unitsCount = parseInt(document.getElementById(`units-floor-${torreId}-${piso}`).value) || 0;

            if (!nextLocked) {
                if (!confirm(`¿Está seguro de desbloquear el Piso ${piso}? Esto eliminará de forma permanente los departamentos y registros asociados a este piso de la base de datos.`)) {
                    return;
                }
            }

            const formData = new FormData();
            formData.append('torre_id', torreId);
            formData.append('piso', piso);
            formData.append('units', unitsCount);
            formData.append('locked', nextLocked);

            fetch('api.php?action=lock_floor_units', {
                method: 'POST',
                body: formData
            })
            .then(res => res.json())
            .then(response => {
                if (response.success) {
                    showToast(nextLocked ? `Piso ${piso} bloqueado y unidades generadas.` : `Piso ${piso} desbloqueado.`, 'success');
                    loadUnidadesView();
                } else {
                    showToast(response.message, 'error');
                }
            })
            .catch(() => showToast('Error al modificar estado del piso.', 'error'));
        }

        // --- MÉTODOS DE COPIA ---
        function openCopyTowerModal(fromTorreId) {
            document.getElementById('copy-tower-from-id').value = fromTorreId;
            const select = document.getElementById('copy-tower-target');
            select.innerHTML = '<option value="">Seleccione torre destino...</option>';

            const torres = globalPropiedades.filter(p => p.tipo === 'torre' && p.id !== fromTorreId);
            torres.forEach(t => {
                select.innerHTML += `<option value="${t.id}">${t.identificador}</option>`;
            });

            document.getElementById('modal-copy-tower').classList.add('active');
        }

        function closeCopyTowerModal() {
            document.getElementById('modal-copy-tower').classList.remove('active');
        }

        function submitCopyTower(e) {
            e.preventDefault();
            const fromId = document.getElementById('copy-tower-from-id').value;
            const toId = document.getElementById('copy-tower-target').value;

            if (!toId) {
                showToast('Seleccione una torre de destino.', 'warning');
                return;
            }

            if (!confirm('¿Está seguro de copiar la estructura de esta torre? Se sobrescribirán y borrarán las unidades de la torre destino.')) return;

            const formData = new FormData();
            formData.append('from_torre_id', fromId);
            formData.append('to_torre_id', toId);

            fetch('api.php?action=copy_tower_structure', {
                method: 'POST',
                body: formData
            })
            .then(res => res.json())
            .then(response => {
                if (response.success) {
                    showToast(response.message, 'success');
                    closeCopyTowerModal();
                    loadUnidadesView();
                } else {
                    showToast(response.message, 'error');
                }
            })
            .catch(() => showToast('Error al copiar estructura de la torre.', 'error'));
        }

        function openCopyFloorModal(fromTorreId, fromPiso) {
            document.getElementById('copy-floor-from-torre-id').value = fromTorreId;
            document.getElementById('copy-floor-from-piso').value = fromPiso;
            
            const select = document.getElementById('copy-floor-target-torre');
            select.innerHTML = '';

            const torres = globalPropiedades.filter(p => p.tipo === 'torre');
            torres.forEach(t => {
                select.innerHTML += `<option value="${t.id}" ${t.id === fromTorreId ? 'selected' : ''}>${t.identificador}</option>`;
            });

            document.getElementById('modal-copy-floor').classList.add('active');
        }

        function closeCopyFloorModal() {
            document.getElementById('modal-copy-floor').classList.remove('active');
        }

        function submitCopyFloor(e) {
            e.preventDefault();
            const fromId = document.getElementById('copy-floor-from-torre-id').value;
            const fromPiso = document.getElementById('copy-floor-from-piso').value;
            const toId = document.getElementById('copy-floor-target-torre').value;
            const scope = document.getElementById('copy-floor-scope').value;

            const formData = new FormData();
            formData.append('from_torre_id', fromId);
            formData.append('from_piso', fromPiso);
            formData.append('to_torre_id', toId);
            formData.append('target_scope', scope);

            fetch('api.php?action=copy_floor_structure', {
                method: 'POST',
                body: formData
            })
            .then(res => res.json())
            .then(response => {
                if (response.success) {
                    showToast(response.message, 'success');
                    closeCopyFloorModal();
                    loadUnidadesView();
                } else {
                    showToast(response.message, 'error');
                }
            })
            .catch(() => showToast('Error al copiar distribución del piso.', 'error'));
        }

        // ================= GESTIÓN DE RESIDENTES =================
        let residentePropiedadLocked = false;
        let residenteEstacionamientoLocked = false;

        function loadResidentesView() {
            const selectProp = document.getElementById('residente-propiedad-id');
            if (!selectProp) return;
            selectProp.innerHTML = '<option value="">Seleccione una unidad...</option>';

            // Filtrar solo departamentos, locales o casas
            const unidades = globalPropiedades.filter(p => p.tipo === 'departamento' || p.tipo === 'casa' || p.tipo === 'local_comercial');
            unidades.sort((a, b) => a.identificador.localeCompare(b.identificador, undefined, {numeric: true, sensitivity: 'base'}));

            unidades.forEach(u => {
                const opt = document.createElement('option');
                opt.value = u.id;
                opt.textContent = u.identificador;
                selectProp.appendChild(opt);
            });

            // Si está bloqueado, no limpiar ni cambiar la selección
            if (!residentePropiedadLocked) {
                selectProp.value = '';
                selectProp.disabled = false;
                document.getElementById('residente-estacionamiento').value = '';
                document.getElementById('residente-patente').value = '';
                document.getElementById('residente-observacion').value = '';
                document.getElementById('tbody-residente-integrantes').innerHTML = '';
            } else {
                // Si está bloqueado, disparar la recarga del registro actual
                residentePropiedadChanged();
            }

            // Aplicar estados de candado en controles
            updateResidenteLockControls();
            lucide.createIcons();
        }

        function updateResidenteLockControls() {
            const selectProp = document.getElementById('residente-propiedad-id');
            const btnProp = document.getElementById('btn-residente-propiedad-lock');
            const iconProp = document.getElementById('residente-propiedad-lock-icon');

            const inputEst = document.getElementById('residente-estacionamiento');
            const btnEst = document.getElementById('btn-residente-estacionamiento-lock');
            const iconEst = document.getElementById('residente-estacionamiento-lock-icon');

            if (selectProp) selectProp.disabled = residentePropiedadLocked;
            if (iconProp) {
                iconProp.setAttribute('data-lucide', residentePropiedadLocked ? 'lock' : 'unlock');
                iconProp.style.color = residentePropiedadLocked ? 'var(--accent-color)' : 'var(--text-muted)';
            }
            if (btnProp) {
                btnProp.title = residentePropiedadLocked ? 'Desbloquear Selección' : 'Bloquear Selección';
            }

            if (inputEst) inputEst.disabled = residenteEstacionamientoLocked;
            if (iconEst) {
                iconEst.setAttribute('data-lucide', residenteEstacionamientoLocked ? 'lock' : 'unlock');
                iconEst.style.color = residenteEstacionamientoLocked ? 'var(--accent-color)' : 'var(--text-muted)';
            }
            if (btnEst) {
                btnEst.title = residenteEstacionamientoLocked ? 'Desbloquear Campo' : 'Bloquear Campo';
            }
            lucide.createIcons();
        }

        function toggleResidentePropiedadLock() {
            const selectProp = document.getElementById('residente-propiedad-id');
            if (selectProp && !selectProp.value && !residentePropiedadLocked) {
                showToast('Seleccione primero una unidad antes de bloquear.', 'warning');
                return;
            }
            residentePropiedadLocked = !residentePropiedadLocked;
            updateResidenteLockControls();
        }

        function toggleResidenteEstacionamientoLock() {
            residenteEstacionamientoLocked = !residenteEstacionamientoLocked;
            updateResidenteLockControls();
        }

        function residentePropiedadChanged() {
            const propSelect = document.getElementById('residente-propiedad-id');
            if (!propSelect) return;
            const propId = propSelect.value;
            const tbody = document.getElementById('tbody-residente-integrantes');
            if (tbody) tbody.innerHTML = '';

            if (!propId) {
                if (!residenteEstacionamientoLocked) {
                    document.getElementById('residente-estacionamiento').value = '';
                }
                document.getElementById('residente-patente').value = '';
                document.getElementById('residente-observacion').value = '';
                loadResidenteGCHistory('');
                return;
            }

            loadResidenteGCHistory(propId);

            fetch(`api.php?action=get_resident_ficha&propiedad_id=${propId}`)
                .then(res => res.json())
                .then(response => {
                    if (response.success && response.data.ficha) {
                        const ficha = response.data.ficha;
                        if (!residenteEstacionamientoLocked) {
                            document.getElementById('residente-estacionamiento').value = ficha.estacionamiento || '';
                        }
                        document.getElementById('residente-patente').value = ficha.patente || '';
                        document.getElementById('residente-observacion').value = ficha.observacion || '';

                        // Renderizar integrantes
                        response.data.integrantes.forEach(i => {
                            addResidenteIntegranteRow(
                                i.nombres, 
                                i.apellidos, 
                                i.rut, 
                                i.fecha_nacimiento, 
                                i.telefono, 
                                i.email, 
                                parseInt(i.es_propietario) === 1, 
                                parseInt(i.tiene_acceso) === 1,
                                parseInt(i.vive_en_unidad ?? 1) === 1
                            );
                        });
                    } else {
                        // Ficha vacía
                        if (!residenteEstacionamientoLocked) {
                            document.getElementById('residente-estacionamiento').value = '';
                        }
                        document.getElementById('residente-patente').value = '';
                        document.getElementById('residente-observacion').value = '';
                    }
                    lucide.createIcons();
                })
                .catch(() => showToast('Error al cargar la ficha de residentes.', 'error'));
        }

        function residentePropCheckboxChanged(chk) {
            const tr = chk.closest('tr');
            const viveChk = tr.querySelector('.res-int-vive');
            if (viveChk) {
                if (chk.checked) {
                    viveChk.disabled = false;
                    viveChk.checked = true;
                } else {
                    viveChk.checked = false;
                    viveChk.disabled = true;
                }
            }
        }

        function addResidenteIntegranteRow(nombres = '', apellidos = '', rut = '', dob = '', telefono = '', email = '', propietario = false, acceso = false, viveEnUnidad = true) {
            const tbody = document.getElementById('tbody-residente-integrantes');
            if (!tbody) return;

            const tr = document.createElement('tr');
            const uniqueId = 'dob_' + Math.random().toString(36).substr(2, 9);
            const ageVal = dob ? calculateAge(dob) : '-';

            tr.innerHTML = `
                <td style="padding: 0.35rem 0.25rem;">
                    <input type="text" class="form-control res-int-nombres" placeholder="Nombres" value="${nombres}" style="font-size: 0.8rem; padding: 0.35rem;" required>
                </td>
                <td style="padding: 0.35rem 0.25rem;">
                    <input type="text" class="form-control res-int-apellidos" placeholder="Apellidos" value="${apellidos}" style="font-size: 0.8rem; padding: 0.35rem;" required>
                </td>
                <td style="padding: 0.35rem 0.25rem;">
                    <input type="text" class="form-control res-int-rut" placeholder="Ej: 19.345.678-K" value="${rut}" style="font-size: 0.8rem; padding: 0.35rem;" required>
                </td>
                <td style="padding: 0.35rem 0.25rem;">
                    <input type="date" class="form-control res-int-dob" id="${uniqueId}" value="${dob}" style="font-size: 0.8rem; padding: 0.35rem;" required onchange="residenteDobChanged('${uniqueId}')">
                </td>
                <td style="padding: 0.35rem 0.25rem; text-align: center; vertical-align: middle;">
                    <span class="res-int-age-badge" id="${uniqueId}_age" style="font-weight: 600; font-size: 0.8rem; color: #fff;">${ageVal}</span>
                </td>
                <td style="padding: 0.35rem 0.25rem;">
                    <input type="text" class="form-control res-int-telefono" placeholder="Ej: +569..." value="${telefono}" style="font-size: 0.8rem; padding: 0.35rem;">
                </td>
                <td style="padding: 0.35rem 0.25rem;">
                    <input type="email" class="form-control res-int-email" placeholder="Ej: user@mail.com" value="${email}" style="font-size: 0.8rem; padding: 0.35rem;">
                </td>
                <td style="padding: 0.35rem 0.25rem; text-align: center; vertical-align: middle;">
                    <input type="checkbox" class="res-int-prop" ${propietario ? 'checked' : ''} onchange="residentePropCheckboxChanged(this)" style="width: 16px; height: 16px; cursor: pointer;">
                </td>
                <td style="padding: 0.35rem 0.25rem; text-align: center; vertical-align: middle;">
                    <input type="checkbox" class="res-int-vive" ${propietario && viveEnUnidad ? 'checked' : ''} ${!propietario ? 'disabled' : ''} style="width: 16px; height: 16px; cursor: pointer;">
                </td>
                <td style="padding: 0.35rem 0.25rem; text-align: center; vertical-align: middle;">
                    <input type="checkbox" class="res-int-acceso" ${acceso ? 'checked' : ''} style="width: 16px; height: 16px; cursor: pointer;">
                </td>
                <td style="padding: 0.35rem 0.25rem; text-align: center; vertical-align: middle;">
                    <button type="button" class="btn-icon text-danger" onclick="this.closest('tr').remove()" title="Eliminar Integrante" style="padding: 0.25rem; min-width: auto;">
                        <i data-lucide="trash-2" style="width: 14px; height: 14px;"></i>
                    </button>
                </td>
            `;

            tbody.appendChild(tr);
            lucide.createIcons();
        }

        function calculateAge(dobString) {
            if (!dobString) return '-';
            const today = new Date();
            const birthDate = new Date(dobString);
            let age = today.getFullYear() - birthDate.getFullYear();
            const m = today.getMonth() - birthDate.getMonth();
            if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
                age--;
            }
            return isNaN(age) ? '-' : age;
        }

        function residenteDobChanged(id) {
            const dobInput = document.getElementById(id);
            const ageSpan = document.getElementById(id + '_age');
            if (dobInput && ageSpan) {
                ageSpan.textContent = calculateAge(dobInput.value);
            }
        }

        function saveResidentFicha() {
            const propSelect = document.getElementById('residente-propiedad-id');
            if (!propSelect) return;
            const propId = propSelect.value;
            if (!propId) {
                showToast('Por favor, selecciona una unidad para la ficha.', 'warning');
                return;
            }

            const estacionamiento = document.getElementById('residente-estacionamiento').value.trim();
            const patente = document.getElementById('residente-patente').value.trim();
            const observacion = document.getElementById('residente-observacion').value.trim();

            const integrantes = [];
            let hasError = false;
            
            document.querySelectorAll('#tbody-residente-integrantes tr').forEach(row => {
                const nombres = row.querySelector('.res-int-nombres').value.trim();
                const apellidos = row.querySelector('.res-int-apellidos').value.trim();
                const rut = row.querySelector('.res-int-rut').value.trim();
                const dob = row.querySelector('.res-int-dob').value;
                const telefono = row.querySelector('.res-int-telefono').value.trim();
                const email = row.querySelector('.res-int-email').value.trim();
                const esProp = row.querySelector('.res-int-prop').checked ? 1 : 0;
                const viveEnUnidad = row.querySelector('.res-int-vive').checked ? 1 : 0;
                const tieneAcceso = row.querySelector('.res-int-acceso').checked ? 1 : 0;

                if (!nombres || !apellidos || !rut || !dob) {
                    hasError = true;
                }

                integrantes.push({
                    nombres: nombres,
                    apellidos: apellidos,
                    rut: rut,
                    fecha_nacimiento: dob,
                    telefono: telefono,
                    email: email,
                    es_propietario: esProp,
                    vive_en_unidad: viveEnUnidad,
                    tiene_acceso: tieneAcceso
                });
            });

            if (hasError) {
                showToast('Por favor, completa todos los datos obligatorios (* Nombres, Apellidos, RUT y Fecha de Nacimiento) de los integrantes.', 'warning');
                return;
            }

            const formData = new FormData();
            formData.append('propiedad_id', propId);
            formData.append('estacionamiento', estacionamiento);
            formData.append('patente', patente);
            formData.append('observacion', observacion);
            formData.append('integrantes', JSON.stringify(integrantes));

            fetch('api.php?action=save_resident_ficha', {
                method: 'POST',
                body: formData
            })
            .then(res => res.json())
            .then(response => {
                if (response.success) {
                    showToast(response.message, 'success');
                    residentePropiedadChanged();
                } else {
                    showToast(response.message, 'error');
                }
            })
            .catch(() => showToast('Error al guardar la ficha de residentes.', 'error'));
        }

        function navigateToResidentProfileFromUnitModal() {
            const unitId = document.getElementById('edit-unidad-id').value;
            closeAddUnidadModal();
            if (unitId) {
                residentePropiedadLocked = true;
                switchView('residentes');
                const selectProp = document.getElementById('residente-propiedad-id');
                if (selectProp) {
                    selectProp.value = unitId;
                    residentePropiedadChanged();
                }
            }
        }

        // ================= NUEVOS MÉTODOS DE REPORTES Y ASIGNACIÓN DE RESIDENTES =================
        function newResidentAssignment() {
            residentePropiedadLocked = false;
            residenteEstacionamientoLocked = false;

            const selectProp = document.getElementById('residente-propiedad-id');
            if (selectProp) {
                selectProp.value = '';
                selectProp.disabled = false;
            }

            const inputEst = document.getElementById('residente-estacionamiento');
            if (inputEst) {
                inputEst.value = '';
                inputEst.disabled = false;
            }

            document.getElementById('residente-patente').value = '';
            document.getElementById('residente-observacion').value = '';
            document.getElementById('tbody-residente-integrantes').innerHTML = '';

            updateResidenteLockControls();
            showToast('Formulario de residentes listo para una nueva asignación.', 'success');
        }

        function loadPropietariosView() {
            const tbody = document.getElementById('tbody-reporte-propietarios-full');
            if (!tbody) return;
            tbody.innerHTML = '<tr><td colspan="10" style="text-align: center; color: var(--text-muted); padding: 2rem;">Cargando listado de propietarios...</td></tr>';
            
            fetch('api.php?action=get_propietarios_report')
                .then(res => res.json())
                .then(response => {
                    if (response.success) {
                        renderPropietariosReportFull(response.data);
                    } else {
                        tbody.innerHTML = `<tr><td colspan="10" style="text-align: center; color: var(--danger); padding: 2rem;">${response.message}</td></tr>`;
                    }
                    lucide.createIcons();
                })
                .catch(() => {
                    tbody.innerHTML = '<tr><td colspan="10" style="text-align: center; color: var(--danger); padding: 2rem;">Error al conectar con el servidor.</td></tr>';
                });
        }

        function renderPropietariosReportFull(data) {
            const tbody = document.getElementById('tbody-reporte-propietarios-full');
            if (!tbody) return;
            tbody.innerHTML = '';

            if (data.length === 0) {
                tbody.innerHTML = '<tr><td colspan="10" style="text-align: center; color: var(--text-muted); padding: 2rem;">No se han asignado propietarios a las unidades.</td></tr>';
                return;
            }

            data.forEach(p => {
                const tr = document.createElement('tr');
                const torreLabel = p.torre_nombre || 'Ninguna / Casa';
                const pisoLabel = p.propiedad_piso || '-';
                const viveLabel = parseInt(p.vive_en_unidad) === 1 
                    ? '<span style="background: rgba(16, 185, 129, 0.1); color: #10b981; padding: 0.15rem 0.5rem; border-radius: 6px; font-size: 0.7rem; font-weight: 600;">Sí</span>' 
                    : '<span style="background: rgba(239, 68, 68, 0.1); color: #ef4444; padding: 0.15rem 0.5rem; border-radius: 6px; font-size: 0.7rem; font-weight: 600;">No (Rentado)</span>';

                const phone = p.telefono || '-';
                const email = p.email || '-';
                const contact = (phone !== '-' || email !== '-') ? `${phone}<br><small style="color: var(--text-secondary);">${email}</small>` : '-';

                tr.innerHTML = `
                    <td style="padding: 0.6rem 0.5rem; font-weight: 600; color: #fff;">${torreLabel}</td>
                    <td style="padding: 0.6rem 0.5rem; text-align: center; font-weight: 600;">${pisoLabel}</td>
                    <td style="padding: 0.6rem 0.5rem; font-weight: bold; color: var(--accent-color);">${p.propiedad_nombre}</td>
                    <td style="padding: 0.6rem 0.5rem; font-weight: 500; color: #fff;">${p.nombres} ${p.apellidos}</td>
                    <td style="padding: 0.6rem 0.5rem; font-family: monospace;">${p.rut}</td>
                    <td style="padding: 0.6rem 0.5rem;">${contact}</td>
                    <td style="padding: 0.6rem 0.5rem; text-align: center;">${viveLabel}</td>
                    <td style="padding: 0.6rem 0.5rem; font-weight: 600; color: var(--text-secondary);">${p.estacionamiento || '-'}</td>
                    <td style="padding: 0.6rem 0.5rem; color: var(--text-secondary); max-width: 200px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="${p.observaciones_ficha || ''}">${p.observaciones_ficha || '-'}</td>
                    <td style="padding: 0.6rem 0.5rem; text-align: center;">
                        <button type="button" class="btn-icon" onclick="navigateToResidentProfileFromReport(${p.propiedad_id})" title="Ver Ficha de Residentes Completa" style="padding: 0.25rem; min-width: auto; background: none; border: none;">
                            <i data-lucide="eye" style="width: 14px; height: 14px; color: var(--accent-color);"></i>
                        </button>
                    </td>
                `;
                tbody.appendChild(tr);
            });
        }

        function navigateToResidentProfileFromReport(unitId) {
            if (unitId) {
                residentePropiedadLocked = true;
                switchView('residentes');
                const selectProp = document.getElementById('residente-propiedad-id');
                if (selectProp) {
                    selectProp.value = unitId;
                    residentePropiedadChanged();
                }
            }
        }

        function navigateToResidentProfileFromBadge(unitId) {
            if (unitId) {
                residentePropiedadLocked = true;
                switchView('residentes');
                const selectProp = document.getElementById('residente-propiedad-id');
                if (selectProp) {
                    selectProp.value = unitId;
                    residentePropiedadChanged();
                }
            }
        }

        // ================= BÚSQUEDA GLOBAL DE RESIDENTES =================
        let searchResidentTimeout = null;

        function searchResidentGlobalChanged() {
            const query = document.getElementById('search-resident-global').value.trim();
            const resultsDiv = document.getElementById('search-resident-results');
            if (!resultsDiv) return;
            
            if (searchResidentTimeout) clearTimeout(searchResidentTimeout);
            
            if (query.length < 2) {
                resultsDiv.style.display = 'none';
                resultsDiv.innerHTML = '';
                return;
            }

            searchResidentTimeout = setTimeout(() => {
                fetch(`api.php?action=search_residentes&query=${encodeURIComponent(query)}`)
                    .then(res => res.json())
                    .then(response => {
                        if (response.success && response.data.length > 0) {
                            resultsDiv.innerHTML = '';
                            response.data.forEach(item => {
                                const row = document.createElement('div');
                                row.style.padding = '0.75rem';
                                row.style.borderBottom = '1px solid var(--border-color)';
                                row.style.cursor = 'pointer';
                                row.style.transition = 'background 0.2s';
                                row.style.display = 'flex';
                                row.style.flexDirection = 'column';
                                row.style.gap = '0.25rem';
                                
                                row.onmouseenter = () => row.style.background = 'rgba(255,255,255,0.05)';
                                row.onmouseleave = () => row.style.background = 'transparent';
                                row.onclick = () => selectResidentSearchResult(item.propiedad_id);

                                row.innerHTML = `
                                    <span style="font-weight: 600; color: #fff; font-size: 0.85rem;">${item.nombres} ${item.apellidos}</span>
                                    <div style="display: flex; justify-content: space-between; font-size: 0.75rem; color: var(--text-secondary);">
                                        <span>Unidad: <strong style="color: var(--accent-color);">${item.propiedad_nombre}</strong></span>
                                        <span>Estac: <strong>${item.estacionamiento || '-'}</strong></span>
                                    </div>
                                `;
                                resultsDiv.appendChild(row);
                            });
                            resultsDiv.style.display = 'block';
                        } else {
                            resultsDiv.innerHTML = '<div style="padding: 0.75rem; text-align: center; color: var(--text-muted); font-size: 0.8rem;">No se encontraron residentes.</div>';
                            resultsDiv.style.display = 'block';
                        }
                    })
                    .catch(() => {
                        resultsDiv.innerHTML = '<div style="padding: 0.75rem; text-align: center; color: var(--danger); font-size: 0.8rem;">Error al buscar.</div>';
                        resultsDiv.style.display = 'block';
                    });
            }, 300);
        }

        function selectResidentSearchResult(propId) {
            const resultsDiv = document.getElementById('search-resident-results');
            if (resultsDiv) {
                resultsDiv.style.display = 'none';
                resultsDiv.innerHTML = '';
            }
            const globalSearch = document.getElementById('search-resident-global');
            if (globalSearch) globalSearch.value = '';

            // Bloquear selección y cargar ficha
            residentePropiedadLocked = true;
            const selectProp = document.getElementById('residente-propiedad-id');
            if (selectProp) {
                selectProp.value = propId;
                residentePropiedadChanged();
            }
        }

        // Cerrar resultados al hacer clic fuera del buscador
        document.addEventListener('click', function(e) {
            const resultsDiv = document.getElementById('search-resident-results');
            const searchInput = document.getElementById('search-resident-global');
            if (resultsDiv && searchInput && !resultsDiv.contains(e.target) && e.target !== searchInput) {
                resultsDiv.style.display = 'none';
            }
        });

        // ================= MÓDULO GASTOS COMUNES =================
        let gcDiaVencimientoDefault = 10;
        let gcInteresMoraDefault = 2.00;

        function loadGastoComunView() {
            // Cargar configuración de mora
            fetch('api.php?action=get_condominio_profile')
                .then(res => res.json())
                .then(response => {
                    if (response.success && response.data.condominio) {
                        const condo = response.data.condominio;
                        gcDiaVencimientoDefault = parseInt(condo.gasto_comun_dia_vencimiento ?? 10);
                        gcInteresMoraDefault = parseFloat(condo.gasto_comun_interes_mora ?? 2.00);

                        document.getElementById('gc-config-dia-vencimiento').value = gcDiaVencimientoDefault;
                        document.getElementById('gc-config-interes-mora').value = gcInteresMoraDefault;
                    }
                });

            switchGCTab('periodos');
        }

        function switchGCTab(tab) {
            // Desactivar todos los botones
            document.querySelectorAll('#view-gasto_comun-container .btn-secondary').forEach(btn => {
                btn.style.borderBottom = '2px solid transparent';
                btn.style.color = 'var(--text-secondary)';
            });

            // Ocultar todos los paneles
            document.getElementById('gc-tab-periodos').style.display = 'none';
            document.getElementById('gc-tab-config').style.display = 'none';
            document.getElementById('gc-tab-egresos').style.display = 'none';
            document.getElementById('gc-tab-arriendo').style.display = 'none';
            document.getElementById('gc-period-details').style.display = 'none';

            // Activar botón seleccionado
            const activeBtn = document.getElementById(`tab-btn-gc-${tab}`);
            if (activeBtn) {
                activeBtn.style.borderBottom = '2px solid var(--accent-color)';
                activeBtn.style.color = '#fff';
            }

            // Mostrar panel seleccionado
            const activeTab = document.getElementById(`gc-tab-${tab}`);
            if (activeTab) {
                activeTab.style.display = 'block';
            }

            // Llamar cargador específico y repintar iconos Lucide
            if (tab === 'periodos') {
                loadGCPeriods();
            } else if (tab === 'egresos') {
                loadEgresos();
            } else if (tab === 'arriendo') {
                loadArriendoTab();
            }
            if (window.lucide) {
                lucide.createIcons();
            }
        }

        function saveGCConfig() {
            const dia = parseInt(document.getElementById('gc-config-dia-vencimiento').value);
            const interes = parseFloat(document.getElementById('gc-config-interes-mora').value);

            if (isNaN(dia) || dia < 1 || dia > 28) {
                showToast('Día de vencimiento inválido (debe estar entre 1 y 28).', 'warning');
                return;
            }
            if (isNaN(interes) || interes < 0) {
                showToast('Tasa de interés de mora inválida.', 'warning');
                return;
            }

            const formData = new FormData();
            formData.append('dia_vencimiento', dia);
            formData.append('interes_mora', interes);

            fetch('api.php?action=save_gasto_comun_config', {
                method: 'POST',
                body: formData
            })
            .then(res => res.json())
            .then(response => {
                if (response.success) {
                    showToast(response.message, 'success');
                    gcDiaVencimientoDefault = dia;
                    gcInteresMoraDefault = interes;
                } else {
                    showToast(response.message, 'error');
                }
            })
            .catch(() => showToast('Error al guardar configuración de gastos comunes.', 'error'));
        }

        // ================= MÓDULO INGRESOS POR ARRIENDO =================
        let arriendoCurrentDate = new Date();
        let arriendoGlobalAreas = [];
        let arriendoGlobalList = [];
        let arriendoAllPropiedades = [];

        function loadArriendoTab() {
            // Cargar áreas comunes
            const pAreas = fetch('api.php?action=get_areas_comunes').then(res => res.json());
            
            // Cargar arriendos
            const pArriendos = fetch('api.php?action=get_arriendos').then(res => res.json());
            
            // Cargar propiedades
            let pPropiedades;
            if (arriendoAllPropiedades.length === 0) {
                pPropiedades = fetch('api.php?action=get_propiedades').then(res => res.json());
            } else {
                pPropiedades = Promise.resolve({success: true, data: arriendoAllPropiedades});
            }

            Promise.all([pAreas, pArriendos, pPropiedades])
                .then(([resAreas, resArriendos, resProps]) => {
                    if (resAreas.success) {
                        arriendoGlobalAreas = resAreas.data;
                        renderAreasComunesLegend();
                    }
                    if (resArriendos.success) {
                        arriendoGlobalList = resArriendos.data;
                        renderArriendosTable();
                    }
                    if (resProps.success) {
                        arriendoAllPropiedades = resProps.data;
                    }
                    renderArriendoCalendar();

                    fetch('api.php?action=get_gasto_comun_periods')
                        .then(res => res.json())
                        .then(resPeriods => {
                            let activePeriodMonth = '';
                            if (resPeriods.success && resPeriods.data && resPeriods.data.length > 0) {
                                const activePeriod = resPeriods.data.find(p => p.estado === 'borrador') || resPeriods.data[0];
                                activePeriodMonth = activePeriod.mes;
                            }
                            updateArriendosTotalMonto(activePeriodMonth);
                        });
                })
                .catch(() => showToast('Error al cargar datos de arriendo.', 'error'));
        }

        function changeArriendoCalendarMonth(direction) {
            arriendoCurrentDate.setMonth(arriendoCurrentDate.getMonth() + direction);
            renderArriendoCalendar();
        }

        function renderAreasComunesLegend() {
            const legend = document.getElementById('arriendo-areas-legend');
            if (!legend) return;
            legend.innerHTML = '';
            arriendoGlobalAreas.forEach(a => {
                const item = document.createElement('div');
                item.style.display = 'flex';
                item.style.alignItems = 'center';
                item.style.gap = '0.25rem';
                item.innerHTML = `
                    <span style="width: 10px; height: 10px; border-radius: 50%; background: ${a.color}; display: inline-block;"></span>
                    <span>${a.nombre}</span>
                `;
                legend.appendChild(item);
            });
        }

        function renderArriendoCalendar() {
            const grid = document.getElementById('arriendo-calendar-grid');
            const titleEl = document.getElementById('arriendo-calendar-month-title');
            if (!grid || !titleEl) return;

            const year = arriendoCurrentDate.getFullYear();
            const month = arriendoCurrentDate.getMonth();

            const monthNames = [
                "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
                "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
            ];
            titleEl.innerText = `${monthNames[month]} ${year}`;

            // First day of month
            const firstDay = new Date(year, month, 1);
            let startDayOfWeek = firstDay.getDay(); 
            startDayOfWeek = startDayOfWeek === 0 ? 6 : startDayOfWeek - 1;

            // Days in month
            const daysInMonth = new Date(year, month + 1, 0).getDate();

            // Days in previous month (for padding)
            const daysInPrevMonth = new Date(year, month, 0).getDate();

            grid.innerHTML = '';

            // Previous month padding days
            for (let i = startDayOfWeek - 1; i >= 0; i--) {
                const dayNum = daysInPrevMonth - i;
                const cell = document.createElement('div');
                cell.style.background = 'rgba(255, 255, 255, 0.01)';
                cell.style.padding = '0.5rem';
                cell.style.minHeight = '90px';
                cell.style.opacity = '0.3';
                cell.style.borderRight = '1px solid var(--border-color)';
                cell.style.borderBottom = '1px solid var(--border-color)';
                cell.innerHTML = `<span style="font-size: 0.75rem; color: var(--text-muted); font-weight: 500;">${dayNum}</span>`;
                grid.appendChild(cell);
            }

            // Current month days
            const today = new Date();
            for (let day = 1; day <= daysInMonth; day++) {
                const cell = document.createElement('div');
                const isToday = today.getDate() === day && today.getMonth() === month && today.getFullYear() === year;

                cell.style.background = isToday ? 'rgba(var(--accent-rgb), 0.08)' : 'rgba(255, 255, 255, 0.03)';
                cell.style.padding = '0.5rem';
                cell.style.minHeight = '100px';
                cell.style.borderRight = '1px solid var(--border-color)';
                cell.style.borderBottom = '1px solid var(--border-color)';
                cell.style.display = 'flex';
                cell.style.flexDirection = 'column';
                cell.style.justifyContent = 'space-between';
                cell.style.position = 'relative';
                cell.style.cursor = 'pointer';
                cell.style.transition = 'background 0.2s';
                
                cell.onmouseover = () => { cell.style.background = 'rgba(255, 255, 255, 0.06)'; };
                cell.onmouseout = () => { cell.style.background = isToday ? 'rgba(var(--accent-rgb), 0.08)' : 'rgba(255, 255, 255, 0.03)'; };

                const pad = (n) => n < 10 ? '0' + n : n;
                const dateStr = `${year}-${pad(month+1)}-${pad(day)}`;
                cell.onclick = (e) => {
                    if (e.target.classList.contains('arriendo-badge') || e.target.closest('.arriendo-badge')) return;
                    openNuevaReservaModal(dateStr);
                };

                const dayHeader = document.createElement('div');
                dayHeader.style.display = 'flex';
                dayHeader.style.justifyContent = 'space-between';
                dayHeader.style.alignItems = 'center';
                
                const dayLabel = document.createElement('span');
                dayLabel.innerText = day;
                dayLabel.style.fontSize = '0.8rem';
                dayLabel.style.fontWeight = isToday ? 'bold' : 'normal';
                dayLabel.style.color = isToday ? 'var(--accent-color)' : '#fff';
                
                dayHeader.appendChild(dayLabel);
                
                if (isToday) {
                    const todayBadge = document.createElement('span');
                    todayBadge.innerText = 'Hoy';
                    todayBadge.style.fontSize = '0.6rem';
                    todayBadge.style.background = 'var(--accent-color)';
                    todayBadge.style.color = '#000';
                    todayBadge.style.padding = '1px 4px';
                    todayBadge.style.borderRadius = '4px';
                    todayBadge.style.fontWeight = 'bold';
                    dayHeader.appendChild(todayBadge);
                }
                
                cell.appendChild(dayHeader);

                // Find bookings for this day
                const dayBookingsContainer = document.createElement('div');
                dayBookingsContainer.style.marginTop = '0.25rem';
                dayBookingsContainer.style.flex = '1';
                dayBookingsContainer.style.display = 'flex';
                dayBookingsContainer.style.flexDirection = 'column';
                dayBookingsContainer.style.gap = '2px';
                
                const dayBookings = arriendoGlobalList.filter(b => b.fecha === dateStr);
                dayBookings.forEach(b => {
                    const badge = document.createElement('div');
                    badge.className = 'arriendo-badge';
                    badge.style.background = b.area_color || '#3b82f6';
                    badge.style.color = '#fff';
                    badge.style.fontSize = '0.65rem';
                    badge.style.padding = '2px 4px';
                    badge.style.borderRadius = '4px';
                    badge.style.fontWeight = '600';
                    badge.style.whiteSpace = 'nowrap';
                    badge.style.overflow = 'hidden';
                    badge.style.textOverflow = 'ellipsis';
                    badge.style.cursor = 'pointer';
                    badge.style.display = 'flex';
                    badge.style.justifyContent = 'space-between';
                    badge.innerHTML = `<span>${b.hora_inicio.substring(0,5)} ${b.area_nombre}</span> <span style="opacity:0.8; font-size:0.6rem;">${b.propiedad_identificador}</span>`;
                    
                    badge.title = `${b.area_nombre} - ${b.propiedad_identificador}\nFecha: ${b.fecha}\nHora: ${b.hora_inicio.substring(0,5)} - ${b.hora_fin.substring(0,5)}\nCosto: $${formatNumber(b.monto_pagado)}\nNotas: ${b.observaciones || 'Sin notas'}`;
                    
                    badge.onclick = (e) => {
                        e.stopPropagation();
                        editArriendo(b);
                    };
                    dayBookingsContainer.appendChild(badge);
                });
                
                cell.appendChild(dayBookingsContainer);
                grid.appendChild(cell);
            }

            // Next month padding days to complete grid
            const totalCells = startDayOfWeek + daysInMonth;
            const remainingCells = (7 - (totalCells % 7)) % 7;
            for (let i = 1; i <= remainingCells; i++) {
                const cell = document.createElement('div');
                cell.style.background = 'rgba(255, 255, 255, 0.01)';
                cell.style.padding = '0.5rem';
                cell.style.minHeight = '90px';
                cell.style.opacity = '0.3';
                cell.style.borderRight = '1px solid var(--border-color)';
                cell.style.borderBottom = '1px solid var(--border-color)';
                cell.innerHTML = `<span style="font-size: 0.75rem; color: var(--text-muted); font-weight: 500;">${i}</span>`;
                grid.appendChild(cell);
            }
        }

        function renderArriendosTable() {
            const tbody = document.getElementById('tbody-arriendos-list');
            if (!tbody) return;
            tbody.innerHTML = '';

            if (arriendoGlobalList.length === 0) {
                tbody.innerHTML = '<tr><td colspan="8" style="text-align: center; color: var(--text-muted); padding: 1.5rem;">No hay arriendos registrados.</td></tr>';
                return;
            }

            arriendoGlobalList.forEach(b => {
                const tr = document.createElement('tr');
                
                let estadoHTML = '';
                if (b.estado === 'realizado') {
                    estadoHTML = `<span style="color: #10b981; background: rgba(16, 185, 129, 0.1); border: 1px solid rgba(16, 185, 129, 0.2); padding: 0.25rem 0.5rem; border-radius: 4px; font-size: 0.7rem; font-weight: 700; text-transform: uppercase; cursor: pointer; display: inline-block;" onclick="toggleArriendoRealizado(${b.id}, 'pendiente')" title="Click para cambiar a Pendiente">Realizado</span>`;
                } else {
                    estadoHTML = `<button class="btn btn-secondary" onclick="toggleArriendoRealizado(${b.id}, 'realizado')" style="padding: 0.25rem 0.5rem; font-size: 0.7rem; background: rgba(245, 158, 11, 0.05); border: 1px solid rgba(245, 158, 11, 0.2); color: #f59e0b; font-weight: 600; cursor: pointer; border-radius: 4px; min-width: auto; height: auto;">Marcar Realizado</button>`;
                }

                tr.innerHTML = `
                    <td style="padding: 0.65rem 0.5rem; font-weight: 600;">
                        <span style="width: 8px; height: 8px; border-radius: 50%; background: ${b.area_color}; display: inline-block; margin-right: 0.25rem;"></span>
                        ${b.area_nombre}
                    </td>
                    <td style="padding: 0.65rem 0.5rem;">${b.propiedad_identificador}</td>
                    <td style="padding: 0.65rem 0.5rem; text-align: center;">${b.fecha}</td>
                    <td style="padding: 0.65rem 0.5rem; text-align: center;">${b.hora_inicio.substring(0,5)} - ${b.hora_fin.substring(0,5)}</td>
                    <td style="padding: 0.65rem 0.5rem; text-align: right; font-weight: 600;">$${formatNumber(b.monto_pagado)}</td>
                    <td style="padding: 0.65rem 0.5rem; color: var(--text-secondary); max-width: 250px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="${b.observaciones || ''}">${b.observaciones || '-'}</td>
                    <td style="padding: 0.65rem 0.5rem; text-align: center;">${estadoHTML}</td>
                    <td style="padding: 0.65rem 0.5rem; text-align: center;">
                        <div style="display: flex; gap: 0.35rem; justify-content: center;">
                            <button class="btn btn-secondary" onclick="editArriendoById(${b.id})" style="padding: 0.25rem 0.5rem; font-size: 0.75rem;"><i data-lucide="edit-3" style="width:12px; height:12px;"></i></button>
                            <button class="btn btn-secondary" onclick="deleteArriendo(${b.id})" style="padding: 0.25rem 0.5rem; font-size: 0.75rem; color: var(--danger);"><i data-lucide="trash-2" style="width:12px; height:12px;"></i></button>
                        </div>
                    </td>
                `;
                tbody.appendChild(tr);
            });
            if (window.lucide) {
                lucide.createIcons();
            }
        }

        function toggleArriendoRealizado(id, nuevoEstado) {
            const formData = new FormData();
            formData.append('id', id);
            formData.append('estado', nuevoEstado);

            fetch('api.php?action=update_arriendo_estado', {
                method: 'POST',
                body: formData
            })
            .then(res => res.json())
            .then(response => {
                if (response.success) {
                    showToast(`Reserva marcada como ${nuevoEstado === 'realizado' ? 'Realizada' : 'Pendiente'}.`, 'success');
                    loadArriendoTab();
                } else {
                    showToast(response.message, 'error');
                }
            })
            .catch(() => {
                showToast('Error de red al actualizar estado de la reserva.', 'error');
            });
        }

        function updateArriendosTotalMonto(activePeriodMonth = '') {
            if (!activePeriodMonth) {
                const y = arriendoCurrentDate.getFullYear();
                const m = String(arriendoCurrentDate.getMonth() + 1).padStart(2, '0');
                activePeriodMonth = `${y}-${m}`;
            }

            let total = 0;
            arriendoGlobalList.forEach(b => {
                if (b.estado === 'realizado' && b.fecha.substring(0, 7) === activePeriodMonth) {
                    total += parseFloat(b.monto_pagado) || 0;
                }
            });

            const label = document.getElementById('arriendos-total-periodo-container');
            const montoSpan = document.getElementById('arriendos-total-periodo-monto');
            if (montoSpan) {
                montoSpan.textContent = `$${formatNumber(total)}`;
            }
            if (label) {
                label.title = `Total acumulado por arriendos de áreas comunes con estado "Realizado" para el período ${getMonthName(activePeriodMonth)}`;
            }
        }

        // --- Modals Áreas Comunes ---
        function openAreasComunesModal() {
            document.getElementById('modal-areas-comunes').classList.add('active');
            loadAreasComunesList();
        }

        function closeAreasComunesModal() {
            document.getElementById('modal-areas-comunes').classList.remove('active');
            loadArriendoTab();
        }

        function loadAreasComunesList() {
            const listContainer = document.getElementById('areas-comunes-render-list');
            if (!listContainer) return;
            listContainer.innerHTML = '<span style="color: var(--text-muted); font-size: 0.8rem;">Cargando áreas...</span>';

            fetch('api.php?action=get_areas_comunes')
                .then(res => res.json())
                .then(response => {
                    if (response.success) {
                        listContainer.innerHTML = '';
                        if (response.data.length === 0) {
                            listContainer.innerHTML = '<span style="color: var(--text-muted); font-size: 0.8rem;">No hay áreas configuradas para arriendo.</span>';
                            return;
                        }
                        response.data.forEach(a => {
                            const item = document.createElement('div');
                            item.style.display = 'flex';
                            item.style.justifyContent = 'space-between';
                            item.style.alignItems = 'center';
                            item.style.padding = '0.5rem';
                            item.style.background = 'rgba(255,255,255,0.02)';
                            item.style.border = '1px solid var(--border-color)';
                            item.style.borderRadius = '6px';
                            
                            // Safe JSON escape
                            const aJson = JSON.stringify(a).replace(/"/g, '&quot;').replace(/'/g, '&#39;');
                            
                            item.innerHTML = `
                                <div style="display: flex; align-items: center; gap: 0.5rem;">
                                    <span style="width: 12px; height: 12px; border-radius: 4px; background: ${a.color}; display: inline-block;"></span>
                                    <div>
                                        <div style="font-size: 0.8rem; font-weight: 600; color: #fff;">${a.nombre} <span style="font-size: 0.7rem; font-weight: normal; color: var(--text-secondary);">(Capacidad: ${a.capacidad_simultanea || 1})</span></div>
                                        <div style="font-size: 0.7rem; color: var(--text-secondary);">$${formatNumber(a.costo)} - ${a.descripcion || 'Sin descripción'}</div>
                                    </div>
                                </div>
                                <div style="display: flex; gap: 0.25rem;">
                                    <button class="btn btn-secondary" onclick="editAreaComun(${aJson})" style="padding: 0.2rem 0.4rem; font-size: 0.7rem;"><i data-lucide="edit-2" style="width:12px; height:12px;"></i></button>
                                    <button class="btn btn-secondary" onclick="deleteAreaComun(${a.id})" style="padding: 0.2rem 0.4rem; font-size: 0.7rem; color: var(--danger);"><i data-lucide="trash-2" style="width:12px; height:12px;"></i></button>
                                </div>
                            `;
                            listContainer.appendChild(item);
                        });
                        if (window.lucide) {
                            lucide.createIcons();
                        }
                    }
                });
        }

        function submitAreaComunForm(event) {
            event.preventDefault();
            const id = document.getElementById('area-comun-id').value;
            const nombre = document.getElementById('area-comun-nombre').value;
            const descripcion = document.getElementById('area-comun-descripcion').value;
            const costo = document.getElementById('area-comun-costo').value;
            const capacidad = document.getElementById('area-comun-capacidad').value;
            const color = document.getElementById('area-comun-color').value;

            const formData = new FormData();
            if (id) formData.append('id', id);
            formData.append('nombre', nombre);
            formData.append('descripcion', descripcion);
            formData.append('costo', costo);
            formData.append('capacidad_simultanea', capacidad);
            formData.append('color', color);
            formData.append('condicion', 'arriendo');

            fetch('api.php?action=save_area_comun', {
                method: 'POST',
                body: formData
            })
            .then(res => res.json())
            .then(response => {
                if (response.success) {
                    showToast(response.message, 'success');
                    resetAreaComunForm();
                    loadAreasComunesList();
                } else {
                    showToast(response.message, 'error');
                }
            })
            .catch(() => showToast('Error al guardar área común.', 'error'));
        }

        function editAreaComun(a) {
            document.getElementById('area-comun-id').value = a.id;
            document.getElementById('area-comun-nombre').value = a.nombre;
            document.getElementById('area-comun-descripcion').value = a.descripcion || '';
            document.getElementById('area-comun-costo').value = a.costo;
            document.getElementById('area-comun-capacidad').value = a.capacidad_simultanea || 1;
            document.getElementById('area-comun-color').value = a.color;
            document.getElementById('area-comun-form-title').innerText = 'Editar Área Común';
            document.getElementById('btn-save-area-comun').innerText = 'Actualizar Área Común';
        }

        function resetAreaComunForm() {
            document.getElementById('area-comun-id').value = '';
            document.getElementById('form-area-comun').reset();
            document.getElementById('area-comun-capacidad').value = 1;
            document.getElementById('area-comun-color').value = '#3b82f6';
            document.getElementById('area-comun-form-title').innerText = 'Nueva Área Común';
            document.getElementById('btn-save-area-comun').innerText = 'Guardar Área Común';
        }

        function deleteAreaComun(id) {
            if (!confirm('¿Está seguro de que desea eliminar esta área común? Se eliminarán todas sus reservas asociadas.')) return;
            const formData = new FormData();
            formData.append('id', id);

            fetch('api.php?action=delete_area_comun', {
                method: 'POST',
                body: formData
            })
            .then(res => res.json())
            .then(response => {
                if (response.success) {
                    showToast(response.message, 'success');
                    loadAreasComunesList();
                } else {
                    showToast(response.message, 'error');
                }
            });
        }

        // --- Modals Reserva / Arriendo ---
        function openNuevaReservaModal(preselectedDate = null) {
            const selectArea = document.getElementById('arriendo-area-id');
            const selectProp = document.getElementById('arriendo-propiedad-id');
            
            if (selectArea) {
                selectArea.innerHTML = '<option value="">Seleccione área común...</option>';
                arriendoGlobalAreas.forEach(a => {
                    selectArea.innerHTML += `<option value="${a.id}">${a.nombre} ($${formatNumber(a.costo)})</option>`;
                });
            }

            if (selectProp) {
                selectProp.innerHTML = '<option value="">Seleccione unidad...</option>';
                const sortedProps = [...arriendoAllPropiedades].sort((a, b) => a.identificador.localeCompare(b.identificador));
                sortedProps.forEach(p => {
                    selectProp.innerHTML += `<option value="${p.id}">${p.identificador}</option>`;
                });
            }

            document.getElementById('arriendo-id').value = '';
            document.getElementById('form-arriendo-reserva').reset();
            document.getElementById('arriendo-conflict-hint').style.display = 'none';
            document.getElementById('arriendo-reserva-title').innerText = 'Registrar Arriendo de Área Común';
            document.getElementById('btn-save-arriendo').innerText = 'Confirmar Reserva';

            if (preselectedDate) {
                document.getElementById('arriendo-fecha').value = preselectedDate;
            } else {
                const today = new Date().toISOString().substring(0, 10);
                document.getElementById('arriendo-fecha').value = today;
            }

            document.getElementById('modal-arriendo-reserva').classList.add('active');
        }

        function closeArriendoReservaModal() {
            document.getElementById('modal-arriendo-reserva').classList.remove('active');
        }

        function onSelectArriendoArea() {
            const areaId = parseInt(document.getElementById('arriendo-area-id').value);
            if (!areaId) return;
            const area = arriendoGlobalAreas.find(a => a.id === areaId);
            if (area) {
                document.getElementById('arriendo-monto').value = area.costo;
            }
            checkTimeConflictHint();
        }

        function checkTimeConflictHint() {
            const id = parseInt(document.getElementById('arriendo-id').value) || 0;
            const areaId = parseInt(document.getElementById('arriendo-area-id').value);
            const fecha = document.getElementById('arriendo-fecha').value;
            const horaInicio = document.getElementById('arriendo-hora-inicio').value;
            const horaFin = document.getElementById('arriendo-hora-fin').value;
            const hint = document.getElementById('arriendo-conflict-hint');

            if (!hint) return;
            hint.style.display = 'none';

            if (!areaId || !fecha || !horaInicio || !horaFin) return;

            const conflict = arriendoGlobalList.some(b => {
                if (b.id === id) return false;
                if (parseInt(b.area_comun_id) !== areaId) return false;
                if (b.fecha !== fecha) return false;
                return (horaInicio < b.hora_fin && horaFin > b.hora_inicio);
            });

            if (conflict) {
                hint.style.display = 'block';
            }
        }

        function submitArriendoReservaForm(event) {
            event.preventDefault();
            const id = document.getElementById('arriendo-id').value;
            const areaId = document.getElementById('arriendo-area-id').value;
            const propiedadId = document.getElementById('arriendo-propiedad-id').value;
            const fecha = document.getElementById('arriendo-fecha').value;
            const horaInicio = document.getElementById('arriendo-hora-inicio').value;
            const horaFin = document.getElementById('arriendo-hora-fin').value;
            const monto = document.getElementById('arriendo-monto').value;
            const observaciones = document.getElementById('arriendo-observaciones').value;

            if (horaInicio >= horaFin) {
                showToast('La hora de inicio debe ser menor que la hora de fin.', 'warning');
                return;
            }

            const formData = new FormData();
            if (id) formData.append('id', id);
            formData.append('area_comun_id', areaId);
            formData.append('propiedad_id', propiedadId);
            formData.append('fecha', fecha);
            formData.append('hora_inicio', horaInicio);
            formData.append('hora_fin', horaFin);
            formData.append('monto_pagado', monto);
            formData.append('observaciones', observaciones);

            fetch('api.php?action=save_arriendo', {
                method: 'POST',
                body: formData
            })
            .then(res => res.json())
            .then(response => {
                if (response.success) {
                    showToast(response.message, 'success');
                    closeArriendoReservaModal();
                    loadArriendoTab();
                } else {
                    showToast(response.message, 'error');
                }
            })
            .catch(() => showToast('Error al registrar reserva de arriendo.', 'error'));
        }

        function editArriendoById(id) {
            const b = arriendoGlobalList.find(x => x.id === id);
            if (b) editArriendo(b);
        }

        function editArriendo(b) {
            openNuevaReservaModal();
            document.getElementById('arriendo-id').value = b.id;
            document.getElementById('arriendo-area-id').value = b.area_comun_id;
            document.getElementById('arriendo-propiedad-id').value = b.propiedad_id;
            document.getElementById('arriendo-fecha').value = b.fecha;
            document.getElementById('arriendo-hora-inicio').value = b.hora_inicio.substring(0, 5);
            document.getElementById('arriendo-hora-fin').value = b.hora_fin.substring(0, 5);
            document.getElementById('arriendo-monto').value = b.monto_pagado;
            document.getElementById('arriendo-observaciones').value = b.observaciones || '';

            document.getElementById('arriendo-reserva-title').innerText = 'Editar Reserva de Área Común';
            document.getElementById('btn-save-arriendo').innerText = 'Actualizar Reserva';
            
            checkTimeConflictHint();
        }

        function deleteArriendo(id) {
            if (!confirm('¿Está seguro de que desea eliminar esta reserva de arriendo?')) return;
            const formData = new FormData();
            formData.append('id', id);

            fetch('api.php?action=delete_arriendo', {
                method: 'POST',
                body: formData
            })
            .then(res => res.json())
            .then(response => {
                if (response.success) {
                    showToast(response.message, 'success');
                    loadArriendoTab();
                } else {
                    showToast(response.message, 'error');
                }
            });
        }

        function loadGCPeriods() {
            const tbody = document.getElementById('tbody-gc-periodos');
            if (!tbody) return;
            tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; color: var(--text-muted); padding: 1.5rem;">Cargando períodos facturados...</td></tr>';

            fetch('api.php?action=get_gasto_comun_periods')
                .then(res => res.json())
                .then(response => {
                    if (response.success) {
                        tbody.innerHTML = '';
                        if (response.data.length === 0) {
                            tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; color: var(--text-muted); padding: 1.5rem;">No se han generado períodos de facturación.</td></tr>';
                            return;
                        }

                        response.data.forEach(p => {
                            const tr = document.createElement('tr');
                            const estadoBadge = p.estado === 'emitido' 
                                ? '<span style="background: rgba(16, 185, 129, 0.1); color: #10b981; padding: 0.15rem 0.5rem; border-radius: 6px; font-size: 0.75rem; font-weight: bold;">Emitido</span>' 
                                : '<span style="background: rgba(245, 158, 11, 0.1); color: #f59e0b; padding: 0.15rem 0.5rem; border-radius: 6px; font-size: 0.75rem; font-weight: bold;">Borrador</span>';

                            tr.innerHTML = `
                                <td style="padding: 0.6rem 0.5rem; font-weight: 600; color: #fff;">${getMonthName(p.mes)}</td>
                                <td style="padding: 0.6rem 0.5rem;">${formatDisplayDate(p.fecha_emision)}</td>
                                <td style="padding: 0.6rem 0.5rem; font-weight: 500;">${formatDisplayDate(p.fecha_tope)}</td>
                                <td style="padding: 0.6rem 0.5rem; text-align: center;">${p.interes_mora}%</td>
                                <td style="padding: 0.6rem 0.5rem; text-align: center;">${estadoBadge}</td>
                                <td style="padding: 0.6rem 0.5rem; text-align: center;">
                                    <button class="btn btn-secondary" onclick="viewPeriodBoletas(${p.id})" style="font-size: 0.75rem; padding: 0.25rem 0.6rem; height: auto;">
                                        <i data-lucide="eye" style="width:12px; height:12px; margin-right: 0.25rem;"></i> Ver Boletas
                                    </button>
                                </td>
                            `;
                            tbody.appendChild(tr);
                        });
                        lucide.createIcons();
                    } else {
                        tbody.innerHTML = `<tr><td colspan="6" style="text-align: center; color: var(--danger); padding: 1.5rem;">${response.message}</td></tr>`;
                    }
                })
                .catch(() => {
                    tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; color: var(--danger); padding: 1.5rem;">Error de conexión.</td></tr>';
                });
        }

        function openGeneratePeriodModal() {
            // Sugerir mes actual
            const today = new Date();
            const year = today.getFullYear();
            const month = String(today.getMonth() + 1).padStart(2, '0');
            
            document.getElementById('gc-gen-mes').value = `${year}-${month}`;
            document.getElementById('gc-gen-fecha-emision').value = today.toISOString().split('T')[0];
            
            // Sugerir vencimiento basado en config
            const nextMonth = new Date(year, today.getMonth(), gcDiaVencimientoDefault);
            document.getElementById('gc-gen-fecha-tope').value = nextMonth.toISOString().split('T')[0];

            document.getElementById('modal-generate-period').classList.add('active');
        }

        function gcPeriodMonthChanged() {
            const inputMes = document.getElementById('gc-gen-mes').value;
            if (!inputMes) return;
            const parts = inputMes.split('-');
            const year = parseInt(parts[0]);
            const month = parseInt(parts[1]) - 1; // 0-indexed
            
            const nextMonth = new Date(year, month, gcDiaVencimientoDefault);
            document.getElementById('gc-gen-fecha-tope').value = nextMonth.toISOString().split('T')[0];
        }

        function closeGeneratePeriodModal() {
            document.getElementById('modal-generate-period').classList.remove('active');
        }

        function submitGeneratePeriodForm() {
            const mes = document.getElementById('gc-gen-mes').value;
            const emision = document.getElementById('gc-gen-fecha-emision').value;
            const tope = document.getElementById('gc-gen-fecha-tope').value;

            if (!mes || !emision || !tope) {
                showToast('Todos los campos son requeridos.', 'warning');
                return;
            }

            const formData = new FormData();
            formData.append('mes', mes);
            formData.append('fecha_emision', emision);
            formData.append('fecha_tope', tope);

            fetch('api.php?action=generate_gasto_comun_period', {
                method: 'POST',
                body: formData
            })
            .then(res => res.json())
            .then(response => {
                if (response.success) {
                    showToast(response.message, 'success');
                    closeGeneratePeriodModal();
                    loadGCPeriods();
                } else {
                    showToast(response.message, 'error');
                }
            })
            .catch(() => showToast('Error al generar la facturación de gastos comunes.', 'error'));
        }

        let currentPeriodId = null;

        function viewPeriodBoletas(periodId) {
            currentPeriodId = periodId;
            document.getElementById('gc-tab-periodos').style.display = 'none';
            const detailsDiv = document.getElementById('gc-period-details');
            detailsDiv.style.display = 'block';

            const tbody = document.getElementById('tbody-gc-boletas');
            tbody.innerHTML = '<tr><td colspan="11" style="text-align: center; color: var(--text-muted); padding: 2rem;">Cargando boletas del período...</td></tr>';

            const publishBtn = document.getElementById('btn-gc-publish-period');
            publishBtn.style.display = 'none';

            fetch(`api.php?action=get_period_boletas&periodo_id=${periodId}`)
                .then(res => res.json())
                .then(response => {
                    if (response.success) {
                        const period = response.data.periodo;
                        const isBorrador = period.estado === 'borrador';
                        
                        document.getElementById('gc-details-title').innerText = `Facturación de Gastos Comunes: ${getMonthName(period.mes)}`;
                        document.getElementById('gc-details-subtitle').innerText = `Emisión: ${formatDisplayDate(period.fecha_emision)} | Vence: ${formatDisplayDate(period.fecha_tope)} (Mora: ${period.interes_mora}%)`;

                        if (isBorrador) {
                            publishBtn.style.display = 'flex';
                        }

                        tbody.innerHTML = '';
                        response.data.boletas.forEach(b => {
                            const tr = document.createElement('tr');
                            
                            // Badges estado
                            let estadoHTML = '';
                            if (isBorrador) {
                                estadoHTML = `<span style="background: rgba(245, 158, 11, 0.15); color: #f59e0b; padding: 0.15rem 0.5rem; border-radius: 6px; font-size: 0.7rem; font-weight: bold;">PREVISTA (BORRADOR)</span>`;
                            } else if (b.estado === 'pagado') {
                                estadoHTML = `<span style="background: rgba(16, 185, 129, 0.1); color: #10b981; padding: 0.15rem 0.5rem; border-radius: 6px; font-size: 0.7rem; font-weight: bold;">PAGADO</span>`;
                            } else if (b.vencido) {
                                estadoHTML = `<span style="background: rgba(239, 68, 68, 0.1); color: #ef4444; padding: 0.15rem 0.5rem; border-radius: 6px; font-size: 0.7rem; font-weight: bold;">VENCIDO</span>`;
                            } else {
                                estadoHTML = `<span style="background: rgba(245, 158, 11, 0.1); color: #f59e0b; padding: 0.15rem 0.5rem; border-radius: 6px; font-size: 0.7rem; font-weight: bold;">PENDIENTE</span>`;
                            }

                            // Botón de pago (solo visible si no es borrador y está pendiente)
                            const payBtn = (!isBorrador && b.estado === 'pendiente') 
                                ? `<button class="btn-icon text-success" onclick="registerGCPayment(${b.id}, ${periodId})" title="Registrar Pago" style="padding: 0.2rem; min-width: auto; background: none; border: none;"><i data-lucide="check" style="width: 14px; height: 14px; color: #10b981;"></i></button>`
                                : '';

                            const torreLabel = b.torre_nombre || 'Ninguna / Casa';
                            const propietarioLabel = b.propietario_nombre || 'Sin Asignar';

                            tr.innerHTML = `
                                <td style="padding: 0.6rem 0.5rem; font-weight: 600; color: #fff;">${torreLabel}</td>
                                <td style="padding: 0.6rem 0.5rem; text-align: center;">${b.propiedad_piso || '-'}</td>
                                <td style="padding: 0.6rem 0.5rem; font-weight: bold; color: var(--accent-color);">${b.propiedad_nombre}</td>
                                <td style="padding: 0.6rem 0.5rem; font-weight: 500; color: #fff;">${propietarioLabel}</td>
                                <td style="padding: 0.6rem 0.5rem; text-align: right;">$${formatNumber(b.monto_comun)}</td>
                                <td style="padding: 0.6rem 0.5rem; text-align: right;">$${formatNumber(b.monto_torre)}</td>
                                <td style="padding: 0.6rem 0.5rem; text-align: right;">$${formatNumber(b.monto_unidad)}</td>
                                <td style="padding: 0.6rem 0.5rem; text-align: right; color: var(--danger); font-weight: 500;">$${formatNumber(b.monto_mora)}</td>
                                <td style="padding: 0.6rem 0.5rem; text-align: right; font-weight: bold; color: #fff;">$${formatNumber(b.monto_total)}</td>
                                <td style="padding: 0.6rem 0.5rem; text-align: center;">${estadoHTML}</td>
                                <td style="padding: 0.6rem 0.5rem; text-align: center;">
                                    <div style="display: flex; gap: 0.35rem; justify-content: center; align-items: center;">
                                        <button class="btn-icon text-accent" onclick="viewGCRecibo(${b.id})" title="Ver Recibo Gasto Común" style="padding: 0.2rem; min-width: auto; background: none; border: none;">
                                            <i data-lucide="file-text" style="width: 14px; height: 14px; color: var(--accent-color);"></i>
                                        </button>
                                        ${payBtn}
                                    </div>
                                </td>
                            `;
                            tbody.appendChild(tr);
                        });
                        lucide.createIcons();
                    } else {
                        tbody.innerHTML = `<tr><td colspan="11" style="text-align: center; color: var(--danger); padding: 2rem;">${response.message}</td></tr>`;
                    }
                })
                .catch(() => {
                    tbody.innerHTML = '<tr><td colspan="11" style="text-align: center; color: var(--danger); padding: 2rem;">Error de conexión con el servidor.</td></tr>';
                });
        }

        function backToPeriodList() {
            document.getElementById('gc-period-details').style.display = 'none';
            document.getElementById('gc-tab-periodos').style.display = 'block';
            switchGCTab('periodos');
        }

        function registerGCPayment(boletaId, periodId) {
            if (!confirm('¿Está seguro de registrar el pago de esta boleta? Se tomará la fecha actual como fecha de pago.')) {
                return;
            }

            const formData = new FormData();
            formData.append('boleta_id', boletaId);

            fetch('api.php?action=pay_boleta', {
                method: 'POST',
                body: formData
            })
            .then(res => res.json())
            .then(response => {
                if (response.success) {
                    showToast(response.message, 'success');
                    viewPeriodBoletas(periodId);
                } else {
                    showToast(response.message, 'error');
                }
            })
            .catch(() => showToast('Error al procesar el pago de la boleta.', 'error'));
        }

        function viewGCRecibo(boletaId) {
            fetch(`api.php?action=get_boleta_detalle&boleta_id=${boletaId}`)
                .then(res => res.json())
                .then(response => {
                    if (!response.success) {
                        showToast(response.message, 'error');
                        return;
                    }

                    const data = response.data;
                    const boleta = data.boleta;
                    const period = data.periodo;
                    const condo = data.condominio || {};
                    const prop = data.propiedad;
                    const owner = data.propietario;
                    const globales = data.egresos_globales || [];
                    const torre = data.egresos_torre || [];
                    const unidad = data.egresos_unidad || [];

                    // Renderizar
                    const printArea = document.getElementById('gc-recibo-print-area');
                    
                    let html = `
                        <!-- Cabecera -->
                        <div style="display: flex; justify-content: space-between; border-bottom: 2px solid #333; padding-bottom: 1rem; margin-bottom: 1.5rem; align-items: flex-start; color: #333;">
                            <div>
                                <h1 style="font-size: 1.4rem; font-weight: bold; margin: 0; color: #000;">${condo.nombre || 'Condominio'}</h1>
                                <p style="margin: 0.15rem 0 0 0; font-size: 0.8rem; color: #666;">${condo.direccion || 'Dirección no configurada'}</p>
                                <p style="margin: 0.15rem 0 0 0; font-size: 0.8rem; color: #666;">RUT: ${condo.rut || '-'}</p>
                                \${condo.email ? \`<p style="margin: 0.15rem 0 0 0; font-size: 0.8rem; color: #666;">Contacto: \${condo.email} | \${condo.telefono || ''}</p>\` : ''}
                            </div>
                            <div style="text-align: right;">
                                <div style="background: #f0f0f0; padding: 0.4rem 1rem; border-radius: 6px; font-weight: bold; font-size: 0.95rem; color: #000; text-transform: uppercase;">
                                    Recibo Gasto Común
                                </div>
                                <p style="margin: 0.4rem 0 0 0; font-size: 0.85rem; font-weight: 600;">Mes: \${getMonthName(period.mes)}</p>
                            </div>
                        </div>

                        <!-- Grid de Metadatos -->
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; margin-bottom: 1.5rem; color: #333; font-size: 0.85rem;">
                            <!-- Datos Unidad -->
                            <div style="border: 1px solid #ddd; padding: 0.75rem; border-radius: 6px; background: #fafafa;">
                                <h4 style="margin: 0 0 0.5rem 0; font-size: 0.9rem; font-weight: bold; border-bottom: 1px solid #ddd; padding-bottom: 0.25rem; color: #000;">Identificación de la Unidad</h4>
                                <table style="width: 100%; border: none; margin: 0;">
                                    <tr style="border: none;"><td style="padding: 0.2rem 0; font-weight: 600; width: 100px; border: none;">Unidad:</td><td style="padding: 0.2rem 0; border: none;">\${prop.identificador}</td></tr>
                                    <tr style="border: none;"><td style="padding: 0.2rem 0; font-weight: 600; border: none;">Torre/Edif:</td><td style="padding: 0.2rem 0; border: none;">\${prop.torre_nombre || 'Ninguna / Casa'}</td></tr>
                                    <tr style="border: none;"><td style="padding: 0.2rem 0; font-weight: 600; border: none;">Propietario:</td><td style="padding: 0.2rem 0; border: none;">\${owner.nombres}</td></tr>
                                    <tr style="border: none;"><td style="padding: 0.2rem 0; font-weight: 600; border: none;">RUT Propietario:</td><td style="padding: 0.2rem 0; border: none;">\${owner.rut}</td></tr>
                                    <tr style="border: none;"><td style="padding: 0.2rem 0; font-weight: 600; border: none;">Email:</td><td style="padding: 0.2rem 0; border: none;">\${owner.email}</td></tr>
                                </table>
                            </div>
                            
                            <!-- Fechas y Mora -->
                            <div style="border: 1px solid #ddd; padding: 0.75rem; border-radius: 6px; background: #fafafa;">
                                <h4 style="margin: 0 0 0.5rem 0; font-size: 0.9rem; font-weight: bold; border-bottom: 1px solid #ddd; padding-bottom: 0.25rem; color: #000;">Información de Cobro</h4>
                                <table style="width: 100%; border: none; margin: 0;">
                                    <tr style="border: none;"><td style="padding: 0.2rem 0; font-weight: 600; width: 110px; border: none;">F. Emisión:</td><td style="padding: 0.2rem 0; border: none;">\${formatDisplayDate(period.fecha_emision)}</td></tr>
                                    <tr style="border: none;"><td style="padding: 0.2rem 0; font-weight: 600; border: none;">F. Vencimiento:</td><td style="padding: 0.2rem 0; border: none;">\${formatDisplayDate(period.fecha_tope)}</td></tr>
                                    <tr style="border: none;"><td style="padding: 0.2rem 0; font-weight: 600; border: none;">Prorrateo:</td><td style="padding: 0.2rem 0; border: none;">\${(parseFloat(prop.porcentaje_prorrateo) * 100).toFixed(4)} % (\${prop.tipo_unidad_codigo || 'Por Defecto'})</td></tr>
                                    <tr style="border: none;"><td style="padding: 0.2rem 0; font-weight: 600; border: none;">Estado Pago:</td><td style="padding: 0.2rem 0; border: none;">
                                        <span style="font-weight: bold; color: \${boleta.estado === 'pagado' ? '#10b981' : '#ef4444'};">
                                            \${boleta.estado === 'pagado' ? 'PAGADO (' + formatDisplayDate(boleta.fecha_pago) + ')' : 'PENDIENTE'}
                                        </span>
                                    </td></tr>
                                </table>
                            </div>
                        </div>

                        <!-- Desglose de Gastos -->
                        <h3 style="font-size: 1.05rem; font-weight: bold; margin: 1.5rem 0 0.5rem 0; color: #000; border-bottom: 1px solid #333; padding-bottom: 0.25rem; text-transform: uppercase;">
                            Desglose Detallado de Egresos del Mes
                        </h3>
                    `;

                    // 1. Egresos Globales
                    html += `
                        <h4 style="margin: 1rem 0 0.25rem 0; font-size: 0.9rem; font-weight: bold; color: #2563eb;">1. Gastos Comunes Globales (Afectan a todo el condominio)</h4>
                        <table style="width: 100%; border-collapse: collapse; margin-bottom: 1rem;">
                            <thead>
                                <tr style="background: #f3f4f6; color: #000;">
                                    <th style="padding: 0.4rem; text-align: left; font-size: 0.75rem; border: 1px solid #ddd;">Fecha</th>
                                    <th style="padding: 0.4rem; text-align: left; font-size: 0.75rem; border: 1px solid #ddd;">Categoría / Subcategoría</th>
                                    <th style="padding: 0.4rem; text-align: left; font-size: 0.75rem; border: 1px solid #ddd;">Descripción</th>
                                    <th style="padding: 0.4rem; text-align: right; font-size: 0.75rem; border: 1px solid #ddd; width: 110px;">Monto ($)</th>
                                </tr>
                            </thead>
                            <tbody>
                    `;
                    let sumGlobales = 0;
                    if (globales.length === 0) {
                        html += `<tr><td colspan="4" style="padding: 0.4rem; text-align: center; color: #666; font-size: 0.75rem; border: 1px solid #ddd;">No se registraron egresos globales en este período.</td></tr>`;
                    } else {
                        globales.forEach(e => {
                            sumGlobales += parseFloat(e.monto);
                            html += `
                                <tr>
                                    <td style="padding: 0.4rem; font-size: 0.75rem; border: 1px solid #ddd;">\${formatDisplayDate(e.fecha)}</td>
                                    <td style="padding: 0.4rem; font-size: 0.75rem; border: 1px solid #ddd;">\${e.categoria_nombre} > \${e.subcategoria_nombre}</td>
                                    <td style="padding: 0.4rem; font-size: 0.75rem; border: 1px solid #ddd;">\${e.descripcion}</td>
                                    <td style="padding: 0.4rem; font-size: 0.75rem; border: 1px solid #ddd; text-align: right;">$\${formatNumber(e.monto)}</td>
                                </tr>
                            `;
                        });
                        html += `
                            <tr style="font-weight: bold; background: #fafafa;">
                                <td colspan="3" style="padding: 0.4rem; text-align: right; font-size: 0.75rem; border: 1px solid #ddd;">Subtotal Gastos Globales:</td>
                                <td style="padding: 0.4rem; text-align: right; font-size: 0.75rem; border: 1px solid #ddd;">$\${formatNumber(sumGlobales)}</td>
                            </tr>
                        `;
                    }
                    html += `</tbody></table>`;

                    // 2. Egresos de Torre
                    html += `
                        <h4 style="margin: 1.25rem 0 0.25rem 0; font-size: 0.9rem; font-weight: bold; color: #2563eb;">2. Gastos Específicos de la Torre (Afectan solo a \${prop.torre_nombre || 'la torre'})</h4>
                        <table style="width: 100%; border-collapse: collapse; margin-bottom: 1rem;">
                            <thead>
                                <tr style="background: #f3f4f6; color: #000;">
                                    <th style="padding: 0.4rem; text-align: left; font-size: 0.75rem; border: 1px solid #ddd;">Fecha</th>
                                    <th style="padding: 0.4rem; text-align: left; font-size: 0.75rem; border: 1px solid #ddd;">Categoría / Subcategoría</th>
                                    <th style="padding: 0.4rem; text-align: left; font-size: 0.75rem; border: 1px solid #ddd;">Descripción</th>
                                    <th style="padding: 0.4rem; text-align: right; font-size: 0.75rem; border: 1px solid #ddd; width: 110px;">Monto ($)</th>
                                </tr>
                            </thead>
                            <tbody>
                    `;
                    let sumTorre = 0;
                    if (torre.length === 0) {
                        html += `<tr><td colspan="4" style="padding: 0.4rem; text-align: center; color: #666; font-size: 0.75rem; border: 1px solid #ddd;">No se registraron egresos asignados a esta torre.</td></tr>`;
                    } else {
                        torre.forEach(e => {
                            sumTorre += parseFloat(e.monto);
                            html += `
                                <tr>
                                    <td style="padding: 0.4rem; font-size: 0.75rem; border: 1px solid #ddd;">\${formatDisplayDate(e.fecha)}</td>
                                    <td style="padding: 0.4rem; font-size: 0.75rem; border: 1px solid #ddd;">\${e.categoria_nombre} > \${e.subcategoria_nombre}</td>
                                    <td style="padding: 0.4rem; font-size: 0.75rem; border: 1px solid #ddd;">\${e.descripcion}</td>
                                    <td style="padding: 0.4rem; font-size: 0.75rem; border: 1px solid #ddd; text-align: right;">$\${formatNumber(e.monto)}</td>
                                </tr>
                            `;
                        });
                        html += `
                            <tr style="font-weight: bold; background: #fafafa;">
                                <td colspan="3" style="padding: 0.4rem; text-align: right; font-size: 0.75rem; border: 1px solid #ddd;">Subtotal Gastos de Torre:</td>
                                <td style="padding: 0.4rem; text-align: right; font-size: 0.75rem; border: 1px solid #ddd;">$\${formatNumber(sumTorre)}</td>
                            </tr>
                        `;
                    }
                    html += `</tbody></table>`;

                    // 3. Egresos / Multas Directas
                    html += `
                        <h4 style="margin: 1.25rem 0 0.25rem 0; font-size: 0.9rem; font-weight: bold; color: #2563eb;">3. Cargos Directos a la Unidad (Multas, arreglos particulares al 100%)</h4>
                        <table style="width: 100%; border-collapse: collapse; margin-bottom: 1rem;">
                            <thead>
                                <tr style="background: #f3f4f6; color: #000;">
                                    <th style="padding: 0.4rem; text-align: left; font-size: 0.75rem; border: 1px solid #ddd;">Fecha</th>
                                    <th style="padding: 0.4rem; text-align: left; font-size: 0.75rem; border: 1px solid #ddd;">Categoría / Subcategoría</th>
                                    <th style="padding: 0.4rem; text-align: left; font-size: 0.75rem; border: 1px solid #ddd;">Descripción</th>
                                    <th style="padding: 0.4rem; text-align: right; font-size: 0.75rem; border: 1px solid #ddd; width: 110px;">Monto ($)</th>
                                </tr>
                            </thead>
                            <tbody>
                    `;
                    let sumUnidad = 0;
                    if (unidad.length === 0) {
                        html += `<tr><td colspan="4" style="padding: 0.4rem; text-align: center; color: #666; font-size: 0.75rem; border: 1px solid #ddd;">No se registraron cargos directos o multas a esta unidad.</td></tr>`;
                    } else {
                        unidad.forEach(e => {
                            sumUnidad += parseFloat(e.monto);
                            html += `
                                <tr>
                                    <td style="padding: 0.4rem; font-size: 0.75rem; border: 1px solid #ddd;">\${formatDisplayDate(e.fecha)}</td>
                                    <td style="padding: 0.4rem; font-size: 0.75rem; border: 1px solid #ddd;">\${e.categoria_nombre} > \${e.subcategoria_nombre}</td>
                                    <td style="padding: 0.4rem; font-size: 0.75rem; border: 1px solid #ddd;">\${e.descripcion}</td>
                                    <td style="padding: 0.4rem; font-size: 0.75rem; border: 1px solid #ddd; text-align: right;">$\${formatNumber(e.monto)}</td>
                                </tr>
                            `;
                        });
                        html += `
                            <tr style="font-weight: bold; background: #fafafa;">
                                <td colspan="3" style="padding: 0.4rem; text-align: right; font-size: 0.75rem; border: 1px solid #ddd;">Subtotal Cargos Directos:</td>
                                <td style="padding: 0.4rem; text-align: right; font-size: 0.75rem; border: 1px solid #ddd;">$\${formatNumber(sumUnidad)}</td>
                            </tr>
                        `;
                    }
                    html += `</tbody></table>`;

                    // Liquidación / Totales Finales
                    const prorrateoFraccion = parseFloat(prop.porcentaje_prorrateo);
                    const baseSuma = sumGlobales + sumTorre;
                    const comunProrrateado = baseSuma * prorrateoFraccion;
                    const finalTotal = comunProrrateado + sumUnidad + parseFloat(boleta.monto_mora);

                    html += `
                        <!-- Liquidación -->
                        <div style="margin-top: 1.5rem; display: flex; justify-content: flex-end; color: #333;">
                            <div style="width: 320px; border: 1px solid #ddd; border-radius: 6px; padding: 0.75rem; background: #f9f9f9; font-size: 0.8rem;">
                                <table style="width: 100%; border: none; margin: 0;">
                                    <tr style="border: none;">
                                        <td style="padding: 0.25rem 0; border: none;">Base Prorrateable (1 + 2):</td>
                                        <td style="padding: 0.25rem 0; text-align: right; border: none;">$\${formatNumber(baseSuma)}</td>
                                    </tr>
                                    <tr style="border: none;">
                                        <td style="padding: 0.25rem 0; border: none;">Prorrateo Unitario (\${(prorrateoFraccion * 100).toFixed(4)}%):</td>
                                        <td style="padding: 0.25rem 0; text-align: right; border: none;">$\${formatNumber(comunProrrateado)}</td>
                                    </tr>
                                    <tr style="border: none;">
                                        <td style="padding: 0.25rem 0; border: none;">Cargos Directos (3):</td>
                                        <td style="padding: 0.25rem 0; text-align: right; border: none;">$\${formatNumber(sumUnidad)}</td>
                                    </tr>
                                    \${parseFloat(boleta.monto_mora) > 0 ? \`
                                    <tr style="border: none; color: #ef4444; font-weight: 600;">
                                        <td style="padding: 0.25rem 0; border: none;">Interés Mora (\${parseFloat(period.interes_mora)}%):</td>
                                        <td style="padding: 0.25rem 0; text-align: right; border: none;">+\$\${formatNumber(boleta.monto_mora)}</td>
                                    </tr>
                                    \` : ''}
                                    <tr style="border-top: 2px solid #333; font-weight: bold; font-size: 1rem; color: #000;">
                                        <td style="padding: 0.5rem 0 0 0; border: none;">Pago Final Neto:</td>
                                        <td style="padding: 0.5rem 0 0 0; text-align: right; border: none;">$\${formatNumber(finalTotal)}</td>
                                    </tr>
                                </table>
                            </div>
                        </div>

                        <!-- Footer del Recibo -->
                        <div style="text-align: center; margin-top: 2rem; border-top: 1px solid #eee; padding-top: 1rem; font-size: 0.75rem; color: #888;">
                            Este documento sirve de cobro oficial y respaldo de gastos comunes del mes. RedVecino S.A.
                        </div>
                    `;

                    printArea.innerHTML = html;
                    document.getElementById('modal-gc-recibo').classList.add('active');
                    lucide.createIcons();
                })
                .catch(() => showToast('Error al obtener el detalle del recibo.', 'error'));
        }

        function closeGCReciboModal() {
            document.getElementById('modal-gc-recibo').classList.remove('active');
        }

        function printGCRecibo() {
            const printContent = document.getElementById('gc-recibo-print-area').innerHTML;
            const printWindow = window.open('', '_blank');
            printWindow.document.write(`
                <html>
                <head>
                    <title>Recibo Gasto Común</title>
                    <style>
                        body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #333; margin: 2rem; }
                        table { width: 100%; border-collapse: collapse; margin-top: 1rem; margin-bottom: 1.5rem; }
                        th, td { padding: 0.5rem; border-bottom: 1px solid #ddd; text-align: left; font-size: 0.85rem; }
                        th { background: #f5f5f5; font-weight: bold; }
                        .text-right { text-align: right; }
                    </style>
                </head>
                <body onload="window.print(); window.close();">
                    \${printContent}
                </body>
                </html>
            `);
            printWindow.document.close();
        }

        function getMonthName(ym) {
            const parts = ym.split('-');
            if (parts.length < 2) return ym;
            const months = [
                'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
                'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
            ];
            const idx = parseInt(parts[1]) - 1;
            return `${months[idx]} ${parts[0]}`;
        }

        function publishGCPeriodCurrent() {
            if (!currentPeriodId) return;
            if (!confirm('¿Está seguro de aceptar y generar oficialmente los Gastos Comunes para este período? Una vez generados, serán visibles para todos los propietarios y residentes de sus unidades.')) {
                return;
            }

            const formData = new FormData();
            formData.append('periodo_id', currentPeriodId);

            fetch('api.php?action=publish_gasto_comun_period', {
                method: 'POST',
                body: formData
            })
            .then(res => res.json())
            .then(response => {
                if (response.success) {
                    showToast(response.message, 'success');
                    viewPeriodBoletas(currentPeriodId);
                    loadGCPeriods();
                } else {
                    showToast(response.message, 'error');
                }
            })
            .catch(() => showToast('Error al publicar el período de gastos comunes.', 'error'));
        }

        function loadUnitGCHistory(unitId) {
            const container = document.getElementById('unidad-gc-list-container');
            if (!container) return;
            container.innerHTML = '<span style="color: var(--text-muted); font-style: italic;">Cargando historial...</span>';

            fetch(`api.php?action=get_propiedad_boletas&propiedad_id=${unitId}`)
                .then(res => res.json())
                .then(response => {
                    if (response.success && response.data.length > 0) {
                        container.innerHTML = '';
                        response.data.forEach(b => {
                            const item = document.createElement('div');
                            item.style.display = 'flex';
                            item.style.justifyContent = 'space-between';
                            item.style.alignItems = 'center';
                            item.style.padding = '0.4rem 0.5rem';
                            item.style.background = 'rgba(255,255,255,0.02)';
                            item.style.border = '1px solid var(--border-color)';
                            item.style.borderRadius = '6px';
                            item.style.gap = '0.5rem';

                            let badgeColor = '#10b981';
                            let badgeBg = 'rgba(16, 185, 129, 0.1)';
                            let badgeText = 'PAGADO';
                            if (b.estado === 'pendiente') {
                                if (b.vencido) {
                                    badgeColor = '#ef4444';
                                    badgeBg = 'rgba(239, 68, 68, 0.1)';
                                    badgeText = 'VENCIDO';
                                } else {
                                    badgeColor = '#f59e0b';
                                    badgeBg = 'rgba(245, 158, 11, 0.1)';
                                    badgeText = 'PENDIENTE';
                                }
                            }

                            item.innerHTML = `
                                <div>
                                    <strong style="color: #fff; font-size: 0.8rem;">${getMonthName(b.mes)}</strong>
                                    <div style="font-size: 0.7rem; color: var(--text-secondary); margin-top: 0.1rem;">Vence: ${formatDisplayDate(b.fecha_tope)}</div>
                                </div>
                                <div style="text-align: right; display: flex; align-items: center; gap: 0.5rem;">
                                    <span style="font-weight: bold; color: #fff;">$${formatNumber(b.monto_total)}</span>
                                    <span style="color: ${badgeColor}; background: ${badgeBg}; padding: 0.1rem 0.35rem; border-radius: 4px; font-size: 0.65rem; font-weight: bold;">${badgeText}</span>
                                </div>
                            `;
                            container.appendChild(item);
                        });
                    } else {
                        container.innerHTML = '<span style="color: var(--text-muted); font-style: italic;">No se registran gastos comunes emitidos para esta unidad.</span>';
                    }
                })
                .catch(() => {
                    container.innerHTML = '<span style="color: var(--danger); font-style: italic;">Error al cargar historial.</span>';
                });
        }

        function loadResidenteGCHistory(propId) {
            const panel = document.getElementById('residente-gc-history-panel');
            const tbody = document.getElementById('tbody-residente-gc-list');
            if (!panel || !tbody) return;

            if (!propId) {
                panel.style.display = 'none';
                return;
            }

            tbody.innerHTML = '<tr><td colspan="10" style="text-align: center; color: var(--text-muted); padding: 1rem;">Cargando historial de gastos comunes...</td></tr>';
            panel.style.display = 'block';

            fetch(`api.php?action=get_propiedad_boletas&propiedad_id=${propId}`)
                .then(res => res.json())
                .then(response => {
                    if (response.success && response.data.length > 0) {
                        tbody.innerHTML = '';
                        response.data.forEach(b => {
                            const tr = document.createElement('tr');
                            
                            let badgeColor = '#10b981';
                            let badgeBg = 'rgba(16, 185, 129, 0.1)';
                            let badgeText = 'PAGADO';
                            if (b.estado === 'pendiente') {
                                if (b.vencido) {
                                    badgeColor = '#ef4444';
                                    badgeBg = 'rgba(239, 68, 68, 0.1)';
                                    badgeText = 'VENCIDO';
                                } else {
                                    badgeColor = '#f59e0b';
                                    badgeBg = 'rgba(245, 158, 11, 0.1)';
                                    badgeText = 'PENDIENTE';
                                }
                            }

                            tr.innerHTML = `
                                <td style="padding: 0.6rem 0.5rem; font-weight: bold; color: #fff;">${getMonthName(b.mes)}</td>
                                <td style="padding: 0.6rem 0.5rem;">${formatDisplayDate(b.fecha_emision)}</td>
                                <td style="padding: 0.6rem 0.5rem;">${formatDisplayDate(b.fecha_tope)}</td>
                                <td style="padding: 0.6rem 0.5rem; text-align: right;">$${formatNumber(b.monto_comun)}</td>
                                <td style="padding: 0.6rem 0.5rem; text-align: right;">$${formatNumber(b.monto_torre)}</td>
                                <td style="padding: 0.6rem 0.5rem; text-align: right;">$${formatNumber(b.monto_unidad)}</td>
                                <td style="padding: 0.6rem 0.5rem; text-align: right; color: var(--danger); font-weight: 500;">$${formatNumber(b.monto_mora)}</td>
                                <td style="padding: 0.6rem 0.5rem; text-align: right; font-weight: bold; color: #fff;">$${formatNumber(b.monto_total)}</td>
                                <td style="padding: 0.6rem 0.5rem; text-align: center;">
                                    <span style="color: ${badgeColor}; background: ${badgeBg}; padding: 0.15rem 0.5rem; border-radius: 6px; font-size: 0.7rem; font-weight: bold;">${badgeText}</span>
                                </td>
                                <td style="padding: 0.6rem 0.5rem; text-align: center;">
                                    <button class="btn-icon text-accent" onclick="viewGCRecibo(${b.id})" title="Ver Recibo Gasto Común" style="padding: 0.2rem; min-width: auto; background: none; border: none;">
                                        <i data-lucide="file-text" style="width: 14px; height: 14px; color: var(--accent-color);"></i>
                                    </button>
                                </td>
                            `;
                            tbody.appendChild(tr);
                        });
                        lucide.createIcons();
                    } else {
                        tbody.innerHTML = '<tr><td colspan="10" style="text-align: center; color: var(--text-muted); padding: 1.5rem;">No se registran gastos comunes emitidos para esta unidad.</td></tr>';
                    }
                })
                .catch(() => {
                    tbody.innerHTML = '<tr><td colspan="10" style="text-align: center; color: var(--danger); padding: 1.5rem;">Error de conexión.</td></tr>';
                });
        }

        // ================= MÓDULO COLABORADORES (PERSONAL) =================
        let activeColabId = null;

        function loadColaboradores() {
            const tbody = document.getElementById('tbody-colaboradores');
            if (!tbody) return;
            tbody.innerHTML = '<tr><td colspan="8" style="text-align: center; color: var(--text-muted); padding: 2rem;">Cargando colaboradores...</td></tr>';

            fetch('api.php?action=get_colaboradores')
                .then(res => res.json())
                .then(response => {
                    if (response.success) {
                        tbody.innerHTML = '';
                        if (response.data.length === 0) {
                            tbody.innerHTML = '<tr><td colspan="8" style="text-align: center; color: var(--text-muted); padding: 2.5rem;">No hay colaboradores registrados en el sistema.</td></tr>';
                            return;
                        }

                        response.data.forEach(c => {
                            const tr = document.createElement('tr');
                            
                            // Edad
                            const edad = calculateAge(c.fecha_nacimiento);

                            // Badge de Estado
                            let stateBg = 'rgba(16, 185, 129, 0.1)';
                            let stateColor = '#10b981';
                            let stateText = 'Activo';
                            if (c.estado === 'vacaciones') {
                                stateBg = 'rgba(59, 130, 246, 0.1)';
                                stateColor = '#3b82f6';
                                stateText = 'Vacaciones';
                            } else if (c.estado === 'licencia') {
                                stateBg = 'rgba(245, 158, 11, 0.1)';
                                stateColor = '#f59e0b';
                                stateText = 'Licencia';
                            } else if (c.estado === 'desvinculado') {
                                stateBg = 'rgba(239, 68, 68, 0.1)';
                                stateColor = '#ef4444';
                                stateText = 'Desvinculado';
                            } else if (c.estado === 'permiso') {
                                stateBg = 'rgba(139, 92, 246, 0.1)';
                                stateColor = '#8b5cf6';
                                stateText = 'Permiso';
                            }

                            // Contrato
                            const contratoLink = c.contrato_ruta
                                ? `<a href="${c.contrato_ruta}" target="_blank" class="text-success" style="display:inline-flex; align-items:center; gap:0.2rem; font-weight:600;"><i data-lucide="file-text" style="width:14px; height:14px;"></i> Descargar</a>`
                                : '<span style="color:var(--text-muted); font-style:italic;">No cargado</span>';

                            // Formatear horario de trabajo
                            let horarioLabel = '';
                            if (c.horario_trabajo) {
                                try {
                                    const sched = JSON.parse(c.horario_trabajo);
                                    if (sched && sched.tipo) {
                                        let tipoName = 'Básico';
                                        if (sched.tipo === 'medio_turno') tipoName = 'Medio Turno';
                                        if (sched.tipo === 'por_dias') {
                                            const colacText = sched.colacion ? ` (colación ${sched.colacion}m)` : '';
                                            horarioLabel = `<div style="font-size:0.725rem; color:var(--text-secondary); margin-top:0.25rem; display:flex; align-items:center; gap:0.2rem;"><i data-lucide="clock" style="width:11px; height:11px;"></i> Por Días: ${sched.dias_cantidad} días [${sched.entrada} - ${sched.salida}]${colacText} (${sched.horas_semanales.toFixed(1)} hrs/sem)</div>`;
                                        } else {
                                            horarioLabel = `<div style="font-size:0.725rem; color:var(--text-secondary); margin-top:0.25rem; display:flex; align-items:center; gap:0.2rem;"><i data-lucide="clock" style="width:11px; height:11px;"></i> ${tipoName} (${sched.horas_semanales.toFixed(1)} hrs/sem)</div>`;
                                        }
                                    } else {
                                        horarioLabel = `<div style="font-size:0.725rem; color:var(--text-secondary); margin-top:0.25rem; display:flex; align-items:center; gap:0.2rem;"><i data-lucide="clock" style="width:11px; height:11px;"></i> ${c.horario_trabajo}</div>`;
                                    }
                                } catch(e) {
                                    horarioLabel = `<div style="font-size:0.725rem; color:var(--text-secondary); margin-top:0.25rem; display:flex; align-items:center; gap:0.2rem;"><i data-lucide="clock" style="width:11px; height:11px;"></i> ${c.horario_trabajo}</div>`;
                                }
                            }

                            tr.innerHTML = `
                                <td style="padding: 0.75rem 0.5rem; font-weight: bold; color: #fff;">${c.nombres} ${c.apellidos}</td>
                                <td style="padding: 0.75rem 0.5rem;">
                                    <div style="font-weight: 500; color:#fff;">${c.cargo_nombre || '<span style="color:var(--text-muted); font-style:italic;">No asignado</span>'}</div>
                                    ${horarioLabel}
                                </td>
                                <td style="padding: 0.75rem 0.5rem; text-align: center;">${edad} años</td>
                                <td style="padding: 0.75rem 0.5rem;">
                                    <div style="font-size:0.8rem; color:#fff;">${c.telefono || '-'}</div>
                                    <div style="font-size:0.75rem; color:var(--text-secondary);">${c.email || '-'}</div>
                                </td>
                                <td style="padding: 0.75rem 0.5rem;">${contratoLink}</td>
                                <td style="padding: 0.75rem 0.5rem; text-align: right; font-weight: 500; color: #fff;">$${formatNumber(c.sueldo_liquido || 0)}</td>
                                <td style="padding: 0.75rem 0.5rem; text-align: center;">
                                    <span style="background: ${stateBg}; color: ${stateColor}; padding: 0.2rem 0.5rem; border-radius: 6px; font-size: 0.75rem; font-weight: bold; border: 1px solid ${stateColor}22;">${stateText}</span>
                                </td>
                                <td style="padding: 0.75rem 0.5rem; text-align: center;">
                                    <div style="display: flex; gap: 0.35rem; justify-content: center;">
                                        <button class="btn-icon text-accent" onclick="openColaboradorModal(${c.id})" title="Editar Ficha Colaborador">
                                            <i data-lucide="edit-3" style="width: 15px; height: 15px;"></i>
                                        </button>
                                        <button class="btn-icon text-danger" onclick="deleteColaborador(${c.id})" title="Eliminar Colaborador">
                                            <i data-lucide="trash-2" style="width: 15px; height: 15px;"></i>
                                        </button>
                                    </div>
                                </td>
                            `;
                            tbody.appendChild(tr);
                        });
                        lucide.createIcons();
                    } else {
                        tbody.innerHTML = `<tr><td colspan="8" style="text-align: center; color: var(--danger); padding: 2rem;">${response.message}</td></tr>`;
                    }
                })
                .catch(() => {
                    tbody.innerHTML = '<tr><td colspan="8" style="text-align: center; color: var(--danger); padding: 2rem;">Error de conexión.</td></tr>';
                });
        }

        function loadColaboradoresCargosDropdown(selectedId = null) {
            const select = document.getElementById('colaborador-cargo-id');
            if (!select) return Promise.resolve();

            select.innerHTML = '<option value="">Seleccione cargo...</option>';
            return fetch('api.php?action=get_cargos')
                .then(res => res.json())
                .then(response => {
                    if (response.success) {
                        response.data.forEach(c => {
                            const opt = document.createElement('option');
                            opt.value = c.id;
                            opt.textContent = c.nombre;
                            if (selectedId && parseInt(c.id) === parseInt(selectedId)) {
                                opt.selected = true;
                            }
                            select.appendChild(opt);
                        });
                    }
                });
        }

        function openColaboradorModal(id = null) {
            activeColabId = id;
            
            // Cargar cargos en el dropdown
            loadColaboradoresCargosDropdown().then(() => {
                const modal = document.getElementById('modal-colaborador');
                const form = document.getElementById('form-colaborador');
                const title = document.getElementById('modal-colaborador-title');
                const btnSubmit = document.getElementById('btn-submit-colaborador');

                form.reset();
                document.getElementById('colaborador-id').value = id || '';
                document.getElementById('colaborador-age-display').textContent = 'Edad: -- años';
                document.getElementById('colaborador-contrato-download').style.display = 'none';
                document.getElementById('colaborador-permitir-insumos').checked = false;

                // Tabs
                const tabLiq = document.getElementById('tab-btn-colab-liquidaciones');
                const tabAmon = document.getElementById('tab-btn-colab-amonestaciones');

                if (id) {
                    title.textContent = 'Editar Ficha de Colaborador';
                    btnSubmit.textContent = 'Actualizar Ficha';
                    tabLiq.style.display = 'block';
                    tabAmon.style.display = 'block';
                    switchColabModalTab('principal');

                    // Cargar datos
                    fetch(`api.php?action=get_colaborador&id=${id}`)
                        .then(res => res.json())
                        .then(response => {
                            if (response.success) {
                                const colab = response.data.colaborador;
                                document.getElementById('colaborador-nombres').value = colab.nombres;
                                document.getElementById('colaborador-apellidos').value = colab.apellidos;
                                document.getElementById('colaborador-dob').value = colab.fecha_nacimiento;
                                document.getElementById('colaborador-permitir-insumos').checked = parseInt(colab.permitir_insumos) === 1;
                                calculateColabAge();
                                document.getElementById('colaborador-telefono').value = colab.telefono || '';
                                document.getElementById('colaborador-email').value = colab.email || '';
                                document.getElementById('colaborador-direccion').value = colab.direccion || '';
                                document.getElementById('colaborador-emergencia-nombre').value = colab.contacto_emergencia_nombre || '';
                                document.getElementById('colaborador-emergencia-telefono').value = colab.contacto_emergencia_telefono || '';
                                document.getElementById('colaborador-cargo-id').value = colab.cargo_id || '';
                                document.getElementById('colaborador-tipo-contrato').value = colab.tipo_contrato || '1_mes';
                                document.getElementById('colaborador-sueldo-liquido').value = colab.sueldo_liquido || '';
                                document.getElementById('colaborador-observaciones').value = colab.observaciones || '';
                                
                                // Cargar Horario Estructurado
                                let sched = null;
                                try {
                                    sched = colab.horario_trabajo ? JSON.parse(colab.horario_trabajo) : null;
                                } catch(e) {
                                    sched = null;
                                }

                                if (sched && sched.tipo) {
                                    document.getElementById('colab-horario-tipo').value = sched.tipo;
                                    if (sched.tipo === 'basico' || sched.tipo === 'medio_turno') {
                                        const dias = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo'];
                                        dias.forEach(dia => {
                                            const row = document.querySelector(`.dia-row[data-dia="${dia}"]`);
                                            if (row && sched.detalle && sched.detalle[dia]) {
                                                row.querySelector('.colab-dia-check').checked = sched.detalle[dia].trabaja;
                                                row.querySelector('.colab-dia-entrada').value = sched.detalle[dia].entrada || '09:00';
                                                row.querySelector('.colab-dia-salida').value = sched.detalle[dia].salida || '18:00';
                                                row.querySelector('.colab-dia-colacion').value = sched.detalle[dia].colacion !== undefined ? sched.detalle[dia].colacion : 60;
                                            }
                                        });
                                    } else if (sched.tipo === 'por_dias') {
                                        document.getElementById('colab-pd-entrada').value = sched.entrada || '08:00';
                                        document.getElementById('colab-pd-salida').value = sched.salida || '16:00';
                                        document.getElementById('colab-pd-dias-cantidad').value = sched.dias_cantidad || '5';
                                        document.getElementById('colab-pd-colacion').value = sched.colacion !== undefined ? sched.colacion : 60;
                                    }
                                    toggleScheduleTypeUI();
                                } else {
                                    resetScheduleUI();
                                }
                                
                                try {
                                    colabFuncionesList = colab.funciones ? JSON.parse(colab.funciones) : [];
                                } catch(e) {
                                    colabFuncionesList = [];
                                }
                                renderColabFuncionesList();

                                // Checkbox de Estado
                                const radioState = form.querySelector(`input[name="colaborador-estado"][value="${colab.estado}"]`);
                                if (radioState) radioState.checked = true;

                                // Contrato actual
                                if (colab.contrato_ruta) {
                                    const link = document.getElementById('colaborador-contrato-download');
                                    link.querySelector('a').href = colab.contrato_ruta;
                                    link.style.display = 'block';
                                }

                                // Renderizar historiales
                                renderColabLiquidacionesTable(response.data.liquidaciones);
                                renderColabAmonestacionesTable(response.data.amonestaciones);
                            }
                        });
                } else {
                    title.textContent = 'Ingresar Nuevo Colaborador';
                    btnSubmit.textContent = 'Guardar Ficha';
                    tabLiq.style.display = 'none';
                    tabAmon.style.display = 'none';
                    switchColabModalTab('principal');
                    
                    resetScheduleUI();
                    colabFuncionesList = [];
                    renderColabFuncionesList();
                }

                modal.classList.add('active');
                lucide.createIcons();
            });
        }

        function closeColaboradorModal() {
            document.getElementById('modal-colaborador').classList.remove('active');
        }

        function switchColabModalTab(tabName) {
            // Activar botón de pestaña
            document.querySelectorAll('.tab-btn').forEach(btn => {
                if (btn.id === `tab-btn-colab-${tabName}`) {
                    btn.classList.add('active');
                    btn.style.color = '#fff';
                    btn.style.borderBottomColor = 'var(--accent-color)';
                } else {
                    btn.classList.remove('active');
                    btn.style.color = 'var(--text-secondary)';
                    btn.style.borderBottomColor = 'transparent';
                }
            });

            // Mostrar contenido
            document.getElementById('colab-modal-tab-principal').style.display = tabName === 'principal' ? 'block' : 'none';
            document.getElementById('colab-modal-tab-liquidaciones').style.display = tabName === 'liquidaciones' ? 'block' : 'none';
            document.getElementById('colab-modal-tab-amonestaciones').style.display = tabName === 'amonestaciones' ? 'block' : 'none';
        }

        function calculateColabAge() {
            const dob = document.getElementById('colaborador-dob').value;
            const display = document.getElementById('colaborador-age-display');
            if (dob) {
                display.textContent = `Edad: ${calculateAge(dob)} años`;
            } else {
                display.textContent = 'Edad: -- años';
            }
        }

        function submitColaboradorForm() {
            const form = document.getElementById('form-colaborador');
            const nombres = document.getElementById('colaborador-nombres').value.trim();
            const apellidos = document.getElementById('colaborador-apellidos').value.trim();
            const dob = document.getElementById('colaborador-dob').value;
            const cargo = document.getElementById('colaborador-cargo-id').value;

            if (!nombres || !apellidos || !dob || !cargo) {
                showToast('Nombres, apellidos, fecha de nacimiento y cargo son requeridos.', 'warning');
                return;
            }

            const formData = new FormData();
            formData.append('id', activeColabId || '');
            formData.append('nombres', nombres);
            formData.append('apellidos', apellidos);
            formData.append('fecha_nacimiento', dob);
            formData.append('telefono', document.getElementById('colaborador-telefono').value.trim());
            formData.append('email', document.getElementById('colaborador-email').value.trim());
            formData.append('direccion', document.getElementById('colaborador-direccion').value.trim());
            formData.append('contacto_emergencia_nombre', document.getElementById('colaborador-emergencia-nombre').value.trim());
            formData.append('contacto_emergencia_telefono', document.getElementById('colaborador-emergencia-telefono').value.trim());
            formData.append('cargo_id', cargo);
            formData.append('tipo_contrato', document.getElementById('colaborador-tipo-contrato').value);
            formData.append('sueldo_liquido', document.getElementById('colaborador-sueldo-liquido').value);
            formData.append('observaciones', document.getElementById('colaborador-observaciones').value.trim());
            formData.append('horario_trabajo', getScheduleDataJSON());
            formData.append('funciones', JSON.stringify(colabFuncionesList));
            formData.append('permitir_insumos', document.getElementById('colaborador-permitir-insumos').checked ? 1 : 0);

            // Estado
            const estado = form.querySelector('input[name="colaborador-estado"]:checked').value;
            formData.append('estado', estado);

            // Contrato
            const contratoInput = document.getElementById('colaborador-contrato');
            if (contratoInput.files.length > 0) {
                formData.append('contrato', contratoInput.files[0]);
            }

            fetch('api.php?action=save_colaborador', {
                method: 'POST',
                body: formData
            })
            .then(res => res.json())
            .then(response => {
                if (response.success) {
                    showToast(response.message, 'success');
                    closeColaboradorModal();
                    loadColaboradores();
                } else {
                    showToast(response.message, 'error');
                }
            })
            .catch(() => showToast('Error de red al guardar la ficha del colaborador.', 'error'));
        }

        function deleteColaborador(id) {
            if (!confirm('¿Está seguro de eliminar esta ficha de colaborador? Se borrarán todos los registros asociados permanentemente.')) return;

            const formData = new FormData();
            formData.append('id', id);

            fetch('api.php?action=delete_colaborador', {
                method: 'POST',
                body: formData
            })
            .then(res => res.json())
            .then(response => {
                if (response.success) {
                    showToast(response.message, 'success');
                    loadColaboradores();
                } else {
                    showToast(response.message, 'error');
                }
            })
            .catch(() => showToast('Error al eliminar el colaborador.', 'error'));
        }

        // --- SUBTABLAS DE LIQUIDACIONES Y AMONESTACIONES ---

        function renderColabLiquidacionesTable(list) {
            const tbody = document.getElementById('tbody-colab-liquidaciones');
            if (!tbody) return;
            tbody.innerHTML = '';

            if (list.length === 0) {
                tbody.innerHTML = '<tr><td colspan="4" style="text-align:center; color:var(--text-muted); padding:1.5rem;">No se registran liquidaciones de sueldo para este colaborador.</td></tr>';
                return;
            }

            list.forEach(l => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td style="padding: 0.5rem; font-weight: bold; color: #fff;">${getMonthName(l.periodo)}</td>
                    <td style="padding: 0.5rem;">${formatDisplayDate(l.creado_en)}</td>
                    <td style="padding: 0.5rem; text-align: center;">
                        <a href="${l.archivo_ruta}" target="_blank" class="text-success" style="display:inline-flex; align-items:center; gap:0.2rem;"><i data-lucide="download" style="width:13px; height:13px;"></i> Descargar</a>
                    </td>
                    <td style="padding: 0.5rem; text-align: center;">
                        <button class="btn-icon text-danger" onclick="deleteColabLiquidacion(${l.id})" title="Eliminar Liquidación" style="padding:0.2rem; min-width:auto;">
                            <i data-lucide="trash-2" style="width:13px; height:13px;"></i>
                        </button>
                    </td>
                `;
                tbody.appendChild(tr);
            });
            lucide.createIcons();
        }

        function renderColabAmonestacionesTable(list) {
            const tbody = document.getElementById('tbody-colab-amonestaciones');
            if (!tbody) return;
            tbody.innerHTML = '';

            if (list.length === 0) {
                tbody.innerHTML = '<tr><td colspan="5" style="text-align:center; color:var(--text-muted); padding:1.5rem;">No se registran amonestaciones ni faltas de conducta.</td></tr>';
                return;
            }

            list.forEach(a => {
                const tr = document.createElement('tr');
                const docCol = a.archivo_ruta
                    ? `<a href="${a.archivo_ruta}" target="_blank" class="text-success" style="display:inline-flex; align-items:center; gap:0.2rem;"><i data-lucide="link" style="width:13px; height:13px;"></i> Ver Archivo</a>`
                    : '<span style="color:var(--text-muted); font-style:italic;">Ninguno</span>';

                tr.innerHTML = `
                    <td style="padding: 0.5rem; color:#fff;">${formatDisplayDate(a.fecha)}</td>
                    <td style="padding: 0.5rem;">${a.hora}</td>
                    <td style="padding: 0.5rem;">${a.descripcion}</td>
                    <td style="padding: 0.5rem; text-align: center;">${docCol}</td>
                    <td style="padding: 0.5rem; text-align: center;">
                        <button class="btn-icon text-danger" onclick="deleteColabAmonestacion(${a.id})" title="Eliminar Amonestación" style="padding:0.2rem; min-width:auto;">
                            <i data-lucide="trash-2" style="width:13px; height:13px;"></i>
                        </button>
                    </td>
                `;
                tbody.appendChild(tr);
            });
            lucide.createIcons();
        }

        function submitUploadLiquidacion() {
            const periodo = document.getElementById('liq-periodo').value;
            const fileInput = document.getElementById('liq-archivo');

            if (!periodo || fileInput.files.length === 0) {
                showToast('Debe seleccionar el período (mes) y el archivo de liquidación.', 'warning');
                return;
            }

            const formData = new FormData();
            formData.append('colaborador_id', activeColabId);
            formData.append('periodo', periodo);
            formData.append('archivo', fileInput.files[0]);

            fetch('api.php?action=upload_liquidacion', {
                method: 'POST',
                body: formData
            })
            .then(res => res.json())
            .then(response => {
                if (response.success) {
                    showToast(response.message, 'success');
                    document.getElementById('form-upload-liq').reset();
                    refreshColabSubTables();
                } else {
                    showToast(response.message, 'error');
                }
            })
            .catch(() => showToast('Error al subir la liquidación.', 'error'));
        }

        function deleteColabLiquidacion(id) {
            if (!confirm('¿Está seguro de eliminar esta liquidación del historial?')) return;

            const formData = new FormData();
            formData.append('id', id);

            fetch('api.php?action=delete_liquidacion', {
                method: 'POST',
                body: formData
            })
            .then(res => res.json())
            .then(response => {
                if (response.success) {
                    showToast(response.message, 'success');
                    refreshColabSubTables();
                } else {
                    showToast(response.message, 'error');
                }
            })
            .catch(() => showToast('Error al eliminar la liquidación.', 'error'));
        }

        function submitSaveAmonestacion() {
            const fecha = document.getElementById('amon-fecha').value;
            const hora = document.getElementById('amon-hora').value;
            const desc = document.getElementById('amon-descripcion').value.trim();
            const fileInput = document.getElementById('amon-archivo');

            if (!fecha || !hora || !desc) {
                showToast('La fecha, la hora y la descripción de la amonestación son obligatorias.', 'warning');
                return;
            }

            const formData = new FormData();
            formData.append('colaborador_id', activeColabId);
            formData.append('fecha', fecha);
            formData.append('hora', hora);
            formData.append('descripcion', desc);
            if (fileInput.files.length > 0) {
                formData.append('archivo', fileInput.files[0]);
            }

            fetch('api.php?action=save_amonestacion', {
                method: 'POST',
                body: formData
            })
            .then(res => res.json())
            .then(response => {
                if (response.success) {
                    showToast(response.message, 'success');
                    document.getElementById('form-save-amon').reset();
                    refreshColabSubTables();
                } else {
                    showToast(response.message, 'error');
                }
            })
            .catch(() => showToast('Error al guardar la amonestación.', 'error'));
        }

        function deleteColabAmonestacion(id) {
            if (!confirm('¿Está seguro de eliminar esta amonestación del historial?')) return;

            const formData = new FormData();
            formData.append('id', id);

            fetch('api.php?action=delete_amonestacion', {
                method: 'POST',
                body: formData
            })
            .then(res => res.json())
            .then(response => {
                if (response.success) {
                    showToast(response.message, 'success');
                    refreshColabSubTables();
                } else {
                    showToast(response.message, 'error');
                }
            })
            .catch(() => showToast('Error al eliminar la amonestación.', 'error'));
        }

        function refreshColabSubTables() {
            if (!activeColabId) return;
            fetch(`api.php?action=get_colaborador&id=${activeColabId}`)
                .then(res => res.json())
                .then(response => {
                    if (response.success) {
                        renderColabLiquidacionesTable(response.data.liquidaciones);
                        renderColabAmonestacionesTable(response.data.amonestaciones);
                    }
                });
        }

        // --- HORARIOS DE TRABAJO (CÁLCULOS Y EVENTOS) ---
        function toggleScheduleTypeUI() {
            const tipo = document.getElementById('colab-horario-tipo').value;
            const panelBasico = document.getElementById('panel-horario-basico');
            const panelPorDias = document.getElementById('panel-horario-por-dias');
            const desc = document.getElementById('colab-horario-tipo-desc');

            if (tipo === 'basico' || tipo === 'medio_turno') {
                panelBasico.style.display = 'block';
                panelPorDias.style.display = 'none';
                desc.textContent = tipo === 'basico' 
                    ? 'Configure el rango de entrada y salida para cada día de lunes a domingo. El total de horas semanales se calcula sumando el tiempo de cada día activo.'
                    : 'Horario de medio turno. Despliegue de lunes a domingo con entrada y salida específica por día horizontalmente.';
            } else {
                panelBasico.style.display = 'none';
                panelPorDias.style.display = 'block';
                desc.textContent = 'Horario por días. Ingrese el horario de entrada, salida y la cantidad de días trabajados por semana.';
            }
            calculateScheduleHours();
        }

        function calculateScheduleHours() {
            const tipo = document.getElementById('colab-horario-tipo').value;
            let totalHoras = 0;

            if (tipo === 'basico' || tipo === 'medio_turno') {
                const dias = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo'];
                dias.forEach(dia => {
                    const row = document.querySelector(`.dia-row[data-dia="${dia}"]`);
                    if (row) {
                        const chk = row.querySelector('.colab-dia-check').checked;
                        const entradaInput = row.querySelector('.colab-dia-entrada');
                        const salidaInput = row.querySelector('.colab-dia-salida');
                        const colacionInput = row.querySelector('.colab-dia-colacion');
                        const horasLabel = row.querySelector('.colab-dia-horas');

                        if (chk) {
                            entradaInput.removeAttribute('disabled');
                            salidaInput.removeAttribute('disabled');
                            colacionInput.removeAttribute('disabled');
                            
                            const bruto = calculateDiffHours(entradaInput.value, salidaInput.value);
                            const colacHoras = (parseFloat(colacionInput.value) || 0) / 60;
                            const neto = Math.max(0, bruto - colacHoras);
                            
                            horasLabel.textContent = `${neto.toFixed(1)} hrs`;
                            totalHoras += neto;
                        } else {
                            entradaInput.setAttribute('disabled', 'true');
                            salidaInput.setAttribute('disabled', 'true');
                            colacionInput.setAttribute('disabled', 'true');
                            horasLabel.textContent = '0.0 hrs';
                        }
                    }
                });
            } else if (tipo === 'por_dias') {
                const entrada = document.getElementById('colab-pd-entrada').value;
                const salida = document.getElementById('colab-pd-salida').value;
                const diasCant = parseInt(document.getElementById('colab-pd-dias-cantidad').value) || 0;
                const colacionMin = parseFloat(document.getElementById('colab-pd-colacion').value) || 0;
                
                const brutoPorDia = calculateDiffHours(entrada, salida);
                const colacHorasPorDia = colacionMin / 60;
                const netoPorDia = Math.max(0, brutoPorDia - colacHorasPorDia);
                totalHoras = netoPorDia * diasCant;
            }

            document.getElementById('colab-total-horas-display').textContent = `Total Horas: ${totalHoras.toFixed(1)} hrs/semana`;
            return totalHoras;
        }

        function calculateDiffHours(t1, t2) {
            if (!t1 || !t2) return 0;
            const [h1, m1] = t1.split(':').map(Number);
            const [h2, m2] = t2.split(':').map(Number);
            let diffMin = (h2 * 60 + m2) - (h1 * 60 + m1);
            if (diffMin < 0) {
                diffMin += 24 * 60; // cruce de medianoche
            }
            return diffMin / 60;
        }

        function updateDayRowState(dia) {
            calculateScheduleHours();
        }

        function resetScheduleUI() {
            document.getElementById('colab-horario-tipo').value = 'basico';
            const dias = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo'];
            dias.forEach(dia => {
                const row = document.querySelector(`.dia-row[data-dia="${dia}"]`);
                if (row) {
                    const chk = row.querySelector('.colab-dia-check');
                    chk.checked = (dia !== 'sabado' && dia !== 'domingo');
                    row.querySelector('.colab-dia-entrada').value = '09:00';
                    row.querySelector('.colab-dia-salida').value = '18:00';
                    row.querySelector('.colab-dia-colacion').value = '60';
                }
            });

            document.getElementById('colab-pd-entrada').value = '08:00';
            document.getElementById('colab-pd-salida').value = '16:00';
            document.getElementById('colab-pd-dias-cantidad').value = '5';
            document.getElementById('colab-pd-colacion').value = '60';
            toggleScheduleTypeUI();
        }

        function getScheduleDataJSON() {
            const tipo = document.getElementById('colab-horario-tipo').value;
            const horas_semanales = calculateScheduleHours();
            const data = { tipo, horas_semanales };

            if (tipo === 'basico' || tipo === 'medio_turno') {
                data.detalle = {};
                const dias = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo'];
                dias.forEach(dia => {
                    const row = document.querySelector(`.dia-row[data-dia="${dia}"]`);
                    if (row) {
                        data.detalle[dia] = {
                            trabaja: row.querySelector('.colab-dia-check').checked,
                            entrada: row.querySelector('.colab-dia-entrada').value,
                            salida: row.querySelector('.colab-dia-salida').value,
                            colacion: parseInt(row.querySelector('.colab-dia-colacion').value) || 0
                        };
                    }
                });
            } else if (tipo === 'por_dias') {
                data.entrada = document.getElementById('colab-pd-entrada').value;
                data.salida = document.getElementById('colab-pd-salida').value;
                data.dias_cantidad = parseInt(document.getElementById('colab-pd-dias-cantidad').value) || 0;
                data.colacion = parseInt(document.getElementById('colab-pd-colacion').value) || 0;
            }
            return JSON.stringify(data);
        }

        let colabFuncionesList = [];

        function addColaboradorFuncionUI() {
            const input = document.getElementById('colaborador-funcion-input');
            const val = input.value.trim();
            if (!val) return;

            colabFuncionesList.push(val);
            input.value = '';
            renderColabFuncionesList();
        }

        function removeColabFuncionUI(idx) {
            colabFuncionesList.splice(idx, 1);
            renderColabFuncionesList();
        }

        function renderColabFuncionesList() {
            const container = document.getElementById('colaborador-funciones-lista');
            if (!container) return;
            container.innerHTML = '';
            if (colabFuncionesList.length === 0) {
                container.innerHTML = '<div id="colaborador-funciones-empty" style="color: var(--text-muted); font-size: 0.8rem; font-style: italic;">No se han agregado funciones.</div>';
                return;
            }

            colabFuncionesList.forEach((fun, idx) => {
                const div = document.createElement('div');
                div.style.cssText = "display: flex; justify-content: space-between; align-items: center; background: rgba(255,255,255,0.04); padding: 0.35rem 0.5rem; border-radius: 4px; border: 1px solid rgba(255,255,255,0.05); font-size: 0.8rem; color:#fff;";
                div.innerHTML = `
                    <span>${fun}</span>
                    <button type="button" class="btn-icon text-danger" onclick="removeColabFuncionUI(${idx})" style="padding:0; min-width:auto; height:auto; background:none; border:none; display:inline-flex; align-items:center; cursor:pointer;">
                        <i data-lucide="x" style="width: 14px; height: 14px;"></i>
                    </button>
                `;
                container.appendChild(div);
            });
            lucide.createIcons();
        }

        function loadProfileCargos() {
            const tbody = document.getElementById('tbody-profile-cargos');
            if (!tbody) return;
            tbody.innerHTML = '<tr><td colspan="2" style="text-align:center; color:var(--text-muted);">Cargando cargos...</td></tr>';
            
            fetch('api.php?action=get_cargos')
                .then(res => res.json())
                .then(response => {
                    if (response.success) {
                        tbody.innerHTML = '';
                        if (response.data.length === 0) {
                            tbody.innerHTML = '<tr><td colspan="2" style="text-align:center; color:var(--text-muted); padding: 1rem;">No hay cargos registrados.</td></tr>';
                            return;
                        }
                        response.data.forEach(c => {
                            const tr = document.createElement('tr');
                            tr.innerHTML = `
                                <td style="padding: 0.5rem; color:#fff; font-weight:500;">${c.nombre}</td>
                                <td style="padding: 0.5rem; text-align: center; vertical-align: middle;">
                                    <button type="button" class="btn btn-secondary" onclick="deleteProfileCargo(${c.id})" style="padding: 0.25rem; width: 30px; height: 30px; min-width: auto; justify-content: center; display: inline-flex; border-color: var(--danger); color: var(--danger); background: transparent;">
                                        <i data-lucide="trash-2" style="width: 14px; height: 14px;"></i>
                                    </button>
                                </td>
                            `;
                            tbody.appendChild(tr);
                        });
                        lucide.createIcons();
                    }
                });
        }

        function addProfileCargo() {
            const nombre = prompt('Ingrese el nombre del nuevo cargo de colaborador (Ej: Conserje, Guardia, Jardinero):');
            if (!nombre || !nombre.trim()) return;

            const formData = new FormData();
            formData.append('nombre', nombre.trim());

            fetch('api.php?action=save_cargo', {
                method: 'POST',
                body: formData
            })
            .then(res => res.json())
            .then(response => {
                if (response.success) {
                    showToast(response.message, 'success');
                    loadProfileCargos();
                } else {
                    showToast(response.message, 'error');
                }
            })
            .catch(() => showToast('Error al registrar el cargo.', 'error'));
        }

        function deleteProfileCargo(id) {
            if (!confirm('¿Está seguro de eliminar este cargo? Solo se podrá eliminar si no tiene ningún colaborador asignado.')) return;

            const formData = new FormData();
            formData.append('id', id);

            fetch('api.php?action=delete_cargo', {
                method: 'POST',
                body: formData
            })
            .then(res => res.json())
            .then(response => {
                if (response.success) {
                    showToast(response.message, 'success');
                    loadProfileCargos();
                } else {
                    showToast(response.message, 'error');
                }
            })
            .catch(() => showToast('Error al eliminar el cargo.', 'error'));
        }

        // ================= MULTI-ROLE PORTAL LOGIC =================
        let currentRole = 'portal';
        let currentPortalUsuarioUnitId = null;
        let currentPortalColaboradorId = null;
        let portalReservaCalendarYear = new Date().getFullYear();
        let portalReservaCalendarMonth = new Date().getMonth();
        let portalReservaAreas = [];
        let portalReservaBookings = [];

        function switchRole(role) {
            currentRole = role;
            
            // Hide all
            document.getElementById('portal-role-container').style.display = 'none';
            document.getElementById('role-ti-container').style.display = 'none';
            document.getElementById('role-usuario-container').style.display = 'none';
            document.getElementById('role-colaborador-container').style.display = 'none';
            document.querySelector('.app-container').style.display = 'none';

            if (role === 'portal') {
                document.getElementById('portal-role-container').style.display = 'flex';
            } else if (role === 'ti') {
                document.getElementById('role-ti-container').style.display = 'block';
                loadTICondominios();
            } else if (role === 'admin') {
                document.querySelector('.app-container').style.display = 'flex';
                
                // Cargar datos contextuales del condominio seleccionado
                if (typeof loadSystemData === 'function') loadSystemData();
                if (typeof loadPropiedades === 'function') loadPropiedades();
                if (typeof loadEgresos === 'function') loadEgresos();
                if (typeof loadColaboradores === 'function') loadColaboradores();
                if (typeof loadCondominioProfile === 'function') loadCondominioProfile();
                if (typeof loadAdministradorProfile === 'function') loadAdministradorProfile();
                
                // Mostrar vista del Dashboard
                if (typeof switchView === 'function') {
                    switchView('dashboard');
                }
                
                // Actualizar marca del sidebar con nombre del condominio
                fetch('api.php?action=get_condominio_profile')
                .then(res => res.json())
                .then(response => {
                    if (response.success && response.data && response.data.condominio) {
                        document.querySelector('.brand-name').innerText = response.data.condominio.nombre;
                    }
                });
            } else if (role === 'usuario') {
                document.getElementById('role-usuario-container').style.display = 'block';
                loadPortalUsuarioPropiedades();
            } else if (role === 'colaborador') {
                document.getElementById('role-colaborador-container').style.display = 'block';
                loadPortalColaboradores();
            }

            if (window.lucide && typeof lucide.createIcons === 'function') {
                setTimeout(() => lucide.createIcons(), 50);
            }
        }

        // --- TI Dashboard Functions ---
        function loadTICondominios() {
            fetch('api.php?action=get_condominios')
            .then(res => res.json())
            .then(response => {
                if (response.success) {
                    const condominios = response.data;
                    const tbody = document.getElementById('tbody-ti-condominios');
                    tbody.innerHTML = '';
                    if (condominios.length === 0) {
                        tbody.innerHTML = '<tr><td colspan="6" style="text-align:center; color:var(--text-secondary); padding: 2rem;">No hay condominios registrados.</td></tr>';
                        return;
                    }
                    condominios.forEach(c => {
                        const tr = document.createElement('tr');
                        tr.innerHTML = `
                            <td style="padding: 0.8rem 0.5rem; font-weight: 600; color: #fff;">${c.nombre}</td>
                            <td style="padding: 0.8rem 0.5rem;">${c.rut || 'N/A'}</td>
                            <td style="padding: 0.8rem 0.5rem;">${c.direccion || 'N/A'}</td>
                            <td style="padding: 0.8rem 0.5rem; color: #fbbf24;"><i data-lucide="user" style="width:12px; height:12px; display:inline-block; vertical-align:middle; margin-right:4px;"></i>${c.administrador || 'No asignado'}</td>
                            <td style="padding: 0.8rem 0.5rem; text-align:center;"><span class="badge ${c.tipo_inmueble === 'condominio_edificios' ? 'badge-info' : 'badge-success'}">${c.tipo_inmueble === 'condominio_edificios' ? 'Edificio' : 'Casas'}</span></td>
                            <td style="padding: 0.8rem 0.5rem; text-align:center;">
                                <div style="display:flex; gap:0.5rem; justify-content:center; flex-wrap:wrap;">
                                    <button class="btn btn-primary" onclick="enterAsAdmin(${c.id})" style="font-size:0.75rem; padding:0.3rem 0.6rem; display:flex; align-items:center; gap:0.25rem; background: #0ea5e9; border-color:#0ea5e9;"><i data-lucide="shield-check" style="width:12px; height:12px;"></i> Admin</button>
                                    <button class="btn btn-secondary" onclick="enterAsResident(${c.id})" style="font-size:0.75rem; padding:0.3rem 0.6rem; display:flex; align-items:center; gap:0.25rem; color: #10b981; border-color: rgba(16,185,129,0.3);"><i data-lucide="users" style="width:12px; height:12px;"></i> Propietario</button>
                                    <button class="btn btn-secondary" onclick="enterAsWorker(${c.id})" style="font-size:0.75rem; padding:0.3rem 0.6rem; display:flex; align-items:center; gap:0.25rem; color: #f59e0b; border-color: rgba(245,158,11,0.3);"><i data-lucide="briefcase" style="width:12px; height:12px;"></i> Colab.</button>
                                    <button class="btn btn-secondary" onclick='openTICondominioModal(${JSON.stringify(c)})' style="font-size:0.75rem; padding:0.3rem 0.4rem;"><i data-lucide="edit" style="width:12px; height:12px;"></i></button>
                                    <button class="btn btn-danger" onclick="deleteTICondominio(${c.id})" style="font-size:0.75rem; padding:0.3rem 0.4rem;"><i data-lucide="trash-2" style="width:12px; height:12px;"></i></button>
                                </div>
                            </td>
                        `;
                        tbody.appendChild(tr);
                    });
                    lucide.createIcons();
                }
            });
        }

        function enterAsAdmin(condoId) {
            document.cookie = "active_condominio_id=" + condoId + "; path=/";
            window.location.href = 'index.php?role=admin';
        }

        function enterAsResident(condoId) {
            document.cookie = "active_condominio_id=" + condoId + "; path=/";
            window.location.href = 'index.php?role=usuario';
        }

        function enterAsWorker(condoId) {
            document.cookie = "active_condominio_id=" + condoId + "; path=/";
            window.location.href = 'index.php?role=colaborador';
        }

        function openTICondominioModal(condo = null) {
            const title = document.getElementById('ti-modal-title');
            document.getElementById('form-ti-condominio').reset();
            
            if (condo) {
                title.innerHTML = '<i data-lucide="edit-3" style="color: #8b5cf6; width: 20px; height: 20px;"></i> Editar Condominio';
                document.getElementById('ti-condo-id').value = condo.id;
                document.getElementById('ti-condo-nombre').value = condo.nombre;
                document.getElementById('ti-condo-rut').value = condo.rut;
                document.getElementById('ti-condo-direccion').value = condo.direccion;
                document.getElementById('ti-condo-tipo').value = condo.tipo_inmueble;
                document.getElementById('ti-condo-administrador').value = condo.administrador || '';
                document.getElementById('ti-condo-email').value = condo.email || '';
                document.getElementById('ti-condo-telefono').value = condo.telefono || '';
                document.getElementById('ti-condo-sitio').value = condo.sitio_web || '';
                document.getElementById('ti-condo-descripcion').value = condo.descripcion || '';
            } else {
                title.innerHTML = '<i data-lucide="edit-3" style="color: #8b5cf6; width: 20px; height: 20px;"></i> Registrar Nuevo Condominio';
                document.getElementById('ti-condo-id').value = '';
            }
            if (window.lucide && typeof lucide.createIcons === 'function') {
                lucide.createIcons();
            }
            // Scroll to form card
            const formCard = document.getElementById('ti-condo-form-card');
            if (formCard) {
                formCard.scrollIntoView({ behavior: 'smooth' });
            }
        }

        function clearTICondominioForm() {
            openTICondominioModal(null);
        }

        function closeTICondominioModal() {
            clearTICondominioForm();
        }

        function openSelectCondominioAdminModal() {
            fetch('api.php?action=get_condominios')
            .then(res => res.json())
            .then(response => {
                if (response.success) {
                    const dropdown = document.getElementById('select-condominio-admin-dropdown');
                    dropdown.innerHTML = '';
                    const condominios = response.data;
                    if (condominios.length === 0) {
                        dropdown.innerHTML = '<option value="">-- No hay condominios registrados --</option>';
                    } else {
                        condominios.forEach(c => {
                            const opt = document.createElement('option');
                            opt.value = c.id;
                            opt.innerText = c.nombre;
                            dropdown.appendChild(opt);
                        });
                    }
                    document.getElementById('modal-select-condominio-admin').classList.add('active');
                    if (window.lucide && typeof lucide.createIcons === 'function') {
                        lucide.createIcons();
                    }
                }
            });
        }

        function closeSelectCondominioAdminModal() {
            document.getElementById('modal-select-condominio-admin').classList.remove('active');
        }

        function submitSelectCondominioAdmin() {
            const condoId = document.getElementById('select-condominio-admin-dropdown').value;
            if (!condoId) {
                showToast('Seleccione un condominio válido.', 'error');
                return;
            }
            document.cookie = "active_condominio_id=" + condoId + "; path=/";
            closeSelectCondominioAdminModal();
            window.location.href = 'index.php?role=admin';
        }

        function submitTICondominio(e) {
            e.preventDefault();
            const id = document.getElementById('ti-condo-id').value;
            const nombre = document.getElementById('ti-condo-nombre').value;
            const rut = document.getElementById('ti-condo-rut').value;
            const direccion = document.getElementById('ti-condo-direccion').value;
            const tipo_inmueble = document.getElementById('ti-condo-tipo').value;
            const administrador = document.getElementById('ti-condo-administrador').value;
            const email = document.getElementById('ti-condo-email').value;
            const telefono = document.getElementById('ti-condo-telefono').value;
            const sitio_web = document.getElementById('ti-condo-sitio').value;
            const descripcion = document.getElementById('ti-condo-descripcion').value;

            const formData = new FormData();
            if (id) formData.append('id', id);
            formData.append('nombre', nombre);
            formData.append('rut', rut);
            formData.append('direccion', direccion);
            formData.append('tipo_inmueble', tipo_inmueble);
            formData.append('administrador', administrador);
            formData.append('email', email);
            formData.append('telefono', telefono);
            formData.append('sitio_web', sitio_web);
            formData.append('descripcion', descripcion);

            fetch('api.php?action=save_condominio', {
                method: 'POST',
                body: formData
            })
            .then(res => res.json())
            .then(response => {
                if (response.success) {
                    showToast(response.message, 'success');
                    clearTICondominioForm();
                    loadTICondominios();
                } else {
                    showToast(response.message, 'error');
                }
            })
            .catch(() => showToast('Error al procesar condominio.', 'error'));
        }

        function deleteTICondominio(id) {
            if (!confirm('¿Está seguro de eliminar este condominio? Se eliminarán de forma permanente todas sus unidades, colaboradores, gastos comunes, egresos e historiales.')) return;
            const formData = new FormData();
            formData.append('id', id);

            fetch('api.php?action=delete_condominio', {
                method: 'POST',
                body: formData
            })
            .then(res => res.json())
            .then(response => {
                if (response.success) {
                    showToast(response.message, 'success');
                    loadTICondominios();
                } else {
                    showToast(response.message, 'error');
                }
            })
            .catch(() => showToast('Error al eliminar condominio.', 'error'));
        }

        // --- Copropietarios Portal Functions ---
        function loadPortalUsuarioPropiedades() {
            fetch('api.php?action=get_condominios')
            .then(res => res.json())
            .then(response => {
                const selectCondo = document.getElementById('portal-usuario-condominio-select');
                selectCondo.innerHTML = '<option value="">-- Seleccione Condominio --</option>';
                if (response.success && response.data) {
                    response.data.forEach(c => {
                        const opt = document.createElement('option');
                        opt.value = c.id;
                        opt.innerText = c.nombre;
                        selectCondo.appendChild(opt);
                    });
                }
                
                // Clear properties dropdown
                const selectProp = document.getElementById('portal-usuario-propiedad-select');
                selectProp.innerHTML = '<option value="">-- Seleccione Condominio primero --</option>';
                document.getElementById('usuario-portal-content').style.display = 'none';
            });
        }

        function onSelectUsuarioCondominio() {
            const condoId = document.getElementById('portal-usuario-condominio-select').value;
            if (!condoId) {
                document.getElementById('portal-usuario-propiedad-select').innerHTML = '<option value="">-- Seleccione Condominio primero --</option>';
                document.getElementById('usuario-portal-content').style.display = 'none';
                return;
            }

            document.cookie = "active_condominio_id=" + condoId + "; path=/";

            fetch('api.php?action=get_propiedades')
            .then(res => res.json())
            .then(response => {
                const selectProp = document.getElementById('portal-usuario-propiedad-select');
                selectProp.innerHTML = '<option value="">-- Seleccione Unidad --</option>';
                if (response.success && response.data && response.data.propiedades) {
                    const props = response.data.propiedades.filter(p => p.tipo !== 'torre');
                    if (props.length === 0) {
                        selectProp.innerHTML = '<option value="">No hay unidades en este condominio</option>';
                        document.getElementById('usuario-portal-content').style.display = 'none';
                        return;
                    }
                    props.forEach(p => {
                        const opt = document.createElement('option');
                        opt.value = p.id;
                        opt.innerText = `${p.identificador} (${p.tipo === 'departamento' ? 'Depto' : p.tipo})`;
                        selectProp.appendChild(opt);
                    });
                    
                    document.getElementById('usuario-portal-content').style.display = 'none';
                }
            });
        }

        function onSelectUsuarioPropiedad() {
            const unitId = document.getElementById('portal-usuario-propiedad-select').value;
            if (!unitId) {
                document.getElementById('usuario-portal-content').style.display = 'none';
                return;
            }
            document.getElementById('usuario-portal-content').style.display = 'grid';
            currentPortalUsuarioUnitId = unitId;

            // Load unit card & residents
            fetch(`api.php?action=get_resident_ficha&propiedad_id=${unitId}`)
            .then(res => res.json())
            .then(response => {
                const body = document.getElementById('portal-usuario-ficha-body');
                body.innerHTML = '';
                if (response.success && response.data && response.data.ficha) {
                    const f = response.data.ficha;
                    const members = response.data.integrantes || [];
                    
                    let membersHtml = '';
                    if (members.length > 0) {
                        membersHtml = '<div style="margin-top: 0.5rem;"><strong style="color:#fff;">Co-habitantes registrados:</strong><ul style="margin:0.25rem 0 0 1rem; padding:0; list-style-type:disc; color:var(--text-secondary);">';
                        members.forEach(m => {
                            membersHtml += `<li>${m.nombres} ${m.apellidos} (${m.parentesco || 'Residente'})</li>`;
                        });
                        membersHtml += '</ul></div>';
                    }

                    const owner = members.find(m => parseInt(m.es_propietario) === 1);
                    const ownerName = owner ? `${owner.nombres} ${owner.apellidos}` : 'No registrado';
                    const ownerEmail = owner ? (owner.email || 'No registrado') : 'No registrado';
                    const ownerPhone = owner ? (owner.telefono || 'No registrado') : 'No registrado';
                    const patenteVal = f.patente || 'No registrada';
                    const estacionamientoVal = f.estacionamiento || 'No asignado';

                    body.innerHTML = `
                        <div><strong style="color:#fff;">Copropietario / Propietario:</strong> <span style="color:var(--text-secondary);">${ownerName}</span></div>
                        <div><strong style="color:#fff;">Email:</strong> <span style="color:var(--text-secondary);">${ownerEmail}</span></div>
                        <div><strong style="color:#fff;">Teléfono:</strong> <span style="color:var(--text-secondary);">${ownerPhone}</span></div>
                        <div><strong style="color:#fff;">Vehículo Patente:</strong> <span style="color:var(--text-secondary);">${patenteVal}</span></div>
                        <div><strong style="color:#fff;">Estacionamiento:</strong> <span style="color:var(--text-secondary);">${estacionamientoVal}</span></div>
                        ${membersHtml}
                    `;
                } else {
                    body.innerHTML = '<div style="color:var(--text-secondary); font-style:italic;">No hay ficha de residente registrada para esta unidad.</div>';
                }
            });

            // Load boletas list
            loadPortalUsuarioBoletas();

            // Load amenities and bookings
            loadPortalUsuarioReservas();
        }

        function submitResidentTicket(e) {
            e.preventDefault();
            const unitId = currentPortalUsuarioUnitId;
            if (!unitId) {
                showToast('Por favor, selecciona una unidad antes de enviar un ticket.', 'warning');
                return;
            }
            const nombre = document.getElementById('ticket-nombre').value.trim();
            const correo = document.getElementById('ticket-correo').value.trim();
            const tipo_asunto = document.getElementById('ticket-asunto-tipo').value;
            const descripcion = document.getElementById('ticket-descripcion').value.trim();

            if (!nombre || !correo || !tipo_asunto || !descripcion) {
                showToast('Por favor, completa todos los campos del formulario.', 'warning');
                return;
            }

            const formData = new FormData();
            formData.append('propiedad_id', unitId);
            formData.append('nombre', nombre);
            formData.append('correo', correo);
            formData.append('tipo_asunto', tipo_asunto);
            formData.append('descripcion', descripcion);

            fetch('api.php?action=save_ticket', {
                method: 'POST',
                body: formData
            })
            .then(res => res.json())
            .then(response => {
                if (response.success) {
                    showToast('Ticket enviado con éxito. El administrador revisará tu requerimiento.', 'success');
                    document.getElementById('form-resident-ticket').reset();
                } else {
                    showToast(response.message, 'error');
                }
            })
            .catch(() => {
                showToast('Error de red al enviar el ticket.', 'error');
            });
        }

        function loadTickets() {
            const tbody = document.getElementById('tbody-tickets-list');
            if (!tbody) return;
            tbody.innerHTML = '<tr><td colspan="6" style="text-align:center; color:var(--text-secondary);">Cargando tickets...</td></tr>';

            fetch('api.php?action=get_tickets')
                .then(res => res.json())
                .then(response => {
                    if (response.success) {
                        const list = response.data || [];
                        tbody.innerHTML = '';
                        if (list.length === 0) {
                            tbody.innerHTML = '<tr><td colspan="6" style="text-align:center; color:var(--text-secondary); font-style:italic;">No se han recibido tickets de contacto.</td></tr>';
                            return;
                        }

                        list.forEach(t => {
                            let typeBadgeColor = 'var(--text-secondary)';
                            if (t.tipo_asunto === 'reclamo') typeBadgeColor = '#ef4444';
                            else if (t.tipo_asunto === 'queja') typeBadgeColor = '#fbbf24';
                            else if (t.tipo_asunto === 'sugerencia') typeBadgeColor = '#3b82f6';
                            else if (t.tipo_asunto === 'consulta') typeBadgeColor = '#10b981';

                            const tr = document.createElement('tr');
                            tr.innerHTML = `
                                <td style="font-weight: 700; color:#fff;">${escapeHtml(t.unidad_nombre)}</td>
                                <td style="color:#fff;">${escapeHtml(t.nombre)}</td>
                                <td><a href="mailto:${escapeHtml(t.correo)}" style="color:var(--accent-color); text-decoration:none;">${escapeHtml(t.correo)}</a></td>
                                <td style="text-align:center;">
                                    <span style="display:inline-block; padding:0.25rem 0.6rem; border-radius:4px; font-size:0.7rem; font-weight:700; background:rgba(255,255,255,0.03); border:1px solid ${typeBadgeColor}; color:${typeBadgeColor}; text-transform:uppercase;">
                                        ${t.tipo_asunto}
                                    </span>
                                </td>
                                <td style="max-width:300px; overflow:hidden; text-overflow:ellipsis; white-space:normal; color:var(--text-secondary); line-height:1.4;">
                                    ${escapeHtml(t.descripcion)}
                                </td>
                                <td style="text-align:right; color:var(--text-secondary); font-size:0.75rem;">${t.creado_en}</td>
                            `;
                            tbody.appendChild(tr);
                        });
                    } else {
                        tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; color:#ef4444;">Error al cargar tickets: ${response.message}</td></tr>`;
                    }
                })
                .catch(() => {
                    tbody.innerHTML = '<tr><td colspan="6" style="text-align:center; color:#ef4444;">Error de red al cargar tickets.</td></tr>';
                });
        }

        function escapeHtml(str) {
            if (!str) return '';
            return str
                .replace(/&/g, "&amp;")
                .replace(/</g, "&lt;")
                .replace(/>/g, "&gt;")
                .replace(/"/g, "&quot;")
                .replace(/'/g, "&#039;");
        }

        function loadPortalUsuarioBoletas() {
            const unitId = currentPortalUsuarioUnitId;
            fetch(`api.php?action=get_propiedades`)
            .then(res => res.json())
            .then(response => {
                fetch(`api.php?action=get_periodos_gasto_comun`)
                .then(r => r.json())
                .then(res => {
                    const tbody = document.getElementById('tbody-portal-usuario-boletas');
                    const recentContainer = document.getElementById('portal-usuario-gastos-recientes');
                    tbody.innerHTML = '';
                    recentContainer.innerHTML = '';

                    if (res.success && res.data) {
                        const periodos = res.data;
                        if (periodos.length === 0) {
                            tbody.innerHTML = '<tr><td colspan="7" style="text-align:center; color:var(--text-secondary); padding: 1.5rem;">No hay cobros emitidos en este condominio.</td></tr>';
                            recentContainer.innerHTML = '<div style="color:var(--text-secondary); font-style:italic;">No hay cobros de gastos comunes recientes.</div>';
                            return;
                        }
                        
                        let promises = periodos.map(p => {
                            return fetch(`api.php?action=get_periodo_detalles&periodo_id=${p.id}`)
                                .then(resp => resp.json())
                                .then(detailsObj => {
                                    if (detailsObj.success && detailsObj.data && detailsObj.data.boletas) {
                                        const b = detailsObj.data.boletas.find(item => item.propiedad_id == unitId);
                                        if (b) {
                                            return { periodo: p, boleta: b };
                                        }
                                    }
                                    return null;
                                });
                        });

                        Promise.all(promises).then(results => {
                            const activeBoletas = results.filter(item => item !== null);
                            if (activeBoletas.length === 0) {
                                tbody.innerHTML = '<tr><td colspan="7" style="text-align:center; color:var(--text-secondary); padding: 1.5rem;">No se encontraron cobros para esta unidad.</td></tr>';
                                recentContainer.innerHTML = '<div style="color:var(--text-secondary); font-style:italic;">No hay cobros registrados para esta unidad.</div>';
                                return;
                            }

                            activeBoletas.sort((a,b) => b.periodo.id - a.periodo.id);

                            const recent = activeBoletas[0];
                            const estadoBadge = recent.boleta.pagado == 1 
                                ? `<span class="badge badge-success" style="padding:0.4rem 0.8rem; font-size:0.75rem;"><i data-lucide="check" style="width:12px; height:12px; display:inline-block; vertical-align:middle; margin-right:4px;"></i>Pagado</span>`
                                : `<span class="badge badge-danger" style="padding:0.4rem 0.8rem; font-size:0.75rem;"><i data-lucide="clock" style="width:12px; height:12px; display:inline-block; vertical-align:middle; margin-right:4px;"></i>Pendiente de Pago</span>`;
                            
                            recentContainer.innerHTML = `
                                <div style="background: rgba(255,255,255,0.02); border: 1px solid var(--border-color); border-radius: 8px; padding: 1.2rem; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem;">
                                    <div>
                                        <div style="font-size: 0.8rem; color: var(--text-secondary); text-transform: uppercase; font-weight: 700;">Último Período Emitido</div>
                                        <div style="font-size: 1.4rem; font-weight: 800; color: #fff; margin: 0.25rem 0;">${recent.periodo.mes_nombre}</div>
                                        <div style="font-size: 0.8rem; color: var(--text-secondary);">Vence el ${recent.periodo.fecha_vencimiento}</div>
                                    </div>
                                    <div style="text-align: right;">
                                        <div style="font-size: 0.8rem; color: var(--text-secondary);">Monto a Pagar</div>
                                        <div style="font-size: 1.6rem; font-weight: 900; color: #fff; margin: 0.25rem 0;">$${formatNumber(recent.boleta.total_cobrado)}</div>
                                        <div style="display: flex; gap: 0.5rem; justify-content: flex-end; align-items: center; margin-top:0.4rem;">
                                            ${estadoBadge}
                                            <button class="btn btn-secondary" onclick="downloadPortalUsuarioBoleta(${recent.boleta.id})" style="padding:0.3rem 0.6rem; font-size:0.75rem;"><i data-lucide="download" style="width:12px; height:12px;"></i> Descargar</button>
                                        </div>
                                    </div>
                                </div>
                            `;

                            activeBoletas.forEach(item => {
                                const tr = document.createElement('tr');
                                tr.innerHTML = `
                                    <td style="padding: 0.6rem 0.5rem; font-weight: 600; color:#fff;">${item.periodo.mes_nombre}</td>
                                    <td style="padding: 0.6rem 0.5rem; text-align: center;">${item.periodo.fecha_vencimiento}</td>
                                    <td style="padding: 0.6rem 0.5rem; text-align: right;">$${formatNumber(item.boleta.monto_prorrateado)}</td>
                                    <td style="padding: 0.6rem 0.5rem; text-align: right; color: var(--danger); font-weight: ${item.boleta.monto_mora > 0 ? '700' : 'normal'};">$${formatNumber(item.boleta.monto_mora)}</td>
                                    <td style="padding: 0.6rem 0.5rem; text-align: right; font-weight: bold; color: #fff;">$${formatNumber(item.boleta.total_cobrado)}</td>
                                    <td style="padding: 0.6rem 0.5rem; text-align: center;">
                                        <span class="badge ${item.boleta.pagado == 1 ? 'badge-success' : 'badge-danger'}" style="font-size:0.7rem; padding:0.2rem 0.4rem;">
                                            ${item.boleta.pagado == 1 ? 'Pagado' : 'Pendiente'}
                                        </span>
                                    </td>
                                    <td style="padding: 0.6rem 0.5rem; text-align: center;">
                                        <button class="btn btn-secondary" onclick="downloadPortalUsuarioBoleta(${item.boleta.id})" style="font-size:0.7rem; padding:0.25rem 0.5rem;"><i data-lucide="download" style="width:12px; height:12px;"></i> PDF</button>
                                    </td>
                                `;
                                tbody.appendChild(tr);
                            });
                            lucide.createIcons();
                        });
                    }
                });
            });
        }

        function downloadPortalUsuarioBoleta(boletaId) {
            window.open(`api.php?action=generate_boleta_pdf&id=${boletaId}`, '_blank');
        }

        // --- Portal Reserva de Áreas ---
        function loadPortalUsuarioReservas() {
            fetch('api.php?action=get_areas_comunes')
            .then(res => res.json())
            .then(response => {
                const select = document.getElementById('portal-reserva-area-id');
                select.innerHTML = '<option value="">-- Seleccione un recinto --</option>';
                portalReservaAreas = [];
                if (response.success && response.data) {
                    portalReservaAreas = response.data;
                    portalReservaAreas.forEach(a => {
                        const opt = document.createElement('option');
                        opt.value = a.id;
                        opt.innerText = `${a.nombre} ($${formatNumber(a.costo)})`;
                        select.appendChild(opt);
                    });
                }
                
                fetch('api.php?action=get_arriendos')
                .then(r => r.json())
                .then(resBook => {
                    portalReservaBookings = resBook.success ? resBook.data : [];
                    renderPortalReservaCalendar();
                });
            });
        }

        function onSelectPortalReservaArea() {
            const areaId = document.getElementById('portal-reserva-area-id').value;
            const inputMonto = document.getElementById('portal-reserva-monto');
            if (!areaId) {
                inputMonto.value = '';
                return;
            }
            const area = portalReservaAreas.find(a => a.id == areaId);
            if (area) {
                inputMonto.value = Math.round(area.costo);
            }
            checkPortalReservaConflictHint();
        }

        function checkPortalReservaConflictHint() {
            const areaId = document.getElementById('portal-reserva-area-id').value;
            const fecha = document.getElementById('portal-reserva-fecha').value;
            const start = document.getElementById('portal-reserva-hora-inicio').value;
            const end = document.getElementById('portal-reserva-hora-fin').value;
            const hint = document.getElementById('portal-reserva-conflict-hint');
            const btn = document.getElementById('btn-save-portal-reserva');

            if (hint) hint.style.display = 'none';
            if (btn) btn.disabled = false;

            if (!areaId || !fecha || !start || !end) return;

            const conflict = portalReservaBookings.some(b => {
                if (b.area_comun_id != areaId || b.fecha !== fecha) return false;
                return (start < b.hora_fin && end > b.hora_inicio);
            });

            if (conflict) {
                if (hint) hint.style.display = 'block';
                if (btn) btn.disabled = true;
            }
        }

        function changePortalReservaCalendarMonth(dir) {
            portalReservaCalendarMonth += dir;
            if (portalReservaCalendarMonth > 11) {
                portalReservaCalendarMonth = 0;
                portalReservaCalendarYear++;
            } else if (portalReservaCalendarMonth < 0) {
                portalReservaCalendarMonth = 11;
                portalReservaCalendarYear--;
            }
            renderPortalReservaCalendar();
        }

        function renderPortalReservaCalendar() {
            const grid = document.getElementById('portal-reserva-calendar-grid');
            const title = document.getElementById('portal-reserva-calendar-title');
            const legend = document.getElementById('portal-reserva-areas-legend');
            if (!grid) return;
            
            const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
            title.innerText = `${monthNames[portalReservaCalendarMonth]} ${portalReservaCalendarYear}`;
            
            legend.innerHTML = '';
            portalReservaAreas.forEach(a => {
                legend.innerHTML += `<span style="display:inline-flex; align-items:center; gap:0.25rem;"><span style="display:inline-block; width:10px; height:10px; border-radius:50%; background:${a.color};"></span>${a.nombre}</span>`;
            });

            grid.innerHTML = '';
            
            const daysOfWeek = ["Lu", "Ma", "Mi", "Ju", "Vi", "Sá", "Do"];
            daysOfWeek.forEach(d => {
                const headerCell = document.createElement('div');
                headerCell.style.background = 'rgba(255,255,255,0.03)';
                headerCell.style.color = 'var(--text-secondary)';
                headerCell.style.padding = '0.5rem';
                headerCell.style.fontSize = '0.7rem';
                headerCell.style.fontWeight = '700';
                headerCell.style.textAlign = 'center';
                grid.appendChild(headerCell);
                headerCell.innerText = d;
            });

            const firstDayIndex = new Date(portalReservaCalendarYear, portalReservaCalendarMonth, 1).getDay();
            const daysInMonth = new Date(portalReservaCalendarYear, portalReservaCalendarMonth + 1, 0).getDate();
            const offset = firstDayIndex === 0 ? 6 : firstDayIndex - 1;

            for (let i = 0; i < offset; i++) {
                const emptyCell = document.createElement('div');
                emptyCell.style.background = 'rgba(255,255,255,0.01)';
                grid.appendChild(emptyCell);
            }

            for (let day = 1; day <= daysInMonth; day++) {
                const cell = document.createElement('div');
                cell.style.background = '#18181b';
                cell.style.minHeight = '65px';
                cell.style.padding = '0.25rem';
                cell.style.border = '1px solid rgba(255,255,255,0.03)';
                cell.style.display = 'flex';
                cell.style.flexDirection = 'column';
                cell.style.justifyContent = 'space-between';
                cell.style.cursor = 'pointer';
                cell.style.transition = 'all 0.2s';
                
                cell.onmouseover = () => cell.style.background = 'rgba(255,255,255,0.03)';
                cell.onmouseout = () => cell.style.background = '#18181b';

                const dayStr = `${portalReservaCalendarYear}-${String(portalReservaCalendarMonth + 1).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
                
                cell.onclick = () => {
                    document.getElementById('portal-reserva-fecha').value = dayStr;
                    checkPortalReservaConflictHint();
                };

                const number = document.createElement('span');
                number.innerText = day;
                number.style.fontSize = '0.75rem';
                number.style.fontWeight = '700';
                number.style.color = 'var(--text-secondary)';
                cell.appendChild(number);

                const dayBookings = portalReservaBookings.filter(b => b.fecha === dayStr);
                if (dayBookings.length > 0) {
                    const badgeContainer = document.createElement('div');
                    badgeContainer.style.display = 'flex';
                    badgeContainer.style.flexDirection = 'column';
                    badgeContainer.style.gap = '2px';
                    badgeContainer.style.marginTop = '0.25rem';

                    dayBookings.forEach(b => {
                        const area = portalReservaAreas.find(a => a.id == b.area_comun_id);
                        const bColor = area ? area.color : '#3b82f6';
                        const aName = area ? area.nombre : 'Área';
                        
                        const badge = document.createElement('div');
                        badge.style.background = bColor;
                        badge.style.color = '#fff';
                        badge.style.fontSize = '0.6rem';
                        badge.style.padding = '1px 3px';
                        badge.style.borderRadius = '3px';
                        badge.style.fontWeight = '600';
                        badge.style.whiteSpace = 'nowrap';
                        badge.style.overflow = 'hidden';
                        badge.style.textOverflow = 'ellipsis';
                        badge.title = `${aName} (${b.hora_inicio} - ${b.hora_fin})\nUnidad: ${b.propiedad_identificador || 'N/A'}`;
                        badge.innerText = `${b.hora_inicio} ${aName}`;
                        badgeContainer.appendChild(badge);
                    });
                    cell.appendChild(badgeContainer);
                }

                grid.appendChild(cell);
            }
        }

        function submitPortalUsuarioReserva(e) {
            e.preventDefault();
            const area_comun_id = document.getElementById('portal-reserva-area-id').value;
            const fecha = document.getElementById('portal-reserva-fecha').value;
            const hora_inicio = document.getElementById('portal-reserva-hora-inicio').value;
            const hora_fin = document.getElementById('portal-reserva-hora-fin').value;
            const monto_pagado = document.getElementById('portal-reserva-monto').value;
            const observaciones = document.getElementById('portal-reserva-observaciones').value;

            if (!area_comun_id || !fecha || !hora_inicio || !hora_fin) {
                showToast('Complete todos los campos marcados con asterisco (*)', 'error');
                return;
            }

            const formData = new FormData();
            formData.append('area_comun_id', area_comun_id);
            formData.append('propiedad_id', currentPortalUsuarioUnitId);
            formData.append('fecha', fecha);
            formData.append('hora_inicio', hora_inicio);
            formData.append('hora_fin', hora_fin);
            formData.append('monto_pagado', monto_pagado);
            formData.append('observaciones', observaciones);

            fetch('api.php?action=save_arriendo', {
                method: 'POST',
                body: formData
            })
            .then(res => res.json())
            .then(response => {
                if (response.success) {
                    showToast(response.message, 'success');
                    document.getElementById('form-portal-usuario-reserva').reset();
                    loadPortalUsuarioReservas();
                } else {
                    showToast(response.message, 'error');
                }
            })
            .catch(() => showToast('Error al enviar la reserva.', 'error'));
        }

        // --- Colaboradores Portal Functions ---
        function loadPortalColaboradores() {
            fetch('api.php?action=get_condominios')
            .then(res => res.json())
            .then(response => {
                const selectCondo = document.getElementById('portal-colaborador-condominio-select');
                selectCondo.innerHTML = '<option value="">-- Seleccione Condominio --</option>';
                if (response.success && response.data) {
                    response.data.forEach(c => {
                        const opt = document.createElement('option');
                        opt.value = c.id;
                        opt.innerText = c.nombre;
                        selectCondo.appendChild(opt);
                    });
                }
                
                // Clear colaboradores select
                const selectCol = document.getElementById('portal-colaborador-select');
                selectCol.innerHTML = '<option value="">-- Seleccione Condominio primero --</option>';
                document.getElementById('colaborador-portal-content').style.display = 'none';
            });
        }

        function onSelectColaboradorCondominio() {
            const condoId = document.getElementById('portal-colaborador-condominio-select').value;
            if (!condoId) {
                document.getElementById('portal-colaborador-select').innerHTML = '<option value="">-- Seleccione Condominio primero --</option>';
                document.getElementById('colaborador-portal-content').style.display = 'none';
                return;
            }

            document.cookie = "active_condominio_id=" + condoId + "; path=/";

            fetch('api.php?action=get_colaboradores')
            .then(res => res.json())
            .then(response => {
                const select = document.getElementById('portal-colaborador-select');
                select.innerHTML = '<option value="">-- Seleccione Colaborador --</option>';
                if (response.success && response.data) {
                    const colabs = response.data;
                    if (colabs.length === 0) {
                        select.innerHTML = '<option value="">No hay colaboradores en este condominio</option>';
                        document.getElementById('colaborador-portal-content').style.display = 'none';
                        return;
                    }
                    colabs.forEach(c => {
                        const opt = document.createElement('option');
                        opt.value = c.id;
                        opt.innerText = `${c.apellidos}, ${c.nombres} (${c.cargo_nombre || 'Cargo N/A'})`;
                        select.appendChild(opt);
                    });

                    document.getElementById('colaborador-portal-content').style.display = 'none';
                }
            });
        }

        function onSelectPortalColaborador() {
            const colabId = document.getElementById('portal-colaborador-select').value;
            if (!colabId) {
                document.getElementById('colaborador-portal-content').style.display = 'none';
                return;
            }
            document.getElementById('colaborador-portal-content').style.display = 'grid';
            currentPortalColaboradorId = colabId;

            fetch(`api.php?action=get_colaborador&id=${colabId}`)
            .then(res => res.json())
            .then(response => {
                if (response.success && response.data) {
                    const c = response.data.colaborador;
                    const liquidaciones = response.data.liquidaciones || [];

                    const card = document.getElementById('portal-colaborador-ficha-body');
                    const contractBtnHtml = c.contrato_ruta 
                        ? `<a href="${c.contrato_ruta}" target="_blank" class="btn btn-secondary" style="font-size:0.75rem; padding:0.4rem; margin-top:0.5rem; text-align:center; display:block;"><i data-lucide="file-down" style="width:12px; height:12px; display:inline-block; vertical-align:middle; margin-right:4px;"></i> Descargar Contrato de Trabajo (PDF)</a>`
                        : `<div style="font-size:0.75rem; color:var(--text-secondary); margin-top:0.5rem; font-style:italic;">Contrato no digitalizado por el administrador</div>`;
                    
                    card.innerHTML = `
                        <div><strong style="color:#fff;">Nombre:</strong> <span style="color:var(--text-secondary);">${c.nombres} ${c.apellidos}</span></div>
                        <div><strong style="color:#fff;">Cargo:</strong> <span style="color:#fbbf24; font-weight:700;">${c.cargo_nombre || 'General'}</span></div>
                        <div><strong style="color:#fff;">Tipo Contrato:</strong> <span style="color:var(--text-secondary);">${c.tipo_contrato || 'N/A'}</span></div>
                        <div><strong style="color:#fff;">Email:</strong> <span style="color:var(--text-secondary);">${c.email || 'N/A'}</span></div>
                        <div><strong style="color:#fff;">Teléfono:</strong> <span style="color:var(--text-secondary);">${c.telefono || 'N/A'}</span></div>
                        <div><strong style="color:#fff;">Contacto de Emergencia:</strong> <span style="color:var(--text-secondary);">${c.contacto_emergencia_nombre || 'N/A'} (${c.contacto_emergencia_telefono || ''})</span></div>
                        ${contractBtnHtml}
                    `;

                    // Mostrar u ocultar panel de pedidos de insumos según asignación
                    const insumosPanel = document.getElementById('portal-colaborador-insumos-panel');
                    if (insumosPanel) {
                        insumosPanel.style.display = parseInt(c.permitir_insumos) === 1 ? 'block' : 'none';
                    }

                    const scheduleContainer = document.getElementById('portal-colaborador-horario-body');
                    scheduleContainer.innerHTML = '';
                    if (c.horario_trabajo) {
                        try {
                            const sched = JSON.parse(c.horario_trabajo);
                            if (sched.tipo === 'por_dias') {
                                let colacionText = '';
                                if (sched.colacion && sched.colacion > 0) {
                                    colacionText = `<div style="margin-top:0.4rem; padding:0.3rem 0.5rem; background:rgba(251,191,36,0.08); border:1px solid rgba(251,191,36,0.2); border-radius:6px; font-size:0.75rem; color:#fbbf24;"><i data-lucide="coffee" style="width:12px; height:12px; display:inline-block; margin-right:4px; vertical-align:middle;"></i> Colación diaria: <strong>${sched.colacion} min.</strong></div>`;
                                }
                                scheduleContainer.innerHTML = `
                                    <div style="display:flex; flex-direction:column; gap:0.4rem;">
                                        <div style="font-size:0.85rem; color:#fff;"><strong>Horario por Días:</strong></div>
                                        <div style="font-size:0.8rem; color:var(--text-secondary);">
                                            Se trabaja un total de <strong>${sched.dias_cantidad} días</strong> por semana.
                                        </div>
                                        <div style="display:flex; justify-content:space-between; font-size:0.8rem; border-bottom:1px solid rgba(255,255,255,0.02); padding-bottom:3px;">
                                            <span style="font-weight:600; color:#fff;">Entrada:</span>
                                            <span style="color:var(--accent-color);">${sched.entrada || '--:--'}</span>
                                        </div>
                                        <div style="display:flex; justify-content:space-between; font-size:0.8rem; border-bottom:1px solid rgba(255,255,255,0.02); padding-bottom:3px;">
                                            <span style="font-weight:600; color:#fff;">Salida:</span>
                                            <span style="color:var(--accent-color);">${sched.salida || '--:--'}</span>
                                        </div>
                                        <div style="margin-top:0.5rem; font-size:0.85rem; font-weight:700; color:#fff; display:flex; justify-content:space-between; border-top:1px solid var(--border-color); padding-top:0.5rem;">
                                            <span>Total Horas Semanales:</span>
                                            <span style="color:var(--accent-color);">${(sched.horas_semanales || 0).toFixed(1)} hrs</span>
                                        </div>
                                        ${colacionText}
                                    </div>
                                `;
                            } else {
                                // Básico o Medio Turno
                                const daysMap = {
                                    'lunes': 'Lunes',
                                    'martes': 'Martes',
                                    'miercoles': 'Miércoles',
                                    'jueves': 'Jueves',
                                    'viernes': 'Viernes',
                                    'sabado': 'Sábado',
                                    'domingo': 'Domingo'
                                };

                                let totalColacion = 0;
                                let hasColacion = false;
                                const details = sched.detalle || {};

                                scheduleContainer.innerHTML = `
                                    <div style="display:flex; flex-direction:column; gap:0.4rem;">
                                        ${Object.keys(daysMap).map(dKey => {
                                            const dayInfo = details[dKey] || {};
                                            const active = dayInfo.trabaja === true;
                                            const entry = active ? (dayInfo.entrada || '--:--') : '--:--';
                                            const exit = active ? (dayInfo.salida || '--:--') : '--:--';
                                            if (active && dayInfo.colacion > 0) {
                                                totalColacion += dayInfo.colacion;
                                                hasColacion = true;
                                            }
                                            return `
                                                <div style="display:flex; justify-content:space-between; font-size:0.8rem; border-bottom:1px solid rgba(255,255,255,0.02); padding-bottom:3px;">
                                                    <span style="font-weight:600; color:${active ? '#fff' : 'var(--text-secondary)'};">${daysMap[dKey]}</span>
                                                    <span style="color:${active ? 'var(--accent-color)' : 'var(--text-secondary)'};">${active ? `${entry} a ${exit}` : 'Libre'}</span>
                                                </div>
                                            `;
                                        }).join('')}
                                        <div style="margin-top:0.5rem; font-size:0.85rem; font-weight:700; color:#fff; display:flex; justify-content:space-between; border-top:1px solid var(--border-color); padding-top:0.5rem;">
                                            <span>Total Horas Semanales:</span>
                                            <span style="color:var(--accent-color);">${(sched.horas_semanales || 0).toFixed(1)} hrs</span>
                                        </div>
                                        ${hasColacion ? `<div style="margin-top:0.4rem; padding:0.3rem 0.5rem; background:rgba(251,191,36,0.08); border:1px solid rgba(251,191,36,0.2); border-radius:6px; font-size:0.75rem; color:#fbbf24;"><i data-lucide="coffee" style="width:12px; height:12px; display:inline-block; margin-right:4px; vertical-align:middle;"></i> Cuenta con tiempos de colación configurados por día.</div>` : ''}
                                    </div>
                                `;
                            }
                        } catch (err) {
                            scheduleContainer.innerHTML = '<div style="color:var(--text-secondary); font-style:italic;">Error al parsear el horario laboral.</div>';
                        }
                    } else {
                        scheduleContainer.innerHTML = '<div style="color:var(--text-secondary); font-style:italic;">No hay horario asignado.</div>';
                    }

                    const funcList = document.getElementById('portal-colaborador-funciones-list');
                    funcList.innerHTML = '';
                    if (c.funciones) {
                        try {
                            const funcs = JSON.parse(c.funciones);
                            if (funcs.length > 0) {
                                funcs.forEach(f => {
                                    funcList.innerHTML += `<li>${f}</li>`;
                                });
                            } else {
                                funcList.innerHTML = '<li style="list-style:none; font-style:italic; color:var(--text-secondary);">Sin funciones asignadas.</li>';
                            }
                        } catch (err) {
                            funcList.innerHTML = '<li style="list-style:none; font-style:italic; color:var(--text-secondary);">Error al procesar las funciones principales.</li>';
                        }
                    } else {
                        funcList.innerHTML = '<li style="list-style:none; font-style:italic; color:var(--text-secondary);">Sin funciones asignadas.</li>';
                    }

                    const tbodyLiq = document.getElementById('tbody-portal-colaborador-liquidaciones');
                    tbodyLiq.innerHTML = '';
                    if (liquidaciones.length === 0) {
                        tbodyLiq.innerHTML = '<tr><td colspan="2" style="text-align:center; color:var(--text-secondary); padding:1rem; font-style:italic;">No hay liquidaciones emitidas.</td></tr>';
                    } else {
                        liquidaciones.forEach(liq => {
                            const tr = document.createElement('tr');
                            tr.innerHTML = `
                                <td style="padding:0.5rem; color:#fff; font-weight:600;">${liq.periodo}</td>
                                <td style="padding:0.5rem; text-align:center;">
                                    <a href="${liq.documento_ruta}" target="_blank" class="btn btn-secondary" style="font-size:0.7rem; padding:0.2rem 0.4rem; display:inline-flex; align-items:center; gap:0.25rem;"><i data-lucide="download" style="width:12px; height:12px;"></i> PDF</a>
                                </td>
                            `;
                            tbodyLiq.appendChild(tr);
                        });
                    }

                    loadPortalColaboradorPedidos();

                    lucide.createIcons();
                }
            });
        }

        function loadPortalColaboradorPedidos() {
            const colabId = currentPortalColaboradorId;
            fetch(`api.php?action=get_pedidos_insumos&colaborador_id=${colabId}`)
            .then(res => res.json())
            .then(response => {
                const tbody = document.getElementById('tbody-portal-colaborador-pedidos');
                tbody.innerHTML = '';
                if (response.success && response.data) {
                    const pedidos = response.data;
                    if (pedidos.length === 0) {
                        tbody.innerHTML = '<tr><td colspan="4" style="text-align:center; color:var(--text-secondary); padding:1rem; font-style:italic;">No has solicitado insumos.</td></tr>';
                        return;
                    }
                    pedidos.forEach(p => {
                        const tr = document.createElement('tr');
                        let badgeClass = 'badge-secondary';
                        if (p.estado === 'aprobado') badgeClass = 'badge-success';
                        if (p.estado === 'rechazado') badgeClass = 'badge-danger';
                        
                        tr.innerHTML = `
                            <td style="padding:0.5rem; color:#fff; font-weight:600;">${p.item_nombre}</td>
                            <td style="padding:0.5rem; text-align:center;">${p.cantidad}</td>
                            <td style="padding:0.5rem; text-align:center; text-transform:capitalize;">${p.categoria}</td>
                            <td style="padding:0.5rem; text-align:center;">
                                <span class="badge ${badgeClass}" style="font-size:0.65rem; padding:0.15rem 0.3rem;">${p.estado}</span>
                            </td>
                        `;
                        tbody.appendChild(tr);
                    });
                }
            });
        }

        function submitPortalColaboradorInsumo(e) {
            e.preventDefault();
            const colabId = currentPortalColaboradorId;
            const item_nombre = document.getElementById('portal-insumo-nombre').value;
            const cantidad = document.getElementById('portal-insumo-cantidad').value;
            const categoria = document.getElementById('portal-insumo-categoria').value;
            const observaciones = document.getElementById('portal-insumo-observaciones').value;

            if (!item_nombre || cantidad <= 0) return;

            const formData = new FormData();
            formData.append('colaborador_id', colabId);
            formData.append('item_nombre', item_nombre);
            formData.append('cantidad', cantidad);
            formData.append('categoria', categoria);
            formData.append('observaciones', observaciones);

            fetch('api.php?action=save_pedido_insumos', {
                method: 'POST',
                body: formData
            })
            .then(res => res.json())
            .then(response => {
                if (response.success) {
                    showToast(response.message, 'success');
                    document.getElementById('form-portal-colaborador-insumos').reset();
                    loadPortalColaboradorPedidos();
                } else {
                    showToast(response.message, 'error');
                }
            })
            .catch(() => showToast('Error al enviar la solicitud.', 'error'));
        }
        
        function formatNumber(num) {
            if (!num) return '0';
            return parseFloat(num).toLocaleString('es-CL');
        }
        
        document.addEventListener('DOMContentLoaded', () => {
            const sidebar = document.getElementById('sidebar');
            if (sidebar) {
                const footer = document.createElement('div');
                footer.style.padding = '1rem';
                footer.style.borderTop = '1px solid var(--border-color)';
                footer.style.marginTop = 'auto';
                footer.innerHTML = `
                    <button class="btn btn-secondary" onclick="switchRole('portal')" style="width:100%; display:flex; align-items:center; justify-content:center; gap:0.5rem; font-size:0.8rem; padding:0.5rem;">
                        <i data-lucide="log-out" style="width:14px; height:14px;"></i> Volver al Portal
                    </button>
                `;
                sidebar.appendChild(footer);
                lucide.createIcons();
            }
        });
        
        document.addEventListener('DOMContentLoaded', () => {
            const match = document.cookie.match(new RegExp('(^| )active_condominio_id=([^;]+)'));
            if (!match) {
                document.cookie = "active_condominio_id=1; path=/";
            }
        });
        
        window.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                closeTICondominioModal();
            }
        });
        
        document.addEventListener('DOMContentLoaded', () => {
            const origSetup = document.getElementById('onboarding-wizard-container');
            if (origSetup) {
                const observer = new MutationObserver(() => {
                    if (currentRole !== 'admin' && origSetup.style.display !== 'none') {
                        origSetup.style.display = 'none';
                    }
                });
                observer.observe(origSetup, { attributes: true, attributeFilter: ['style'] });
            }
        });
        
        function checkOnboardingStatus() {
            fetch('api.php?action=check_onboarding')
            .then(res => res.json())
            .then(response => {
                if (response.success && response.data) {
                    const onboarding = response.data.needs_onboarding;
                    const wizard = document.getElementById('onboarding-wizard-container');
                    if (onboarding) {
                        if (currentRole === 'admin') {
                            if (wizard) wizard.style.display = 'flex';
                        }
                    } else {
                        if (wizard) wizard.style.display = 'none';
                    }
                }
            });
        }
    </script>    <!-- ================= MODAL: SELECCIONAR CONDOMINIO PARA ADMINISTRACIÓN ================= -->
    <div id="modal-select-condominio-admin" class="modal-overlay">
        <div class="modal-card" style="max-width: 450px; padding: 2rem; border-radius: 12px; background: #121214; border: 1px solid var(--border-color);">
            <div class="modal-header" style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border-color); padding-bottom: 1rem; margin-bottom: 1.5rem;">
                <h3 style="margin: 0; color: #fff; font-size: 1.2rem; font-weight: 700; display: flex; align-items: center; gap: 0.5rem;">
                    <i data-lucide="building" style="color: #0ea5e9;"></i> Seleccionar Condominio
                </h3>
                <span class="close-btn" onclick="closeSelectCondominioAdminModal()" style="cursor: pointer; font-size: 1.5rem; color: var(--text-secondary);">&times;</span>
            </div>
            <div class="form-group" style="margin-bottom: 1.5rem;">
                <label for="select-condominio-admin-dropdown" style="font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 0.5rem; display: block;">Elija el condominio que desea visualizar y administrar:</label>
                <select id="select-condominio-admin-dropdown" class="form-control" style="height: 40px; font-size: 0.9rem; padding: 0.4rem 0.6rem;"></select>
            </div>
            <div style="display: flex; gap: 1rem; justify-content: flex-end;">
                <button type="button" class="btn btn-secondary" onclick="closeSelectCondominioAdminModal()" style="font-size: 0.85rem;">Cancelar</button>
                <button type="button" class="btn btn-primary" onclick="submitSelectCondominioAdmin()" style="font-size: 0.85rem; background: #0ea5e9; border-color: #0ea5e9;">Ingresar al Panel</button>
            </div>
        </div>
    </div>
</body>
</html>
