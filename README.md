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
- Acceso corporativo preparado mediante Microsoft SSO / Supabase Auth.
- Usuarios pre-autorizados por correo corporativo.
- Roles + permisos granulares independientes para ver, editar y descargar información.

> Los datos visibles actualmente son datos mock para validar UX y arquitectura. No deben utilizarse como información operativa.

## Arquitectura prevista

```text
Vercel
└── Next.js
    ├── UI
    ├── Server Actions / API
    ├── Microsoft SSO
    ├── Authorization
    ├── Import parsers
    └── Reconciliation engine

Supabase
├── PostgreSQL
├── Auth (Microsoft / Azure provider)
└── Storage (evidence vault)
```

Cada archivo importado se conservará junto con metadata y SHA-256. Los datos procesados se guardarán por lotes (`ImportBatch`) para poder reconstruir el estado histórico y demostrar qué archivo generó cada conciliación.

## Autenticación

La aplicación no tendrá contraseñas propias. El administrador crea primero un `PlatformUser` con el correo corporativo autorizado. El usuario entra con Microsoft y el callback compara el email autenticado con el registro interno. Si no existe o está deshabilitado, el acceso se rechaza.

En el primer acceso válido se vincula la identidad autenticada al usuario interno. Los accesos exitosos quedan registrados en `AuditLog` con el correo actor.

Ver `docs/access-control.md` para el diseño completo.

## Autorización

Los roles son conjuntos de permisos, no reglas rígidas. Además se permiten excepciones por usuario. Ver y descargar son permisos distintos: por ejemplo `VIEW_PEOPLE` no implica `EXPORT_PEOPLE`, y `VIEW_COMPENSATION` no implica `EXPORT_COMPENSATION`.

Los datos protegidos deben filtrarse siempre en servidor; ocultar elementos visuales no sustituye la autorización.

## Datos principales

- `PlatformUser`, `Role`, `Permission`, `UserRole`, `UserPermission`
- `Person`, `Employment`, `Department`, `Position`
- `SystemAccount` para IHG, M365, Opera y futuros sistemas
- `AccessWorkflow`, `WorkflowTask`
- `LicenseAssignment`, `LicensePriceHistory`
- `DataSource`, `ImportBatch`, `ImportedRecord`
- `ReconciliationRun`, `ReconciliationDifference`
- `Compensation`, `Invoice`
- `AuditLog`

Los datos salariales están separados del perfil de empleado para poder aplicar autorización específica. El frontend nunca debe recibir compensaciones para usuarios sin permiso.

## Desarrollo local

```bash
npm install
cp .env.example .env.local
npm run dev
```

Abrir `http://localhost:3000`.

## PostgreSQL / Supabase

Crear un proyecto Supabase y copiar el connection string de PostgreSQL a `DATABASE_URL`. Configurar Microsoft/Azure como proveedor OAuth en Supabase Auth y registrar la callback correspondiente.

```bash
npm run db:generate
npm run db:push
```

No guardar claves ni credenciales reales en GitHub.

## Próxima iteración

1. Crear/configurar proyecto Supabase real.
2. Configurar Microsoft/Azure OAuth y callback de Vercel.
3. Crear pantalla ADMIN para alta/baja de usuarios y asignación de roles/permisos.
4. Proteger rutas, Server Actions y exports con `PermissionCode`.
5. Persistencia PostgreSQL.
6. Upload seguro a Supabase Storage.
7. Parser real de `ihg_hotelAccessReport.csv`.
8. Parser del CSV M365.
9. Matching por `NETWORK_ID` con excepciones manuales.
10. Reconciliación Platform ↔ IHG ↔ Factorial ↔ Oracle.
11. Histórico mensual de headcount y licencias.
12. Precio histórico de licencias + expected vs invoice.
13. Módulo Finance para compensación mensual, invisible para HR.
14. Exportes PDF/CSV para auditoría y DOCMX.
15. Integración futura con Budget usando métricas mensuales de Workforce.

## Principios

- La persona es una identidad central; las cuentas externas pertenecen a sistemas diferentes.
- No borrar históricamente empleados, cuentas, precios o conciliaciones: cerrar vigencias.
- Los archivos originales son evidencia y no se sobrescriben.
- Toda acción sensible debe generar `AuditLog` con el usuario y correo actor.
- El sistema se modela desde el inicio con `Organization` / `Property` para crecer más allá de QRLKM.
