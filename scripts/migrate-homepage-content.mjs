#!/usr/bin/env node

/**
 * Migration script: Populate new homepage CMS fields with existing hardcoded content.
 *
 * This script patches the existing homePage document in Sanity to add content
 * for the new administrable sections (intro, vision, projects, park, events,
 * get involved, partners). It uses `ifRevisionId` to avoid overwriting any
 * content that has already been set manually in the Studio.
 *
 * Usage (from monorepo root):
 *   node scripts/migrate-homepage-content.mjs
 *
 * Required environment variables (reads from apps/web/.env):
 *   VITE_SANITY_PROJECT_ID
 *   VITE_SANITY_DATASET
 *   SANITY_API_TOKEN  (needs Editor or Admin permissions)
 */

import { createRequire } from "module";
import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

// Resolve @sanity/client from the web workspace where it's installed
const require = createRequire(resolve(__dirname, "../apps/web/package.json"));
const { createClient } = require("@sanity/client");

// ─── Load environment variables from apps/web/.env ───

function loadEnv() {
  const envPath = resolve(__dirname, "../apps/web/.env");
  let envContent;
  try {
    envContent = readFileSync(envPath, "utf-8");
  } catch {
    console.error(`Could not read ${envPath}. Make sure apps/web/.env exists.`);
    process.exit(1);
  }

  const env = {};
  for (const line of envContent.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eqIndex = trimmed.indexOf("=");
    if (eqIndex === -1) continue;
    const key = trimmed.slice(0, eqIndex).trim();
    const value = trimmed.slice(eqIndex + 1).trim();
    env[key] = value;
  }
  return env;
}

const env = loadEnv();

const projectId = env.VITE_SANITY_PROJECT_ID;
const dataset = env.VITE_SANITY_DATASET || "production";
const token = env.SANITY_API_TOKEN;

if (!projectId || !token) {
  console.error(
    "Missing required environment variables: VITE_SANITY_PROJECT_ID and SANITY_API_TOKEN"
  );
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: "2024-01-01",
  token,
  useCdn: false,
});

// ─── Helpers ───

let keyCounter = 0;

function key() {
  keyCounter++;
  const timestamp = Date.now().toString(36);
  const counter = keyCounter.toString(36).padStart(4, "0");
  return `migrate_${timestamp}_${counter}`;
}

/** Create a simple Portable Text paragraph block */
function paragraph(text) {
  return {
    _type: "block",
    _key: key(),
    style: "normal",
    markDefs: [],
    children: [
      {
        _type: "span",
        _key: key(),
        text,
        marks: [],
      },
    ],
  };
}

/** Create a Portable Text paragraph with a bold lead-in phrase */
function paragraphWithBoldLead(boldText, restText) {
  return {
    _type: "block",
    _key: key(),
    style: "normal",
    markDefs: [],
    children: [
      {
        _type: "span",
        _key: key(),
        text: boldText,
        marks: ["strong"],
      },
      {
        _type: "span",
        _key: key(),
        text: restText,
        marks: [],
      },
    ],
  };
}

/** Create a Portable Text bullet list item */
function bulletItem(text) {
  return {
    _type: "block",
    _key: key(),
    style: "normal",
    listItem: "bullet",
    level: 1,
    markDefs: [],
    children: [
      {
        _type: "span",
        _key: key(),
        text,
        marks: [],
      },
    ],
  };
}

// ─── Migration content ───

const migrationData = {
  // Intro Section
  introSection: {
    heading:
      "The Chimborazo Park Conservancy and Friends of Chimborazo Park preserve and enhance this Church Hill landmark through community stewardship.",
    body: [
      paragraph(
        "Established in 2023 as a 501(c)(3) non-profit, the conservancy was formed out of the Friends of Chimborazo Park to address the broader needs of this historic greenspace as it continues to recover and thrive."
      ),
      paragraph(
        "Since then, we\u2019ve been putting down roots\u2014engaging volunteers and partners on environmental projects while planning for the future. Together, we\u2019re building a sustainable foundation for a healthier, more beautiful park that serves our community for generations to come."
      ),
    ],
  },

  // Vision Section
  visionSection: {
    title: "Our Vision",
    description:
      "Our mission is built on four core pillars. Explore each to see how we\u2019re working to make Chimborazo Park a cherished landmark for generations to come.",
    pillars: [
      {
        _key: key(),
        title: "Restoration",
        pillar: "restoration",
        description: [
          bulletItem(
            "Revitalizing and preserving the park\u2019s environmental character through the recovery and expansion of our natural spaces and habitats."
          ),
          bulletItem(
            "Restoring and repairing the park\u2019s unique cultural heritage elements."
          ),
        ],
      },
      {
        _key: key(),
        title: "Recreation",
        pillar: "recreation",
        description: [
          paragraph(
            "Providing vibrant play spaces, natural areas, and a dog park where neighbors of all ages\u2014and their pets\u2014can gather and stay active."
          ),
        ],
      },
      {
        _key: key(),
        title: "Connection",
        pillar: "connection",
        description: [
          paragraph(
            "Building an inclusive, welcoming park through volunteer stewardship and partnerships that strengthen our Church Hill neighborhood."
          ),
        ],
      },
      {
        _key: key(),
        title: "Preservation",
        pillar: "preservation",
        description: [
          paragraph(
            "Honoring all chapters of Chimborazo\u2019s rich history and ensuring its complete story is shared and understood by future generations."
          ),
        ],
      },
    ],
  },

  // Projects Section Header
  projectsSectionHeader: {
    title: "Projects",
    description:
      "Learn about our current initiatives and how they\u2019re transforming Chimborazo Park for the entire community.",
  },

  // Park Section
  parkSection: {
    title: "The Park",
    intro:
      "Chimborazo Hill\u2019s story reaches back centuries\u2014from the indigenous Powhatan people to its pivotal role in the Civil War. In 1874, as Richmond rebuilt, the city transformed this storied site into a public park for all residents to enjoy.",
    body: [
      paragraph(
        "City engineer Wilfred Cutshaw spent decades in the late 1800s designing winding cobbled carriage roads that embraced the steep terrain, revealing breathtaking vistas at every turn. These paths connected Church Hill with the traditionally African American Fulton neighborhood below, creating vital links between communities."
      ),
      paragraph(
        "By the turn of the 20th century, Chimborazo had become Richmond\u2019s beloved suburban retreat. Visitors arrived by streetcar to enjoy the bandstand, refreshment pavilion, and sweeping 180-degree views of the James River and downtown\u2014a golden era that lasted through World War II."
      ),
    ],
    today:
      "Today, the park includes scenic trails, a dog park, the historic Round House, a picnic gazebo, and an eight-foot Statue of Liberty replica erected by Boy Scouts in the 1950s.",
    callout: [
      paragraph(
        "Time and reduced funding have taken their toll\u2014many of the park\u2019s original features have fallen into disrepair. Invasive species and climate change have further diminished its native plantings and natural areas."
      ),
      paragraphWithBoldLead(
        "We\u2019re changing that.",
        " The Chimborazo Park Conservancy is restoring, repairing, and enhancing this treasured greenspace to ensure it remains beautiful, safe, and inclusive for generations to come."
      ),
    ],
  },

  // Events Section Header
  eventsSectionHeader: {
    title: "Events",
    description:
      "Join us for seasonal clean-ups, tree plantings, educational presentations, and community gatherings that help preserve and enhance our historic park.",
  },

  // Get Involved Section
  getInvolvedSection: {
    title: "Get Involved",
    description:
      "Join our community of volunteers and supporters. Get updates on park projects, upcoming events, and opportunities to make a difference in Chimborazo Park.",
  },

  // Partners Section Header
  partnersSectionHeader: {
    title: "Partners",
    description:
      "We\u2019re grateful to partner with local organizations that share our commitment to preserving and enhancing Chimborazo Park for the entire community.",
  },
};

// ─── Execute migration ───

async function migrate() {
  console.log(`Connecting to Sanity project ${projectId} (dataset: ${dataset})...\n`);

  // Fetch existing homepage document
  const existing = await client.fetch(
    `*[_type == "homePage" && !(_id in path("drafts.**"))][0]{ _id, _rev, introSection, visionSection, projectsSectionHeader, parkSection, eventsSectionHeader, getInvolvedSection, partnersSectionHeader }`
  );

  if (!existing) {
    console.error(
      'No homePage document found. Create one in Sanity Studio first (Pages > Homepage).'
    );
    process.exit(1);
  }

  console.log(`Found homepage document: ${existing._id}`);

  // Check which fields are already populated
  const fieldsToSet = {};
  const skipped = [];

  for (const [field, value] of Object.entries(migrationData)) {
    if (existing[field] != null) {
      skipped.push(field);
    } else {
      fieldsToSet[field] = value;
    }
  }

  if (skipped.length > 0) {
    console.log(`\nSkipping already-populated fields: ${skipped.join(", ")}`);
  }

  if (Object.keys(fieldsToSet).length === 0) {
    console.log("\nAll fields already populated. Nothing to migrate.");
    return;
  }

  console.log(`\nMigrating fields: ${Object.keys(fieldsToSet).join(", ")}`);

  // Build the patch
  const patch = client.patch(existing._id).set(fieldsToSet);

  // Use ifRevisionId to avoid race conditions
  if (existing._rev) {
    patch.ifRevisionId(existing._rev);
  }

  try {
    const result = await patch.commit();
    console.log(`\nMigration successful! Document updated (rev: ${result._rev})`);
    console.log("\nPopulated fields:");
    for (const field of Object.keys(fieldsToSet)) {
      console.log(`  \u2713 ${field}`);
    }
  } catch (err) {
    if (err.statusCode === 409) {
      console.error(
        "\nConflict: The document was modified while migrating. Please try again."
      );
    } else {
      console.error("\nMigration failed:", err.message);
    }
    process.exit(1);
  }
}

migrate();
