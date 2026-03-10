import { FacebookIcon } from "@/components/FacebookIcon/facebook-icon";
import { InstagramIcon } from "@/components/InstagramIcon/instagram-icon";

const DEFAULT_FACEBOOK_URL = "https://www.facebook.com/friendsofchimborazopark";
const DEFAULT_INSTAGRAM_URL = "https://www.instagram.com/friendsofchimborazopark/";

interface SocialLinksProps {
  /** Container className for the wrapping div */
  className?: string;
  /** className applied to each icon SVG */
  iconClassName?: string;
  /** className applied to each anchor element */
  linkClassName?: string;
  /** Facebook URL override (from site settings) */
  facebookUrl?: string;
  /** Instagram URL override (from site settings) */
  instagramUrl?: string;
}

/**
 * Reusable social media links component.
 *
 * Renders Facebook and Instagram links. Accepts URLs as props (fetched
 * server-side) with fallback defaults.
 */
export function SocialLinks({
  className = "flex gap-3",
  iconClassName = "h-6 w-6",
  linkClassName,
  facebookUrl,
  instagramUrl,
}: SocialLinksProps) {
  const links = [
    {
      name: "Facebook",
      url: facebookUrl || DEFAULT_FACEBOOK_URL,
      Icon: FacebookIcon,
    },
    {
      name: "Instagram",
      url: instagramUrl || DEFAULT_INSTAGRAM_URL,
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
