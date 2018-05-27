import { toTitle, functionName } from './helpers';

describe('Helpers', () => {
  describe('toTitle', () => {
    it('should convert a string to title case', () => {
      expect(toTitle('someTestFunction')).toEqual('Some Test Function');
      expect(toTitle('DeveloperFunction')).toEqual('Developer Function');
    });
  });

  describe('functionName', () => {
    it('should return a function name', () => {
      function someComponent(args: any[]) {
        return;
      }
      expect(functionName(someComponent)).toEqual('someComponent');
    });
  });
});
