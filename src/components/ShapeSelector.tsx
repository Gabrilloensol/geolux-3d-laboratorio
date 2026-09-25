import { motion } from "framer-motion";
import { shapes } from "../data/shapes";
import { useAppStore } from "../store/useAppStore";
import type { ShapeId } from "../types";
import { playUiSound } from "../utils/sound";

export function ShapeSelector() {
  const selectedShapeId = useAppStore((state) => state.selectedShapeId);
  const soundEnabled = useAppStore((state) => state.soundEnabled);
  const setSelectedShape = useAppStore((state) => state.setSelectedShape);

  return (
    <aside className="shape-selector" aria-label="Selector de cuerpos geométricos">
      <div className="panel-title">
        <span>Elige un cuerpo</span>
        <strong>8 cuerpos</strong>
      </div>
      <div className="shape-list">
        {shapes.map((shape, index) => {
          const active = selectedShapeId === shape.id;
          return (
            <motion.button
              key={shape.id}
              type="button"
              className={`shape-button ${active ? "is-active" : ""}`}
              data-shape={shape.id}
              onClick={() => {
                playUiSound("select", soundEnabled);
                setSelectedShape(shape.id);
              }}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.035 }}
              aria-pressed={active}
            >
              <ShapeGlyph shapeId={shape.id} />
              <span>
                <strong>{shape.shortName}</strong>
              </span>
            </motion.button>
          );
        })}
      </div>
    </aside>
  );
}

function ShapeGlyph({ shapeId }: { shapeId: ShapeId }) {
  let outline: JSX.Element;

  switch (shapeId) {
    case "cube":
      outline = <><path d="M8 15 17 8h23v25l-9 7H8z" /><path d="M8 15h23v25M31 15l9-7M31 15V40M8 15l9-7" /></>;
      break;
    case "rectangular-prism":
      outline = <><path d="M5 18 15 10h29v22l-10 8H5z" /><path d="M5 18h29v22M34 18l10-8M5 18l10-8" /></>;
      break;
    case "triangular-prism":
      outline = <><path d="M5 36 18 12l13 24zM18 12l10-7 15 24-12 7M5 36l12-7M17 29l11-24" /></>;
      break;
    case "square-pyramid":
      outline = <><path d="M6 33 22 41l21-9-17-8zM25 5 6 33M25 5l16 27M25 5 22 41" /></>;
      break;
    case "triangular-pyramid":
      outline = <><path d="M5 35 26 41l18-12-19-7zM25 5 5 35M25 5l21 24M25 5l-1 36" /></>;
      break;
    case "cylinder":
      outline = <><ellipse cx="24" cy="11" rx="17" ry="6" /><path d="M7 11v25c0 3 8 6 17 6s17-3 17-6V11M7 36c0 3 8 6 17 6s17-3 17-6" /></>;
      break;
    case "cone":
      outline = <><path d="M24 5 6 38M24 5l18 33" /><ellipse cx="24" cy="38" rx="18" ry="6" /></>;
      break;
    case "sphere":
      outline = <><circle cx="24" cy="24" r="18" /><path d="M12 17c2-4 5-6 9-7" strokeOpacity="0.7" /></>;
      break;
  }

  return (
    <svg className="shape-icon" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" strokeLinecap="round" aria-hidden="true">
      {outline}
    </svg>
  );
}
