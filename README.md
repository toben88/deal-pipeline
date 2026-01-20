# Deal Pipeline Tracker

A professional web application for tracking business acquisition opportunities. Built with React, Vite, Tailwind CSS, and Supabase.

## Features

- ✅ Full CRUD operations (Create, Read, Update, Delete deals)
- 📊 Dashboard with deal statistics
- 🔍 Filter deals by status
- 📈 Sort by multiple criteria
- 👁️ Toggle between table and card views
- 💰 Automatic SDE multiple calculation
- 📱 Responsive design (mobile-friendly)
- 🎨 Clean, professional UI

## Tech Stack

- **Frontend**: React 18 + Vite
- **Styling**: Tailwind CSS
- **Backend**: Supabase (PostgreSQL)
- **Deployment**: GitHub Pages

## Setup Instructions

### 1. Set Up Supabase

1. Go to [supabase.com](https://supabase.com) and create a free account
2. Create a new project
3. Once your project is ready, go to **Table Editor** and create a new table called `deals` with the following columns:

```sql
CREATE TABLE deals (
  id BIGSERIAL PRIMARY KEY,
  business_name TEXT NOT NULL,
  asking_price NUMERIC NOT NULL,
  sde NUMERIC NOT NULL,
  industry TEXT NOT NULL,
  status TEXT NOT NULL,
  location TEXT NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE deals ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations (for testing)
-- Note: In production, you'd want to add authentication and user-specific policies
CREATE POLICY "Allow all operations" ON deals
  FOR ALL
  USING (true)
  WITH CHECK (true);
```

4. Go to **Settings** > **API** and copy:
   - Project URL
   - anon/public key

### 2. Configure Your Local Environment

1. Clone or download this project
2. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
3. Edit `.env` and add your Supabase credentials:
   ```
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   ```

### 3. Install Dependencies and Run Locally

```bash
npm install
npm run dev
```

The app will be available at `http://localhost:5173`

## Deploy to GitHub Pages

### 1. Update vite.config.js

Add your GitHub repository name as the base:

```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/your-repo-name/', // Replace with your actual repo name
})
```

### 2. Install gh-pages Package

```bash
npm install --save-dev gh-pages
```

### 3. Update package.json

Add these scripts to your `package.json`:

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
  }
}
```

### 4. Create GitHub Repository

1. Create a new repository on GitHub
2. Initialize git in your project:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/yourusername/your-repo-name.git
   git push -u origin main
   ```

### 5. Deploy

```bash
npm run deploy
```

This will:
- Build your app
- Create a `gh-pages` branch
- Push the built files to that branch

### 6. Enable GitHub Pages

1. Go to your repository on GitHub
2. Click **Settings** > **Pages**
3. Under "Source", select the `gh-pages` branch
4. Click **Save**

Your app will be live at: `https://yourusername.github.io/your-repo-name/`

## Environment Variables for GitHub Pages

**Important**: GitHub Pages is a static host, so you need to handle environment variables differently:

### Option 1: Build-time Environment Variables

Create `.env.production` with your Supabase credentials:

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

These will be baked into your build when you run `npm run deploy`.

**Note**: Your anon key is safe to expose publicly - Supabase uses Row Level Security to protect your data.

### Option 2: GitHub Actions Secrets (More Secure)

1. Go to your repo **Settings** > **Secrets and variables** > **Actions**
2. Add your secrets:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`

Then create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build
        env:
          VITE_SUPABASE_URL: ${{ secrets.VITE_SUPABASE_URL }}
          VITE_SUPABASE_ANON_KEY: ${{ secrets.VITE_SUPABASE_ANON_KEY }}
      - uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

## Database Schema

The `deals` table includes:

| Column         | Type      | Description                          |
|----------------|-----------|--------------------------------------|
| id             | BIGSERIAL | Auto-incrementing primary key        |
| business_name  | TEXT      | Name of the business                 |
| asking_price   | NUMERIC   | Seller's asking price                |
| sde            | NUMERIC   | Seller's Discretionary Earnings      |
| industry       | TEXT      | Business industry/sector             |
| status         | TEXT      | Deal status (Reviewing, LOI, etc.)   |
| location       | TEXT      | City/State of business               |
| notes          | TEXT      | Additional notes (optional)          |
| created_at     | TIMESTAMP | Auto-generated creation timestamp    |
| updated_at     | TIMESTAMP | Auto-generated update timestamp      |

## Adding Authentication (Optional)

To restrict access to only your data:

1. Enable Supabase Auth in your project
2. Update Row Level Security policies to check `auth.uid()`
3. Add login/signup components to your React app
4. Use `supabase.auth.signIn()` and `supabase.auth.signOut()`

See Supabase Auth docs: https://supabase.com/docs/guides/auth

## Troubleshooting

### App shows "Loading deals..." forever

- Check browser console for errors
- Verify your `.env` file has correct Supabase credentials
- Make sure the `deals` table exists in Supabase
- Check that Row Level Security policies allow access

### GitHub Pages shows blank page

- Check if `base` in `vite.config.js` matches your repo name
- Verify the `gh-pages` branch was created
- Check GitHub Pages settings point to `gh-pages` branch

### Changes not showing after deploy

- Clear browser cache or open in incognito mode
- Wait a few minutes for GitHub Pages to update
- Check the Actions tab for deployment status

## License

MIT

## Support

For issues or questions, please check:
- [Supabase Documentation](https://supabase.com/docs)
- [Vite Documentation](https://vitejs.dev/guide/)
- [React Documentation](https://react.dev/)
