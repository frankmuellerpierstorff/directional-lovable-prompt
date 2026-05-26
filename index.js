/**
 * directional-lovable-prompt
 * Generate Awwwards-level Lovable.dev website prompts from a brand idea.
 *
 * Usage:
 *   import { generateWebsitePrompts } from 'directional-lovable-prompt';
 *   const result = await generateWebsitePrompts("An app that helps dog owners find vets");
 */

import Anthropic from "@anthropic-ai/sdk";
import {
  FOUNDATION_SYSTEM,
  BRAND_GEN_SYSTEM,
  buildFoundationUserPrompt,
  buildUpgradePrompt,
} from "./prompts.js";

const client = new Anthropic();

/**
 * Generate a complete brand foundation from a brief description.
 * Returns structured brand data (name, purpose, positioning, colors, fonts, etc.)
 */
export async function generateBrand(description) {
  const response = await client.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 2000,
    temperature: 0.5,
    system: BRAND_GEN_SYSTEM,
    messages: [{ role: "user", content: `Generate a complete brand foundation for: ${description}` }],
  });

  const text = response.content[0].text;
  // Extract JSON from response
  try { return JSON.parse(text); } catch {}
  const fenced = text.match(/```(?:json)?\s*\n?([\s\S]*?)\n?```/);
  if (fenced) { try { return JSON.parse(fenced[1].trim()); } catch {} }
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start !== -1 && end > start) return JSON.parse(text.slice(start, end + 1));
  throw new Error("Failed to parse brand JSON");
}

/**
 * Generate Foundation prompt (Prompt 1) from brand data.
 * This is the first prompt you paste into Lovable.
 */
export async function generateFoundationPrompt(brand) {
  const userPrompt = buildFoundationUserPrompt(brand);

  const response = await client.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 5000,
    temperature: 0.4,
    system: FOUNDATION_SYSTEM,
    messages: [{ role: "user", content: userPrompt }],
  });

  return response.content[0].text;
}

/**
 * Generate Upgrade prompt (Prompt 2) from brand data.
 * This is the second prompt you paste into Lovable after the foundation is built.
 * No API call needed — it's a template with brand tokens injected.
 */
export function generateUpgradePrompt(brand) {
  return buildUpgradePrompt(brand);
}

/**
 * All-in-one: from a brief description to two Lovable prompts.
 *
 * @param {string} description - Brief description of what you're building
 * @param {object} [overrides] - Optional overrides for brand data (colors, fonts, etc.)
 * @returns {{ brand, foundation, upgrade }}
 */
export async function generateWebsitePrompts(description, overrides = {}) {
  // Step 1: Generate brand from description
  const rawBrand = await generateBrand(description);

  // Apply overrides
  const brand = { ...rawBrand, ...overrides };

  // Normalize for prompt builders
  const promptBrand = {
    name: brand.name,
    description,
    purpose: brand.purpose,
    positioning: brand.positioning,
    tone: brand.tone,
    narrative: brand.narrative,
    audience: brand.audience,
    values: brand.values,
    mission: brand.mission,
    painsGains: brand.painsGains,
    primaryColor: brand.primaryColor,
    allColors: [brand.primaryColor, brand.secondaryColor, brand.accentColor].filter(Boolean).join(", "),
    darkColor: brand.darkColor,
    lightColor: brand.lightColor,
    headlineFont: brand.headlineFont,
    bodyFont: brand.bodyFont,
    logoUrl: brand.logoUrl || overrides.logoUrl,
    heroImageUrl: brand.heroImageUrl || overrides.heroImageUrl,
    secondaryImageUrl: brand.secondaryImageUrl || overrides.secondaryImageUrl,
    materialLanguage: brand.materialLanguage,
  };

  // Step 2: Generate Foundation prompt (Claude call)
  const foundation = await generateFoundationPrompt(promptBrand);

  // Step 3: Generate Upgrade prompt (template, no API call)
  const upgrade = generateUpgradePrompt(promptBrand);

  return { brand, foundation, upgrade };
}
