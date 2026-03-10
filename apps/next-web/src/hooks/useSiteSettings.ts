"use client";

import { useEffect, useState } from "react";
import { sanityClient } from "@/lib/sanity";
import type { SanitySiteSettings } from "@/lib/sanity-types";
import { getSiteSettingsQuery } from "@chimborazo/sanity-config/queries";

/**
 * Client-side hook to fetch site settings from Sanity CMS.
 * Returns social media URLs, donation URL, and other global settings.
 *
 * Uses a simple fetch-on-mount pattern since TanStack Query is not
 * set up as a provider in the Next.js app.
 */
export function useSiteSettings() {
  const [data, setData] = useState<SanitySiteSettings | null>(null);

  useEffect(() => {
    let cancelled = false;
    sanityClient
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
  }, []);

  return { data };
}
