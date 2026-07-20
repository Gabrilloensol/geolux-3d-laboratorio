import type { ShapeId, Vec3 } from "../types";

export type NetType =
  | "cube"
  | "rectangular-prism"
  | "triangular-prism"
  | "square-pyramid"
  | "triangular-pyramid"
  | "cylinder"
  | "cone"
  | "sphere";

export interface ShapeLabel {
  text: string;
  position: Vec3;
}

export interface ShapeData {
  id: ShapeId;
  name: string;
  shortName: string;
  description: string;
  faces: string;
  edges: string;
  vertices: string;
  faceType: string;
  bases: string;
  everydayExamples: string[];
  pedagogy: string;
  compareQuestion: string;
  rollStack: string;
  netType: NetType;
  netDescription: string;
  realObjectHint: string;
  labels: ShapeLabel[];
  vertexPoints: Vec3[];
  edgePoints: Vec3[];
  basePoints: Vec3[];
}

const boxVertices = (x: number, y: number, z: number): Vec3[] => [
  [-x, -y, -z],
  [x, -y, -z],
  [x, y, -z],
  [-x, y, -z],
  [-x, -y, z],
  [x, -y, z],
  [x, y, z],
  [-x, y, z],
];

const boxEdges = (x: number, y: number, z: number): Vec3[] => [
  [0, -y, -z],
  [0, y, -z],
  [0, -y, z],
  [0, y, z],
  [-x, 0, -z],
  [x, 0, -z],
  [-x, 0, z],
  [x, 0, z],
  [-x, -y, 0],
  [x, -y, 0],
  [-x, y, 0],
  [x, y, 0],
];

const triTop: Vec3[] = [
  [0, 0.92, 1.02],
  [-0.92, 0.92, -0.56],
  [0.92, 0.92, -0.56],
];

const triBottom: Vec3[] = triTop.map(([x, _y, z]) => [x, -0.92, z]);

const triPrismVertices: Vec3[] = [...triTop, ...triBottom];

const triPrismEdges: Vec3[] = [
  [0, 0.92, 0.23],
  [-0.46, 0.92, 0.23],
  [0.46, 0.92, 0.23],
  [0, -0.92, 0.23],
  [-0.46, -0.92, 0.23],
  [0.46, -0.92, 0.23],
  [0, 0, 1.02],
  [-0.92, 0, -0.56],
  [0.92, 0, -0.56],
];

const squarePyramidVertices: Vec3[] = [
  [-0.95, -0.82, -0.95],
  [0.95, -0.82, -0.95],
  [0.95, -0.82, 0.95],
  [-0.95, -0.82, 0.95],
  [0, 1.02, 0],
];

const squarePyramidEdges: Vec3[] = [
  [0, -0.82, -0.95],
  [0.95, -0.82, 0],
  [0, -0.82, 0.95],
  [-0.95, -0.82, 0],
  [-0.48, 0.1, -0.48],
  [0.48, 0.1, -0.48],
  [0.48, 0.1, 0.48],
  [-0.48, 0.1, 0.48],
];

const tetraVertices: Vec3[] = [
  [0, 1.06, 0],
  [-1.02, -0.72, 0.72],
  [1.02, -0.72, 0.72],
  [0, -0.72, -1.08],
];

const tetraEdges: Vec3[] = [
  [0, -0.72, 0.72],
  [-0.51, -0.72, -0.18],
  [0.51, -0.72, -0.18],
  [-0.51, 0.17, 0.36],
  [0.51, 0.17, 0.36],
  [0, 0.17, -0.54],
];

export const shapes: ShapeData[] = [
  {
    id: "cube",
    name: "Cubo",
    shortName: "Cubo",
    description: "Cuerpo formado por seis caras cuadradas iguales. Todas sus aristas tienen la misma medida.",
    faces: "6 caras planas",
    edges: "12 aristas rectas",
    vertices: "8 vértices",
    faceType: "Caras cuadradas congruentes",
    bases: "Puede apoyarse sobre cualquiera de sus caras cuadradas",
    everydayExamples: ["Dado", "Caja cúbica", "Cubo Rubik"],
    pedagogy:
      "Invita a comparar: al girarlo, cambian las caras visibles, pero sus medidas y relaciones se mantienen.",
    compareQuestion: "¿Qué partes no veías antes de girarlo?",
    rollStack: "Se apila muy bien y no rueda porque todas sus caras son planas.",
    netType: "cube",
    netDescription: "Se despliega en seis cuadrados unidos por sus lados.",
    realObjectHint: "Un dado permite observar caras opuestas y vértices con mucha claridad.",
    labels: [
      { text: "cara cuadrada", position: [0, 0, 1.12] },
      { text: "arista", position: [0.9, 0.9, 0] },
      { text: "vértice", position: [1.08, 1.08, 1.08] },
    ],
    vertexPoints: boxVertices(0.9, 0.9, 0.9),
    edgePoints: boxEdges(0.9, 0.9, 0.9),
    basePoints: [[0, -0.94, 0]],
  },
  {
    id: "rectangular-prism",
    name: "Prisma rectangular",
    shortName: "Prisma rect.",
    description: "Cuerpo con seis caras rectangulares. Las caras opuestas son paralelas e iguales.",
    faces: "6 caras planas",
    edges: "12 aristas rectas",
    vertices: "8 vértices",
    faceType: "Caras rectangulares; algunas pueden ser cuadradas",
    bases: "Tiene pares de bases rectangulares según la posición en que se apoye",
    everydayExamples: ["Caja de leche", "Libro", "Ladrillo"],
    pedagogy:
      "Sirve para conectar geometría con empaques y objetos que se apilan, guardan y ocupan espacio.",
    compareQuestion: "¿En qué se parece y en qué se diferencia de un cubo?",
    rollStack: "Se apila muy bien; sus caras planas dan estabilidad.",
    netType: "rectangular-prism",
    netDescription: "Su red muestra rectángulos de distintos tamaños conectados.",
    realObjectHint: "Una caja de leche ayuda a reconocer bases y caras laterales.",
    labels: [
      { text: "cara rectangular", position: [0, 0, 0.76] },
      { text: "base", position: [0, -0.84, 0] },
      { text: "altura", position: [1.38, 0, 0] },
    ],
    vertexPoints: boxVertices(1.18, 0.68, 0.56),
    edgePoints: boxEdges(1.18, 0.68, 0.56),
    basePoints: [[0, -0.72, 0]],
  },
  {
    id: "triangular-prism",
    name: "Prisma triangular",
    shortName: "Prisma tri.",
    description: "Cuerpo con dos bases triangulares iguales y tres caras laterales rectangulares.",
    faces: "5 caras planas",
    edges: "9 aristas rectas",
    vertices: "6 vértices",
    faceType: "Dos triángulos y tres rectángulos",
    bases: "Dos bases triangulares paralelas",
    everydayExamples: ["Carpa", "Techo triangular", "Cuña"],
    pedagogy:
      "Permite distinguir bases de caras laterales y observar cómo una figura plana se extiende en profundidad.",
    compareQuestion: "¿Qué cambia si miras el prisma desde una base triangular?",
    rollStack: "Puede apoyarse establemente sobre caras planas, pero no rueda como un cilindro.",
    netType: "triangular-prism",
    netDescription: "Se abre en dos triángulos y tres rectángulos.",
    realObjectHint: "Una carpa tipo A muestra claramente las bases triangulares.",
    labels: [
      { text: "base triangular", position: [0, 1.08, 0.25] },
      { text: "cara lateral", position: [0, 0, 1.16] },
      { text: "arista", position: [0.98, 0, -0.58] },
    ],
    vertexPoints: triPrismVertices,
    edgePoints: triPrismEdges,
    basePoints: [[0, 0.98, 0.1], [0, -0.98, 0.1]],
  },
  {
    id: "square-pyramid",
    name: "Pirámide cuadrangular",
    shortName: "Pirámide cuad.",
    description: "Tiene una base cuadrada y cuatro caras laterales triangulares que se juntan en un vértice.",
    faces: "5 caras planas",
    edges: "8 aristas rectas",
    vertices: "5 vértices",
    faceType: "Una cara cuadrada y cuatro caras triangulares",
    bases: "Una base cuadrada",
    everydayExamples: ["Pirámide egipcia", "Techo decorativo"],
    pedagogy:
      "Ayuda a observar cómo varias caras se reúnen en un punto común llamado cúspide o vértice superior.",
    compareQuestion: "¿Qué se mantiene igual en todas sus caras laterales?",
    rollStack: "Se apoya sobre su base, pero su punta impide apilar otra igual con facilidad.",
    netType: "square-pyramid",
    netDescription: "Se despliega como un cuadrado central con cuatro triángulos alrededor.",
    realObjectHint: "Una pirámide egipcia permite conversar sobre base, altura y caras laterales.",
    labels: [
      { text: "vértice superior", position: [0, 1.2, 0] },
      { text: "base cuadrada", position: [0, -1.02, 0] },
      { text: "cara triangular", position: [0, 0.02, 1.05] },
    ],
    vertexPoints: squarePyramidVertices,
    edgePoints: squarePyramidEdges,
    basePoints: [[0, -0.88, 0]],
  },
  {
    id: "triangular-pyramid",
    name: "Pirámide triangular",
    shortName: "Pirámide tri.",
    description: "También llamada tetraedro cuando todas sus caras son triángulos. Tiene cuatro caras triangulares.",
    faces: "4 caras planas",
    edges: "6 aristas rectas",
    vertices: "4 vértices",
    faceType: "Cuatro caras triangulares",
    bases: "Puede apoyarse sobre cualquiera de sus caras triangulares",
    everydayExamples: ["Pirámide triangular", "Dado de cuatro caras", "Estructura tipo trípode"],
    pedagogy:
      "Es útil para discutir que una pirámide no siempre tiene base cuadrada: la forma de la base cambia el cuerpo.",
    compareQuestion: "¿Qué pasa con la cantidad de caras si la base es triangular?",
    rollStack: "Se apoya en una cara, pero no se apila tan fácilmente como un prisma.",
    netType: "triangular-pyramid",
    netDescription: "Su red se puede ver como cuatro triángulos conectados.",
    realObjectHint: "Un dado de cuatro caras muestra todos sus vértices y caras triangulares.",
    labels: [
      { text: "cara triangular", position: [0, 0, 1.02] },
      { text: "arista", position: [0.55, 0.14, 0.44] },
      { text: "vértice", position: [0, 1.24, 0] },
    ],
    vertexPoints: tetraVertices,
    edgePoints: tetraEdges,
    basePoints: [[0, -0.76, 0.12]],
  },
  {
    id: "cylinder",
    name: "Cilindro",
    shortName: "Cilindro",
    description: "Tiene dos bases circulares paralelas y una superficie curva que las une.",
    faces: "2 caras planas y 1 superficie curva",
    edges: "2 bordes circulares curvos",
    vertices: "0 vértices",
    faceType: "Bases circulares planas y superficie lateral curva",
    bases: "Dos bases circulares",
    everydayExamples: ["Lata", "Vaso", "Tubo"],
    pedagogy:
      "Permite diferenciar caras planas de superficies curvas sin llamar vértices a puntos que no existen.",
    compareQuestion: "¿Por qué puede rodar si también tiene bases planas?",
    rollStack: "Puede rodar por su superficie curva y también apilarse sobre sus bases.",
    netType: "cylinder",
    netDescription: "Se representa con dos círculos y un rectángulo que envuelve el contorno.",
    realObjectHint: "Una lata muestra la relación entre base circular y superficie lateral.",
    labels: [
      { text: "base circular", position: [0, 1.08, 0] },
      { text: "superficie curva", position: [1.08, 0, 0] },
      { text: "altura", position: [-1.24, 0, 0] },
    ],
    vertexPoints: [],
    edgePoints: [
      [0.88, 0.92, 0],
      [-0.88, 0.92, 0],
      [0.88, -0.92, 0],
      [-0.88, -0.92, 0],
    ],
    basePoints: [[0, 0.98, 0], [0, -0.98, 0]],
  },
  {
    id: "cone",
    name: "Cono",
    shortName: "Cono",
    description: "Tiene una base circular, una superficie curva y un vértice superior.",
    faces: "1 cara plana y 1 superficie curva",
    edges: "1 borde circular curvo",
    vertices: "1 vértice",
    faceType: "Base circular plana y superficie lateral curva",
    bases: "Una base circular",
    everydayExamples: ["Cono de tránsito", "Cucurucho"],
    pedagogy:
      "Ayuda a distinguir entre borde circular, superficie curva y vértice en cuerpos no poliedros.",
    compareQuestion: "¿Qué diferencia notas entre el cono y el cilindro?",
    rollStack: "Puede rodar en curva, pero no se apila de forma estable sobre su punta.",
    netType: "cone",
    netDescription: "Se aproxima con un círculo y un sector circular.",
    realObjectHint: "Un cono de tránsito deja ver una base circular y una punta.",
    labels: [
      { text: "vértice", position: [0, 1.12, 0] },
      { text: "base circular", position: [0, -1.03, 0] },
      { text: "superficie curva", position: [0.95, -0.05, 0] },
    ],
    vertexPoints: [[0, 0.98, 0]],
    edgePoints: [
      [0.92, -0.92, 0],
      [-0.92, -0.92, 0],
    ],
    basePoints: [[0, -0.98, 0]],
  },
  {
    id: "sphere",
    name: "Esfera",
    shortName: "Esfera",
    description: "Cuerpo completamente curvo: todos sus puntos exteriores están a igual distancia del centro.",
    faces: "0 caras planas; 1 superficie curva continua",
    edges: "0 aristas",
    vertices: "0 vértices",
    faceType: "No tiene caras planas",
    bases: "No tiene bases",
    everydayExamples: ["Pelota", "Planeta", "Naranja"],
    pedagogy:
      "Permite aclarar que una superficie curva no es una cara plana, y que la esfera no tiene aristas ni vértices.",
    compareQuestion: "¿Qué cuerpo rueda en cualquier dirección?",
    rollStack: "Rueda con facilidad y no se apila de manera estable.",
    netType: "sphere",
    netDescription:
      "No tiene una red plana exacta simple sin deformación; se muestra una aproximación con gajos.",
    realObjectHint: "Una pelota permite observar que no hay esquinas, aristas ni bases.",
    labels: [
      { text: "superficie curva", position: [1.18, 0.16, 0] },
      { text: "sin vértices", position: [-0.95, 0.88, 0] },
      { text: "sin aristas", position: [0, -1.14, 0] },
    ],
    vertexPoints: [],
    edgePoints: [],
    basePoints: [],
  },
];

export const getShapeById = (id: ShapeId) => shapes.find((shape) => shape.id === id) ?? shapes[0];
