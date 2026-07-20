import { motion } from "framer-motion";
import type { ShapeData } from "../data/shapes";

interface NetViewerProps {
  shape: ShapeData;
}

type NetPart =
  | { kind: "rect"; x: number; y: number; w: number; h: number; label: string }
  | { kind: "circle"; cx: number; cy: number; r: number; label: string }
  | { kind: "triangle"; points: string; label: string }
  | { kind: "sector"; d: string; label: string }
  | { kind: "petal"; d: string; label: string };

export function NetViewer({ shape }: NetViewerProps) {
  const parts = getNetParts(shape.netType);

  return (
    <section className="net-viewer" aria-label={`Red geométrica de ${shape.name}`}>
      <div className="net-head">
        <span>Red geométrica</span>
        <strong>{shape.netDescription}</strong>
      </div>
      <svg viewBox="0 0 420 270" role="img" aria-label={`Representación de la red de ${shape.name}`}>
        <defs>
          <linearGradient id="netFill" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#9df5ff" stopOpacity="0.82" />
            <stop offset="100%" stopColor="#b49bff" stopOpacity="0.58" />
          </linearGradient>
          <filter id="netGlow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        {parts.map((part, index) => (
          <motion.g
            key={`${shape.netType}-${index}`}
            initial={{ opacity: 0, scale: 0.55, rotate: -8 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ delay: index * 0.055, duration: 0.42, ease: "easeOut" }}
            style={{ transformOrigin: "210px 135px" }}
          >
            <NetShape part={part} />
          </motion.g>
        ))}
      </svg>
    </section>
  );
}

function NetShape({ part }: { part: NetPart }) {
  const common = {
    fill: "url(#netFill)",
    stroke: "#dffcff",
    strokeWidth: 2.2,
    filter: "url(#netGlow)",
  };

  if (part.kind === "rect") {
    return (
      <>
        <rect x={part.x} y={part.y} width={part.w} height={part.h} rx={8} {...common} />
        <NetText x={part.x + part.w / 2} y={part.y + part.h / 2} text={part.label} />
      </>
    );
  }

  if (part.kind === "circle") {
    return (
      <>
        <circle cx={part.cx} cy={part.cy} r={part.r} {...common} />
        <NetText x={part.cx} y={part.cy + 4} text={part.label} />
      </>
    );
  }

  if (part.kind === "triangle") {
    const center = getPointsCenter(part.points);
    return (
      <>
        <polygon points={part.points} {...common} />
        <NetText x={center.x} y={center.y + 4} text={part.label} />
      </>
    );
  }

  if (part.kind === "sector" || part.kind === "petal") {
    return (
      <>
        <path d={part.d} {...common} />
        <NetText x={part.kind === "sector" ? 282 : 210} y={part.kind === "sector" ? 136 : 136} text={part.label} />
      </>
    );
  }

  return null;
}

function NetText({ x, y, text }: { x: number; y: number; text: string }) {
  return (
    <text x={x} y={y} textAnchor="middle" dominantBaseline="middle" fill="#06152c" fontSize="12" fontWeight="800">
      {text}
    </text>
  );
}

function getPointsCenter(points: string) {
  const values = points.split(" ").map((pair) => pair.split(",").map(Number));
  const total = values.reduce(
    (acc, [x, y]) => ({ x: acc.x + x, y: acc.y + y }),
    { x: 0, y: 0 },
  );
  return { x: total.x / values.length, y: total.y / values.length };
}

function getNetParts(type: ShapeData["netType"]): NetPart[] {
  switch (type) {
    case "cube":
      return [
        { kind: "rect", x: 160, y: 105, w: 60, h: 60, label: "cara" },
        { kind: "rect", x: 100, y: 105, w: 60, h: 60, label: "cara" },
        { kind: "rect", x: 220, y: 105, w: 60, h: 60, label: "cara" },
        { kind: "rect", x: 280, y: 105, w: 60, h: 60, label: "cara" },
        { kind: "rect", x: 160, y: 45, w: 60, h: 60, label: "cara" },
        { kind: "rect", x: 160, y: 165, w: 60, h: 60, label: "cara" },
      ];
    case "rectangular-prism":
      return [
        { kind: "rect", x: 70, y: 112, w: 78, h: 54, label: "rect." },
        { kind: "rect", x: 148, y: 112, w: 112, h: 54, label: "rect." },
        { kind: "rect", x: 260, y: 112, w: 78, h: 54, label: "rect." },
        { kind: "rect", x: 148, y: 58, w: 112, h: 54, label: "base" },
        { kind: "rect", x: 148, y: 166, w: 112, h: 54, label: "base" },
        { kind: "rect", x: 338, y: 112, w: 42, h: 54, label: "rect." },
      ];
    case "triangular-prism":
      return [
        { kind: "rect", x: 118, y: 110, w: 64, h: 58, label: "lateral" },
        { kind: "rect", x: 182, y: 110, w: 64, h: 58, label: "lateral" },
        { kind: "rect", x: 246, y: 110, w: 64, h: 58, label: "lateral" },
        { kind: "triangle", points: "118,110 118,168 70,139", label: "base" },
        { kind: "triangle", points: "310,110 310,168 360,139", label: "base" },
      ];
    case "square-pyramid":
      return [
        { kind: "rect", x: 175, y: 105, w: 70, h: 70, label: "base" },
        { kind: "triangle", points: "175,105 245,105 210,48", label: "cara" },
        { kind: "triangle", points: "245,105 245,175 302,140", label: "cara" },
        { kind: "triangle", points: "175,175 245,175 210,232", label: "cara" },
        { kind: "triangle", points: "175,105 175,175 118,140", label: "cara" },
      ];
    case "triangular-pyramid":
      return [
        { kind: "triangle", points: "210,78 154,178 266,178", label: "cara" },
        { kind: "triangle", points: "154,178 98,80 210,78", label: "cara" },
        { kind: "triangle", points: "266,178 322,80 210,78", label: "cara" },
        { kind: "triangle", points: "154,178 266,178 210,238", label: "cara" },
      ];
    case "cylinder":
      return [
        { kind: "circle", cx: 118, cy: 134, r: 42, label: "base" },
        { kind: "rect", x: 168, y: 84, w: 120, h: 100, label: "superficie" },
        { kind: "circle", cx: 338, cy: 134, r: 42, label: "base" },
      ];
    case "cone":
      return [
        { kind: "circle", cx: 122, cy: 146, r: 42, label: "base" },
        { kind: "sector", d: "M214,190 L270,55 A112,112 0 0 1 346,178 Z", label: "sector" },
      ];
    case "sphere":
      return [
        { kind: "petal", d: "M210,38 C168,80 168,190 210,232 C252,190 252,80 210,38 Z", label: "gajo" },
        { kind: "petal", d: "M172,48 C142,88 142,182 172,222 C202,182 202,88 172,48 Z", label: "gajo" },
        { kind: "petal", d: "M248,48 C218,88 218,182 248,222 C278,182 278,88 248,48 Z", label: "gajo" },
        { kind: "petal", d: "M132,70 C106,104 106,166 132,200 C158,166 158,104 132,70 Z", label: "aprox." },
        { kind: "petal", d: "M288,70 C262,104 262,166 288,200 C314,166 314,104 288,70 Z", label: "aprox." },
      ];
    default:
      return [];
  }
}
