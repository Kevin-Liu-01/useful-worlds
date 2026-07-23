import createGlobe, { type Arc, type Globe, type Marker } from "cobe";
import { useReducedMotion } from "framer-motion";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
} from "react";

const TAU = Math.PI * 2;

export const KEVBOOK_COORDINATES = [
  [40.3573, -74.6672],
  [37.7749, -122.4194],
  [34.0522, -118.2437],
  [39.9612, -82.9988],
  [42.737, -84.4839],
  [29.9511, -90.0715],
  [51.0632, -1.308],
  [37.7749, -122.4194],
  [42.3601, -71.0589],
  [-33.8688, 151.2093],
  [47.6062, -122.3321],
  [40.7128, -74.006],
] as const satisfies readonly (readonly [number, number])[];

const locationToAngles = (latitude: number, longitude: number) =>
  [
    Math.PI - ((longitude * Math.PI) / 180 - Math.PI / 2),
    (latitude * Math.PI) / 180,
  ] as const;

const shortestTurn = (from: number, to: number) => {
  const positive = (to - from + TAU) % TAU;
  const negative = (from - to + TAU) % TAU;
  return positive < negative ? positive : -negative;
};

const markersFor = (selectedIndex: number): Marker[] =>
  KEVBOOK_COORDINATES.map((location, index) => ({
    id: `kev-${index}`,
    location: [...location],
    size: index === selectedIndex ? 0.075 : index === 0 ? 0.055 : 0.038,
    color:
      index === selectedIndex
        ? [0.847, 1, 0.212]
        : index === 0
          ? [0.847, 1, 0.212]
          : [0.96, 0.96, 0.93],
  }));

const ARCS: Arc[] = KEVBOOK_COORDINATES.slice(1).map((location, index) => ({
  id: `connection-${index}`,
  from: [...KEVBOOK_COORDINATES[0]],
  to: [...location],
  color:
    index % 3 === 0
      ? [0.847, 1, 0.212]
      : index % 3 === 1
        ? [0.75, 0.75, 0.72]
        : [0.45, 0.45, 0.43],
}));

type KevBookGlobeProps = {
  selectedIndex: number;
  selectedLabel: string;
};

const KevBookGlobe = ({ selectedIndex, selectedLabel }: KevBookGlobeProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const globeRef = useRef<Globe | null>(null);
  const selectedIndexRef = useRef(selectedIndex);
  const phiRef = useRef(0.5);
  const thetaRef = useRef(0.18);
  const targetRef = useRef<readonly [number, number] | null>(null);
  const dragRef = useRef<{
    x: number;
    y: number;
    phi: number;
    theta: number;
  } | null>(null);
  const [dragging, setDragging] = useState(false);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    selectedIndexRef.current = selectedIndex;
    const coordinate = KEVBOOK_COORDINATES[selectedIndex];
    if (!coordinate) return;
    targetRef.current = locationToAngles(coordinate[0], coordinate[1]);
    globeRef.current?.update({ markers: markersFor(selectedIndex) });
  }, [selectedIndex]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    let frame = 0;
    let disposed = false;
    let size = Math.max(320, Math.min(container.clientWidth, 720));
    const devicePixelRatio = Math.min(window.devicePixelRatio || 1, 2);

    try {
      const globe = createGlobe(canvas, {
        devicePixelRatio,
        width: size * devicePixelRatio,
        height: size * devicePixelRatio,
        phi: phiRef.current,
        theta: thetaRef.current,
        dark: 1,
        diffuse: 1.35,
        mapSamples: 24000,
        mapBrightness: 5.5,
        mapBaseBrightness: 0.08,
        baseColor: [0.055, 0.055, 0.052],
        markerColor: [0.847, 1, 0.212],
        glowColor: [0.12, 0.12, 0.11],
        markers: markersFor(selectedIndexRef.current),
        arcs: ARCS,
        arcColor: [0.847, 1, 0.212],
        arcWidth: 0.34,
        arcHeight: 0.22,
        markerElevation: 0.025,
        opacity: 0.98,
        scale: 0.92,
      });
      globeRef.current = globe;
      setReady(true);

      const render = () => {
        if (disposed) return;

        if (!dragRef.current) {
          const target = targetRef.current;
          if (target) {
            const phiDistance = shortestTurn(phiRef.current, target[0]);
            const thetaDistance = target[1] - thetaRef.current;
            phiRef.current += phiDistance * 0.085;
            thetaRef.current += thetaDistance * 0.085;
            if (
              Math.abs(phiDistance) < 0.002 &&
              Math.abs(thetaDistance) < 0.002
            ) {
              targetRef.current = null;
            }
          } else if (!reduceMotion) {
            phiRef.current += 0.0017;
          }
        }

        globe.update({ phi: phiRef.current, theta: thetaRef.current });
        frame = requestAnimationFrame(render);
      };
      frame = requestAnimationFrame(render);

      const observer = new ResizeObserver(() => {
        size = Math.max(320, Math.min(container.clientWidth, 720));
        globe.update({
          width: size * devicePixelRatio,
          height: size * devicePixelRatio,
        });
      });
      observer.observe(container);

      return () => {
        disposed = true;
        cancelAnimationFrame(frame);
        observer.disconnect();
        globe.destroy();
        globeRef.current = null;
      };
    } catch {
      setFailed(true);
      return undefined;
    }
  }, [reduceMotion]);

  const selectedAnchorStyle = useMemo(
    () =>
      ({
        position: "absolute",
        positionAnchor: `--cobe-kev-${selectedIndex}`,
        bottom: "anchor(top)",
        left: "anchor(center)",
        opacity: `var(--cobe-visible-kev-${selectedIndex}, 0)`,
        transform: "translate(-50%, -12px)",
      }) as CSSProperties & { positionAnchor: string },
    [selectedIndex],
  );

  const handlePointerDown = (event: ReactPointerEvent<HTMLCanvasElement>) => {
    event.currentTarget.setPointerCapture(event.pointerId);
    dragRef.current = {
      x: event.clientX,
      y: event.clientY,
      phi: phiRef.current,
      theta: thetaRef.current,
    };
    targetRef.current = null;
    setDragging(true);
  };

  const handlePointerMove = (event: ReactPointerEvent<HTMLCanvasElement>) => {
    const drag = dragRef.current;
    if (!drag) return;
    phiRef.current = drag.phi + (event.clientX - drag.x) / 160;
    thetaRef.current = Math.max(
      -0.75,
      Math.min(0.75, drag.theta + (event.clientY - drag.y) / 260),
    );
  };

  const releasePointer = (event: ReactPointerEvent<HTMLCanvasElement>) => {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    dragRef.current = null;
    setDragging(false);
  };

  return (
    <div
      ref={containerRef}
      className="relative mx-auto aspect-square w-full max-w-[720px] overflow-hidden"
    >
      <div className="pointer-events-none absolute inset-[9%] rounded-full border border-white/10 shadow-[0_0_120px_rgba(216,255,54,.1)]" />
      <canvas
        ref={canvasRef}
        role="img"
        aria-label="Interactive KevBook globe with public Kevin Liu locations"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={releasePointer}
        onPointerCancel={releasePointer}
        className={`h-full w-full touch-none select-none transition-opacity duration-700 ${
          dragging ? "cursor-grabbing" : "cursor-grab"
        } ${ready ? "opacity-100" : "opacity-0"}`}
      />

      {!ready && !failed && (
        <div className="absolute inset-0 grid place-items-center">
          <span className="animate-pulse font-mori text-[8px] uppercase tracking-[0.2em] text-white/45">
            Mapping signals…
          </span>
        </div>
      )}
      {failed && (
        <div className="absolute inset-0 grid place-items-center border border-white/20">
          <span className="max-w-[28ch] text-center font-mori text-[9px] uppercase tracking-[0.16em] text-white/45">
            WebGL is unavailable. The signal catalog remains online below.
          </span>
        </div>
      )}

      {ready && (
        <div
          aria-hidden="true"
          style={selectedAnchorStyle}
          className="pointer-events-none z-20 whitespace-nowrap border border-[#d8ff36]/50 bg-black/85 px-2.5 py-1.5 font-mori text-[7px] uppercase tracking-[0.14em] text-[#d8ff36] backdrop-blur-md transition-opacity duration-300"
        >
          {selectedLabel}
        </div>
      )}

      <div className="pointer-events-none absolute left-4 top-4 flex items-center gap-2 font-mori text-[7px] uppercase tracking-[0.16em] text-white/45 sm:left-6 sm:top-6">
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#d8ff36]" />
        Live geography / COBE v2
      </div>
      <div className="pointer-events-none absolute bottom-4 right-4 border border-white/20 bg-black/50 px-3 py-2 font-mori text-[7px] uppercase tracking-[0.15em] text-white/45 backdrop-blur-sm sm:bottom-6 sm:right-6">
        Drag to orbit
      </div>
    </div>
  );
};

export default KevBookGlobe;
