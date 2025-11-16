# Vertical Rhythm Audit

## Current State Analysis

### Homepage (`/`)

```
- Outer container: space-y-24 pb-24
- Inner sections wrapper: space-y-48
- Section spacing (after Hero):
  - Intro + Gallery: Container spacing="md" (implicit spacing)
  - Gallery to Vision: space-y-48 (192px)
  - Vision to Park: space-y-24 (96px) - INCONSISTENT
  - Park to GetInvolved: space-y-24 (96px)
  - GetInvolved to Events: space-y-24 (96px)
  - Events to Partners: space-y-24 (96px)
  - Partners to Quote: space-y-24 (96px)
```

**Issues:**

- Two different spacing systems: space-y-48 (192px) vs space-y-24 (96px)
- "The Park" section breaks out of space-y-48 wrapper
- Inconsistent rhythm creates visual tension

### Amenities Page (`/amenities`)

```
- Main content wrapper: space-y-8 py-16 md:py-24
- Section spacing:
  - PageHero to Intro: py-16 (64px mobile, 96px desktop)
  - Intro to Upper Park: pt-8 (32px)
  - Upper Park content: mb-12 (48px)
  - Upper to Lower Park: pt-16 (64px)
  - Lower Park content: mb-12 (48px)
  - Lower to Support: pt-16 (64px)
  - Support content: mb-12 (48px)
  - Support to GetInvolved: pt-16 pb-16 (64px)
```

**Issues:**

- Mixes pt-8, pt-16, mb-12 values inconsistently
- Different from homepage spacing
- No clear vertical rhythm system

### Events Page (`/events`)

```
- Outer container: space-y-16 pb-24
- Section spacing:
  - PageHero to Content: space-y-16 (64px)
  - Intro to Events Grid: mt-16 (64px)
```

**Better:** Uses consistent 64px spacing throughout

## Recommended Standardization

### Spacing Scale

- **xl** (space-y-24 = 96px): Major section breaks
- **lg** (space-y-16 = 64px): Standard section breaks
- **md** (space-y-12 = 48px): Subsection breaks
- **sm** (space-y-8 = 32px): Content group breaks

### Application

#### Homepage

```
- Outer: space-y-24 pb-24 (keep)
- Hero (standalone)
- Intro + Gallery section → lg spacing before
- Vision section → lg spacing before
- Park section → lg spacing before
- GetInvolved → lg spacing before
- Events → lg spacing before
- Partners → lg spacing before
- Quote → lg spacing before
```

#### Pages with PageHero

```
- Container after hero: py-16 or space-y-16
- Between major sections: pt-16
- Within sections: mb-12 or space-y-12
- Content groups: space-y-8
```

## Implementation Plan

1. ✅ Audit complete
2. ✅ Standardize homepage vertical rhythm
3. ✅ Update amenities page consistency
4. ✅ Increase to space-y-24 (96px) for more breathing room
5. Document spacing conventions in CLAUDE.md

## Final Spacing System

- **space-y-24 (96px)** - Major section breaks (homepage, amenities, events)
- **space-y-20 (80px)** - Intro to content grid spacing
- **space-y-12 (48px)** - Subsection breaks
- **space-y-8 (32px)** - Content group breaks
- **space-y-4 (16px)** - Tight content spacing
