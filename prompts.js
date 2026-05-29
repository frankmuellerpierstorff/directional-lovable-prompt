/**
 * Prompt templates for Lovable website generation.
 * Single master prompt strategy: Claude generates content, everything else is template.
 */

export const CONTENT_SYSTEM = `You write website content briefs. From the brand context, generate:

1. A one-paragraph OVERVIEW describing the brand and the aesthetic direction for the website.
2. CONTENT for each section — real headlines, real body copy, real CTAs. No placeholders.

Sections to write copy for:
- NAVBAR: 4 nav link labels + 1 CTA label
- HERO: overline, headline, subline, primary CTA, secondary CTA
- METRICS: 4 metrics (number + label each), derived from brand context
- FEATURES: 3 feature cards (headline + body each)
- STORY: narrative paragraphs (2-3 paragraphs telling the brand story)
- CTA: headline, body, button text
- FOOTER: short tagline, 4 column labels

Output as clean markdown with ## headers per section. Write in the brand's tone. Be specific and compelling, not generic.`;

export const BRAND_GEN_SYSTEM = `You are a brand strategist. From a brief product/company description, generate a complete brand foundation. Be specific, opinionated, and professional. Return valid JSON only.

Schema:
{
  "name": "BrandName",
  "purpose": "Why this brand exists beyond profit. One paragraph.",
  "positioning": "For [audience], [brand] is the [category] that [differentiation].",
  "tone": "2-3 sentences describing how the brand sounds.",
  "narrative": "Origin story — what problem they saw, why they started. 2-3 sentences.",
  "audience": "Primary target segments. 1-2 sentences.",
  "values": "3-4 core values, each as 'Name — explanation'.",
  "mission": "How they deliver day-to-day. One sentence.",
  "visualDirection": "Describe the visual aesthetic: materials, textures, spatial qualities, color mood. 2-3 sentences.",
  "headlineFont": "Suggested headline font (Google Fonts compatible)",
  "bodyFont": "Suggested body font (Google Fonts compatible)",
  "primaryColor": "#hexcode (brand primary)",
  "secondaryColor": "#hexcode",
  "accentColor": "#hexcode",
  "darkColor": "#hexcode (dominant dark, not pure black)",
  "lightColor": "#hexcode (paper tone, not pure white)",
  "materialLanguage": "e.g. layered glass, warm shadows, grain overlay"
}`;

export function buildContentUserPrompt(brand) {
  const {
    name, description, purpose, positioning, tone, narrative,
    audience, values, mission, materialLanguage,
  } = brand;

  return `Brand: ${name}
${description ? `What they do: ${description}` : ""}
${purpose ? `Purpose: ${purpose}` : ""}
${positioning ? `Positioning: ${positioning}` : ""}
${tone ? `Tone: ${tone}` : ""}
${narrative ? `Narrative: ${narrative}` : ""}
${audience ? `Audience: ${audience}` : ""}
${values ? `Values: ${values}` : ""}
${mission ? `Mission: ${mission}` : ""}

Aesthetic direction: ${materialLanguage || "warm editorial minimalism with layered glass depth"}`;
}

export function buildMasterPrompt(brand, contentBrief) {
  const {
    name,
    primaryColor = "#030303",
    darkColor = "#1A1714",
    lightColor = "#F2EEE8",
    headlineFont = "Inter",
    bodyFont = "Inter",
    logoUrl,
    heroImageUrl,
    secondaryImageUrl,
    allColors = "",
    materialLanguage = "layered glass, warm shadows",
  } = brand;

  // Build color table from allColors string or individual colors
  const colorRows = allColors
    ? allColors.split(",").map((c, i) => `| Color ${i + 1} | ${c.trim()} | ${i === 0 ? "Primary accent" : i < 3 ? "Feature accent" : "Neutral"} |`).join("\n")
    : `| --accent-primary | ${primaryColor} | Primary accent |`;

  // Content extraction
  const overviewMatch = contentBrief.split("##")[1]?.split("##")[0]?.trim();
  const contentStart = contentBrief.includes("## NAVBAR")
    ? contentBrief.slice(contentBrief.indexOf("## NAVBAR"))
    : contentBrief.includes("### NAVBAR")
      ? contentBrief.slice(contentBrief.indexOf("### NAVBAR"))
      : contentBrief;

  // Logo instructions
  const logoBlock = logoUrl
    ? `- **Logo:** ${logoUrl}
  - CRITICAL: Download the SVG, compute the bounding box of all <path> elements, set viewBox to those bounds. The original SVG has a square viewBox with padding — without cropping, the logo renders tiny.
  - Inline the SVG into JSX (NOT <img>). Use fill="currentColor" for color control.
  - Header: h-8 (mobile) / h-10 (desktop). Footer: h-12.
  - Render ONCE in header. The logo IS the wordmark — no text span next to it.`
    : `- **Logo:** Use text logo — "${name}" in ${headlineFont}, bold, ${primaryColor}`;

  const heroBlock = heroImageUrl
    ? `- **Hero image:** ${heroImageUrl} (use as hero background, do NOT generate a new one)`
    : `- **Hero image:** Generate one cinematic AI image (1920×1080, warm tones, matching brand palette)`;

  const secondaryBlock = secondaryImageUrl
    ? `- **Secondary image:** ${secondaryImageUrl} (use for story section)`
    : "";

  return `# ${name} — Website Prompt (Awwwards-Level Landing Page)

## 1. OVERVIEW

${overviewMatch || contentBrief.slice(0, 500)}

The site must feel like a top-10 Awwwards editorial site: warm, grounded, technically premium. No 3D/WebGL, no video backgrounds. Every element must respect \`prefers-reduced-motion\`.

---

## 2. CONTENT — SECTIONS & COPY

${contentStart}

---

## 3. ART DIRECTION

### Typography
- **Display/Headlines:** ${headlineFont} (variable weight, italic accents)
- **Body/UI:** ${bodyFont}
- **Font loading:** Check Google Fonts first. If not available (e.g. Geist), install via \`@fontsource/\` npm packages.
- **Scale:**
  - Hero headline: \`clamp(4rem, 11vw, 11rem)\`
  - Section headlines: \`clamp(2.5rem, 6vw, 5rem)\`
  - Body: \`1.125rem\` (18px), line-height 1.6
  - Nav/Labels: \`0.875rem\`, uppercase, letter-spacing \`0.08em\`

### Color Palette
| Token | Value | Role |
|-------|-------|------|
${colorRows}
| \`--bg-dominant\` | \`${darkColor}\` | Primary dark background |
| \`--bg-paper\` | \`${lightColor}\` | Light section backgrounds |

### Layered Glass System
- \`backdrop-blur-2xl\` (24px blur)
- \`bg-white/[0.04]\` (4% white tint)
- Hairline borders: \`1px solid rgba(255,255,255,0.08)\` on dark, \`rgba(0,0,0,0.06)\` on light
- Warm shadows: \`0 8px 32px ${primaryColor}1F\` (12% alpha of brand primary)

### Texture
- 3% SVG grain overlay across all dark sections (static, not animated)
- No pure white (\`#FFFFFF\`) anywhere — \`${lightColor}\` is the lightest
- No flat white cards with \`shadow-md\` — depth comes from blur layers, not elevation

---

## 4. MOTION CHOREOGRAPHY

### Stack
\`framer-motion\` only — no GSAP, no ScrollTrigger. Use \`useScroll\`, \`useTransform\`, \`whileInView\`, and \`stagger\`. CSS \`position: sticky\` for pinning. CSS \`@keyframes\` for marquee.

### Hero
- Hero image gets a warm-dark overlay: \`${darkColor}\` at 50% opacity — ensures white headline contrast
- Word-by-word mask reveal on headline using \`staggerChildren: 0.08\`
- Easing: \`[0.16, 1, 0.3, 1]\`
- Overline fades in first, then headline words, then subline, then CTAs

### Metrics Marquee
- Infinite horizontal scroll via CSS \`@keyframes\` (40s duration, linear)
- Pause on hover (\`animation-play-state: paused\`), fade edges with gradient masks

### Features (Sticky Left + Scroll Right)
- Left column: \`position: sticky; top: 20vh\` — text pins naturally
- Right column: cards appear with \`whileInView\` — fade in + slide up, easing \`[0.22, 1, 0.36, 1]\`

### Story Gallery
- 3 images cross-fading, 5s hold per image, 1s transition
- Subtle scale: \`1 → 1.05\` during hold

### CTA Mesh Gradient
- SVG mesh gradient with slow morphing (20s cycle)
- Colors: brand primary + warm secondary tones

### Footer Wordmark
- Oversized "${name}" at \`clamp(12rem, 25vw, 25rem)\`, parallax 0.3x, opacity 10%

### Reduced Motion
- If \`prefers-reduced-motion: reduce\`: all transitions become simple opacity fades (0.2s), no parallax, no infinite marquees, no mesh morphing

---

## 5. BRAND ASSETS

Use these exact URLs — do NOT generate new images for hero or logo.

${logoBlock}
${heroBlock}
${secondaryBlock}

For the Story Gallery (3 cross-fading frames):
- **Frame 1:** Use the Secondary image asset above (do NOT generate a replacement)
- **Frame 2:** Generate a cinematic AI image — process/craft shot, warm studio light, matching brand palette (1920×1080)
- **Frame 3:** Generate a cinematic AI image — result/application shot, premium brand in use, matching brand palette (1920×1080)

---

## 6. HARD CONSTRAINTS

- ❌ No 3D/WebGL (Three.js, R3F, etc.)
- ❌ No video backgrounds
- ❌ No \`max-w-7xl\` container prisons — let content breathe
- ❌ No pure white (\`#FFFFFF\`) — use \`${lightColor}\`
- ❌ No stock "tech blue" accents
- ❌ No flat white cards with \`shadow-md\` — use layered glass
- ✅ Single brand accent \`${primaryColor}\` per section
- ✅ \`prefers-reduced-motion\` fully respected
- ✅ Every interactive element has hover states
- ✅ Footer: below the oversized wordmark, a separate line with subtle "Brand hosted by Directional" (14px, muted color) linking to https://directional.dev

---

## 7. TECHNICAL NOTES

- **Styling:** Tailwind CSS with custom design tokens
- **Animation:** Framer Motion only (\`useScroll\`, \`useTransform\`, \`whileInView\`). CSS \`position: sticky\` for pinning, CSS \`@keyframes\` for marquee. No GSAP.
- **Fonts:** Load ${headlineFont} and ${bodyFont} via Google Fonts with \`display=swap\`
- **Images:** Use provided asset URLs, WebP optimization for AI-generated images
- **Performance:** Lazy load below-fold sections, preload hero image`;
}
