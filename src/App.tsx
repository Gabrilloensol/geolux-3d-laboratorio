import { motion } from "framer-motion";
import { BookOpen, GraduationCap, Home, Play, School, Trophy } from "lucide-react";
import { ChallengePanel } from "./components/ChallengePanel";
import { ClassMode } from "./components/ClassMode";
import { GeometryScene } from "./components/GeometryScene";
import { InfoPanel } from "./components/InfoPanel";
import { ShapeSelector } from "./components/ShapeSelector";
import { TeacherMode } from "./components/TeacherMode";
import { TouchToolbar } from "./components/TouchToolbar";
import { useAppStore } from "./store/useAppStore";
import { playUiSound } from "./utils/sound";

export default function App() {
  const screen = useAppStore((state) => state.screen);
  const presentationMode = useAppStore((state) => state.presentationMode);
  const teacherOpen = useAppStore((state) => state.teacherOpen);
  const soundEnabled = useAppStore((state) => state.soundEnabled);
  const setScreen = useAppStore((state) => state.setScreen);
  const resetProgress = useAppStore((state) => state.resetProgress);
  const toggleTeacher = useAppStore((state) => state.toggleTeacher);

  const openExplore = () => {
    playUiSound("mode", soundEnabled);
    setScreen("explore");
  };

  const openChallenge = () => {
    playUiSound("mode", soundEnabled);
    resetProgress();
    setScreen("challenge");
  };

  const openClassMode = () => {
    playUiSound("mode", soundEnabled);
    setScreen("class");
  };

  const openTeacherMode = () => {
    playUiSound("mode", soundEnabled);
    setScreen("explore");
    if (!teacherOpen) toggleTeacher();
  };

  return (
    <div className={`app ${presentationMode ? "presentation-mode" : ""}`}>
      <div className="ambient-grid" aria-hidden="true" />
      {screen === "home" ? (
        <HomeScreen
          onExplore={openExplore}
          onClass={openClassMode}
          onChallenge={openChallenge}
          onTeacher={openTeacherMode}
        />
      ) : (
        <main className="main-shell">
          <header className="top-bar">
            <button
              type="button"
              className="brand-lockup"
              onClick={() => {
                playUiSound("mode", soundEnabled);
                setScreen("home");
              }}
              aria-label="Volver al inicio"
            >
              <span className="brand-mark">G3D</span>
              <span>
                <strong>GeoLux 3D</strong>
                <small>Laboratorio interactivo</small>
              </span>
            </button>
            <div className="top-actions">
              <button type="button" className="top-action" onClick={openExplore}>
                <Home size={20} />
                Explorar
              </button>
              <button type="button" className="top-action" onClick={openClassMode}>
                <School size={20} />
                Clase
              </button>
              <button type="button" className="top-action" onClick={openChallenge}>
                <Trophy size={20} />
                Desafío
              </button>
              <button type="button" className="top-action" onClick={openTeacherMode}>
                <GraduationCap size={20} />
                Docente
              </button>
            </div>
          </header>

          <section className="workspace">
            <ShapeSelector />
            <div className="scene-stage">
              <GeometryScene />
            </div>
            {screen === "challenge" ? <ChallengePanel /> : screen === "class" ? <ClassMode /> : <InfoPanel />}
          </section>

          <TouchToolbar />
        </main>
      )}
      <TeacherMode />
    </div>
  );
}

function HomeScreen({
  onExplore,
  onClass,
  onChallenge,
  onTeacher,
}: {
  onExplore: () => void;
  onClass: () => void;
  onChallenge: () => void;
  onTeacher: () => void;
}) {
  return (
    <main className="home-screen">
      <section className="hero-copy">
        <motion.span
          className="eyebrow"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
        >
          Paperlux listo para tocar
        </motion.span>
        <motion.h1
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.05 }}
        >
          GeoLux 3D
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.12 }}
        >
          Laboratorio interactivo de cuerpos geométricos
        </motion.p>
        <motion.div
          className="hero-actions"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.18 }}
        >
          <button type="button" className="primary-action hero-button" onClick={onExplore}>
            <Play size={24} />
            Iniciar exploración
          </button>
          <button type="button" className="secondary-action hero-button" onClick={onChallenge}>
            <Trophy size={24} />
            Modo desafío
          </button>
          <button type="button" className="secondary-action hero-button" onClick={onClass}>
            <School size={24} />
            Modo clase
          </button>
          <button type="button" className="secondary-action hero-button" onClick={onTeacher}>
            <BookOpen size={24} />
            Modo docente
          </button>
        </motion.div>
        <motion.p
          className="home-credit"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.28 }}
        >
          Desarrollada por <strong>Gabriel Vergara</strong>
        </motion.p>
      </section>
      <motion.section
        className="home-scene"
        initial={{ opacity: 0, scale: 0.94 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <GeometryScene showcase />
      </motion.section>
    </main>
  );
}
