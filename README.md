# directional-lovable-prompt

Generate **Awwwards-level** [Lovable.dev](https://lovable.dev) website prompts from a simple brand idea. Two-prompt strategy that turns "I'm building an app for X" into a cutting-edge website.

## The Problem

Every Lovable website looks the same. Default SaaS layouts, Inter font, purple gradients, flat white cards. You know the look.

## The Solution

This tool generates **two prompts** that produce websites at Awwwards SOTD level:

1. **Foundation Prompt** — Structure, real copy, design tokens, sections. Brand-specific.
2. **Upgrade Prompt** — Motion choreography (GSAP + Framer + Lenis), glass materials, edge-to-edge layouts, editorial typography.

Paste Prompt 1 → get a solid branded website. Paste Prompt 2 → watch it transform into something cinematic.

## Quick Start

```bash
# Set your API key
export ANTHROPIC_API_KEY=sk-ant-...

# Generate prompts
npx directional-lovable-prompt "A meditation app for busy founders"
```

That's it. Copy the two prompts into Lovable. Done.

## What Happens Under the Hood

1. Your description → Claude generates a **complete brand foundation** (name, positioning, tone, colors, fonts, visual direction)
2. Brand foundation → **Foundation Prompt** (7 sections with real copy, exact Tailwind tokens, asset references)
3. Brand tokens → **Upgrade Prompt** (motion stack, glass materials, 12-col edge-to-edge grid, sticky scroll, magnetic CTAs)

## Programmatic Usage

```js
import { generateWebsitePrompts } from 'directional-lovable-prompt';

const { brand, foundation, upgrade } = await generateWebsitePrompts(
  "A B2B platform for renewable energy monitoring",
  { primaryColor: "#8B6F47" } // optional overrides
);

console.log(foundation); // Paste into Lovable first
console.log(upgrade);    // Paste after foundation is built
```

## CLI Options

```bash
npx directional-lovable-prompt "Your idea" \
  --primary "#8B6F47" \
  --headline "Fraunces" \
  --body "Inter Tight" \
  --logo "https://example.com/logo.svg" \
  --hero "https://example.com/hero.webp"
```

## The Two-Prompt Strategy

### Why two prompts?

Lovable builds better when it focuses on one layer at a time:

- **Prompt 1** handles structure and content — what's on the page
- **Prompt 2** handles behavior and materials — how it feels

One mega-prompt overwhelms the system. Two focused prompts compound.

### What makes the Upgrade special?

The Upgrade prompt applies:
- **Editorial typography** — clamp() fluid sizing, display serifs, mixed weights + italic accents
- **Glass materials** — backdrop-blur, hairline borders, grain overlays, warm shadows
- **Motion choreography** — word-by-word reveals, sticky scrub, infinite marquees, magnetic hover, parallax
- **Edge-to-edge layout** — 12-col CSS grid, no containers, images bleed to viewport
- **Custom cursor** — blended mix-blend-difference, scales on targets
- **A11Y** — respects prefers-reduced-motion

### What it explicitly forbids (the secret sauce):
- No `max-w-7xl` centered containers
- No lucide-icon-in-circle patterns
- No flat white cards with `shadow-md`
- No Inter for headlines
- No generic purple/blue gradients
- No stock photo aesthetic

## Examples

### Input
```
"A clean energy monitoring platform for building owners"
```

### Output (Foundation — excerpt)
```
Build a modern, responsive single-page website for GreenFlow...
Hero headline: "Your building already has the data. We make it useful."
Primary: #8B6F47, Dark: #1A1714, Light: #F2EEE8
Fonts: Albert Sans (headlines), Roboto (body)
```

### Output (Upgrade — excerpt)
```
Redesign the entire GreenFlow landing page to feel absolutely cutting edge...
Word-by-word mask reveal with 80ms stagger, easing [0.16,1,0.3,1]...
Floating glass-pill navbar, 24px from top, shrinks on scroll...
Oversized "GREENFLOW" wordmark (clamp(12rem, 25vw, 25rem)) parallaxes up...
```

## Requirements

- Node.js 18+
- `ANTHROPIC_API_KEY` environment variable ([get one here](https://console.anthropic.com/))

## How It Works

The brand generation uses Claude to derive positioning, tone, visual direction, and design tokens from your description. The Foundation prompt is Claude-generated with real copy. The Upgrade prompt is a battle-tested template — the same one that produced [this GreenFlow redesign](https://directional.dev).

## Credits

Built by [Directional](https://directional.dev) — the Brand DNA platform for founders.

The generated websites include a subtle "Brand hosted by Directional" footer link. Remove it if you want, but we'd appreciate the love ❤️

## License

MIT
