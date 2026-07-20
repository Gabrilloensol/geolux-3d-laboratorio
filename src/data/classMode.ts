export type ClassPhase = "inicio" | "desarrollo" | "cierre";

export const starterQuestions = [
  "¿Dónde vemos cuerpos geométricos en la vida diaria?",
  "¿Qué diferencia hay entre una figura plana y un cuerpo geométrico?",
  "¿Qué creen que pasará si desplegamos este cuerpo?",
  "¿Qué partes podemos observar al girarlo?",
];

export const guidedSteps = [
  {
    title: "Elegir cuerpo",
    instruction: "Un estudiante toca un cuerpo en el selector.",
    teacherPrompt: "Antes de moverlo, predigan qué partes tendrá.",
    action: "select",
  },
  {
    title: "Vista inicial",
    instruction: "Miren la figura quieta por unos segundos.",
    teacherPrompt: "¿Qué partes se ven y cuáles podrían estar ocultas?",
    action: "reset",
  },
  {
    title: "Girar lento",
    instruction: "Giren con el lápiz Paperlux, sin apuro.",
    teacherPrompt: "Nombren una parte nueva que apareció al girar.",
    action: "rotate",
  },
  {
    title: "Activar caras",
    instruction: "Iluminen las caras o superficies del cuerpo.",
    teacherPrompt: "¿Son planas, curvas o ambas?",
    action: "faces",
  },
  {
    title: "Activar aristas",
    instruction: "Observen dónde se unen dos caras.",
    teacherPrompt: "¿Todas las aristas son rectas? ¿Hay bordes curvos?",
    action: "edges",
  },
  {
    title: "Activar vértices",
    instruction: "Busquen puntos donde se juntan aristas.",
    teacherPrompt: "¿Este cuerpo tiene puntas o no?",
    action: "vertices",
  },
  {
    title: "Mostrar red",
    instruction: "Desplieguen la red geométrica.",
    teacherPrompt: "¿Cómo se conecta la red plana con el cuerpo 3D?",
    action: "net",
  },
  {
    title: "Objeto real",
    instruction: "Relacionen el cuerpo con un objeto cercano.",
    teacherPrompt: "¿Qué objeto de la sala se parece a este cuerpo?",
    action: "object",
  },
  {
    title: "Responder",
    instruction: "Un equipo explica una idea en voz alta.",
    teacherPrompt: "Usen las palabras cara, arista, vértice, base o superficie.",
    action: "question",
  },
] as const;

export const closingQuestions = [
  "¿Qué cuerpo geométrico fue más fácil de reconocer?",
  "¿Cuál fue más difícil?",
  "¿Qué aprendiste al girar las figuras?",
  "¿Qué relación encontraste entre la red plana y el cuerpo 3D?",
  "¿Qué objeto de tu entorno se parece a un prisma, cilindro, cono o esfera?",
];

export const reflectionStems = [
  "Hoy aprendí que...",
  "Todavía necesito practicar...",
  "Un ejemplo de mi entorno es...",
];

export const teamCards = [
  { team: "Equipo 1", mission: "Busca caras", focus: "Cuenta y describe caras planas o superficies curvas." },
  { team: "Equipo 2", mission: "Busca aristas", focus: "Señala dónde se unen dos caras o aparecen bordes." },
  { team: "Equipo 3", mission: "Busca vértices", focus: "Identifica puntas y explica si el cuerpo no tiene." },
  { team: "Equipo 4", mission: "Objeto real", focus: "Relaciona el cuerpo con algo del entorno." },
  { team: "Equipo 5", mission: "Explica la red", focus: "Conecta el despliegue plano con el cuerpo 3D." },
];

export const paperluxRoles = [
  "Un estudiante manipula la figura.",
  "Otro cuenta caras, aristas o vértices.",
  "Otro explica en voz alta.",
  "Otro registra la respuesta.",
  "El curso valida o corrige.",
];

export const questionBank = [
  {
    level: "Nivel 1",
    title: "Reconocer",
    questions: ["¿Cómo se llama este cuerpo?", "¿Tiene caras planas?", "¿Puede rodar?", "¿Tiene vértices?"],
  },
  {
    level: "Nivel 2",
    title: "Describir",
    questions: ["¿Cuántas caras tiene?", "¿Qué forma tienen sus caras?", "¿Dónde están sus bases?", "¿Qué ocurre al girarlo?"],
  },
  {
    level: "Nivel 3",
    title: "Comparar y explicar",
    questions: [
      "¿En qué se parece un cubo a un prisma rectangular?",
      "¿En qué se diferencia una pirámide de un prisma?",
      "¿Por qué el cilindro puede rodar?",
      "¿Por qué la esfera no tiene aristas?",
    ],
  },
];
