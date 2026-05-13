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

-- RLS policies
ALTER TABLE decisions ENABLE ROW LEVEL SECURITY;

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
