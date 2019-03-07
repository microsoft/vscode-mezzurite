import { readFileSync } from 'fs';
import { resolve } from 'path';
import { ClassDeclaration, Node, SyntaxKind, SourceFile } from 'ts-morph';

import MezzuriteComponent from '../../../models/MezzuriteComponent';

function generateNgComponent (filePath: string, sourceFile: SourceFile): MezzuriteComponent {
  let component = null;

  if (filePath != null && sourceFile != null) {
    // TODO: Handle multiple classes in a file.
    const sourceClass = sourceFile.getClasses()[0];

    if (sourceClass != null) {
      const hasMezzuriteDirective = containsMezzuriteDirective(filePath, sourceClass);
      const name = sourceClass.getName();

      component = {
        checks: {
          hasMezzuriteDirective
        },
        filePath,
        name,
        type: 'ngComponent'
      };
    }
  }

  return component;
}

function containsMezzuriteDirective (filePath: string, sourceClass: ClassDeclaration): boolean {
  let containsMezzuriteDirective = false;

  if (sourceClass != null) {
    const componentDecorator = sourceClass.getDecorator('Component');

    if (componentDecorator != null) {
      const decoratorArgument = componentDecorator.getArguments().find((child: Node) => {
        return child.getKind() === SyntaxKind.ObjectLiteralExpression;
      });

      if (decoratorArgument != null) {
        const decoratorArgumentParameters = decoratorArgument.getFirstChildByKind(SyntaxKind.SyntaxList).getChildren();

        if (decoratorArgumentParameters != null) {
          const template = getTemplate(decoratorArgumentParameters, filePath);

          if (template != null) {
            containsMezzuriteDirective = template.indexOf('mezzurite') > -1 && template.indexOf('component-title') > -1;
          }
        }
      }
    }
  }

  return containsMezzuriteDirective;
}

function getTemplate (decoratorArguments: Node[], filePath: string): string {
  let template: string = null;

  decoratorArguments.forEach((decoratorArgumentParameter: Node) => {
    if (decoratorArgumentParameter.getKind() === SyntaxKind.PropertyAssignment) {
      decoratorArgumentParameter.forEachChild((parameter: Node) => {
        if (parameter != null) {
          const parameterText = parameter.getText();
          if (parameterText === 'template') {
            const templateValue = (parameter.getNextSiblings().find((sibling: Node) => {
              return sibling.getKind() === SyntaxKind.NoSubstitutionTemplateLiteral;
            }));

            if (templateValue != null) {
              template = templateValue.getText();
            }
          } else if (parameterText === 'templateUrl') {
            const templateUrlValue = (parameter.getNextSiblings().find((sibling: Node) => {
              return sibling.getKind() === SyntaxKind.StringLiteral;
            }));
            if (templateUrlValue != null) {
              const fileExtension = templateUrlValue.getText().replace(/'/g, '');
              const templateUrl = resolve(filePath, '..', fileExtension);

              try {
                template = readFileSync(templateUrl).toString();
              } catch {
                console.warn('Invalid path to templateUrl.');
              }
            }
          }
        }
      });
    }
  });

  return template;
}

export default generateNgComponent;
