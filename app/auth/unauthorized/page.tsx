export default function UnauthorizedPage() {
  return (
    <main className="login-shell">
      <section className="card login-card">
        <span className="eyebrow">ACCESS CONTROL</span>
        <h1>Usuario no autorizado</h1>
        <p>La cuenta Microsoft utilizada no coincide con un usuario activo previamente autorizado en QRLKM Management.</p>
        <p>Solicitá al administrador que registre exactamente tu correo corporativo antes de volver a intentar el acceso.</p>
      </section>
    </main>
  )
}
