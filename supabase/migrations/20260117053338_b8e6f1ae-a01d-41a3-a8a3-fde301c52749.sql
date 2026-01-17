-- Drop the existing trigger and function
DROP TRIGGER IF EXISTS on_auth_user_created_admin_check ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user_admin_role();

-- Create new function to auto-assign admin role to first user
CREATE OR REPLACE FUNCTION public.handle_new_user_admin_role()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Check if this is the first user (no admin exists yet)
  IF NOT EXISTS (
    SELECT 1 FROM public.user_roles WHERE role = 'admin'
  ) THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'admin')
    ON CONFLICT (user_id, role) DO NOTHING;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Recreate trigger on auth.users table
CREATE TRIGGER on_auth_user_created_admin_check
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user_admin_role();