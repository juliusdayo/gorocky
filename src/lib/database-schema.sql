-- Create motorcycles table
CREATE TABLE IF NOT EXISTS motorcycles (
  id BIGSERIAL PRIMARY KEY,
  brand TEXT NOT NULL,
  model_name TEXT NOT NULL,
  year INTEGER NOT NULL CHECK (year >= 1900 AND year <= 2030),
  odometer INTEGER NOT NULL CHECK (odometer >= 0),
  upgrades TEXT[] DEFAULT '{}',
  price DECIMAL(10,2) NOT NULL CHECK (price >= 0),
  status TEXT NOT NULL DEFAULT 'available' CHECK (status IN ('available', 'sold', 'pending')),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create RLS (Row Level Security) policies
ALTER TABLE motorcycles ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view all available motorcycles
CREATE POLICY "Anyone can view available motorcycles" ON motorcycles
  FOR SELECT USING (status = 'available');

-- Policy: Users can insert their own motorcycles
CREATE POLICY "Users can insert own motorcycles" ON motorcycles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own motorcycles
CREATE POLICY "Users can update own motorcycles" ON motorcycles
  FOR UPDATE USING (auth.uid() = user_id);

-- Policy: Users can delete their own motorcycles
CREATE POLICY "Users can delete own motorcycles" ON motorcycles
  FOR DELETE USING (auth.uid() = user_id);

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for updated_at
CREATE TRIGGER update_motorcycles_updated_at
    BEFORE UPDATE ON motorcycles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Insert some sample data (optional)
INSERT INTO motorcycles (brand, model_name, year, odometer, upgrades, price, status, user_id) VALUES
  ('Honda', 'CBR600RR', 2020, 15000, ARRAY['Aftermarket exhaust', 'LED headlight'], 12500.00, 'available', NULL),
  ('Yamaha', 'R1', 2019, 8500, ARRAY['Carbon fiber bodywork', 'Racing suspension'], 16800.00, 'available', NULL),
  ('Harley-Davidson', 'Street Glide', 2021, 5200, ARRAY['Chrome package', 'Sound system upgrade'], 22000.00, 'available', NULL)
ON CONFLICT DO NOTHING;