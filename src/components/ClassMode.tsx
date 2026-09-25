import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, ChevronLeft, ChevronRight, MessageCircle, MousePointerClick, Users } from "lucide-react";
import {
  type ClassPhase,
  closingQuestions,
  guidedSteps,
  paperluxRoles,
  questionBank,
  reflectionStems,
  starterQuestions,
  teamCards,
} from "../data/classMode";
import { getShapeById } from "../data/shapes";
import { useAppStore } from "../store/useAppStore";
import { NetViewer } from "./NetViewer";

const phaseLabels: Record<ClassPhase, string> = {
  inicio: "Inicio",
  desarrollo: "Desarrollo",
  cierre: "Cierre",
};

export function ClassMode() {
  const [phase, setPhase] = useState<ClassPhase>("inicio");
  const [stepIndex, setStepIndex] = useState(0);
  const selectedShapeId = useAppStore((state) => state.selectedShapeId);
  const showFaces = useAppStore((state) => state.showFaces);
  const showEdges = useAppStore((state) => state.showEdges);
  const showVertices = useAppStore((state) => state.showVertices);
  const showNet = useAppStore((state) => state.showNet);
  const showRealObject = useAppStore((state) => state.showRealObject);
  const setMaterialMode = useAppStore((state) => state.setMaterialMode);
  const toggleFaces = useAppStore((state) => state.toggleFaces);
  const toggleEdges = useAppStore((state) => state.toggleEdges);
  const toggleVertices = useAppStore((state) => state.toggleVertices);
  const toggleNet = useAppStore((state) => state.toggleNet);
  const toggleRealObject = useAppStore((state) => state.toggleRealObject);
  const resetView = useAppStore((state) => state.resetView);
  const shape = getShapeById(selectedShapeId);
  const netRef = useRef<HTMLDivElement>(null);
  const currentStep = guidedSteps[stepIndex];
  const currentQuestion = currentStep.action === "question" ? shape.compareQuestion : currentStep.teacherPrompt;

  useEffect(() => {
    if (showNet) netRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [showNet]);

  function applyStepAction() {
    if (currentStep.action === "reset") resetView();
    if (currentStep.action === "faces") {
      if (!showFaces) toggleFaces();
      setMaterialMode("translucent");
    }
    if (currentStep.action === "edges") {
      if (!showEdges) toggleEdges();
      setMaterialMode("labels");
    }
    if (currentStep.action === "vertices") {
      if (!showVertices) toggleVertices();
      setMaterialMode("labels");
    }
    if (currentStep.action === "net" && !showNet) toggleNet();
    if (currentStep.action === "object" && !showRealObject) toggleRealObject();
  }

  function nextStep() {
    setStepIndex((value) => Math.min(value + 1, guidedSteps.length - 1));
  }

  function previousStep() {
    setStepIndex((value) => Math.max(value - 1, 0));
  }

  return (
    <aside className="class-panel" aria-label="Modo clase">
      <div className="class-head">
        <span className="eyebrow">Modo clase</span>
        <h2>Clase guiada</h2>
      </div>

      <div className="class-tabs" role="tablist" aria-label="Momentos de la clase">
        {(Object.keys(phaseLabels) as ClassPhase[]).map((item) => (
          <button
            key={item}
            type="button"
            className={phase === item ? "is-active" : ""}
            onClick={() => setPhase(item)}
            role="tab"
            aria-selected={phase === item}
          >
            {phaseLabels[item]}
          </button>
        ))}
      </div>

      {phase === "inicio" && <StarterMoment />}
      {phase === "desarrollo" && (
        <DevelopmentMoment
          stepIndex={stepIndex}
          currentStep={currentStep}
          currentQuestion={currentQuestion}
          shapeName={shape.name}
          onApply={applyStepAction}
          onNext={nextStep}
          onPrevious={previousStep}
        />
      )}
      {phase === "cierre" && <ClosingMoment />}
      {showNet && <div ref={netRef} className="class-net-reveal"><NetViewer shape={shape} /></div>}
    </aside>
  );
}

function StarterMoment() {
  const [questionIndex, setQuestionIndex] = useState(0);

  return (
    <motion.div className="class-stack" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <div className="conversation-prompt">
        <span>Pregunta {questionIndex + 1} de {starterQuestions.length}</span>
        <p>{starterQuestions[questionIndex]}</p>
        <button type="button" className="secondary-action" onClick={() => setQuestionIndex((index) => (index + 1) % starterQuestions.length)}>
          Otra pregunta <ChevronRight size={20} aria-hidden="true" />
        </button>
      </div>

      <details className="class-resource">
        <summary>Roles para participar</summary>
        <PaperluxRoles compact />
      </details>
    </motion.div>
  );
}

function DevelopmentMoment({
  stepIndex,
  currentStep,
  currentQuestion,
  shapeName,
  onApply,
  onNext,
  onPrevious,
}: {
  stepIndex: number;
  currentStep: (typeof guidedSteps)[number];
  currentQuestion: string;
  shapeName: string;
  onApply: () => void;
  onNext: () => void;
  onPrevious: () => void;
}) {
  return (
    <motion.div className="class-stack" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <section className="guided-step-card">
        <div className="guided-count">
          Paso {stepIndex + 1} de {guidedSteps.length}
        </div>
        <h3>{currentStep.title}</h3>
        <p>{currentStep.instruction}</p>
        <div className="teacher-prompt" aria-label={`Pregunta sobre ${shapeName}`}>
          <MessageCircle size={18} aria-hidden="true" />
          <span>{currentQuestion}</span>
        </div>
        {!["select", "rotate", "question"].includes(currentStep.action) && (
          <button type="button" className="primary-action class-apply" onClick={onApply}>
            <MousePointerClick size={20} />
            {currentStep.action === "reset" ? "Volver a vista inicial" : currentStep.action === "net" ? "Mostrar red" : currentStep.action === "object" ? "Mostrar ejemplo" : `Mostrar ${currentStep.title.toLowerCase().replace("activar ", "")}`}
          </button>
        )}
        <div className="step-actions">
          <button type="button" className="secondary-action" onClick={onPrevious} disabled={stepIndex === 0}>
            <ChevronLeft size={20} />
            Anterior
          </button>
          <button
            type="button"
            className="primary-action"
            onClick={onNext}
            disabled={stepIndex === guidedSteps.length - 1}
          >
            Siguiente
            <ChevronRight size={20} />
          </button>
        </div>
      </section>

      <details className="class-resource">
        <summary>Misiones para equipos</summary>
        <TeamCards />
      </details>
    </motion.div>
  );
}

function ClosingMoment() {
  const [questionIndex, setQuestionIndex] = useState(0);

  return (
    <motion.div className="class-stack" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <div className="conversation-prompt">
        <span>Pregunta {questionIndex + 1} de {closingQuestions.length}</span>
        <p>{closingQuestions[questionIndex]}</p>
        <button type="button" className="secondary-action" onClick={() => setQuestionIndex((index) => (index + 1) % closingQuestions.length)}>
          Otra pregunta <ChevronRight size={20} aria-hidden="true" />
        </button>
      </div>

      <section className="reflection-card">
        {reflectionStems.map((stem) => (
          <div key={stem}>
            <CheckCircle2 size={18} aria-hidden="true" />
            <span>{stem}</span>
          </div>
        ))}
      </section>

      <details className="class-resource">
        <summary>Banco de preguntas</summary>
        <QuestionBank />
      </details>
    </motion.div>
  );
}

function TeamCards() {
  return (
    <section className="team-block">
      <h3>
        <Users size={18} aria-hidden="true" />
        Equipos
      </h3>
      <div className="team-grid">
        {teamCards.map((card) => (
          <article key={card.team} className="team-card">
            <span>{card.team}</span>
            <strong>{card.mission}</strong>
            <p>{card.focus}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function PaperluxRoles({ compact = false }: { compact?: boolean }) {
  return (
    <section className={compact ? "paperlux-card is-compact" : "paperlux-card"}>
      <h3>
        <MousePointerClick size={18} aria-hidden="true" />
        Roles con Paperlux
      </h3>
      <div>
        {paperluxRoles.map((role) => (
          <span key={role}>{role}</span>
        ))}
      </div>
    </section>
  );
}

function QuestionBank() {
  return (
    <section className="question-bank">
      <h3>Banco de preguntas</h3>
      {questionBank.map((group) => (
        <article key={group.level}>
          <span>
            {group.level}: {group.title}
          </span>
          <p>{group.questions.join(" · ")}</p>
        </article>
      ))}
    </section>
  );
}
