# INKCAL Deployment Guide

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

## Production Deployment

### Backend Deployment

#### Option 1: Vercel/Railway/Render
1. Erstelle ein neues Backend-Projekt auf deiner Plattform
2. Verbinde dein Git-Repository
3. Setze folgende Environment Variables:
   ```
   PORT=3000
   MONGODB_URI=deine_mongodb_connection_string
   JWT_SECRET=dein_geheimer_jwt_key
   FRONTEND_URL=https://deine-frontend-url.vercel.app
   ```
4. Deploy das Backend
5. Notiere dir die Backend-URL (z.B. `https://inkcal-backend.railway.app`)

### Frontend Deployment (Vercel)

#### Schritt 1: Environment Variables in Vercel setzen
1. Gehe zu deinem Vercel-Projekt
2. Navigiere zu **Settings → Environment Variables**
3. Füge folgende Variables hinzu:
   ```
   VITE_APP_AUTH_SERVER_URL=https://deine-backend-url.com/api/auth
   VITE_API_URL=https://deine-backend-url.com/api
   ```
4. Wähle **Production**, **Preview**, und **Development** aus

#### Schritt 2: .env.production lokal anpassen
Bearbeite `frontend/.env.production`:
```env
VITE_APP_AUTH_SERVER_URL=https://deine-backend-url.com/api/auth
VITE_API_URL=https://deine-backend-url.com/api
```

#### Schritt 3: Re-Deploy
1. Committe und pushe deine Änderungen
2. Vercel wird automatisch neu deployen
3. Oder manuell in Vercel: **Deployments → Redeploy**

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
