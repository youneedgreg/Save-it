# Environment Setup

## Supabase Configuration

To enable authentication and cloud sync, you need to set up Supabase environment variables.

### Steps:

1. Create a `.env.local` file in the root of your project (if it doesn't exist)

2. Add the following variables:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

3. Get your Supabase credentials:
   - Go to [Supabase Dashboard](https://app.supabase.com)
   - Select your project (or create a new one)
   - Go to Settings → API
   - Copy the "Project URL" and "anon public" key

4. Run the database migration:
   - In your Supabase dashboard, go to SQL Editor
   - Copy the contents of `supabase/migrations/001_create_financial_data_table.sql`
   - Paste and run it in the SQL Editor

### Notes:

- The app will work without Supabase credentials, but authentication and cloud sync will be disabled
- Local storage will continue to work regardless of authentication status
- Users can use the app without logging in, but won't have cloud sync

