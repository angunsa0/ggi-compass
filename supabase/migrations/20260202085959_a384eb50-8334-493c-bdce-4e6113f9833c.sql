-- Create catalog_downloads table to track download clicks
CREATE TABLE public.catalog_downloads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.catalog_downloads ENABLE ROW LEVEL SECURITY;

-- Anyone can insert (track downloads)
CREATE POLICY "Anyone can insert catalog downloads"
ON public.catalog_downloads
FOR INSERT
WITH CHECK (true);

-- Only admins can view download logs
CREATE POLICY "Admins can view catalog downloads"
ON public.catalog_downloads
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create index for date-based queries
CREATE INDEX idx_catalog_downloads_created_at ON public.catalog_downloads(created_at DESC);
