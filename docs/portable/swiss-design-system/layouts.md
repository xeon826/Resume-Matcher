# Layouts

How to compose Dark Fintech components into full pages. The spacing scale (4px-based) is unchanged, but all color, corner, and shadow references are updated for the dark charcoal / warm-sunset system.

> Sibling docs: [tokens](tokens.md) · [components](components.md) · [anti-patterns](anti-patterns.md)

---

## Grid systems

Grid-first composition. Pick a column count up front and stick to it.

### Dashboard / index grid

```jsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
  {items.map(item => <Card key={item.id} {...item} />)}
</div>
```

2-column on tablet, 3-column on large screens is the standard rhythm. 4- or 5-column also works for dense metric grids; avoid 2-column for large collections on wide screens (wastes the canvas). Cards in the grid carry `rounded-lg`, `border-border`, and `shadow-sw-card`.

### Editor + preview split

```jsx
<div className="flex h-full">
  <div className="w-1/2 border-r border-border">
    {/* editor */}
  </div>
  <div className="w-1/2">
    {/* preview */}
  </div>
</div>
```

The divider is `border-border` (`#3A3A42`) — subtle on the charcoal canvas. Don't use a solid black divider (too heavy) or a brighter line (too noisy).

### Sidebar + content

```jsx
<div className="flex h-full">
  <aside className="w-64 border-r border-border bg-sidebar p-6">
    {/* nav */}
  </aside>
  <main className="flex-1 p-8">
    {/* content */}
  </main>
</div>
```

Fixed sidebar width (256px / `w-64`), fluid content. The sidebar uses `bg-sidebar` (`#1C1C22`, same as cards) so it reads as a recessed rail next to the `bg-background` page. The active nav item uses `bg-primary`/`text-primary` or `text-sidebar-primary` to signal selection.

---

## Panel headers

Each major panel gets a labeled header with a status dot + Space Grotesk caption.

```jsx
// Editor panel
<div className="flex items-center gap-2 mb-4">
  <span className="w-2 h-2 rounded-full bg-primary" />
  <span className="font-mono text-xs text-muted-foreground">Editor Panel</span>
</div>

// Preview panel
<div className="flex items-center gap-2 mb-4">
  <span className="w-2 h-2 rounded-full bg-success" />
  <span className="font-mono text-xs text-muted-foreground">Live Preview</span>
</div>
```

The dot color encodes the panel's role (input = gold, output = success, attention = warning, error = destructive). Pick once per project and stay consistent.

---

## Whitespace

Good rhythm comes from **uneven** padding around content blocks — more air on one side than the other.

```jsx
// Flat — feels generic
<div className="p-8">
  <h1>Title</h1>
  <p>Body</p>
</div>

// Directional — feels intentional
<div className="pt-6 pb-12 pl-8 pr-16">
  <h1>Title</h1>
  <p>Body</p>
</div>
```

A common trick: **more whitespace on the right** than the left, **more on the bottom** than the top. It creates a directional weight that pulls the eye through the page. The 4px spacing scale is the same as before — see [tokens.md](tokens.md).

---

## Page dimensions (for print/PDF layouts)

> **Scope note:** Resume render templates and print/PDF styling are a **separate light document system** with their own CSS modules. The dark tokens above do **not** apply to PDF output. This section covers only raw page-size math if you need it for browser-based PDF rendering.

If you're targeting print, anchor on standard page sizes:

```typescript
const PAGE_SIZES = {
  A4:     { width: 210,   height: 297   },  // mm — international standard
  LETTER: { width: 215.9, height: 279.4 },  // mm — US standard
};

// Convert mm to px at 96 DPI
const mmToPx = (mm: number) => mm * 3.7795275591;
```

For browser-based PDF rendering (e.g., headless Chromium), set the page size on the print stylesheet:

```css
@page {
  size: A4;
  margin: 0;
}
```

The print path forces a light background (`#FFFFFF` + `#000000` ink) regardless of the dark app theme — that override lives in `globals.css` `@media print` and must not be removed.

---

## Typography rhythm

Headers should sit **closer** to the content they introduce than to the content above them. The default browser margins do the opposite — fix this.

```jsx
<h2 className="font-sans text-2xl font-semibold mt-12 mb-2">Section Title</h2>
<p className="font-sans text-muted-foreground">Content directly under the header.</p>
```

`mt-12 mb-2` (asymmetric vertical) is the default; reach for it instinctively. Headers are Inter semibold; supporting copy drops to `text-muted-foreground` for a clean two-tier hierarchy.

---

## Featured / hero sections

The hero region is where the sunset gradient earns its place — a gradient headline, a gradient CTA, or a subtle gradient-tinted glow behind the headline card.

```jsx
<section className="px-8 py-16">
  <h1 className="font-sans text-5xl font-bold tracking-tight">
    Build a <span className="text-gradient-sunset">resume</span> that gets noticed
  </h1>
  <button className="mt-6 rounded-md bg-gradient-sunset text-card px-5 py-2.5 font-sans text-sm font-semibold shadow-sw-card">
    Get Started
  </button>
</section>
```

Keep the gradient to one focal element per screen. If the headline uses `.text-gradient-sunset`, the CTA below it should be solid gold (`bg-primary`), not also gradient.

---

## Anti-patterns to avoid

See [anti-patterns.md](anti-patterns.md) for the full list. The layout-specific ones:

- Don't use solid-black dividers — `border-border` (`#3A3A42`) is the only panel divider
- Don't light-fill sidebars/panels — use `bg-card`/`bg-sidebar` (recessed), not `bg-white`
- Don't overload the sunset gradient — one focal element per screen
- Don't flatten cards by removing their shadow — `shadow-sw-card` is what makes them read as elevated on charcoal
