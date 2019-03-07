import { ClassDeclaration, Node, SyntaxKind, SourceFile } from 'ts-morph';

import MezzuriteComponent from '../../../models/mezzuriteComponent';

function generateNgModule (filePath: string, sourceFile: SourceFile): MezzuriteComponent {
  let component = null;

  if (filePath != null && sourceFile != null) {
    // TODO: Handle multiple classes in a file.
    const sourceClass = sourceFile.getClasses()[0];

    const hasAngularPerfModule = containsAngularPerfImport(sourceClass);
    const hasImport = sourceFile.getImportDeclaration('@microsoft/mezzurite-angular') != null;
    const hasRoutingServiceStart = containsRoutingServiceStart(sourceClass);

    const name = sourceClass.getName();

    component = {
      checks: {
        hasAngularPerfModule,
        hasImport,
        hasRoutingServiceStart
      },
      filePath,
      name,
      type: 'ngModule'
    };
  }

  return component;
}

function containsAngularPerfImport (sourceClass: ClassDeclaration): boolean {
  const ngModuleDecorator = sourceClass.getDecorator('NgModule');
  let containsAngularPerfImport = false;

  if (ngModuleDecorator != null) {
    const decoratorArgument = ngModuleDecorator.getArguments().find((child: Node) => {
      return child.getKind() === SyntaxKind.ObjectLiteralExpression;
    });

    if (decoratorArgument != null) {
      const decoratorArgumentParameters = decoratorArgument.getFirstChildByKind(SyntaxKind.SyntaxList).getChildren();
      const importNode = decoratorArgumentParameters.find((argument: Node) => {
        const isPropertyAssignment = argument.getKind() === SyntaxKind.PropertyAssignment;
        let hasImports = false;
        if (isPropertyAssignment) {
          const identifier = argument.getFirstChildByKind(SyntaxKind.Identifier);
          if (identifier.getText() === 'imports') {
            hasImports = true;
          }
        }
        return hasImports;
      });

      if (importNode != null) {
        const imports = importNode.getFirstChildByKind(SyntaxKind.ArrayLiteralExpression);
        containsAngularPerfImport = imports.getText().indexOf('AngularPerfModule.forRoot()') > -1;
      }
    }
  }

  return containsAngularPerfImport;
}

function containsRoutingServiceStart (sourceClass: ClassDeclaration): boolean {
  let containsRoutingServiceStart = false;
  const constructors = sourceClass.getConstructors();

  if (constructors.length > 0) {
      // TODO: How do you handle multiple constructors?
    const constructorParameters = constructors[0].getFirstChildByKind(SyntaxKind.Parameter);

    if (constructorParameters != null) {
      const routingServiceType = constructorParameters.getFirstChildByKind(SyntaxKind.TypeQuery);
      if (constructorParameters != null) {
        if (routingServiceType.getText().indexOf('RoutingService') > -1) {
          const constructorBlock = constructors[0].getFirstChildByKind(SyntaxKind.Block);
          // TODO: Make this checking more robust.
          containsRoutingServiceStart = constructorBlock.getChildren().find((child: Node) => {
            return child.getText().indexOf('start()') > -1;
          }) != null;
        }
      }
    }
  }

  return containsRoutingServiceStart;
}

export default generateNgModule;
