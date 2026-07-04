import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Landing   from './pages/Landing.jsx'
import Login     from './pages/Login.jsx'
import GuestView from './pages/GuestView.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Admin     from './pages/Admin.jsx'

// Simple auth check — replace with real auth (Clerk, Firebase, etc.)
const isLoggedIn = () => localStorage.getItem('scenvy_user') !== null

function Protected({ children, adminOnly = false }) {
  if (!isLoggedIn()) return <Navigate to="/login" replace />
  const user = JSON.parse(localStorage.getItem('scenvy_user') || '{}')
  if (adminOnly && user.role !== 'admin') return <Navigate to="/dashboard" replace />
  return children
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"              element={<Landing />} />
        <Route path="/login"         element={<Login />} />
        <Route path="/l/:locationId" element={<GuestView />} />
        <Route path="/dashboard"     element={<Protected><Dashboard /></Protected>} />
        <Route path="/admin"         element={<Protected adminOnly><Admin /></Protected>} />
        <Route path="*"              element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
