-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create diagrams table
CREATE TABLE diagrams (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  filename TEXT NOT NULL,
  storage_path TEXT NOT NULL,
  public_url TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create assets table
CREATE TABLE assets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  diagram_id UUID NOT NULL REFERENCES diagrams(id) ON DELETE CASCADE,
  tag TEXT NOT NULL,
  type TEXT NOT NULL,
  coordinates FLOAT8[] NOT NULL,
  verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_diagrams_user_id ON diagrams(user_id);
CREATE INDEX idx_assets_diagram_id ON assets(diagram_id);

-- Enable Row Level Security
ALTER TABLE diagrams ENABLE ROW LEVEL SECURITY;
ALTER TABLE assets ENABLE ROW LEVEL SECURITY;

-- RLS Policies for diagrams
CREATE POLICY "Users can view own diagrams"
  ON diagrams FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own diagrams"
  ON diagrams FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own diagrams"
  ON diagrams FOR UPDATE
  USING (auth.uid() = user_id);

-- RLS Policies for assets
CREATE POLICY "Users can view assets of own diagrams"
  ON assets FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM diagrams
      WHERE diagrams.id = assets.diagram_id
      AND diagrams.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert assets for own diagrams"
  ON assets FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM diagrams
      WHERE diagrams.id = assets.diagram_id
      AND diagrams.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update assets of own diagrams"
  ON assets FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM diagrams
      WHERE diagrams.id = assets.diagram_id
      AND diagrams.user_id = auth.uid()
    )
  );