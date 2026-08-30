export interface NavigationItem {
  href: string
  label: string
}

/**
 * Canonical navigation order shared by every site navigation surface.
 * Home is represented by the logo in the desktop header but remains explicit
 * in the mobile menu and footer.
 */
export const NAVIGATION_ITEMS: NavigationItem[] = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About Us" },
  { href: "/projects", label: "Projects" },
  { href: "/events", label: "Events" },
  { href: "/amenities", label: "Amenities" },
  { href: "/history", label: "History" },
  { href: "/get-involved", label: "Get Involved" },
  { href: "/media", label: "Media" },
]

export function isNavigationItemActive(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/"
  return pathname === href || pathname.startsWith(`${href}/`)
}
