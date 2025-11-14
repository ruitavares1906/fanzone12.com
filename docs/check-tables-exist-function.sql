CREATE OR REPLACE FUNCTION check_tables_exist(table_names TEXT[])
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  table_exists BOOLEAN;
  table_name TEXT;
BEGIN
  table_exists := TRUE;
  
  FOREACH table_name IN ARRAY table_names
  LOOP
    IF NOT EXISTS (
      SELECT FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name = table_name
    ) THEN
      table_exists := FALSE;
      EXIT;
    END IF;
  END LOOP;
  
  RETURN table_exists;
END;
$$;
