import { AnimatePresence, motion } from "framer-motion";
import { BookOpen, Lightbulb, Maximize2, MessageCircle, Presentation, RotateCcw, Target, Users, X } from "lucide-react";
import { useAppStore } from "../store/useAppStore";

export function TeacherMode() {
  const teacherOpen = useAppStore((state) => state.teacherOpen);
  const presentationMode = useAppStore((state) => state.presentationMode);
  const toggleTeacher = useAppStore((state) => state.toggleTeacher);
  const resetProgress = useAppStore((state) => state.resetProgress);
  const togglePresentationMode = useAppStore((state) => state.togglePresentationMode);

  return (
    <AnimatePresence>
      {teacherOpen && (
        <motion.div className="teacher-layer" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
          <button type="button" className="teacher-backdrop" onClick={toggleTeacher} aria-label="Cerrar panel docente" />
          <motion.aside
            className="teacher-drawer"
            initial={{ x: "110%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "110%", opacity: 0 }}
            transition={{ type: "spring", stiffness: 220, damping: 26 }}
            role="dialog"
            aria-modal="true"
            aria-label="Panel docente"
          >
          <div className="teacher-head">
            <div>
              <span className="eyebrow">Modo docente</span>
              <h2>Guía de uso</h2>
            </div>
            <button type="button" className="icon-button" onClick={toggleTeacher} aria-label="Cerrar panel docente">
              <X size={24} />
            </button>
          </div>

          <TeacherBlock icon={<Target size={20} />} title="Objetivo de aprendizaje">
            Reconocer y comparar cuerpos geométricos 3D, identificando caras, aristas, vértices, bases, altura,
            superficies curvas y relaciones con objetos del entorno.
          </TeacherBlock>

          <TeacherBlock icon={<Presentation size={20} />} title="Sugerencia con Paperlux">
            Usa roles rotativos: un estudiante manipula, otro cuenta partes, otro explica y otro registra. El curso
            valida o corrige con evidencia en la figura.
          </TeacherBlock>

          <TeacherBlock icon={<Lightbulb size={20} />} title="Inicio breve">
            Muestra cubo, cilindro y esfera. Pregunta: ¿cuáles se apilan mejor?, ¿cuáles ruedan?, ¿cuáles tienen
            esquinas?
          </TeacherBlock>

          <TeacherBlock icon={<MessageCircle size={20} />} title="Discusión oral">
            ¿Qué cambia si giro la figura? ¿Qué partes no veía desde la primera posición? ¿Qué cuerpos tienen bases?
            ¿La esfera tiene una red exacta simple?
          </TeacherBlock>

          <TeacherBlock icon={<Users size={20} />} title="Trabajo colaborativo">
            Abre Modo clase para asignar equipos: caras, aristas, vértices, objetos reales y red geométrica. Cada
            equipo aporta una idea breve.
          </TeacherBlock>

          <TeacherBlock icon={<BookOpen size={20} />} title="Cierre">
            Pide comparar dos cuerpos: uno plano y uno curvo. Deben nombrar al menos una semejanza, una diferencia y un
            objeto cotidiano.
          </TeacherBlock>

          <div className="teacher-actions">
            <button type="button" className="secondary-action" onClick={resetProgress}>
              <RotateCcw size={20} />
              Reiniciar progreso
            </button>
            <button type="button" className="primary-action" onClick={togglePresentationMode}>
              <Presentation size={20} />
              {presentationMode ? "Desactivar presentación" : "Activar presentación"}
            </button>
            <button type="button" className="secondary-action" onClick={requestFullScreen}>
              <Maximize2 size={20} />
              Pantalla completa
            </button>
          </div>
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function TeacherBlock({ icon, title, children }: { icon: JSX.Element; title: string; children: string }) {
  return (
    <section className="teacher-block">
      <h3>
        {icon}
        {title}
      </h3>
      <p>{children}</p>
    </section>
  );
}

function requestFullScreen() {
  if (!document.fullscreenElement) {
    void document.documentElement.requestFullscreen?.();
    return;
  }
  void document.exitFullscreen?.();
}
