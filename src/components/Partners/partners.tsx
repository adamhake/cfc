import { Image } from "@unpic/react";

export default function Partners() {
  return (
    <div className="px-4 lg:px-0">
      <div className="mx-auto max-w-6xl">
        <div className="mt-10 grid grid-cols-1 gap-14 md:grid-cols-2">
          <div className="flex flex-col items-center justify-center gap-10 rounded-2xl border-2 border-grey-100 p-8 text-center dark:border-primary-600 dark:bg-primary-900">
            <a
              href="https://www.churchhillrotary.org/"
              target="_blank"
              className="transition-transform active:scale-95"
            >
              <Image
                width={275}
                height={84}
                src="/ch_rotary.png"
                alt="Church Hill Rotary Club Logo"
                className="mx-auto max-w-56"
              />
            </a>
            <a
              href="https://www.churchhillrotary.org/"
              target="_blank"
              className="transition-opacity active:opacity-70"
            >
              <h3 className="hover-border-primary-800 font-display text-xl dark:text-grey-100 dark:hover:text-primary-400">
                Church Hill Rotary Club
              </h3>
            </a>
          </div>
          <div className="flex flex-col items-center justify-center gap-10 rounded-2xl border-2 border-grey-100 p-8 text-center dark:border-primary-600 dark:bg-primary-900">
            <a
              href="https://www.churchhill.org/"
              target="_blank"
              className="transition-transform active:scale-95"
            >
              <Image
                width={201}
                height={66}
                src="/cha.png"
                alt="Church Hill Association Logo"
                className="mx-auto max-w-56"
              />
            </a>
            <a
              href="https://www.churchhill.org/"
              target="_blank"
              className="transition-opacity active:opacity-70"
            >
              <h3 className="hover-border-primary-800 font-display text-xl dark:text-grey-100 dark:hover:text-primary-400">
                Church Hill Association
              </h3>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
