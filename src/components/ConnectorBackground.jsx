"use client";
import { useMemo } from "react";
import { motion } from "framer-motion";
import CircleConnector from "./CircleConnector";

export default function ConnectorBackground() {
  const connectors = useMemo(() => {
    const items = [];
    const width = window.innerWidth;
    const height = window.innerHeight;
    const colors = [
      "rgba(255, 100, 100, 0.8)", // red
      "rgba(100, 200, 255, 0.8)", // blue
      "rgba(185, 245, 86, 0.8)",  // green
      "rgba(255, 180, 60, 0.8)",  // orange
      "rgba(180, 100, 255, 0.8)", // purple
      "rgba(255, 255, 100, 0.8)", // yellow
    ];

    for (let i = 0; i < 90; i++) {
      const x1 = Math.random() * width;
      const y1 = Math.random() * height;
      const x2 = x1 + (Math.random() - 0.5) * 200;
      const y2 = y1 + (Math.random() - 0.5) * 200;
      const color = colors[Math.floor(Math.random() * colors.length)];

      items.push({ x1, y1, x2, y2, color });
    }

    return items;
  }, []);

  return (
    <div className="absolute inset-0 -z-10 overflow-hidden bg-gradient-to-br  from-slate-900 via-cyan-900 to-slate-900 flex flex-col min-h-screen">
      <svg className="w-full h-full">
        {connectors.map((c, i) => (
          <motion.g
            key={i}
            animate={{
              x: [0, (Math.random() - 0.5) * 200, 0],
              y: [0, (Math.random() - 0.5) * 200, 0],
            }}
            transition={{
              duration: 10 + Math.random() * 10,
              repeat: Infinity,
              repeatType: "mirror",
              ease: "easeInOut",
            }}
          >
            <CircleConnector
              startX={c.x1}
              startY={c.y1}
              endX={c.x2}
              endY={c.y2}
              color={c.color}
            />
          </motion.g>
        ))}
      </svg>
    </div>
  );
}
