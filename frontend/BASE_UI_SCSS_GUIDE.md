# Base UI + SCSS Setup Guide

## 📦 Was wurde installiert

```bash
npm install @base-ui/react sass
```

- **@base-ui/react**: Headless UI components von MUI (unstyled, accessible)
- **sass**: SCSS/Sass Compiler für Vite

## 📁 Projektstruktur

```
frontend/src/
├── styles/
│   ├── main.scss                 # Main entry point
│   ├── base/
│   │   ├── _reset.scss          # CSS reset
│   │   └── _typography.scss     # Typography styles
│   ├── utils/
│   │   ├── _variables.scss      # SCSS variables (colors, spacing, etc.)
│   │   └── _mixins.scss         # Reusable SCSS mixins
│   ├── components/
│   │   └── _button.scss         # Button component styles
│   ├── layouts/                 # Layout styles (future)
│   └── themes/                  # Theme files (future)
│
└── components/
    └── ui/
        └── Button.tsx            # Base UI Button component
```

## 🎨 SCSS Architektur

### 1. Variables (`utils/_variables.scss`)

Zentrale Stelle für alle Design-Tokens:

```scss
// Colors
$primary-color: #007bff;
$secondary-color: #6c757d;

// Spacing
$spacing-xs: 0.25rem;  // 4px
$spacing-sm: 0.5rem;   // 8px
$spacing-md: 1rem;     // 16px
$spacing-lg: 1.5rem;   // 24px

// Typography
$font-size-base: 1rem;
$font-weight-normal: 400;
$font-weight-bold: 700;

// Breakpoints
$breakpoint-sm: 640px;
$breakpoint-md: 768px;
$breakpoint-lg: 1024px;
```

### 2. Mixins (`utils/_mixins.scss`)

Wiederverwendbare Style-Patterns:

```scss
// Responsive
@include sm { /* Styles for >= 640px */ }
@include md { /* Styles for >= 768px */ }
@include lg { /* Styles for >= 1024px */ }

// Flexbox
@include flex-center;
@include flex-between;
@include flex-column;

// Typography
@include text-truncate;
@include line-clamp(2);

// Transitions
@include transition(all, 200ms);

// Focus
@include focus-ring($primary-color);
```

## 🧩 Base UI Components

### Button Component Beispiel

**React Component (`components/ui/Button.tsx`):**

```tsx
import { Button as BaseButton } from '@base-ui/react/Button';
import '../../styles/components/_button.scss';

export const Button = ({ variant = 'primary', size = 'md', ...props }) => {
  const className = `base-button base-button--${variant} base-button--${size}`;

  return (
    <BaseButton className={className} {...props}>
      {children}
    </BaseButton>
  );
};
```

**SCSS Styles (`styles/components/_button.scss`):**

```scss
.base-button {
  // Base styles
  padding: $spacing-sm $spacing-lg;
  border-radius: $border-radius-md;
  @include transition(all);

  // Variants
  &--primary {
    background-color: $primary-color;
    color: $white;
  }

  &--outline {
    background-color: transparent;
    border: 1px solid $primary-color;
    color: $primary-color;
  }

  // Sizes
  &--sm { padding: $spacing-xs $spacing-md; }
  &--lg { padding: $spacing-md $spacing-xl; }
}
```

## 🚀 Verwendung

### 1. Basic Button

```tsx
import { Button } from '@/components/ui/Button';

function MyComponent() {
  return (
    <Button variant="primary" size="md">
      Click me
    </Button>
  );
}
```

### 2. Mit Custom Styles

```tsx
<Button variant="primary" className="my-custom-class">
  Custom Button
</Button>
```

```scss
.my-custom-class {
  // Override or extend base button styles
  min-width: 200px;
}
```

### 3. Mit Icons

```tsx
<Button variant="outline">
  <span>✓</span>
  <span>Save</span>
</Button>
```

## 📝 Neue Components erstellen

### Schritt 1: SCSS Datei erstellen

```scss
// styles/components/_input.scss

.base-input {
  padding: $spacing-sm $spacing-md;
  border: $border-width solid $border-color;
  border-radius: $border-radius-md;
  font-size: $font-size-base;

  @include transition(border-color);

  &:focus {
    @include focus-ring($primary-color);
    border-color: $primary-color;
  }

  &--error {
    border-color: $danger-color;
  }
}
```

### Schritt 2: Import in main.scss

```scss
// styles/main.scss
@import './components/input';
```

### Schritt 3: React Component

```tsx
// components/ui/Input.tsx
import { Input as BaseInput } from '@base-ui/react/Input';

export const Input = ({ error, ...props }) => {
  const className = `base-input ${error ? 'base-input--error' : ''}`;

  return <BaseInput className={className} {...props} />;
};
```

## 🎯 Best Practices

### 1. BEM Naming Convention

```scss
.component {}           // Block
.component__element {}  // Element
.component--modifier {} // Modifier

// Beispiel:
.card {}
.card__header {}
.card__body {}
.card--highlighted {}
```

### 2. Variables nutzen

```scss
// ❌ Schlecht
.button {
  color: #007bff;
  padding: 8px 16px;
}

// ✅ Gut
.button {
  color: $primary-color;
  padding: $spacing-sm $spacing-md;
}
```

### 3. Mixins für Wiederverwendung

```scss
// ❌ Schlecht
.card {
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal {
  display: flex;
  align-items: center;
  justify-content: center;
}

// ✅ Gut
.card {
  @include flex-center;
}

.modal {
  @include flex-center;
}
```

### 4. Responsive Design

```scss
.component {
  padding: $spacing-sm;

  @include md {
    padding: $spacing-lg;
  }

  @include lg {
    padding: $spacing-xl;
  }
}
```

## 🔧 Vite Konfiguration

Vite unterstützt SCSS out-of-the-box. Keine zusätzliche Konfiguration nötig!

```tsx
// main.tsx
import './styles/main.scss';
```

## 📚 Verfügbare Base UI Components

Base UI bietet folgende headless components:

- **Button**: Accessible button mit Keyboard-Support
- **Input**: Form input mit Validation
- **Select**: Dropdown select
- **Dialog**: Modal/Dialog
- **Checkbox**: Accessible checkbox
- **Radio**: Radio buttons
- **Switch**: Toggle switch
- **Tabs**: Tab navigation
- **Tooltip**: Hover tooltips
- **Popover**: Popover overlays
- **Menu**: Dropdown menus
- **Slider**: Range slider
- **Number Input**: Numeric input mit +/- buttons

Alle Components sind:
- ✅ **Unstyled** - Komplett mit SCSS anpassbar
- ✅ **Accessible** - ARIA-compliant, Keyboard-Navigation
- ✅ **TypeScript** - Vollständige Type-Safety

## 🎨 Theme System (optional)

### Dark Mode Setup

```scss
// styles/themes/_dark.scss

[data-theme="dark"] {
  --background: #{$gray-900};
  --foreground: #{$white};
  --primary: #{lighten($primary-color, 10%)};
}

// styles/themes/_light.scss

[data-theme="light"] {
  --background: #{$white};
  --foreground: #{$gray-900};
  --primary: #{$primary-color};
}
```

```tsx
// App.tsx
function App() {
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return ...;
}
```

## 🧪 Demo Page

Eine vollständige Demo-Seite ist verfügbar:

```tsx
import { ComponentsDemo } from '@/pages/ComponentsDemo';
```

Zeigt alle Varianten und Verwendungen.

## 📖 Weitere Ressourcen

- **Base UI Docs**: https://base-ui.com
- **SCSS Docs**: https://sass-lang.com/documentation
- **BEM Methodology**: https://getbem.com

## 🚀 Nächste Schritte

1. Erstelle weitere UI Components nach dem gleichen Pattern
2. Implementiere ein Theme-System (light/dark mode)
3. Füge weitere Utility-Classes hinzu
4. Erstelle Layout-Components (Grid, Container, etc.)
5. Baue ein Storybook für Component-Dokumentation
