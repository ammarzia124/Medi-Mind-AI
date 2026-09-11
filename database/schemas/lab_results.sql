-- Lab Results Collection
-- Individual lab test values
-- Only store results that users explicitly analyze

CREATE TABLE lab_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lab_report_id UUID NOT NULL REFERENCES lab_reports(id) ON DELETE CASCADE,
    test_name VARCHAR(255) NOT NULL,
    value DECIMAL,
    unit VARCHAR(50),
    reference_range VARCHAR(100),
    status VARCHAR(20) CHECK (status IN ('normal', 'abnormal', 'critical')),
    interpretation TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for lab_results
CREATE INDEX idx_lab_results_lab_report_id ON lab_results(lab_report_id);
CREATE INDEX idx_lab_results_test_name ON lab_results(test_name);
CREATE INDEX idx_lab_results_status ON lab_results(status);
CREATE INDEX idx_lab_results_report_status ON lab_results(lab_report_id, status);
