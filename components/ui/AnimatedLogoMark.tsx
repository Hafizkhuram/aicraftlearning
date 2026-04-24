"use client";

import { motion, useReducedMotion } from "framer-motion";

type AnimatedLogoMarkProps = {
  className?: string;
  ariaLabel?: string;
};

const satellites = [
  { cx: 70, cy: 12, r: 8, color: "var(--color-accent-green)", x1: 50, y1: 28, x2: 64, y2: 16, delay: 0 },
  { cx: 70, cy: 76, r: 8, color: "var(--color-accent-green)", x1: 50, y1: 60, x2: 64, y2: 72, delay: 0.6 },
  { cx: 18, cy: 12, r: 8, color: "var(--color-deep-green)", x1: 38, y1: 28, x2: 24, y2: 16, delay: 0.3 },
  { cx: 18, cy: 76, r: 8, color: "var(--color-deep-green)", x1: 38, y1: 60, x2: 24, y2: 72, delay: 0.9 },
];

export function AnimatedLogoMark({ className, ariaLabel = "AICraft circuit-node mark" }: AnimatedLogoMarkProps) {
  const reduce = useReducedMotion();

  return (
    <div className={className} aria-hidden={!ariaLabel} role="img" aria-label={ariaLabel}>
      <motion.svg
        viewBox="0 0 88 88"
        xmlns="http://www.w3.org/2000/svg"
        className="h-full w-full"
        initial={reduce ? false : { opacity: 0, scale: 0.96 }}
        animate={reduce ? undefined : { opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <defs>
          <radialGradient id="hub-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="var(--color-accent-green)" stopOpacity="0.45" />
            <stop offset="70%" stopColor="var(--color-primary-green)" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Soft halo behind the central hub */}
        <motion.circle
          cx={44}
          cy={44}
          r={28}
          fill="url(#hub-glow)"
          animate={
            reduce
              ? undefined
              : {
                  opacity: [0.55, 0.85, 0.55],
                }
          }
          transition={{ duration: 6, ease: "easeInOut", repeat: Infinity }}
        />

        {/* Connection lines */}
        {satellites.map((s, i) => (
          <line
            key={`line-${i}`}
            x1={s.x1}
            y1={s.y1}
            x2={s.x2}
            y2={s.y2}
            stroke={s.color}
            strokeWidth={2}
            strokeLinecap="round"
            opacity={0.85}
          />
        ))}

        {/* Satellite nodes — gentle pulse */}
        {satellites.map((s, i) => (
          <motion.circle
            key={`node-${i}`}
            cx={s.cx}
            cy={s.cy}
            r={s.r}
            fill={s.color}
            animate={
              reduce
                ? undefined
                : {
                    scale: [1, 1.08, 1],
                    opacity: [0.85, 1, 0.85],
                  }
            }
            transition={{
              duration: 3.6,
              ease: "easeInOut",
              repeat: Infinity,
              delay: s.delay,
            }}
            style={{ transformOrigin: `${s.cx}px ${s.cy}px` }}
          />
        ))}

        {/* Central AI hub */}
        <circle cx={44} cy={44} r={18} fill="var(--color-primary-green)" />
        <text
          x={44}
          y={49.5}
          textAnchor="middle"
          fontFamily="var(--font-body)"
          fontWeight={700}
          fontSize={16}
          fill="#FFFFFF"
          letterSpacing="-0.5"
        >
          AI
        </text>
      </motion.svg>
    </div>
  );
}
