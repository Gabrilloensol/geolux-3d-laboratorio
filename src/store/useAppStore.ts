import { create } from "zustand";
import type { MaterialMode, PartTarget, ScreenMode, ShapeId } from "../types";

interface PartSelection {
  part: PartTarget;
  point?: [number, number, number];
  nonce: number;
}

interface AppStore {
  screen: ScreenMode;
  selectedShapeId: ShapeId;
  materialMode: MaterialMode;
  showFaces: boolean;
  showEdges: boolean;
  showVertices: boolean;
  showNet: boolean;
  showRealObject: boolean;
  autoRotate: boolean;
  guidedView: boolean;
  teacherOpen: boolean;
  presentationMode: boolean;
  soundEnabled: boolean;
  animationsPaused: boolean;
  viewResetNonce: number;
  sceneInteractionCount: number;
  challengeIndex: number;
  score: number;
  correctAnswers: number;
  lastPartSelection?: PartSelection;
  setScreen: (screen: ScreenMode) => void;
  setSelectedShape: (shapeId: ShapeId) => void;
  setMaterialMode: (mode: MaterialMode) => void;
  cycleMaterialMode: () => void;
  toggleFaces: () => void;
  toggleEdges: () => void;
  toggleVertices: () => void;
  toggleNet: () => void;
  toggleRealObject: () => void;
  toggleAutoRotate: () => void;
  toggleGuidedView: () => void;
  toggleTeacher: () => void;
  togglePresentationMode: () => void;
  toggleSound: () => void;
  toggleAnimations: () => void;
  resetView: () => void;
  markSceneInteraction: () => void;
  submitPartSelection: (part: PartTarget, point?: [number, number, number]) => void;
  nextChallenge: () => void;
  addChallengeResult: (correct: boolean, points: number) => void;
  resetProgress: () => void;
}

const materialModes: MaterialMode[] = ["solid", "translucent", "edges", "labels"];

export const useAppStore = create<AppStore>((set, get) => ({
  screen: "home",
  selectedShapeId: "cube",
  materialMode: "translucent",
  showFaces: true,
  showEdges: true,
  showVertices: true,
  showNet: false,
  showRealObject: false,
  autoRotate: true,
  guidedView: false,
  teacherOpen: false,
  presentationMode: false,
  soundEnabled: false,
  animationsPaused: false,
  viewResetNonce: 0,
  sceneInteractionCount: 0,
  challengeIndex: 0,
  score: 0,
  correctAnswers: 0,
  setScreen: (screen) => set({ screen }),
  setSelectedShape: (selectedShapeId) => set({ selectedShapeId, showNet: false, showRealObject: false }),
  setMaterialMode: (materialMode) => set({ materialMode }),
  cycleMaterialMode: () => {
    const current = get().materialMode;
    const nextIndex = (materialModes.indexOf(current) + 1) % materialModes.length;
    set({ materialMode: materialModes[nextIndex] });
  },
  toggleFaces: () => set((state) => ({ showFaces: !state.showFaces })),
  toggleEdges: () => set((state) => ({ showEdges: !state.showEdges })),
  toggleVertices: () => set((state) => ({ showVertices: !state.showVertices })),
  toggleNet: () => set((state) => ({ showNet: !state.showNet })),
  toggleRealObject: () => set((state) => ({ showRealObject: !state.showRealObject })),
  toggleAutoRotate: () => set((state) => ({ autoRotate: !state.autoRotate })),
  toggleGuidedView: () => set((state) => ({ guidedView: !state.guidedView })),
  toggleTeacher: () => set((state) => ({ teacherOpen: !state.teacherOpen })),
  togglePresentationMode: () => set((state) => ({ presentationMode: !state.presentationMode })),
  toggleSound: () => set((state) => ({ soundEnabled: !state.soundEnabled })),
  toggleAnimations: () => set((state) => ({ animationsPaused: !state.animationsPaused })),
  resetView: () => set((state) => ({ viewResetNonce: state.viewResetNonce + 1 })),
  markSceneInteraction: () => set((state) => ({ sceneInteractionCount: state.sceneInteractionCount + 1 })),
  submitPartSelection: (part, point) =>
    set((state) => ({ lastPartSelection: { part, point, nonce: (state.lastPartSelection?.nonce ?? 0) + 1 } })),
  nextChallenge: () => set((state) => ({ challengeIndex: state.challengeIndex + 1 })),
  addChallengeResult: (correct, points) =>
    set((state) => ({
      score: state.score + (correct ? points : 0),
      correctAnswers: state.correctAnswers + (correct ? 1 : 0),
    })),
  resetProgress: () =>
    set({
      challengeIndex: 0,
      score: 0,
      correctAnswers: 0,
      selectedShapeId: "cube",
      materialMode: "translucent",
      showFaces: true,
      showEdges: true,
      showVertices: true,
      showNet: false,
      showRealObject: false,
      sceneInteractionCount: 0,
      lastPartSelection: undefined,
    }),
}));
