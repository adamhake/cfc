"use client"

import { VisualEditing as SanityVisualEditing } from "next-sanity/visual-editing"

/**
 * Client component that enables Sanity Visual Editing overlays.
 *
 * Rendered conditionally when Next.js draft mode is active.
 * Uses next-sanity's built-in VisualEditing component which handles:
 * - Click-to-edit overlays for Sanity documents
 * - Navigation sync between the preview iframe and Studio
 * - Automatic content refresh on document changes
 */
export function VisualEditing() {
  return <SanityVisualEditing />
}
