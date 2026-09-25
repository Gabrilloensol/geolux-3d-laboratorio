import { motion } from "framer-motion";
import { shapes } from "../data/shapes";
import { useAppStore } from "../store/useAppStore";
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
              onClick={() => {
                playUiSound("select", soundEnabled);
                setSelectedShape(shape.id);
              }}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.035 }}
              aria-pressed={active}
            >
              <span className={`shape-glyph shape-glyph-${shape.id}`} aria-hidden="true" />
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
