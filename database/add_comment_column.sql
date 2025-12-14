-- Migration: Add comment column to answers table
-- Run this migration on existing databases that don't have the comment column

ALTER TABLE answers ADD COLUMN IF NOT EXISTS comment TEXT;
