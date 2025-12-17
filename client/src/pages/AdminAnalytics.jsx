import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  getAdminForms,
  getAnalyticsFunnel,
  getAnalyticsDropoff,
  getAnalyticsSources,
  getAnalyticsDevices,
  getAnalyticsTiming,
  adminLogout,
} from '../utils/api';
import FunnelChart from '../components/analytics/FunnelChart';
import DropoffTable from '../components/analytics/DropoffTable';
import SourcesTable from '../components/analytics/SourcesTable';
import toast from 'react-hot-toast';

export default function AdminAnalytics() {
  const [forms, setForms] = useState([]);
  const [selectedFormId, setSelectedFormId] = useState('');
  const [loading, setLoading] = useState(true);
  const [analyticsLoading, setAnalyticsLoading] = useState(false);
  const [analyticsData, setAnalyticsData] = useState({
    funnel: null,
    dropoff: null,
    sources: null,
    devices: null,
    timing: null,
  });
  const navigate = useNavigate();
  const token = sessionStorage.getItem('adminToken');

  // Load forms list
  useEffect(() => {
    if (!token) {
      navigate('/admin');
      return;
    }

    async function loadForms() {
      try {
        const response = await getAdminForms(token);
        if (response.success) {
          setForms(response.data);
          if (response.data.length > 0) {
            setSelectedFormId(response.data[0].id);
          }
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

    loadForms();
  }, [token, navigate]);

  // Load analytics when form is selected
  useEffect(() => {
    if (!selectedFormId || !token) return;

    async function loadAnalytics() {
      setAnalyticsLoading(true);
      try {
        const [funnelRes, dropoffRes, sourcesRes, devicesRes, timingRes] = await Promise.all([
          getAnalyticsFunnel(selectedFormId, token),
          getAnalyticsDropoff(selectedFormId, token),
          getAnalyticsSources(selectedFormId, token),
          getAnalyticsDevices(selectedFormId, token),
          getAnalyticsTiming(selectedFormId, token),
        ]);

        setAnalyticsData({
          funnel: funnelRes.data,
          dropoff: dropoffRes.data,
          sources: sourcesRes.data,
          devices: devicesRes.data,
          timing: timingRes.data,
        });
      } catch (err) {
        toast.error('Fehler beim Laden der Analysedaten');
      } finally {
        setAnalyticsLoading(false);
      }
    }

    loadAnalytics();
  }, [selectedFormId, token]);

  const handleLogout = async () => {
    try {
      await adminLogout(token);
    } catch (err) {
      // Logout error
    }
    sessionStorage.removeItem('adminToken');
    navigate('/admin');
  };

  const formatTime = (seconds) => {
    if (!seconds) return '0s';
    if (seconds < 60) return `${Math.round(seconds)}s`;
    const minutes = Math.floor(seconds / 60);
    const secs = Math.round(seconds % 60);
    return `${minutes}m ${secs}s`;
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
          <div>
            <h1 className="text-4xl font-bold">Analytics Dashboard</h1>
            <Link
              to="/admin/dashboard"
              className="text-primary hover:text-primary-hover transition-default mt-2 inline-block"
            >
              ← Zurück zum Dashboard
            </Link>
          </div>
          <button
            onClick={handleLogout}
            className="px-6 py-2 text-textSecondary hover:text-textPrimary transition-default"
          >
            Abmelden
          </button>
        </div>

        {forms.length === 0 ? (
          <div className="bg-white p-12 rounded-lg text-center">
            <p className="text-textSecondary">Keine Formulare gefunden</p>
          </div>
        ) : (
          <>
            <div className="mb-8 bg-white p-6 rounded-lg shadow-md">
              <label className="block text-sm font-medium text-textSecondary mb-2">
                Formular auswählen
              </label>
              <select
                value={selectedFormId}
                onChange={(e) => setSelectedFormId(e.target.value)}
                className="w-full md:w-auto px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none"
              >
                {forms.map((form) => (
                  <option key={form.id} value={form.id}>
                    {form.id}.md
                  </option>
                ))}
              </select>
            </div>

            {analyticsLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-xl text-textSecondary">Lädt Analysedaten...</div>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Conversion Funnel */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h2 className="text-2xl font-bold mb-4">Conversion Funnel</h2>
                  {analyticsData.funnel ? (
                    <FunnelChart data={analyticsData.funnel} />
                  ) : (
                    <p className="text-textSecondary">Keine Daten verfügbar</p>
                  )}
                </div>

                {/* Timing Metrics */}
                {analyticsData.timing && (
                  <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-2xl font-bold mb-4">Zeitmetriken</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="p-4 bg-surface rounded-lg">
                        <div className="text-sm text-textSecondary mb-1">Durchschn. Zeit bis Start</div>
                        <div className="text-2xl font-bold">
                          {formatTime(analyticsData.timing.avgTimeToStart)}
                        </div>
                        <div className="text-xs text-textSecondary mt-1">
                          Median: {formatTime(analyticsData.timing.medianTimeToStart)}
                        </div>
                      </div>
                      <div className="p-4 bg-surface rounded-lg">
                        <div className="text-sm text-textSecondary mb-1">Durchschn. Abschlusszeit</div>
                        <div className="text-2xl font-bold">
                          {formatTime(analyticsData.timing.avgCompletionTime)}
                        </div>
                        <div className="text-xs text-textSecondary mt-1">
                          Median: {formatTime(analyticsData.timing.medianCompletionTime)}
                        </div>
                      </div>
                      <div className="p-4 bg-surface rounded-lg">
                        <div className="text-sm text-textSecondary mb-1">Schnelle Abbrüche</div>
                        <div className="text-2xl font-bold">
                          {analyticsData.timing.quickExitsCount}
                        </div>
                        <div className="text-xs text-textSecondary mt-1">
                          {analyticsData.timing.quickExitsRate}% ({"<"}5s)
                        </div>
                      </div>
                      <div className="p-4 bg-surface rounded-lg">
                        <div className="text-sm text-textSecondary mb-1">Lange Sitzungen</div>
                        <div className="text-2xl font-bold">
                          {analyticsData.timing.confusedUsersCount}
                        </div>
                        <div className="text-xs text-textSecondary mt-1">
                          {analyticsData.timing.confusedUsersRate}% ({">"}5min)
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Question Drop-off */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h2 className="text-2xl font-bold mb-4">Fragen-Abbruchanalyse</h2>
                  {analyticsData.dropoff && analyticsData.dropoff.length > 0 ? (
                    <DropoffTable data={analyticsData.dropoff} />
                  ) : (
                    <p className="text-textSecondary">Keine Daten verfügbar</p>
                  )}
                </div>

                {/* QR Source Performance */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h2 className="text-2xl font-bold mb-4">QR-Code Performance</h2>
                  {analyticsData.sources && analyticsData.sources.length > 0 ? (
                    <SourcesTable data={analyticsData.sources} />
                  ) : (
                    <p className="text-textSecondary">Keine Daten verfügbar</p>
                  )}
                </div>

                {/* Device Breakdown */}
                {analyticsData.devices && (
                  <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-2xl font-bold mb-4">Geräte-Verteilung</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="font-semibold text-lg mb-3">Geräte</h3>
                        <div className="space-y-2">
                          {analyticsData.devices.devices.map((device) => (
                            <div key={device.device} className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <div className="w-3 h-3 bg-primary rounded-full"></div>
                                <span className="capitalize">{device.device}</span>
                              </div>
                              <div className="text-right">
                                <span className="font-semibold">{device.count}</span>
                                <span className="text-textSecondary text-sm ml-2">
                                  ({device.percentage}%)
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg mb-3">Browser</h3>
                        <div className="space-y-2">
                          {analyticsData.devices.browsers.map((browser) => (
                            <div key={browser.browser} className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <div className="w-3 h-3 bg-success rounded-full"></div>
                                <span className="capitalize">{browser.browser}</span>
                              </div>
                              <div className="text-right">
                                <span className="font-semibold">{browser.count}</span>
                                <span className="text-textSecondary text-sm ml-2">
                                  ({browser.percentage}%)
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
