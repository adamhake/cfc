import { Image } from "@unpic/react";

export default function Partners() {
  return (
    <div className="mx-auto max-w-6xl">
      <h2 className="font-display text-xl text-green-800 md:text-2xl">Partners</h2>
      <div className="mt-10 grid grid-cols-1 gap-14 md:grid-cols-2">
        <div className="flex flex-col items-center justify-center gap-10 rounded-2xl border-2 border-grey-100 p-8 text-center">
          <a href="https://www.churchhillrotary.org/" target="_blank">
            <Image
              width={275}
              height={84}
              src="/ch_rotary.png"
              alt="Church Hill Rotary Club Logo"
              className="mx-auto max-w-56"
            />
          </a>
          <a href="https://www.churchhillrotary.org/" target="_blank">
            <h3 className="hover-border-green-800 font-display text-xl">Church Hill Rotary Club</h3>
          </a>
        </div>
        <div className="flex flex-col items-center justify-center gap-10 rounded-2xl border-2 border-grey-100 p-8 text-center">
          <a href="https://www.churchhill.org/" target="_blank">
            <Image
              width={201}
              height={66}
              src="/cha.png"
              alt="Church Hill Association Logo"
              className="mx-auto max-w-56"
            />
          </a>
          <a href="https://www.churchhill.org/" target="_blank">
            <h3 className="hover-border-green-800 font-display text-xl">Church Hill Association</h3>
          </a>
        </div>
      </div>
    </div>
  );
}
