import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import FormPage from './pages/FormPage';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import AdminFormView from './pages/AdminFormView';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/form/demo" replace />} />
        <Route path="/form/:formId" element={<FormPage />} />
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/forms/:formId" element={<AdminFormView />} />
        <Route path="*" element={<Navigate to="/form/demo" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
