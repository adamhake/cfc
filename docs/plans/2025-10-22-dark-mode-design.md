# Dark Mode Design Document

**Date**: 2025-10-22
**Status**: Design Approved
**Author**: Design session with user

## Overview

This document outlines the complete design for implementing dark mode support on the Chimborazo Park Conservancy website. The implementation provides system preference detection with manual override capability, integrated with the existing TanStack Router architecture.

## Requirements

### Functional Requirements

1. **Theme Control**: Support three theme modes:
   - `light`: Force light mode
   - `dark`: Force dark mode
   - `system`: Automatically match OS preference

2. **User Control**: Manual toggle in header dropdown menu (both desktop and mobile)

3. **Persistence**: Store user preference in localStorage across sessions

4. **System Preference**: Automatically detect and respond to OS dark mode setting

5. **SSR Compatibility**: Prevent flash of incorrect theme on page load (FART prevention)

### Non-Functional Requirements

1. **Accessibility**: Maintain WCAG AA contrast ratios in both themes
2. **Performance**: Zero layout shift, synchronous theme application
3. **Browser Support**: Modern browsers with localStorage and CSS custom properties
4. **Color Design**: Design dark theme based on existing color palette

## Architecture

### 1. Architecture Overview

The dark mode system extends the existing `MyRouterContext` to include theme state, making it available throughout the application via TanStack Router's context system.

**Key Components**:

- **Router Context Extension**: Add theme state to `MyRouterContext` interface
- **SSR-Safe Initialization**: Blocking script in `<head>` prevents theme flash
- **Custom Hook**: `useTheme()` hook provides theme access and control
- **Theme Toggle Component**: Reusable toggle button for theme switching

**Data Flow**:
```
User Interaction → useTheme hook → Router Context → localStorage
                                  → HTML class update → CSS application
```

### 2. Theme State Management

#### Router Context Integration

Extend `MyRouterContext` in `src/routes/__root.tsx`:

```typescript
interface MyRouterContext {
  queryClient: QueryClient;
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  resolvedTheme: 'light' | 'dark';
}

type ThemeMode = 'light' | 'dark' | 'system';
```

#### Context Initialization

Initialize theme in `getContext()` function in `src/router.tsx`:

1. Read from localStorage (client-side only)
2. Default to 'system' if no preference stored
3. Calculate resolved theme based on system preference
4. Provide setter that updates localStorage and HTML class

#### useTheme Hook

Create `src/hooks/useTheme.ts` that:

- Accesses router context via `useRouter()`
- Provides `{ theme, setTheme, resolvedTheme, systemPreference }`
- Handles localStorage synchronization
- Manages HTML class updates
- Listens to system preference changes

**Hook API**:
```typescript
const {
  theme,           // Current preference: 'light' | 'dark' | 'system'
  setTheme,        // Update theme preference
  resolvedTheme,   // Actual theme applied: 'light' | 'dark'
  systemPreference // OS preference: 'light' | 'dark'
} = useTheme();
```

### 3. SSR Strategy & Flash Prevention

#### Blocking Script in `<head>`

Add to `RootDocument` component in `src/routes/__root.tsx`:

```javascript
<script dangerouslySetInnerHTML={{
  __html: `
    (function() {
      try {
        const stored = localStorage.getItem('theme');
        const preference = stored || 'system';
        const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const shouldBeDark = preference === 'dark' || (preference === 'system' && systemDark);
        if (shouldBeDark) {
          document.documentElement.classList.add('dark');
        }
      } catch (e) {
        // Ignore localStorage errors
      }
    })();
  `
}} />
```

This script:
- Runs synchronously before React hydration
- Reads localStorage preference
- Applies `.dark` class to `<html>` element
- Prevents flash of incorrect theme (FART)
- Handles localStorage errors gracefully

#### Initialization Sequence

1. **Server Render**: HTML generated with no `.dark` class (light mode default)
2. **Pre-Hydration**: Blocking script runs, adds `.dark` if needed
3. **Hydration**: React mounts with correct theme already applied
4. **Client Runtime**: useTheme hook manages subsequent updates

### 4. Component Implementation

#### Theme Toggle Component

**File**: `src/components/ThemeToggle/theme-toggle.tsx`

**Features**:
- Three-state toggle: light → dark → system → light
- Icons from `lucide-react`: Sun, Moon, Monitor
- Shows current state with label
- Accessible with ARIA labels
- Smooth transitions using Framer Motion

**Component Structure**:
```typescript
interface ThemeToggleProps {
  variant?: 'button' | 'dropdown-item';
  showLabel?: boolean;
}

export function ThemeToggle({ variant = 'button', showLabel = true }: ThemeToggleProps)
```

**Storybook Stories**: Include all states and variants

#### Header Integration

**Desktop Dropdown Menu** (lines 107-166 in `header.tsx`):
- Add ThemeToggle after navigation links
- Place in left column with navigation items
- Style consistent with existing nav items

**Mobile Full-Screen Menu** (lines 185-275 in `header.tsx`):
- Add ThemeToggle in footer section
- Position above Donate button
- Full-width button matching mobile styles

### 5. Color System & Styling

#### Color Strategy

Use existing green/grey palette from `src/styles.css` with `dark:` variants:

**Backgrounds**:
- Light: `grey-50`, `grey-100` → Dark: `grey-900`, `grey-950`
- Cards: `grey-100` → `grey-800`
- Overlays: `grey-100/75` → `grey-800/75`

**Text Colors**:
- Primary: `grey-800`, `grey-900` → `grey-100`, `grey-50`
- Secondary: `grey-600` → `grey-300`
- Accent: `green-700`, `green-800` → `green-400`, `green-500`

**Borders & Dividers**:
- Light: `grey-200`, `grey-300` → Dark: `grey-700`, `grey-600`

**Interactive States**:
- Hover backgrounds adjusted for visibility in both modes
- Focus rings remain visible with sufficient contrast

#### Components Requiring Dark Variants

All components need `dark:` utility classes added:

1. **Header** (`src/components/Header/header.tsx`)
   - Background blur: `dark:md:bg-grey-800`
   - Borders: `dark:border-grey-700`
   - Button states: `dark:text-green-400`

2. **Hero** (`src/components/Hero/hero.tsx`)
   - Text overlays on images
   - Background overlays for readability

3. **Event Cards** (`src/components/Event/event.tsx`)
   - Card backgrounds: `dark:bg-grey-800`
   - Text colors: `dark:text-grey-100`
   - Borders: `dark:border-grey-700`

4. **Buttons** (`src/components/Button/button.tsx`)
   - All variants: primary, outline, ghost
   - Hover and active states

5. **Footer** (`src/components/Footer/footer.tsx`)
   - Background: `dark:bg-grey-900`
   - Link colors: `dark:text-grey-300`

#### Implementation Method

Add `dark:` prefixed utility classes inline alongside existing classes:

```tsx
<div className="bg-grey-100 dark:bg-grey-800 text-grey-900 dark:text-grey-100">
```

No separate theme files or CSS-in-JS required - leverage Tailwind v4's built-in dark mode support.

#### Accessibility Compliance

- Maintain WCAG AA contrast ratios:
  - Normal text: 4.5:1 minimum
  - Large text: 3:1 minimum
  - UI components: 3:1 minimum
- Test with automated tools and manual verification
- Adjust colors if contrast issues found during visual review

### 6. Data Flow & State Synchronization

#### Complete Flow Diagram

```
User Clicks Toggle
        ↓
   setTheme('dark')
        ↓
   ┌────────────────────┐
   │  Router Context    │
   │  Updates theme     │
   └────────────────────┘
        ↓
   ┌────────────────────┐
   │  useTheme Hook     │
   │  Processes update  │
   └────────────────────┘
        ↓
   ┌──────────┬──────────┐
   ↓          ↓          ↓
localStorage  HTML      Re-render
setItem()    .dark     ThemeToggle
             class
```

#### State Update Logic

```typescript
function setTheme(newTheme: ThemeMode) {
  // 1. Update localStorage
  try {
    localStorage.setItem('theme', newTheme);
  } catch (e) {
    console.warn('Failed to save theme preference', e);
  }

  // 2. Calculate resolved theme
  const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const resolvedTheme = newTheme === 'system'
    ? (systemDark ? 'dark' : 'light')
    : newTheme;

  // 3. Update HTML class
  if (resolvedTheme === 'dark') {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }

  // 4. Update context state (triggers re-render)
  updateContextState(newTheme, resolvedTheme);
}
```

#### System Preference Tracking

Listen to OS theme changes:

```typescript
useEffect(() => {
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

  const handleChange = (e: MediaQueryListEvent) => {
    if (theme === 'system') {
      // User has system preference enabled, update resolved theme
      const newResolved = e.matches ? 'dark' : 'light';
      updateResolvedTheme(newResolved);

      // Update HTML class
      if (newResolved === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  };

  mediaQuery.addEventListener('change', handleChange);
  return () => mediaQuery.removeEventListener('change', handleChange);
}, [theme]);
```

#### Multi-Tab Synchronization

Listen to storage events for cross-tab sync:

```typescript
useEffect(() => {
  const handleStorage = (e: StorageEvent) => {
    if (e.key === 'theme' && e.newValue) {
      // Another tab changed theme preference
      const newTheme = e.newValue as ThemeMode;
      updateThemeFromStorage(newTheme);
    }
  };

  window.addEventListener('storage', handleStorage);
  return () => window.removeEventListener('storage', handleStorage);
}, []);
```

### 7. Error Handling & Edge Cases

#### localStorage Failures

**Scenarios**:
- Private browsing mode (localStorage disabled)
- Storage quota exceeded
- SecurityError in sandboxed contexts

**Handling**:
```typescript
function safeLocalStorageGet(key: string, fallback: string): string {
  try {
    return localStorage.getItem(key) ?? fallback;
  } catch (e) {
    console.warn('localStorage access failed, using fallback', e);
    return fallback;
  }
}

function safeLocalStorageSet(key: string, value: string): void {
  try {
    localStorage.setItem(key, value);
  } catch (e) {
    console.warn('localStorage write failed', e);
    // Continue without persistence - use in-memory state only
  }
}
```

#### SSR Safety

**Server-Side**:
- No localStorage access (undefined)
- No window/document objects
- Default to 'system' preference
- No HTML class manipulation

**Client-Side**:
- Check for `typeof window !== 'undefined'`
- Guard all browser API access
- Blocking script only runs in browser

#### Invalid Data

**localStorage Validation**:
```typescript
type ThemeMode = 'light' | 'dark' | 'system';

function validateTheme(value: string | null): ThemeMode {
  if (value === 'light' || value === 'dark' || value === 'system') {
    return value;
  }
  return 'system'; // Default fallback
}
```

#### Edge Cases to Handle

1. **First Visit**: No stored preference → Use 'system' default
2. **Corrupted localStorage**: Invalid value → Validate and fallback
3. **Multiple Tabs**: Storage events sync changes across tabs
4. **Rapid Toggling**: Debounce unnecessary re-renders
5. **System Change While 'system' Mode**: Update automatically
6. **Clear Storage**: App continues with in-memory state
7. **Browser Back/Forward**: Theme persists correctly

### 8. Testing Strategy

#### Manual Testing Checklist

**Basic Functionality**:
- [ ] Toggle works in desktop dropdown menu
- [ ] Toggle works in mobile full-screen menu
- [ ] Toggle cycles through all three states correctly
- [ ] Current theme is visually indicated in toggle button

**Persistence**:
- [ ] Preference persists across page navigation
- [ ] Preference persists after browser close/reopen
- [ ] Preference persists in localStorage under 'theme' key

**System Preference**:
- [ ] 'system' mode auto-applies OS theme
- [ ] OS theme change updates site immediately when 'system' selected
- [ ] OS theme change ignored when manual mode selected

**SSR & Performance**:
- [ ] No theme flash on initial page load
- [ ] No theme flash on hard refresh
- [ ] No layout shift when theme applies
- [ ] Theme loads before first paint

**Edge Cases**:
- [ ] Multiple tabs sync theme changes
- [ ] First visit with no stored preference
- [ ] Clear localStorage and revisit - defaults to 'system'
- [ ] Private browsing mode works (no localStorage)

**Visual Quality**:
- [ ] All text readable in both themes
- [ ] Sufficient contrast on all components
- [ ] Images/overlays look good in both themes
- [ ] Hover states visible in both themes
- [ ] Focus indicators visible in both themes

**Accessibility**:
- [ ] Toggle button keyboard accessible
- [ ] Screen reader announces current theme
- [ ] WCAG AA contrast ratios verified
- [ ] Color is not the only indicator of state

#### Browser Testing

Test in:
- Chrome/Edge (Chromium)
- Firefox
- Safari (macOS/iOS)
- Mobile browsers (iOS Safari, Chrome Android)

#### Automated Testing Considerations

While primarily manual testing, consider adding:
- Storybook stories for ThemeToggle component states
- Visual regression tests (if Chromatic or similar available)
- Unit tests for theme utility functions

## File Structure

### New Files

1. **`src/utils/theme.ts`** (~50 lines)
   - Type definitions: `ThemeMode`, `ResolvedTheme`
   - Utility functions: `validateTheme()`, `getSystemPreference()`
   - localStorage helpers with error handling

2. **`src/hooks/useTheme.ts`** (~80 lines)
   - Main theme hook implementation
   - Router context integration
   - System preference listener
   - Storage event listener for multi-tab sync

3. **`src/components/ThemeToggle/theme-toggle.tsx`** (~100 lines)
   - Toggle button component
   - Icon logic (Sun/Moon/Monitor)
   - Variant support (button, dropdown-item)
   - Framer Motion animations

4. **`src/components/ThemeToggle/theme-toggle.stories.ts`** (~40 lines)
   - Storybook stories for all states
   - Light/dark/system variants
   - Button and dropdown-item variants

### Modified Files

1. **`src/routes/__root.tsx`**
   - Extend `MyRouterContext` interface
   - Add blocking script to `<head>`
   - Add `dark:` variants to body classes (already has some)

2. **`src/router.tsx`**
   - Initialize theme in `getContext()` function
   - Create theme state management
   - Integrate with existing QueryClient context

3. **`src/components/Header/header.tsx`**
   - Import and add ThemeToggle component
   - Desktop menu integration (left column)
   - Mobile menu integration (footer section)

4. **Component styling updates** (add `dark:` variants):
   - `src/components/Button/button.tsx`
   - `src/components/Hero/hero.tsx`
   - `src/components/Event/event.tsx`
   - `src/components/Footer/footer.tsx`
   - `src/components/Vision/vision.tsx`
   - `src/components/Quote/quote.tsx`
   - Other components as discovered during implementation

### Estimated Lines of Code

- **New code**: ~500-700 lines
- **Modifications**: ~300-500 lines (mostly adding `dark:` variants)
- **Total impact**: ~800-1200 lines

## Implementation Phases

### Phase 1: Core Infrastructure
1. Create `src/utils/theme.ts` with types and utilities
2. Create `src/hooks/useTheme.ts` hook
3. Extend router context in `__root.tsx`
4. Initialize theme in `router.tsx`
5. Add blocking script to `<head>`

**Success Criteria**: Can access theme via hook, toggle updates HTML class

### Phase 2: Theme Toggle Component
1. Create `ThemeToggle` component
2. Integrate with useTheme hook
3. Add Storybook stories
4. Test all three states

**Success Criteria**: Toggle cycles through states, visually correct

### Phase 3: Header Integration
1. Add ThemeToggle to desktop dropdown menu
2. Add ThemeToggle to mobile full-screen menu
3. Style consistently with existing design
4. Test responsive behavior

**Success Criteria**: Toggle accessible and functional in both menus

### Phase 4: Component Dark Mode Styles
1. Add `dark:` variants to Header
2. Add `dark:` variants to Button component
3. Add `dark:` variants to Hero, Event cards
4. Add `dark:` variants to Footer
5. Add `dark:` variants to remaining components

**Success Criteria**: All components have appropriate dark mode styling

### Phase 5: Testing & Refinement
1. Manual testing checklist
2. Cross-browser testing
3. Accessibility verification
4. Color contrast adjustments as needed
5. User feedback and iteration

**Success Criteria**: All test cases pass, accessible, visually polished

## Technical Decisions & Rationale

### Why TanStack Router Integration?

**Advantages**:
- Leverages existing architecture (consistent with QueryClient pattern)
- Enables SSR-safe theme initialization
- Makes theme available throughout route tree
- Single source of truth for application state

**Alternatives Considered**:
- React Context + Custom Hook: More boilerplate, separate from router
- Lightweight Hook Only: Simpler but no SSR benefits, less integrated

### Why localStorage Over Cookies?

**Advantages**:
- Simpler implementation (no cookie parsing)
- Better privacy (not sent with requests)
- More storage space available
- Standard pattern for client-side preferences

**Trade-offs**:
- Requires blocking script for SSR (acceptable with current approach)
- Not available server-side (mitigated by 'system' default)

### Why Blocking Script Over SSR Cookie?

**Advantages**:
- No server-side logic required
- Works with static site deployment
- Simpler implementation
- Proven pattern (used by many frameworks)

**Trade-offs**:
- Small inline script in HTML
- Relies on localStorage being available

### Why Three-State Toggle?

**Advantages**:
- Respects user OS preference by default
- Allows manual override when needed
- "System" option reduces decision fatigue
- Future-proof for OS theme changes

**Trade-offs**:
- Slightly more complex UI than light/dark toggle
- Requires explaining "system" option (mitigated with icon)

## Future Enhancements

### Potential Additions (Out of Scope)

1. **Per-Page Theme Override**: Allow certain pages to force light/dark mode
2. **Custom Color Themes**: Beyond dark/light, add color scheme variations
3. **Animated Theme Transition**: Smooth color transitions when toggling
4. **Theme Scheduling**: Auto-switch at specific times of day
5. **Image Variants**: Serve different images for dark mode
6. **Reduced Motion Support**: Respect `prefers-reduced-motion`

### Maintenance Considerations

1. **New Components**: Remember to add `dark:` variants
2. **Color Palette Changes**: Update both light and dark variants
3. **Accessibility Audits**: Periodically verify contrast ratios
4. **Browser Updates**: Monitor for changes to `prefers-color-scheme` API
5. **User Feedback**: Iterate on color choices based on usage

## Conclusion

This design provides a robust, SSR-safe dark mode implementation that integrates seamlessly with the existing TanStack Router architecture. The three-state toggle (light/dark/system) with localStorage persistence offers excellent UX while the blocking script prevents theme flash.

The phased implementation approach allows for incremental development and testing, with clear success criteria at each phase. Visual refinement of dark mode colors can be iterated on once the feature is functional.

**Next Steps**:
1. Set up isolated git worktree for development
2. Create detailed implementation plan with task breakdown
3. Begin Phase 1: Core Infrastructure implementation
