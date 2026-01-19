# INKCAL Deployment Guide

## 🚀 Release-Based Deployment Strategy

This project uses **GitHub Releases** for production deployments to ensure stability and version control.

### Quick Release Command
```bash
gh release create v1.x.x --title "Release v1.x.x" --notes "Release notes"
```

## Lokale Entwicklung

### Backend
1. Navigiere zum Backend-Verzeichnis: `cd backend`
2. Installiere Dependencies: `npm install`
3. Starte den Server: `npm run dev`
4. Der Server läuft auf `http://localhost:3000`

### Frontend
1. Navigiere zum Frontend-Verzeichnis: `cd frontend`
2. Installiere Dependencies: `npm install`
3. Starte den Dev-Server: `npm run dev`
4. Das Frontend läuft auf `http://localhost:5173`

## 📋 Production Deployment URLs

- **Frontend:** https://inkcal.vercel.app
- **Backend:** https://inkcal-production.up.railway.app
- **GitHub:** https://github.com/steffenaichele/INKCAL

## 🔄 Configuring Release-Based Deployments

### Railway (Backend)

**Current:** Auto-deploys on every push to `main`

**To Configure for Releases Only:**
1. Visit [Railway Dashboard](https://railway.app/dashboard)
2. Select `inkcal-backend` → `INKCAL` service
3. Go to **Settings → Source**
4. **Option A - Production Branch Strategy:**
   - Create a `production` branch
   - Set Railway to watch `production` branch
   - Only merge releases into `production`

5. **Option B - Manual Trigger:**
   - Disable auto-deploy
   - Use `railway up` command after each release

**Recommended: Option A with production branch**

### Vercel (Frontend)

**Current:** Auto-deploys on every push to `main`

**To Configure for Releases Only:**
1. Visit [Vercel Dashboard](https://vercel.com/dashboard)
2. Select `inkcal` project → **Settings → Git**
3. **Option A - Production Branch:**
   - Set Production Branch to `production`
   - Create GitHub Actions workflow to update `production` on releases

4. **Option B - Ignored Build Step:**
   - Add build script that checks for release tag
   - Settings → General → Ignored Build Step
   ```bash
   git describe --exact-match --tags HEAD > /dev/null 2>&1
   ```

5. **Option C - Manual Deployment:**
   ```bash
   vercel --prod
   ```

**Recommended: Option A with production branch**

## CORS-Konfiguration

Das Backend ist bereits für folgende Origins konfiguriert:
- `http://localhost:5173` (Development)
- `http://localhost:5174` (Development)
- `https://inkcal.vercel.app` (Production)

Um weitere Origins hinzuzufügen, bearbeite `backend/src/app.ts`:
```typescript
const allowedOrigins = [
    "http://localhost:5173",
    "https://deine-neue-domain.com",
    process.env.FRONTEND_URL
].filter(Boolean);
```

## Authentifizierung

Die App verwendet:
- **JWT Tokens** in HTTP-only Cookies
- **Session-basierte Authentifizierung**
- **CORS mit Credentials** für sichere Cookie-Übertragung

### Wichtig für Production:
- Stelle sicher, dass Backend und Frontend **HTTPS** verwenden
- Cookies mit `sameSite: 'none'` und `secure: true` in Production
- Backend muss die Frontend-URL in CORS erlauben

## Troubleshooting

### CORS-Fehler
- Überprüfe, ob die Frontend-URL in `allowedOrigins` enthalten ist
- Stelle sicher, dass `credentials: true` im Frontend gesetzt ist

### "Failed to fetch" Fehler
- Überprüfe die Environment Variables in Vercel
- Stelle sicher, dass das Backend erreichbar ist
- Überprüfe die Backend-URL in den Fetch-Requests

### Cookie-Probleme
- Überprüfe SameSite-Cookie-Settings im Backend
- Stelle sicher, dass beide (Frontend & Backend) HTTPS verwenden

## Nützliche Befehle

### Build überprüfen
```bash
cd frontend
npm run build
```

### TypeScript-Fehler checken
```bash
cd frontend
npm run type-check
```

### Backend starten
```bash
cd backend
npm run dev
```

## Weitere Informationen

- Frontend: React + TypeScript + Vite
- Backend: Express + MongoDB + JWT
- Auth: Cookie-basiert mit HttpOnly Cookies
- State Management: React Query + Context API
