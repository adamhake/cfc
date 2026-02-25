import { useId } from "react";

export function IconLogo(props: React.SVGProps<SVGSVGElement>) {
  const gradientId = useId();

  return (
    <svg
      width="107"
      height="100"
      viewBox="0 0 107 100"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid meet"
      {...props}
    >
      <title>Chimbo Park Conservancy Logo</title>
      <path
        d="M10 44C5.173 57.1622 7.147 72.4624 16 84C12.162 86.8726 7.205 91.0111 0 92L5 98C5 98 12.842 95.5223 20 89C28.006 96.7467 38.663 99.9058 49 100C51.896 99.9529 55.597 100.13 60 99C64.221 97.8433 76.727 93.7492 77 88C77.271 82.2957 61.182 78.4304 45 74C28.706 69.5262 14 64.3713 14 55C14 47.1593 21.112 44.6829 29 44"
        fill="currentColor"
      />
      <path
        d="M41 43.9996C34.958 44.7489 28 46.999 28 50.999C28 56.999 45.25 59.401 63 62C71.711 63.2644 82.172 64.8156 91 68C94.302 60.4839 96.892 52.1473 99 43.999"
        fill="currentColor"
      />
      <path
        d="M52 44C52.094 32.0838 62.108 22 74 22C85.892 22 96 31.9893 96 44H99C104.793 21.3971 107 0 107 0C107 0 42.475 5.69801 19.561 28.8683C15.181 33.3369 12.025 38.4911 10 44"
        fill={`url(#${gradientId})`}
      />
      <defs>
        <linearGradient
          id={gradientId}
          x1="58.5"
          y1="0"
          x2="58.5"
          y2="44"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0.2" stopColor="#DB8A06" />
          <stop offset="1" stopColor="#F3D6F7" />
        </linearGradient>
      </defs>
    </svg>
  );
}
