-- Create tracking_events table for user journey analytics
CREATE TABLE IF NOT EXISTS tracking_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id VARCHAR(255) NOT NULL,
    form_id VARCHAR(255) NOT NULL,
    event_type VARCHAR(50) NOT NULL,
    event_data JSONB DEFAULT '{}'::jsonb,
    qr_source VARCHAR(255),
    user_agent TEXT,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for tracking_events table (optimize for common queries)
CREATE INDEX IF NOT EXISTS idx_tracking_events_session_id ON tracking_events(session_id);
CREATE INDEX IF NOT EXISTS idx_tracking_events_form_id ON tracking_events(form_id);
CREATE INDEX IF NOT EXISTS idx_tracking_events_event_type ON tracking_events(event_type);
CREATE INDEX IF NOT EXISTS idx_tracking_events_qr_source ON tracking_events(qr_source);
CREATE INDEX IF NOT EXISTS idx_tracking_events_timestamp ON tracking_events(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_tracking_events_form_event ON tracking_events(form_id, event_type);

-- Composite index for funnel analysis queries
CREATE INDEX IF NOT EXISTS idx_tracking_events_funnel ON tracking_events(session_id, event_type, timestamp);

COMMENT ON TABLE tracking_events IS 'Tracks user journey events from QR scan to survey completion';
COMMENT ON COLUMN tracking_events.session_id IS 'Anonymous session identifier (UUID stored in browser)';
COMMENT ON COLUMN tracking_events.event_type IS 'Event type: page_view, survey_start, question_view, survey_complete';
COMMENT ON COLUMN tracking_events.event_data IS 'Additional event metadata (question number, etc.)';
COMMENT ON COLUMN tracking_events.qr_source IS 'QR code ID that initiated this session';
