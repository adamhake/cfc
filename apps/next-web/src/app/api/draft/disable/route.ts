import { getSafeRedirectPath } from "@/lib/safe-redirect";
import { draftMode } from "next/headers";
import { redirect } from "next/navigation";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const redirectTo = url.searchParams.get("redirect") || "/";
  const safeRedirect = getSafeRedirectPath(redirectTo);

  const dm = await draftMode();
  dm.disable();

  redirect(safeRedirect);
}
