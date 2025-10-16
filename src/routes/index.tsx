import Event from "@/components/Event/event";
import GetInvolved from "@/components/GetInvolved/get-involved";
import Hero from "@/components/Hero/hero";
import Partners from "@/components/Partners/partners";
import Quote from "@/components/Quote/quote";
import Vision from "@/components/Vision/vision";
import { events } from "@/data/events";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: Home,
  head: () => ({
    meta: [
      {
        title: "Home | Chimborazo Park Conservancy",
      },
      {
        name: "description",
        content:
          "The Chimborazo Park Conservancy preserves and enhances this Church Hill landmark through community stewardship. Join us in restoring Richmond's historic park.",
      },
      {
        property: "og:title",
        content: "Chimborazo Park Conservancy | Preserving Richmond's Historic Park",
      },
      {
        property: "og:description",
        content:
          "A 501(c)(3) non-profit dedicated to preserving and enhancing Chimborazo Park through restoration, recreation, connection, and preservation of this Church Hill landmark.",
      },
      {
        property: "og:type",
        content: "website",
      },
      {
        property: "og:url",
        content: "https://chimboparkconservancy.org",
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
        content: "Chimborazo Park Conservancy | Preserving Richmond's Historic Park",
      },
      {
        name: "twitter:description",
        content:
          "A 501(c)(3) non-profit dedicated to preserving and enhancing Chimborazo Park through restoration, recreation, connection, and preservation.",
      },
      {
        name: "twitter:image",
        content: "https://chimboparkconservancy.org/bike_sunset.webp",
      },
    ],
    links: [
      {
        rel: "canonical",
        href: "https://chimboparkconservancy.org",
      },
      {
        rel: "preload",
        as: "image",
        href: "/bike_sunset.webp",
        fetchpriority: "high",
      },
    ],
  }),
});

// Donation buttons
// Partner Callout
//  - Church Hill Rotary Club
//  - Church Hill Association
//  - The Park homepage section

// const tickerImgs = [
// 	"/volunteers.webp",
// 	"/roundhouse_evening.webp",
// 	"/chimbo_sign.webp",
// 	"/grove_cleanup.webp",
// 	"/sign_cleanup.webp",
// ];

function Home() {
  return (
    <div className="space-y-24 pb-24">
      <Hero />
      <div className="-mt-24 space-y-24 bg-grey-50 px-4 py-24 lg:px-0">
        <div className="mx-auto max-w-6xl space-y-6">
          <h2 className="font-display text-xl text-green-800 md:text-2xl">Our Mission</h2>
          <p className="max-w-4xl font-body text-2xl leading-tight font-medium text-grey-900 md:text-3xl">
            The Chimborazo Park Conservancy and Friends of Chimborazo Park preserve and enhance this
            Church Hill landmark through community stewardship.
          </p>
          <p className="mt-4 max-w-4xl font-body text-grey-800 md:text-lg">
            Established in 2023 as a 501(c)(3) non-profit, we formed to continue essential park
            support after the dissolution of Enrichmond. Since then, our volunteers and partners
            have contributed generous donations, grants, and countless hours to build a sustainable
            foundation for the park's future.
          </p>
          {/*<div className="grid grid-cols-4 gap-6 mt-14">
						{tickerImgs.map((src) => (
							<div
								key={src}
								className="relative rounded-xl overflow-hidden w-full aspect-[4/3]"
							>
								<img
									src={src}
									alt="Volunteers"
									className="absolute inset-0 object-cover w-full h-full"
								/>
								<div className="absolute z-10 inset-0 bg-green-700/20"></div>
							</div>
						))}
					</div>*/}
        </div>
        <div className="mx-auto max-w-6xl space-y-6">
          <h2 className="font-display text-xl text-green-800 md:text-2xl">Our Vision</h2>
          <div className="grid grid-cols-1 gap-10 md:grid-cols-2 md:gap-14">
            <Vision
              title="Restoration"
              icon="leafy-green"
              description="Preserving Chimborazo's historic character through careful
						reconstruction and repair of the park's unique heritage elements."
            />
            <Vision
              contentPosition="left"
              title="Recreation"
              icon="trees"
              description="Providing vibrant play spaces, natural areas, and a dog park where neighbors of all ages—and their pets—can gather and stay active."
            />
            <Vision
              title="Connection"
              icon="heart-handshake"
              description="Building an inclusive, welcoming park through volunteer stewardship and partnerships that strengthen our Church Hill neighborhood."
            />
            <Vision
              title="Preservation"
              icon="book-open-text"
              contentPosition="left"
              description="Honoring all chapters of Chimborazo's rich history and ensuring its complete story is shared and understood by future generations."
            />
          </div>
        </div>
      </div>
      <div>
        <div className="mx-auto max-w-6xl space-y-6 px-4 md:px-0">
          <h2 className="font-display text-xl text-green-800 md:text-2xl">The Park</h2>
          <p className="text-gray-800 font-body md:text-lg">
            Chimborazo Hill's story reaches back centuries—from the indigenous Powhatan people to
            its pivotal role in the Civil War. In 1874, as Richmond rebuilt, the city transformed
            this storied site into a public park for all residents to enjoy.
          </p>
          {/*<div className="mx-auto w-56 overflow-hidden rounded-xl border border-grey-800 bg-grey-50">
            <img src="/cutshaw_wilfred.webp" alt="Wilfred Cutshaw" className="h-auto w-full" />
            <p className="p-2 font-body text-xs font-medium text-grey-800">Wilfred Cutshaw</p>
          </div>*/}
          <p className="text-gray-800 font-body md:text-lg">
            City engineer Wilfred Cutshaw spent decades in the late 1800s designing winding cobbled
            carriage roads that embraced the steep terrain, revealing breathtaking vistas at every
            turn. These paths connected Church Hill with the traditionally African American Fulton
            neighborhood below, creating vital links between communities.
          </p>
          <p className="text-gray-800 font-body md:text-lg">
            By the turn of the 20th century, Chimborazo had become Richmond's beloved suburban
            retreat. Visitors arrived by streetcar to enjoy the bandstand, refreshment pavilion, and
            sweeping 180-degree views of the James River and downtown—a golden era that lasted
            through World War II.
          </p>
          <p className="text-gray-800 font-body md:text-lg">
            Today, the park includes scenic trails, a dog park, the historic Round House, a picnic
            gazebo, and an eight-foot Statue of Liberty replica erected by Boy Scouts in the 1950s.
            But time and reduced funding have taken their toll—many of the park's original and
            historic features have fallen into disrepair.
          </p>
          <p className="text-gray-800 font-body md:text-lg">
            <strong className="font-semibold">We're changing that.</strong> The Chimborazo Park
            Conservancy is restoring, repairing, and enhancing this treasured greenspace to ensure
            it remains beautiful, safe, and inclusive for generations to come.
          </p>
        </div>
      </div>
      <div>
        <GetInvolved />
      </div>
      <div className="bg-grey-50 px-4 py-24 md:px-0">
        <div className="mx-auto max-w-6xl">
          <h2 className="font-display text-xl text-green-800 md:text-2xl">Events</h2>
          <div className="mt-10 grid grid-cols-1 gap-14 md:grid-cols-2">
            {events
              .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
              .map((event) => (
                <Event key={`event-${event.id}`} {...event} />
              ))}
          </div>
        </div>
      </div>
      <div>
        <Partners />
      </div>
      <Quote />
    </div>
  );
}
