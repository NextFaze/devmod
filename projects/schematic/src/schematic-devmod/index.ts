import { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
import { addImportToModule } from '@schematics/angular/utility/ast-utils';
import { Change, InsertChange, NoopChange, RemoveChange } from '@schematics/angular/utility/change';
// import { insertImport } from '@schematics/angular/utility/route-utils';
import * as ts from 'typescript';

// tslint:disable-next-line
export function schematicDevmod(options: any): Rule {
  return (tree: Tree, _context: SchematicContext) => {
    tree.create(
      'projects/bar/src/devmod.config.ts',
      `
import { production } from './environments/environment';
import { enableDebugMode } from '@devmod/core';
import { DevmodInterfaceModule, DevmodNoopModule } from '@devmod/interface';

if (!production) {
  enableDebugMode(); // Ensures all the decorators do what they should
}

let _devmod = DevmodNoopModule;

if(!production) {
  _devmod = DevmodInterfaceModule
}

export const devmod = _devmod;
    `.trim()
    );
    const modulePath = options.modulePath || `src/app.module.ts`;
    const componentPath = options.componentPath || 'src/app.component.html';
    const moduleSource = tree.read(modulePath)!.toString('utf-8');
    const sourceFile = ts.createSourceFile(modulePath, moduleSource, ts.ScriptTarget.Latest, true);
    insert(tree, modulePath, [
      // insertImport(sourceFile, modulePath, 'devmod', './devmod.config'),
      ...addImportToModule(sourceFile, modulePath, `devmod`, './devmod.config')
    ]);
    insert(tree, componentPath, [
      new InsertChange(
        componentPath,
        tree.read(componentPath)!.length,
        `
<devmod-toggle></devmod-toggle>`
      )
    ]);
    return tree;
  };
}

export function insert(host: Tree, modulePath: string, changes: Change[]) {
  const recorder = host.beginUpdate(modulePath);
  for (const change of changes) {
    if (change instanceof InsertChange) {
      recorder.insertLeft(change.pos, change.toAdd);
    } else if (change instanceof RemoveChange) {
      recorder.remove((<any>change).pos - 1, (<any>change).toRemove.length + 1);
    } else if (change instanceof NoopChange) {
      // do nothing
    } else {
      throw new Error(`Unexpected Change '${change}'`);
    }
  }
  host.commitUpdate(recorder);
}
