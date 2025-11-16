import { Image } from "@unpic/react";
import { ExternalLink } from "lucide-react";

export default function Partners() {
  const partners = [
    {
      name: "Church Hill Rotary Club",
      url: "https://www.churchhillrotary.org/",
      logo: {
        src: "/ch_rotary.png",
        alt: "Church Hill Rotary Club Logo",
        width: 275,
        height: 84,
      },
      description:
        "A community service organization dedicated to improving Church Hill through volunteer projects and fundraising.",
    },
    {
      name: "Church Hill Association",
      url: "https://www.churchhill.org/",
      logo: {
        src: "/cha.png",
        alt: "Church Hill Association Logo",
        width: 201,
        height: 66,
      },
      description:
        "A civic association working to preserve the historic character and quality of life in the Church Hill neighborhood.",
    },
  ];

  return (
    <div className="px-4 lg:px-0">
      <div className="mx-auto max-w-6xl">
        <div className="mt-10 grid grid-cols-1 gap-10 md:grid-cols-2 lg:gap-14">
          {partners.map((partner) => (
            <a
              key={partner.name}
              href={partner.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative overflow-hidden rounded-2xl border border-accent-600/20 bg-gradient-to-br from-grey-100/10 to-grey-100/50 p-8 shadow-sm transition-all duration-300 hover:shadow-md lg:p-12 dark:border-accent-500/20 dark:from-primary-900 dark:to-primary-900/80"
            >
              <div className="relative space-y-6">
                {/* Logo */}
                <div className="flex items-center justify-center rounded-xl bg-white p-6 shadow-sm transition-transform duration-300 group-hover:scale-105 dark:bg-grey-800">
                  <Image
                    width={partner.logo.width}
                    height={partner.logo.height}
                    src={partner.logo.src}
                    alt={partner.logo.alt}
                    className="mx-auto max-w-48"
                  />
                </div>

                {/* Partner Name with External Link Icon */}
                <div className="flex items-center justify-center gap-2">
                  <h3 className="font-display text-xl text-grey-900 transition-colors group-hover:text-accent-700 md:text-2xl dark:text-grey-100 dark:group-hover:text-accent-400">
                    {partner.name}
                  </h3>
                  <ExternalLink className="h-5 w-5 stroke-accent-600 opacity-0 transition-opacity group-hover:opacity-100 dark:stroke-accent-400" />
                </div>

                {/* Description */}
                <p className="text-center font-body text-sm leading-relaxed text-grey-700 md:text-base dark:text-grey-300">
                  {partner.description}
                </p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
