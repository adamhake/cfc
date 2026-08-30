import { describe, expect, it } from "vitest"
import { getActiveSiteAlert } from "./site-alert"

const now = new Date("2026-08-30T16:00:00.000Z")

describe("getActiveSiteAlert", () => {
  it("returns a concise active alert", () => {
    expect(
      getActiveSiteAlert(
        {
          enabled: true,
          label: " Park access notice ",
          message: " Road access is temporarily closed. ",
        },
        now,
      ),
    ).toEqual({
      label: "Park access notice",
      message: "Road access is temporarily closed.",
    })
  })

  it("hides disabled or empty alerts", () => {
    expect(getActiveSiteAlert({ enabled: false, message: "Notice" }, now)).toBeNull()
    expect(getActiveSiteAlert({ enabled: true, message: "  " }, now)).toBeNull()
  })

  it("accepts formatted portable text messages", () => {
    const message = [
      {
        _key: "block-1",
        _type: "block" as const,
        children: [
          {
            _key: "span-1",
            _type: "span" as const,
            marks: ["strong"],
            text: "Important notice",
          },
        ],
        markDefs: [],
        style: "normal",
      },
    ]

    expect(getActiveSiteAlert({ enabled: true, message }, now)?.message).toEqual(message)
  })

  it("honors optional start and expiration boundaries", () => {
    const scheduledAlert = {
      enabled: true,
      message: "Scheduled notice",
      startsAt: "2026-08-31T04:00:00.000Z",
      expiresAt: "2026-09-05T04:00:00.000Z",
    }

    expect(getActiveSiteAlert(scheduledAlert, now)).toBeNull()
    expect(getActiveSiteAlert(scheduledAlert, new Date("2026-08-31T04:00:00.000Z"))).toEqual({
      label: "Park notice",
      message: "Scheduled notice",
    })
    expect(getActiveSiteAlert(scheduledAlert, new Date("2026-09-05T04:00:00.000Z"))).toBeNull()
  })

  it("fails closed when a configured boundary is invalid", () => {
    expect(
      getActiveSiteAlert({ enabled: true, message: "Notice", expiresAt: "not-a-date" }, now),
    ).toBeNull()
  })
})
