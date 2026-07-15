# Design Tokens

The atomic values every other file in this pack builds on. The system is **Dark Fintech** — charcoal surfaces with a warm-sunset accent palette. Memorize the surface ladder, the gold primary, and the two-font hierarchy; those three things define 80% of the visual identity.

> Sibling docs: [components](components.md) · [layouts](layouts.md) · [anti-patterns](anti-patterns.md)

---

## How tokens are wired (Tailwind v4)

Tokens live **in CSS**, not in a JS config. There is no `tailwind.config` file. Everything is declared in `app/(default)/css/globals.css`:

1. **Semantic CSS variables** in `:root` (`--background`, `--card`, `--primary`, `--border`, …).
2. **`@theme inline`** maps those variables to Tailwind's namespace (`--color-*`, `--radius-*`, `--shadow-*`, `--font-*`), which generates the utility classes (`bg-card`, `rounded-lg`, `shadow-sw-card`, `font-mono`, …).

Because of `@theme inline`, every color you reach for resolves through a semantic name — you almost never type a hex value in markup. **Always use the semantic utility class, not a hardcoded hex.** (See [anti-patterns.md](anti-patterns.md).)

> The `@theme inline` block also adds brand tokens that have no `:root` origin — `--color-canvas`, `--color-ink`, `--color-success`, `--color-warning`, and the neutral aliases `--color-paper-tint` / `--color-steel-grey` / `--color-ink-soft`. These exist so legacy utility class names (`bg-paper-tint`, `text-steel-grey`, …) keep working with the new dark values.

---

## Color Palette

A dark surface ladder with a warm gold primary and a coral→amber gradient accent. Each token has one job.

### Surface & text (semantic)

| Token | Hex | Tailwind class | Usage |
|-------|-----|----------------|-------|
| `--background` | `#2B2B33` | `bg-background` (also `bg-canvas`) | Page background — charcoal, never pure black |
| `--foreground` | `#FFFFFF` | `text-foreground` (also `text-ink`) | Primary text — high-contrast white on dark |
| `--card` | `#1C1C22` | `bg-card` | Card surface — darker than the page so cards "recess in" |
| `--card-foreground` | `#FFFFFF` | `text-card-foreground` | Text on cards |
| `--popover` | `#212127` | `bg-popover` | Menus, dropdowns, tooltips |
| `--popover-foreground` | `#FFFFFF` | `text-popover-foreground` | Text in popovers |
| `--secondary` | `#212127` | `bg-secondary` | Secondary surface (subtle buttons, chips) |
| `--secondary-foreground` | `#FFFFFF` | `text-secondary-foreground` | Text on secondary |
| `--muted` | `#2A2A2A` | `bg-muted` (also `bg-paper-tint` / `bg-accent`) | Hover/nested surface, elevated panels |
| `--muted-foreground` | `#9B9BA5` | `text-muted-foreground` (also `text-steel-grey`) | Secondary text, labels, captions |
| `--ink-soft` | `#5C5C66` | `text-ink-soft` | Muted text/icons, placeholders |
| `--border` | `#3A3A42` | `border-border` | Subtle 1px borders everywhere |
| `--input` | `#3A3A42` | `border-input` | Input borders (same value as border) |

> **Why is the card *darker* than the page?** In dark fintech UIs, surfaces that hold content recess slightly *into* the canvas rather than float above it. The card `#1C1C22` sits below the page `#2B2B33`; elevation is implied by the soft glow shadow + border, not by a lighter fill. `--muted` / `--paper-tint` (`#2A2A2A`) is the *one* lighter tier, used for hover and nested panels.

### Brand & status

| Token | Hex | Tailwind class | Usage |
|-------|-----|----------------|-------|
| `--primary` | `#F5C542` | `bg-primary` / `text-primary` | **Gold** — primary actions, highlights, focus rings |
| `--primary-foreground` | `#1C1C22` | `text-primary-foreground` | Dark text *on* gold (AA contrast) |
| `--destructive` | `#E14B4B` | `bg-destructive` / `text-destructive` | Errors, destructive actions |
| `--success` | `#3DDC97` | `bg-success` / `text-success` | Genuine success states |
| `--warning` | `#F7D488` | `bg-warning` / `text-warning` | Cautions (pale gold, fits the warm palette) |
| `--ring` | `#F5C542` | `ring-ring` / `outline-ring` | Focus ring (gold) |

### Gradient accent — "sunset"

The signature accent. A coral→amber diagonal used on hero CTAs and featured surfaces. Provided as utility classes (not raw utilities):

| Class | Definition |
|-------|------------|
| `.bg-gradient-sunset` | `linear-gradient(135deg, #F56B3F 0%, #FFD65C 100%)` |
| `.text-gradient-sunset` | Same gradient, clipped to text (`transparent` fill + `background-clip: text`) |

Endpoints: **coral `#F56B3F`** → **amber `#FFD65C`**. Text on the sunset gradient should be dark (`#1C1C22`, i.e. `text-card`) for contrast.

### Chart palette

| Token | Hex | Tailwind class |
|-------|-----|----------------|
| `--chart-1` | `#F5C542` | `bg-chart-1` / `text-chart-1` |
| `--chart-2` | `#F56B3F` | `bg-chart-2` / `text-chart-2` |
| `--chart-3` | `#FFD65C` | `bg-chart-3` / `text-chart-3` |
| `--chart-4` | `#E14B4B` | `bg-chart-4` / `text-chart-4` |
| `--chart-5` | `#9B9BA5` | `bg-chart-5` / `text-chart-5` |

### Color rules

- **One primary (gold) action per screen region.** Gold is the loudest color — spend it.
- The **sunset gradient** is reserved for hero CTAs and featured accents. Don't use it on every button.
- Status colors (`destructive`, `success`, `warning`) are translucent-on-dark when used as fills (see [components.md](components.md)); use the solid token for text/icons.
- Never invent new grays. The three text tiers (`#FFFFFF` / `#9B9BA5` / `#5C5C66`) cover all hierarchy needs.
- Never use light-tint backgrounds (e.g. `bg-gray-100`, `#FFF`). The system is dark-only.

---

## Typography

Two fonts, sharply differentiated by role.

```css
--font-sans:  'Inter', sans-serif;        /* body + headers */
--font-serif: 'Inter', sans-serif;        /* SAFETY NET — maps serif → Inter so
                                             legacy font-serif components render
                                             Inter instead of a system serif */
--font-mono:  'Space Grotesk', monospace; /* digits, metadata, labels */
```

> **Why is `--font-serif` mapped to Inter?** The previous system used serif headers. Rather than rewrite every `font-serif` reference, `--font-serif` is pointed at Inter so those components stay on-style. **Do not add a third display font** — headers use Inter at larger sizes and heavier weights to establish hierarchy. Space Grotesk is the only "character" font, and it's reserved for numerals and metadata.

### Role mapping

| Use | Font | Size | Weight | Notes |
|-----|------|------|--------|-------|
| Page headers | sans (Inter) | 3xl–5xl | bold / semibold | Tight tracking; optionally `.text-gradient-sunset` for hero |
| Section headers | sans (Inter) | xl–2xl | semibold | Anchor major sections |
| Body | sans (Inter) | base | normal | Default paragraphs |
| Labels | mono (Space Grotesk) | sm | medium | Form labels, table headers (sentence case, not uppercase) |
| Digits / metadata | mono (Space Grotesk) | xs–sm | medium | Counts, IDs, timestamps, currency |

### Type Scale

```
xs:   12px / 1.4    Captions, metadata, digits
sm:   14px / 1.5    Labels, secondary text
base: 16px / 1.6    Body
lg:   18px / 1.55   Lead paragraphs
xl:   20px / 1.5    Subsection headers
2xl:  24px / 1.4    Section headers
3xl:  30px / 1.3    Page headers
4xl:  36px / 1.2    Hero headers
5xl:  48px / 1.1    Display headers
```

### Why Space Grotesk for digits?

Space Grotesk has tabular-friendly, characterful numerals that read as "data" — perfect for counts, metrics, and IDs. Pairing it with Inter's clean body creates instant hierarchy: Inter = prose, Space Grotesk = numbers and labels.

---

## Radius Scale

The system is **rounded**, not sharp. Radius tokens are the primary softening device.

```
--radius-sm:  0.5rem   8px    rounded-sm     badges, chips, small tags
--radius-md:  0.75rem  12px   rounded-md     buttons, inputs, selects
--radius-lg:  1rem     16px   rounded-lg     cards, panels
--radius-xl:  1.25rem  20px   rounded-xl     featured cards, modals
--radius-2xl: 1.5rem   24px   rounded-2xl    hero blocks, large surfaces
```

**Default guidance**: inputs/buttons → `rounded-md`, cards/panels → `rounded-lg`, modals/featured → `rounded-xl`. Pills/full-round are allowed for tags via `rounded-full`.

---

## Spacing Scale

A 4px-based scale. Stick to it. Custom paddings break the rhythm. **(Unchanged from the prior system.)**

```
xs:  4px    (p-1)
sm:  8px    (p-2)
md:  16px   (p-4)   ← default for most cases
lg:  24px   (p-6)
xl:  32px   (p-8)
2xl: 48px   (p-12)
3xl: 64px   (p-16)
```

**Default rule**: when in doubt, use `md` (16px). Tighten to `sm` for dense lists, expand to `lg` or `xl` for breathing room around major sections.

---

## Shadows — soft glow

Soft, dark, **blurred** glow shadows. Never solid/offset. The shadow is a depth illusion on the dark canvas — a subtle halo that lifts elements off the charcoal.

```css
--shadow-sw-xs:      0 1px 2px   rgba(0, 0, 0, 0.30);
--shadow-sw-sm:      0 2px 4px   rgba(0, 0, 0, 0.30);
--shadow-sw-default: 0 4px 10px  rgba(0, 0, 0, 0.35);
--shadow-sw-card:    0 6px 16px  rgba(0, 0, 0, 0.40);
--shadow-sw-lg:      0 8px 24px  rgba(0, 0, 0, 0.45);
--shadow-sw-xl:      0 12px 32px rgba(0, 0, 0, 0.50);
```

| Tailwind class | Typical use |
|----------------|-------------|
| `shadow-sw-xs` | Chips, badges, inline toggles |
| `shadow-sw-sm` | Buttons |
| `shadow-sw-default` | Small panels, inputs-in-card |
| `shadow-sw-card` | **Cards** (the workhorse) |
| `shadow-sw-lg` | Popovers, dropdowns, modals |
| `shadow-sw-xl` | Hero / featured elements |

> The `shadow-sw-*` **names are retained** from the prior system (~31 components reference them). Only the *values* changed — from hard offset ink to soft dark glow. **Always use `shadow-sw-*` tokens, never Tailwind's default `shadow-sm`/`shadow-md`/`shadow-lg`** (those are tuned for light themes and look wrong here).

### Hover behavior

Glow-shadowed elements deepen or brighten slightly on hover — a soft lift rather than a snap. For buttons, prefer a brightness/gold shift; for cards, increase to the next shadow tier (`shadow-sw-card` → `shadow-sw-lg`).

---

## Borders

- **Default**: 1px `--border` (`border border-border`). Applied globally to every element via `@layer base { * { @apply border-border } }`.
- **Emphasized**: 1px `--primary` (gold) for active/focus edges, or 2px `--border` for grouped dividers.
- **Always** rounded (see radius scale) — sharp 0px corners are an anti-pattern now.
- **Never** solid black borders. The dark system has no `border-black`.

---

## Token → Tailwind-class quick reference

| You want… | Use | Not |
|-----------|-----|-----|
| Page background | `bg-background` | `bg-[#2B2B33]`, `bg-black` |
| Primary text | `text-foreground` | `text-black`, `text-[#fff]` |
| Secondary text | `text-muted-foreground` | `text-gray-400` |
| Muted icons/placeholder | `text-ink-soft` | `text-gray-500` |
| Card surface | `bg-card` | `bg-white`, `bg-[#1c1c22]` |
| Hover/nested surface | `bg-muted` or `bg-paper-tint` | `bg-gray-800` |
| Border | `border-border` | `border-black`, `border-gray-700` |
| Primary action (gold) | `bg-primary text-primary-foreground` | `bg-blue-600`, `bg-[#F5C542]` |
| Focus ring | `ring-ring` / `outline-ring` | `ring-blue-500` |
| Destructive | `bg-destructive` / `text-destructive` | `bg-red-600` |
| Success | `bg-success` / `text-success` | `bg-green-600` |
| Sunset gradient fill | `.bg-gradient-sunset` | `bg-gradient-to-r from-orange-400 to-yellow-300` |
| Card shadow | `shadow-sw-card` | `shadow-md`, `shadow-[4px_4px_0_#000]` |
| Card corners | `rounded-lg` | `rounded-none` |
| Body font | `font-sans` | (implicit — it's the default) |
| Digits/labels | `font-mono` | `font-serif` (renders Inter anyway) |

---

## Putting it together

A minimal Dark Fintech element uses **charcoal card surface + 1px `border-border` + soft glow shadow + rounded corner + Inter/Space Grotesk type**. If your component has those five things and no hardcoded colors, you're already on style.

See [components.md](components.md) for concrete examples.
