# Components

Concrete recipes for the building blocks of a Dark Fintech interface. Every component here uses tokens defined in [tokens.md](tokens.md).

> Sibling docs: [tokens](tokens.md) · [layouts](layouts.md) · [anti-patterns](anti-patterns.md)

---

## Buttons

Rounded corners, gold fill (or the sunset gradient for heroes), dark text on gold for contrast, soft glow shadow.

```jsx
<button className="
  rounded-md
  bg-primary text-primary-foreground
  px-4 py-2
  font-sans text-sm font-medium
  shadow-sw-sm
  transition-colors
  hover:brightness-110
  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring
">
  Submit
</button>
```

### Variants

| Variant | Background | Text | When |
|---------|------------|------|------|
| Primary | `bg-primary` (gold `#F5C542`) | `text-primary-foreground` (dark) | Default action — **one per region** |
| Gradient (sunset) | `.bg-gradient-sunset` | `text-card` (dark) | Hero / featured CTA only |
| Secondary | `bg-secondary` | `text-secondary-foreground` | Secondary actions |
| Outline | `bg-transparent border border-border` | `text-foreground` | Tertiary actions |
| Destructive | `bg-destructive` | `text-white` | Delete, irreversible |
| Ghost | `bg-transparent hover:bg-muted` | `text-foreground` | Toolbars, icon buttons |

```jsx
// Gradient hero CTA — coral → amber
<button className="
  rounded-md bg-gradient-sunset text-card
  px-5 py-2.5 font-sans text-sm font-semibold
  shadow-sw-sm transition-shadow hover:shadow-sw-card
  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring
">
  Get Started
</button>

// Destructive
<button className="
  rounded-md bg-destructive text-white px-4 py-2 font-sans text-sm
  shadow-sw-sm transition-colors hover:brightness-110
">
  Delete
</button>
```

**Rule**: only one Primary (or gradient) button per logical screen region. If you find yourself adding a second, demote it to Secondary or Outline.

### Don't

- Don't use light-tint backgrounds on buttons (no `bg-white`, no `bg-gray-100`) — they fight the dark canvas.
- Don't use the sunset gradient on every button; it loses impact. Reserve it for the single hero CTA.
- Don't set borders to `border-black` — the dark system has no black borders. Use `border-border`.

---

## Inputs

```jsx
<input
  type="text"
  className="
    rounded-md
    border border-input
    bg-card
    px-3 py-2
    font-sans text-base text-foreground
    placeholder:text-ink-soft
    focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent
    transition-colors
  "
/>
```

- `rounded-md` (12px) corners
- 1px `border-input` (`#3A3A42`)
- Card-surface background (`bg-card`) so inputs read as recessed into the panel
- Focus state: 2px gold ring (`ring-ring`), no glow halo beyond the ring
- Placeholder text uses `text-ink-soft` (`#5C5C66`), the muted tier

### Labels

Labels use Space Grotesk (`font-mono`), sentence case (not uppercase):

```jsx
<label className="font-mono text-sm font-medium text-muted-foreground mb-1.5 block">
  Email Address
</label>
```

### Textareas

Same treatment as inputs. If you're embedding textareas inside another keyboard-handled component (modals, command palettes, draggable cards), make sure Enter doesn't bubble up:

```tsx
const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
  if (e.key === 'Enter') e.stopPropagation();
};
```

---

## Cards

```jsx
<div className="
  bg-card text-card-foreground
  border border-border
  rounded-lg
  shadow-sw-card
  p-6
">
  <h2 className="font-sans text-2xl font-semibold mb-4">Card Title</h2>
  <p className="font-sans text-base text-muted-foreground">Card body content.</p>
</div>
```

- `rounded-lg` (16px) corners
- 1px `border-border` (the global default — `@apply border-border` is already on every element)
- `shadow-sw-card` — the workhorse soft glow
- Card surface (`#1C1C22`) is **darker** than the page (`#2B2B33`), so cards recess in

### Featured / hero cards

For the one or two most important cards on a page:

```jsx
<div className="
  bg-card text-card-foreground
  border border-border
  rounded-xl
  shadow-sw-lg
  p-8
">
```

`rounded-xl` (20px) + `shadow-sw-lg` signals "this is the headline element". Use sparingly. A featured card may add a subtle gold top-accent or a faint sunset-tinted glow.

---

## Dialogs / Modals

```jsx
<div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4">
  <div className="
    max-w-md w-full
    bg-popover text-popover-foreground
    border border-border
    rounded-xl
    shadow-sw-xl
    p-6
  ">
    <h2 className="font-sans text-2xl font-semibold mb-4">Confirm</h2>
    {/* content */}
  </div>
</div>
```

- Centered, `max-w-md` by default (wider only if the form genuinely demands it)
- Backdrop is `bg-black/60` — a dim scrim over the dark canvas; a light backdrop blur is acceptable for focus
- The dialog uses the `popover` surface (`#212127`) with `rounded-xl` + `shadow-sw-xl` — it's the most elevated surface on screen

---

## Alerts

Status alerts use translucent fills of the status token over the dark surface, with a matching border. **Never use light 100-tint backgrounds** (e.g. `bg-red-100`) — they blow out on dark. Use `/<opacity>` on the token.

```jsx
// Danger
<div className="rounded-lg border border-destructive/40 bg-destructive/10 p-4">
  <p className="font-mono text-sm font-medium text-destructive mb-1">Error</p>
  <p className="font-sans text-foreground">Something went wrong.</p>
</div>

// Warning
<div className="rounded-lg border border-warning/40 bg-warning/10 p-4">
  <p className="font-mono text-sm font-medium text-warning mb-1">Heads up</p>
  <p className="font-sans text-foreground">This action is reversible.</p>
</div>

// Success
<div className="rounded-lg border border-success/40 bg-success/10 p-4">
  <p className="font-mono text-sm font-medium text-success mb-1">Saved</p>
  <p className="font-sans text-foreground">Your changes are stored.</p>
</div>
```

The pattern is always: **token/40 border + token/10 translucent fill + token-colored label**, with `rounded-lg`. Body text stays `text-foreground` for readability.

---

## Status Indicators

A small dot + a Space Grotesk label. Dots may be round (this system is soft, not hard-edged). Color encodes the state.

```jsx
// Ready / healthy
<div className="flex items-center gap-2">
  <span className="w-2 h-2 rounded-full bg-success" />
  <span className="font-mono text-xs font-medium text-success">READY</span>
</div>

// Needs attention
<div className="flex items-center gap-2">
  <span className="w-2 h-2 rounded-full bg-warning" />
  <span className="font-mono text-xs font-medium text-warning">SETUP REQUIRED</span>
</div>

// Error
<div className="flex items-center gap-2">
  <span className="w-2 h-2 rounded-full bg-destructive" />
  <span className="font-mono text-xs font-medium text-destructive">ERROR</span>
</div>
```

### Why dots here?

The Dark Fintech system is intentionally soft and modern. Round status dots fit the rounded-corner ethos. (The prior sharp-edged system used squares — that rule no longer applies.)

---

## Badges & chips

```jsx
// Neutral chip
<span className="rounded-sm bg-muted text-muted-foreground px-2 py-0.5 font-mono text-xs">
  draft
</span>

// Gold badge (highlight)
<span className="rounded-sm bg-primary/15 text-primary px-2 py-0.5 font-mono text-xs font-medium">
  featured
</span>
```

Use `rounded-sm` (8px) for small tags. For pill tags, `rounded-full` is acceptable.

---

## Quick reference snippets

```jsx
// Primary button (gold)
<button className="rounded-md bg-primary text-primary-foreground px-4 py-2 font-sans text-sm shadow-sw-sm hover:brightness-110 focus-visible:ring-2 focus-visible:ring-ring">

// Gradient hero CTA (sunset)
<button className="rounded-md bg-gradient-sunset text-card px-5 py-2.5 font-sans text-sm font-semibold shadow-sw-sm hover:shadow-sw-card">

// Card
<div className="bg-card text-card-foreground border-border rounded-lg shadow-sw-card p-6">

// Label
<label className="font-mono text-sm font-medium text-muted-foreground">

// Section header
<h2 className="font-sans text-2xl font-semibold">

// Status dot
<span className="w-2 h-2 rounded-full bg-success" />
```

For composing these into pages, see [layouts.md](layouts.md).
