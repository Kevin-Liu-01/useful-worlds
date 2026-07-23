import { CLIP } from "../../constants/clipPaths";

export const TYPE_STYLES: {
  [key: string]: { bg: string; border: string; text: string };
} = {
  AI: { bg: "bg-purple-500", border: "border-purple-400", text: "text-white" },
  Data: { bg: "bg-blue-500", border: "border-blue-400", text: "text-white" },
  Web: { bg: "bg-green-500", border: "border-green-400", text: "text-white" },
  Design: { bg: "bg-pink-500", border: "border-pink-400", text: "text-white" },
  Hardware: {
    bg: "bg-gray-500",
    border: "border-gray-400",
    text: "text-white",
  },
  Health: { bg: "bg-red-500", border: "border-red-400", text: "text-white" },
  Mobile: {
    bg: "bg-yellow-500",
    border: "border-yellow-400",
    text: "text-black",
  },
  Infra: {
    bg: "bg-cyan-600",
    border: "border-cyan-400",
    text: "text-white",
  },
  Game: {
    bg: "bg-orange-500",
    border: "border-orange-400",
    text: "text-white",
  },
};

const DEFAULT_STYLE = {
  bg: "bg-gray-200",
  border: "border-gray-300",
  text: "text-black",
};

const SIZE_CLASSES = {
  sm: "px-2.5 py-0.5 text-xs font-semibold",
  xs: "px-2 py-0.5 text-[9px] font-semibold",
  xxs: "px-1.5 py-0.5 text-[8px] font-semibold",
  base: "px-2 py-0.5 text-xs font-bold",
} as const;

type BadgeSize = keyof typeof SIZE_CLASSES;

export const TypeBadge = ({
  type,
  size = "base",
}: {
  type: string;
  size?: BadgeSize;
}) => {
  const style = TYPE_STYLES[type] ?? DEFAULT_STYLE;
  const sizeClass = SIZE_CLASSES[size];
  const clipPath = size === "base" ? CLIP.typeBadge : CLIP.typeBadgeLarge;

  return (
    <span
      className={`tracking-wide ${sizeClass} ${style.bg} ${style.text}`}
      style={{ clipPath }}
    >
      {type}
    </span>
  );
};
