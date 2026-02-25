import { Button } from "../button/button";
import { Download } from "lucide-react";

export interface FileAsset {
  _id: string;
  url: string;
  originalFilename?: string;
  size?: number;
  extension?: string;
  mimeType?: string;
}

export interface FileAttachmentProps {
  asset: FileAsset;
  title?: string;
  description?: string;
}

function formatFileSize(bytes?: number): string {
  if (!bytes) return "";

  const units = ["B", "KB", "MB", "GB"];
  let size = bytes;
  let unitIndex = 0;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }

  return `${size.toFixed(1)} ${units[unitIndex]}`;
}

export function FileAttachment({ asset, title, description }: FileAttachmentProps) {
  const displayName = title || asset.originalFilename || "Download File";
  const fileSize = formatFileSize(asset.size);

  return (
    <div className="my-6 rounded-xl border border-accent-200 bg-white p-6 shadow-sm dark:border-accent-700/30 dark:bg-primary-950">
      <h4 className="mt-0 font-display text-lg font-semibold text-grey-900 dark:text-grey-100">
        {displayName}
      </h4>

      {description && (
        <p className="mt-2 font-body text-sm text-grey-700 dark:text-grey-300">{description}</p>
      )}

      <div className="mt-3 flex items-center gap-2 font-body text-sm text-grey-600 dark:text-grey-400">
        {asset.extension && <span className="font-medium uppercase">{asset.extension}</span>}
        {asset.extension && fileSize && <span>&bull;</span>}
        {fileSize && <span>{fileSize}</span>}
      </div>

      <div className="mt-6">
        <Button
          as="a"
          href={asset.url}
          variant="secondary"
          size="standard"
          className="inline-flex items-center gap-2"
          download
          aria-label={`Download ${displayName}`}
        >
          <Download className="h-5 w-5" />
          Download
        </Button>
      </div>
    </div>
  );
}
