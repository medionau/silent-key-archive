# Silent Key Archive — Deploy to Vercel

Estimated time: **10 minutes**

---

## 1. Get a free PostgreSQL database

**Supabase** (recommended — Australian region available):
1. Go to [supabase.com](https://supabase.com) → New project
2. Settings → Database → Connection string → URI
3. Copy the connection string — looks like `postgresql://postgres:[password]@db.[ref].supabase.co:5432/postgres`

**Neon** (alternative):
1. Go to [neon.tech](https://neon.tech) → New project
2. Copy the connection string from the dashboard

---

## 2. Set up locally first

```bash
# 1. Install dependencies
npm install

# 2. Copy env file and fill in your DATABASE_URL and NEXTAUTH_SECRET
cp .env.example .env.local

# Generate a secret:
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# 3. Push the schema to your database
npx prisma db push

# 4. Seed sample data (VK3TOM, VK2AX, VK4RF)
npm run db:seed

# 5. Run locally
npm run dev
```

Visit http://localhost:3000 — search for VK3TOM to verify the seed worked.

---

## 3. Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy (follow the prompts)
vercel
```

When prompted for environment variables, add:
- `DATABASE_URL` — your PostgreSQL connection string
- `NEXTAUTH_SECRET` — the random string you generated
- `NEXTAUTH_URL` — your Vercel app URL (e.g. https://silent-key.vercel.app)

Or set them in the Vercel dashboard under Project → Settings → Environment Variables.

After deploy, run the seed against production:
```bash
DATABASE_URL="your-prod-url" npm run db:seed
```

---

## What's included

| Feature | Status |
|---|---|
| Search by callsign, name, location | ✅ |
| Memorial pages with 5 tabs | ✅ |
| Biography, Timeline, Equipment, Oral History, Tributes | ✅ |
| Operator connections sidebar | ✅ |
| Club memberships sidebar | ✅ |
| Register / Login | ✅ |
| Create and edit memorials | ✅ |
| Add timeline events and equipment from editor | ✅ |
| Tribute submission form | ✅ |
| Seed data: VK3TOM, VK2AX, VK4RF | ✅ |
| File uploads (photos, audio) | Planned |
| Email notifications | Planned |
| OG image generation | Planned |

---

## Demo credentials (after seeding)

Email: `demo@silentkey.net.au`  
Password: `silentkey2024`
