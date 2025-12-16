import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getAdminForms, adminLogout } from '../utils/api';
import FileUpload from '../components/FileUpload';
import toast from 'react-hot-toast';

export default function AdminDashboard() {
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const token = sessionStorage.getItem('adminToken');

  const loadForms = async () => {
    try {
      const response = await getAdminForms(token);
      if (response.success) {
        setForms(response.data);
      }
    } catch (err) {
      if (err.response?.status === 401) {
        sessionStorage.removeItem('adminToken');
        navigate('/admin');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) {
      navigate('/admin');
      return;
    }

    loadForms();
  }, [token, navigate]);

  const handleLogout = async () => {
    try {
      await adminLogout(token);
    } catch (err) {
      // Logout error
    }
    sessionStorage.removeItem('adminToken');
    navigate('/admin');
  };

  const handleUploadSuccess = (data) => {
    toast.success(data.message || 'Formular erfolgreich hochgeladen!');
    loadForms();
  };

  const handleUploadError = (error) => {
    toast.error(error.userMessage || 'Upload fehlgeschlagen');
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Nie';
    return new Date(dateString).toLocaleString();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-textSecondary">Lädt...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold">Fragebogen-Administration</h1>
          <button
            onClick={handleLogout}
            className="px-6 py-2 text-textSecondary hover:text-textPrimary transition-default"
          >
            Abmelden
          </button>
        </div>

        <FileUpload
          token={token}
          onUploadSuccess={handleUploadSuccess}
          onUploadError={handleUploadError}
        />

        {forms.length === 0 ? (
          <div className="bg-white p-12 rounded-lg text-center">
            <p className="text-textSecondary">Keine Formulare gefunden</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {forms.map((form) => (
              <div key={form.id} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-default">
                <h2 className="text-2xl font-semibold mb-4">{form.title}</h2>
                <div className="space-y-2 text-sm text-textSecondary mb-6">
                  <div>
                    <span className="font-medium">Einreichungen:</span> {form.submissionCount}
                  </div>
                  <div>
                    <span className="font-medium">Letzte Einreichung:</span> {formatDate(form.lastSubmission)}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Link
                    to={`/admin/forms/${form.id}`}
                    className="flex-1 px-4 py-2 bg-primary text-white text-center rounded-lg hover:bg-primary-hover transition-default"
                  >
                    Antworten anzeigen
                  </Link>
                  <a
                    href={`/form/${form.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 border-2 border-primary text-primary rounded-lg hover:bg-primary-50 transition-default"
                  >
                    Vorschau
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
