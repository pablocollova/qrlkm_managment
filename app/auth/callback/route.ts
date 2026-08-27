import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  const url = new URL(request.url)
  const code = url.searchParams.get('code')
  const origin = url.origin

  if (!code) return NextResponse.redirect(`${origin}/login?error=missing_code`)

  const supabase = await createClient()
  const { error } = await supabase.auth.exchangeCodeForSession(code)
  if (error) return NextResponse.redirect(`${origin}/login?error=oauth`)

  const { data: { user } } = await supabase.auth.getUser()
  const email = user?.email?.trim().toLowerCase()

  if (!user || !email) {
    await supabase.auth.signOut()
    return NextResponse.redirect(`${origin}/auth/unauthorized`)
  }

  const platformUser = await prisma.platformUser.findFirst({
    where: { email: { equals: email, mode: 'insensitive' }, active: true },
  })

  if (!platformUser) {
    await supabase.auth.signOut()
    return NextResponse.redirect(`${origin}/auth/unauthorized`)
  }

  if (platformUser.authSubject && platformUser.authSubject !== user.id) {
    await supabase.auth.signOut()
    return NextResponse.redirect(`${origin}/auth/unauthorized?reason=identity_mismatch`)
  }

  await prisma.platformUser.update({
    where: { id: platformUser.id },
    data: {
      authSubject: platformUser.authSubject ?? user.id,
      lastLoginAt: new Date(),
      lastLoginEmail: email,
    },
  })

  await prisma.auditLog.create({
    data: {
      userId: platformUser.id,
      actorEmail: email,
      action: 'AUTH_LOGIN',
      entityType: 'PlatformUser',
      entityId: platformUser.id,
      metadata: { provider: 'MICROSOFT' },
    },
  })

  return NextResponse.redirect(`${origin}/`)
}
