# Code Review - Chimborazo Park Conservancy

**Review Date:** 2025-10-15
**Focus Areas:** Performance, Accessibility, Runtime Errors

---

## Executive Summary

**Overall Assessment:** The codebase is well-structured and uses modern React patterns, but has **critical accessibility issues** and several **performance optimization opportunities**. No immediate runtime errors were detected, but there are potential bugs that could cause issues in production.

**Priority Level Issues Found:**

- 🔴 **Critical:** 5 issues (mostly accessibility)
- 🟡 **Medium:** 8 issues (performance & best practices)
- 🟢 **Low:** 3 issues (code quality)

---

## 🔴 Critical Issues

### 1. Missing Navigation Links in Header (Runtime Error Risk)

**File:** `src/components/Header/header.tsx:82-102`

**Issue:** All navigation links use empty `href=""` which will cause page reload and break SPA navigation.

```tsx
<a href="" className="...">About</a>  // ❌ Will reload page
<a href="" className="...">Events</a>
<a href="" className="...">Get Involved</a>
```

**Fix:** Use TanStack Router's `Link` component:

```tsx
import { Link } from "@tanstack/react-router";

<Link to="/about" className="...">About</Link>
<Link to="/events" className="...">Events</Link>
<Link to="/get-involved" className="...">Get Involved</Link>
```

**Impact:** Breaks SPA behavior, causes full page reloads, loses React state.

---

### 2. Non-Functional Buttons (Accessibility & UX)

**Files:**

- `src/components/Header/header.tsx:60-65` (Donate button)
- `src/components/Header/header.tsx:20-26` (Mobile menu button)
- `src/components/Hero/hero.tsx:16-18` (Get Involved button)

**Issue:** Multiple buttons have no functionality:

1. Mobile menu button doesn't open menu (handler missing)
2. Donate button has no href or onClick
3. "Get Involved" button in Hero has no action

```tsx
// ❌ Button with no action
<button type="button" className="...">
  <Menu className="h-5 w-5" />
</button>

// ❌ Button going nowhere
<Button variant="secondary" size="small">
  Get Involved
</Button>
```

**Fix:**

```tsx
// Mobile menu
<button
  type="button"
  onClick={() => setMenuOpen(s => !s)}
  aria-label="Open menu"
  className="..."
>
  <Menu className="h-5 w-5" />
</button>

// Donate button - convert to link
<Link
  to="/donate"
  className="..."
>
  Donate
</Link>

// Get Involved button
<Link to="/get-involved">
  <Button variant="secondary" size="small">
    Get Involved
  </Button>
</Link>
```

**Impact:** Poor UX, keyboard users can't navigate, violates WCAG 2.1 Level A.

---

### 3. Missing Alt Text and Poor Image Accessibility

**Files:** Multiple components

**Issues:**

1. **Header:** `header.tsx:114` - Image has wrong alt text

   ```tsx
   <img src="/chimbo_arial.webp" alt="Quote Icon" /> // ❌ Wrong description
   ```

2. **Event Component:** `event.tsx:18-21` - Missing loading/decoding attributes

   ```tsx
   <img src={image.src} alt={image.alt} /> // ❌ No performance attrs
   ```

3. **Vision Component:** `vision.tsx:28` - Has unused `image` prop in interface but never uses it

**Fixes:**

```tsx
// Header
<img
  src="/chimbo_arial.webp"
  alt="Aerial view of Chimborazo Park"
  loading="lazy"
  decoding="async"
/>

// Event Component
<img
  src={image.src}
  alt={image.alt}
  loading="lazy"
  decoding="async"
  className="..."
/>
```

**Impact:** Screen readers provide incorrect information, poor performance on slow connections.

---

### 4. Form Accessibility Issues

**File:** `src/components/GetInvolved/get-involved.tsx:21-33`

**Issues:**

1. No label for email input
2. No form validation
3. No error handling
4. Form doesn't actually submit anywhere

```tsx
// ❌ No label, no validation, no action
<form className="...">
  <input type="email" placeholder="Email Address" />
  <button type="submit">Submit</button>
</form>
```

**Fix:**

```tsx
<form onSubmit={handleSubmit} noValidate>
  <label htmlFor="email-signup" className="sr-only">
    Email Address
  </label>
  <input
    id="email-signup"
    type="email"
    name="email"
    placeholder="Email Address"
    required
    aria-required="true"
    aria-invalid={hasError}
    aria-describedby={hasError ? "email-error" : undefined}
  />
  {hasError && (
    <p id="email-error" className="error" role="alert">
      Please enter a valid email address
    </p>
  )}
  <button type="submit" aria-label="Subscribe to newsletter">
    Submit
  </button>
</form>
```

**Impact:** Fails WCAG 2.1 Level A (1.3.1 Info and Relationships, 3.3.2 Labels or Instructions).

---

### 5. Missing Skip Link

**File:** `src/routes/__root.tsx`

**Issue:** No skip navigation link for keyboard users to bypass repeated header.

**Fix:** Add skip link in root route:

```tsx
function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body className="bg-stone-50 dark:bg-stone-900">
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        <ClientOnly>
          <Header />
        </ClientOnly>
        <main id="main-content">{children}</main>
        <Footer />
        {/* ... */}
      </body>
    </html>
  );
}
```

Add CSS for skip link in `styles.css`:

```css
.skip-link {
  position: absolute;
  top: -40px;
  left: 0;
  background: #000;
  color: white;
  padding: 8px;
  z-index: 100;
}
.skip-link:focus {
  top: 0;
}
```

**Impact:** Keyboard users must tab through entire header on every page.

---

## 🟡 Medium Priority Issues

### 6. Performance - Unoptimized Images

**Files:** Multiple components

**Issues:**

1. **Hero Component** (`hero.tsx:5`): Large background image loaded via CSS
2. **Event Component** (`event.tsx:18-21`): No lazy loading
3. **Quote Component** (`quote.tsx:7-11`): Background image not optimized
4. **Media Component** (`media.tsx:19`): Background image loaded via CSS

```tsx
// ❌ CSS background = can't lazy load
<div className="... bg-[url(/chimbo_hero_adj.webp)] bg-cover">
```

**Fix:** Use `@unpic/react` for optimized images:

```tsx
import { Image } from "@unpic/react";

<div className="relative h-[80vh] w-full overflow-hidden px-4">
  <Image
    src="/chimbo_hero_adj.webp"
    layout="fullWidth"
    priority // Hero should load immediately
    alt="Chimborazo Park landscape"
    className="absolute inset-0 object-cover"
  />
  {/* content */}
</div>;
```

For non-hero images, use `loading="lazy"`:

```tsx
<Image src="/chimbo_arial.webp" layout="fullWidth" loading="lazy" alt="..." className="..." />
```

**Impact:** Slow initial page load, poor Lighthouse scores, wasted bandwidth.

---

### 7. Performance - Header Media Query Runs on Every Render

**File:** `src/components/Header/header.tsx:9`

**Issue:** `useMediaQuery` hook re-evaluates on every render and returns completely different JSX.

```tsx
const isMoblie = useMediaQuery("screen and (max-width: 768px)"); // ❌ Typo + re-renders

if (isMoblie) {
  return <div>...</div>; // Different component tree
}
return <div>...</div>; // Different component tree
```

**Problems:**

1. Typo: `isMoblie` should be `isMobile`
2. Causes unnecessary re-renders
3. Returns completely different components instead of using CSS

**Fix:** Use CSS for responsive behavior:

```tsx
export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const ref = useClickAway<HTMLElement>(() => setMenuOpen(false));

  return (
    <div className="fixed top-4 right-4 left-4 z-20 flex flex-row items-center justify-center">
      <header ref={ref} className="...">
        <div className="flex w-full items-center justify-between gap-2">
          {/* Mobile menu button - show on mobile only */}
          <button className="flex md:hidden ...">
            <Menu className="h-5 w-5" />
          </button>

          {/* Desktop menu button - show on desktop only */}
          <button className="hidden md:flex ...">
            {menuOpen ? <X /> : <Menu />}
            <span>{menuOpen ? "Close" : "Menu"}</span>
          </button>

          {/* Logo - hidden on mobile, shown on desktop */}
          <div className="hidden items-center gap-2 md:flex">{/* logo content */}</div>

          <IconLogo className="mx-3 h-8 w-8 md:h-10 md:w-10" />

          <button className="...">Donate</button>
        </div>

        {/* Menu content */}
        <AnimatePresence>{menuOpen && <motion.div>...</motion.div>}</AnimatePresence>
      </header>
    </div>
  );
}
```

**Impact:** Poor performance on mobile, inconsistent component tree causes React to unmount/remount.

---

### 8. Performance - Framer Motion Animations May Cause Layout Shifts

**File:** `src/components/Header/header.tsx:70-76`

**Issue:** Animating `height: auto` can cause reflows and janky animations.

```tsx
<motion.div
  initial={{ height: 0, opacity: 0 }}
  animate={{ height: "auto", opacity: 1 }}  // ❌ height: auto is expensive
  exit={{ height: 0, opacity: 0 }}
>
```

**Fix:** Use `maxHeight` or `transform: scaleY()` instead:

```tsx
<motion.div
  initial={{ maxHeight: 0, opacity: 0 }}
  animate={{ maxHeight: 500, opacity: 1 }}  // Or measure actual height
  exit={{ maxHeight: 0, opacity: 0 }}
  transition={{ type: "spring", stiffness: 300, damping: 30 }}
  style={{ overflow: "hidden" }}
>
```

Or use transform for better performance:

```tsx
<motion.div
  initial={{ scaleY: 0, opacity: 0 }}
  animate={{ scaleY: 1, opacity: 1 }}
  exit={{ scaleY: 0, opacity: 0 }}
  style={{ transformOrigin: "top", overflow: "hidden" }}
>
```

**Impact:** Janky animations, poor performance on low-end devices.

---

### 9. Button Component - className Prop Not Spread Correctly

**File:** `src/components/Button/button.tsx:40`

**Issue:** `className` is passed as array element instead of string:

```tsx
className={cn(
  "...",
  { /* variants */ },
  size === "small" && "...",
  ...className,  // ❌ Spreads string as array
)}
```

**Fix:**

```tsx
className={cn(
  "cursor-pointer rounded-xl px-8 py-3...",
  {
    "border border-green-800...": variant === "primary",
    // ... other variants
  },
  size === "small" && "px-4 py-3 text-xs",
  className  // ✅ Just pass it directly
)}
```

The `cn` function (via `clsx`) already handles strings correctly. Spreading strings creates issues.

**Impact:** Custom classNames may not apply correctly, potential runtime errors.

---

### 10. Missing Error Boundaries

**Files:** No error boundaries found

**Issue:** No error boundaries to catch runtime errors in components.

**Fix:** Add error boundary in root route:

```tsx
// src/components/ErrorBoundary/error-boundary.tsx
import { Component, type ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Error caught by boundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="flex min-h-screen items-center justify-center">
            <div className="text-center">
              <h1 className="text-2xl font-bold">Something went wrong</h1>
              <p className="mt-2">Please refresh the page</p>
            </div>
          </div>
        )
      );
    }

    return this.props.children;
  }
}
```

Use in `__root.tsx`:

```tsx
<ErrorBoundary>{children}</ErrorBoundary>
```

**Impact:** Unhandled errors crash entire app instead of showing graceful fallback.

---

### 11. Missing Focus Management for Modal Menu

**File:** `src/components/Header/header.tsx:68-131`

**Issue:** When menu opens, focus is not trapped, and ESC key doesn't close it.

**Fix:**

```tsx
import { useEffect, useRef } from "react";

export default function Header() {
  // ... existing code
  const firstFocusableRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    if (menuOpen) {
      // Focus first link when menu opens
      firstFocusableRef.current?.focus();

      // Close on ESC key
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === "Escape") setMenuOpen(false);
      };
      window.addEventListener("keydown", handleEscape);
      return () => window.removeEventListener("keydown", handleEscape);
    }
  }, [menuOpen]);

  return (
    // ... JSX
    <motion.div>
      <nav>
        <ul>
          <li>
            <a ref={firstFocusableRef} href="">
              About
            </a>
          </li>
          {/* ... */}
        </ul>
      </nav>
    </motion.div>
  );
}
```

**Impact:** Poor keyboard accessibility, menu can't be closed with ESC key.

---

### 12. Events Data Not Used Correctly

**File:** `src/routes/index.tsx:133-146`

**Issue:** The `events` array from `src/data/events.ts` is imported but hardcoded values are used instead:

```tsx
{
  events.map((event, index) => (
    <Event
      key={`event-${event.id}`}
      description="Id cupidatat fugiat..." // ❌ Hardcoded
      title="Chimbo Park Conservancy Gala" // ❌ Hardcoded
      location="Meet at the fountain circle" // ❌ Hardcoded
      date="November, 6, 2025" // ❌ Hardcoded
      time="9am - 1pm" // ❌ Hardcoded
      image={{
        src: ["/festival.webp", "/recreation.webp", "/get_involved.webp"][index % 3],
        alt: "Chimbo Park Conservancy Gala",
      }}
    />
  ));
}
```

**Fix:**

```tsx
{
  events.map((event) => (
    <Event
      key={event.id}
      description={event.description}
      title={event.title}
      location={event.location}
      date={event.date}
      time={event.time} // Add to Event interface
      image={event.image} // Update Event interface
    />
  ));
}
```

Update `src/data/events.ts`:

```tsx
export interface Event {
  id: number;
  title: string;
  description: string;
  date: string;
  time: string; // Add this
  location: string;
  image: {
    src: string;
    alt: string;
  };
}
```

**Impact:** Data model is disconnected from UI, harder to maintain.

---

### 13. Missing Meta Tags and SEO

**File:** `src/routes/__root.tsx:20-32`

**Issue:** Minimal meta tags, generic title, no Open Graph or Twitter cards.

**Fix:**

```tsx
head: () => ({
  meta: [
    { charSet: "utf-8" },
    { name: "viewport", content: "width=device-width, initial-scale=1" },
    {
      name: "description",
      content: "The Chimborazo Park Conservancy preserves and enhances this Church Hill landmark through community stewardship. Join our volunteer efforts in Richmond, VA."
    },
    { name: "keywords", content: "Chimborazo Park, Richmond VA, Church Hill, park conservancy, volunteer, community" },

    // Open Graph
    { property: "og:type", content: "website" },
    { property: "og:title", content: "Chimborazo Park Conservancy" },
    { property: "og:description", content: "Preserving and enhancing Chimborazo Park through community stewardship" },
    { property: "og:image", content: "/chimbo_hero_adj.webp" },

    // Twitter Card
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: "Chimborazo Park Conservancy" },
    { name: "twitter:description", content: "Preserving and enhancing Chimborazo Park through community stewardship" },
    { name: "twitter:image", content: "/chimbo_hero_adj.webp" },
  ],
  links: [
    { rel: "stylesheet", href: appCss },
    { rel: "canonical", href: "https://chimborazopark.org" },
  ],
  title: "Chimborazo Park Conservancy | Preserving Richmond's Historic Park",
}),
```

**Impact:** Poor SEO, bad social media previews, harder to discover.

---

## 🟢 Low Priority Issues

### 14. Unused Props in Vision Component

**File:** `src/components/Vision/vision.tsx:8-11`

**Issue:** Interface defines `contentPosition` and `image` props that are never used.

```tsx
interface VisionProps {
  contentPosition?: "left" | "right"; // ❌ Not used
  image?: {
    // ❌ Not used
    src: string;
    alt: string;
  };
}
```

**Fix:** Remove unused props or implement them:

```tsx
interface VisionProps {
  title: string;
  icon: "leafy-green" | "trees" | "heart-handshake" | "book-open-text";
  description: string;
  // Remove unused props
}
```

---

### 15. Console Warning - Fast Refresh

**File:** `src/integrations/tanstack-query/root-provider.tsx:3`

**Issue:** ESLint warning about Fast Refresh:

```
Fast refresh only works when a file only exports components.
```

**Fix:** Split utility functions and components:

```tsx
// src/integrations/tanstack-query/context.ts
import { QueryClient } from "@tanstack/react-query";

export function getContext() {
  const queryClient = new QueryClient();
  return { queryClient };
}

// src/integrations/tanstack-query/root-provider.tsx
import { QueryClientProvider, type QueryClient } from "@tanstack/react-query";

export function Provider({
  children,
  queryClient,
}: {
  children: React.ReactNode;
  queryClient: QueryClient;
}) {
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
```

Update imports in `router.tsx`.

---

### 16. Missing Tests

**Issue:** No test files found in `src/` directory.

**Recommendation:** Add tests for:

1. Button component variants
2. Event component rendering
3. Header menu functionality
4. Form validation in GetInvolved

**Example test:**

```tsx
// src/components/Button/button.test.tsx
import { render, screen } from "@testing-library/react";
import { Button } from "./button";

describe("Button", () => {
  it("renders children", () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText("Click me")).toBeInTheDocument();
  });

  it("calls onClick when clicked", () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Click</Button>);
    screen.getByText("Click").click();
    expect(onClick).toHaveBeenCalledOnce();
  });

  it("applies variant styles", () => {
    render(<Button variant="primary">Primary</Button>);
    const button = screen.getByText("Primary");
    expect(button).toHaveClass("bg-green-700");
  });
});
```

---

## Recommended Action Plan

### Week 1: Critical Accessibility Fixes

1. Fix all navigation links (Issue #1)
2. Add proper button functionality (Issue #2)
3. Fix form accessibility (Issue #4)
4. Add skip link (Issue #5)

### Week 2: Image & Performance Optimization

1. Implement lazy loading for all images (Issue #3, #6)
2. Use `@unpic/react` for optimized images
3. Fix header responsive behavior (Issue #7)
4. Optimize Framer Motion animations (Issue #8)

### Week 3: Code Quality & Testing

1. Fix Button className spreading (Issue #9)
2. Add error boundaries (Issue #10)
3. Implement focus management (Issue #11)
4. Write component tests (Issue #16)

### Week 4: SEO & Polish

1. Add comprehensive meta tags (Issue #13)
2. Fix data mapping (Issue #12)
3. Clean up unused props (Issue #14, #15)
4. Performance audit with Lighthouse

---

## Testing Recommendations

Run these commands to verify fixes:

```bash
# Lint check
npm run lint

# Type check
npm run build

# Accessibility audit (install pa11y)
npx pa11y http://localhost:3000

# Performance audit
npx lighthouse http://localhost:3000 --view
```

---

## Conclusion

The codebase has a solid foundation but requires immediate attention to accessibility issues. Most critical issues can be resolved in 1-2 weeks. Focus on WCAG 2.1 Level AA compliance for keyboard navigation, screen readers, and form accessibility.

**Estimated effort:**

- Critical fixes: 16-24 hours
- Medium priority: 20-30 hours
- Low priority: 4-8 hours
- **Total: 40-62 hours**
