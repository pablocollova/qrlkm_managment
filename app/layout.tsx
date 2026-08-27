import './globals.css'
import Link from 'next/link'

export const metadata = {
  title: 'QRLKM Management',
  description: 'Hotel workforce, identity, licensing and audit management platform',
}

const nav = [
  ['Dashboard', '/'],
  ['People', '/people'],
  ['Onboarding', '/onboarding'],
  ['Imports', '/imports'],
  ['Reconciliation', '/reconciliation'],
  ['Analytics', '/analytics'],
]

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <body>
        <div className="app-shell">
          <aside className="sidebar">
            <div className="brand">
              <div className="brand-mark">Q</div>
              <div><strong>QRLKM</strong><span>Management</span></div>
            </div>
            <nav>
              {nav.map(([label, href]) => <Link key={href} href={href} className="nav-link">{label}</Link>)}
            </nav>
            <div className="sidebar-footer">
              <span className="eyebrow">PROPERTY</span>
              <strong>Kimpton Los Monteros</strong>
              <span>QRLKM · Marbella</span>
            </div>
          </aside>
          <main className="main-area">
            <header className="topbar">
              <div><span className="eyebrow">HOTEL MANAGEMENT PLATFORM</span></div>
              <div className="user-chip"><div className="avatar">PC</div><div><strong>Admin</strong><span>IT Manager</span></div></div>
            </header>
            {children}
          </main>
        </div>
      </body>
    </html>
  )
}
