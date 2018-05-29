import { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
import { addImportToModule } from '@schematics/angular/utility/ast-utils';
import { Change, InsertChange, NoopChange, RemoveChange } from '@schematics/angular/utility/change';
import { getWorkspace, WorkspaceProject } from '@schematics/angular/utility/config';
import { getAppModulePath } from '@schematics/angular/utility/ng-ast-utils';
import * as ts from 'typescript';

// import { insertImport } from '@schematics/angular/utility/route-utils';
// tslint:disable-next-line
export function schematicDevmod(options: any): Rule {
  return (tree: Tree, _context: SchematicContext) => {
    const workspace = getWorkspace(tree);
    const projectName = workspace.defaultProject!;
    const project = workspace.projects[projectName];
    const modulePath = getRootModulePath(tree, project);

    tree.create(`${directoryOf(modulePath)}/devmod.config.ts`, devmodContents());
    const componentPath =
      options.entryComponent || modulePath.replace('module.ts', 'component.html');
    addModuleImportToRootModule(tree, `devmod`, './devmod.config', project);

    insert(tree, componentPath, [
      new InsertChange(componentPath, tree.read(componentPath)!.length, devmodToggle())
    ]);
    const version = require('../../package.json').version;

    addPackageToPackageJson(tree, 'devDependencies', '@devmod/core', `^${version}`);
    addPackageToPackageJson(tree, 'devDependencies', '@devmod/interface', `^${version}`);
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

export function directoryOf(path: string) {
  return path.slice(0, path.lastIndexOf('/'));
}

export function addModuleImportToRootModule(
  host: Tree,
  moduleName: string,
  src: string,
  project: WorkspaceProject
) {
  const modulePath = getRootModulePath(host, project);
  const moduleSource = host.read(modulePath)!.toString('utf-8');
  const sourceFile = ts.createSourceFile(modulePath, moduleSource, ts.ScriptTarget.Latest, true);
  const changes = addImportToModule(sourceFile, modulePath, moduleName, src);
  const recorder = host.beginUpdate(modulePath);

  changes.forEach(change => {
    if (change instanceof InsertChange) {
      recorder.insertLeft(change.pos, change.toAdd);
    }
  });

  host.commitUpdate(recorder);
}

export function getRootModulePath(host: Tree, project: WorkspaceProject) {
  return getAppModulePath(host, project.architect!.build.options.main);
}

export function addPackageToPackageJson(
  host: Tree,
  type: string,
  pkg: string,
  version: string
): Tree {
  if (host.exists('package.json')) {
    const sourceText = host.read('package.json')!.toString('utf-8');
    const json = JSON.parse(sourceText);
    if (!json[type]) {
      json[type] = {};
    }

    if (!json[type][pkg]) {
      json[type][pkg] = version;
    }

    host.overwrite('package.json', JSON.stringify(json, null, 2));
  }

  return host;
}

export function devmodToggle() {
  return `

<devmod-toggle></devmod-toggle>`;
}

export function devmodContents() {
  return `
import { production } from '../environments/environment';
import { enableDebugMode } from '@devmod/core';
import { DevmodInterfaceModule, DevmodNoopModule } from '@devmod/interface';

if (!production) {
  enableDebugMode(); // Ensures all the decorators do what they should
}

let _devmod = DevmodNoopModule;

if(!production) {
  _devmod = DevmodInterfaceModule;
}

export const devmod = _devmod;
    `.trim();
}
