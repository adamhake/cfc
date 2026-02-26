import { enableVisualEditing, type HistoryUpdate } from "@sanity/visual-editing";
import { useQueryClient } from "@tanstack/react-query";
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
  const queryClient = useQueryClient();

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
      // Refresh preview when Studio notifies of document changes.
      // Without this, the default is location.reload() which is unreliable
      // inside the Presentation tool iframe and loses React state.
      refresh: (payload) => {
        console.log("[VisualEditing] Refresh event:", payload.source);
        // Invalidate all queries so TanStack Query refetches with updated data
        return queryClient.invalidateQueries();
      },
    });

    return cleanup;
  }, [router, queryClient]);

  return null;
}
