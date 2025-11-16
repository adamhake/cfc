# Color Palette Exploration Guide

Welcome! This guide will help you explore and select the perfect color palette for the Chimborazo Park Conservancy website.

## Quick Start

### Testing the Palettes

1. **Start the development server** (if not already running):

   ```bash
   npm run dev
   ```

2. **Visit the Color Playground**:
   Open your browser to: `http://localhost:3001/color-playground`

3. **Switch between palettes**:
   - Click the **"Palette"** button in the top section
   - Select any of the 6 available palettes
   - Changes apply instantly across the entire page

4. **Toggle dark mode**:
   - Use the **"Theme"** button to test light/dark modes
   - All palettes support both modes
   - Your preference is saved automatically

---

## Available Palettes

### 🌲 Classic Green (Default)

**Best for:** Traditional, professional feel  
**Character:** Cool-toned forest green, nature-focused  
**Mood:** Established, trustworthy, natural

**When to use:**

- You prefer the current design
- Want a safe, proven option
- Need maximum professionalism

---

### 🌿 Warm Olive

**Best for:** Approachable, organic feel  
**Character:** Warmer olive-toned greens  
**Mood:** Welcoming, earthy, friendly

**When to use:**

- Want more warmth than Classic Green
- Prefer a softer, more inviting look
- Value approachability over formality

---

### 🏛️ Green + Terracotta

**Best for:** Historical warmth, Richmond heritage  
**Character:** Forest green + warm clay accents  
**Mood:** Historic, warm, rooted in place

**When to use:**

- Want to reference Richmond's brick architecture
- Need both tradition AND warmth
- Love the historical character of Church Hill
- Want secondary color for variety

**Why it's special:** The terracotta accent beautifully references Richmond's historic brick buildings and adds visual interest without being overwhelming.

---

### 🎓 Green + Navy

**Best for:** Institutional, trustworthy feel  
**Character:** Forest green + deep navy accents  
**Mood:** Professional, established, reliable

**When to use:**

- Need maximum trustworthiness
- Working on grant applications or formal docs
- Want the highest contrast (best accessibility)
- Prefer a more conservative palette

**Accessibility Note:** This palette has the highest contrast ratios of all options!

---

### 🍯 Sage + Amber

**Best for:** Community warmth, volunteer engagement  
**Character:** Soft sage + warm honey tones  
**Mood:** Welcoming, cozy, community-focused

**When to use:**

- Community events are your primary focus
- Recruiting volunteers
- Want maximum approachability
- Love warm, inviting colors

**Perfect for:** Volunteer recruitment pages, community event announcements, neighborhood outreach

---

### 🏛️ Heritage (Iron + Brick)

**Best for:** Historical authenticity, Victorian aesthetic  
**Character:** Iron green + brick red  
**Mood:** Historic, timeless, authentic

**When to use:**

- Want to emphasize the park's history
- Love Victorian-era park aesthetics
- Have historical content to showcase
- Value authenticity and tradition

**Historical Note:**

- **Iron Green** = Traditional park ironwork and patina
- **Brick Red** = Richmond's historic architecture

---

## How to Test Palettes

### 1. Color Playground (`/color-playground`)

The playground shows:

- All button styles
- Card designs
- Typography samples
- Color swatches
- Interactive form elements
- Dark mode comparisons

**Tip:** Try each palette in both light and dark modes!

---

### 2. Real Content Pages

Test palettes on actual pages:

#### Homepage (`/`)

- Hero section with image overlay
- Vision cards
- Event previews
- Partner section

#### Events Page (if available)

- Event cards with status chips
- Image overlays
- Call-to-action buttons

#### Media Page (`/media`)

- Gallery layouts
- Image treatments

**How to test:**

1. Navigate to any page
2. Open mobile menu (hamburger icon)
3. Scroll to bottom
4. Click "Palette" button
5. Select a palette
6. Explore the page with new colors!

---

### 3. Mobile Testing

Don't forget to test on mobile!

**Desktop:**

- Open Chrome DevTools (F12)
- Click "Toggle Device Toolbar" (Ctrl+Shift+M)
- Select iPhone or Android device
- Test palette switcher

**Actual Mobile:**

- Open on your phone
- Test the mobile menu
- Verify colors look good on your screen
- Check dark mode (especially OLED screens)

---

## Decision Framework

### Ask Yourself These Questions:

**1. What's our primary emotion?**

- 🎯 **Professional/Trustworthy** → Navy or Classic Green
- 🤗 **Warm/Welcoming** → Sage+Amber or Green+Terra
- 📜 **Historic/Authentic** → Heritage
- 🌱 **Natural/Organic** → Olive or Classic Green

**2. What's our main call-to-action?**

- 💰 **Donations** → Navy (trust) or Classic (traditional)
- 👥 **Volunteers** → Sage+Amber (community) or Green+Terra (warmth)
- 📚 **Education/History** → Heritage or Classic
- 🌳 **General advocacy** → Olive or Classic

**3. How do we want to stand out?**

- 🎨 **Unique/Memorable** → Heritage or Sage+Amber
- 🛡️ **Traditional/Safe** → Classic Green
- 🔥 **Warm/Inviting** → Green+Terra or Sage+Amber
- 💼 **Professional** → Navy or Classic

**4. What colors do we love?**

- 💚 **Just green** → Classic or Olive
- 🧡 **Warm accents** → Green+Terra or Sage+Amber
- 💙 **Cool accents** → Green+Navy
- ❤️ **Historical** → Heritage (red accents)

---

## Accessibility Guarantee

✅ **All palettes meet WCAG AA standards**  
✅ **Most combinations achieve AAA level**  
✅ **Dark mode fully supported**  
✅ **Tested for color blindness**

You can confidently choose based on aesthetics — accessibility is guaranteed!

See `COLOR_PALETTE_AUDIT.md` for detailed contrast ratios.

---

## Making the Switch

### Once you've chosen a palette:

#### For Development/Testing

The palette preference is saved automatically to localStorage. Just select it and keep browsing!

#### For Production

To make a palette the site-wide default:

**Option 1: Change Default (Code)**
In `src/integrations/tanstack-query/root-provider.tsx`:

```typescript
// Change this line:
this.currentPalette = getStoredPalette() || "green";

// To your preferred palette:
this.currentPalette = getStoredPalette() || "sage-amber"; // or any palette
```

**Option 2: Let Users Choose**
Keep the palette switcher available so community members can choose their preference!

---

## Seasonal Variations (Future Idea)

Consider rotating palettes seasonally:

- 🌸 **Spring:** Sage + Amber (renewal, growth)
- ☀️ **Summer:** Classic Green (lush, vibrant)
- 🍂 **Fall:** Green + Terracotta (harvest, warmth)
- ❄️ **Winter:** Green + Navy (evergreen, cold)

---

## Feedback & Questions

### What to consider when gathering feedback:

**Test with actual users:**

- Board members
- Volunteers
- Community members
- Website visitors

**Ask them:**

1. Which palette feels most "Chimborazo Park"?
2. Which makes you want to get involved?
3. Which best represents our neighborhood?
4. Do the colors work in both light and dark mode?

**Get diverse perspectives:**

- Different age groups
- People with visual impairments
- Smartphone vs. desktop users
- Day vs. night mode users

---

## Technical Details

### Palette System Architecture

**CSS Custom Properties:**

```css
--color-primary-{50-950}  /* Main brand color */
--color-accent-{50-950}   /* Secondary color (if applicable) */
```

**Switching Mechanism:**

- Palettes applied via `data-palette` attribute on `<html>`
- Default palette has no attribute
- Changes via `setPalette()` function
- Persists to localStorage
- Syncs across browser tabs

**Files:**

- Palette definitions: `src/styles.css`
- Palette utilities: `src/utils/palette.ts`
- Hook: `src/hooks/usePalette.ts`
- Switcher component: `src/components/PaletteSwitcher/`
- Demo page: `src/routes/color-playground.tsx`

---

## Quick Comparison Chart

| Palette       | Warmth | Professional | Historic | Unique | Complexity  |
| ------------- | ------ | ------------ | -------- | ------ | ----------- |
| Classic Green | ●●○○○  | ●●●●●        | ●●●○○    | ●●○○○  | ● Simple    |
| Warm Olive    | ●●●●○  | ●●●●○        | ●●○○○    | ●●●○○  | ● Simple    |
| Green+Terra   | ●●●●●  | ●●●○○        | ●●●●●    | ●●●●○  | ●● Medium   |
| Green+Navy    | ●○○○○  | ●●●●●        | ●●●○○    | ●●●○○  | ●● Medium   |
| Sage+Amber    | ●●●●●  | ●●●○○        | ●●○○○    | ●●●●●  | ●● Medium   |
| Heritage      | ●●●○○  | ●●●●○        | ●●●●●    | ●●●●●  | ●●● Complex |

**Legend:**

- ●●●●● = Excellent
- ●●●●○ = Very Good
- ●●●○○ = Good
- ●●○○○ = Moderate
- ●○○○○ = Minimal

---

## Recommended Workflow

### Step-by-Step Palette Selection

**Week 1: Initial Exploration**

1. Visit `/color-playground`
2. Try each palette in light mode
3. Try each palette in dark mode
4. Note your top 3 favorites

**Week 2: Real Content Testing**

1. Test your top 3 on the homepage
2. Test on other key pages
3. Test on mobile devices
4. Get feedback from 2-3 people

**Week 3: Decision Time**

1. Narrow to top 2 palettes
2. Present to board/key stakeholders
3. Gather final feedback
4. Make the decision!

**Week 4: Implementation**

1. Set chosen palette as default
2. Optional: Keep switcher for user choice
3. Update any marketing materials
4. Announce the new look!

---

## Still Can't Decide?

### Try This:

**Default Recommendation:** **Green + Terracotta** (Palette C)

**Why?**

- ✅ Maintains familiar green
- ✅ Adds warmth via terracotta
- ✅ References Richmond's heritage
- ✅ Works for all content types
- ✅ Balanced professionalism + approachability
- ✅ Visually distinct from other organizations

**Runner Up:** **Sage + Amber** (Palette E)

- If community warmth is your #1 priority

---

## Need Help?

The palette system is fully implemented and ready to use. If you need assistance:

1. Check `/color-playground` for live examples
2. Review `COLOR_PALETTE_AUDIT.md` for technical details
3. Test on real pages to see in context

**Remember:** All palettes are accessible and professionally designed. You truly can't make a bad choice — it's about what feels most "Chimborazo Park" to you and your community! 🌳

---

**Happy palette exploring!** 🎨
