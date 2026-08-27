# QRLKM Management

Plataforma modular para gestión hotelera. El primer módulo cubre Workforce, Identity & Access, licencias, evidencias e histórico de conciliaciones.

## MVP actual

- Dashboard de Workforce & Access.
- Registro visual de empleados y cuentas.
- Workflow conceptual de onboarding/offboarding: RRHH → IT → verificación → cierre.
- Fuentes recurrentes: IHG Access, M365, Factorial, Oracle Opera y facturas.
- Pantalla de reconciliaciones y discrepancias.
- Analytics preparado para headcount, licencias y costes.
- Modelo PostgreSQL/Prisma multi-property y multi-módulo.
- Modelo de auditoría e histórico: los registros no se diseñan para sobrescribir el pasado.
- Roles base: ADMIN, HR, FINANCE, VIEWER, AUDITOR.

> Los datos visibles actualmente son datos mock para validar UX y arquitectura. No deben utilizarse como información operativa.

## Arquitectura prevista

```text
Vercel
└── Next.js
    ├── UI
    ├── Server Actions / API
    ├── Authorization
    ├── Import parsers
    └── Reconciliation engine

Supabase
├── PostgreSQL
├── Auth
└── Storage (evidence vault)
```

Cada archivo importado se conservará junto con metadata y SHA-256. Los datos procesados se guardarán por lotes (`ImportBatch`) para poder reconstruir el estado histórico y demostrar qué archivo generó cada conciliación.

## Datos principales

- `Person`, `Employment`, `Department`, `Position`
- `SystemAccount` para IHG, M365, Opera y futuros sistemas
- `AccessWorkflow`, `WorkflowTask`
- `LicenseAssignment`, `LicensePriceHistory`
- `DataSource`, `ImportBatch`, `ImportedRecord`
- `ReconciliationRun`, `ReconciliationDifference`
- `Compensation`, `Invoice`
- `AuditLog`

Los datos salariales están separados del perfil de empleado para poder aplicar autorización específica. El frontend nunca debe recibir compensaciones para roles sin permiso.

## Desarrollo local

```bash
npm install
cp .env.example .env.local
npm run dev
```

Abrir `http://localhost:3000`.

## PostgreSQL / Supabase

Crear un proyecto Supabase y copiar el connection string de PostgreSQL a `DATABASE_URL`.

```bash
npm run db:generate
npm run db:push
```

No guardar claves ni credenciales reales en GitHub.

## Próxima iteración

1. Supabase Auth y autorización real por permisos.
2. Persistencia PostgreSQL.
3. Upload seguro a Supabase Storage.
4. Parser real de `ihg_hotelAccessReport.csv`.
5. Parser del CSV M365.
6. Matching por `NETWORK_ID` con excepciones manuales.
7. Reconciliación Platform ↔ IHG ↔ Factorial ↔ Oracle.
8. Histórico mensual de headcount y licencias.
9. Precio histórico de licencias + expected vs invoice.
10. Módulo Finance para compensación mensual, invisible para HR.
11. Exportes PDF/CSV para auditoría y DOCMX.
12. Integración futura con Budget usando métricas mensuales de Workforce.

## Principios

- La persona es una identidad central; las cuentas externas pertenecen a sistemas diferentes.
- No borrar históricamente empleados, cuentas, precios o conciliaciones: cerrar vigencias.
- Los archivos originales son evidencia y no se sobrescriben.
- Toda acción sensible debe generar `AuditLog`.
- El sistema se modela desde el inicio con `Organization` / `Property` para crecer más allá de QRLKM.
