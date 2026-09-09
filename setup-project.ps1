# setup-project.ps1
# Run this from inside C:\projects\p6-maths-free
# It writes all required files directly into the project

Write-Host "Setting up P6 Maths project files..." -ForegroundColor Cyan

# Create folders
New-Item -ItemType Directory -Path "api" -Force | Out-Null
New-Item -ItemType Directory -Path "src" -Force | Out-Null

# ── vercel.json ──────────────────────────────────────────────────────────────
Set-Content -Path "vercel.json" -Value @'
{
  "rewrites": [
    { "source": "/api/:path*", "destination": "/api/:path*" },
    { "source": "/parent", "destination": "/index.html" },
    { "source": "/((?!api|assets|.*\\..*).*)", "destination": "/index.html" }
  ],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "X-Frame-Options", "value": "DENY" },
        { "key": "X-XSS-Protection", "value": "1; mode=block" }
      ]
    }
  ]
}
'@
Write-Host "✅ vercel.json written" -ForegroundColor Green

# ── src/main.jsx ─────────────────────────────────────────────────────────────
Set-Content -Path "src\main.jsx" -Value @'
import React from "react"
import ReactDOM from "react-dom/client"
import App from "./p6-prep-maths.jsx"
import ParentView from "./parent-view.jsx"
import "./index.css"

function Root() {
  const path = window.location.pathname;
  if (path === "/parent" || path.startsWith("/parent")) {
    return React.createElement(ParentView);
  }
  return React.createElement(App);
}

ReactDOM.createRoot(document.getElementById("root")).render(
  React.createElement(React.StrictMode, null, React.createElement(Root))
)
'@
Write-Host "✅ src/main.jsx written" -ForegroundColor Green

# ── src/index.css ────────────────────────────────────────────────────────────
Set-Content -Path "src\index.css" -Value @'
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html, body, #root { height: 100%; }
body {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  -webkit-font-smoothing: antialiased;
  background: #07090F;
  overflow-x: hidden;
}
input, button, textarea { font-family: inherit; }
::-webkit-scrollbar { width: 4px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 2px; }
'@
Write-Host "✅ src/index.css written" -ForegroundColor Green

# ── index.html ───────────────────────────────────────────────────────────────
Set-Content -Path "index.html" -Value @'
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
    <meta name="theme-color" content="#07090F" />
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <title>P6 Maths Prep — 2026 PSLE</title>
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
'@
Write-Host "✅ index.html written" -ForegroundColor Green

# ── vite.config.js ───────────────────────────────────────────────────────────
Set-Content -Path "vite.config.js" -Value @'
import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "dist",
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom"],
          supabase: ["@supabase/supabase-js"],
        }
      }
    }
  }
})
'@
Write-Host "✅ vite.config.js written" -ForegroundColor Green

# ── package.json ─────────────────────────────────────────────────────────────
Set-Content -Path "package.json" -Value @'
{
  "name": "p6-maths",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "@supabase/supabase-js": "^2.39.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.2.0",
    "vite": "^5.0.0"
  }
}
'@
Write-Host "✅ package.json written" -ForegroundColor Green

# ── public/favicon.svg ───────────────────────────────────────────────────────
New-Item -ItemType Directory -Path "public" -Force | Out-Null
Set-Content -Path "public\favicon.svg" -Value @'
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <rect width="100" height="100" rx="20" fill="#07090F"/>
  <text y="72" x="50" text-anchor="middle" font-size="60" font-family="system-ui">📚</text>
</svg>
'@
Write-Host "✅ public/favicon.svg written" -ForegroundColor Green

# ── Remove old default files ──────────────────────────────────────────────────
Remove-Item -Path "src\App.jsx" -Force -ErrorAction SilentlyContinue
Remove-Item -Path "src\App.css" -Force -ErrorAction SilentlyContinue
Remove-Item -Path "src\assets" -Recurse -Force -ErrorAction SilentlyContinue
Write-Host "✅ Old Vite default files removed" -ForegroundColor Green

Write-Host ""
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "  Config files done!" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "NOW: Download these 4 large files from Claude" -ForegroundColor Yellow
Write-Host "and copy them into src\ and api\ manually:" -ForegroundColor Yellow
Write-Host ""
Write-Host "  p6-prep-maths.jsx  → src\p6-prep-maths.jsx" -ForegroundColor White
Write-Host "  parent-view.jsx    → src\parent-view.jsx" -ForegroundColor White
Write-Host "  supabase-sync.js   → src\supabase-sync.js" -ForegroundColor White
Write-Host "  api-claude.js      → api\claude.js" -ForegroundColor White
Write-Host ""
Write-Host "Then run: npm install && vercel --prod" -ForegroundColor Green
