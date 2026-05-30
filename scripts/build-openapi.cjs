#!/usr/bin/env node
/**
 * Build docs-site/openapi.yaml from CoreBackend swagger-jsdoc annotations.
 *
 * Filters to the public-facing API surface documented in /api-reference,
 * rewrites the server URL to production, and switches the security scheme
 * to the bearer-token form (wai_...) that public users actually use.
 *
 * Run: node docs-site/scripts/build-openapi.js
 */
const fs = require("fs");
const path = require("path");

const REPO_ROOT = path.resolve(__dirname, "../..");
const BACKEND = path.join(REPO_ROOT, "CoreBackend");
const OUT_YAML = path.join(__dirname, "..", "openapi.yaml");

const PUBLIC_TAGS = new Set([
  "Users",
  "Personas",
  "Voices",
  "Scenarios",
  "Goals",
  "Meetings",
  "Analyses",
  "Recordings",
  "Transcripts",
]);

// Hand-curated developer-facing surface. Anything outside this set is hidden
// from docs.waterr.ai even if the annotation still lives in CoreBackend.
// Keyed by "METHOD /path" exactly as it appears in the swagger spec.
const PUBLIC_OPS = new Set([
  // Scenarios — anchor workflow
  "POST /scenarios",
  "GET /scenarios",
  "GET /scenarios/{id}/export",
  "PUT /scenarios/{id}",
  "DELETE /scenarios/{id}",
  // Meetings — anchor workflow
  "POST /meetings",
  "GET /meetings",
  "GET /meetings/{id}",
  "PUT /meetings/{meetingId}",
  "PUT /meetings/{meetingId}/end",
  "DELETE /meetings/{meetingId}",
  "GET /scenarios/membership/{membershipId}/meetings",
  // Analyses — anchor workflow
  "GET /analyses/meeting/{meetingId}",
  "GET /analyses/{id}",
  "POST /analyses/trigger/{meetingId}",
  // Transcripts
  "GET /transcripts/meeting/{meetingId}",
  "GET /transcripts/{id}",
  // Recordings
  "GET /recordings/meeting/{meetingId}",
  "GET /recordings/url-with-thumbnail/{meetingId}",
  // Personas
  "GET /personas",
  "POST /personas",
  "GET /personas/{id}",
  "PUT /personas/{id}",
  "DELETE /personas/{id}",
  // Goals
  "GET /goals",
  "POST /goals",
  "PUT /goals/{id}",
  "DELETE /goals/{id}",
  // Voices
  "GET /voices",
  // Users
  "GET /users/{userId}",
  "PUT /users/{userId}",
]);

const PROD_URL = "https://api.waterr.ai/v1";

function loadSpec() {
  const prevCwd = process.cwd();
  process.chdir(BACKEND);
  try {
    delete require.cache[require.resolve(path.join(BACKEND, "swagger.js"))];
    return require(path.join(BACKEND, "swagger.js"));
  } finally {
    process.chdir(prevCwd);
  }
}

function filterPaths(paths) {
  const out = {};
  for (const route of Object.keys(paths)) {
    const ops = {};
    for (const method of Object.keys(paths[route])) {
      const op = paths[route][method];
      const tag = (op.tags || [])[0];
      if (!PUBLIC_TAGS.has(tag)) continue;
      if (!PUBLIC_OPS.has(`${method.toUpperCase()} ${route}`)) continue;
      ops[method] = rewriteOperation(op);
    }
    if (Object.keys(ops).length > 0) out[route] = ops;
  }
  return out;
}

function rewriteOperation(op) {
  const clone = JSON.parse(JSON.stringify(op));
  // Public callers authenticate with a wai_ API key sent as a Bearer token.
  clone.security = [{ apiKeyAuth: [] }];
  // OpenAPI 3 requires a non-empty responses object. swagger-jsdoc lets some
  // route annotations omit it; fall back to a generic success response so the
  // spec validates and the playground still renders.
  if (!clone.responses || Object.keys(clone.responses).length === 0) {
    clone.responses = { 200: { description: "Success" } };
  }
  return clone;
}

function buildSpec() {
  const raw = loadSpec();

  const spec = {
    openapi: "3.0.0",
    info: {
      title: "WaterrAI API",
      version: "1.0.0",
      description:
        "REST API for the WaterrAI meeting platform — create scenarios, " +
        "spin up AI-driven meetings, fetch transcripts and analyses.",
      contact: { name: "Support", email: "harshit@waterr.ai" },
    },
    servers: [{ url: PROD_URL, description: "Production" }],
    components: {
      securitySchemes: {
        apiKeyAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "wai_...",
          description:
            "API key from waterr.ai/settings?tab=api-keys. Send as " +
            "`Authorization: Bearer wai_<your_key>`.",
        },
      },
      schemas: raw.components?.schemas || {},
    },
    security: [{ apiKeyAuth: [] }],
    tags: [...PUBLIC_TAGS].map((name) => ({ name })),
    paths: filterPaths(raw.paths || {}),
  };

  return spec;
}

function slugFor(method, route) {
  // url-safe slug: "POST /meetings/{meetingId}/end" -> "post-meetings-meetingid-end"
  return (
    method.toLowerCase() +
    "-" +
    route
      .replace(/^\//, "")
      .replace(/\{|\}/g, "")
      .replace(/\//g, "-")
      .replace(/[^a-z0-9-]/gi, "-")
      .replace(/-+/g, "-")
      .replace(/-$/, "")
      .toLowerCase()
  );
}

function writeEndpointStubs(spec) {
  // Generate one MDX stub per operation under api-reference/endpoint/.
  // Each stub uses the `openapi:` frontmatter that the inline pages already
  // use successfully — this is the documented, version-stable form.
  const dir = path.join(__dirname, "..", "api-reference", "endpoint");
  fs.mkdirSync(dir, { recursive: true });
  // wipe previous stubs so renames don't leave orphans
  for (const f of fs.readdirSync(dir)) {
    if (f.endsWith(".mdx")) fs.unlinkSync(path.join(dir, f));
  }
  const byTag = {};
  for (const route of Object.keys(spec.paths)) {
    for (const method of Object.keys(spec.paths[route])) {
      const op = spec.paths[route][method];
      const tag = (op.tags || [])[0] || "Other";
      const slug = slugFor(method, route);
      // YAML single-quoted strings escape ' by doubling it.
      const ySafe = (s) => s.replace(/'/g, "''");
      const title = op.summary || `${method.toUpperCase()} ${route}`;
      const description = (op.description || "").trim();
      const body = [
        "---",
        `title: '${ySafe(title)}'`,
        description ? `description: '${ySafe(description)}'` : null,
        `openapi: '${method.toUpperCase()} ${route}'`,
        "---",
        "",
      ].filter(Boolean).join("\n");
      fs.writeFileSync(path.join(dir, `${slug}.mdx`), body);
      (byTag[tag] = byTag[tag] || []).push({ slug, sort: `${route} ${method}` });
    }
  }
  return Object.keys(byTag)
    .sort()
    .map((tag) => ({
      group: tag,
      pages: byTag[tag]
        .sort((a, b) => a.sort.localeCompare(b.sort))
        .map((e) => `api-reference/endpoint/${e.slug}`),
    }));
}

function patchDocsJson(spec) {
  const docsJsonPath = path.join(__dirname, "..", "docs.json");
  const docs = JSON.parse(fs.readFileSync(docsJsonPath, "utf8"));
  const apiTab = (docs.navigation?.tabs || []).find(
    (t) => t.tab === "API Reference"
  );
  if (!apiTab) {
    console.warn("Could not find 'API Reference' tab in docs.json");
    return;
  }
  const endpointGroups = writeEndpointStubs(spec);
  // Replace any prior auto-generated groups (anything after our handwritten
  // groups) with the freshly generated set. We identify auto groups by name
  // matching one of the PUBLIC_TAGS, plus a legacy "Endpoints" placeholder.
  const handwrittenGroups = apiTab.groups.filter((g) => {
    if (g.group === "Endpoints") return false;
    if (PUBLIC_TAGS.has(g.group)) return false;
    return true;
  });
  apiTab.groups = [...handwrittenGroups, ...endpointGroups];
  fs.writeFileSync(docsJsonPath, JSON.stringify(docs, null, 2) + "\n");
  console.log(`Patched ${docsJsonPath} with ${endpointGroups.length} groups`);
}

function main() {
  const spec = buildSpec();
  const yaml = require(path.join(BACKEND, "node_modules", "js-yaml"));
  const text = yaml.dump(spec, { noRefs: true, lineWidth: 120 });
  fs.writeFileSync(OUT_YAML, text);

  const pathCount = Object.keys(spec.paths).length;
  let opCount = 0;
  for (const p of Object.values(spec.paths)) opCount += Object.keys(p).length;
  console.log(`Wrote ${OUT_YAML}`);
  console.log(`  ${pathCount} paths, ${opCount} operations`);

  patchDocsJson(spec);
}

main();
