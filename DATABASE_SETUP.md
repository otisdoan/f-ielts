# Database Setup Guide

## Supabase Connection
Your project is connected to: `https://xlaqpohacbvldspaqigs.supabase.co`

## Run Listening Tests Migration

### Option 1: Via Supabase Dashboard (RECOMMENDED - 2 minutes)

1. Open your Supabase project: https://supabase.com/dashboard/project/xlaqpohacbvldspaqigs
2. Click on **SQL Editor** in the left sidebar (⚡ icon)
3. Click **New Query**
4. Copy the entire content from `supabase/migrations/create_listening_tests.sql`
5. Paste into the SQL Editor
6. Click **Run** (or press Ctrl+Enter)
7. Wait for success message ✅

### Option 2: Quick Copy-Paste

**Copy this SQL and run it in Supabase SQL Editor:**

```sql
-- Run this in Supabase SQL Editor
DROP TABLE IF EXISTS listening_tests CASCADE;

CREATE TABLE listening_tests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  target_band NUMERIC,
  duration INT,
  audio_url TEXT NOT NULL,
  audio_duration INT,
  can_replay BOOLEAN DEFAULT false,
  parts JSONB NOT NULL,
  created_by UUID REFERENCES auth.users(id),
  is_published BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE listening_tests ENABLE ROW LEVEL SECURITY;

-- [Copy rest of the policies from create_listening_tests.sql]
```

### Option 3: Via Command Line (If you have Supabase CLI)

```bash
# Install Supabase CLI if not installed
npm install -g supabase

# Login
supabase login

# Link project
supabase link --project-ref xlaqpohacbvldspaqigs

# Run migration
supabase db push
```

## Verify Migration

After running, verify by:
1. Go to **Table Editor** in Supabase Dashboard
2. You should see `listening_tests` table
3. Check if sample data exists (1 test: "Practice Test #04")

## Test the App

After migration:
1. Go to http://localhost:3000/admin/listening-tests
2. You should see the sample test
3. Try editing it - should work now! ✅
4. Try creating a new test

## Troubleshooting

**Error: "relation listening_tests does not exist"**
- Migration not run yet. Follow Option 1 above.

**Error: "Failed to load test"**
- Check if test exists in database
- Check browser console for detailed error
- Verify API route is working: http://localhost:3000/api/listening-tests

**Table exists but empty**
- Run the INSERT statement from migration file to add sample data
- Or create a new test via admin UI

---

📝 **Note**: All your data is stored in real Supabase database, no mock data!
