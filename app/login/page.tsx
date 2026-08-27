'use client'

import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  async function signInWithMicrosoft() {
    const supabase = createClient()
    await supabase.auth.signInWithOAuth({
      provider: 'azure',
      options: {
        scopes: 'email openid profile',
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })
  }

  return (
    <main className="login-shell">
      <section className="card login-card">
        <span className="eyebrow">QRLKM MANAGEMENT</span>
        <h1>Acceso corporativo</h1>
        <p>Usá tu cuenta Microsoft de empresa. El acceso sólo se habilita para correos previamente autorizados por un administrador.</p>
        <button className="button" onClick={signInWithMicrosoft}>Continuar con Microsoft</button>
      </section>
    </main>
  )
}
