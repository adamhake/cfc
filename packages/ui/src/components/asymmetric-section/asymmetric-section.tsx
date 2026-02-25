import type { ReactNode } from "react";

export interface AsymmetricSectionProps {
  imageSlot: ReactNode;
  contentSlot: ReactNode;
  imagePosition?: "left" | "right";
  imageSize?: "small" | "medium" | "large";
  curved?: boolean;
  className?: string;
}

const imageSizeClasses = {
  small: "lg:w-1/3",
  medium: "lg:w-2/5",
  large: "lg:w-1/2",
};

export function AsymmetricSection({
  imageSlot,
  contentSlot,
  imagePosition = "left",
  imageSize = "medium",
  curved = true,
  className = "",
}: AsymmetricSectionProps) {
  const imageWidth = imageSizeClasses[imageSize];
  const contentWidth =
    imageSize === "small" ? "lg:w-2/3" : imageSize === "medium" ? "lg:w-3/5" : "lg:w-1/2";

  return (
    <div className={`flex flex-col gap-8 lg:flex-row lg:items-center lg:gap-12 ${className}`}>
      {imagePosition === "left" ? (
        <>
          <div className={`${imageWidth}`}>
            <div className={curved ? "overflow-hidden rounded-3xl" : ""}>{imageSlot}</div>
          </div>
          <div className={`${contentWidth}`}>{contentSlot}</div>
        </>
      ) : (
        <>
          <div className={`${contentWidth} order-2 lg:order-1`}>{contentSlot}</div>
          <div className={`${imageWidth} order-1 lg:order-2`}>
            <div className={curved ? "overflow-hidden rounded-3xl" : ""}>{imageSlot}</div>
          </div>
        </>
      )}
    </div>
  );
}
