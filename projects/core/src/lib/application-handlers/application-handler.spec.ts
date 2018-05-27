import { of } from 'rxjs';
import { ApplicationHandler } from './application-handler';
import { enableDebugMode } from '../util/enable';
import { DeveloperModule } from '../decorators/developer-module';
import { DeveloperFunction } from '../decorators/developer-function';
import { DeveloperCategory } from '../decorators/developer-category';
import { DebugObservable } from '../decorators/developer-observable';
import { take } from 'rxjs/operators';

class TestHandler extends ApplicationHandler {
  probeForItemsWithDeveloperFunctions() {
    return [];
  }
  mapToDeveloperItem(item: any, type: string) {
    return item;
  }
}

describe('Abstract Application Handler', () => {
  const handler = new TestHandler({});
  it('should return modules that were registered with @DeveloperModule', () => {
    enableDebugMode();

    @DeveloperModule()
    class SomeClass {
      @DeveloperFunction()
      hasMethod() {}
    }
    const registeredModules = handler.getCustomDeveloperModules();
    const found = registeredModules.find(item => item instanceof SomeClass);
    expect(found).toBeTruthy();
    (<any>found).hasMethod();
  });

  it('gets developer functions from a constructor', () => {
    @DeveloperModule()
    class SomeClass {
      @DeveloperFunction()
      hasMethod() {}
    }
    expect(handler.getMappedDeveloperFunctions(SomeClass)).toEqual(<any>[
      {
        key: 'hasMethod',
        name: 'hasMethod',
        label: 'Has Method'
      }
    ]);
  });

  it('fetches developer category config', () => {
    @DeveloperCategory({
      label: 'MyCategory'
    })
    class SomeClass {}
    expect((<any>handler).getCategoryConfig(SomeClass)).toEqual({
      label: 'MyCategory'
    });
  });

  it('can determine if a constructor is decorated with the correct keys', () => {
    class ObsClass {
      @DebugObservable() obs;
    }
    class MethodClass {
      @DeveloperFunction() obs;
    }
    class ArbitraryClass {}
    expect((<any>handler).constructorIsDecorated(ObsClass)).toEqual(true);
    expect((<any>handler).constructorIsDecorated(MethodClass)).toEqual(true);
    expect((<any>handler).constructorIsDecorated(ArbitraryClass)).toEqual(false);
  });

  it('can get the developer functions from a class', () => {
    class MethodClass {
      @DeveloperFunction() devFun;
      notADevFun: Function;
    }
    expect((<any>handler).getDeveloperFunctions(MethodClass)).toEqual([
      {
        key: 'devFun'
      }
    ]);
  });

  it('can get the debug observables class', done => {
    class MethodClass {
      @DebugObservable() debugObs = of(52);
      notADebugObs: Function;
    }
    const decoratedData = (<any>handler).getDebugObservables(MethodClass);
    expect(decoratedData.length).toEqual(1);
    const inst = new MethodClass();
    inst[decoratedData[0].key].pipe(take(1)).subscribe(val => {
      expect(val).toEqual(52);
      done();
    });
  });

  it('can sort developer functions by value or optional key', () => {
    const toBeSortedWithoutOptional = [{ name: 'zzz' }, { name: 'aaa' }, { name: 'ccc' }];
    expect(
      toBeSortedWithoutOptional.sort((a, b) => handler.sortByOptionalKey('name', 'name', a, b))
    ).toEqual([{ name: 'aaa' }, { name: 'ccc' }, { name: 'zzz' }]);

    const toBeSortedWithOptional = [{ name: 'zzz', sortBy: 'a' }, { name: 'aaa' }, { name: 'ccc' }];
    expect(
      toBeSortedWithOptional.sort((a, b) => handler.sortByOptionalKey('sortBy', 'name', a, b))
    ).toEqual([{ name: 'zzz', sortBy: 'a' }, { name: 'aaa' }, { name: 'ccc' }]);
  });
});
