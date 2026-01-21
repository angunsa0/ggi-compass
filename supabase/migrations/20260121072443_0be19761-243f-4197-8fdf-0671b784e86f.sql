-- Change specs column from jsonb to text to allow free-form text input like "1200*600*720"
ALTER TABLE public.products 
ALTER COLUMN specs TYPE text 
USING CASE 
  WHEN specs IS NULL THEN NULL
  WHEN specs = '{}'::jsonb THEN NULL
  ELSE specs::text
END;

-- Update the default value
ALTER TABLE public.products 
ALTER COLUMN specs SET DEFAULT NULL;