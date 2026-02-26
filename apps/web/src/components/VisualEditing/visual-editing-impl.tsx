import { enableVisualEditing, type HistoryUpdate } from "@sanity/visual-editing";
import { useRouter } from "@tanstack/react-router";
import { useEffect } from "react";

/**
 * Visual Editing implementation that enables Sanity's click-to-edit overlays
 * and synchronizes navigation between the preview iframe and the Studio.
 *
 * This component is lazy-loaded to keep the heavy @sanity/visual-editing
 * dependency out of the main bundle.
 */
export default function VisualEditingImpl() {
  const router = useRouter();

  useEffect(() => {
    console.log("[VisualEditing] Calling enableVisualEditing()");

    // Enable visual editing with TanStack Router history integration
    const cleanup = enableVisualEditing({
      history: {
        // Subscribe to navigation events from the app to notify the Studio
        subscribe: (navigate) => {
          return router.subscribe("onBeforeNavigate", ({ toLocation }) => {
            navigate({ type: "push", url: toLocation.href });
          });
        },
        // Handle navigation requests from the Studio
        update: (update: HistoryUpdate) => {
          if (update.type === "pop") {
            router.history.back();
          } else {
            router.navigate({ to: update.url, replace: update.type === "replace" });
          }
        },
      },
    });

    return cleanup;
  }, [router]);

  return null;
}
