import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Lightbulb, Rotate3D, Trophy, XCircle } from "lucide-react";
import { type Challenge, challenges } from "../data/challenges";
import { getShapeById } from "../data/shapes";
import { useAppStore } from "../store/useAppStore";
import { playUiSound } from "../utils/sound";
import { ProgressBar } from "./ProgressBar";
import { NetViewer } from "./NetViewer";

type Feedback = {
  correct: boolean;
  title: string;
  message: string;
};

export function ChallengePanel() {
  const challengeIndex = useAppStore((state) => state.challengeIndex);
  const score = useAppStore((state) => state.score);
  const correctAnswers = useAppStore((state) => state.correctAnswers);
  const materialMode = useAppStore((state) => state.materialMode);
  const sceneInteractionCount = useAppStore((state) => state.sceneInteractionCount);
  const lastPartSelection = useAppStore((state) => state.lastPartSelection);
  const soundEnabled = useAppStore((state) => state.soundEnabled);
  const showNet = useAppStore((state) => state.showNet);
  const setSelectedShape = useAppStore((state) => state.setSelectedShape);
  const setMaterialMode = useAppStore((state) => state.setMaterialMode);
  const addChallengeResult = useAppStore((state) => state.addChallengeResult);
  const nextChallenge = useAppStore((state) => state.nextChallenge);
  const resetProgress = useAppStore((state) => state.resetProgress);
  const setScreen = useAppStore((state) => state.setScreen);

  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [completed, setCompleted] = useState(false);
  const handledPartNonce = useRef(0);
  const initialInteractionCount = useRef(sceneInteractionCount);
  const netRef = useRef<HTMLDivElement>(null);

  const current = challenges[challengeIndex];

  useEffect(() => {
    if (!current) return;
    setSelectedShape(current.shapeId);
    setFeedback(null);
    setSelectedOption(null);
    setCompleted(false);
    handledPartNonce.current = lastPartSelection?.nonce ?? 0;
    initialInteractionCount.current = sceneInteractionCount;
    if (current.actionCheck === "transparent-base") {
      setMaterialMode("solid");
    }
  }, [challengeIndex, current?.id, setMaterialMode, setSelectedShape]);

  useEffect(() => {
    if (!current || current.kind !== "part" || !lastPartSelection) return;
    if (lastPartSelection.nonce === handledPartNonce.current) return;
    handledPartNonce.current = lastPartSelection.nonce;
    resolveAnswer(lastPartSelection.part === current.targetPart);
  }, [current, lastPartSelection]);

  useEffect(() => {
    if (showNet) netRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [showNet]);

  if (!current) {
    return (
      <aside className="challenge-panel final-panel" aria-label="Resumen final del desafío">
        <Trophy size={40} aria-hidden="true" />
        <span className="eyebrow">Desafío completado</span>
        <h2>Resumen de logros</h2>
        <ProgressBar value={correctAnswers} max={challenges.length} label="Respuestas correctas" />
        <div className="score-card">
          <span>Puntaje acumulado</span>
          <strong>{score} puntos</strong>
        </div>
        <p>
          Lograste observar, comparar y reconocer características de cuerpos planos y curvos. Para mejorar,
          vuelve a explorar las redes y explica en voz alta qué cambia al girar cada cuerpo.
        </p>
        <div className="panel-actions">
          <button type="button" className="primary-action" onClick={resetProgress}>
            Reiniciar desafío
          </button>
          <button type="button" className="secondary-action" onClick={() => setScreen("explore")}>
            Volver a explorar
          </button>
        </div>
      </aside>
    );
  }

  const shape = getShapeById(current.shapeId);
  const progressValue = challengeIndex + (completed ? 1 : 0);

  function resolveAnswer(correct: boolean) {
    if (!current || completed) return;
    setFeedback({
      correct,
      title: correct ? "Respuesta correcta" : "Revisa otra vez",
      message: correct ? getCorrectMessage(current) : getTeachingHint(current),
    });
    playUiSound(correct ? "success" : "softError", soundEnabled);
    if (correct) {
      setCompleted(true);
      addChallengeResult(true, current.points);
    }
  }

  function checkAction() {
    if (!current?.actionCheck) return;
    const correct =
      (current.actionCheck === "transparent-base" && materialMode === "translucent") ||
      (current.actionCheck === "rotate-bottom" && sceneInteractionCount > initialInteractionCount.current) ||
      current.actionCheck === "real-object";
    resolveAnswer(correct);
  }

  return (
    <aside className="challenge-panel" aria-label="Modo desafío">
      <div className="challenge-top">
        <span className="eyebrow">Modo desafío</span>
        <strong>{score} puntos</strong>
      </div>

      <ProgressBar value={progressValue} max={challenges.length} label="Avance" />

      <motion.div
        key={current.id}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.22 }}
        className="challenge-card"
      >
        <span className="shape-chip">{shape.name}</span>
        <h2>{current.prompt}</h2>

        {current.kind === "choice" && (
          <div className="answer-list">
            {current.options?.map((option) => {
              const selected = selectedOption === option.id;
              const showCorrect = completed && option.correct;
              const showWrong = selected && feedback?.correct === false && !option.correct;
              return (
                <button
                  key={option.id}
                  type="button"
                  className={`answer-button ${selected ? "is-selected" : ""} ${showCorrect ? "is-correct" : ""} ${
                    showWrong ? "is-wrong" : ""
                  }`}
                  onClick={() => {
                    setSelectedOption(option.id);
                    resolveAnswer(option.correct);
                  }}
                  disabled={completed}
                >
                  <span aria-hidden="true">
                    {showCorrect ? <CheckCircle2 size={20} /> : showWrong ? <XCircle size={20} /> : null}
                  </span>
                  {option.label}
                </button>
              );
            })}
          </div>
        )}

        {current.kind === "part" && (
          <div className="touch-task">
            <Rotate3D size={26} aria-hidden="true" />
            <p>
              Toca un punto luminoso de tipo <strong>{getPartName(current.targetPart)}</strong> en la figura 3D.
            </p>
          </div>
        )}

        {current.kind === "action" && (
          <div className="action-task">
            <Lightbulb size={24} aria-hidden="true" />
            <p>{current.hint}</p>
            <button type="button" className="primary-action" onClick={checkAction} disabled={completed}>
              Comprobar acción
            </button>
          </div>
        )}
      </motion.div>

      {showNet && <div ref={netRef} className="challenge-net-reveal"><NetViewer shape={shape} /></div>}

      {feedback && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`feedback ${feedback.correct ? "is-correct" : "is-wrong"}`}
          role="status"
        >
          {feedback.correct && <span className="feedback-light" aria-hidden="true" />}
          {feedback.correct ? <CheckCircle2 size={22} aria-hidden="true" /> : <XCircle size={22} aria-hidden="true" />}
          <div>
            <strong>{feedback.title}</strong>
            <p>{feedback.message}</p>
          </div>
        </motion.div>
      )}

      <div className="panel-actions">
        <button type="button" className="secondary-action" onClick={() => setScreen("explore")}>
          Explorar libremente
        </button>
        <button type="button" className="primary-action" onClick={nextChallenge} disabled={!completed}>
          Siguiente
        </button>
      </div>
    </aside>
  );
}

function getPartName(part?: string) {
  const names: Record<string, string> = {
    face: "cara",
    edge: "arista",
    vertex: "vértice",
    base: "base",
    surface: "superficie curva",
    "real-object": "objeto real",
  };

  return part ? names[part] ?? part : "parte";
}

function getCorrectMessage(challenge: Challenge) {
  if (challenge.id === "sphere-no-vertices") {
    return "Muy bien. La esfera no tiene caras planas, por eso no podemos contar vértices ni aristas.";
  }
  if (challenge.targetPart === "edge") {
    return "Correcto. Esa parte es una arista porque se forma donde se unen dos caras.";
  }
  if (challenge.targetPart === "vertex") {
    return "Correcto. Ese vértice es una punta donde se encuentran aristas.";
  }
  return `¡Muy bien! ${challenge.explanation}`;
}

function getTeachingHint(challenge: Challenge) {
  if (challenge.targetPart === "edge") {
    return "Observa nuevamente. Una arista es la línea donde se unen dos caras.";
  }
  if (challenge.targetPart === "vertex") {
    return "Observa nuevamente. Un vértice es el punto donde se juntan varias aristas.";
  }
  if (challenge.targetPart === "base") {
    return "Observa nuevamente. La base es la cara sobre la que el cuerpo puede apoyarse.";
  }
  if (challenge.id === "sphere-no-vertices") {
    return "Recuerda: la esfera es completamente curva; no tiene puntas ni aristas.";
  }
  if (challenge.id === "cylinder-bases") {
    return "Mira como una lata: tiene dos bases circulares planas y una superficie curva.";
  }
  return `Buen intento. ${challenge.hint}`;
}
