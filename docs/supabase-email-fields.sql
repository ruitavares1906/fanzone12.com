-- SQL Script to check and add email-related fields to Supabase orders table
-- Run this in your Supabase SQL Editor

-- 1. Check current structure of orders table
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'orders'
ORDER BY ordinal_position;

-- 2. Add carrier field if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'orders' AND column_name = 'carrier'
    ) THEN
        ALTER TABLE orders ADD COLUMN carrier TEXT;
        RAISE NOTICE 'Added carrier column';
    ELSE
        RAISE NOTICE 'carrier column already exists';
    END IF;
END $$;

-- 3. Add tracking_url field if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'orders' AND column_name = 'tracking_url'
    ) THEN
        ALTER TABLE orders ADD COLUMN tracking_url TEXT;
        RAISE NOTICE 'Added tracking_url column';
    ELSE
        RAISE NOTICE 'tracking_url column already exists';
    END IF;
END $$;

-- 4. Verify the fields were added
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'orders' 
  AND column_name IN ('carrier', 'tracking_url', 'tracking_number')
ORDER BY column_name;

-- 5. Optional: Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_orders_carrier ON orders(carrier);
CREATE INDEX IF NOT EXISTS idx_orders_tracking_number ON orders(tracking_number);

-- 6. Optional: Add comments to document the fields
COMMENT ON COLUMN orders.carrier IS 'Shipping carrier ID (e.g., dhl, ups, fedex, ctt)';
COMMENT ON COLUMN orders.tracking_url IS 'Full tracking URL generated from carrier and tracking number';
COMMENT ON COLUMN orders.tracking_number IS 'Tracking number provided by the carrier';

