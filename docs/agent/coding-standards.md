# Coding Standards

> **Frontend and backend coding conventions.**

## Frontend (TypeScript/React)

### Design System

All UI changes MUST follow the **Dark Fintech design system**. The full design system is published as a portable pack at [`docs/portable/swiss-design-system/`](../portable/swiss-design-system/README.md). The non-negotiable basics:

- Use `font-sans` (Inter) for headers, `font-mono` (Space Grotesk) for metadata, `font-sans` for body text
- Color palette: `#2B2B33` (Canvas), `#FFFFFF` (Foreground), `#F5C542` (Primary Gold), `#3DDC97` (Success Green), `#F7D488` (Warning), `#E14B4B` (Destructive Red), `#9B9BA5` (Secondary Text), `#5C5C66` (Muted), `#1C1C22` (Card Surface), `#212127` (Popover Surface), `#3A3A42` (Border)
- Components: rounded corners (`rounded-md`/`rounded-lg`) with subtle `border-border` borders and soft-glow `shadow-sw-*` shadows
- See [`tokens.md`](../portable/swiss-design-system/tokens.md), [`components.md`](../portable/swiss-design-system/components.md), and [`anti-patterns.md`](../portable/swiss-design-system/anti-patterns.md) for the full rules

### Naming Conventions

- Use PascalCase for components
- Use camelCase for helpers
- Tailwind utility classes for styling

### Textarea Enter Key Fix

All textareas in forms should include `onKeyDown` with `e.stopPropagation()` for Enter key to ensure newlines work correctly:

```tsx
const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
  if (e.key === 'Enter') e.stopPropagation();
};
```

### Before Committing

1. Run Prettier: `npm run format`
2. Run linter: `npm run lint`

## Backend (Python/FastAPI)

### General Rules

- Python 3.11+
- 4-space indents
- Type hints on ALL functions
- Async functions for I/O operations (database, LLM calls)
- Pydantic models for all request/response schemas
- Prompts go in `app/prompts/templates.py`

### Error Handling

Log detailed errors server-side, return generic messages to clients:

```python
except Exception as e:
    logger.error(f"Operation failed: {e}")
    raise HTTPException(status_code=500, detail="Operation failed. Please try again.")
```

### Race Conditions

Use `asyncio.Lock()` for shared resource initialization (see `app/pdf.py` for example).

### Mutable Defaults

Always use `copy.deepcopy()` when assigning mutable default values to avoid shared state bugs:

```python
# Correct
import copy
data = copy.deepcopy(DEFAULT_DATA)

# Incorrect - shared state bug
data = DEFAULT_DATA
```

### New Service Pattern

Mirror patterns in `app/services/improver.py` for new services.
