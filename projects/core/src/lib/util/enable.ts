import { applyPatches } from '../util/patches';

let DEBUG_MODE = false;
export function isDebugMode(): boolean {
  return DEBUG_MODE;
}

export function _disableDebugMode() {
  DEBUG_MODE = false;
}

export function enableDebugMode() {
  DEBUG_MODE = true;
  applyPatches();
}
