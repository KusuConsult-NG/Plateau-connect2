# Database Connection Troubleshooting

## Issue
Cannot connect to Supabase database with the provided connection string.

## Error
```
Error: P1001: Can't reach database server at `aws-1-eu-west-2.pooler.supabase.com`
```

## Solution Needed

Get the correct connection string from your Supabase dashboard:

### Steps:
1. Go to [app.supabase.com](https://app.supabase.com)
2. Select your project
3. Click **Project Settings** (gear icon)
4. Go to **Database** section
5. Under **Connection string**, select:
   - **URI** format (not Session or Transaction)
   - Copy the full connection string

### What to look for:
The connection string should look like:
```
postgresql://postgres.[PROJECT-REF]:[YOUR-PASSWORD]@aws-0-eu-west-2.pooler.supabase.com:6543/postgres
```

Or for direct connection:
```
postgresql://postgres.[PROJECT-REF]:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
```

### Parameters to try:
You may need to add parameters:
```
?pgbouncer=true&connection_limit=1
```

## Alternative: Manual Table Creation

If connection issues persist, I can provide SQL scripts to create all tables manually in Supabase SQL Editor.
