export type ShapeId =
  | "cube"
  | "rectangular-prism"
  | "triangular-prism"
  | "square-pyramid"
  | "triangular-pyramid"
  | "cylinder"
  | "cone"
  | "sphere";

export type MaterialMode = "solid" | "translucent" | "edges" | "labels";

export type ScreenMode = "home" | "explore" | "challenge" | "class";

export type PartTarget = "face" | "edge" | "vertex" | "base" | "surface" | "real-object";

export type Vec3 = [number, number, number];
