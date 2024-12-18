import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from '@/layouts/MainLayout';
import AuthLayout from '@/layouts/AuthLayout';
import DashboardLayout from '@/layouts/DashboardLayout';
import InteractiveLayout from '@/layouts/InteractiveLayout'; // Import the new InteractiveLayout
import Home from '@/pages/Home';
import Login from '@/pages/auth/Login';
import Register from '@/pages/auth/Register';
import Dashboard from '@/pages/dashboard/Dashboard';
import Interactive from '@/pages/interactive/Interactive';
import Simulation from '@/pages/simulation/Simulation'; // Import the new Simulation component
import ErrorBoundary from '@/components/ErrorBoundary/Errorboundary';
import SimulationLayout from '@/layouts/SimulationLayout'; 

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

          <Route element={<InteractiveLayout />}>
            <Route path="/interactive" element={<Interactive />} />
          </Route>

          <Route path="/simulation/:id" element={<Simulation />} /> {/* Add route for Simulation */}
        </Routes>
      </Router>
    </ErrorBoundary>
  );
};

export default App;
