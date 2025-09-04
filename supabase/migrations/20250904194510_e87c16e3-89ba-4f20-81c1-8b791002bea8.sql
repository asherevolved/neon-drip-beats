-- Fix profiles table RLS policies to allow profile creation via trigger
-- First drop existing restrictive policies
DROP POLICY IF EXISTS "Allow public read access to profiles" ON public.profiles;
DROP POLICY IF EXISTS "Allow users to update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;

-- Create proper RLS policies for profiles table
-- Allow users to view their own profile and admins to view all profiles
CREATE POLICY "Users can view own profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = id OR EXISTS (
  SELECT 1 FROM public.profiles 
  WHERE id = auth.uid() AND role = 'admin'
));

-- Allow users to update their own profile
CREATE POLICY "Users can update own profile" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = id);

-- Allow profile creation via trigger (SECURITY DEFINER functions can bypass RLS)
CREATE POLICY "Allow profile creation" 
ON public.profiles 
FOR INSERT 
WITH CHECK (true);

-- Also ensure the trigger function has proper permissions to work
CREATE OR REPLACE FUNCTION public.handle_new_user_admin_check()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
BEGIN
  -- Check if this is the admin email and automatically assign admin role
  IF NEW.email = 'asherthemaverick@gmail.com' THEN
    INSERT INTO public.profiles (id, email, role, created_at)
    VALUES (NEW.id, NEW.email, 'admin', now())
    ON CONFLICT (id) DO UPDATE SET role = 'admin', email = NEW.email;
  ELSE
    -- Create regular user profile
    INSERT INTO public.profiles (id, email, role, created_at)
    VALUES (NEW.id, NEW.email, 'user', now())
    ON CONFLICT (id) DO UPDATE SET email = NEW.email;
  END IF;
  
  RETURN NEW;
END;
$function$;