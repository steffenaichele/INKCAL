# INKCAL Design Token Documentation

> Complete design system tokens for Figma implementation

## 1. Color Palette

### Brand Colors

| Token Name | Value | Hex | Usage Example |
|------------|-------|-----|---------------|
| Primary | `$primary-color` | `#007bff` | Primary buttons, links, active states |
| Secondary | `$secondary-color` | `#6c757d` | Secondary buttons, muted elements |
| Success | `$success-color` | `#28a745` | Success messages, confirmations |
| Danger | `$danger-color` | `#dc3545` | Error messages, delete actions |
| Warning | `$warning-color` | `#ffc107` | Warning alerts, caution states |
| Info | `$info-color` | `#17a2b8` | Info messages, help text |
| Light | `$light-color` | `#f8f9fa` | Light backgrounds, subtle containers |
| Dark | `$dark-color` | `#343a40` | Dark text, footers |

### Neutral Colors

| Token Name | Value | Hex | Usage Example |
|------------|-------|-----|---------------|
| White | `$white` | `#ffffff` | Pure white backgrounds |
| Gray 100 | `$gray-100` | `#f8f9fa` | Lightest gray, hover states |
| Gray 200 | `$gray-200` | `#e9ecef` | Borders, dividers |
| Gray 300 | `$gray-300` | `#dee2e6` | Default border color |
| Gray 400 | `$gray-400` | `#ced4da` | Input borders, disabled states |
| Gray 500 | `$gray-500` | `#adb5bd` | Placeholder text |
| Gray 600 | `$gray-600` | `#6c757d` | Muted text, icons |
| Gray 700 | `$gray-700` | `#495057` | Body text, paragraphs |
| Gray 800 | `$gray-800` | `#343a40` | Dark text |
| Gray 900 | `$gray-900` | `#212529` | Headings, primary text |
| Black | `$black` | `#000000` | Pure black |

---

## 2. Typography

### Font Families

| Token Name | Value | Usage Example |
|------------|-------|---------------|
| Base | `$font-family-base` | `-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif` | Body text, UI elements |
| Monospace | `$font-family-monospace` | `'Courier New', Courier, monospace` | Code blocks, technical text |

### Font Sizes

| Token Name | Value (rem) | Value (px) | Usage Example |
|------------|-------------|------------|---------------|
| Extra Small | `$font-size-xs` | `0.75rem` | 12px | Small labels, captions |
| Small | `$font-size-sm` | `0.875rem` | 14px | Secondary text, small UI |
| Medium (Base) | `$font-size-md` | `1rem` | 16px | Body text, default size |
| Large | `$font-size-lg` | `1.125rem` | 18px | Emphasized text |
| Extra Large | `$font-size-xl` | `1.25rem` | 20px | Large UI elements |
| Extra Extra Large | `$font-size-xxl` | `1.5rem` | 24px | Subheadings |

### Font Weights

| Token Name | Value | Usage Example |
|------------|-------|---------------|
| Light | `$font-weight-light` | 300 | Light text emphasis |
| Normal | `$font-weight-normal` | 400 | Body text, default weight |
| Medium | `$font-weight-medium` | 500 | Medium emphasis |
| Semibold | `$font-weight-semibold` | 600 | Strong emphasis |
| Bold | `$font-weight-bold` | 700 | Headings, important text |

### Line Heights

| Token Name | Value | Usage Example |
|------------|-------|---------------|
| Small | `$line-height-sm` | 1.25 | Headings, compact text |
| Base | `$line-height-base` | 1.5 | Body text, paragraphs |
| Large | `$line-height-lg` | 2 | Loose text, increased readability |

---

## 3. Heading Styles

| Element | Font Size (rem) | Font Size (px) | Font Weight | Line Height | Color | Margin Bottom |
|---------|-----------------|----------------|-------------|-------------|-------|---------------|
| H1 | `2.5rem` | 40px | 700 (Bold) | 1.25 | `#212529` (Gray 900) | 24px |
| H2 | `2rem` | 32px | 700 (Bold) | 1.25 | `#212529` (Gray 900) | 16px |
| H3 | `1.75rem` | 28px | 700 (Bold) | 1.25 | `#212529` (Gray 900) | 16px |
| H4 | `1.5rem` | 24px | 700 (Bold) | 1.25 | `#212529` (Gray 900) | 8px |
| H5 | `1.25rem` | 20px | 700 (Bold) | 1.25 | `#212529` (Gray 900) | 8px |
| H6 | `1rem` | 16px | 700 (Bold) | 1.25 | `#212529` (Gray 900) | 4px |

---

## 4. Spacing Scale

| Token Name | Value (rem) | Value (px) | Usage Example |
|------------|-------------|------------|---------------|
| Extra Small | `$spacing-xs` | `0.25rem` | 4px | Minimal spacing, tight layouts |
| Small | `$spacing-sm` | `0.5rem` | 8px | Small gaps, compact elements |
| Medium (Base) | `$spacing-md` | `1rem` | 16px | Standard spacing, default gaps |
| Large | `$spacing-lg` | `1.5rem` | 24px | Section spacing, card padding |
| Extra Large | `$spacing-xl` | `2rem` | 32px | Large sections, generous padding |
| Extra Extra Large | `$spacing-xxl` | `3rem` | 48px | Major sections, hero spacing |

---

## 5. Border Radius

| Token Name | Value (rem) | Value (px) | Usage Example |
|------------|-------------|------------|---------------|
| Small | `$border-radius-sm` | `0.25rem` | 4px | Buttons, small elements |
| Medium | `$border-radius-md` | `0.375rem` | 6px | Input fields, cards |
| Large | `$border-radius-lg` | `0.5rem` | 8px | Large cards, modals |
| Extra Large | `$border-radius-xl` | `0.75rem` | 12px | Hero cards, featured content |
| Full | `$border-radius-full` | `9999px` | Full circle | Avatars, badges, pills |

### Border Properties

| Token Name | Value | Usage Example |
|------------|-------|---------------|
| Width | `$border-width` | 1px | Default border thickness |
| Color | `$border-color` | `#dee2e6` (Gray 300) | Default border color |

---

## 6. Shadows

| Token Name | Value | Visual Description | Usage Example |
|------------|-------|-------------------|---------------|
| Small | `$shadow-sm` | `0 1px 2px 0 rgba(0, 0, 0, 0.05)` | Subtle depth, hover states |
| Medium | `$shadow-md` | `0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)` | Cards, dropdowns |
| Large | `$shadow-lg` | `0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)` | Modals, popovers |
| Extra Large | `$shadow-xl` | `0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)` | Hero sections, elevated content |

---

## 7. Transitions

### Transition Speeds

| Token Name | Value | Usage Example |
|------------|-------|---------------|
| Fast | `$transition-speed-fast` | 150ms | Quick hover effects, button states |
| Base | `$transition-speed-base` | 200ms | Standard transitions, UI interactions |
| Slow | `$transition-speed-slow` | 300ms | Smooth animations, page transitions |

### Transition Easing

| Token Name | Value | Description | Usage Example |
|------------|-------|-------------|---------------|
| Timing | `$transition-timing` | `cubic-bezier(0.4, 0, 0.2, 1)` | Ease in-out curve | All transitions, smooth movement |

---

## 8. Breakpoints

| Token Name | Value | Device Type | Usage Example |
|------------|-------|-------------|---------------|
| Small | `$breakpoint-sm` | 640px | Mobile landscape, small tablets |
| Medium | `$breakpoint-md` | 768px | Tablets portrait |
| Large | `$breakpoint-lg` | 1024px | Tablets landscape, small desktops |
| Extra Large | `$breakpoint-xl` | 1280px | Desktops |
| Extra Extra Large | `$breakpoint-xxl` | 1536px | Large desktops, wide screens |

---

## 9. Z-Index Scale

| Token Name | Value | Layer | Usage Example |
|------------|-------|-------|---------------|
| Dropdown | `$z-index-dropdown` | 1000 | Dropdown menus |
| Sticky | `$z-index-sticky` | 1020 | Sticky navigation, headers |
| Fixed | `$z-index-fixed` | 1030 | Fixed position elements |
| Modal Backdrop | `$z-index-modal-backdrop` | 1040 | Modal overlay backgrounds |
| Modal | `$z-index-modal` | 1050 | Modal dialogs |
| Popover | `$z-index-popover` | 1060 | Popovers, context menus |
| Tooltip | `$z-index-tooltip` | 1070 | Tooltips (highest layer) |

---

## Additional Typography Styles

### Text Elements

| Element | Color | Margin Bottom | Additional Properties |
|---------|-------|---------------|----------------------|
| Paragraph | `#495057` (Gray 700) | 16px | Default body text |
| Link | `#007bff` (Primary) | - | Hover: underline, darker shade |
| Muted Text | `#6c757d` (Gray 600) | - | Secondary information |

### List Styles

| Property | Value | Usage Example |
|----------|-------|---------------|
| Padding Left | 24px | Indentation for ul/ol |
| Margin Bottom | 16px | Spacing after lists |
| List Item Margin | 4px | Spacing between items |

---

## Quick Reference: File Paths

- **Variables**: `src/styles/utils/_variables.scss`
- **Typography**: `src/styles/base/_typography.scss`

---

## Notes for Figma Implementation

1. **Base Font Size**: All rem values are based on 16px (1rem = 16px)
2. **Color Usage**: Use semantic color names (primary, success, etc.) for consistent theming
3. **Spacing System**: Uses a base spacer of 16px with multiples for consistency
4. **Shadow Layering**: Shadows use multiple layers for more natural depth
5. **Responsive Design**: Five breakpoints cover mobile to large desktop screens
6. **Z-Index Hierarchy**: Organized in increments of 10-20 for flexibility

This design system follows modern CSS practices and provides a solid foundation for scalable UI development.
