import { env } from "@/env";
import { getSafeRedirectPath } from "@/lib/safe-redirect";
import { sanityPreviewClient } from "@/lib/sanity";
import { validatePreviewUrl } from "@sanity/preview-url-secret";
import { draftMode } from "next/headers";
import { redirect } from "next/navigation";

export async function GET(request: Request) {
  const url = new URL(request.url);

  console.log("[Draft Mode] Enable request received:", url.pathname + url.search);

  if (!env.SANITY_API_TOKEN) {
    console.error("[Draft Mode] SANITY_API_TOKEN is not set");
    return new Response("Server misconfiguration: missing API token", { status: 500 });
  }

  let isValid: boolean;
  let redirectTo: string;
  try {
    const result = await validatePreviewUrl(sanityPreviewClient(), url.toString());
    isValid = result.isValid;
    redirectTo = result.redirectTo ?? "/";
  } catch (error) {
    console.error("[Draft Mode] validatePreviewUrl threw:", error);
    return new Response("Failed to validate preview secret", { status: 500 });
  }

  if (!isValid) {
    console.warn("[Draft Mode] Invalid secret – returning 401");
    return new Response("Invalid secret", { status: 401 });
  }

  console.log("[Draft Mode] Secret valid, enabling preview. Redirecting to:", redirectTo);

  const dm = await draftMode();
  dm.enable();

  const safeRedirect = getSafeRedirectPath(redirectTo);
  redirect(safeRedirect);
}
