-- Create trigger function to auto-create profiles for new users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
DECLARE
    resolved_name TEXT;
BEGIN
    resolved_name := COALESCE(
        NEW.raw_user_meta_data->>'first_name',
        NEW.raw_user_meta_data->>'full_name'
    );
    
    INSERT INTO public.profiles (id, display_name)
    VALUES (NEW.id, resolved_name)
    ON CONFLICT (id) DO NOTHING;
    
    RETURN NEW;
END;
$$;

-- Create trigger on auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- Backfill existing users missing profiles rows
INSERT INTO public.profiles (id, display_name)
SELECT 
    id,
    COALESCE(
        raw_user_meta_data->>'first_name',
        raw_user_meta_data->>'full_name'
    )
FROM auth.users
ON CONFLICT (id) DO NOTHING;
