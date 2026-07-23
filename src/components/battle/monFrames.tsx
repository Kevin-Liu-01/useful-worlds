import { motion } from "framer-motion";
import React from "react";

interface FrameProps {
  color: string;
}

const AuraFrame = ({ color }: FrameProps) => (
  <div className="pointer-events-none absolute inset-0">
    <motion.div
      className="absolute inset-[-8%] rounded-[40%]"
      style={{
        background: `radial-gradient(ellipse at 50% 60%, rgba(${color}, 0.12) 0%, transparent 65%)`,
      }}
      animate={{ scale: [1, 1.06, 1], opacity: [0.6, 1, 0.6] }}
      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
    />
    <motion.div
      className="absolute inset-[-4%] rounded-[40%]"
      style={{
        boxShadow: `inset 0 0 30px rgba(${color}, 0.15), 0 0 20px rgba(${color}, 0.08)`,
      }}
      animate={{ opacity: [0.4, 0.8, 0.4] }}
      transition={{
        duration: 2.5,
        repeat: Infinity,
        ease: "easeInOut",
        delay: 0.5,
      }}
    />
  </div>
);

const PlasmaFrame = ({ color }: FrameProps) => (
  <div className="pointer-events-none absolute inset-0 overflow-visible">
    {Array.from({ length: 3 }, (_, i) => (
      <motion.div
        key={i}
        className="absolute inset-[-6%] rounded-[50%]"
        style={{
          border: `1px solid rgba(${color}, ${0.15 + i * 0.05})`,
          filter: `blur(${1 + i}px)`,
        }}
        animate={{
          scale: [1, 1.04 + i * 0.02, 1],
          rotate: [0, i % 2 === 0 ? 3 : -3, 0],
        }}
        transition={{
          duration: 3 + i * 0.5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: i * 0.4,
        }}
      />
    ))}
    <motion.div
      className="absolute inset-[-3%]"
      style={{
        background: `radial-gradient(ellipse at 30% 40%, rgba(${color}, 0.1) 0%, transparent 50%)`,
      }}
      animate={{ opacity: [0.3, 0.7, 0.3] }}
      transition={{ duration: 4, repeat: Infinity }}
    />
  </div>
);

const EmberFrame = ({ color }: FrameProps) => (
  <div className="pointer-events-none absolute inset-0 overflow-visible">
    {Array.from({ length: 6 }, (_, i) => {
      const x = 10 + (i * 80) / 5;
      return (
        <motion.div
          key={i}
          className="absolute h-1 w-1 rounded-full"
          style={{
            left: `${x}%`,
            bottom: "-5%",
            background: `rgba(${color}, 0.8)`,
            boxShadow: `0 0 6px rgba(${color}, 0.6)`,
          }}
          animate={{
            y: [0, -40 - Math.random() * 60],
            x: [(Math.random() - 0.5) * 20, (Math.random() - 0.5) * 30],
            opacity: [0, 0.9, 0],
            scale: [0.5, 1.2, 0],
          }}
          transition={{
            duration: 2 + Math.random(),
            repeat: Infinity,
            delay: i * 0.4,
            ease: "easeOut",
          }}
        />
      );
    })}
    <motion.div
      className="absolute inset-[-5%] rounded-[45%]"
      style={{
        boxShadow: `0 0 25px rgba(${color}, 0.1), inset 0 0 25px rgba(${color}, 0.05)`,
      }}
      animate={{ opacity: [0.3, 0.6, 0.3] }}
      transition={{ duration: 2, repeat: Infinity }}
    />
  </div>
);

const PulseRingFrame = ({ color }: FrameProps) => (
  <div className="pointer-events-none absolute inset-0 overflow-visible">
    {Array.from({ length: 2 }, (_, i) => (
      <motion.div
        key={i}
        className="absolute inset-[5%] rounded-[50%]"
        style={{
          border: `1.5px solid rgba(${color}, 0.3)`,
          boxShadow: `0 0 8px rgba(${color}, 0.15)`,
        }}
        animate={{ scale: [1, 1.15, 1], opacity: [0.6, 0.2, 0.6] }}
        transition={{
          duration: 2.5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: i * 1.25,
        }}
      />
    ))}
    <motion.div
      className="absolute inset-0"
      style={{
        background: `radial-gradient(circle at 50% 50%, rgba(${color}, 0.06) 0%, transparent 60%)`,
      }}
    />
  </div>
);

const WispFrame = ({ color }: FrameProps) => (
  <div className="pointer-events-none absolute inset-0 overflow-visible">
    {Array.from({ length: 4 }, (_, i) => {
      const angle = (i / 4) * 360;
      return (
        <motion.div
          key={i}
          className="absolute h-8 w-2 rounded-full"
          style={{
            left: "50%",
            top: "50%",
            background: `linear-gradient(to top, rgba(${color}, 0.4), transparent)`,
            filter: "blur(2px)",
            transformOrigin: "50% 200%",
            rotate: angle,
          }}
          animate={{ opacity: [0.2, 0.6, 0.2], scaleY: [0.8, 1.2, 0.8] }}
          transition={{
            duration: 2 + i * 0.3,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.5,
          }}
        />
      );
    })}
    <motion.div
      className="absolute inset-[-4%] rounded-full"
      style={{ boxShadow: `0 0 30px rgba(${color}, 0.08)` }}
      animate={{ opacity: [0.3, 0.6, 0.3] }}
      transition={{ duration: 3, repeat: Infinity }}
    />
  </div>
);

const NexusFrame = ({ color }: FrameProps) => (
  <div className="pointer-events-none absolute inset-0">
    <svg
      viewBox="0 0 100 100"
      className="absolute inset-[-5%] h-[110%] w-[110%]"
      preserveAspectRatio="xMidYMid meet"
    >
      <motion.circle
        cx="50"
        cy="50"
        r="46"
        fill="none"
        stroke={`rgba(${color}, 0.25)`}
        strokeWidth="0.5"
        strokeDasharray="2 6"
        animate={{ rotate: [0, 360] }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        style={{ transformOrigin: "50px 50px" }}
      />
      <motion.circle
        cx="50"
        cy="50"
        r="40"
        fill="none"
        stroke={`rgba(${color}, 0.15)`}
        strokeWidth="0.4"
        strokeDasharray="4 8"
        animate={{ rotate: [360, 0] }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        style={{ transformOrigin: "50px 50px" }}
      />
    </svg>
    <motion.div
      className="absolute inset-0"
      style={{
        background: `radial-gradient(circle, rgba(${color}, 0.08) 0%, transparent 55%)`,
      }}
      animate={{ opacity: [0.4, 0.8, 0.4] }}
      transition={{ duration: 3.5, repeat: Infinity }}
    />
  </div>
);

const ShimmerFrame = ({ color }: FrameProps) => (
  <div className="pointer-events-none absolute inset-0 overflow-hidden">
    <motion.div
      className="absolute inset-x-[-10%] h-[120%]"
      style={{
        background: `linear-gradient(180deg, transparent 0%, rgba(${color}, 0.08) 45%, rgba(${color}, 0.15) 50%, rgba(${color}, 0.08) 55%, transparent 100%)`,
      }}
      animate={{ y: ["-60%", "60%"] }}
      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
    />
    <motion.div
      className="absolute inset-[-3%] rounded-[40%]"
      style={{ boxShadow: `0 0 20px rgba(${color}, 0.06)` }}
    />
  </div>
);

const VortexFrame = ({ color }: FrameProps) => (
  <div className="pointer-events-none absolute inset-0">
    <svg
      viewBox="0 0 100 100"
      className="absolute inset-[-5%] h-[110%] w-[110%]"
      preserveAspectRatio="xMidYMid meet"
    >
      {[0, 90, 180, 270].map((startAngle, i) => {
        const r = 44;
        const a1 = (startAngle * Math.PI) / 180;
        const a2 = ((startAngle + 50) * Math.PI) / 180;
        const d = `M ${50 + r * Math.cos(a1)} ${
          50 + r * Math.sin(a1)
        } A ${r} ${r} 0 0 1 ${50 + r * Math.cos(a2)} ${50 + r * Math.sin(a2)}`;
        return (
          <motion.path
            key={i}
            d={d}
            fill="none"
            stroke={`rgba(${color}, ${0.2 + i * 0.05})`}
            strokeWidth="0.8"
            strokeLinecap="round"
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 10 - i, repeat: Infinity, ease: "linear" }}
            style={{ transformOrigin: "50px 50px" }}
          />
        );
      })}
    </svg>
  </div>
);

const CrystalFrame = ({ color }: FrameProps) => (
  <div className="pointer-events-none absolute inset-0 overflow-visible">
    {Array.from({ length: 5 }, (_, i) => {
      const angle = (i / 5) * 360;
      const dist = 48;
      const rad = (angle * Math.PI) / 180;
      return (
        <motion.div
          key={i}
          className="absolute h-2 w-1 rounded-sm"
          style={{
            left: `${50 + Math.cos(rad) * dist}%`,
            top: `${50 + Math.sin(rad) * dist}%`,
            background: `rgba(${color}, 0.5)`,
            boxShadow: `0 0 4px rgba(${color}, 0.3)`,
            transform: `translate(-50%, -50%) rotate(${angle + 90}deg)`,
          }}
          animate={{ opacity: [0.3, 0.8, 0.3], scale: [0.8, 1.2, 0.8] }}
          transition={{ duration: 2, repeat: Infinity, delay: i * 0.4 }}
        />
      );
    })}
    <motion.div
      className="absolute inset-0"
      style={{
        background: `radial-gradient(circle, rgba(${color}, 0.06) 0%, transparent 50%)`,
      }}
    />
  </div>
);

const StormFrame = ({ color }: FrameProps) => (
  <div className="pointer-events-none absolute inset-0 overflow-visible">
    <motion.div
      className="absolute inset-[-8%] rounded-full"
      style={{
        background: `conic-gradient(from 0deg, transparent, rgba(${color}, 0.1), transparent, rgba(${color}, 0.06), transparent)`,
        filter: "blur(4px)",
      }}
      animate={{ rotate: [0, 360] }}
      transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
    />
    <motion.div
      className="absolute inset-[-4%] rounded-full"
      style={{
        background: `conic-gradient(from 180deg, transparent, rgba(${color}, 0.08), transparent, rgba(${color}, 0.04), transparent)`,
        filter: "blur(3px)",
      }}
      animate={{ rotate: [360, 0] }}
      transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
    />
  </div>
);

const FlareFrame = ({ color }: FrameProps) => (
  <div className="pointer-events-none absolute inset-0 overflow-visible">
    <motion.div
      className="absolute left-[-10%] top-[20%] h-[60%] w-[120%]"
      style={{
        background: `radial-gradient(ellipse at 50% 50%, rgba(${color}, 0.1) 0%, transparent 60%)`,
        filter: "blur(8px)",
      }}
      animate={{ scaleX: [1, 1.1, 1], opacity: [0.4, 0.7, 0.4] }}
      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
    />
    <motion.div
      className="absolute inset-[10%] rounded-full"
      style={{ boxShadow: `0 0 15px rgba(${color}, 0.1)` }}
      animate={{ opacity: [0.3, 0.6, 0.3] }}
      transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
    />
  </div>
);

const SpiritFrame = ({ color }: FrameProps) => (
  <div className="pointer-events-none absolute inset-0 overflow-visible">
    {Array.from({ length: 3 }, (_, i) => (
      <motion.div
        key={i}
        className="absolute rounded-full"
        style={{
          width: 4 + i * 2,
          height: 4 + i * 2,
          background: `rgba(${color}, ${0.4 - i * 0.1})`,
          boxShadow: `0 0 ${6 + i * 2}px rgba(${color}, 0.3)`,
          filter: "blur(1px)",
        }}
        animate={{
          left: [
            `${20 + i * 15}%`,
            `${60 - i * 10}%`,
            `${30 + i * 20}%`,
            `${20 + i * 15}%`,
          ],
          top: [
            `${70 - i * 10}%`,
            `${30 + i * 5}%`,
            `${50}%`,
            `${70 - i * 10}%`,
          ],
          opacity: [0.3, 0.7, 0.5, 0.3],
        }}
        transition={{
          duration: 5 + i * 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    ))}
    <motion.div
      className="absolute inset-[-5%] rounded-[45%]"
      style={{ boxShadow: `0 0 25px rgba(${color}, 0.06)` }}
      animate={{ opacity: [0.3, 0.5, 0.3] }}
      transition={{ duration: 4, repeat: Infinity }}
    />
  </div>
);

const RadarFrame = ({ color }: FrameProps) => (
  <div className="pointer-events-none absolute inset-[-7%] overflow-visible">
    <motion.div
      className="absolute inset-[8%] rounded-full border"
      style={{
        borderColor: `rgba(${color}, 0.28)`,
        background: `conic-gradient(from 0deg, transparent 0deg, rgba(${color}, 0.16) 28deg, transparent 58deg)`,
      }}
      animate={{ rotate: 360 }}
      transition={{ duration: 4.8, repeat: Infinity, ease: "linear" }}
    />
    {[18, 31, 44].map((inset, index) => (
      <motion.div
        key={inset}
        className="absolute rounded-full border"
        style={{
          inset: `${inset}%`,
          borderColor: `rgba(${color}, ${0.24 - index * 0.04})`,
        }}
        animate={{ scale: [0.96, 1.04, 0.96], opacity: [0.35, 0.8, 0.35] }}
        transition={{
          duration: 2.4 + index * 0.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    ))}
    <span
      className="absolute left-1/2 top-[6%] h-[88%] w-px -translate-x-1/2"
      style={{
        background: `linear-gradient(transparent, rgba(${color}, .36), transparent)`,
      }}
    />
    <span
      className="absolute left-[6%] top-1/2 h-px w-[88%] -translate-y-1/2"
      style={{
        background: `linear-gradient(90deg, transparent, rgba(${color}, .36), transparent)`,
      }}
    />
  </div>
);

const DitherHaloFrame = ({ color }: FrameProps) => (
  <div className="pointer-events-none absolute inset-[-8%] overflow-hidden rounded-[42%]">
    <motion.div
      className="absolute inset-0"
      style={{
        backgroundImage: `radial-gradient(rgba(${color}, .5) 1px, transparent 1px)`,
        backgroundSize: "7px 7px",
        maskImage:
          "radial-gradient(circle, transparent 25%, black 48%, transparent 72%)",
      }}
      animate={{
        backgroundPosition: ["0px 0px", "14px 7px", "0px 14px"],
        opacity: [0.25, 0.7, 0.25],
        scale: [0.98, 1.04, 0.98],
      }}
      transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
    />
    <motion.div
      className="absolute inset-[11%] rounded-full border border-dashed"
      style={{ borderColor: `rgba(${color}, .35)` }}
      animate={{ rotate: -360 }}
      transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
    />
  </div>
);

const GlyphFrame = ({ color }: FrameProps) => (
  <div className="pointer-events-none absolute inset-[-6%] overflow-visible">
    <svg viewBox="0 0 100 100" className="h-full w-full overflow-visible">
      <motion.path
        d="M18 8 H42 L50 2 L58 8 H82 L92 18 V42 L98 50 L92 58 V82 L82 92 H58 L50 98 L42 92 H18 L8 82 V58 L2 50 L8 42 V18 Z"
        fill="none"
        stroke={`rgba(${color}, .32)`}
        strokeWidth="0.65"
        strokeDasharray="5 3 1 3"
        animate={{ strokeDashoffset: [0, -24] }}
        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
      />
      {[0, 90, 180, 270].map((angle) => (
        <motion.g
          key={angle}
          style={{ transformOrigin: "50px 50px", rotate: angle }}
          animate={{ opacity: [0.35, 1, 0.35] }}
          transition={{ duration: 1.8, repeat: Infinity, delay: angle / 360 }}
        >
          <path d="M46 7 L50 1 L54 7 L50 13 Z" fill={`rgba(${color}, .55)`} />
          <circle cx="50" cy="17" r="1.4" fill={`rgba(${color}, .75)`} />
        </motion.g>
      ))}
    </svg>
    <motion.div
      className="absolute inset-[4%] rounded-[38%]"
      style={{
        boxShadow: `inset 0 0 22px rgba(${color}, .12), 0 0 18px rgba(${color}, .1)`,
      }}
      animate={{ opacity: [0.35, 0.8, 0.35] }}
      transition={{ duration: 2.2, repeat: Infinity }}
    />
  </div>
);

const SignalFrame = ({ color }: FrameProps) => (
  <div className="pointer-events-none absolute inset-[-5%] overflow-visible">
    {[0, 1, 2].map((index) => (
      <motion.div
        key={index}
        className="absolute left-1/2 top-1/2 rounded-[45%] border"
        style={{
          width: `${72 + index * 12}%`,
          height: `${46 + index * 12}%`,
          x: "-50%",
          y: "-50%",
          borderColor: `rgba(${color}, ${0.3 - index * 0.06})`,
          clipPath: index % 2 === 0 ? "inset(0 0 50% 0)" : "inset(50% 0 0 0)",
        }}
        animate={{ scaleX: [0.96, 1.06, 0.96], opacity: [0.3, 0.75, 0.3] }}
        transition={{
          duration: 2 + index * 0.45,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    ))}
    <motion.div
      className="absolute left-[8%] right-[8%] h-px"
      style={{
        background: `linear-gradient(90deg, transparent, rgba(${color}, .75), transparent)`,
      }}
      animate={{ top: ["18%", "82%", "18%"], opacity: [0, 1, 0] }}
      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
    />
  </div>
);

export const FRAME_COMPONENTS: React.FC<FrameProps>[] = [
  AuraFrame,
  PlasmaFrame,
  EmberFrame,
  PulseRingFrame,
  WispFrame,
  NexusFrame,
  ShimmerFrame,
  VortexFrame,
  CrystalFrame,
  StormFrame,
  FlareFrame,
  SpiritFrame,
  RadarFrame,
  DitherHaloFrame,
  GlyphFrame,
  SignalFrame,
];

export const FRAME_COUNT = FRAME_COMPONENTS.length;

export function getMonFrame(monId: number): React.FC<FrameProps> {
  const idx = (((monId - 1) % FRAME_COUNT) + FRAME_COUNT) % FRAME_COUNT;
  return FRAME_COMPONENTS[idx] ?? FRAME_COMPONENTS[0] ?? AuraFrame;
}

export const MonFrame = ({
  monId,
  color,
}: {
  monId: number;
  color: string;
}) => {
  const FrameComponent = getMonFrame(monId);
  return <FrameComponent color={color} />;
};
