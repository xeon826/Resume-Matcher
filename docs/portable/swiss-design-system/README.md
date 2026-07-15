# Dark Fintech Design System

A portable design system pack for a **dark fintech** aesthetic with a **warm-sunset accent palette**. Charcoal surfaces, high-contrast white ink, a gold primary, a coral→amber gradient accent, rounded corners, and soft glow shadows. Modern, confident, and a little bit premium.

This pack is **self-contained**: every file in this directory links only to siblings here. Drop the whole folder into any project and the cross-references keep working.

---

## What you get

| File | Purpose |
|------|---------|
| [tokens.md](tokens.md) | Colors, typography, spacing, radius, shadows — the raw design tokens |
| [components.md](components.md) | Buttons, inputs, cards, alerts, status indicators |
| [layouts.md](layouts.md) | Grid systems, panel patterns, page dimensions |
| [ai-prompt.md](ai-prompt.md) | System prompt for asking an LLM to generate UI in this style |
| [anti-patterns.md](anti-patterns.md) | What NOT to do, plus a pre-merge checklist |

---

## Core principles

1. **Charcoal surfaces, white ink** — a dark surface ladder (`#2B2B33` page → `#1C1C22` cards) with high-contrast `#FFFFFF` text. Cards recess *into* the canvas; elevation comes from glow shadows, not lighter fills.
2. **Warm-sunset accent** — gold (`#F5C542`) is the primary; the signature coral→amber gradient (`.bg-gradient-sunset`) is reserved for hero CTAs and featured moments. Spend gold sparingly.
3. **Rounded, never sharp** — a real radius scale (8–24px). Inputs/buttons round to 12px, cards/panels to 16px, modals to 20px. Square corners are an anti-pattern.
4. **Soft glow shadows** — blurred dark halos (`shadow-sw-xs` … `shadow-sw-xl`), never solid offset blocks. Depth is implied, never hard.
5. **Two-font hierarchy** — Inter for everything prose-like (body + headers, via `font-sans` and a `font-serif`→Inter safety net); Space Grotesk for digits and metadata (`font-mono`). No third display font.

If you remember nothing else: **dark surfaces, gold primary, rounded corners, soft glow shadows, Inter + Space Grotesk.**

---

## Who this is for

- Designers and engineers building dashboards, fintech-style tools, or data-dense interfaces that want a premium dark look
- Projects that benefit from a distinctive, non-generic aesthetic without going maximalist
- Teams that want a small, memorizable rule set rather than a sprawling component library

This pack is **prescriptive**. It works because the rules are absolute. If you need a light, clinical, or sharp-edged system, this is the wrong starting point.

---

## Scope note

This design system covers the **application shell** — dashboards, forms, trackers, dialogs, navigation.

**Resume render templates and print/PDF styling are a SEPARATE light document system** (their own CSS modules under `components/resume/styles/` and print rules in `globals.css`). They intentionally use a light, print-friendly palette and are NOT governed by the dark tokens here. Do not let the two systems bleed into each other.

---

## How to use

1. Read [tokens.md](tokens.md) first — every other file references these values.
2. Then [components.md](components.md) for the building blocks.
3. [layouts.md](layouts.md) when composing pages.
4. Use [ai-prompt.md](ai-prompt.md) when delegating UI generation to an LLM.
5. Review [anti-patterns.md](anti-patterns.md) before shipping.

---

## Stack assumptions

The code samples use **Tailwind CSS v4** utility classes and **React/JSX**.

Tailwind is configured **in CSS** (via `@theme inline` in `app/(default)/css/globals.css`) — **there is no `tailwind.config` file**. The token values themselves are framework-agnostic: translate the colors, radii, and shadows into your own CSS, vanilla, Vue, Svelte, or whatever. The principles don't change.
