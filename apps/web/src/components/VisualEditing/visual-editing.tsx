import { lazy } from "react";

/**
 * Lazy-loaded Visual Editing component.
 *
 * The heavy @sanity/visual-editing dependency is code-split into a separate
 * chunk that is only loaded when preview mode is active. The parent route
 * (__root.tsx) conditionally renders this component, and the router provides
 * a Suspense boundary.
 */
export const VisualEditing = lazy(() => import("./visual-editing-impl"));
