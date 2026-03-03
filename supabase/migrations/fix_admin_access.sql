-- =====================================================
-- FIX ADMIN ACCESS - RUN THIS IN SUPABASE SQL EDITOR
-- =====================================================

-- Step 1: Check if profile exists for current user
-- Replace 'YOUR_USER_ID' with the actual user ID from the JSON response
-- Example: SELECT * FROM profiles WHERE id = '4484f791-0ba3-45f6-a992-24fcaa3da68a';
SELECT * FROM profiles WHERE id = 'YOUR_USER_ID';

-- Step 2: If profile doesn't exist, create it
-- Replace 'YOUR_USER_ID' and 'YOUR_EMAIL' with actual values
INSERT INTO public.profiles (id, role, full_name, avatar_url, created_at, updated_at)
VALUES (
  'YOUR_USER_ID',  -- Replace with your user ID
  'admin', 
  'Admin User',    -- Replace with your name
  null,
  now(),
  now()
)
ON CONFLICT (id) DO UPDATE 
SET 
  role = 'admin',
  updated_at = now();

-- Step 3: Verify profile was created/updated
SELECT id, role, full_name, created_at, updated_at 
FROM profiles 
WHERE id = 'YOUR_USER_ID';

-- Step 4: Check and fix RLS policies
-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON profiles;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON profiles;
DROP POLICY IF EXISTS "Enable update for users based on id" ON profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can view all profiles" ON profiles;

-- Create simple and permissive RLS policies
CREATE POLICY "Users can view all profiles"
  ON profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert their own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Step 5: Grant permissions
GRANT ALL ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO anon;

-- Step 6: Verify RLS is enabled
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'profiles';

-- Step 7: List all policies on profiles table
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies 
WHERE tablename = 'profiles';
