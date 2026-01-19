# Release-Based Deployment Setup Guide

## ✅ Was bereits konfiguriert wurde

1. ✅ GitHub Release v1.0.0 erstellt
2. ✅ `production` Branch erstellt
3. ✅ GitHub Actions Workflow erstellt (`.github/workflows/deploy-on-release.yml`)
4. ✅ DEPLOYMENT.md aktualisiert

## 🔧 Manuelle Konfiguration erforderlich

### Railway Backend - Production Branch Setup

**Schritte:**

1. Öffne [Railway Dashboard](https://railway.app/dashboard)
2. Wähle Projekt `inkcal-backend`
3. Klicke auf Service `INKCAL`
4. Gehe zu **Settings → Source**
5. Ändere **Branch** von `main` zu `production`
6. Klicke auf **Update**

**Was passiert dann:**
- Railway deployed NUR noch bei Changes am `production` Branch
- Der `production` Branch wird automatisch bei jedem GitHub Release aktualisiert
- Commits auf `main` lösen KEINE Deployments mehr aus

### Vercel Frontend - Production Branch Setup

**Schritte:**

1. Öffne [Vercel Dashboard](https://vercel.com/dashboard)
2. Wähle Projekt `inkcal`
3. Gehe zu **Settings → Git**
4. Bei **Production Branch** ändere von `main` zu `production`
5. Klicke auf **Save**

**Was passiert dann:**
- Vercel deployed NUR noch bei Changes am `production` Branch
- Preview-Deployments funktionieren weiterhin für alle anderen Branches
- Commits auf `main` erstellen Preview-Deployments (nicht Production)

## 🚀 Wie funktioniert der Release-Workflow?

### 1. Entwicklung auf main Branch
```bash
# Normale Entwicklung
git add .
git commit -m "feat: Add new feature"
git push origin main
```
**Ergebnis:** Keine Production-Deployments, nur Preview-Deployments auf Vercel

### 2. Release erstellen
```bash
# Wenn bereit für Production
gh release create v1.1.0 \
  --title "Release v1.1.0 - New Features" \
  --notes "## Changes
- Added feature X
- Fixed bug Y"
```

### 3. Automatischer Ablauf
1. GitHub Actions startet automatisch
2. `production` Branch wird auf den Release-Tag aktualisiert
3. Railway detected den Change und deployed automatisch
4. Vercel detected den Change und deployed automatisch
5. ✅ Production ist aktualisiert!

## 📋 Release-Workflow Beispiele

### Patch Release (Bug Fix)
```bash
# v1.0.0 → v1.0.1
gh release create v1.0.1 \
  --title "Release v1.0.1 - Bug Fixes" \
  --notes "## Bug Fixes
- Fixed authentication issue
- Corrected form validation"
```

### Minor Release (New Features)
```bash
# v1.0.1 → v1.1.0
gh release create v1.1.0 \
  --title "Release v1.1.0 - New Features" \
  --notes "## New Features
- Added user profile page
- Implemented email notifications

## Bug Fixes
- Fixed minor UI issues"
```

### Major Release (Breaking Changes)
```bash
# v1.1.0 → v2.0.0
gh release create v2.0.0 \
  --title "Release v2.0.0 - Major Update" \
  --notes "## ⚠️ Breaking Changes
- Changed API endpoints structure
- Updated authentication flow

## Migration Guide
1. Update frontend API calls
2. Re-authenticate all users

## New Features
- Complete UI redesign
- New dashboard layout"
```

## 🔄 Rollback Strategy

Falls ein Release Probleme verursacht:

```bash
# 1. Checkout zum vorherigen Release
git checkout v1.0.0

# 2. Force-update production branch
git branch -f production v1.0.0
git push origin production --force

# 3. Railway und Vercel deployen automatisch die alte Version
```

## 🧪 Testing vor Release

### Empfohlener Workflow:

1. **Feature Branch erstellen:**
   ```bash
   git checkout -b feature/new-feature
   # ... Entwicklung ...
   git push origin feature/new-feature
   ```

2. **Pull Request erstellen:**
   ```bash
   gh pr create --title "Add new feature" --base main
   ```

3. **Preview-Deployment testen:**
   - Vercel erstellt automatisch einen Preview-Link
   - Teste alle Features im Preview

4. **Nach Approval: Merge to main:**
   ```bash
   gh pr merge
   ```

5. **Erst nach finalem Test: Release erstellen**

## 📊 Monitoring

### Check Deployment Status

**Railway:**
```bash
railway status
railway logs
```

**Vercel:**
```bash
vercel ls
vercel logs
```

**GitHub Actions:**
```bash
gh run list
gh run view
```

## ⚡ Quick Commands

```bash
# Neuen Release erstellen (Minor)
gh release create v1.$(( $(gh release list --limit 1 | cut -f1 | cut -d. -f2) + 1 )).0 --generate-notes

# Production Branch Status
git log production -1

# Letzten Release ansehen
gh release view

# Alle Releases auflisten
gh release list
```

## 🎯 Vorteile dieser Strategie

✅ **Kontrolle:** Deployments nur bei expliziten Releases
✅ **Versionierung:** Klare Semantic Versioning
✅ **Rollback:** Einfaches Zurückrollen zu vorherigen Versionen
✅ **Testing:** Preview-Deployments für alle Feature-Branches
✅ **Dokumentation:** Release Notes dokumentieren alle Änderungen
✅ **Automation:** GitHub Actions automatisiert den Deployment-Prozess

## ❓ Troubleshooting

### GitHub Actions Workflow läuft nicht

**Prüfen:**
```bash
gh workflow list
gh workflow enable "Deploy on Release"
```

### Production Branch nicht aktualisiert

**Manuell aktualisieren:**
```bash
git checkout production
git reset --hard v1.0.0  # oder gewünschter Tag
git push origin production --force
```

### Railway deployed nicht automatisch

**Prüfen:**
1. Railway Dashboard → Service Settings → Source
2. Stelle sicher Branch ist auf `production` gesetzt
3. Prüfe Railway Logs auf Fehler

### Vercel deployed nicht automatisch

**Prüfen:**
1. Vercel Dashboard → Project Settings → Git
2. Stelle sicher Production Branch ist `production`
3. Prüfe Vercel Deployment Logs

## 📞 Support

Bei Fragen oder Problemen:
- GitHub Issues: https://github.com/steffenaichele/INKCAL/issues
- Railway Docs: https://docs.railway.app
- Vercel Docs: https://vercel.com/docs
