import Container from "@/components/Container/container";
import PageHero from "@/components/PageHero/page-hero";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/donate")({
  component: Donate,
  head: () => ({
    meta: [
      {
        title: "Donate | Chimborazo Park Conservancy",
      },
      {
        name: "description",
        content:
          "Donate to Chimborazo Park Conservancy to support our ongoing restoration efforts and community events.",
      },
      {
        property: "og:title",
        content: "Donate | Chimborazo Park Conservancy",
      },
      {
        property: "og:description",
        content:
          "Donate to Chimborazo Park Conservancy to support our ongoing restoration efforts and community events.",
      },
      {
        property: "og:type",
        content: "website",
      },
      {
        property: "og:url",
        content: "https://chimboparkconservancy.org/donate",
      },
      {
        property: "og:image",
        content: "https://chimboparkconservancy.org/bike_sunset.webp",
      },
      {
        property: "og:image:width",
        content: "2000",
      },
      {
        property: "og:image:height",
        content: "1262",
      },
      {
        name: "twitter:title",
        content: "Donate | Chimborazo Park Conservancy",
      },
      {
        name: "twitter:description",
        content:
          "Donate to Chimborazo Park Conservancy to support our ongoing restoration efforts and community events.",
      },
      {
        name: "twitter:image",
        content: "https://chimboparkconservancy.org/bike_sunset.webp",
      },
    ],
    links: [
      {
        rel: "canonical",
        href: "https://chimboparkconservancy.org/donate",
      },
    ],
  }),
});

function Donate() {
  return (
    <div>
      <PageHero
        title="Support Us"
        imageSrc="/bike_sunset.webp"
        imageAlt="Chimborazo Park landscape"
        imageWidth={2000}
        imageHeight={1262}
      />
      <Container spacing="xl" className="py-24">
        <p className="font-body">
          Anim cillum veniam tempor mollit nostrud proident dolor ea enim anim cupidatat. Mollit
          aliquip non occaecat veniam deserunt exercitation ut ex qui est. Cillum cillum consequat
          aliqua. Ullamco laboris proident irure dolore officia Lorem quis est eu adipisicing
          reprehenderit. Veniam nisi reprehenderit excepteur commodo tempor mollit cillum sunt
          exercitation magna in pariatur ut dolore cupidatat. Aute nisi non Lorem dolore labore
          dolor excepteur. Sit labore nulla exercitation labore commodo ut proident deserunt quis.
        </p>
        <div style={{ position: "relative", minHeight: "600px", width: "100%" }}>
          <iframe
            title="Donation form powered by Zeffy"
            style={{
              position: "absolute",
              border: 0,
              top: 0,
              left: 0,
              bottom: 0,
              right: 0,
              width: "100%",
              height: "100%",
            }}
            src="https://www.zeffy.com/embed/donation-form/general-donation-125"
            allow="payment"
          ></iframe>
        </div>
      </Container>
    </div>
  );
}
