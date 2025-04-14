// Sample data structure for scenes
export type Scene = {
  id: string;
  durationInFrames: number;
  title: string;
  selected: boolean;
  components: SceneComponent[];
};

export type SceneBaseObject = {
  id: string;
  from: number;
  to: number;
  top: number;
  left: number;
  width: number;
  height: number;
  animations: string[];
};

export type SceneText = SceneBaseObject & {
  type: "scene-text";
  text: string;
  fontSize: number;
  fontFamily: string;
  color: string;
  backgroundColor: string;
  textAlign: "left" | "center" | "right";
  textAlignVertical: "top" | "center" | "bottom";
  fontWeight: "normal" | "bold" | "bolder" | "lighter";
  fontStyle: "normal" | "italic" | "oblique";
  textDecoration: "none" | "underline" | "line-through";
  textTransform: "none" | "uppercase" | "lowercase" | "capitalize";
};

export type SceneMedia = SceneBaseObject & {
  type: "scene-media";
  mediaType: "image" | "video" | "audio";
  src: string;
  alt: string;
  fit: "cover" | "contain" | "fill";
};

export type SceneComponent = SceneText | SceneMedia;
