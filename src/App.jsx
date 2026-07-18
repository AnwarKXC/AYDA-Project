import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import CommitteesPage from './pages/CommitteesPage'
import RequestsForm from './pages/RequestsForm'
import AdminDashboard from './pages/AdminDashboard'
import './pages/App.css'

function App() {
  return (
    <BrowserRouter>
      {/* شلنا bg-gray-50 عشان متغطيش على خلفيات الصفحات الداخلية */}
      <div className="app-shell">
        <Navbar />

        <div className="app-body">
          <Routes>
            <Route path="/" element={<CommitteesPage />} />
            <Route path="/request" element={<RequestsForm />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route
              path="*"
              element={
                <div className="app-404" dir="rtl">
                  عذراً، هذه الصفحة غير موجودة (404)
                </div>
              }
            />
          </Routes>
        </div>

        {/* Footer سيظهر في أسفل جميع الصفحات */}
        <footer className="app-footer">
          <p>
            Developed by <span className="app-footer-highlight">Coder Zone Academy</span> —
            Supervised by <span className="app-footer-highlight">Eng. Zeyad Emara</span>
          </p>
        </footer>
      </div>
    </BrowserRouter>
  )
}

export default App