-- ================================================
-- SEED DATA FOR GOROCKY DATABASE
-- ================================================
-- This file contains sample data for development and testing purposes
-- Run this after the main database schema has been created

-- ================================================
-- SAMPLE SELLERS DATA
-- ================================================

-- Insert sample sellers (using test user ID for easy cleanup)
INSERT INTO sellers (
  user_id, 
  business_name, 
  contact_phone, 
  contact_email, 
  address, 
  city, 
  state, 
  zip_code, 
  rating, 
  total_sales, 
  verified
) VALUES 
  (
    '8f612af3-9925-48ca-bc14-4dcf6727d47c',  -- Test user ID for easy cleanup
    'Rocky Mountain Cycles',
    '(555) 123-4567',
    'sales@rockymountaincycles.com',
    '1234 Mountain View Drive',
    'Denver',
    'Colorado',
    '80202',
    4.8,
    25,
    true
  ),
  (
    '8f612af3-9925-48ca-bc14-4dcf6727d47c',  -- Test user ID for easy cleanup
    'Highway Heroes Motorcycles',
    '(555) 987-6543',
    'info@highwayheroes.com',
    '5678 Speed Street',
    'Phoenix',
    'Arizona',
    '85001',
    4.5,
    18,
    true
  ),
  (
    '8f612af3-9925-48ca-bc14-4dcf6727d47c',  -- Test user ID for easy cleanup
    'Custom Bike Garage',
    '(555) 456-7890',
    'custom@bikegarage.com',
    '9999 Workshop Lane',
    'Austin',
    'Texas',
    '73301',
    4.2,
    12,
    false
  ),
  (
    '8f612af3-9925-48ca-bc14-4dcf6727d47c',  -- Test user ID for easy cleanup
    'Thunder Road Motors',
    '(555) 789-0123',
    'sales@thunderroadmotors.com',
    '2468 Lightning Street',
    'Las Vegas',
    'Nevada',
    '89101',
    4.6,
    31,
    true
  ),
  (
    '8f612af3-9925-48ca-bc14-4dcf6727d47c',  -- Test user ID for easy cleanup
    'Precision Performance',
    '(555) 234-5678',
    'info@precisionperf.com',
    '1357 Raceway Drive',
    'Charlotte',
    'North Carolina',
    '28201',
    4.9,
    47,
    true
  )
ON CONFLICT DO NOTHING;

-- ================================================
-- SAMPLE BUYERS DATA
-- ================================================

-- Insert sample buyers (using admin user ID - represents who added these buyers)
INSERT INTO buyers (
  user_id,
  first_name,
  last_name,
  contact_phone,
  contact_email,
  address,
  city,
  state,
  zip_code,
  verified
) VALUES 
  (
    '8f612af3-9925-48ca-bc14-4dcf6727d47c',  -- Admin who added this buyer
    'Mike',
    'Johnson',
    '(555) 111-2222',
    'mike.johnson@email.com',
    '123 Rider Road',
    'Los Angeles',
    'California',
    '90210',
    true
  ),
  (
    '8f612af3-9925-48ca-bc14-4dcf6727d47c',  -- Admin who added this buyer
    'Sarah',
    'Williams',
    '(555) 333-4444',
    'sarah.williams@email.com',
    '456 Cruise Avenue',
    'Miami',
    'Florida',
    '33101',
    true
  ),
  (
    '8f612af3-9925-48ca-bc14-4dcf6727d47c',  -- Admin who added this buyer
    'Alex',
    'Rodriguez',
    '(555) 555-6666',
    'alex.rodriguez@email.com',
    '789 Speedway Boulevard',
    'Seattle',
    'Washington',
    '98101',
    false
  ),
  (
    '8f612af3-9925-48ca-bc14-4dcf6727d47c',  -- Admin who added this buyer
    'Emma',
    'Chen',
    '(555) 777-8888',
    'emma.chen@email.com',
    '321 Motorcycle Mall',
    'San Francisco',
    'California',
    '94102',
    true
  ),
  (
    '8f612af3-9925-48ca-bc14-4dcf6727d47c',  -- Admin who added this buyer
    'James',
    'Miller',
    '(555) 999-0000',
    'james.miller@email.com',
    '654 Bike Boulevard',
    'Chicago',
    'Illinois',
    '60601',
    false
  )
ON CONFLICT DO NOTHING;

-- ================================================
-- SAMPLE MOTORCYCLES DATA
-- ================================================

-- Insert sample motorcycles (without seller_id to avoid foreign key issues)
INSERT INTO motorcycles (
  brand,
  model_name,
  year,
  odometer,
  upgrades,
  price,
  status,
  user_id
) VALUES 
  (
    'Ducati',
    'Panigale V4',
    2023,
    2500,
    ARRAY['Akrapovic exhaust', 'Carbon fiber wheels', 'Race ECU tune'],
    28500.00,
    'available',
    '8f612af3-9925-48ca-bc14-4dcf6727d47c'  -- Test user ID for easy cleanup
  ),
  (
    'BMW',
    'S1000RR',
    2022,
    8750,
    ARRAY['HP4 package', 'Carbon fiber bodywork', 'Quick shifter'],
    19800.00,
    'available',
    '8f612af3-9925-48ca-bc14-4dcf6727d47c'  -- Test user ID for easy cleanup
  ),
  (
    'Kawasaki',
    'Ninja H2',
    2021,
    12000,
    ARRAY['Custom paint job', 'Upgraded suspension', 'Performance air filter'],
    22000.00,
    'available',
    '8f612af3-9925-48ca-bc14-4dcf6727d47c'  -- Test user ID for easy cleanup
  ),
  (
    'Yamaha',
    'YZF-R1M',
    2023,
    3200,
    ARRAY['MotoGP replica livery', 'Ohlins suspension', 'Akrapovic titanium exhaust'],
    24500.00,
    'available',
    '8f612af3-9925-48ca-bc14-4dcf6727d47c'  -- Test user ID for easy cleanup
  ),
  (
    'Honda',
    'CBR1000RR-R Fireblade',
    2022,
    6800,
    ARRAY['Track package', 'Carbon fiber wings', 'Quick shifter pro'],
    21200.00,
    'available',
    '8f612af3-9925-48ca-bc14-4dcf6727d47c'  -- Test user ID for easy cleanup
  )
ON CONFLICT DO NOTHING;

-- Update motorcycles to link with sellers (using actual seller IDs)
UPDATE motorcycles 
SET seller_id = s.id 
FROM sellers s 
WHERE motorcycles.user_id = '8f612af3-9925-48ca-bc14-4dcf6727d47c'
  AND s.user_id = '8f612af3-9925-48ca-bc14-4dcf6727d47c'
  AND motorcycles.brand = 'Ducati' 
  AND s.business_name = 'Rocky Mountain Cycles';

UPDATE motorcycles 
SET seller_id = s.id 
FROM sellers s 
WHERE motorcycles.user_id = '8f612af3-9925-48ca-bc14-4dcf6727d47c'
  AND s.user_id = '8f612af3-9925-48ca-bc14-4dcf6727d47c'
  AND motorcycles.brand = 'BMW' 
  AND s.business_name = 'Highway Heroes Motorcycles';

UPDATE motorcycles 
SET seller_id = s.id 
FROM sellers s 
WHERE motorcycles.user_id = '8f612af3-9925-48ca-bc14-4dcf6727d47c'
  AND s.user_id = '8f612af3-9925-48ca-bc14-4dcf6727d47c'
  AND motorcycles.brand = 'Kawasaki' 
  AND s.business_name = 'Custom Bike Garage';

UPDATE motorcycles 
SET seller_id = s.id 
FROM sellers s 
WHERE motorcycles.user_id = '8f612af3-9925-48ca-bc14-4dcf6727d47c'
  AND s.user_id = '8f612af3-9925-48ca-bc14-4dcf6727d47c'
  AND motorcycles.brand = 'Yamaha' 
  AND s.business_name = 'Thunder Road Motors';

UPDATE motorcycles 
SET seller_id = s.id 
FROM sellers s 
WHERE motorcycles.user_id = '8f612af3-9925-48ca-bc14-4dcf6727d47c'
  AND s.user_id = '8f612af3-9925-48ca-bc14-4dcf6727d47c'
  AND motorcycles.brand = 'Honda' 
  AND s.business_name = 'Precision Performance';

-- ================================================
-- SAMPLE BIDS DATA
-- ================================================

-- Insert sample bids using dynamic IDs to avoid foreign key issues
DO $$
DECLARE
  mike_id BIGINT;
  sarah_id BIGINT; 
  alex_id BIGINT;
  emma_id BIGINT;
  james_id BIGINT;
  ducati_id BIGINT;
  bmw_id BIGINT;
  kawasaki_id BIGINT;
  yamaha_id BIGINT;
  honda_id BIGINT;
BEGIN
  -- Get buyer IDs
  SELECT id INTO mike_id FROM buyers WHERE first_name = 'Mike' AND last_name = 'Johnson' AND user_id = '8f612af3-9925-48ca-bc14-4dcf6727d47c';
  SELECT id INTO sarah_id FROM buyers WHERE first_name = 'Sarah' AND last_name = 'Williams' AND user_id = '8f612af3-9925-48ca-bc14-4dcf6727d47c';
  SELECT id INTO alex_id FROM buyers WHERE first_name = 'Alex' AND last_name = 'Rodriguez' AND user_id = '8f612af3-9925-48ca-bc14-4dcf6727d47c';
  SELECT id INTO emma_id FROM buyers WHERE first_name = 'Emma' AND last_name = 'Chen' AND user_id = '8f612af3-9925-48ca-bc14-4dcf6727d47c';
  SELECT id INTO james_id FROM buyers WHERE first_name = 'James' AND last_name = 'Miller' AND user_id = '8f612af3-9925-48ca-bc14-4dcf6727d47c';
  
  -- Get motorcycle IDs
  SELECT id INTO ducati_id FROM motorcycles WHERE brand = 'Ducati' AND model_name = 'Panigale V4' AND user_id = '8f612af3-9925-48ca-bc14-4dcf6727d47c';
  SELECT id INTO bmw_id FROM motorcycles WHERE brand = 'BMW' AND model_name = 'S1000RR' AND user_id = '8f612af3-9925-48ca-bc14-4dcf6727d47c';
  SELECT id INTO kawasaki_id FROM motorcycles WHERE brand = 'Kawasaki' AND model_name = 'Ninja H2' AND user_id = '8f612af3-9925-48ca-bc14-4dcf6727d47c';
  SELECT id INTO yamaha_id FROM motorcycles WHERE brand = 'Yamaha' AND model_name = 'YZF-R1M' AND user_id = '8f612af3-9925-48ca-bc14-4dcf6727d47c';
  SELECT id INTO honda_id FROM motorcycles WHERE brand = 'Honda' AND model_name = 'CBR1000RR-R Fireblade' AND user_id = '8f612af3-9925-48ca-bc14-4dcf6727d47c';
  
  -- Insert bids using actual IDs (multiple bidders per motorcycle)
  INSERT INTO bids (motorcycle_id, buyer_id, bid_amount, status, message, expires_at) VALUES 
    -- DUCATI PANIGALE V4 (3 bidders - competitive!)
    (ducati_id, mike_id, 26500.00, 'pending', 'Very interested in this bike. Can arrange cash payment and pickup within 3 days.', NOW() + INTERVAL '7 days'),
    (ducati_id, sarah_id, 27000.00, 'pending', 'This is exactly what I have been looking for. Flexible on pickup date.', NOW() + INTERVAL '14 days'),
    (ducati_id, emma_id, 26800.00, 'pending', 'Dream bike! Ready to close immediately. Can beat any reasonable offer.', NOW() + INTERVAL '10 days'),
    
    -- BMW S1000RR (4 bidders - very popular!)
    (bmw_id, sarah_id, 18500.00, 'pending', 'Clean bike with great maintenance history. Ready to make a deal.', NOW() + INTERVAL '10 days'),
    (bmw_id, alex_id, 19200.00, 'withdrawn', 'Found another bike locally. Thanks for your time.', NOW() - INTERVAL '1 day'),
    (bmw_id, james_id, 19500.00, 'pending', 'Perfect for track days! Financing pre-approved, can close this week.', NOW() + INTERVAL '5 days'),
    (bmw_id, emma_id, 18800.00, 'pending', 'Love the HP4 package. Can inspect this weekend if available.', NOW() + INTERVAL '12 days'),
    
    -- KAWASAKI H2 (3 bidders)
    (kawasaki_id, mike_id, 20500.00, 'pending', 'Love the custom work done on this H2. Would like to inspect in person.', NOW() + INTERVAL '5 days'),
    (kawasaki_id, alex_id, 21000.00, 'pending', 'Interested buyer, financing approved. Can close quickly.', NOW() + INTERVAL '3 days'),
    (kawasaki_id, james_id, 20800.00, 'pending', 'Supercharged madness! Ready to make a deal today.', NOW() + INTERVAL '8 days'),
    
    -- YAMAHA R1M (2 bidders)
    (yamaha_id, emma_id, 23200.00, 'pending', 'MotoGP replica is stunning! Serious buyer with cash ready.', NOW() + INTERVAL '6 days'),
    (yamaha_id, mike_id, 23800.00, 'pending', 'This R1M is a work of art. Can arrange immediate pickup and payment.', NOW() + INTERVAL '9 days'),
    
    -- HONDA FIREBLADE (2 bidders)
    (honda_id, sarah_id, 20000.00, 'pending', 'Honda reliability with superbike performance. Very interested!', NOW() + INTERVAL '11 days'),
    (honda_id, james_id, 20500.00, 'pending', 'Track package is perfect for my needs. Ready to negotiate.', NOW() + INTERVAL '4 days')
  ON CONFLICT DO NOTHING;
END $$;

-- ================================================
-- VERIFICATION MESSAGE
-- ================================================

-- Display confirmation message
DO $$
BEGIN
  RAISE NOTICE 'Sample data has been inserted successfully!';
  RAISE NOTICE 'Created:';
  RAISE NOTICE '- 5 sellers (Rocky Mountain, Highway Heroes, Custom Bike, Thunder Road, Precision Performance)';
  RAISE NOTICE '- 5 buyers (Mike Johnson, Sarah Williams, Alex Rodriguez, Emma Chen, James Miller)'; 
  RAISE NOTICE '- 5 motorcycles (Ducati Panigale V4, BMW S1000RR, Kawasaki H2, Yamaha R1M, Honda Fireblade)';
  RAISE NOTICE '- 14 bids (13 pending, 1 withdrawn) - Multiple bidders per motorcycle!';
  RAISE NOTICE '';
  RAISE NOTICE 'Bidding Competition:';
  RAISE NOTICE '- Ducati Panigale V4: 3 bidders ($26,500 - $27,000)';
  RAISE NOTICE '- BMW S1000RR: 4 bidders ($18,500 - $19,500)';
  RAISE NOTICE '- Kawasaki H2: 3 bidders ($20,500 - $21,000)';
  RAISE NOTICE '- Yamaha R1M: 2 bidders ($23,200 - $23,800)';
  RAISE NOTICE '- Honda Fireblade: 2 bidders ($20,000 - $20,500)';
  RAISE NOTICE '';
  RAISE NOTICE 'All sample data uses user_id: 8f612af3-9925-48ca-bc14-4dcf6727d47c';
  RAISE NOTICE 'To clean up all test data, delete this user from auth.users';
  RAISE NOTICE 'CASCADE DELETE will remove all related records automatically.';
END $$;