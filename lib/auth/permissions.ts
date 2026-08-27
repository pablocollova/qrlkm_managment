import { PermissionCode } from '@prisma/client'
import { prisma } from '@/lib/prisma'

export async function getEffectivePermissions(userId: string) {
  const user = await prisma.platformUser.findUnique({
    where: { id: userId },
    include: {
      roles: { include: { role: { include: { permissions: { include: { permission: true } } } } } },
      directPermissions: { include: { permission: true } },
    },
  })

  if (!user || !user.active) return new Set<PermissionCode>()

  const permissions = new Set<PermissionCode>()
  for (const userRole of user.roles) {
    for (const rolePermission of userRole.role.permissions) {
      permissions.add(rolePermission.permission.code)
    }
  }

  for (const override of user.directPermissions) {
    if (override.granted) permissions.add(override.permission.code)
    else permissions.delete(override.permission.code)
  }

  return permissions
}

export async function hasPermission(userId: string, permission: PermissionCode) {
  const permissions = await getEffectivePermissions(userId)
  return permissions.has(permission)
}
