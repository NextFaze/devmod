declare const Reflect: any;

// Hack fixes for Augury bug overwriting reflect as of Augury 1.16.2
// Better solution is probably to just move away from Reflect...
export const hasMetadata: (key: string, target: any) => boolean = Reflect.hasMetadata.bind(Reflect);
export const hasOwnMetadata: (key: string, target: any) => boolean = Reflect.hasOwnMetadata.bind(
  Reflect
);
export const getMetadata: (key: string, target: any) => any = Reflect.getMetadata.bind(Reflect);
export const getOwnMetadata: (key: string, target: any) => any = Reflect.getOwnMetadata.bind(
  Reflect
);
export const defineMetadata: (
  key: string,
  target: any,
  metadata: any
) => void = Reflect.defineMetadata.bind(Reflect);
