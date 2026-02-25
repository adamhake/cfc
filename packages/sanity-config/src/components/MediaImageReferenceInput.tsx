import { Card, Flex, Grid, Stack, Text } from "@sanity/ui"
import { Reference, SanityDocument } from "@sanity/types"
import { set, unset } from "sanity"
import { ObjectInputProps, useClient } from "sanity"
import { useCallback, useEffect, useMemo, useState } from "react"
import imageUrlBuilder from "@sanity/image-url"

interface MediaImageDocument extends SanityDocument {
  _type: "mediaImage"
  title: string
  image: {
    asset: {
      _ref: string
    }
    alt?: string
  }
  category?: string
}

export function MediaImageReferenceInput(props: ObjectInputProps) {
  const { value, onChange } = props
  const client = useClient({ apiVersion: "2024-01-01" })
  const [mediaImages, setMediaImages] = useState<MediaImageDocument[]>([])
  const [loading, setLoading] = useState(true)

  const selectedRef = (value as Reference)?._ref

  const builder = useMemo(() => imageUrlBuilder(client), [client])

  useEffect(() => {
    const fetchMediaImages = async () => {
      try {
        const query = `*[_type == "mediaImage" && !(_id in path('drafts.**'))] | order(uploadedAt desc) {
          _id,
          title,
          image,
          category
        }`
        const results = await client.fetch<MediaImageDocument[]>(query)
        setMediaImages(results)
      } catch (error) {
        console.error("Error fetching media images:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchMediaImages()
  }, [client])

  const handleSelect = useCallback(
    (imageId: string) => {
      if (imageId === selectedRef) {
        // Deselect if clicking the same image
        onChange(unset())
      } else {
        onChange(
          set({
            _type: "reference",
            _ref: imageId,
          })
        )
      }
    },
    [onChange, selectedRef]
  )

  if (loading) {
    return (
      <Card padding={3}>
        <Text>Loading media images...</Text>
      </Card>
    )
  }

  return (
    <Stack space={3}>
      <Text size={1} muted>
        Select a media image for the background
      </Text>
      <Grid columns={[2, 3, 4]} gap={3}>
        {mediaImages.map((image) => {
          const isSelected = image._id === selectedRef
          const assetRef = image.image?.asset?._ref
          const imageUrl = assetRef
            ? builder
                .image({ _type: "image", asset: { _ref: assetRef } })
                .width(400)
                .url()
            : undefined

          return (
            <Card
              key={image._id}
              padding={2}
              radius={2}
              shadow={isSelected ? 2 : 1}
              tone={isSelected ? "primary" : "default"}
              style={{
                cursor: "pointer",
                border: isSelected
                  ? "2px solid var(--card-focus-ring-color)"
                  : "2px solid transparent",
              }}
              onClick={() => handleSelect(image._id)}
            >
              <Stack space={2}>
                <Card
                  style={{
                    aspectRatio: "16/9",
                    overflow: "hidden",
                    position: "relative",
                    backgroundColor: "var(--card-muted-fg-color)",
                  }}
                  radius={2}
                >
                  {imageUrl && (
                    <img
                      src={imageUrl}
                      alt={image.image?.alt || image.title}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  )}
                </Card>
                <Flex direction="column" gap={1}>
                  <Text size={1} weight="semibold" style={{ lineHeight: 1.2 }}>
                    {image.title}
                  </Text>
                  {image.category && (
                    <Text size={0} muted>
                      {image.category}
                    </Text>
                  )}
                </Flex>
              </Stack>
            </Card>
          )
        })}
      </Grid>
    </Stack>
  )
}
