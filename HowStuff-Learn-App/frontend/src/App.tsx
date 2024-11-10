import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import MainLayout from '@/layouts/MainLayout'
import AuthLayout from '@/layouts/AuthLayout'
import DashboardLayout from '@/layouts/DashboardLayout'
import Home from '@/pages/Home'
import Login from '@/pages/auth/Login'
import Register from '@/pages/auth/Register'
import Dashboard from '@/pages/dashboard/Dashboard'
import ErrorBoundary from '@/components/ErrorBoundary/Errorboundary'

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <Router>
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<Home />} />
          </Route>

          <Route element={<AuthLayout />}>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Route>

          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
          </Route>
        </Routes>
      </Router>
    </ErrorBoundary>
  )
}

export default App
