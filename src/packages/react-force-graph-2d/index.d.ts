import * as React from 'react';
import { ForceGraphInstance as ForceGraphKapsuleInstance } from 'force-graph';

export interface GraphData {
  nodes: NodeObject[];
  links: LinkObject[];
}

export type NodeObject = object & {
  id?: string | number;
  x?: number;
  y?: number;
  vx?: number;
  vy?: number;
  fx?: number;
  fy?: number;
};

export type LinkObject = object & {
  source?: string | number | NodeObject;
  target?: string | number | NodeObject;
};

type Accessor<In, Out> = Out | string | ((obj: In) => Out);
type NodeAccessor<T> = Accessor<NodeObject, T>;
type LinkAccessor<T> = Accessor<LinkObject, T>;

type CanvasCustomRenderFn<T> = (obj: T, canvasContext: CanvasRenderingContext2D, globalScale: number, isShadow?: boolean) => void;
type CanvasCustomRenderMode = 'replace' | 'before' | 'after';

type DagMode = 'td' | 'bu' | 'lr' | 'rl' | 'radialout' | 'radialin';

interface ForceFn {
  (alpha: number): void;
  initialize?: (nodes: NodeObject[]) => void;
}

export interface ForceGraphProps {
  // Data input
  graphData?: GraphData;
  nodeId?: string;
  linkSource?: string;
  linkTarget?: string;

  // Container layout
  width?: number;
  height?: number;
  backgroundColor?: string;

  // Node styling
  nodeRelSize?: number;
  nodeVal?: NodeAccessor<number>;
  nodeLabel?: NodeAccessor<string>;
  nodeVisibility?: NodeAccessor<boolean>;
  nodeColor?: NodeAccessor<string>;
  nodeAutoColorBy?: NodeAccessor<string | null>;
  nodeCanvasObject?: CanvasCustomRenderFn<NodeObject>;
  nodeCanvasObjectMode?: string | ((obj: NodeObject) => CanvasCustomRenderMode);

  // Link styling
  linkLabel?: LinkAccessor<string>;
  linkVisibility?: LinkAccessor<boolean>;
  linkColor?: LinkAccessor<string>;
  linkAutoColorBy?: LinkAccessor<string | null>;
  linkLineDash?: LinkAccessor<number[] | null>;
  linkWidth?: LinkAccessor<number>;
  linkCurvature?: LinkAccessor<number>;
  linkCanvasObject?: CanvasCustomRenderFn<LinkObject>;
  linkCanvasObjectMode?: string | ((obj: LinkObject) => CanvasCustomRenderMode);
  linkDirectionalArrowLength?: LinkAccessor<number>;
  linkDirectionalArrowColor?: LinkAccessor<string>;
  linkDirectionalArrowRelPos?: LinkAccessor<number>;
  linkDirectionalParticles?: LinkAccessor<number>;
  linkDirectionalParticleSpeed?: LinkAccessor<number>;
  linkDirectionalParticleWidth?: LinkAccessor<number>;
  linkDirectionalParticleColor?: LinkAccessor<string>;

  // Force engine (d3-force) configuration
  dagMode?: DagMode;
  dagLevelDistance?: number | null;
  d3AlphaMin?: number;
  d3AlphaDecay?: number;
  d3VelocityDecay?: number;
  warmupTicks?: number;
  cooldownTicks?: number;
  cooldownTime?: number;
  onEngineTick?: () => void;
  onEngineStop?: () => void;

  // Interaction
  onNodeClick?: (node: NodeObject, event: MouseEvent) => void;
  onNodeRightClick?: (node: NodeObject, event: MouseEvent) => void;
  onNodeHover?: (node: NodeObject | null, previousNode: NodeObject | null) => void;
  onNodeDrag?: (node: NodeObject, translate: { x: number, y: number }) => void;
  onNodeDragEnd?: (node: NodeObject, translate: { x: number, y: number }) => void;
  onLinkClick?: (link: LinkObject, event: MouseEvent) => void;
  onLinkRightClick?: (link: LinkObject, event: MouseEvent) => void;
  onLinkHover?: (link: LinkObject | null, previousLink: LinkObject | null) => void;
  linkHoverPrecision?: number;
  onBackgroundClick?: (event: MouseEvent) => void;
  onBackgroundRightClick?: (event: MouseEvent) => void;
  onZoom?: (transform: {k: number, x: number, y: number}) => void;
  onZoomEnd?: (transform: {k: number, x: number, y: number}) => void;
  enableNodeDrag?: boolean;
  enableZoomPanInteraction?: boolean;
  enablePointerInteraction?: boolean;
}

export interface ForceGraphMethods {
  // Link styling
  emitParticle(link: LinkObject): ForceGraphKapsuleInstance;

  // Force engine (d3-force) configuration
  d3Force(forceName: 'link' | 'charge' | 'center' | string): ForceFn | undefined;
  d3Force(forceName: 'link' | 'charge' | 'center' | string, forceFn: ForceFn): ForceGraphKapsuleInstance;
  d3ReheatSimulation(): ForceGraphKapsuleInstance;

  // Render control
  pauseAnimation(): ForceGraphKapsuleInstance;
  resumeAnimation(): ForceGraphKapsuleInstance;
  centerAt(): {x: number, y: number};
  centerAt(x?: number, y?: number, durationMs?: number): ForceGraphKapsuleInstance;
  zoom(): number;
  zoom(scale: number, durationMs?: number): ForceGraphKapsuleInstance;

  // Utility
  screen2GraphCoords(x: number, y: number): { x: number, y: number };
  graph2ScreenCoords(x: number, y: number): { x: number, y: number };
}

type FCwithRef<P = {}, R = {}> = React.FunctionComponent<P & { ref?: React.MutableRefObject<R> }>;

declare const ForceGraph: FCwithRef<ForceGraphProps, ForceGraphMethods>;

export default ForceGraph;
