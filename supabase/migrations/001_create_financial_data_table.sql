-- Create financial_data table to store user financial data
-- This table stores all financial data as JSON for simplicity
-- Row Level Security (RLS) is enabled to ensure users can only access their own data

CREATE TABLE IF NOT EXISTS financial_data (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  data JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Create index on user_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_financial_data_user_id ON financial_data(user_id);

-- Enable Row Level Security
ALTER TABLE financial_data ENABLE ROW LEVEL SECURITY;

-- Create policy: Users can only see their own data
CREATE POLICY "Users can view their own financial data"
  ON financial_data
  FOR SELECT
  USING (auth.uid() = user_id);

-- Create policy: Users can insert their own financial data
CREATE POLICY "Users can insert their own financial data"
  ON financial_data
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create policy: Users can update their own financial data
CREATE POLICY "Users can update their own financial data"
  ON financial_data
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create policy: Users can delete their own financial data
CREATE POLICY "Users can delete their own financial data"
  ON financial_data
  FOR DELETE
  USING (auth.uid() = user_id);

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_financial_data_updated_at
  BEFORE UPDATE ON financial_data
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

