/**
 * Preview mode detection utilities for Sanity Visual Editing
 */

import { createServerFn } from "@tanstack/react-start";
import { getCookie } from "@tanstack/react-start/server";

/**
 * Server function to check if preview mode is enabled via cookie
 * Use in route loaders to determine if draft content should be fetched
 */
export const getIsPreviewMode = createServerFn().handler(async () => {
  const previewCookie = getCookie("sanity-preview");
  return previewCookie === "true";
});
