import { Link, NavLink } from 'react-router-dom'
import { LOGO_URL } from '../lib/assets'

const linkClass = ({ isActive }: { isActive: boolean }) =>
  `rounded-lg px-3 py-2 text-sm font-bold transition ${
    isActive ? 'bg-teal-soft text-teal-dark' : 'text-ink/70 hover:text-ink'
  }`

export default function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-sand/90 backdrop-blur">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6" aria-label="التنقل الرئيسي">
        <Link to="/" className="flex items-center gap-2">
          <img src={LOGO_URL} alt="" width="36" height="36" className="h-9 w-9 rounded-full object-cover" />
          <span className="text-xl font-black tracking-tight text-ink">AYDA</span>
        </Link>

        <div className="flex items-center gap-1">
          <NavLink to="/" end className={linkClass}>
            الرئيسية
          </NavLink>
          <NavLink to="/request" className={linkClass}>
            إرسال طلب
          </NavLink>
          <NavLink
            to="/admin"
            className="mr-2 rounded-lg border border-line px-3 py-2 text-sm font-bold text-ink/50 transition hover:border-teal hover:text-teal"
          >
            لوحة التحكم
          </NavLink>
        </div>
      </nav>
    </header>
  )
}
