import { FacebookIcon } from "@/components/FacebookIcon/facebook-icon";
import { InstagramIcon } from "@/components/InstagramIcon/instagram-icon";
import { useSiteSettings } from "@/hooks/useSiteSettings";

const DEFAULT_FACEBOOK_URL = "https://www.facebook.com/friendsofchimborazopark";
const DEFAULT_INSTAGRAM_URL = "https://www.instagram.com/friendsofchimborazopark/";

interface SocialLinksProps {
  /** Container className for the wrapping div */
  className?: string;
  /** className applied to each icon SVG */
  iconClassName?: string;
  /** className applied to each anchor element */
  linkClassName?: string;
}

/**
 * Reusable social media links component.
 *
 * Renders Facebook and Instagram links using URLs from site settings (with
 * fallback defaults). Ensures consistent aria-labels with "(opens in new
 * window)" suffix across all usages.
 *
 * @example
 * ```tsx
 * <SocialLinks
 *   className="flex gap-3"
 *   iconClassName="h-6 w-6 fill-grey-700 dark:fill-primary-400"
 *   linkClassName="transition-transform active:scale-90"
 * />
 * ```
 */
export function SocialLinks({
  className = "flex gap-3",
  iconClassName = "h-6 w-6",
  linkClassName,
}: SocialLinksProps) {
  const { data: siteSettings } = useSiteSettings();

  const links = [
    {
      name: "Facebook",
      url: siteSettings?.socialMedia?.facebook || DEFAULT_FACEBOOK_URL,
      Icon: FacebookIcon,
    },
    {
      name: "Instagram",
      url: siteSettings?.socialMedia?.instagram || DEFAULT_INSTAGRAM_URL,
      Icon: InstagramIcon,
    },
  ];

  return (
    <div className={className}>
      {links.map(({ name, url, Icon }) => (
        <a
          key={name}
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Follow us on ${name} (opens in new window)`}
          className={linkClassName}
        >
          <Icon className={iconClassName} />
        </a>
      ))}
    </div>
  );
}
