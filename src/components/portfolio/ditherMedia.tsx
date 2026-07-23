import Image from "next/image";
import { useEffect, useRef } from "react";

const BAYER_4 = [
  [0, 8, 2, 10],
  [12, 4, 14, 6],
  [3, 11, 1, 9],
  [15, 7, 13, 5],
] as const;

const DEFAULT_MEDIA_FOCUS = [0.5, 0.5] as const;

const DitherMedia = ({
  src,
  alt,
  priority = false,
  tone = "binary",
  revealOnParentHover = false,
  fit = "cover",
  focus = DEFAULT_MEDIA_FOCUS,
  className = "",
}: {
  src: string;
  alt: string;
  priority?: boolean;
  tone?: "binary" | "soft";
  revealOnParentHover?: boolean;
  fit?: "cover" | "contain";
  focus?: readonly [number, number];
  className?: string;
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let disposed = false;
    const image = new window.Image();

    const paint = () => {
      if (disposed || !image.naturalWidth || !image.naturalHeight) return;
      const bounds = canvas.getBoundingClientRect();
      if (!bounds.width || !bounds.height) return;

      const pixelSize =
        tone === "soft"
          ? bounds.width < 520
            ? 2
            : 2.5
          : bounds.width < 520
            ? 2.6
            : 3.2;
      const width = Math.max(1, Math.ceil(bounds.width / pixelSize));
      const height = Math.max(1, Math.ceil(bounds.height / pixelSize));
      canvas.width = width;
      canvas.height = height;

      const context = canvas.getContext("2d", { willReadFrequently: true });
      if (!context) return;
      context.imageSmoothingEnabled = true;

      if (fit === "contain") {
        context.fillStyle = "#111111";
        context.fillRect(0, 0, width, height);
        const scale = Math.min(
          width / image.naturalWidth,
          height / image.naturalHeight,
        );
        const drawWidth = image.naturalWidth * scale;
        const drawHeight = image.naturalHeight * scale;
        context.drawImage(
          image,
          (width - drawWidth) / 2,
          (height - drawHeight) / 2,
          drawWidth,
          drawHeight,
        );
      } else {
        const sourceRatio = image.naturalWidth / image.naturalHeight;
        const targetRatio = width / height;
        let sourceWidth = image.naturalWidth;
        let sourceHeight = image.naturalHeight;
        let sourceX = 0;
        let sourceY = 0;

        if (sourceRatio > targetRatio) {
          sourceWidth = image.naturalHeight * targetRatio;
          sourceX = (image.naturalWidth - sourceWidth) * focus[0];
        } else {
          sourceHeight = image.naturalWidth / targetRatio;
          sourceY = (image.naturalHeight - sourceHeight) * focus[1];
        }

        context.drawImage(
          image,
          sourceX,
          sourceY,
          sourceWidth,
          sourceHeight,
          0,
          0,
          width,
          height,
        );
      }

      const pixels = context.getImageData(0, 0, width, height);
      for (let y = 0; y < height; y += 1) {
        for (let x = 0; x < width; x += 1) {
          const offset = (y * width + x) * 4;
          const red = pixels.data[offset] ?? 0;
          const green = pixels.data[offset + 1] ?? 0;
          const blue = pixels.data[offset + 2] ?? 0;
          const luminance = red * 0.299 + green * 0.587 + blue * 0.114;
          const matrixValue = BAYER_4[y % 4]?.[x % 4] ?? 0;
          const threshold = ((matrixValue + 0.5) / 16) * 255;
          const softOffset = (matrixValue / 15 - 0.5) * 46;
          const quantized = Math.round((luminance + softOffset) / 64) * 64;
          const value =
            tone === "soft"
              ? Math.max(16, Math.min(244, quantized))
              : luminance > threshold
                ? 244
                : 12;
          pixels.data[offset] = value;
          pixels.data[offset + 1] = value;
          pixels.data[offset + 2] = value;
          pixels.data[offset + 3] = 255;
        }
      }
      context.putImageData(pixels, 0, 0);
    };

    image.onload = paint;
    image.src = src;
    const observer = new ResizeObserver(paint);
    observer.observe(canvas);
    return () => {
      disposed = true;
      observer.disconnect();
    };
  }, [fit, focus, src, tone]);

  return (
    <div className={`group overflow-hidden bg-[#111] ${className}`}>
      <Image
        src={src}
        alt={alt}
        fill
        preload={priority}
        loading={priority ? "eager" : "lazy"}
        sizes="(min-width: 1024px) 55vw, 100vw"
        style={{ objectPosition: `${focus[0] * 100}% ${focus[1] * 100}%` }}
        className={`${
          fit === "contain" ? "object-contain" : "object-cover"
        } opacity-0 saturate-[1.15] transition-opacity duration-700 ease-out ${
          revealOnParentHover
            ? "group-hover/sequence:opacity-100"
            : "group-hover:opacity-100"
        }`}
      />
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className={`absolute inset-0 h-full w-full transition-opacity duration-500 [image-rendering:pixelated] ${
          revealOnParentHover
            ? "group-hover/sequence:opacity-0"
            : "group-hover:opacity-0"
        }`}
      />
      <div
        className={`pointer-events-none absolute inset-0 bg-[linear-gradient(105deg,transparent_35%,rgba(255,255,255,.18)_50%,transparent_65%)] opacity-0 transition duration-500 ${
          revealOnParentHover
            ? "group-hover/sequence:translate-x-1/3 group-hover/sequence:opacity-100"
            : "group-hover:translate-x-1/3 group-hover:opacity-100"
        }`}
      />
    </div>
  );
};

export default DitherMedia;
