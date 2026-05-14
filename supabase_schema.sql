-- Table: decisions
CREATE TABLE decisions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  options TEXT,
  goal TEXT,
  fear TEXT,
  constraints TEXT,
  emotion TEXT,
  importance INTEGER DEFAULT 5,
  analysis JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Table: profiles
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  plan TEXT DEFAULT 'free',
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- RLS policies
ALTER TABLE decisions ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can only see their own decisions" 
  ON decisions FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can only insert their own decisions" 
  ON decisions FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can only update their own decisions" 
  ON decisions FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can only delete their own decisions" 
  ON decisions FOR DELETE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can only see their own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Trigger to create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email)
  VALUES (new.id, new.email);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
