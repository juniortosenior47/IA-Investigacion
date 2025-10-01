/*
  # Create increment usage count function

  1. Functions
    - `increment_usage_count` - Safely increments the usage count for a word translation
*/

CREATE OR REPLACE FUNCTION increment_usage_count(
  word_param text,
  from_lang_param text,
  to_lang_param text
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE word_translations 
  SET 
    usage_count = usage_count + 1,
    updated_at = now()
  WHERE 
    word = word_param 
    AND from_language = from_lang_param 
    AND to_language = to_lang_param;
END;
$$;