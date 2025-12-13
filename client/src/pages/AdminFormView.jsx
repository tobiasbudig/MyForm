import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { getFormSubmissions, exportFormCsv } from '../utils/api';

export default function AdminFormView() {
  const { formId } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedRows, setExpandedRows] = useState(new Set());
  const navigate = useNavigate();
  const token = sessionStorage.getItem('adminToken');

  useEffect(() => {
    if (!token) {
      navigate('/admin');
      return;
    }

    async function loadSubmissions() {
      try {
        const response = await getFormSubmissions(formId, token);
        if (response.success) {
          setData(response.data);
        }
      } catch (err) {
        if (err.response?.status === 401) {
          sessionStorage.removeItem('adminToken');
          navigate('/admin');
        }
      } finally {
        setLoading(false);
      }
    }

    loadSubmissions();
  }, [formId, token, navigate]);

  const handleExportCSV = async () => {
    try {
      const blob = await exportFormCsv(formId, token);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${formId}-submissions.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      alert('Failed to export CSV');
    }
  };

  const toggleRow = (id) => {
    setExpandedRows((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleString();
  };

  const truncateId = (id) => {
    return id?.substring(0, 8) || '-';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-textSecondary">Loading...</div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-textSecondary">Form not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="mb-8">
          <Link to="/admin/dashboard" className="text-primary hover:underline mb-4 inline-block">
            ← Back to Dashboard
          </Link>
          <div className="flex items-center justify-between">
            <h1 className="text-4xl font-bold">{data.form.title}</h1>
            <button
              onClick={handleExportCSV}
              className="px-6 py-2 bg-success text-white rounded-lg hover:bg-green-700 transition-default"
            >
              Export CSV
            </button>
          </div>
        </div>

        {data.submissions.length === 0 ? (
          <div className="bg-white p-12 rounded-lg text-center">
            <p className="text-textSecondary">No submissions yet</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-textSecondary uppercase tracking-wider">
                      Submission ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-textSecondary uppercase tracking-wider">
                      IP Address
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-textSecondary uppercase tracking-wider">
                      Started
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-textSecondary uppercase tracking-wider">
                      Completed
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-textSecondary uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-textSecondary uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {data.submissions.map((submission) => (
                    <>
                      <tr key={submission.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-mono">
                          {truncateId(submission.id)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {submission.ip_address || '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {formatDate(submission.started_at)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {formatDate(submission.completed_at)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              submission.is_complete
                                ? 'bg-green-100 text-green-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}
                          >
                            {submission.is_complete ? 'Complete' : 'Incomplete'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <button
                            onClick={() => toggleRow(submission.id)}
                            className="text-primary hover:underline"
                          >
                            {expandedRows.has(submission.id) ? 'Hide' : 'View'} Details
                          </button>
                        </td>
                      </tr>
                      {expandedRows.has(submission.id) && (
                        <tr>
                          <td colSpan="6" className="px-6 py-4 bg-gray-50">
                            <div className="space-y-4">
                              <h4 className="font-semibold text-textPrimary mb-2">Answers:</h4>
                              {submission.answers.length === 0 ? (
                                <p className="text-textSecondary text-sm">No answers recorded</p>
                              ) : (
                                <div className="space-y-3">
                                  {submission.answers.map((answer, idx) => (
                                    <div key={idx} className="bg-white p-4 rounded border border-gray-200">
                                      <div className="font-medium text-sm text-textSecondary mb-1">
                                        {answer.question_text || answer.question_id}
                                      </div>
                                      <div className="text-textPrimary">
                                        {answer.answer_value}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          </td>
                        </tr>
                      )}
                    </>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
