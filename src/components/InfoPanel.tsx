import { AnimatePresence, motion } from "framer-motion";
import { Boxes, CheckCircle2, Eye, Lightbulb, Rotate3D } from "lucide-react";
import { getShapeById } from "../data/shapes";
import { useAppStore } from "../store/useAppStore";
import { NetViewer } from "./NetViewer";

export function InfoPanel() {
  const selectedShapeId = useAppStore((state) => state.selectedShapeId);
  const showNet = useAppStore((state) => state.showNet);
  const showRealObject = useAppStore((state) => state.showRealObject);
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
            <span className="eyebrow">Cuerpo geométrico</span>
            <h2>{shape.name}</h2>
            <p>{shape.description}</p>
          </div>

          {showNet && <NetViewer shape={shape} />}

          <section className="focus-card">
            <Lightbulb size={20} aria-hidden="true" />
            <div>
              <span>Idea clave</span>
              <strong>{getCoreIdea(selectedShapeId)}</strong>
            </div>
          </section>

          <div className="metric-grid">
            <Metric label={curved ? "Caras / superficies" : "Caras"} value={shape.faces} />
            <Metric label={curved ? "Aristas / bordes" : "Aristas"} value={shape.edges} />
            <Metric label="Vértices" value={shape.vertices} />
          </div>

          <section className="observe-card">
            <h3>
              <Eye size={18} aria-hidden="true" />
              Observa ahora
            </h3>
            <p>{shape.compareQuestion}</p>
            <small>{shape.bases}</small>
          </section>

          <section className="real-world">
            <h3>
              <Boxes size={18} aria-hidden="true" />
              Objetos cotidianos
            </h3>
            <div className="example-chips">
              {shape.everydayExamples.map((example) => (
                <span key={example}>{example}</span>
              ))}
            </div>
            {showRealObject && (
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="real-object-note">
                {shape.realObjectHint}
              </motion.p>
            )}
          </section>

          <section className="stack-note">
            <CheckCircle2 size={18} aria-hidden="true" />
            <p>{shape.rollStack}</p>
          </section>
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
