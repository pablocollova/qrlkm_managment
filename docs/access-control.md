# Access control

## Authentication

QRLKM Management does not store user passwords. Authentication is delegated to the corporate Microsoft identity through Supabase Auth using the Azure provider.

The platform uses an allow-list model:

1. An ADMIN creates a `PlatformUser` and registers the exact corporate email address.
2. The employee selects **Continue with Microsoft**.
3. Microsoft authenticates the employee.
4. The callback reads the authenticated email.
5. The platform looks for an active `PlatformUser` with that email.
6. If the email is not pre-authorized, access is rejected.
7. On first successful login the Supabase auth subject is bound to the `PlatformUser` record.
8. Subsequent logins must match both the authorized email and the bound identity.
9. `lastLoginAt` and `lastLoginEmail` are updated and an `AUTH_LOGIN` entry is written to `AuditLog`.

This means a Microsoft account can be valid at Microsoft but still have no access to QRLKM Management until an administrator explicitly authorizes it.

## Authorization

Authentication answers **who is the user**. Permissions answer **what can the user do**.

Roles are only permission bundles. Effective access is calculated from:

- permissions inherited from roles;
- optional per-user grants or denials.

Viewing and exporting are deliberately separate permissions. A user may be allowed to see information in the application but not download it.

Examples:

| Capability | Permission |
| --- | --- |
| View employees | `VIEW_PEOPLE` |
| Download employee report | `EXPORT_PEOPLE` |
| Request onboarding | `CREATE_ONBOARDING` |
| Execute IT workflow | `MANAGE_WORKFLOWS` |
| View M365 licenses | `VIEW_LICENSES` |
| Download M365 report | `EXPORT_LICENSES` |
| Upload source reports | `UPLOAD_IMPORTS` |
| Download original audit evidence | `DOWNLOAD_EVIDENCE` |
| View salaries | `VIEW_COMPENSATION` |
| Modify salaries | `EDIT_COMPENSATION` |
| Export salaries | `EXPORT_COMPENSATION` |
| View audit trail | `VIEW_AUDIT_LOG` |
| Export audit trail | `EXPORT_AUDIT_LOG` |
| Create/disable platform users | `MANAGE_USERS` |
| Configure roles | `MANAGE_ROLES` |

## Initial role intention

### ADMIN
Full operational and configuration access. Creates authorized users, assigns roles and permissions, manages imports, identities and reconciliations.

### HR
Can manage employee master data and request onboarding/offboarding. Does not receive compensation permissions. HR may see workflow status without being able to mark technical actions as completed.

### FINANCE
Can see workforce information needed for finance, manage compensation, invoices and financial exports. Finance access does not automatically imply permission to alter IT account workflows.

### VIEWER
Read-only access to explicitly assigned sections. Export permissions are optional and separate.

### AUDITOR
Read-only access to selected historical information, reconciliations and audit evidence. No operational changes.

## Important implementation rule

Restricted data must be filtered on the server. Hiding a button or table column in the browser is not considered authorization. Server Actions, API routes and exports must all verify the required `PermissionCode` before reading or returning protected data.
