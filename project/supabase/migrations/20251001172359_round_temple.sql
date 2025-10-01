/*
  # Create word translations table

  1. New Tables
    - `word_translations`
      - `id` (uuid, primary key)
      - `word` (text, the original word)
      - `translation` (text, the translated word)
      - `from_language` (text, source language)
      - `to_language` (text, target language)
      - `usage_count` (integer, how many times this translation was used)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `word_translations` table
    - Add policies for public read access (translations are shared)
    - Add policies for system updates (usage count increments)

  3. Indexes
    - Index on word + from_language + to_language for fast lookups
    - Index on usage_count for cache management
*/

CREATE TABLE IF NOT EXISTS word_translations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  word text NOT NULL,
  translation text NOT NULL,
  from_language text NOT NULL CHECK (from_language IN ('spanish', 'english')),
  to_language text NOT NULL CHECK (to_language IN ('spanish', 'english')),
  usage_count integer DEFAULT 1,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create unique constraint to prevent duplicates
CREATE UNIQUE INDEX IF NOT EXISTS word_translations_unique_idx 
ON word_translations (word, from_language, to_language);

-- Create index for fast lookups
CREATE INDEX IF NOT EXISTS word_translations_lookup_idx 
ON word_translations (word, from_language, to_language);

-- Create index for usage count (for cache management)
CREATE INDEX IF NOT EXISTS word_translations_usage_idx 
ON word_translations (usage_count DESC);

-- Enable RLS
ALTER TABLE word_translations ENABLE ROW LEVEL SECURITY;

-- Allow public read access (translations are shared knowledge)
CREATE POLICY "Public read access for word translations"
  ON word_translations
  FOR SELECT
  TO public
  USING (true);

-- Allow authenticated users to insert new translations
CREATE POLICY "Authenticated users can insert translations"
  ON word_translations
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Allow authenticated users to update usage counts
CREATE POLICY "Authenticated users can update usage counts"
  ON word_translations
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Insert initial word translations from the existing in-memory repository
INSERT INTO word_translations (word, translation, from_language, to_language, usage_count) VALUES
-- Spanish to English
('en', 'in', 'spanish', 'english', 10),
('lingüística', 'linguistics', 'spanish', 'english', 5),
('la', 'the', 'spanish', 'english', 15),
('morfología', 'morphology', 'spanish', 'english', 3),
('es', 'is', 'spanish', 'english', 20),
('el', 'the', 'spanish', 'english', 18),
('estudio', 'study', 'spanish', 'english', 8),
('de', 'of', 'spanish', 'english', 25),
('las', 'the', 'spanish', 'english', 12),
('palabras', 'words', 'spanish', 'english', 7),
('casa', 'house', 'spanish', 'english', 30),
('grande', 'big', 'spanish', 'english', 15),
('me', 'I', 'spanish', 'english', 40),
('gusta', 'like', 'spanish', 'english', 35),
('música', 'music', 'spanish', 'english', 20),
('perro', 'dog', 'spanish', 'english', 25),
('corre', 'runs', 'spanish', 'english', 10),
('rápido', 'fast', 'spanish', 'english', 18),
('estudiamos', 'we study', 'spanish', 'english', 5),
('español', 'Spanish', 'spanish', 'english', 12),
('comida', 'food', 'spanish', 'english', 28),
('está', 'is', 'spanish', 'english', 22),
('deliciosa', 'delicious', 'spanish', 'english', 15),

-- English to Spanish
('in', 'en', 'english', 'spanish', 10),
('linguistics', 'lingüística', 'english', 'spanish', 5),
('the', 'la', 'english', 'spanish', 30), -- High usage for common word
('morphology', 'morfología', 'english', 'spanish', 3),
('is', 'es', 'english', 'spanish', 35),
('study', 'estudio', 'english', 'spanish', 8),
('of', 'de', 'english', 'spanish', 25),
('words', 'palabras', 'english', 'spanish', 7),
('house', 'casa', 'english', 'spanish', 30),
('big', 'grande', 'english', 'spanish', 15),
('i', 'me', 'english', 'spanish', 40),
('like', 'gusta', 'english', 'spanish', 35),
('music', 'música', 'english', 'spanish', 20),
('dog', 'perro', 'english', 'spanish', 25),
('runs', 'corre', 'english', 'spanish', 10),
('fast', 'rápido', 'english', 'spanish', 18),
('we', 'estudiamos', 'english', 'spanish', 5),
('spanish', 'español', 'english', 'spanish', 12),
('food', 'comida', 'english', 'spanish', 28),
('delicious', 'deliciosa', 'english', 'spanish', 15)

ON CONFLICT (word, from_language, to_language) DO NOTHING;