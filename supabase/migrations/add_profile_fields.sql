-- Migration: Add preferred_language and updated_at to profiles table
-- This allows the user settings page to save these preferences correctly.

ALTER TABLE public.profiles 
  ADD COLUMN IF NOT EXISTS preferred_language text DEFAULT 'en',
  ADD COLUMN IF NOT EXISTS updated_at timestamptz DEFAULT now();
