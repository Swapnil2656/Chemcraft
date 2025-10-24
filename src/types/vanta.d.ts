declare module 'vanta' {
  interface VantaEffect {
    destroy(): void;
  }

  interface VantaConfig {
    el: HTMLElement | null;
    THREE: any;
    mouseControls?: boolean;
    touchControls?: boolean;
    gyroControls?: boolean;
    minHeight?: number;
    minWidth?: number;
    scale?: number;
    scaleMobile?: number;
    color?: number;
    backgroundColor?: number;
    points?: number;
    maxDistance?: number;
    spacing?: number;
    showDots?: boolean;
    color1?: number;
    color2?: number;
    size?: number;
    speed?: number;
    waveHeight?: number;
    waveSpeed?: number;
    zoom?: number;
  }

  export const NET: (config: VantaConfig) => VantaEffect;
  export const CELLS: (config: VantaConfig) => VantaEffect;
  export const WAVES: (config: VantaConfig) => VantaEffect;
  export const TOPOLOGY: (config: VantaConfig) => VantaEffect;
}

declare module 'vanta/dist/vanta.net.min.js' {
  import { VantaConfig, VantaEffect } from 'vanta';
  const NET: (config: VantaConfig) => VantaEffect;
  export default NET;
}

declare module 'vanta/dist/vanta.cells.min.js' {
  import { VantaConfig, VantaEffect } from 'vanta';
  const CELLS: (config: VantaConfig) => VantaEffect;
  export default CELLS;
}

declare module 'vanta/dist/vanta.waves.min.js' {
  import { VantaConfig, VantaEffect } from 'vanta';
  const WAVES: (config: VantaConfig) => VantaEffect;
  export default WAVES;
}

declare module 'vanta/dist/vanta.topology.min.js' {
  import { VantaConfig, VantaEffect } from 'vanta';
  const TOPOLOGY: (config: VantaConfig) => VantaEffect;
  export default TOPOLOGY;
}

declare global {
  interface Window {
    VANTA?: {
      NET?: (config: any) => any;
      CELLS?: (config: any) => any;
      WAVES?: (config: any) => any;
      TOPOLOGY?: (config: any) => any;
    };
  }
}