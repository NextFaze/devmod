/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { SchematicTestRunner, UnitTestTree } from '@angular-devkit/schematics/testing';
import * as path from 'path';

// tslint:disable:max-line-length
describe('Component Schematic', () => {
  const angularRunner = new SchematicTestRunner(
    '@schematics/angular',
    path.join(__dirname, '../../../../node_modules/@schematics/angular/collection.json')
  );

  let appTree: UnitTestTree;
  beforeEach(() => {
    appTree = angularRunner.runSchematic('workspace', {
      name: 'workspace',
      newProjectRoot: 'projects',
      version: '6.0.0'
    });
    appTree = angularRunner.runSchematic(
      'application',
      {
        name: 'bar',
        inlineStyle: false,
        inlineTemplate: false,
        routing: false,
        style: 'css',
        skipTests: false,
        skipPackageJson: false
      },
      appTree
    );
  });

  it('should create a component', () => {
    const schematicRunner = new SchematicTestRunner(
      '@devmod/schematics',
      path.join(__dirname, '../collection.json')
    );
    const tree = schematicRunner.runSchematic(
      'devmod-angular',
      {
        modulePath: 'projects/bar/src/app/app.module.ts'
      },
      appTree
    );
    const files = tree.files;
    expect(files.indexOf('/projects/bar/src/devmod.config.ts')).toBeGreaterThanOrEqual(0);
    const moduleContent = tree.readContent('/projects/bar/src/app/app.module.ts');
    expect(moduleContent).toMatch(/import.*devmod.*from '.\/devmod.config'/);
    expect(moduleContent).toMatch(/imports:\s*\[[^\]]+?,\r?\n\s+devmod\r?\n/m);
  });
});
