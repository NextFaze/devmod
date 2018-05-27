import { getMetadata } from './metadata';
import { functionName } from './helpers';

declare const getAllAngularRootElements;
declare const ng;

// From Augury
const componentInstanceExistsInParentChain = debugElement => {
  const componentInstanceRef = debugElement.componentInstance;
  while (componentInstanceRef && debugElement.parent) {
    if (componentInstanceRef === debugElement.parent.componentInstance) {
      return true;
    }
    debugElement = debugElement.parent;
  }
  return false;
};

export const isDebugElementComponent = element =>
  !!element.componentInstance && !componentInstanceExistsInParentChain(element);

export const getComponentName = (element): string => {
  if (
    element.componentInstance &&
    element.componentInstance.constructor &&
    !componentInstanceExistsInParentChain(element)
  ) {
    return functionName(element.componentInstance.constructor);
  } else if (element.name) {
    return element.name;
  }

  return element.nativeElement.tagName.toLowerCase();
};

// from Augury - get the actual `@NgModule` decorator information from a class.
export const resolveNgModuleDecoratorConfig = m => {
  if (m.decorators) {
    return m.decorators.reduce(
      (prev, curr, idx, decorators) =>
        prev
          ? prev
          : decorators[idx].type.prototype.ngMetadataName === 'NgModule' ||
            decorators[idx].type.prototype.toString() === '@NgModule'
            ? (decorators[idx].args || [])[0]
            : null,
      null
    );
  }

  if (m.__annotations__) {
    return m.__annotations__.find(decorator => decorator.ngMetadataName === 'NgModule');
  }

  return (getMetadata('annotations', m) || []).find(
    decorator => decorator.toString() === '@NgModule'
  );
};

export const getAngularApplicationRoot = () => ng.probe(getAllAngularRootElements()[0]);

export const getAngularApplicationRef = () =>
  getAngularApplicationRoot().injector.get(ng.coreTokens.ApplicationRef);

export const getAngularModuleInstance = () => getAngularApplicationRef()._injector.instance;

export const getAngularModuleClass = () => getAngularModuleInstance().constructor;
