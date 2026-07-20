import {
  Box,
  CircleDot,
  Eye,
  EyeOff,
  Layers,
  Maximize2,
  MousePointerClick,
  Network,
  Pause,
  Play,
  Presentation,
  RotateCcw,
  Shapes,
  Volume2,
  VolumeX,
} from "lucide-react";
import { useAppStore } from "../store/useAppStore";
import { playUiSound } from "../utils/sound";

export function TouchToolbar() {
  const materialMode = useAppStore((state) => state.materialMode);
  const showFaces = useAppStore((state) => state.showFaces);
  const showEdges = useAppStore((state) => state.showEdges);
  const showVertices = useAppStore((state) => state.showVertices);
  const showNet = useAppStore((state) => state.showNet);
  const showRealObject = useAppStore((state) => state.showRealObject);
  const autoRotate = useAppStore((state) => state.autoRotate);
  const guidedView = useAppStore((state) => state.guidedView);
  const soundEnabled = useAppStore((state) => state.soundEnabled);
  const animationsPaused = useAppStore((state) => state.animationsPaused);
  const resetView = useAppStore((state) => state.resetView);
  const cycleMaterialMode = useAppStore((state) => state.cycleMaterialMode);
  const toggleFaces = useAppStore((state) => state.toggleFaces);
  const toggleEdges = useAppStore((state) => state.toggleEdges);
  const toggleVertices = useAppStore((state) => state.toggleVertices);
  const toggleNet = useAppStore((state) => state.toggleNet);
  const toggleRealObject = useAppStore((state) => state.toggleRealObject);
  const toggleAutoRotate = useAppStore((state) => state.toggleAutoRotate);
  const toggleGuidedView = useAppStore((state) => state.toggleGuidedView);
  const toggleSound = useAppStore((state) => state.toggleSound);
  const toggleAnimations = useAppStore((state) => state.toggleAnimations);
  const togglePresentationMode = useAppStore((state) => state.togglePresentationMode);
  const materialLabel = {
    solid: "Sólido",
    translucent: "Translúcido",
    edges: "Aristas",
    labels: "Etiquetas",
  }[materialMode];

  return (
    <nav className="touch-toolbar" aria-label="Herramientas táctiles">
      <div className="toolbar-group" aria-label="Control de vista">
        <span>Vista</span>
        <ToolButton label="Reset" onClick={resetView} icon={<RotateCcw size={24} />} />
        <ToolButton
          label="Girar"
          hint={autoRotate ? "Activo" : "Pausado"}
          onClick={toggleAutoRotate}
          active={autoRotate}
          icon={autoRotate ? <Pause size={24} /> : <Play size={24} />}
        />
        <ToolButton
          label="Guiada"
          hint={guidedView ? "Activa" : "Libre"}
          onClick={toggleGuidedView}
          active={guidedView}
          icon={guidedView ? <Eye size={24} /> : <EyeOff size={24} />}
        />
      </div>

      <div className="toolbar-group toolbar-group-wide" aria-label="Partes geométricas">
        <span>Partes</span>
        <ToolButton label="Material" hint={materialLabel} onClick={cycleMaterialMode} icon={<Layers size={24} />} />
        <ToolButton label="Caras" onClick={toggleFaces} active={showFaces} icon={<Box size={24} />} />
        <ToolButton label="Aristas" onClick={toggleEdges} active={showEdges} icon={<Network size={24} />} />
        <ToolButton label="Vértices" onClick={toggleVertices} active={showVertices} icon={<CircleDot size={24} />} />
        <ToolButton label="Red" hint="Plana" onClick={toggleNet} active={showNet} icon={<Shapes size={24} />} />
      </div>

      <div className="toolbar-group" aria-label="Aula y accesibilidad">
        <span>Aula</span>
        <ToolButton label="Objeto" onClick={toggleRealObject} active={showRealObject} icon={<MousePointerClick size={24} />} />
        <ToolButton
          label="Pausa"
          hint={animationsPaused ? "Sí" : "No"}
          onClick={toggleAnimations}
          active={animationsPaused}
          icon={animationsPaused ? <Play size={24} /> : <Pause size={24} />}
        />
        <ToolButton
          label="Sonido"
          hint={soundEnabled ? "Sí" : "No"}
          onClick={toggleSound}
          active={soundEnabled}
          icon={soundEnabled ? <Volume2 size={24} /> : <VolumeX size={24} />}
        />
        <ToolButton label="Presentar" onClick={togglePresentationMode} icon={<Presentation size={24} />} />
        <ToolButton label="Pantalla" onClick={requestFullScreen} icon={<Maximize2 size={24} />} />
      </div>
    </nav>
  );
}

function ToolButton({
  label,
  icon,
  onClick,
  active = false,
  hint,
}: {
  label: string;
  icon: JSX.Element;
  onClick: () => void;
  active?: boolean;
  hint?: string;
}) {
  const fullLabel = hint ? `${label}: ${hint}` : label;
  const soundEnabled = useAppStore((state) => state.soundEnabled);

  return (
    <button
      type="button"
      className={`tool-button ${active ? "is-active" : ""}`}
      onClick={() => {
        playUiSound("select", soundEnabled);
        onClick();
      }}
      aria-pressed={active}
      aria-label={fullLabel}
      title={fullLabel}
    >
      {icon}
      <span>{label}</span>
      {hint && <small>{hint}</small>}
    </button>
  );
}

function requestFullScreen() {
  if (!document.fullscreenElement) {
    void document.documentElement.requestFullscreen?.();
    return;
  }
  void document.exitFullscreen?.();
}
