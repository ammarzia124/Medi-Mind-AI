-- Lab Reports Collection
-- Metadata for lab report uploads and analyses
-- Minimal data storage for privacy

CREATE TABLE lab_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    report_name VARCHAR(255),
    report_date DATE,
    facility_name VARCHAR(255),
    summary TEXT,
    file_path VARCHAR(500),
    file_hash VARCHAR(64),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for lab_reports
CREATE INDEX idx_lab_reports_user_id ON lab_reports(user_id);
CREATE INDEX idx_lab_reports_report_date ON lab_reports(report_date DESC);
CREATE INDEX idx_lab_reports_created_at ON lab_reports(created_at DESC);
CREATE INDEX idx_lab_reports_user_date ON lab_reports(user_id, report_date DESC);
