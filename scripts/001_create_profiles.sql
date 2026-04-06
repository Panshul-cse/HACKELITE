-- Create profiles table to store user analysis data
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  github_username TEXT NOT NULL UNIQUE,
  skills TEXT[] DEFAULT '{}',
  top_languages JSONB DEFAULT '[]',
  total_repos INTEGER DEFAULT 0,
  total_commits INTEGER DEFAULT 0,
  contributions INTEGER DEFAULT 0,
  followers INTEGER DEFAULT 0,
  commit_activity INTEGER[] DEFAULT '{}',
  matched_projects JSONB DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on github_username for faster lookups
CREATE INDEX IF NOT EXISTS idx_profiles_github_username ON public.profiles(github_username);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read profiles (public discovery)
CREATE POLICY "profiles_select_all" ON public.profiles 
  FOR SELECT 
  USING (true);

-- Allow anyone to insert profiles (for the onboarding flow)
CREATE POLICY "profiles_insert_all" ON public.profiles 
  FOR INSERT 
  WITH CHECK (true);

-- Allow updates based on github_username match (simplified for demo)
CREATE POLICY "profiles_update_all" ON public.profiles 
  FOR UPDATE 
  USING (true);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to auto-update updated_at
DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
