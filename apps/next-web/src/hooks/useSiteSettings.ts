"use client";

import { useEffect, useState } from "react";
import { getSanityClient } from "@/lib/sanity";
import type { SanitySiteSettings } from "@/lib/sanity-types";
import { getSiteSettingsQuery } from "@chimborazo/sanity-config/queries";

/**
 * Client-side hook to fetch site settings from Sanity CMS.
 * Returns social media URLs, donation URL, and other global settings.
 *
 * Uses a simple fetch-on-mount pattern since TanStack Query is not
 * set up as a provider in the Next.js app.
 */
export function useSiteSettings(preview = false) {
  const [data, setData] = useState<SanitySiteSettings | null>(null);

  useEffect(() => {
    let cancelled = false;
    const client = getSanityClient(preview);
    client
      .fetch<SanitySiteSettings | null>(getSiteSettingsQuery)
      .then((result) => {
        if (!cancelled) setData(result);
      })
      .catch((err) => {
        console.warn("Failed to fetch site settings from Sanity:", err);
      });
    return () => {
      cancelled = true;
    };
  }, [preview]);

  return { data };
}
