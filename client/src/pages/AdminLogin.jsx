import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminLogin } from '../utils/api';

export default function AdminLogin() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await adminLogin(password);
      if (response.success) {
        sessionStorage.setItem('adminToken', response.token);
        navigate('/admin/dashboard');
      } else {
        setError('Invalid password');
      }
    } catch (err) {
      if (err.response?.status === 401) {
        setError('Invalid password');
      } else if (err.response?.status === 429) {
        setError('Too many login attempts. Please try again later.');
      } else {
        setError('Login failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 bg-surface">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-8">Admin Login</h1>
        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-lg">
          <div className="mb-6">
            <label htmlFor="password" className="block text-sm font-medium text-textSecondary mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border-2 border-border rounded-lg focus:border-primary transition-default"
              required
            />
          </div>
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-error rounded-lg text-sm">
              {error}
            </div>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary-hover disabled:opacity-50 transition-default"
          >
            {loading ? 'Logging in...' : 'Access Admin Panel'}
          </button>
        </form>
      </div>
    </div>
  );
}
