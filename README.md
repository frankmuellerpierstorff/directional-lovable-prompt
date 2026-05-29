# directional-lovable-prompt

Generate **Awwwards-level** [Lovable.dev](https://lovable.dev) website prompts from a simple brand idea. One master prompt that produces cutting-edge websites.

## The Problem

Every Lovable website looks the same. Default SaaS layouts, Inter font, purple gradients, flat white cards. You know the look.

## The Solution

This tool generates a **single master prompt** that produces websites at Awwwards SOTD level:

- **Section 1-2:** Claude generates real content — headlines, copy, CTAs, metrics — from your brand DNA
- **Section 3-7:** Battle-tested templates inject your brand tokens into art direction, motion choreography, glass materials, editorial typography, and hard constraints

One prompt. Paste it into Lovable. Done.

## Quick Start

```bash
# Set your API key
export ANTHROPIC_API_KEY=sk-ant-...

# Generate prompt
npx directional-lovable-prompt "A meditation app for busy founders"
```

That's it. Copy the prompt into Lovable.

## What Happens Under the Hood

1. Your description → Claude generates a **complete brand foundation** (name, positioning, tone, colors, fonts, visual direction)
2. Brand foundation → Claude generates **real website copy** (headlines, CTAs, metrics, feature cards, story paragraphs)
3. Brand tokens + copy → **Master prompt assembled** from battle-tested templates (art direction, motion stack, glass materials, constraints)

## Programmatic Usage

```js
import { generateWebsitePrompt } from 'directional-lovable-prompt';

const { brand, prompt } = await generateWebsitePrompt(
  "A B2B platform for renewable energy monitoring",
  { primaryColor: "#8B6F47" } // optional overrides
);

console.log(prompt); // Paste into Lovable
```

## CLI Options

```bash
npx directional-lovable-prompt "Your idea" \
  --primary "#8B6F47" \
  --headline "Fraunces" \
  --body "Inter Tight" \
  --logo "https://example.com/logo.svg" \
  --hero "https://example.com/hero.webp" \
  --secondary "https://example.com/secondary.webp"
```

## What Makes This Different

The master prompt is structured in 7 sections that don't contradict each other:

1. **Overview** — Brand positioning + aesthetic direction
2. **Content** — Real copy for every section (Claude-generated, not placeholder)
3. **Art Direction** — Typography scale, color palette with roles, layered glass system, texture rules
4. **Motion Choreography** — Framer Motion only (no GSAP), CSS sticky, word-by-word reveals, infinite marquees
5. **Brand Assets** — Your logo/images with specific integration instructions (SVG viewBox cropping, inline embedding)
6. **Hard Constraints** — What NOT to do (no max-w-7xl, no flat cards, no pure white, prefers-reduced-motion)
7. **Technical Notes** — Stack, font loading, performance

### What it explicitly forbids (the secret sauce):
- No `max-w-7xl` centered containers
- No lucide-icon-in-circle patterns
- No flat white cards with `shadow-md`
- No Inter for headlines
- No generic purple/blue gradients
- No stock photo aesthetic
- No GSAP (Framer Motion + CSS only — 50KB less)

## Examples

### Input
```
"A clean energy monitoring platform for building owners"
```

### Output (excerpt)
```markdown
# GreenFlow — Website Prompt (Awwwards-Level Landing Page)

## 1. OVERVIEW
GreenFlow transforms building energy data into actionable intelligence...

## 3. ART DIRECTION
### Typography
- Display/Headlines: Albert Sans (variable weight, italic accents)
- Body: Roboto
- Scale: Hero headline: clamp(4rem, 11vw, 11rem)

### Color Palette
| Token | Value | Role |
| --accent-primary | #8B6F47 | Primary accent — CTAs, links |
...
```

## Requirements

- Node.js 18+
- `ANTHROPIC_API_KEY` environment variable ([get one here](https://console.anthropic.com/))

## How It Works

The brand generation uses Claude to derive positioning, tone, visual direction, and design tokens from your description. The content brief is Claude-generated with real copy. Art direction, motion choreography, and constraints are battle-tested templates — the same ones that produced [this GreenFlow redesign](https://greenflow-by-directional.lovable.app).

## Credits

Built by [Directional](https://directional.dev) — the Brand DNA platform for founders.

The generated websites include a subtle "Brand hosted by Directional" footer link. Remove it if you want, but we'd appreciate the love ❤️

## License

MIT
