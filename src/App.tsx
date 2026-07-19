import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import { Toaster } from 'sonner'
import Navbar from './components/Navbar'
import CommitteesPage from './pages/CommitteesPage'
import RequestsForm from './pages/RequestsForm'
import AdminDashboard from './pages/AdminDashboard'

function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-6 text-center" dir="rtl">
      <span className="text-6xl font-black text-teal/20">404</span>
      <h1 className="text-2xl font-black">هذه الصفحة غير موجودة</h1>
      <p className="text-ink/60">يمكنك العودة للرئيسية أو إرسال طلب مساعدة</p>
      <Link
        to="/"
        className="rounded-xl bg-teal px-6 py-3 font-bold text-white shadow-card transition hover:bg-teal-dark"
      >
        العودة للرئيسية
      </Link>
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <Toaster richColors position="top-center" dir="rtl" />
      <div className="flex min-h-screen flex-col" dir="rtl">
        <Navbar />

        <main className="flex-1">
          <Routes>
            <Route path="/" element={<CommitteesPage />} />
            <Route path="/request" element={<RequestsForm />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>

        <footer className="border-t border-line bg-white/60 px-6 py-5 text-center text-sm text-ink/60">
          <p>
            Developed by <span className="font-bold text-teal">Coder Zone Academy</span> — Supervised
            by <span className="font-bold text-teal">Eng. Zeyad Emara</span>
          </p>
        </footer>
      </div>
    </BrowserRouter>
  )
}

export default App
