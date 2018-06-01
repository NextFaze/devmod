import { isDebugMode } from '../../public_api';
import { defineMetadata, getOwnMetadata } from '../util/metadata';

export type AnnotationHandler<T> = (config: T, target: any, key: string) => T;

export function makeDeveloperAnnotation<T>(metadataKey: string | Symbol, cb: AnnotationHandler<T>) {
  return function(config?: T) {
    return function(target: Object, key: string) {
      if (!isDebugMode()) {
        return;
      }

      const metaTarget = target.constructor;
      const existingMetadata = getOwnMetadata(metadataKey, metaTarget) || [];

      const newMetadataItem = cb(config, target, key);
      defineMetadata(metadataKey, newMetadataItem, metaTarget);
    };
  };
}
