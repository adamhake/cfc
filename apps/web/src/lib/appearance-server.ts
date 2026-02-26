import { createServerFn } from "@tanstack/react-start";
import { getCookie } from "@tanstack/react-start/server";
import { APPEARANCE_COOKIES, getAppearanceFromCookieValues } from "./appearance-shared";

export const getInitialAppearance = createServerFn().handler(async () => {
  return getAppearanceFromCookieValues({
    theme: getCookie(APPEARANCE_COOKIES.THEME),
    resolvedTheme: getCookie(APPEARANCE_COOKIES.RESOLVED_THEME),
    palette: getCookie(APPEARANCE_COOKIES.PALETTE),
  });
});
