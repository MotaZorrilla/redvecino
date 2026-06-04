# 🏢 MANUAL DE ORGANIZACIÓN OPERATIVA Y CONTABLE (RedVecino & MiVecino)

Este manual documenta formalmente la organización interna de roles, la parametrización de condominios, el motor de cálculo de Gastos Comunes (GGCC) y el motor contable de remuneraciones para colaboradores del ecosistema **RedVecino & MiVecino**.

---

## 🔑 1. Jerarquía de Roles y Atribuciones Operativas

La arquitectura administrativa del sistema se estructura en tres niveles jerárquicos clave, garantizando un control granular y seguridad de datos:

```mermaid
graph TD
    TI[1. Soporte TI (Root)] -->|Crea y gestiona| SU[2. Super Usuario]
    SU -->|Adquiere el servicio y crea| ADM[3. Administrador de Condominio]
    ADM -->|Gestiona| CONDO[Condominio y Operaciones]
```

### 1.1 Soporte TI (Root / DevOps)
*   **Misión:** Mantener y asegurar el buen funcionamiento de la infraestructura global de las plataformas RedVecino y MiVecino.
*   **Atribuciones y Funciones:**
    *   Controlar y monitorizar la telemetría del sistema (CPU, RAM, Latencia).
    *   Recibir, diagnosticar y corregir cualquier ticket de mal funcionamiento del sistema (Soporte Técnico).
    *   **Crear al Super Usuario** (comprador inicial de la licencia del servicio).
    *   Control absoluto sobre todos los usuarios, perfiles, roles y permisos dentro del sistema (Spatie RBAC).

### 1.2 Super Usuario (Comprador del Servicio / Licenciatario)
*   **Misión:** Actuar como el cliente corporativo o institucional que adquiere la suite de servicios.
*   **Atribuciones y Funciones:**
    *   Comprador directo de la suite de software como Servicio (SaaS).
    *   **Crear cuentas de Administradores** para operar los condominios adquiridos.
    *   Modificar, suspender o eliminar cuentas de administradores del sistema.

### 1.3 Administrador del Condominio
*   **Misión:** Organizar, registrar y operar comercial y financieramente cada comunidad de manera autónoma.
*   **Atribuciones y Funciones:**
    *   **Primera Parte - Definir el Condominio:**
        *   Crear Condominio detallando Nombre, ROL o RUT, y Dirección física.
        *   Definir tipo de condominio (Casas, Edificios, Mixto).
        *   Establecer cantidad de unidades (Torres, manzanas, casas).
        *   Definir modelos por $m^2$ (representados mediante Letras o Números).
        *   Determinar el porcentaje de Alícuota / Prorrateo basado en los $m^2$ de cada unidad.
        *   Generar los IDs y números correlativos de las unidades.
    *   **Segunda Parte - Control Contable (Ingresos y Egresos):**
        *   Registrar Ingresos contables (gastos comunes ordinarios, multas, arriendos de espacios comunes, intereses, aportes extraordinarios).
        *   Registrar Egresos contables (sueldos del personal, servicios básicos comunes, contratos de mantención, insumos de seguridad y limpieza).
    *   **Tercera Parte - Generación de Documentos Contables:**
        *   Generar los cobros masivos mensuales de Gastos Comunes (GGCC).
        *   Configurar los modelos de resumen de cobro de gastos comunes.
        *   Configurar los modelos de desglose analítico de egresos del mes.
        *   Generar contratos de colaboradores de la comunidad:
            *   *Modelo de Contrato para Conserjes / Recepcionistas:* Se establecen dos primeros contratos a plazo de 3 meses cada uno; transcurrido este periodo, pasa a contrato de plazo indefinido.
            *   *Modelo de Contrato para Personal de Mantenimiento:* Se establecen dos primeros contratos a plazo de 3 meses cada uno; transcurrido este periodo, pasa a contrato de plazo indefinido.
        *   Generar Liquidaciones de Remuneración de colaboradores de forma mensual.
        *   Generar Finiquitos de contrato oficiales (término de la relación laboral).

---

## 📊 2. Motor de Prorrateo y Gastos Comunes (Aires de Chiguayante II)

Basado en las planillas de cobro reales de **Abril de 2026** para la **Torre 1-42**, el motor financiero del sistema ejecuta de forma matemática el cálculo de cobro por unidad:

### 2.1 Variables del Condominio
*   **Total de Gastos Prorrateables del Mes ($E_{total}$):** `$5.922.800`
*   **Fondo de Reserva Estipulado ($FR_{pct}$):** $5.000\%$ sobre la base del total de gastos comunes ($E_{total}$).
*   **Coeficiente de Prorrateo de la Unidad ($P_{unidad}$):** `0.0067220000` (equivalente al $0.6722\%$).
*   **Cargas Individuales de la Unidad ($C_{ind}$):** `$2.981` (Servicio CGE Torre 1).

### 2.2 Fórmulas de Prorrateo Aplicadas

1.  **Cálculo de Gasto Común Base de la Unidad ($G$):**
    $$G = E_{total} \times P_{unidad}$$
    $$G = \$5.922.800 \times 0.006722 = \mathbf{\$39.813}$$

2.  **Cálculo de Fondo de Reserva de la Unidad ($FR$):**
    $$FR = (E_{total} \times 0.05) \times P_{unidad}$$
    $$FR = \$296.140 \times 0.006722 = \mathbf{\$1.991}$$

3.  **Cálculo del Total Gastos Comunes del Mes de la Unidad ($T_{mes}$):**
    $$T_{mes} = G + FR + C_{ind}$$
    $$T_{mes} = \$39.813 + \$1.991 + \$2.981 = \mathbf{\$44.785}$$

4.  **Cálculo de Obligación Económica Final a Pagar ($Total_{unidad}$):**
    $$Total_{unidad} = T_{mes} + Saldo_{anterior} + Intereses$$
    $$Total_{unidad} = \$44.785 + \$0 + \$0 = \mathbf{\$44.785}$$

---

## 👷 3. Motor de Remuneraciones y Liquidación (René Ambiado)

Basado en la liquidación de sueldo del auxiliar de aseo **René Ambiado** para el periodo de **Marzo de 2026** (bajo la administración de *Enrique Tirapegui T.*), se detallan las reglas y porcentajes de cotización previsional de la plataforma:

### 3.1 Desglose de Haberes
*   **Haberes Imponibles:**
    *   Sueldo Base Pactado ($H_{imp}$): **`$539.000`** (30 días de trabajo).
*   **Haberes No Imponibles:**
    *   Asignación de Locomoción ($A_{loc}$): **`$66.896`**
    *   Asignación de Colación ($A_{col}$): **`$66.896`**
    *   Total Haberes No Imponibles ($H_{no\_imp}$): **`$133.592`**

$$\text{Total Haberes Bruto } (H_{total}) = H_{imp} + H_{no\_imp}$$
$$H_{total} = \$539.000 + \$133.592 = \mathbf{\$672.592}$$

### 3.2 Desglose de Deducciones Previsionales (Calculado sobre el Sueldo Imponible $H_{imp}$)
*   **Cotización de Salud (Fonasa):** $7.00\%$
    $$\text{Salud} = H_{imp} \times 0.07 = \$539.000 \times 0.07 = \mathbf{\$37.730}$$
*   **Fondo de Pensión (AFP Capital):** $11.44\%$
    $$\text{Pensión} = H_{imp} \times 0.1144 = \$539.000 \times 0.1144 = \mathbf{\$61.662}$$
*   **Seguro de Cesantía (AFC Colaborador):** $0.60\%$
    $$\text{Cesantía} = H_{imp} \times 0.006 = \$539.000 \times 0.006 = \mathbf{\$3.234}$$

$$\text{Total Descuentos Previsionales } (D_{total}) = \$37.730 + \$61.662 + \$3.234 = \mathbf{\$102.626}$$

### 3.3 Sueldo Líquido a Transferir
$$S_{liquido} = H_{total} - D_{total}$$
$$S_{liquido} = \$672.592 - \$102.626 = \mathbf{\$569.966}$$

---

## 🤖 4. Estructura JSON para Lectura Automatizada de IA

Este bloque JSON permite a cualquier agente inteligente o módulo de backend procesar la estructura lógica de este manual sin ambigüedades:

```json
{
  "system": "RedVecino & MiVecino",
  "version": "3.0",
  "currency": "CLP",
  "organization": {
    "roles": {
      "ti": {
        "access": "root",
        "duties": ["system_telemetry", "bug_fixing", "create_super_users", "rbac_matrix_control"]
      },
      "super_user": {
        "access": "purchaser",
        "duties": ["buy_licenses", "create_administrators", "modify_administrators"]
      },
      "administrator": {
        "access": "manager",
        "duties": ["setup_condo", "bookkeeping", "document_generation", "employee_payroll"]
      }
    },
    "contract_templates": {
      "conserjes_recepcionistas": "2 contracts of 3 months each -> indefinite",
      "mantenimiento": "2 contracts of 3 months each -> indefinite"
    }
  },
  "accounting_rules": {
    "prorrateo": {
      "base_formula": "gasto_comun_base = total_gastos_prorrateables * coeficiente_prorrateo",
      "reserve_fund_formula": "fondo_reserva = (total_gastos_prorrateables * 0.05) * coeficiente_prorrateo",
      "individual_charge_formula": "total_a_pagar = Gasto_Comun_Base + Fondo_Reserva + Cargos_Consumos_Individuales"
    },
    "remuneraciones": {
      "haberes": "total_haberes = sueldo_base + asignacion_locomocion + asignacion_colacion",
      "deducciones": {
        "salud_fonasa_percentage": 0.07,
        "afp_capital_percentage": 0.1144,
        "seguro_cesantia_percentage": 0.006
      },
      "net_pay_formula": "sueldo_liquido = total_haberes - (salud + pension + cesantia)"
    }
  }
}
```
