import { defineMetadata, getOwnMetadata } from '../util/metadata';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { isDebugMode } from '../util/enable';

export const OBSERVABLE_KEY = 'DEBUG_OBSERVABLES';
export interface DebugObservableConfig {
  label?: string;
  takeLast?: number;
  log: boolean;
  logSubscriptions?: boolean;
}

export function DebugObservable(config: any = {}) {
  return function(target: Object, key: string) {
    if (!isDebugMode()) {
      return;
    }

    const takeLast = config.takeLast || 5;
    const label = config.label || key;
    const metaTarget = target.constructor;
    const debugObservables = getOwnMetadata(OBSERVABLE_KEY, metaTarget) || [];
    const valueHistory = new BehaviorSubject([]);

    let observable = target[key];
    let lastEmissions = [];

    const get = function() {
      return observable;
    };

    const set = function(newValue: Observable<any>) {
      lastEmissions = [];
      valueHistory.next(lastEmissions);

      // Patch subscription method so we can log when someone subscribes
      if (config.logSubscriptions) {
        const orig = newValue.subscribe;
        newValue.subscribe = function(...args) {
          console.log(
            `${label} subscribed to:\n`,
            new Error().stack
              .split('\n')
              .slice(5) // Skip this call and the ones up to devmod's monkey patch
              .map(v => `\t ${v.trim()}`)
              .join('\n')
          );

          return orig.call(newValue, ...args);
        };
      }

      // Store previously emitted values in BehaviorSubject
      observable = newValue.pipe(
        tap(v => {
          if (config.log) {
            console.log(`${label} emitted`, v);
          }
          lastEmissions = lastEmissions
            .concat({
              at: new Date(),
              value: v
            })
            .slice(-1 * takeLast);
          valueHistory.next(lastEmissions);
        })
      );
    };

    Object.defineProperty(target, key, {
      get,
      set,
      enumerable: true,
      configurable: true
    });

    debugObservables.push({ key, obs: valueHistory, takeLast, label });

    defineMetadata(OBSERVABLE_KEY, debugObservables, metaTarget);
  };
}
