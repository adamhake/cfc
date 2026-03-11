import { describe, expect, it } from "vitest"
import {
  formatTitle,
  generateArticleStructuredData,
  generateBreadcrumbStructuredData,
  generateEventStructuredData,
  generateFAQStructuredData,
  generateItemListStructuredData,
  generateLinkTags,
  generateMetaTags,
  generateOrganizationStructuredData,
  generateParkStructuredData,
  SITE_CONFIG,
} from "./seo"

describe("formatTitle", () => {
  it("returns site name when no page title provided", () => {
    expect(formatTitle()).toBe("Chimborazo Park Conservancy")
    expect(formatTitle(undefined)).toBe("Chimborazo Park Conservancy")
  })

  it("formats page title with site name suffix", () => {
    expect(formatTitle("About")).toBe("About | Chimborazo Park Conservancy")
  })

  it("returns site name for empty string", () => {
    expect(formatTitle("")).toBe("Chimborazo Park Conservancy")
  })
})

describe("generateMetaTags", () => {
  it("generates basic meta tags with defaults", () => {
    const tags = generateMetaTags({})
    const titles = tags.filter((t) => t.title)
    expect(titles[0].title).toBe(SITE_CONFIG.name)

    const ogType = tags.find((t) => t.property === "og:type")
    expect(ogType?.content).toBe("website")
  })

  it("includes noIndex robots tag when specified", () => {
    const tags = generateMetaTags({ noIndex: true })
    const robots = tags.find((t) => t.name === "robots")
    expect(robots?.content).toBe("noindex, nofollow")
  })

  it("excludes robots tag when noIndex is false", () => {
    const tags = generateMetaTags({ noIndex: false })
    const robots = tags.find((t) => t.name === "robots")
    expect(robots).toBeUndefined()
  })

  it("generates article-specific OG tags", () => {
    const tags = generateMetaTags({
      type: "article",
      publishedTime: "2025-01-15T00:00:00Z",
      author: "Jane Doe",
      section: "Events",
      tags: ["park", "community"],
    })

    const published = tags.find((t) => t.property === "article:published_time")
    expect(published?.content).toBe("2025-01-15T00:00:00Z")

    const author = tags.find((t) => t.property === "article:author")
    expect(author?.content).toBe("Jane Doe")

    const articleTags = tags.filter((t) => t.property === "article:tag")
    expect(articleTags).toHaveLength(2)
  })

  it("includes Twitter card tags", () => {
    const tags = generateMetaTags({ title: "Test" })
    const twitterCard = tags.find((t) => t.name === "twitter:card")
    expect(twitterCard?.content).toBe("summary_large_image")
  })

  it("resolves relative image URLs to absolute", () => {
    const tags = generateMetaTags({ image: { url: "/test.webp" } })
    const ogImage = tags.find((t) => t.property === "og:image")
    expect(ogImage?.content).toBe(`${SITE_CONFIG.url}/test.webp`)
  })

  it("preserves absolute image URLs", () => {
    const tags = generateMetaTags({ image: { url: "https://cdn.example.com/image.jpg" } })
    const ogImage = tags.find((t) => t.property === "og:image")
    expect(ogImage?.content).toBe("https://cdn.example.com/image.jpg")
  })

  it("includes image dimensions when provided", () => {
    const tags = generateMetaTags({
      image: { url: "/test.webp", width: 1200, height: 630, alt: "Test" },
    })
    const width = tags.find((t) => t.property === "og:image:width")
    const height = tags.find((t) => t.property === "og:image:height")
    const alt = tags.find((t) => t.property === "og:image:alt")
    expect(width?.content).toBe("1200")
    expect(height?.content).toBe("630")
    expect(alt?.content).toBe("Test")
  })
})

describe("generateLinkTags", () => {
  it("generates canonical link", () => {
    const links = generateLinkTags({ canonical: "https://example.com/about" })
    expect(links[0]).toEqual({ rel: "canonical", href: "https://example.com/about" })
  })

  it("generates preload link with priority", () => {
    const links = generateLinkTags({ preloadImage: "/hero.webp", preloadImagePriority: "high" })
    expect(links[0]).toEqual({
      rel: "preload",
      as: "image",
      href: "/hero.webp",
      fetchPriority: "high",
    })
  })

  it("returns empty array when no config", () => {
    expect(generateLinkTags({})).toEqual([])
  })
})

describe("generateArticleStructuredData", () => {
  it("generates valid schema.org Article", () => {
    const data = generateArticleStructuredData({
      headline: "Spring Cleanup",
      description: "Annual park cleanup event",
      image: "/cleanup.webp",
      datePublished: "2025-03-15",
    })

    expect(data["@context"]).toBe("https://schema.org")
    expect(data["@type"]).toBe("Article")
    expect(data.headline).toBe("Spring Cleanup")
    expect(data.dateModified).toBe("2025-03-15")
    expect(data.author["@type"]).toBe("Organization")
  })

  it("uses custom author when provided", () => {
    const data = generateArticleStructuredData({
      headline: "Test",
      description: "Test",
      image: "/test.webp",
      datePublished: "2025-01-01",
      author: { name: "John", url: "https://example.com" },
    })

    expect(data.author["@type"]).toBe("Person")
    expect(data.author.name).toBe("John")
  })
})

describe("generateEventStructuredData", () => {
  it("generates valid schema.org Event", () => {
    const data = generateEventStructuredData({
      name: "Tree Planting",
      description: "Community tree planting event",
      image: "/trees.webp",
      startDate: "2025-04-22T09:00:00",
      location: { name: "Chimborazo Park" },
    })

    expect(data["@type"]).toBe("Event")
    expect(data.name).toBe("Tree Planting")
    expect(data.location["@type"]).toBe("Place")
    expect(data.organizer["@type"]).toBe("Organization")
  })

  it("includes address when provided", () => {
    const data = generateEventStructuredData({
      name: "Test",
      description: "Test",
      image: "/test.webp",
      startDate: "2025-01-01",
      location: {
        name: "Chimborazo Park",
        address: {
          streetAddress: "3215 E Broad St",
          addressLocality: "Richmond",
          addressRegion: "VA",
        },
      },
    })

    expect(data.location.address["@type"]).toBe("PostalAddress")
    expect(data.location.address.addressLocality).toBe("Richmond")
  })

  it("includes optional endDate and offers", () => {
    const data = generateEventStructuredData({
      name: "Test",
      description: "Test",
      image: "/test.webp",
      startDate: "2025-01-01",
      endDate: "2025-01-02",
      location: { name: "Park" },
      offers: { price: "0", priceCurrency: "USD", availability: "InStock" },
    })

    expect(data.endDate).toBe("2025-01-02")
    expect(data.offers["@type"]).toBe("Offer")
  })
})

describe("generateOrganizationStructuredData", () => {
  it("generates valid NGO structured data", () => {
    const data = generateOrganizationStructuredData()
    expect(data["@type"]).toBe("NGO")
    expect(data.name).toBe(SITE_CONFIG.name)
    expect(data.sameAs).toEqual(SITE_CONFIG.socialProfiles)
    expect(data.address.addressLocality).toBe("Richmond")
  })

  it("includes geo coordinates", () => {
    const data = generateOrganizationStructuredData()
    expect(data.geo["@type"]).toBe("GeoCoordinates")
    expect(data.geo.latitude).toBe(37.5268)
    expect(data.geo.longitude).toBe(-77.4105)
  })

  it("uses ISO date format for foundingDate", () => {
    const data = generateOrganizationStructuredData()
    expect(data.foundingDate).toBe("2023-01-01")
  })

  it("includes full postal address", () => {
    const data = generateOrganizationStructuredData()
    expect(data.address.streetAddress).toBe("3215 E Broad St")
    expect(data.address.postalCode).toBe("23223")
  })
})

describe("generateParkStructuredData", () => {
  it("generates valid Park structured data", () => {
    const data = generateParkStructuredData()
    expect(data["@context"]).toBe("https://schema.org")
    expect(data["@type"]).toBe("Park")
    expect(data.name).toBe("Chimborazo Park")
    expect(data.isAccessibleForFree).toBe(true)
    expect(data.publicAccess).toBe(true)
  })

  it("includes geo coordinates and address", () => {
    const data = generateParkStructuredData()
    expect(data.geo["@type"]).toBe("GeoCoordinates")
    expect(data.geo.latitude).toBe(37.5268)
    expect(data.address.streetAddress).toBe("3215 E Broad St")
    expect(data.address.addressLocality).toBe("Richmond")
  })

  it("includes opening hours specification", () => {
    const data = generateParkStructuredData()
    expect(data.openingHoursSpecification["@type"]).toBe("OpeningHoursSpecification")
    expect(data.openingHoursSpecification.dayOfWeek).toHaveLength(7)
  })
})

describe("generateItemListStructuredData", () => {
  it("generates valid ItemList structured data", () => {
    const data = generateItemListStructuredData([
      { name: "Event 1", url: "https://example.com/events/1" },
      { name: "Event 2", url: "https://example.com/events/2" },
    ])

    expect(data["@context"]).toBe("https://schema.org")
    expect(data["@type"]).toBe("ItemList")
    expect(data.itemListElement).toHaveLength(2)
    expect(data.itemListElement[0].position).toBe(1)
    expect(data.itemListElement[1].position).toBe(2)
    expect(data.itemListElement[0].name).toBe("Event 1")
  })

  it("uses custom position when provided", () => {
    const data = generateItemListStructuredData([
      { name: "Item", url: "https://example.com/item", position: 5 },
    ])
    expect(data.itemListElement[0].position).toBe(5)
  })
})

describe("generateBreadcrumbStructuredData", () => {
  it("generates ordered breadcrumb list", () => {
    const data = generateBreadcrumbStructuredData([
      { name: "Home", url: "https://example.com" },
      { name: "Events", url: "https://example.com/events" },
    ])

    expect(data["@type"]).toBe("BreadcrumbList")
    expect(data.itemListElement).toHaveLength(2)
    expect(data.itemListElement[0].position).toBe(1)
    expect(data.itemListElement[1].position).toBe(2)
  })
})

describe("generateFAQStructuredData", () => {
  it("generates valid FAQPage structured data", () => {
    const data = generateFAQStructuredData([
      { question: "What is Chimborazo Park?", answer: "A historic park in Richmond, VA." },
    ])

    expect(data["@type"]).toBe("FAQPage")
    expect(data.mainEntity[0]["@type"]).toBe("Question")
    expect(data.mainEntity[0].acceptedAnswer["@type"]).toBe("Answer")
  })
})
