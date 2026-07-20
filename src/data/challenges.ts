import type { PartTarget, ShapeId } from "../types";

export type ChallengeKind = "choice" | "part" | "action";

export interface ChallengeOption {
  id: string;
  label: string;
  correct: boolean;
}

export interface Challenge {
  id: string;
  kind: ChallengeKind;
  shapeId: ShapeId;
  prompt: string;
  shortInstruction: string;
  targetPart?: PartTarget;
  options?: ChallengeOption[];
  points: number;
  hint: string;
  explanation: string;
  actionCheck?: "transparent-base" | "rotate-bottom" | "real-object";
}

export const correctFeedback =
  "¡Muy bien! Reconociste una característica clave del cuerpo geométrico.";

export const incorrectFeedback =
  "Buen intento. Observa nuevamente la figura y fíjate en sus caras, aristas y vértices.";

export const challenges: Challenge[] = [
  {
    id: "cube-edge",
    kind: "part",
    shapeId: "cube",
    prompt: "Toca una arista del cubo.",
    shortInstruction: "Busca donde se juntan dos caras.",
    targetPart: "edge",
    points: 10,
    hint: "Gira el cuerpo lentamente y observa dónde se juntan dos caras.",
    explanation: "Una arista es el segmento donde se encuentran dos caras del cubo.",
  },
  {
    id: "cube-faces",
    kind: "choice",
    shapeId: "cube",
    prompt: "¿Cuántas caras planas tiene un cubo?",
    shortInstruction: "Elige una alternativa.",
    options: [
      { id: "a", label: "4 caras", correct: false },
      { id: "b", label: "6 caras", correct: true },
      { id: "c", label: "8 caras", correct: false },
    ],
    points: 10,
    hint: "Imagina un dado: cuenta sus lados planos.",
    explanation: "El cubo tiene 6 caras cuadradas iguales.",
  },
  {
    id: "cylinder-bases",
    kind: "choice",
    shapeId: "cylinder",
    prompt: "El cilindro tiene...",
    shortInstruction: "Distingue bases y superficie curva.",
    options: [
      { id: "a", label: "Dos bases circulares y una superficie curva", correct: true },
      { id: "b", label: "Seis caras cuadradas", correct: false },
      { id: "c", label: "Un solo vértice superior", correct: false },
    ],
    points: 10,
    hint: "Piensa en una lata: arriba y abajo son círculos.",
    explanation: "El cilindro tiene dos bases circulares planas y una superficie lateral curva.",
  },
  {
    id: "sphere-no-vertices",
    kind: "choice",
    shapeId: "sphere",
    prompt: "¿Qué cuerpo no tiene vértices?",
    shortInstruction: "Observa si hay esquinas o puntas.",
    options: [
      { id: "a", label: "Pirámide triangular", correct: false },
      { id: "b", label: "Cono", correct: false },
      { id: "c", label: "Esfera", correct: true },
    ],
    points: 10,
    hint: "Busca un cuerpo sin puntas y sin esquinas.",
    explanation: "La esfera no tiene caras planas, aristas ni vértices.",
  },
  {
    id: "cone-vertex",
    kind: "part",
    shapeId: "cone",
    prompt: "Toca el vértice del cono.",
    shortInstruction: "Busca la punta superior.",
    targetPart: "vertex",
    points: 10,
    hint: "El vértice del cono es su punta.",
    explanation: "El cono tiene un vértice y una base circular.",
  },
  {
    id: "milk-carton",
    kind: "choice",
    shapeId: "rectangular-prism",
    prompt: "¿Qué cuerpo geométrico se parece a una caja de leche?",
    shortInstruction: "Relaciona el cuerpo con un objeto cotidiano.",
    options: [
      { id: "a", label: "Prisma rectangular", correct: true },
      { id: "b", label: "Esfera", correct: false },
      { id: "c", label: "Cono", correct: false },
    ],
    points: 10,
    hint: "Observa sus caras rectangulares y cómo se apila.",
    explanation: "Una caja de leche se modela muy bien como un prisma rectangular.",
  },
  {
    id: "square-pyramid-base",
    kind: "part",
    shapeId: "square-pyramid",
    prompt: "Toca la base de la pirámide cuadrangular.",
    shortInstruction: "Busca la cara cuadrada sobre la que se apoya.",
    targetPart: "base",
    points: 10,
    hint: "La base está abajo y tiene forma de cuadrado.",
    explanation: "La pirámide cuadrangular tiene una base cuadrada y cuatro caras triangulares.",
  },
  {
    id: "can-roll",
    kind: "choice",
    shapeId: "cylinder",
    prompt: "¿Cuál de estos cuerpos puede rodar por una superficie curva?",
    shortInstruction: "Piensa en movimiento y estabilidad.",
    options: [
      { id: "a", label: "Cubo", correct: false },
      { id: "b", label: "Cilindro", correct: true },
      { id: "c", label: "Pirámide cuadrangular", correct: false },
    ],
    points: 10,
    hint: "Busca un cuerpo con superficie curva lateral.",
    explanation: "El cilindro puede rodar por su superficie curva.",
  },
  {
    id: "transparent-base",
    kind: "action",
    shapeId: "triangular-prism",
    prompt: "Activa la transparencia y encuentra una base triangular.",
    shortInstruction: "Usa la barra inferior y luego comprueba.",
    actionCheck: "transparent-base",
    points: 10,
    hint: "Cambia el material a translúcido y observa las bases triangulares paralelas.",
    explanation: "La transparencia ayuda a ver la base que queda oculta desde algunas posiciones.",
  },
  {
    id: "rotate-bottom",
    kind: "action",
    shapeId: "rectangular-prism",
    prompt: "Gira la figura hasta ver su cara inferior.",
    shortInstruction: "Arrastra la escena con el lápiz, el dedo o el mouse.",
    actionCheck: "rotate-bottom",
    points: 10,
    hint: "Arrastra lentamente hacia arriba o hacia abajo para cambiar el punto de vista.",
    explanation: "Al girar el cuerpo aparecen partes que no se veían desde la primera posición.",
  },
];
