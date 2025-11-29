import { SparklesIcon } from "@sanity/icons"
import { useToast } from "@sanity/ui"
import { useCallback, useState } from "react"
import type { DocumentActionComponent } from "sanity"
import { useDocumentOperation } from "sanity"
import type { ImageMetadata } from "../utils/aiMetadataGenerator"

interface MediaImageAsset {
  _ref: string
  _type: string
}

interface MediaImageDocument {
  _id: string
  _type: string
  image?: {
    asset?: MediaImageAsset
    alt?: string
    caption?: string
  }
  title?: string
  category?: string
}

/**
 * Configuration options for the generate metadata action
 */
export interface GenerateMetadataActionConfig {
  /** The API URL for the metadata generation endpoint */
  apiUrl: string
}

/**
 * Factory function to create a generate metadata document action.
 * This allows the Studio to inject the API URL from its environment configuration.
 *
 * @param config - Configuration object containing the apiUrl
 * @returns A DocumentActionComponent for generating AI metadata
 *
 * @example
 * ```ts
 * import { createGenerateMetadataAction } from "@chimborazo/sanity-config"
 * import { env } from "./src/env"
 *
 * const generateMetadataAction = createGenerateMetadataAction({
 *   apiUrl: env.SANITY_STUDIO_API_URL
 * })
 * ```
 */
export const createGenerateMetadataAction = (
  config: GenerateMetadataActionConfig
): DocumentActionComponent => (props) => {
  const { type, draft, published, onComplete } = props
  const { patch } = useDocumentOperation(props.id, props.type)
  const toast = useToast()
  const [isGenerating, setIsGenerating] = useState(false)

  // Only show this action for mediaImage documents
  if (type !== "mediaImage") {
    return null
  }

  // Get the current document (draft or published)
  const doc = (draft || published) as MediaImageDocument | null

  // Check if an image has been uploaded
  const hasImage = Boolean(doc?.image?.asset?._ref)

  const handleGenerate = useCallback(async () => {
    if (!doc?.image?.asset?._ref) {
      onComplete()
      return
    }

    setIsGenerating(true)

    try {
      // Show loading toast
      toast.push({
        status: "info",
        title: "Generating metadata...",
        description: "Claude is analyzing your image",
      })

      // Construct the image URL from the asset reference
      // Format: https://cdn.sanity.io/images/{projectId}/{dataset}/{assetId}-{width}x{height}.{format}
      const assetId = doc.image.asset._ref
      // These env vars are validated at build time via T3 Env in apps/studio/src/env.ts
      const projectId = process.env.SANITY_STUDIO_PROJECT_ID
      const dataset = process.env.SANITY_STUDIO_DATASET

      if (!projectId) {
        throw new Error("SANITY_STUDIO_PROJECT_ID is not configured")
      }

      // Extract the asset details from the reference
      // Format: image-{assetId}-{width}x{height}-{format}
      const assetParts = assetId.replace("image-", "").split("-")
      const hash = assetParts[0]
      const dimensions = assetParts[1]
      const format = assetParts[2]

      const imageUrl = `https://cdn.sanity.io/images/${projectId}/${dataset}/${hash}-${dimensions}.${format}`

      // Call the TanStack Start server function to generate metadata
      // This keeps the Anthropic API key secure on the server
      // The apiUrl is injected via the factory config from the Studio's env configuration
      const apiUrl = config.apiUrl

      console.log("Calling API at:", apiUrl)
      console.log("Image URL:", imageUrl)

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ imageUrl }),
      })

      console.log("Response status:", response.status)
      console.log("Response ok:", response.ok)

      if (!response.ok) {
        let errorData: { error?: string } | undefined
        try {
          errorData = (await response.json()) as { error?: string }
        } catch {
          throw new Error(`Server error: ${response.status} ${response.statusText}`)
        }
        throw new Error(errorData?.error || `Server error: ${response.statusText}`)
      }

      const metadata = (await response.json()) as ImageMetadata
      console.log("Received metadata:", metadata)

      // Patch the document with the generated metadata
      patch.execute([
        { set: { title: metadata.title } },
        { set: { "image.alt": metadata.alt } },
        { set: { "image.caption": metadata.caption } },
        { set: { category: metadata.category } },
      ])

      // Show success toast
      toast.push({
        status: "success",
        title: "Metadata generated!",
        description: `Title, alt text, caption, and category have been updated.`,
      })
    } catch (error) {
      // Show error toast
      console.error("Error generating metadata:", error)

      let errorMessage = "Unknown error occurred"
      if (error instanceof TypeError && error.message.includes("fetch")) {
        errorMessage = `Network error: Cannot reach the API server at ${config.apiUrl}. Check console for details.`
      } else if (error instanceof Error) {
        errorMessage = error.message
      }

      toast.push({
        status: "error",
        title: "Failed to generate metadata",
        description: errorMessage,
      })
    } finally {
      setIsGenerating(false)
      onComplete()
    }
  }, [doc, patch, toast, onComplete])

  return {
    label: "Generate Metadata",
    icon: SparklesIcon,
    disabled: !hasImage || isGenerating,
    title: hasImage
      ? "Generate AI-powered title, alt text, caption, and category"
      : "Upload an image first to generate metadata",
    onHandle: handleGenerate,
  }
}
