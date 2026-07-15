# Anti-Patterns & Pre-Merge Checklist

What NOT to do, and how to catch it before code ships. Read this before opening a PR that touches UI.

> Sibling docs: [tokens](tokens.md) · [components](components.md) · [layouts](layouts.md) · [ai-prompt](ai-prompt.md)

---

## Forbidden things

| Anti-pattern | Why it breaks the style | Use instead |
|--------------|-------------------------|-------------|
| Hardcoded hex colors (`bg-[#F5C542]`, `text-[#fff]`) | Bypasses theming, drifts from tokens | Semantic class (`bg-primary`, `text-foreground`) |
| `border-black` / `text-black` / `bg-white` | Light-theme residue; wrong on dark | `border-border`, `text-foreground`, `bg-card` |
| Ad-hoc Tailwind grays (`bg-gray-800`, `text-gray-400`) | Off-palette; wrong undertone | `bg-muted`/`bg-paper-tint`, `text-muted-foreground`/`text-ink-soft` |
| `rounded-none` / `border-2 border-black` / hard offset shadows | Old sharp-edged system | `rounded-md`+, `border border-border`, `shadow-sw-*` |
| Tailwind default shadows (`shadow-sm`, `shadow-md`, `shadow-lg`) | Tuned for light themes; look flat/wrong | `shadow-sw-xs` … `shadow-sw-xl` |
| Light-tint status fills (`bg-red-100`, `bg-green-100`) | Blow out on dark canvas | Translucent token: `bg-destructive/10`, `border-destructive/40` |
| Sunset gradient on every button | Loses impact, looks noisy | Reserve `.bg-gradient-sunset` for the single hero CTA |
| Pastel / off-palette accent colors | Break the warm gold + coral/amber scheme | Tokens only: `--primary`, `--success`, `--warning`, `--destructive` |
| Pure-black page background (`bg-black`) | Too harsh; loses the charcoal warmth | `bg-background` (`#2B2B33`) |
| Renaming `shadow-sw-*` tokens | ~31 components reference them by name | Keep the names; only values changed |
| Multiple primary/gradient buttons per region | No focal point | One primary, rest secondary/outline |
| Custom paddings off the 4px scale | Breaks rhythm | Stick to xs/sm/md/lg/xl/2xl |
| Three or more font families | Muddies the two-font hierarchy | Inter (`font-sans`) + Space Grotesk (`font-mono`) only |

---

## Common mistakes that look "almost right"

These pass casual review but fail the style:

### Using `text-gray-400` instead of `text-muted-foreground`

Tailwind's default grays have a blue undertone and the wrong luminosity for this canvas. The system has exactly three text tiers — `#FFFFFF` / `#9B9BA5` (`text-muted-foreground` / `text-steel-grey`) / `#5C5C66` (`text-ink-soft`). Never reach for `gray-*`.

### Using `bg-white` for cards / inputs

White surfaces are blinding against `#2B2B33`. Cards use `bg-card` (`#1C1C22`, *darker* than the page). Inputs use `bg-card` too, so they recess into their panel. If something needs to feel elevated, raise its shadow tier — don't lighten its fill.

### Adding `shadow-md` "for a little depth"

Tailwind's built-in shadows are calibrated for light backgrounds and read as flat grey smudges on charcoal. Always use the `shadow-sw-*` glow tokens, which are dark-blurred and tuned for this canvas.

### Light-tint alert backgrounds (`bg-red-100`)

A `100`-tint fill is near-white — it blows out the whole alert on a dark card. Use `bg-destructive/10` (translucent) + `border-destructive/40` + a solid `text-destructive` label. Same for warning/success.

### Hardcoding gold instead of `bg-primary`

`bg-[#F5C542]` works today but bypasses theming and won't track future token changes. Use `bg-primary` / `text-primary`. Same logic applies to every color — if you're typing a hex, you're probably doing it wrong.

### Forgetting focus contrast

Gold focus rings (`ring-ring`) are bright and read well on charcoal — but a gold *button* with a gold ring on hover can wash out. Ensure interactive elements always have a visible, distinct focus state (2px `ring-ring`, or an outline).

### Using `rounded-none` out of habit

If you copy-pasted from older code, you may inherit sharp corners. The dark system is **rounded**: inputs/buttons → `rounded-md`, cards → `rounded-lg`, modals → `rounded-xl`. Square corners are an anti-pattern now.

---

## WCAG contrast on dark

The dark palette is generally high-contrast, but a few pairings need care:

| Pairing | Verdict |
|---------|---------|
| `#FFFFFF` text on `#1C1C22` / `#2B2B33` | AA / AAA — strong |
| `#1C1C22` text on gold `#F5C542` | AA — the primary button pairing (don't lighten the gold) |
| `#9B9BA5` (muted-foreground) on `#1C1C22` | ~AA at 14px+ — fine for secondary text; avoid for body |
| `#5C5C66` (ink-soft) on dark | Below AA — **placeholder/icon/metadata only**, never body text |
| Sunset gradient (`#F56B3F`→`#FFD65C`) with `#1C1C22` text | AA — use dark text on the gradient, not white |

**Rule of thumb**: body text is always `text-foreground` (`#FFFFFF`). Reserve `text-muted-foreground` for secondary/labels and `text-ink-soft` for non-essential metadata.

---

## Pre-merge checklist

Before merging UI changes, walk through this list:

### Tokens
- [ ] No hardcoded hex colors — all colors are semantic classes (`bg-card`, `text-foreground`, `border-border`, …)
- [ ] No `border-black`, `text-black`, or `bg-white` anywhere
- [ ] No ad-hoc `gray-*` classes — use `text-muted-foreground` / `text-ink-soft` / `bg-muted`
- [ ] Shadows use `shadow-sw-*` names only (no `shadow-sm`/`shadow-md`/`shadow-lg`)
- [ ] All paddings are on the 4px scale (`p-1`, `p-2`, `p-4`, `p-6`, `p-8`, `p-12`, `p-16`)

### Corner & shadow
- [ ] Inputs/buttons use `rounded-md`, cards `rounded-lg`, modals `rounded-xl`
- [ ] No `rounded-none` (except intentional full-bleed edges)
- [ ] Cards carry `shadow-sw-card` (or higher for featured)

### Typography
- [ ] Body + headers render in Inter (`font-sans`; `font-serif` also resolves to Inter)
- [ ] Digits / labels / metadata use Space Grotesk (`font-mono`)
- [ ] No third font family introduced
- [ ] Body text is `text-foreground` (`#FFFFFF`), not a muted tier

### Components
- [ ] Primary button is gold (`bg-primary text-primary-foreground`); at most one primary/gradient per region
- [ ] Sunset gradient (`.bg-gradient-sunset`) appears on the hero CTA only
- [ ] Inputs have `border-input`, `bg-card`, `rounded-md`, `focus:ring-2 ring-ring`
- [ ] Alerts use translucent fills (`/10` fill + `/40` border + solid label) — no `100`-tint backgrounds
- [ ] Status indicators use `bg-success` / `bg-warning` / `bg-destructive` dots

### Layout
- [ ] Page background is `bg-background` (`#2B2B33`), not pure black or white
- [ ] Dividers use `border-border` (`#3A3A42`), never solid black
- [ ] Destructive actions use `bg-destructive`, not generic red

### Final pass
- [ ] Squint at the design — does it read as a cohesive dark, gold-accented interface?
- [ ] Pick the lowest-contrast text on the page (usually `text-ink-soft`) — is it only used for non-essential metadata?
- [ ] No light-theme leftovers (`bg-white`, `border-black`, `text-gray-*`, `shadow-md`) anywhere?

If you can answer **yes** across the list, you're done. If it looks like a generic dashboard with a few dark panels bolted on, go back to [tokens.md](tokens.md) and start over.
