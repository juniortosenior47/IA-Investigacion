/*
  # Create translations table

  1. New Tables
    - `translations`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `original_text` (text)
      - `translated_text` (text)
      - `from_language` (text)
      - `to_language` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `translations` table
    - Add policies for authenticated users to manage their own translations
*/

CREATE TABLE IF NOT EXISTS translations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  original_text text NOT NULL,
  translated_text text NOT NULL,
  from_language text NOT NULL CHECK (from_language IN ('spanish', 'english')),
  to_language text NOT NULL CHECK (to_language IN ('spanish', 'english')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE translations ENABLE ROW LEVEL SECURITY;

-- Policy for users to read their own translations
CREATE POLICY "Users can read own translations"
  ON translations
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Policy for users to insert their own translations
CREATE POLICY "Users can insert own translations"
  ON translations
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Policy for users to update their own translations
CREATE POLICY "Users can update own translations"
  ON translations
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policy for users to delete their own translations
CREATE POLICY "Users can delete own translations"
  ON translations
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS translations_user_id_idx ON translations(user_id);
CREATE INDEX IF NOT EXISTS translations_created_at_idx ON translations(created_at DESC);