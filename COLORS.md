# Color System Guide

## How to Change Colors

To change the brand orange color throughout the entire application, you only need to update **ONE file**:

### File: `src/styles.css`

Update these CSS variables in the `:root` section (around line 22-26):

```css
:root {
  /* Brand Colors - Change these to update colors throughout the app */
  --color-orange: #EF671D;           /* Main orange color */
  --color-orange-light: #F58A4A;    /* Lighter shade for gradients */
  --color-orange-medium: #E6752F;   /* Medium shade for gradients */
  --color-orange-dark: #D85A1A;     /* Darker shade for hover states */
  ...
}
```

## Usage in Components

### In Tailwind Classes (Recommended)
Use CSS variables with Tailwind's arbitrary value syntax:

```tsx
// Background
className="bg-[var(--color-orange)]"

// Text color
className="text-[var(--color-orange)]"

// Border
className="border-[var(--color-orange)]"

// With opacity
className="bg-[var(--color-orange)]/10"
```

### In Inline Styles
```tsx
style={{ backgroundColor: 'var(--color-orange)' }}
```

### In TypeScript/JavaScript
Import from `@/lib/colors`:

```tsx
import { colors } from '@/lib/colors'

// Use in code
const orangeColor = colors.orange.DEFAULT
```

## Current Colors

- **Orange (Primary)**: `#EF671D`
- **Orange Light**: `#F58A4A`
- **Orange Medium**: `#E6752F`
- **Orange Dark**: `#D85A1A`

## Files Using Colors

All components automatically use the CSS variables, so changing them in `styles.css` will update:
- Buttons
- Inputs
- Links
- Borders
- Backgrounds
- Gradients
- And all other UI elements

