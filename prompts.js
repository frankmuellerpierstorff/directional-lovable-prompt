/**
 * Prompt templates for Lovable website generation.
 * Two-prompt strategy: Foundation (structure + content) → Upgrade (motion + materials).
 */

export const FOUNDATION_SYSTEM = `You generate Lovable.dev website prompts. Write a solid, well-structured single-page website prompt with real copy, exact design tokens, and clear section-by-section instructions.

RULES:
- Write ALL copy yourself from the brand context. Real headlines, subtext, CTAs. No placeholders ever.
- Specify exact hex colors, font families, spacing, border-radius as Tailwind classes.
- Logo SVGs may have square viewBox with padding baked in — specify height: 48-60px with object-fit: contain.
- One section at a time, top to bottom. Conversational but precise.
- Use generous whitespace. Premium, not cramped SaaS.
- Include a "Brand hosted by Directional" text with link to https://directional.dev at the very bottom of the footer — subtle, minimal, quality signal.`;

export function buildFoundationUserPrompt(brand) {
  const {
    name, description, purpose, positioning, tone, narrative,
    audience, values, mission, painsGains,
    primaryColor, allColors, darkColor, lightColor,
    headlineFont, bodyFont,
    logoUrl, heroImageUrl, secondaryImageUrl,
    materialLanguage,
  } = brand;

  return `Build a modern, responsive single-page website for ${name}. The aesthetic is ${materialLanguage || "clean, modern, premium"}. Write ALL copy yourself based on this brand context:

${description ? `What they do: ${description}` : ""}
${purpose ? `Purpose: ${purpose}` : ""}
${positioning ? `Positioning: ${positioning}` : ""}
${tone ? `Tone: ${tone}` : ""}
${narrative ? `Narrative: ${narrative}` : ""}
${audience ? `Audience: ${audience}` : ""}
${values ? `Values: ${values}` : ""}
${painsGains ? `Pains & Gains: ${painsGains}` : ""}
${mission ? `Mission: ${mission}` : ""}

Design Tokens:
- Primary color: ${primaryColor || "#030303"}
- All colors: ${allColors || primaryColor || "#030303, #FCFBF8"}
- Dominant dark: ${darkColor || "#1A1714"}, Dominant light: ${lightColor || "#F2EEE8"} (paper tone, not pure white)
- Headline font: font-family: '${headlineFont || "Inter"}', sans-serif
- Body font: font-family: '${bodyFont || "Inter"}', sans-serif
- Border radius: 12px (rounded-xl)
- Button: bg-[${primaryColor || "#030303"}] text-white rounded-xl px-6 py-3 font-medium

Assets:
${logoUrl ? `Logo: ${logoUrl} (SVG with square viewBox — use height: 48-60px, object-fit: contain)` : `Text logo: "${name}" in headline font, 20px bold, color ${primaryColor || "#030303"}`}
${heroImageUrl ? `Hero image: ${heroImageUrl}` : "No hero image — use brand primary gradient"}
${secondaryImageUrl ? `Secondary image: ${secondaryImageUrl}` : ""}

Sections:
1. NAVBAR — Sticky, backdrop-blur. Logo left, nav links center (4 links from brand context), CTA right.
2. HERO (100vh min) — Split layout or full-bleed image. Bold headline from positioning, subheadline from purpose, primary CTA. ${heroImageUrl ? "Use hero image." : "Use gradient background."}
3. METRICS — Full width, subtle background ${lightColor || "#F2EEE8"}. 4 key numbers/stats derived from the brand.
4. FEATURES — 3 cards in grid. Derive features from values/mission. Each: icon area, headline, description. Cards: bg-white, rounded-2xl, p-8, border 1px solid, hover shadow transition.
5. STORY — Two-column. Text left telling brand narrative, ${secondaryImageUrl ? "image right" : "brand color block right"}.
6. CTA — Full-width, gradient ${primaryColor || "#030303"} to ${darkColor || "#1A1714"}. Headline + subtext + button in white.
7. FOOTER — Dark background ${darkColor || "#1A1714"}. Logo, nav links, contact, copyright. At the very bottom: "Brand hosted by Directional" linking to https://directional.dev.

Interaction: smooth scroll, anchor links, subtle card hover lift. Feel solid, trustworthy, premium — warmth and weight.`;
}

export function buildUpgradePrompt(brand) {
  const {
    name,
    primaryColor = "#030303",
    darkColor = "#1A1714",
    lightColor = "#F2EEE8",
    headlineFont = "Inter",
    bodyFont = "Inter",
    materialLanguage = "layered glass, warm shadows",
  } = brand;

  return `Redesign the entire ${name} landing page to feel absolutely cutting edge. Awwwards SOTD level.

Use editorial typography (${headlineFont} for display headlines with variable weight + italic accents, ${bodyFont} for body). NOT standard sans-serif sizing — use clamp(3rem, 10vw, 10rem) for hero headlines.

Replace all white cards and flat backgrounds with layered glass materials: backdrop-blur-2xl, bg-white/[0.04], hairline borders, and a subtle 3% SVG grain overlay across the entire page. Warm-toned shadows using ${primaryColor} at 12% alpha. No flat white cards with shadow-md ever.

Implement a full motion stack: Framer Motion for component reveals and magnetic buttons, GSAP ScrollTrigger for pinning/scrubbed scroll sections, and Lenis for buttery smooth global scrolling. Add a custom blended cursor (mix-blend-difference) that scales on hover targets, hidden on touch devices.

Key motion choreography:
- Hero: word-by-word mask reveal with 80ms stagger, easing [0.16,1,0.3,1], background image scales 1.15→1 with 0.3× parallax
- Metrics: infinite horizontal marquee that pauses on hover, ${headlineFont} numerals at clamp(4rem, 12vw, 8rem)
- Features: sticky scroll — left text pins while right visuals scrub through 3 frames with scale-in reveals
- Story: pinned image right, text paragraphs left cross-fade on scroll
- CTA: animated SVG mesh gradient (feTurbulence) behind glass button with ${primaryColor} inner glow
- Footer: oversized "${name}" wordmark (clamp(12rem, 25vw, 25rem)) that parallaxes up, opacity 10%

Grid: 12-column CSS Grid, asymmetrical placements, no global max-w-7xl container. Images must bleed edge-to-edge to viewport. Full-bleed sections only.

Navbar becomes a floating glass-pill, centered, 24px from top, shrinks on scroll. All CTAs get magnetic hover (80px radius, spring back).

Color dominance shift: ${darkColor} as primary dark, ${lightColor} as paper tone (never pure white). Single brand accent ${primaryColor} per section, not everywhere.

${materialLanguage ? `Material language: ${materialLanguage}.` : ""}

Generate cinematic AI images: one for hero (premium, 1920px wide, warm tones), three story frames for cross-fade. All matching the brand palette.

No 3D/WebGL, no video backgrounds. Every element must respect prefers-reduced-motion. The result should feel like a top-10 Awwwards editorial site.`;
}

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
