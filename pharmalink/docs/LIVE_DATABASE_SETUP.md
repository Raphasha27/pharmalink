# PharmaLink: Live PostgreSQL Setup (Supabase / Neon)

Since local PostgreSQL is not detected on your system, the best way to get a "Live" database for your MVP in South Africa is using a managed service like **Supabase** or **Neon.tech**.

## 1. Get a Database URL
1.  Go to [Supabase.com](https://supabase.com) or [Neon.tech](https://neon.tech).
2.  Create a new project called `PharmaLink`.
3.  Go to the **Database Settings** and copy your **Connection String** (URI). It will look like this:
    `postgresql://postgres:[PASSWORD]@db.xxxx.supabase.co:5432/postgres`

## 2. Update Your Environment
Open your `.env` file in `pharmalink/backend/` and update the following:

```env
DB_USER=postgres
DB_PASSWORD=your_secure_password
DB_HOST=db.xxxx.supabase.co
DB_NAME=postgres
DB_PORT=5432
DB_SSL=true
```

## 3. Initialize the Schema
1.  Go to the **SQL Editor** in your Supabase/Neon dashboard.
2.  Copy the contents of `pharmalink/backend/schema.sql`.
3.  Paste it into the SQL Editor and click **Run**.

## 4. Why this is the "HealthTech" Professional Choice
*   **Encrypted Backups:** Automatic daily backups (crucial for POPIA).
*   **Scalability:** When you scale from 1 to 100 pharmacies, you don't need to migrate hardware.
*   **Cape Town Availability:** Both AWS and Azure have ZA regions; using a managed DB ensures your data stays fast and compliant.

---

### Need help connecting?
I have already updated `backend/src/config/db.js` to handle remote SSL connections automatically!
