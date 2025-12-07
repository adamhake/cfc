import AmenityCard from "@/components/AmenityCard/amenity-card";
import { Button } from "@/components/Button/button";
import Container from "@/components/Container/container";
import Event from "@/components/Event/event";
import EventStatusChip from "@/components/EventStatusChip/event-status-chip";
import GetInvolved from "@/components/GetInvolved/get-involved";
import Hero from "@/components/Hero/hero";
import ImageCard from "@/components/ImageCard/image-card";
import ImageCarousel from "@/components/ImageCarousel/image-carousel";
import ImageGallery from "@/components/ImageGallery/image-gallery";
import InfoCard from "@/components/InfoCard/info-card";
import PageHero from "@/components/PageHero/page-hero";
import { PaletteSwitcher } from "@/components/PaletteSwitcher/palette-switcher";
import Partners from "@/components/Partners/partners";
import Quote from "@/components/Quote/quote";
import SectionHeader from "@/components/SectionHeader/section-header";
import SupportOption from "@/components/SupportOption/support-option";
import { ThemeToggle } from "@/components/ThemeToggle/theme-toggle";
import { usePalette } from "@/hooks/usePalette";
import { PALETTE_METADATA } from "@/utils/palette";
import { createFileRoute } from "@tanstack/react-router";
import { Building2, Clock, Dog, Heart, Users } from "lucide-react";

export const Route = createFileRoute("/components")({
  component: ComponentPlayground,
});

function ComponentPlayground() {
  const { palette } = usePalette();
  const currentMeta = PALETTE_METADATA[palette];

  // Helper to get primary, accent, and neutral color CSS variables
  const primary = (shade: number) => `var(--color-primary-${shade})`;
  const accent = (shade: number) => `var(--color-accent-${shade})`;
  const neutral = (shade: number) => `var(--color-neutral-${shade})`;

  // Helper to get hex code from computed CSS color
  const getHexFromCSSVar = (cssVar: string): string => {
    if (typeof window === "undefined") return "";

    const div = document.createElement("div");
    div.style.color = cssVar;
    document.body.appendChild(div);
    const computed = window.getComputedStyle(div).color;
    document.body.removeChild(div);

    // Parse rgb(r, g, b) format
    const match = computed.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
    if (!match) return "";

    const r = parseInt(match[1]);
    const g = parseInt(match[2]);
    const b = parseInt(match[3]);

    return (
      "#" +
      [r, g, b]
        .map((x) => {
          const hex = x.toString(16);
          return hex.length === 1 ? "0" + hex : hex;
        })
        .join("")
    );
  };

  // Check if current palette has accent colors
  const hasAccent = currentMeta.accent !== null;

  // Sample event data for Event component
  const sampleEvent = {
    id: 999,
    title: "Spring Park Cleanup",
    slug: "spring-cleanup-2025",
    description:
      "Join us for our annual spring cleanup event to help keep Chimborazo Park beautiful.",
    date: "2025-04-15",
    time: "9:00 AM - 12:00 PM",
    location: "Main Pavilion",
    image: {
      src: "/chimbo_arial.webp",
      alt: "Aerial view of Chimborazo Park",
      width: 1600,
      height: 1200,
    },
  };

  // Sample data for imagery components
  const sampleGalleryImages = [
    {
      src: "/chimbo_arial.webp",
      alt: "Aerial view of Chimborazo Park",
      caption: "Bird's eye view of the historic park grounds",
      width: 1600,
      height: 1200,
    },
    {
      src: "/bike_sunset.webp",
      alt: "Cycling at sunset",
      caption: "Evening recreation on park trails",
      width: 2000,
      height: 1262,
    },
    {
      src: "/oaks.webp",
      alt: "Historic oak trees",
      caption: "Majestic oak trees provide shade and beauty",
      width: 1600,
      height: 1200,
    },
    {
      src: "/chimob_gaz.webp",
      alt: "Park gazebo",
      caption: "Gazebo gathering space",
      width: 1600,
      height: 1200,
    },
    {
      src: "/chimbo_circle.webp",
      alt: "Park circle area",
      caption: "Historic circle monument",
      width: 1600,
      height: 1200,
    },
    {
      src: "/rock_sunset.webp",
      alt: "Sunset view from the park",
      caption: "Stunning Richmond skyline views",
      width: 2000,
      height: 1262,
    },
  ];

  const sampleCarouselImages = [
    {
      src: "/chimbo_hero_adj.webp",
      alt: "Chimborazo Park vista",
      title: "Discover Richmond's Hidden Gem",
      caption: "33 acres of natural beauty and history in Church Hill",
      width: 2000,
      height: 1333,
    },
    {
      src: "/bike_sunset.webp",
      alt: "Cycling at sunset",
      title: "Active Recreation",
      caption: "Miles of trails for walking, running, and cycling",
      width: 2000,
      height: 1262,
    },
    {
      src: "/oaks.webp",
      alt: "Historic oak trees",
      title: "Natural Heritage",
      caption: "Centuries-old trees provide shade and tranquility",
      width: 1600,
      height: 1200,
    },
  ];

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="mb-4 font-display text-4xl font-bold text-grey-900 sm:text-5xl dark:text-grey-100">
            Component Library
          </h1>
          <p className="mb-6 font-body text-lg text-grey-600 dark:text-grey-300">
            Explore and test UI components for the Chimborazo Park Conservancy website
          </p>

          {/* Controls */}
          <div className="flex flex-wrap items-center justify-center gap-4">
            <PaletteSwitcher variant="button" showLabel={true} />
            <ThemeToggle variant="button" showLabel={true} />
          </div>

          {/* Current Palette Info */}
          <div className="mt-6 rounded-2xl border border-grey-200 bg-white p-6 dark:border-(--color-primary-600) dark:bg-(--color-primary-900)">
            <div className="font-body text-sm font-semibold text-grey-600 uppercase dark:text-grey-400">
              Active Palette
            </div>
            <div className="mt-2 font-display text-2xl font-bold text-grey-900 dark:text-grey-100">
              {currentMeta.name}
            </div>
            <div className="mt-2 font-body text-sm text-grey-600 dark:text-grey-300">
              Primary: {currentMeta.primary}
              {hasAccent && ` • Accent: ${currentMeta.accent}`}
            </div>
          </div>
        </div>

        <div className="space-y-16">
          {/* Buttons */}
          <section>
            <h2 className="mb-6 font-display text-2xl font-bold text-grey-900 dark:text-grey-100">
              Buttons
            </h2>
            <div className="rounded-2xl border border-grey-200 bg-white p-8 dark:border-(--color-primary-600) dark:bg-(--color-primary-900)">
              <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                <div>
                  <div className="mb-3 font-body text-xs font-semibold text-grey-600 uppercase dark:text-grey-400">
                    Primary Buttons
                  </div>
                  <div className="space-y-3">
                    <Button variant="primary" size="standard">
                      Donate Now
                    </Button>
                    <Button variant="primary" size="small">
                      Learn More
                    </Button>
                  </div>
                </div>
                <div>
                  <div className="mb-3 font-body text-xs font-semibold text-grey-600 uppercase dark:text-grey-400">
                    Secondary Buttons
                  </div>
                  <div className="space-y-3">
                    <Button variant="secondary" size="standard">
                      Get Involved
                    </Button>
                    <Button variant="secondary" size="small">
                      View Events
                    </Button>
                  </div>
                </div>
                <div>
                  <div className="mb-3 font-body text-xs font-semibold text-grey-600 uppercase dark:text-grey-400">
                    Outline Buttons
                  </div>
                  <div className="space-y-3">
                    <Button variant="outline" size="standard">
                      Learn More
                    </Button>
                    <Button variant="outline" size="small">
                      Details
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Layout Components */}
          <section>
            <h2 className="mb-6 font-display text-2xl font-bold text-grey-900 dark:text-grey-100">
              Layout Components
            </h2>

            {/* PageHero */}
            <div className="mb-8">
              <h3 className="mb-4 font-body text-sm font-semibold text-grey-600 uppercase dark:text-grey-400">
                PageHero
              </h3>
              <div className="overflow-hidden rounded-2xl border border-grey-200 dark:border-grey-700">
                <PageHero
                  title="Component Preview"
                  subtitle="Reusable hero component for page headers"
                  imageSrc="/bike_sunset.webp"
                  imageAlt="Preview"
                  imageWidth={2000}
                  imageHeight={1262}
                  height="small"
                >
                  <div className="mx-auto mt-6 flex max-w-md items-center gap-4 rounded-lg bg-white/10 px-4 py-2 font-body text-sm text-white backdrop-blur-sm">
                    <Clock className="h-4 w-4" />
                    <span>Optional children content</span>
                  </div>
                </PageHero>
              </div>
            </div>

            {/* SectionHeader & Container */}
            <div className="mb-8 rounded-2xl border border-grey-200 bg-white p-8 dark:border-grey-700 dark:bg-grey-800">
              <h3 className="mb-4 font-body text-sm font-semibold text-grey-600 uppercase dark:text-grey-400">
                SectionHeader & Container
              </h3>
              <Container
                spacing="md"
                className="border-2 border-dashed border-grey-300 p-4 dark:border-grey-600"
              >
                <SectionHeader title="Section Title" size="large" />
                <p className="font-body text-grey-700 dark:text-grey-200">
                  Container provides consistent max-width and spacing. SectionHeader ensures uniform
                  section titles.
                </p>
                <SectionHeader title="Smaller Section" size="medium" level="h3" />
                <p className="font-body text-grey-700 dark:text-grey-200">
                  Both components support dark mode and are fully customizable.
                </p>
              </Container>
            </div>
          </section>

          {/* Card Components */}
          <section>
            <h2 className="mb-6 font-display text-2xl font-bold text-grey-900 dark:text-grey-100">
              Card Components
            </h2>
            <div className="space-y-8">
              {/* Event Card */}
              <div>
                <h3 className="mb-4 font-body text-sm font-semibold text-grey-600 uppercase dark:text-grey-400">
                  Event Card
                </h3>
                <div className="max-w-md">
                  <Event {...sampleEvent} />
                </div>
              </div>

              {/* Event Status Chip */}
              <div>
                <h3 className="mb-4 font-body text-sm font-semibold text-grey-600 uppercase dark:text-grey-400">
                  Event Status Chip
                </h3>
                <div className="flex flex-wrap gap-3">
                  <EventStatusChip isPast={false} />
                  <EventStatusChip isPast={true} />
                </div>
              </div>

              {/* Content Cards */}
              <div>
                <h3 className="mb-4 font-body text-sm font-semibold text-grey-600 uppercase dark:text-grey-400">
                  Content Cards
                </h3>
                <div className="grid gap-6 lg:grid-cols-2">
                  <AmenityCard
                    title="Playground"
                    icon={<Building2 />}
                    description="Modern playground equipment for children of all ages with accessible features."
                    details={["Swings and slides", "Climbing structures", "Accessible equipment"]}
                    link={{
                      text: "Learn More",
                      url: "#",
                    }}
                  />

                  <div className="space-y-4">
                    <InfoCard
                      icon={<Dog className="h-6 w-6 stroke-primary-700 dark:stroke-primary-400" />}
                      title="Dog-Friendly Areas"
                      content="Designated areas for pets with waste stations and water fountains."
                    />

                    <SupportOption
                      icon={<Heart className="h-6 w-6 stroke-white dark:stroke-primary-200" />}
                      title="Volunteer Opportunities"
                      description="Join our community events and help maintain the park's beauty."
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Feature Components */}
          <section>
            <h2 className="mb-6 font-display text-2xl font-bold text-grey-900 dark:text-grey-100">
              Feature Components
            </h2>

            {/* Hero */}
            <div className="mb-12">
              <h3 className="mb-4 font-body text-sm font-semibold text-grey-600 uppercase dark:text-grey-400">
                Hero - New Design
              </h3>
              <p className="mb-3 font-body text-xs text-grey-500 dark:text-grey-400">
                Soft gradient layers with a subtle wave divider for organic, natural flow
              </p>
              <div className="overflow-hidden rounded-2xl border border-grey-200 dark:border-grey-700">
                <Hero />
              </div>
            </div>

            {/* Quote */}
            <div className="mb-8">
              <h3 className="mb-4 font-body text-sm font-semibold text-grey-600 uppercase dark:text-grey-400">
                Quote
              </h3>
              <Quote />
            </div>

            {/* Get Involved */}
            <div className="mb-8">
              <h3 className="mb-4 font-body text-sm font-semibold text-grey-600 uppercase dark:text-grey-400">
                Get Involved
              </h3>
              <GetInvolved />
            </div>

            {/* Partners */}
            <div>
              <h3 className="mb-4 font-body text-sm font-semibold text-grey-600 uppercase dark:text-grey-400">
                Partners
              </h3>
              <Partners />
            </div>
          </section>

          {/* Imagery Components */}
          <section>
            <h2 className="mb-6 font-display text-2xl font-bold text-grey-900 dark:text-grey-100">
              Imagery Components
            </h2>

            {/* ImageCarousel */}
            <div className="mb-12">
              <h3 className="mb-4 font-body text-sm font-semibold text-grey-600 uppercase dark:text-grey-400">
                Image Carousel
              </h3>
              <p className="mb-4 font-body text-sm text-grey-600 dark:text-grey-300">
                Touch-friendly carousel with auto-play, navigation arrows, and pagination dots.
                Supports captions in overlay or below positions.
              </p>
              <div className="space-y-8">
                <div>
                  <p className="mb-3 font-body text-xs text-grey-500 dark:text-grey-400">
                    Overlay Captions (Default)
                  </p>
                  <ImageCarousel
                    images={sampleCarouselImages}
                    autoPlay={true}
                    autoPlayInterval={5000}
                    showCaptions={true}
                    captionPosition="overlay"
                    aspectRatio="16/9"
                  />
                </div>
                <div>
                  <p className="mb-3 font-body text-xs text-grey-500 dark:text-grey-400">
                    Below Captions
                  </p>
                  <ImageCarousel
                    images={sampleCarouselImages}
                    autoPlay={false}
                    showCaptions={true}
                    captionPosition="below"
                    aspectRatio="4/3"
                  />
                </div>
              </div>
            </div>

            {/* ImageGallery */}
            <div className="mb-12">
              <h3 className="mb-4 font-body text-sm font-semibold text-grey-600 uppercase dark:text-grey-400">
                Image Gallery
              </h3>
              <p className="mb-4 font-body text-sm text-grey-600 dark:text-grey-300">
                Flexible gallery component with three layout variants: grid, masonry, and staggered.
                Features hover captions with gradient overlays.
              </p>
              <div className="space-y-8">
                <div>
                  <p className="mb-3 font-body text-xs text-grey-500 dark:text-grey-400">
                    Grid Layout
                  </p>
                  <ImageGallery
                    images={sampleGalleryImages}
                    variant="grid"
                    columns={{ default: 1, sm: 2, md: 3 }}
                    showCaptions={true}
                    captionPosition="hover"
                    gap="md"
                  />
                </div>
                <div>
                  <p className="mb-3 font-body text-xs text-grey-500 dark:text-grey-400">
                    Masonry Layout
                  </p>
                  <ImageGallery
                    images={sampleGalleryImages}
                    variant="masonry"
                    showCaptions={true}
                    captionPosition="hover"
                    gap="md"
                  />
                </div>
                <div>
                  <p className="mb-3 font-body text-xs text-grey-500 dark:text-grey-400">
                    Staggered Grid Layout
                  </p>
                  <ImageGallery
                    images={sampleGalleryImages}
                    variant="staggered"
                    columns={{ default: 1, sm: 2, md: 3 }}
                    showCaptions={true}
                    captionPosition="hover"
                    gap="md"
                  />
                </div>
              </div>
            </div>

            {/* ImageCard */}
            <div className="mb-8">
              <h3 className="mb-4 font-body text-sm font-semibold text-grey-600 uppercase dark:text-grey-400">
                Image Card
              </h3>
              <p className="mb-4 font-body text-sm text-grey-600 dark:text-grey-300">
                Versatile card component combining imagery with text and CTAs. Three variants:
                overlay, caption-below, and side-by-side.
              </p>
              <div className="space-y-8">
                <div>
                  <p className="mb-3 font-body text-xs text-grey-500 dark:text-grey-400">
                    Overlay Variant
                  </p>
                  <ImageCard
                    image={{
                      src: "/chimbo_hero_adj.webp",
                      alt: "Park vista",
                      width: 2000,
                      height: 1333,
                    }}
                    title="Volunteer with Us"
                    description="Join our community of volunteers helping to preserve and enhance Chimborazo Park for future generations."
                    variant="overlay"
                    ctaText="Get Involved"
                    ctaLink="#"
                    aspectRatio="16/9"
                  />
                </div>
                <div>
                  <p className="mb-3 font-body text-xs text-grey-500 dark:text-grey-400">
                    Caption Below Variant
                  </p>
                  <ImageCard
                    image={{
                      src: "/oaks.webp",
                      alt: "Oak trees",
                      width: 1600,
                      height: 1200,
                    }}
                    title="Natural Heritage"
                    description="Our historic oak trees have stood for centuries, providing shade and beauty to the Richmond community."
                    variant="caption-below"
                    ctaText="Learn More"
                    ctaLink="#"
                    aspectRatio="4/3"
                  />
                </div>
                <div>
                  <p className="mb-3 font-body text-xs text-grey-500 dark:text-grey-400">
                    Side-by-Side Variant (Image Left)
                  </p>
                  <ImageCard
                    image={{
                      src: "/bike_sunset.webp",
                      alt: "Cycling at sunset",
                      width: 2000,
                      height: 1262,
                    }}
                    title="Active Recreation"
                    description="Explore miles of trails perfect for walking, running, and cycling while enjoying stunning views of Richmond."
                    variant="side-by-side"
                    imagePosition="left"
                    ctaText="View Amenities"
                    ctaLink="#"
                  />
                </div>
                <div>
                  <p className="mb-3 font-body text-xs text-grey-500 dark:text-grey-400">
                    Side-by-Side Variant (Image Right)
                  </p>
                  <ImageCard
                    image={{
                      src: "/chimbo_circle.webp",
                      alt: "Historic monument",
                      width: 1600,
                      height: 1200,
                    }}
                    title="Rich History"
                    description="Discover the fascinating history of Chimborazo Park, from Civil War hospital to beloved community space."
                    variant="side-by-side"
                    imagePosition="right"
                    ctaText="Explore History"
                    ctaLink="#"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Typography Section */}
          <section>
            <h2 className="mb-6 font-display text-2xl font-bold text-grey-900 dark:text-grey-100">
              Typography & Text Colors
            </h2>
            <div className="rounded-2xl border border-grey-200 bg-white p-8 dark:border-(--color-primary-600) dark:bg-(--color-primary-900)">
              <h1 className="mb-4 font-display text-4xl font-bold text-grey-900 dark:text-grey-100">
                Display Heading (H1)
              </h1>
              <h2 className="mb-4 font-display text-3xl font-bold text-grey-900 dark:text-grey-100">
                Section Heading (H2)
              </h2>
              <h3 className="mb-4 font-display text-2xl font-bold" style={{ color: primary(800) }}>
                Subsection with Brand Color (H3)
              </h3>
              <p className="mb-4 font-body text-base text-grey-800 dark:text-grey-100">
                This is body text in the primary font. Chimborazo Park is a historic 42-acre green
                space in Richmond's Church Hill neighborhood, featuring expansive views of the James
                River and downtown Richmond.
              </p>
              <p className="mb-4 font-body text-sm text-grey-600 dark:text-grey-300">
                This is smaller body text, often used for captions or secondary information. The
                park has served the community since the 19th century.
              </p>
              <a
                href="#"
                className="inline-block font-body font-semibold underline transition"
                style={{ color: primary(700) }}
              >
                This is a text link
              </a>
            </div>
          </section>

          {/* Interactive States */}
          <section>
            <h2 className="mb-6 font-display text-2xl font-bold text-grey-900 dark:text-grey-100">
              Interactive States
            </h2>
            <div className="rounded-2xl border border-grey-200 bg-white p-8 dark:border-(--color-primary-600) dark:bg-(--color-primary-900)">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    className="h-5 w-5 rounded border-grey-300 focus:ring-grey-600 dark:border-grey-600 dark:bg-grey-700"
                    defaultChecked
                  />
                  <label className="font-body text-grey-800 dark:text-grey-100">
                    Checkbox example (checked)
                  </label>
                </div>
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    className="h-5 w-5 border-grey-300 focus:ring-grey-600 dark:border-grey-600 dark:bg-grey-700"
                    defaultChecked
                  />
                  <label className="font-body text-grey-800 dark:text-grey-100">
                    Radio button example (selected)
                  </label>
                </div>
                <input
                  type="text"
                  placeholder="Text input example"
                  className="w-full rounded-lg border border-grey-300 bg-white px-4 py-2 font-body text-grey-800 focus:border-(--color-primary-600) focus:ring-2 focus:ring-(--color-primary-600)/20 focus:outline-none dark:border-grey-600 dark:bg-grey-800 dark:text-grey-100 dark:focus:border-(--color-primary-500)"
                />
                <textarea
                  placeholder="Textarea example"
                  rows={3}
                  className="w-full rounded-lg border border-grey-300 bg-white px-4 py-2 font-body text-grey-800 focus:border-(--color-primary-600) focus:ring-2 focus:ring-(--color-primary-600)/20 focus:outline-none dark:border-grey-600 dark:bg-grey-800 dark:text-grey-100 dark:focus:border-(--color-primary-500)"
                />
              </div>
            </div>
          </section>

          {/* Background Colors */}
          <section>
            <h2 className="mb-6 font-display text-2xl font-bold text-grey-900 dark:text-grey-100">
              Background Colors
            </h2>
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Light Mode Backgrounds */}
              <div>
                <h3 className="mb-4 font-body text-sm font-semibold text-grey-600 uppercase dark:text-grey-400">
                  Light Mode Backgrounds
                </h3>
                <div className="space-y-3">
                  <div
                    className="rounded-xl border p-4"
                    style={{
                      borderColor: neutral(200),
                      backgroundColor: neutral(50),
                    }}
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <span
                        className="font-body text-sm font-semibold"
                        style={{ color: neutral(700) }}
                      >
                        Page Background
                      </span>
                      <code className="font-mono text-xs" style={{ color: neutral(500) }}>
                        neutral-50
                      </code>
                    </div>
                    <p className="font-body text-xs" style={{ color: neutral(600) }}>
                      Main page/app background color
                    </p>
                  </div>

                  <div
                    className="rounded-xl border p-4"
                    style={{
                      borderColor: neutral(200),
                      backgroundColor: "white",
                    }}
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <span
                        className="font-body text-sm font-semibold"
                        style={{ color: neutral(700) }}
                      >
                        Card/Panel Background
                      </span>
                      <code className="font-mono text-xs" style={{ color: neutral(500) }}>
                        white
                      </code>
                    </div>
                    <p className="font-body text-xs" style={{ color: neutral(600) }}>
                      Cards, modals, elevated surfaces
                    </p>
                  </div>

                  <div
                    className="rounded-xl border p-4"
                    style={{
                      borderColor: primary(200),
                      backgroundColor: primary(50),
                    }}
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <span
                        className="font-body text-sm font-semibold"
                        style={{ color: primary(800) }}
                      >
                        Accent Background
                      </span>
                      <code className="font-mono text-xs" style={{ color: primary(600) }}>
                        primary-50
                      </code>
                    </div>
                    <p className="font-body text-xs" style={{ color: primary(700) }}>
                      Highlighted sections, alerts
                    </p>
                  </div>
                </div>
              </div>

              {/* Dark Mode Backgrounds */}
              <div>
                <h3 className="mb-4 font-body text-sm font-semibold text-grey-600 uppercase dark:text-grey-400">
                  Dark Mode Backgrounds
                </h3>
                <div className="space-y-3">
                  <div className="rounded-xl border p-4 dark:border-grey-700 dark:bg-grey-900">
                    <div className="mb-2 flex items-center justify-between">
                      <span className="font-body text-sm font-semibold text-grey-700 dark:text-grey-300">
                        Page Background
                      </span>
                      <code className="font-mono text-xs text-grey-500 dark:text-grey-400">
                        grey-900
                      </code>
                    </div>
                    <p className="font-body text-xs text-grey-600 dark:text-grey-400">
                      Main page/app background in dark mode
                    </p>
                  </div>

                  <div className="rounded-xl border p-4 dark:border-grey-700 dark:bg-grey-800">
                    <div className="mb-2 flex items-center justify-between">
                      <span className="font-body text-sm font-semibold text-grey-700 dark:text-grey-300">
                        Card/Panel Background
                      </span>
                      <code className="font-mono text-xs text-grey-500 dark:text-grey-400">
                        grey-800
                      </code>
                    </div>
                    <p className="font-body text-xs text-grey-600 dark:text-grey-400">
                      Cards, modals, elevated surfaces
                    </p>
                  </div>

                  <div
                    className="rounded-xl border p-4"
                    style={{
                      borderColor: primary(600),
                      backgroundColor: primary(900),
                    }}
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <span
                        className="font-body text-sm font-semibold"
                        style={{ color: primary(200) }}
                      >
                        Accent Background
                      </span>
                      <code className="font-mono text-xs" style={{ color: primary(400) }}>
                        primary-900
                      </code>
                    </div>
                    <p className="font-body text-xs" style={{ color: primary(300) }}>
                      Highlighted sections in dark mode
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Color Swatches */}
          <section>
            <h2 className="mb-6 font-display text-2xl font-bold text-grey-900 dark:text-grey-100">
              Color Swatches
            </h2>
            <div className="space-y-6">
              {/* Primary Colors */}
              <div>
                <h3 className="mb-3 font-body text-sm font-semibold text-grey-600 uppercase dark:text-grey-400">
                  Primary Scale
                </h3>
                <div className="grid grid-cols-11 gap-2">
                  {[50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950].map((shade) => {
                    const color = primary(shade);
                    const hex = getHexFromCSSVar(color);
                    return (
                      <div key={shade}>
                        <div
                          className="aspect-square w-full rounded-lg border border-grey-300 dark:border-grey-600"
                          style={{ backgroundColor: color }}
                          title={`primary-${shade} - ${hex}`}
                        />
                        <div className="mt-1 text-center font-body text-xs text-grey-600 dark:text-grey-400">
                          {shade}
                        </div>
                        <div className="text-center font-mono text-[10px] text-grey-500 dark:text-grey-500">
                          {hex}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Accent Colors - Only show if palette has accent */}
              {hasAccent && (
                <div>
                  <h3 className="mb-3 font-body text-sm font-semibold text-grey-600 uppercase dark:text-grey-400">
                    Accent Scale ({currentMeta.accent})
                  </h3>
                  <div className="grid grid-cols-11 gap-2">
                    {[50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950].map((shade) => {
                      const color = accent(shade);
                      const hex = getHexFromCSSVar(color);
                      return (
                        <div key={shade}>
                          <div
                            className="aspect-square w-full rounded-lg border border-grey-300 dark:border-grey-600"
                            style={{ backgroundColor: color }}
                            title={`accent-${shade} - ${hex}`}
                          />
                          <div className="mt-1 text-center font-body text-xs text-grey-600 dark:text-grey-400">
                            {shade}
                          </div>
                          <div className="text-center font-mono text-[10px] text-grey-500 dark:text-grey-500">
                            {hex}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Neutral Colors */}
              <div>
                <h3 className="mb-3 font-body text-sm font-semibold text-grey-600 uppercase dark:text-grey-400">
                  Neutral Scale
                </h3>
                <div className="grid grid-cols-11 gap-2">
                  {[50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950].map((shade) => {
                    const color = neutral(shade);
                    const hex = getHexFromCSSVar(color);
                    return (
                      <div key={shade}>
                        <div
                          className="aspect-square w-full rounded-lg border border-grey-300 dark:border-grey-600"
                          style={{ backgroundColor: color }}
                          title={`neutral-${shade} - ${hex}`}
                        />
                        <div className="mt-1 text-center font-body text-xs text-grey-600 dark:text-grey-400">
                          {shade}
                        </div>
                        <div className="text-center font-mono text-[10px] text-grey-500 dark:text-grey-500">
                          {hex}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </section>

          {/* Design Principles */}
          <section>
            <h2 className="mb-6 font-display text-2xl font-bold text-grey-900 dark:text-grey-100">
              Design Principles
            </h2>
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="rounded-2xl border border-grey-200 bg-white p-6 dark:border-(--color-primary-600) dark:bg-(--color-primary-900)">
                <Heart style={{ stroke: primary(700) }} className="mb-3 h-8 w-8" />
                <h3 className="mb-2 font-display text-lg font-bold text-grey-900 dark:text-grey-100">
                  Warmth & Community
                </h3>
                <p className="font-body text-sm text-grey-700 dark:text-grey-200">
                  Colors should evoke feelings of warmth, welcome, and community connection. The
                  palette should feel approachable and inviting to all neighbors.
                </p>
              </div>
              <div className="rounded-2xl border border-grey-200 bg-white p-6 dark:border-(--color-primary-600) dark:bg-(--color-primary-900)">
                <Users style={{ stroke: primary(700) }} className="mb-3 h-8 w-8" />
                <h3 className="mb-2 font-display text-lg font-bold text-grey-900 dark:text-grey-100">
                  Accessibility First
                </h3>
                <p className="font-body text-sm text-grey-700 dark:text-grey-200">
                  All color combinations must meet WCAG AA standards for contrast. We prioritize
                  readability and usability for all community members.
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
