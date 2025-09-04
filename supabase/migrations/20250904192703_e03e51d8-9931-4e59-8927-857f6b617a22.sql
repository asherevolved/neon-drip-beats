-- Create a function to automatically assign admin role to the specified email
CREATE OR REPLACE FUNCTION public.handle_new_user_admin_check()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = 'public'
AS $$
BEGIN
  -- Check if this is the admin email and automatically assign admin role
  IF NEW.email = 'asherthemaverick@gmail.com' THEN
    INSERT INTO public.profiles (id, email, role, created_at)
    VALUES (NEW.id, NEW.email, 'admin', now())
    ON CONFLICT (id) DO UPDATE SET role = 'admin';
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger to automatically set admin role for the specified email on signup
DROP TRIGGER IF EXISTS on_auth_user_created_admin_check ON auth.users;
CREATE TRIGGER on_auth_user_created_admin_check
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_admin_check();