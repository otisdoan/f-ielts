# Writing Prompts Management - Setup Guide

## Database Setup

### Running the Migration

To create the necessary database tables for the Writing Prompts feature, you need to run the migration file.

#### Option 1: Using Supabase Dashboard (Recommended)
1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Copy the contents of `supabase/migrations/create_writing_prompts.sql`
4. Paste into the SQL Editor and click **Run**

#### Option 2: Using Supabase CLI
```bash
# If you have Supabase CLI installed
supabase migration up
```

### Tables Created

The migration creates three main tables:

1. **`writing_prompts`**
   - Stores IELTS Writing Task 1 and Task 2 questions
   - Fields: title, task_type, instruction, question_text, image_url, sample_answer_json
   - Accessible by all users (read), editable by admins only

2. **`writing_submissions`**
   - Stores student submissions for writing prompts
   - Fields: user_id, prompt_id, content, word_count, time_spent, status
   - Users can only view/edit their own submissions

3. **`writing_feedback`**
   - Stores AI-generated feedback for submissions
   - Fields: submission_id, overall_band, task_achievement, coherence_cohesion, lexical_resource, grammatical_range
   - Users can only view feedback for their own submissions

## Features

### Admin Panel (`/admin/writing`)

The admin panel provides a comprehensive interface to manage writing prompts:

#### ✨ Key Features:
- **Add New Prompts**: Create Task 1 or Task 2 writing questions
- **Edit Existing Prompts**: Update prompt details, instructions, and sample answers
- **Delete Prompts**: Remove outdated or incorrect prompts
- **Search & Filter**: Find prompts by title, question text, or task type
- **Image Preview**: Visual preview of charts/graphs for Task 1 questions
- **Sample Answers**: Provide Band 9.0 sample answers broken into sections:
  - Introduction
  - Overview
  - Body Paragraph 1
  - Body Paragraph 2

#### 🎨 UI Features:
- Responsive design for desktop and mobile
- Real-time search and filtering
- Image preview validation
- Character count for text fields
- Toast notifications for actions
- Modern modal form with sections

### Student Practice (`/practice/writing/[id]`)

Students can practice writing with:
- Split-screen interface (question on left, editor on right)
- Live timer tracking
- Word counter with minimum word requirements
- Auto-save functionality
- AI evaluation submission

## Usage Guide

### Creating a Writing Prompt

1. Navigate to `/admin/writing`
2. Click **"Add New Prompt"**
3. Fill in the required fields:
   - **Title**: Descriptive title for the prompt
   - **Task Type**: Select Task 1 (150 words) or Task 2 (250 words)
   - **Question Text**: The main question or statement
   - **Instructions**: Guidelines for students (word count, time limit)
   - **Image URL** (optional): For Task 1 charts/graphs
   - **Sample Answer** (optional but recommended): Break down a Band 9.0 answer into sections

4. Click **"Create Prompt"**

### Editing a Prompt

1. Find the prompt in the table
2. Click the **Edit** icon (pencil)
3. Modify any fields
4. Click **"Save Changes"**

### Deleting a Prompt

1. Click the **Delete** icon (trash)
2. Confirm the deletion

**⚠️ Warning**: Deleting a prompt will also delete all associated submissions and feedback.

## Data Structure

### Sample Answer JSON Format

```json
{
  "intro": "The bar chart illustrates...",
  "overview": "Overall, it is clear that...",
  "body_1": "Looking at the details, we can see that...",
  "body_2": "In contrast, the figure for..."
}
```

### Example Prompt

```json
{
  "title": "Global Population Trends by Region",
  "task_type": "task1",
  "question_text": "The chart below shows changes in global population by region. Summarize the information by selecting and reporting the main features, and make comparisons where relevant.",
  "instruction": "Write at least 150 words. You should spend about 20 minutes on this task.",
  "image_url": "https://example.com/chart.png",
  "sample_answer_json": {
    "intro": "The bar chart illustrates population growth across different regions...",
    "overview": "Overall, Asia shows the most significant increase...",
    "body_1": "In 1990, Asia had approximately 3 billion people...",
    "body_2": "By contrast, Europe experienced minimal growth..."
  }
}
```

## Security

- **RLS (Row Level Security)** is enabled on all tables
- Only users with role `'admin'` in the `profiles` table can create/edit/delete prompts
- Students can only view their own submissions and feedback
- All database operations are validated on the server side

## API Service

The `WritingService` provides the following methods:

```typescript
// Get all prompts (for admin list)
WritingService.getPrompts()

// Get single prompt by ID
WritingService.getPromptById(id)

// Create new prompt (admin only)
WritingService.createPrompt(promptData)

// Update existing prompt (admin only)
WritingService.updatePrompt(id, updates)

// Delete prompt (admin only)
WritingService.deletePrompt(id)

// Get user's submission history
WritingService.getUserSubmissions()
```

## Troubleshooting

### "Table does not exist" Error
- Ensure you've run the migration file in your Supabase database
- Check the SQL Editor for any errors during execution

### "Permission denied" Error
- Verify the user has `role = 'admin'` in the `profiles` table
- Check RLS policies are correctly applied

### Images Not Loading
- Verify the image URL is publicly accessible
- Check for CORS issues if images are from external sources
- Use HTTPS URLs for security

## Next Steps

1. Run the database migration
2. Log in as an admin user
3. Create your first writing prompt
4. Test the student practice interface
5. Integrate AI evaluation (coming soon)

---

**Need Help?** Check the console for detailed error messages or contact the development team.
