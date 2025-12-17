/**
 * User Journey Tracking Utility
 * Tracks events from QR scan to survey completion
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

/**
 * Generate or retrieve session ID from sessionStorage
 * @returns {string} Session ID (UUID)
 */
function getOrCreateSessionId() {
  let sessionId = sessionStorage.getItem('tracking_session_id');

  if (!sessionId) {
    // Generate a simple UUID
    sessionId = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });

    sessionStorage.setItem('tracking_session_id', sessionId);
  }

  return sessionId;
}

/**
 * Get QR source from URL parameters
 * @returns {string|null} QR source ID
 */
function getQRSource() {
  const params = new URLSearchParams(window.location.search);
  return params.get('qr');
}

/**
 * Track an event in the user journey
 * @param {string} eventType - Type of event (page_view, survey_start, question_view, survey_complete)
 * @param {string} formId - Form/survey ID
 * @param {object} eventData - Additional event data (optional)
 */
export async function trackEvent(eventType, formId, eventData = {}) {
  try {
    const sessionId = getOrCreateSessionId();
    const qrSource = getQRSource();

    const payload = {
      session_id: sessionId,
      form_id: formId,
      event_type: eventType,
      event_data: eventData,
      qr_source: qrSource,
      user_agent: navigator.userAgent,
      timestamp: new Date().toISOString()
    };

    // Send event to server (fire and forget - don't wait for response)
    fetch(`${API_BASE_URL}/tracking/event`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload),
      // Use keepalive to ensure request completes even if user navigates away
      keepalive: true
    }).catch(() => {
      // Silently fail - don't break the user experience
    });
  } catch (err) {
    // Catch all errors to ensure tracking never breaks the app
  }
}

/**
 * Track page view event
 * @param {string} formId - Form ID
 */
export function trackPageView(formId) {
  trackEvent('page_view', formId);
}

/**
 * Track survey start event
 * @param {string} formId - Form ID
 */
export function trackSurveyStart(formId) {
  trackEvent('survey_start', formId);
}

/**
 * Track question view event
 * @param {string} formId - Form ID
 * @param {number} questionNumber - Current question number (1-indexed)
 * @param {string} questionId - Question ID
 */
export function trackQuestionView(formId, questionNumber, questionId) {
  trackEvent('question_view', formId, {
    question_number: questionNumber,
    question_id: questionId
  });
}

/**
 * Track survey completion event
 * @param {string} formId - Form ID
 */
export function trackSurveyComplete(formId) {
  trackEvent('survey_complete', formId);
}

/**
 * Get current session ID (for debugging)
 * @returns {string} Session ID
 */
export function getSessionId() {
  return getOrCreateSessionId();
}
