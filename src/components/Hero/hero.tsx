import { Button } from "../Button/button";

export default function Hero() {
  return (
    <div className="relative h-[75vh] w-full overflow-hidden px-4 lg:h-[80vh]">
      {/* Hero Image */}
      <img
        src="/bike_sunset.webp"
        alt="Chimborazo Park landscape with historic views of Richmond's Church Hill neighborhood"
        width={2000}
        height={1262}
        className="absolute inset-0 h-full w-full object-cover"
        fetchPriority="high"
        loading="eager"
      />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-green-900/55 to-green-800/35 dark:from-grey-900/60 dark:to-grey-900/40"></div>

      {/* Content */}
      <div className="absolute inset-4 z-10 flex items-end justify-start lg:inset-0">
        <div className="mx-auto mb-4 w-full max-w-6xl space-y-6 lg:mb-16">
          <h1 className="font-display text-3xl text-white lg:text-5xl dark:text-grey-50">
            Restoring Chimborazo Park <br />
            for Our Community
          </h1>
          <p className="font-body font-medium text-green-100 lg:max-w-2xl lg:text-xl dark:text-grey-100">
            We're dedicated to preserving and beautifying this historic East End treasure—creating a
            safe, inclusive greenspace that honors the past and serves future generations.
          </p>
          <Button variant="secondary" size="small">
            Get Involved
          </Button>
        </div>
      </div>
    </div>
  );
}
