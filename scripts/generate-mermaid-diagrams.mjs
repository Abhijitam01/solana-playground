#!/usr/bin/env node
/**
 * Generate mermaid-diagram.txt for all templates using Groq API.
 * Usage: GROQ_API_KEY=... node scripts/generate-mermaid-diagrams.mjs
 */

import { readdir, readFile, writeFile } from "fs/promises";
import { join } from "path";

const GROQ_API_KEY = process.env.GROQ_API_KEY;
if (!GROQ_API_KEY) {
  console.error("❌ GROQ_API_KEY is required");
  process.exit(1);
}

const TEMPLATES_DIR = join(
  new URL(".", import.meta.url).pathname,
  "../packages/solana/templates"
);

const SYSTEM_PROMPT = `You are a Solana program architecture visualizer. You generate valid Mermaid flowchart definitions.

CRITICAL SYNTAX RULES:
1. Start with: flowchart TD
2. Subgraphs use "end" keyword, NOT curly braces:
   subgraph Title
     nodeA --> nodeB
   end
3. Node IDs must be simple alphanumeric: initialize, update, myAccount
4. Labels with spaces must be in square brackets: initialize["Initialize Account"]
5. Arrow types: --> for flow, -.-> for optional, ==> for important
6. Do NOT use parentheses () in labels, use square brackets [] instead
7. Do NOT use colons : in node IDs
8. Each line should have exactly one statement
9. Keep it simple — max 15-20 nodes
10. Do NOT add style or classDef lines

Return ONLY the raw Mermaid definition. No markdown, no code blocks, no explanations.`;

async function generateDiagram(code, templateId) {
  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        {
          role: "user",
          content: `Generate a Mermaid flowchart for this Solana Anchor program (template: ${templateId}). Follow the syntax rules exactly.\n\n\`\`\`rust\n${code}\n\`\`\`\n\nReturn ONLY valid Mermaid syntax.`,
        },
      ],
      max_tokens: 1500,
      temperature: 0.2,
    }),
  });

  if (!response.ok) {
    throw new Error(`Groq API error: ${response.status} ${await response.text()}`);
  }

  const data = await response.json();
  let text = data.choices[0]?.message?.content?.trim() || "";

  // Clean up markdown wrappers
  if (text.startsWith("```mermaid")) {
    text = text.replace(/```mermaid\n?/g, "").replace(/```\n?$/g, "");
  } else if (text.startsWith("```")) {
    text = text.replace(/^```\w*\n?/g, "").replace(/```\n?$/g, "");
  }

  // Sanitize common issues
  text = sanitize(text.trim());
  return text;
}

function sanitize(input) {
  const lines = input.split("\n");
  const result = [];

  for (const line of lines) {
    if (line === undefined) continue;
    let l = line;

    // Fix curly brace subgraphs
    if (/^\s*subgraph\s+/.test(l) && l.trim().endsWith("{")) {
      l = l.replace(/\s*\{\s*$/, "");
    }
    if (l.trim() === "}") {
      l = l.replace("}", "end");
    }

    // Fix parenthesized labels
    l = l.replace(/(\w+)\("([^"]*)"\)/g, '$1["$2"]');
    l = l.replace(/(\w+)\('([^']*)'\)/g, '$1["$2"]');

    // Fix colons in node IDs
    if (!/^\s*(subgraph|flowchart|graph|end)/.test(l)) {
      l = l.replace(/(\w+):(\w+)/g, "$1_$2");
    }

    // Skip style/classDef lines
    if (/^\s*(style|classDef)\s+/.test(l)) continue;

    // Strip class references
    l = l.replace(/:::\w+/g, "");

    result.push(l);
  }

  return result.join("\n");
}

async function main() {
  const templates = await readdir(TEMPLATES_DIR);
  console.log(`Found ${templates.length} templates\n`);

  let success = 0;
  let failed = 0;

  for (const templateId of templates) {
    const codePath = join(TEMPLATES_DIR, templateId, "program/lib.rs");
    const outPath = join(TEMPLATES_DIR, templateId, "mermaid-diagram.txt");

    // Skip if already generated
    try {
      await readFile(outPath, "utf-8");
      console.log(`⏭️  ${templateId} (already exists)`);
      success++;
      continue;
    } catch {
      // File doesn't exist, generate it
    }

    try {
      const code = await readFile(codePath, "utf-8");
      process.stdout.write(`⏳ ${templateId}...`);

      const diagram = await generateDiagram(code, templateId);
      await writeFile(outPath, diagram, "utf-8");

      console.log(` ✅ (${diagram.split("\n").length} lines)`);
      success++;

      // Rate limit: wait 3 seconds between requests
      await new Promise((r) => setTimeout(r, 3000));
    } catch (err) {
      console.log(` ❌ ${err.message}`);
      failed++;
      // Wait longer on error (rate limit backoff)
      await new Promise((r) => setTimeout(r, 5000));
    }
  }

  console.log(`\n✅ Done: ${success} generated, ${failed} failed`);
}

main();
