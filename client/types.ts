export interface LayerOptions {
  href: string;
  mode: string;
  html: string;
}

export const layerAttributes = {
  layer: "pe-layer",
  target: "pe-target",
  dismiss: "pe-dismiss",
} as const;

export const defaultTarget = "main";
