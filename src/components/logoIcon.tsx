import type { SVGProps } from "react";

/** Editorial KL wordmark set in PP Telegraf UltraBold. */
export default function LogoIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 96 96"
      fill="none"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      <rect
        width="96"
        height="96"
        className="fill-black dark:fill-white"
      />
      <g transform="translate(7 0) skewX(-8)">
        <text
          x="48"
          y="51"
          textAnchor="middle"
          dominantBaseline="middle"
          className="fill-white dark:fill-black"
          style={{
            fontFamily: "Telegraf, sans-serif",
            fontSize: 72,
            fontWeight: 900,
            letterSpacing: -9,
          }}
        >
          kl
        </text>
      </g>
    </svg>
  );
}
