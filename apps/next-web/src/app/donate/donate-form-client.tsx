"use client";

import { useState } from "react";

export default function DonateFormClient() {
  const [isIframeLoaded, setIsIframeLoaded] = useState(false);

  return (
    <div
      className="mt-12"
      style={{ position: "relative", minHeight: "700px", width: "100%" }}
    >
      {/* Loading skeleton */}
      {!isIframeLoaded && (
        <div className="absolute inset-0 flex flex-col items-center justify-center rounded-2xl bg-grey-100 dark:bg-grey-800">
          <div className="flex flex-col items-center gap-4">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary-200 border-t-primary-600 dark:border-primary-700 dark:border-t-primary-400" />
            <p className="font-body text-grey-600 dark:text-grey-400">
              Loading donation form...
            </p>
          </div>
        </div>
      )}
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
          opacity: isIframeLoaded ? 1 : 0,
          transition: "opacity 0.3s ease-in-out",
        }}
        src="https://www.zeffy.com/embed/donation-form/general-donation-125"
        allow="payment"
        onLoad={() => setIsIframeLoaded(true)}
      />
    </div>
  );
}
