# Railway Production Branch Setup

## ✅ Vercel ist bereits konfiguriert!

Vercel deployed jetzt nur noch vom `production` Branch. Commits auf `main` erstellen nur Preview-Deployments.

## 🚂 Railway Konfiguration (noch erforderlich)

Railway deployed aktuell noch bei jedem Commit auf `main`. Hier ist wie Sie es ändern:

### Schritt-für-Schritt Anleitung:

1. **Öffne Railway Dashboard:**
   ```
   https://railway.app/project/8a216517-6cc6-4a4e-b957-f4e48cf1e29e
   ```
   Oder: https://railway.app/dashboard → `inkcal-backend`

2. **Wähle den INKCAL Service:**
   - Klicke auf das `INKCAL` Service-Karte

3. **Öffne Service Settings:**
   - Klicke auf das ⚙️ **Settings** Icon (oder "Settings" Tab)

4. **Navigiere zu Source/Deploy:**
   - Im linken Menü: Suche nach **"Source"** oder **"Deploy"** Section
   - Dort findest du: **"Connected Branch"** oder **"Branch"**

5. **Ändere den Branch:**
   - **Aktuell:** `main`
   - **Ändere zu:** `production`
   - Klicke **"Save"** oder **"Update"**

### Screenshot-Hilfe:

Die Einstellung sieht ungefähr so aus:

```
┌─────────────────────────────────────────┐
│ Source                                   │
├─────────────────────────────────────────┤
│ Repository: steffenaichele/INKCAL      │
│ Branch:     [main ▼]  ← Hier ändern!   │
│             production  ← Wähle dies    │
│ Root:       /backend                    │
└─────────────────────────────────────────┘
```

### Nach der Änderung:

✅ Railway deployed nur noch bei Commits auf `production`
✅ Commits auf `main` lösen keine Deployments mehr aus
✅ Releases triggern automatisch Deployments

## 🧪 Testen des Setups

### Test 1: Commit auf main (sollte KEIN Deployment triggern)

```bash
# Mache eine kleine Änderung
echo "# Test" >> README.md
git add README.md
git commit -m "test: Test deployment"
git push origin main
```

**Erwartetes Ergebnis:**
- ❌ Kein Railway Deployment
- ✅ Vercel Preview Deployment

### Test 2: Release erstellen (sollte Deployments triggern)

```bash
gh release create v1.0.1 \
  --title "Release v1.0.1 - Test Release" \
  --notes "Testing release-based deployment"
```

**Erwartetes Ergebnis:**
- ✅ GitHub Actions aktualisiert `production` Branch
- ✅ Railway Deployment startet
- ✅ Vercel Production Deployment startet

## 📊 Deployment Status überprüfen

### Railway Status:
```bash
railway status
railway logs
```

Oder im Dashboard:
- https://railway.app/project/8a216517-6cc6-4a4e-b957-f4e48cf1e29e/service/a49a3826-82a6-4214-98dd-1d74cfd6d30a

### Vercel Status:
```bash
vercel ls --yes
```

Oder im Dashboard:
- https://vercel.com/steffen-aicheles-projects/inkcal/deployments

## ❓ Troubleshooting

### Railway deployed immer noch bei main Commits

**Lösung:**
1. Prüfe ob Branch in Settings korrekt auf `production` gesetzt ist
2. Prüfe ob Auto-Deploy aktiviert ist
3. Warte einige Minuten (Änderungen können verzögert wirken)

### Production Branch wird nicht aktualisiert bei Releases

**Lösung:**
```bash
# Prüfe GitHub Actions
gh run list

# Prüfe production Branch
git fetch origin production
git log origin/production -1
```

### Manuelle Deployment falls nötig

**Railway:**
```bash
cd backend
railway up
```

**Vercel:**
```bash
cd frontend
vercel --prod
```

## 🎯 Zusammenfassung

Nach der Railway-Konfiguration:

✅ **Entwicklung auf main:**
- Commits erstellen nur Previews
- Keine Production-Deployments

✅ **Release erstellen:**
- GitHub Actions aktualisiert `production`
- Railway deployed Backend
- Vercel deployed Frontend

✅ **Versionskontrolle:**
- Semantic Versioning über GitHub Releases
- Einfaches Rollback möglich
- Klare Deployment-Historie

## 📝 Nächste Schritte nach Railway-Setup

1. Teste das Setup mit einem kleinen Release
2. Dokumentiere deine Release-Notes
3. Erstelle bei Bedarf ein CHANGELOG.md
4. Richte optionale Deployment-Notifications ein
