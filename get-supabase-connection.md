# How to Get Your Supabase Database Connection String

To get your PostgreSQL connection string from Supabase:

1. Go to your Supabase Dashboard: https://supabase.com/dashboard
2. Select your project (fpiggfldpazvxulkjpcy)
3. Go to **Settings** → **Database**
4. Scroll down to **Connection string** section
5. Select **URI** format
6. Copy the connection string (it will look like: `postgresql://postgres.[project-ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres`)
7. Replace `[YOUR_DATABASE_PASSWORD]` in your `.env` file with the actual password from the connection string

**OR** use the **Connection pooling** tab and copy the **Session mode** connection string.

The connection string format is:
```
postgresql://postgres.fpiggfldpazvxulkjpcy:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres
```

Replace `[PASSWORD]` with your actual database password and `[REGION]` with your region (e.g., `us-east-1`).

