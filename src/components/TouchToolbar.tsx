import { useState } from "react";
import {
  Box,
  ChevronDown,
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
  SlidersHorizontal,
  Volume2,
  VolumeX,
} from "lucide-react";
import { useAppStore } from "../store/useAppStore";
import { playUiSound } from "../utils/sound";

export function TouchToolbar() {
  const [moreOpen, setMoreOpen] = useState(false);
  const selectedShapeId = useAppStore((state) => state.selectedShapeId);
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
  const presentationMode = useAppStore((state) => state.presentationMode);
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
  const hasEdges = selectedShapeId !== "sphere";
  const hasVertices = selectedShapeId !== "sphere" && selectedShapeId !== "cylinder";

  return (
    <div className="touch-toolbar">
      <nav className="toolbar-primary" aria-label="Herramientas de geometría">
        <ToolButton label="Material" hint={materialLabel} onClick={cycleMaterialMode} icon={<Layers size={24} />} />
        <ToolButton label={selectedShapeId === "sphere" ? "Superficie" : "Caras"} onClick={toggleFaces} active={showFaces} icon={<Box size={24} />} />
        <ToolButton label={hasEdges ? "Aristas" : "Sin aristas"} onClick={toggleEdges} active={showEdges && hasEdges} disabled={!hasEdges} icon={<Network size={24} />} />
        <ToolButton label={hasVertices ? "Vértices" : "Sin vértices"} onClick={toggleVertices} active={showVertices && hasVertices} disabled={!hasVertices} icon={<CircleDot size={24} />} />
        <ToolButton label="Red" onClick={toggleNet} active={showNet} icon={<Shapes size={24} />} />
        <ToolButton label="Objeto" onClick={toggleRealObject} active={showRealObject} icon={<MousePointerClick size={24} />} />
        <button
          type="button"
          className={`tool-button more-tools-button ${moreOpen ? "is-active" : ""}`}
          onClick={() => setMoreOpen((open) => !open)}
          aria-expanded={moreOpen}
          aria-controls="toolbar-extra"
          aria-label={moreOpen ? "Ocultar más herramientas" : "Mostrar más herramientas"}
        >
          <SlidersHorizontal size={24} aria-hidden="true" />
          <span>Más</span>
          <ChevronDown size={15} aria-hidden="true" />
        </button>
      </nav>
      {moreOpen && (
        <nav id="toolbar-extra" className="toolbar-extra" aria-label="Más herramientas">
          <ToolButton label="Reset" onClick={resetView} icon={<RotateCcw size={24} />} />
          <ToolButton label="Girar" hint={autoRotate ? "Activo" : "Pausado"} onClick={toggleAutoRotate} active={autoRotate} icon={autoRotate ? <Pause size={24} /> : <Play size={24} />} />
          <ToolButton label="Guiada" hint={guidedView ? "Activa" : "Libre"} onClick={toggleGuidedView} active={guidedView} icon={guidedView ? <Eye size={24} /> : <EyeOff size={24} />} />
          <ToolButton label="Pausa" hint={animationsPaused ? "Sí" : "No"} onClick={toggleAnimations} active={animationsPaused} icon={animationsPaused ? <Play size={24} /> : <Pause size={24} />} />
          <ToolButton label="Sonido" hint={soundEnabled ? "Sí" : "No"} onClick={toggleSound} active={soundEnabled} icon={soundEnabled ? <Volume2 size={24} /> : <VolumeX size={24} />} />
          <ToolButton label="Presentar" onClick={togglePresentationMode} active={presentationMode} icon={<Presentation size={24} />} />
          <ToolButton label="Pantalla" onClick={requestFullScreen} icon={<Maximize2 size={24} />} />
        </nav>
      )}
    </div>
  );
}

function ToolButton({
  label,
  icon,
  onClick,
  active = false,
  disabled = false,
  hint,
}: {
  label: string;
  icon: JSX.Element;
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
  hint?: string;
}) {
  const fullLabel = hint ? `${label}: ${hint}` : label;
  const soundEnabled = useAppStore((state) => state.soundEnabled);

  return (
    <button
      type="button"
      className={`tool-button ${active ? "is-active" : ""}`}
      disabled={disabled}
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
