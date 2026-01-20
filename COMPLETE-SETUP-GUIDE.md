# Deal Pipeline Tracker - Complete Setup Instructions

## Files You Need to Download

1. **App.jsx** - Main React component
2. **supabaseClient.js** - Supabase configuration
3. **supabase-setup.sql** - Database setup script
4. **package.json** - Project dependencies
5. **env.example** - Environment variables template
6. **README.md** - Full documentation

## Step-by-Step Setup

### 1. Create Project Structure

Create a new folder called `deal-pipeline` and inside it create this structure:

```
deal-pipeline/
├── src/
│   ├── App.jsx
│   ├── supabaseClient.js
│   ├── main.jsx
│   └── index.css
├── public/
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── .env
├── .env.example
├── .gitignore
└── supabase-setup.sql
```

### 2. Copy Downloaded Files

Place the downloaded files in their locations:
- `App.jsx` → `src/App.jsx`
- `supabaseClient.js` → `src/supabaseClient.js`
- `package.json` → `package.json`
- `env.example` → `.env.example`
- `supabase-setup.sql` → `supabase-setup.sql`

### 3. Create Additional Required Files

**src/main.jsx:**
```javascript
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
```

**src/index.css:**
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
```

**index.html:**
```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Deal Pipeline Tracker</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

**vite.config.js:**
```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/', // Change to '/your-repo-name/' for GitHub Pages
})
```

**tailwind.config.js:**
```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

**postcss.config.js:**
```javascript
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

**.gitignore:**
```
# Logs
logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
lerna-debug.log*

node_modules
dist
dist-ssr
*.local

# Editor directories and files
.vscode/*
!.vscode/extensions.json
.idea
.DS_Store
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?

# Environment variables
.env
.env.local
.env.production
```

### 4. Set Up Supabase

1. Go to https://supabase.com and create a free account
2. Create a new project
3. Go to **SQL Editor** and run the `supabase-setup.sql` script
4. Go to **Settings** > **API** and copy:
   - Project URL
   - anon public key

### 5. Configure Environment

```bash
# Copy the example file
cp .env.example .env

# Edit .env and add your Supabase credentials
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### 6. Install Dependencies

```bash
cd deal-pipeline
npm install
```

This will install:
- React & React DOM
- Vite
- Tailwind CSS
- Supabase client
- All other dependencies

### 7. Run Development Server

```bash
npm run dev
```

Open http://localhost:5173 in your browser.

### 8. Deploy to GitHub Pages (Optional)

1. Install gh-pages:
```bash
npm install --save-dev gh-pages
```

2. Update `package.json` scripts:
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

3. Update `vite.config.js` base to your repo name

4. Create GitHub repo and push:
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/yourusername/your-repo-name.git
git push -u origin main
```

5. Deploy:
```bash
npm run deploy
```

6. Enable GitHub Pages in repo settings (select gh-pages branch)

## Troubleshooting

**Can't download files?**
- Try right-click → Save As on each file link
- Check your browser's download folder
- Make sure pop-up blocker isn't interfering

**App shows "Loading deals..." forever?**
- Check browser console (F12) for errors
- Verify `.env` has correct Supabase credentials
- Confirm you ran the SQL setup in Supabase
- Check Supabase project is running (not paused)

**GitHub Pages shows blank page?**
- Verify `base` in `vite.config.js` matches repo name
- Clear browser cache
- Check GitHub Actions tab for build errors
- Wait a few minutes after deployment

## Alternative: Create Files Manually

If downloads aren't working, you can:
1. Create each file manually in a text editor
2. Copy/paste the code from the downloaded files
3. Save with the correct filenames

The key files are:
- `src/App.jsx` (main component - largest file)
- `src/supabaseClient.js` (Supabase config - very small)
- `package.json` (dependencies list)
- Configuration files (vite, tailwind, postcss configs)

## Need Help?

If you're still having issues:
1. Check that Node.js is installed (`node -v`)
2. Make sure you're in the project directory
3. Try deleting `node_modules` and running `npm install` again
4. Check the README.md for more detailed troubleshooting
