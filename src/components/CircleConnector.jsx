// src/components/CircleConnector.jsx
"use client";
import React from "react";
import { motion } from "framer-motion";
export function CircleConnector({
  startX = 0,
  startY = 0,
  endX = 0,
  endY = 0,
  color = "rgba(255,100,100,0.8)",
}) {
  const dx = endX - startX;
  const dy = endY - startY;
  const distance = Math.sqrt(dx * dx + dy * dy) || 0.0001;
  const angle = (Math.atan2(dy, dx) * 180) / Math.PI;
  const circleRadius = 8;
  const lineThickness = 2;

  return (
    <motion.g
      transform={`translate(${startX}, ${startY}) rotate(${angle})`}
      className="pointer-events-none"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.2, ease: "easeOut" }}
    >
      {/* Animated line */}
      <motion.rect
        x={circleRadius}
        y={-lineThickness / 2}
        width={Math.max(0, distance - circleRadius * 2)}
        height={lineThickness}
        rx={1}
        fill={color}
        animate={{ opacity: [0.35, 0.85, 0.35] }}
        transition={{
          repeat: Infinity,
          repeatType: "mirror",
          duration: 3 + Math.random() * 2,
          ease: "easeInOut",
        }}
      />

      {/* Start circle */}
      <motion.circle
        cx="0"
        cy="0"
        r={circleRadius}
        fill={color}
        animate={{
          r: [circleRadius * 0.9, circleRadius * 1.1, circleRadius * 0.9],
          opacity: [0.8, 1, 0.8],
        }}
        transition={{
          repeat: Infinity,
          repeatType: "mirror",
          duration: 2.5 + Math.random() * 1.5,
          ease: "easeInOut",
        }}
      />

      {/* End circle */}
      <motion.circle
        cx={distance}
        cy="0"
        r={circleRadius}
        fill={color}
        animate={{
          r: [circleRadius * 0.9, circleRadius * 1.1, circleRadius * 0.9],
          opacity: [0.8, 1, 0.8],
        }}
        transition={{
          repeat: Infinity,
          repeatType: "mirror",
          duration: 2.5 + Math.random() * 1.5,
          ease: "easeInOut",
        }}
      />
    </motion.g>
  );
}

// also provide a default export to avoid import mismatch errors
export default CircleConnector;
