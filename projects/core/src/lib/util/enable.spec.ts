import * as debug from './enable';
import { isDebugMode } from './enable';
import * as patches from './patches';

describe('Enable Debug Mode', () => {
  it('should have a debug mode getter', () => {
    debug._disableDebugMode();
    expect(isDebugMode()).toEqual(false);
  });

  it('should have a function to enble debug mode', () => {
    debug.enableDebugMode();
    expect(isDebugMode()).toEqual(true);
  });

  it('should apply patches when debug enabled', () => {
    spyOn(patches, 'applyPatches');
    debug.enableDebugMode();
    expect(patches.applyPatches).toHaveBeenCalled();
  });
});
