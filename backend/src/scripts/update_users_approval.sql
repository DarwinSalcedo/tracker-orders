-- Add is_approved column to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS is_approved BOOLEAN DEFAULT FALSE;

-- Optional: Auto-approve existing users (if any)
UPDATE users SET is_approved = TRUE;
