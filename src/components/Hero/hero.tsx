import { Button } from "../Button/button";

export default function Hero() {
  return (
    <div className="relative h-[80vh] w-full overflow-hidden bg-[url(/chimbo_hero_adj.webp)] bg-cover px-4">
      <div className="absolute inset-4 z-10 flex items-end justify-start lg:inset-0">
        <div className="mx-auto mb-4 w-full max-w-6xl space-y-6 lg:mb-16">
          <h1 className="font-display text-3xl text-white lg:text-5xl">
            Restoring Chimborazo Park <br />
            for Our Community
          </h1>
          <p className="font-body font-medium text-green-100 lg:max-w-2xl lg:text-xl">
            We're dedicated to preserving and beautifying this historic East End treasure—creating a
            safe, inclusive greenspace that honors the past and serves future generations.
          </p>
          <Button variant="secondary" size="small">
            Get Involved
          </Button>
        </div>
      </div>
      <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-r from-green-900/70 to-green-800/50"></div>
    </div>
  );
}
