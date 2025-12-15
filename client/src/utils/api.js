import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 second timeout
});

// Response interceptor for global error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Network error (no response from server)
    if (!error.response) {
      console.error('Network error:', error.message);
      error.userMessage = 'Netzwerkfehler. Bitte überprüfen Sie Ihre Internetverbindung.';
    }
    // Server error (5xx)
    else if (error.response.status >= 500) {
      console.error('Server error:', error.response.status, error.response.data);
      error.userMessage = 'Serverfehler. Bitte versuchen Sie es später erneut.';
    }
    // Client error (4xx)
    else if (error.response.status >= 400) {
      console.error('Client error:', error.response.status, error.response.data);
      error.userMessage = error.response.data?.error || 'Anfrage fehlgeschlagen.';
    }
    // Timeout
    else if (error.code === 'ECONNABORTED') {
      console.error('Request timeout');
      error.userMessage = 'Zeitüberschreitung. Bitte versuchen Sie es erneut.';
    }

    return Promise.reject(error);
  }
);

// =====================
// FORMS API
// =====================

/**
 * Get form configuration
 * @param {string} formId - The form ID
 * @returns {Promise<Object>} Form data
 */
export async function getForm(formId) {
  const response = await api.get(`/forms/${formId}`);
  return response.data;
}

// =====================
// SUBMISSIONS API
// =====================

/**
 * Start a new submission
 * @param {string} formId - The form ID
 * @returns {Promise<Object>} Submission data with ID and CSRF token
 */
export async function startSubmission(formId) {
  const response = await api.post('/submissions/start', { formId });
  return response.data;
}

/**
 * Save an answer
 * @param {string} submissionId - The submission ID
 * @param {string} questionId - The question ID
 * @param {string} questionText - The question text
 * @param {any} value - The answer value
 * @param {string} comment - Optional comment
 * @param {string} csrfToken - CSRF token
 * @returns {Promise<Object>} Response
 */
export async function saveAnswer(submissionId, questionId, questionText, value, comment, csrfToken) {
  const response = await api.post(
    `/submissions/${submissionId}/answer`,
    {
      questionId,
      questionText,
      value,
      comment,
    },
    {
      headers: {
        'X-CSRF-Token': csrfToken,
      },
    }
  );
  return response.data;
}

/**
 * Complete a submission
 * @param {string} submissionId - The submission ID
 * @param {string} csrfToken - CSRF token
 * @returns {Promise<Object>} Response
 */
export async function completeSubmission(submissionId, csrfToken) {
  const response = await api.post(
    `/submissions/${submissionId}/complete`,
    {},
    {
      headers: {
        'X-CSRF-Token': csrfToken,
      },
    }
  );
  return response.data;
}

// =====================
// ADMIN API
// =====================

/**
 * Admin login
 * @param {string} password - Admin password
 * @returns {Promise<Object>} Response with token
 */
export async function adminLogin(password) {
  const response = await api.post('/admin/login', { password });
  return response.data;
}

/**
 * Admin logout
 * @param {string} token - Admin token
 * @returns {Promise<Object>} Response
 */
export async function adminLogout(token) {
  const response = await api.post('/admin/logout', {}, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
}

/**
 * Check admin session validity
 * @param {string} token - Admin token
 * @returns {Promise<Object>} Session data
 */
export async function checkAdminSession(token) {
  const response = await api.get('/admin/session', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
}

/**
 * Get all forms with stats
 * @param {string} token - Admin token
 * @returns {Promise<Object>} Forms list
 */
export async function getAdminForms(token) {
  const response = await api.get('/admin/forms', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
}

/**
 * Get submissions for a form
 * @param {string} formId - The form ID
 * @param {string} token - Admin token
 * @returns {Promise<Object>} Submissions data
 */
export async function getFormSubmissions(formId, token) {
  const response = await api.get(`/admin/forms/${formId}/submissions`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
}

/**
 * Export form submissions as CSV
 * @param {string} formId - The form ID
 * @param {string} token - Admin token
 * @returns {Promise<Blob>} CSV file blob
 */
export async function exportFormCsv(formId, token) {
  const response = await api.get(`/admin/forms/${formId}/export`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    responseType: 'blob',
  });
  return response.data;
}

export default api;
