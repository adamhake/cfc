import { enableVisualEditing, type HistoryUpdate } from "@sanity/visual-editing";
import { useRouter } from "@tanstack/react-router";
import { useEffect } from "react";

/**
 * Visual Editing component that enables Sanity's click-to-edit overlays
 * and synchronizes navigation between the preview iframe and the Studio.
 *
 * This component should only be rendered when in preview mode.
 */
export function VisualEditing() {
  const router = useRouter();

  useEffect(() => {
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
