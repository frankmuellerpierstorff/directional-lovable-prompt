/**
 * directional-lovable-prompt
 * Generate Awwwards-level Lovable.dev website prompts from a brand idea.
 *
 * Usage:
 *   import { generateWebsitePrompt } from 'directional-lovable-prompt';
 *   const result = await generateWebsitePrompt("An app that helps dog owners find vets");
 */

import Anthropic from "@anthropic-ai/sdk";
import {
  CONTENT_SYSTEM,
  BRAND_GEN_SYSTEM,
  buildContentUserPrompt,
  buildMasterPrompt,
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
  try { return JSON.parse(text); } catch {}
  const fenced = text.match(/```(?:json)?\s*\n?([\s\S]*?)\n?```/);
  if (fenced) { try { return JSON.parse(fenced[1].trim()); } catch {} }
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start !== -1 && end > start) return JSON.parse(text.slice(start, end + 1));
  throw new Error("Failed to parse brand JSON");
}

/**
 * Generate a single master prompt from brand data.
 * Claude generates content (headlines, copy, CTAs).
 * Art direction, motion, constraints are templates with brand tokens injected.
 */
export async function generateWebsitePrompt(description, overrides = {}) {
  // Step 1: Generate brand from description
  const rawBrand = await generateBrand(description);
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
    primaryColor: brand.primaryColor,
    allColors: [brand.primaryColor, brand.secondaryColor, brand.accentColor, brand.darkColor, brand.lightColor].filter(Boolean).join(", "),
    darkColor: brand.darkColor,
    lightColor: brand.lightColor,
    headlineFont: brand.headlineFont,
    bodyFont: brand.bodyFont,
    logoUrl: brand.logoUrl || overrides.logoUrl,
    heroImageUrl: brand.heroImageUrl || overrides.heroImageUrl,
    secondaryImageUrl: brand.secondaryImageUrl || overrides.secondaryImageUrl,
    materialLanguage: brand.materialLanguage,
  };

  // Step 2: Claude generates content only (headlines, copy, CTAs)
  const contentResponse = await client.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 3000,
    temperature: 0.5,
    system: CONTENT_SYSTEM,
    messages: [{ role: "user", content: buildContentUserPrompt(promptBrand) }],
  });
  const contentBrief = contentResponse.content[0].text;

  // Step 3: Assemble master prompt (template + content)
  const prompt = buildMasterPrompt(promptBrand, contentBrief);

  return { brand, prompt };
}

// Legacy exports for backward compatibility
export const generateWebsitePrompts = async (description, overrides = {}) => {
  const { brand, prompt } = await generateWebsitePrompt(description, overrides);
  return { brand, foundation: prompt, upgrade: "(Merged into single master prompt)" };
};
