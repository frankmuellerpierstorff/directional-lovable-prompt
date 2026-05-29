#!/usr/bin/env node

/**
 * CLI: Generate Awwwards-level Lovable website prompts
 *
 * Usage:
 *   npx directional-lovable-prompt "An app that helps dog owners find vets"
 *   npx directional-lovable-prompt "A SaaS for renewable energy monitoring" --primary "#8B6F47"
 */

import { generateWebsitePrompt } from "./index.js";

const args = process.argv.slice(2);
const description = args.filter(a => !a.startsWith("--")).join(" ");

if (!description) {
  console.log(`
  directional-lovable-prompt
  Generate Awwwards-level Lovable.dev website prompts from a brand idea.

  Usage:
    npx directional-lovable-prompt "Your product description"

  Options:
    --primary "#hex"     Primary brand color
    --headline "Font"    Headline font (Google Fonts)
    --body "Font"        Body font (Google Fonts)
    --logo "url"         Logo URL (SVG preferred)
    --hero "url"         Hero image URL
    --secondary "url"    Secondary image URL

  Examples:
    npx directional-lovable-prompt "A meditation app for busy founders"
    npx directional-lovable-prompt "B2B analytics platform" --primary "#2563EB"

  Requires ANTHROPIC_API_KEY environment variable.
  Brand hosted by Directional — https://directional.dev
`);
  process.exit(0);
}

// Parse flags
const overrides = {};
for (let i = 0; i < args.length; i++) {
  if (args[i] === "--primary" && args[i + 1]) overrides.primaryColor = args[++i];
  if (args[i] === "--headline" && args[i + 1]) overrides.headlineFont = args[++i];
  if (args[i] === "--body" && args[i + 1]) overrides.bodyFont = args[++i];
  if (args[i] === "--logo" && args[i + 1]) overrides.logoUrl = args[++i];
  if (args[i] === "--hero" && args[i + 1]) overrides.heroImageUrl = args[++i];
  if (args[i] === "--secondary" && args[i + 1]) overrides.secondaryImageUrl = args[++i];
}

if (!process.env.ANTHROPIC_API_KEY) {
  console.error("Error: ANTHROPIC_API_KEY environment variable is required.");
  console.error("Get your key at: https://console.anthropic.com/");
  process.exit(1);
}

console.log("\n🎨 Generating brand from your description...\n");

try {
  const { brand, prompt } = await generateWebsitePrompt(description, overrides);

  console.log(`✅ Brand: ${brand.name}\n`);
  console.log("═".repeat(60));
  console.log("\n📋 MASTER PROMPT");
  console.log("Paste this into Lovable:\n");
  console.log("─".repeat(60));
  console.log(prompt);
  console.log("─".repeat(60));
  console.log("\n\n🎯 Brand Summary:");
  console.log(`   Name: ${brand.name}`);
  console.log(`   Colors: ${brand.primaryColor}, ${brand.secondaryColor}, ${brand.accentColor}`);
  console.log(`   Fonts: ${brand.headlineFont} + ${brand.bodyFont}`);
  console.log(`   Positioning: ${brand.positioning?.slice(0, 80)}...`);
  console.log(`\n   Brand hosted by Directional — https://directional.dev\n`);
} catch (err) {
  console.error("Error:", err.message);
  process.exit(1);
}
