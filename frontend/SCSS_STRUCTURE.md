# SCSS File Structure Guide

## 📁 Wo lege ich SCSS-Dateien ab?

### Entscheidungsbaum:

```
Ist es ein wiederverwendbarer UI-Component (Button, Input, etc.)?
├─ JA → src/components/ui/ComponentName/
│        ├── ComponentName.tsx
│        ├── ComponentName.scss
│        └── index.ts
└─ NEIN → Ist es layout-spezifisch (Navbar, Footer, Header)?
    ├─ JA → src/components/
    │        ├── ComponentName.tsx
    │        └── ComponentName.scss
    └─ NEIN → Ist es page-spezifisch?
        └─ JA → src/pages/
                 ├── PageName.tsx
                 └── PageName.scss
```

## 🎯 Aktuelle Struktur

### 1. Wiederverwendbare UI Components
**Location:** `src/components/ui/ComponentName/` (Co-Located!)

```
src/components/ui/
├── Button/
│   ├── Button.tsx                    ← React Component
│   ├── Button.scss                   ← SCSS Styles (direkt daneben!)
│   └── index.ts                      ← Barrel Export
└── index.ts                          ← UI Barrel Export
```

**Wann nutzen:**
- Components die überall verwendet werden
- Part einer Design System Library
- Beispiele: Button, Input, Dialog, Card

**Import in Component:**
```tsx
import './Button.scss';  // ← Direkt im gleichen Ordner!
```

**Import für andere Components:**
```tsx
import { Button } from '@/components/ui';  // ← Via Barrel Export
```

---

### 2. Layout/Navigation Components
**Location:** `src/components/` (SCSS direkt neben TSX)

```
src/components/
├── Navbar.tsx                        ← React Component
├── Navbar.scss                       ← SCSS Styles (direkt daneben!)
├── Layout.tsx
└── Layout.scss
```

**Wann nutzen:**
- Layout-spezifische Components (Navbar, Footer, Sidebar)
- Components die nur 1x pro Page vorkommen
- Beispiele: Navbar, Footer, Header, Layout

**Import in Component:**
```tsx
import './Navbar.scss';
```

---

### 3. Page-spezifische Styles
**Location:** `src/pages/`

```
src/pages/
├── Dashboard.tsx
├── Dashboard.scss
├── Login.tsx
└── Login.scss
```

**Wann nutzen:**
- Styles die nur für eine spezifische Page gelten
- Page-spezifische Layouts

**Import in Page:**
```tsx
import './Dashboard.scss';
```

---

## 📝 Naming Conventions

### BEM (Block Element Modifier)

```scss
// ✅ Gut
.navbar { }                    // Block
.navbar__list { }              // Element
.navbar__link { }              // Element
.navbar__link--active { }      // Modifier

// ❌ Schlecht
.navbarList { }                // CamelCase vermeiden
.navbar-list { }               // Kein Unterschied zu Modifier
```

### File Naming

**Partials (werden importiert):**
```
_button.scss    ← Mit Underscore
_navbar.scss
_variables.scss
```

**Standalone (können direkt geladen werden):**
```
Navbar.scss     ← Ohne Underscore (direkt neben Component)
Layout.scss
main.scss
```

## 🔧 Best Practices

### 1. Co-Location für Component-Styles

**DO:**
```
components/
├── Navbar.tsx
└── Navbar.scss           ← Direkt daneben!
```

**DON'T:**
```
components/
└── Navbar.tsx
styles/
└── navbar.scss           ← Zu weit weg!
```

### 2. Shared Styles in styles/

**DO:**
```scss
// styles/components/_button.scss
// Wird von mehreren Components genutzt
```

**DON'T:**
```scss
// components/Button.scss
// Wenn es woanders auch importiert wird
```

### 3. Import-Reihenfolge in Components

```tsx
// ✅ Richtige Reihenfolge
import React from 'react';
import { useAuth } from '@/context';
import { Button } from '@/components/ui/Button';
import './Navbar.scss';           // ← SCSS als letztes!
```

## 📦 Beispiel: Neue Component hinzufügen

### Szenario 1: Wiederverwendbarer Input Component

```bash
# 1. Component-Ordner erstellen
mkdir -p src/components/ui/Input

# 2. Dateien erstellen
touch src/components/ui/Input/Input.tsx
touch src/components/ui/Input/Input.scss
touch src/components/ui/Input/index.ts
```

```scss
// src/components/ui/Input/Input.scss
@use '../../../styles/utils/variables' as *;
@use '../../../styles/utils/mixins' as *;

.base-input {
  padding: $spacing-sm $spacing-md;
  border: 1px solid $border-color;
  border-radius: $border-radius-md;
  @include transition(border-color);

  &:focus {
    border-color: $primary-color;
    @include focus-ring($primary-color);
  }

  &--error {
    border-color: $danger-color;
  }
}
```

```tsx
// src/components/ui/Input/Input.tsx
import { Input as BaseInput } from '@base-ui/react';
import './Input.scss';

export const Input = ({ error, ...props }) => {
  const className = `base-input ${error ? 'base-input--error' : ''}`;
  return <BaseInput className={className} {...props} />;
};
```

```tsx
// src/components/ui/Input/index.ts
export { Input } from './Input';
export type { InputProps } from './Input';
```

---

### Szenario 2: Footer Component (layout-spezifisch)

```bash
# SCSS direkt neben Component
touch src/components/Footer.tsx
touch src/components/Footer.scss
```

```scss
// src/components/Footer.scss
@use '../styles/utils/variables' as *;
@use '../styles/utils/mixins' as *;

.footer {
  padding: $spacing-xl;
  background: $gray-900;
  color: $white;
  margin-top: auto;

  &__content {
    max-width: 1280px;
    margin: 0 auto;
  }

  &__links {
    display: flex;
    gap: $spacing-lg;
  }
}
```

```tsx
// src/components/Footer.tsx
import './Footer.scss';

export const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer__content">
        {/* Content */}
      </div>
    </footer>
  );
};
```

---

### Szenario 3: Dashboard Page mit spezifischen Styles

```bash
touch src/pages/Dashboard.tsx
touch src/pages/Dashboard.scss
```

```scss
// src/pages/Dashboard.scss
@use '../styles/utils/variables' as *;
@use '../styles/utils/mixins' as *;

.dashboard {
  @include grid(12, $spacing-lg);

  &__header {
    grid-column: 1 / -1;
  }

  &__sidebar {
    grid-column: span 3;

    @include lg {
      grid-column: span 2;
    }
  }

  &__main {
    grid-column: span 9;

    @include lg {
      grid-column: span 10;
    }
  }
}
```

## 🎨 Vorhandene Utility Classes

Nutzen Sie die vorhandenen Utilities aus `styles/main.scss`:

```tsx
// Spacing
<div className="mt-4 mb-2">   // margin-top: 2rem, margin-bottom: 1rem
<div className="p-4">          // padding: 2rem

// Flexbox
<div className="flex-center">  // display: flex, align & justify center
<div className="flex-between"> // display: flex, space-between

// Container
<div className="container">    // max-width: 1280px, auto margin
```

## 🔍 Quick Reference

| Component Type | SCSS Location | Import Style | Usage |
|---------------|---------------|--------------|-------|
| UI Component (reusable) | `components/ui/Name/Name.scss` | `import './Name.scss'` | `import { Name } from '@/components/ui'` |
| Layout Component | `components/Name.scss` | `import './Name.scss'` | Direct import |
| Page Component | `pages/Name.scss` | `import './Name.scss'` | Direct import |
| Global Styles | `styles/main.scss` | Imported in `main.tsx` | - |
| Utils (variables/mixins) | `styles/utils/_name.scss` | `@use '../../../styles/utils/name' as *;` | In SCSS files |

## ✅ Checklist für neue Components

- [ ] Entscheide: Wiederverwendbar oder spezifisch?
- [ ] Erstelle SCSS an richtigem Ort
- [ ] Verwende `@use` für Variables/Mixins
- [ ] Verwende BEM Naming Convention
- [ ] Importiere SCSS in Component
- [ ] Teste Build: `npm run build`
- [ ] Checke für Deprecation Warnings

## 📚 Siehe auch

- [BASE_UI_SCSS_GUIDE.md](./BASE_UI_SCSS_GUIDE.md) - Vollständiger SCSS Guide
- [Base UI Docs](https://base-ui.com) - Component Library
- [Sass Docs](https://sass-lang.com) - SCSS Syntax
