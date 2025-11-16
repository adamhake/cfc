export interface MediaImage {
  key: string; // Unique identifier used in Netlify Blobs
  src: string; // URL to the image (from Netlify Blobs or CDN)
  width: number;
  height: number;
  alt: string;
  caption?: string;
  uploadedAt: string; // ISO timestamp
}
