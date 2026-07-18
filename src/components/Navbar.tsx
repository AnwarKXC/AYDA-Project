import { Link } from 'react-router-dom'
import './Navbar.css'

export default function Navbar() {
  return (
    <nav className="ayda-navbar" dir="rtl">
      <div className="ayda-navbar-inner">
        <Link to="/" className="ayda-navbar-logo">AYDA</Link>

        <div className="ayda-navbar-links">
          <Link to="/" className="ayda-navbar-link">الرئيسية</Link>
          <Link to="/request" className="ayda-navbar-link">إرسال طلب</Link>

          {/* الزر يظهر دائماً الآن لتتمكن من الوصول للوحة التحكم بسهولة */}
          <Link to="/admin" className="ayda-navbar-admin">
            لوحة التحكم
          </Link>
        </div>
      </div>
    </nav>
  )
}