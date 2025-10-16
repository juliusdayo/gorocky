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
DROP POLICY IF EXISTS "Anyone can view available motorcycles" ON motorcycles;
CREATE POLICY "Anyone can view available motorcycles" ON motorcycles
  FOR SELECT USING (status = 'available');

-- Policy: Users can insert their own motorcycles
DROP POLICY IF EXISTS "Users can insert own motorcycles" ON motorcycles;
CREATE POLICY "Users can insert own motorcycles" ON motorcycles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own motorcycles
DROP POLICY IF EXISTS "Users can update own motorcycles" ON motorcycles;
CREATE POLICY "Users can update own motorcycles" ON motorcycles
  FOR UPDATE USING (auth.uid() = user_id);

-- Policy: Users can delete their own motorcycles
DROP POLICY IF EXISTS "Users can delete own motorcycles" ON motorcycles;
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
DROP TRIGGER IF EXISTS update_motorcycles_updated_at ON motorcycles;
CREATE TRIGGER update_motorcycles_updated_at
    BEFORE UPDATE ON motorcycles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Insert some sample data (optional)
INSERT INTO motorcycles (brand, model_name, year, odometer, upgrades, price, status, user_id) VALUES
  ('Honda', 'CBR600RR', 2020, 15000, ARRAY['Aftermarket exhaust', 'LED headlight'], 12500.00, 'available', '8f612af3-9925-48ca-bc14-4dcf6727d47c'),
  ('Yamaha', 'R1', 2019, 8500, ARRAY['Carbon fiber bodywork', 'Racing suspension'], 16800.00, 'available', '8f612af3-9925-48ca-bc14-4dcf6727d47c'),
  ('Harley-Davidson', 'Street Glide', 2021, 5200, ARRAY['Chrome package', 'Sound system upgrade'], 22000.00, 'available', '8f612af3-9925-48ca-bc14-4dcf6727d47c')
ON CONFLICT DO NOTHING;

-- ================================================
-- BUYERS AND SELLERS TABLES
-- ================================================

-- Create sellers table (users who sell motorcycles)
CREATE TABLE IF NOT EXISTS sellers (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  business_name TEXT,
  contact_phone TEXT,
  contact_email TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  zip_code TEXT,
  rating DECIMAL(3,2) DEFAULT 0.00 CHECK (rating >= 0 AND rating <= 5.00),
  total_sales INTEGER DEFAULT 0 CHECK (total_sales >= 0),
  verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Create buyers table (users who bid on motorcycles)
CREATE TABLE IF NOT EXISTS buyers (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name TEXT,
  last_name TEXT,
  contact_phone TEXT,
  contact_email TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  zip_code TEXT,
  verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Create bids table (many-to-many relationship between buyers and motorcycles)
CREATE TABLE IF NOT EXISTS bids (
  id BIGSERIAL PRIMARY KEY,
  motorcycle_id BIGINT REFERENCES motorcycles(id) ON DELETE CASCADE,
  buyer_id BIGINT REFERENCES buyers(id) ON DELETE CASCADE,
  bid_amount DECIMAL(10,2) NOT NULL CHECK (bid_amount > 0),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'withdrawn')),
  message TEXT,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ================================================
-- RLS POLICIES FOR NEW TABLES
-- ================================================

-- Enable RLS for sellers table
ALTER TABLE sellers ENABLE ROW LEVEL SECURITY;

-- Sellers policies
DROP POLICY IF EXISTS "Users can view all sellers" ON sellers;
CREATE POLICY "Users can view all sellers" ON sellers
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can insert own seller profile" ON sellers;
CREATE POLICY "Users can insert own seller profile" ON sellers
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own seller profile" ON sellers;
CREATE POLICY "Users can update own seller profile" ON sellers
  FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own seller profile" ON sellers;
CREATE POLICY "Users can delete own seller profile" ON sellers
  FOR DELETE USING (auth.uid() = user_id);

-- Enable RLS for buyers table
ALTER TABLE buyers ENABLE ROW LEVEL SECURITY;

-- Buyers policies
DROP POLICY IF EXISTS "Users can view all buyers" ON buyers;
CREATE POLICY "Users can view all buyers" ON buyers
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can insert own buyer profile" ON buyers;
CREATE POLICY "Users can insert own buyer profile" ON buyers
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own buyer profile" ON buyers;
CREATE POLICY "Users can update own buyer profile" ON buyers
  FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own buyer profile" ON buyers;
CREATE POLICY "Users can delete own buyer profile" ON buyers
  FOR DELETE USING (auth.uid() = user_id);

-- Enable RLS for bids table
ALTER TABLE bids ENABLE ROW LEVEL SECURITY;

-- Bids policies
DROP POLICY IF EXISTS "Anyone can view bids on available motorcycles" ON bids;
CREATE POLICY "Anyone can view bids on available motorcycles" ON bids
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM motorcycles 
      WHERE motorcycles.id = bids.motorcycle_id 
      AND motorcycles.status = 'available'
    )
  );

DROP POLICY IF EXISTS "Buyers can insert bids" ON bids;
CREATE POLICY "Buyers can insert bids" ON bids
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM buyers 
      WHERE buyers.id = bids.buyer_id 
      AND buyers.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Buyers can update own bids" ON bids;
CREATE POLICY "Buyers can update own bids" ON bids
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM buyers 
      WHERE buyers.id = bids.buyer_id 
      AND buyers.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Motorcycle owners can update bids on their motorcycles" ON bids;
CREATE POLICY "Motorcycle owners can update bids on their motorcycles" ON bids
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM motorcycles 
      WHERE motorcycles.id = bids.motorcycle_id 
      AND motorcycles.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Buyers can delete own bids" ON bids;
CREATE POLICY "Buyers can delete own bids" ON bids
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM buyers 
      WHERE buyers.id = bids.buyer_id 
      AND buyers.user_id = auth.uid()
    )
  );

-- ================================================
-- TRIGGERS FOR UPDATED_AT TIMESTAMPS
-- ================================================

-- Create triggers for updated_at on new tables
DROP TRIGGER IF EXISTS update_sellers_updated_at ON sellers;
CREATE TRIGGER update_sellers_updated_at
    BEFORE UPDATE ON sellers
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_buyers_updated_at ON buyers;
CREATE TRIGGER update_buyers_updated_at
    BEFORE UPDATE ON buyers
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_bids_updated_at ON bids;
CREATE TRIGGER update_bids_updated_at
    BEFORE UPDATE ON bids
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ================================================
-- INDEXES FOR PERFORMANCE
-- ================================================

-- Indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_sellers_user_id ON sellers(user_id);
CREATE INDEX IF NOT EXISTS idx_buyers_user_id ON buyers(user_id);
CREATE INDEX IF NOT EXISTS idx_bids_motorcycle_id ON bids(motorcycle_id);
CREATE INDEX IF NOT EXISTS idx_bids_buyer_id ON bids(buyer_id);
CREATE INDEX IF NOT EXISTS idx_bids_status ON bids(status);
CREATE INDEX IF NOT EXISTS idx_motorcycles_user_id ON motorcycles(user_id);
CREATE INDEX IF NOT EXISTS idx_motorcycles_status ON motorcycles(status);

-- ================================================
-- UPDATE MOTORCYCLES TABLE
-- ================================================

-- Add seller_id to motorcycles table to establish relationship
ALTER TABLE motorcycles 
ADD COLUMN IF NOT EXISTS seller_id BIGINT REFERENCES sellers(id) ON DELETE SET NULL;

-- Create index for the new foreign key
CREATE INDEX IF NOT EXISTS idx_motorcycles_seller_id ON motorcycles(seller_id);

-- ================================================
-- USEFUL VIEWS FOR COMPLEX QUERIES
-- ================================================

-- View to get motorcycle details with seller information
CREATE OR REPLACE VIEW motorcycle_details AS
SELECT 
  m.*,
  s.business_name,
  s.contact_phone,
  s.contact_email,
  s.rating as seller_rating,
  s.total_sales,
  s.verified as seller_verified
FROM motorcycles m
LEFT JOIN sellers s ON m.seller_id = s.id;

-- View to get bid details with buyer and motorcycle information
CREATE OR REPLACE VIEW bid_details AS
SELECT 
  b.*,
  by.first_name,
  by.last_name,
  by.contact_phone as buyer_phone,
  by.contact_email as buyer_email,
  m.brand,
  m.model_name,
  m.year,
  m.price as asking_price
FROM bids b
JOIN buyers by ON b.buyer_id = by.id
JOIN motorcycles m ON b.motorcycle_id = m.id;