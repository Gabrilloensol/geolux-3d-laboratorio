import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Boxes, ChevronDown, Eye, Rotate3D } from "lucide-react";
import { getShapeById } from "../data/shapes";
import { useAppStore } from "../store/useAppStore";
import { NetViewer } from "./NetViewer";

export function InfoPanel() {
  const selectedShapeId = useAppStore((state) => state.selectedShapeId);
  const showNet = useAppStore((state) => state.showNet);
  const showRealObject = useAppStore((state) => state.showRealObject);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const shape = getShapeById(selectedShapeId);
  const curved = selectedShapeId === "cylinder" || selectedShapeId === "cone" || selectedShapeId === "sphere";

  return (
    <aside className="info-panel" aria-label="Información del cuerpo geométrico">
      <AnimatePresence mode="wait">
        <motion.div
          key={shape.id}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.24 }}
          className="panel-stack"
        >
          <div className="info-head">
            <span className="eyebrow">Exploración</span>
            <h2>{shape.name}</h2>
            <p>{getCoreIdea(selectedShapeId)}</p>
          </div>

          <section className="observe-card observation-primary">
            <h3>
              <Eye size={18} aria-hidden="true" />
              Pregunta para conversar
            </h3>
            <p>{shape.compareQuestion}</p>
          </section>

          {showNet && <NetViewer shape={shape} />}

          {showRealObject && (
            <section className="real-world">
              <h3>
                <Boxes size={18} aria-hidden="true" />
                En nuestro entorno
              </h3>
              <p className="real-object-note">{shape.realObjectHint}</p>
              <div className="example-chips">
                {shape.everydayExamples.map((example) => <span key={example}>{example}</span>)}
              </div>
            </section>
          )}

          <button
            type="button"
            className="detail-toggle"
            aria-expanded={detailsOpen}
            aria-controls="shape-details"
            onClick={() => setDetailsOpen((open) => !open)}
          >
            <span>{detailsOpen ? "Ocultar datos" : "Ver datos del cuerpo"}</span>
            <ChevronDown size={20} aria-hidden="true" />
          </button>

          {detailsOpen && (
            <div id="shape-details" className="shape-details">
              <div className="metric-grid">
                <Metric label={curved ? "Caras y superficies" : "Caras"} value={shape.faces} />
                <Metric label={curved ? "Aristas y bordes" : "Aristas"} value={shape.edges} />
                <Metric label="Vértices" value={shape.vertices} />
              </div>
              <dl className="shape-facts">
                <div><dt>Forma</dt><dd>{shape.faceType}</dd></div>
                <div><dt>Bases</dt><dd>{shape.bases}</dd></div>
                <div><dt>Movimiento</dt><dd>{shape.rollStack}</dd></div>
              </dl>
              <p className="detail-description">{shape.description}</p>
              <div className="example-chips" aria-label="Ejemplos cotidianos">
                {shape.everydayExamples.map((example) => <span key={example}>{example}</span>)}
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      <div className="gesture-hint">
        <Rotate3D size={18} aria-hidden="true" />
        <span>Arrastra para girar. Usa pellizco o rueda para acercar.</span>
      </div>
    </aside>
  );
}

function getCoreIdea(shapeId: string) {
  const ideas: Record<string, string> = {
    cube: "6 caras cuadradas, 12 aristas y 8 vértices.",
    "rectangular-prism": "Tiene caras rectangulares opuestas e iguales.",
    "triangular-prism": "Dos bases triangulares unidas por rectángulos.",
    "square-pyramid": "Una base cuadrada y caras triangulares que llegan a una punta.",
    "triangular-pyramid": "Cuatro caras triangulares; no todas las pirámides tienen base cuadrada.",
    cylinder: "Dos bases circulares planas y una superficie curva.",
    cone: "Una base circular, una superficie curva y un vértice.",
    sphere: "No tiene caras planas, aristas ni vértices.",
  };

  return ideas[shapeId] ?? "Observa caras, aristas, vértices y superficies.";
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="metric-card">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}
