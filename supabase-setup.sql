-- Deal Pipeline Tracker Database Setup
-- Run this in your Supabase SQL Editor

-- Create the deals table
CREATE TABLE deals (
  id BIGSERIAL PRIMARY KEY,
  business_name TEXT NOT NULL,
  asking_price NUMERIC NOT NULL,
  sde NUMERIC NOT NULL,
  industry TEXT NOT NULL,
  status TEXT NOT NULL,
  location TEXT NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE deals ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations
-- Note: For production with auth, replace this with user-specific policies
CREATE POLICY "Allow all operations on deals" ON deals
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Create index on created_at for faster sorting
CREATE INDEX idx_deals_created_at ON deals(created_at DESC);

-- Create index on status for faster filtering
CREATE INDEX idx_deals_status ON deals(status);

-- Optional: Create a function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to call the function
CREATE TRIGGER update_deals_updated_at 
  BEFORE UPDATE ON deals
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert some sample data (optional - remove if you don't want sample data)
INSERT INTO deals (business_name, asking_price, sde, industry, status, location, notes)
VALUES 
  ('ABC Manufacturing', 750000, 250000, 'Manufacturing', 'Reviewing', 'Tulsa, OK', 'Small machine shop with loyal customer base'),
  ('XYZ Services', 500000, 150000, 'Services', 'LOI Submitted', 'Oklahoma City, OK', 'Submitted LOI at 3.2x multiple'),
  ('Tech Solutions LLC', 1200000, 300000, 'Technology', 'Due Diligence', 'Dallas, TX', 'SaaS company with recurring revenue');
