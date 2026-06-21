-- Migration: Add last_step column to course_progress
-- Tracks which tab (video/notes/quiz) the user was last on within a module.
-- Enables "Resume at exact step" deep-linking from the dashboard card.
-- Values: 'video' | 'notes' | 'quiz'

ALTER TABLE course_progress
  ADD COLUMN IF NOT EXISTS last_step TEXT DEFAULT 'video';
