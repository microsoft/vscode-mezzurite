import { readFileSync } from 'fs';
import { join } from 'path';
import { ClassDeclaration, Node, SyntaxKind, SourceFile } from 'ts-morph';

import MezzuriteComponent from '../../../models/mezzuriteComponent';

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
          let template: string = null;
          let templateUrl: string = null;

          decoratorArgumentParameters.forEach((decoratorArgumentParameter: Node) => {
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
                      const fileBase = filePath.substring(0, filePath.lastIndexOf(`\\`));
                      const fileExtension = templateUrlValue.getText().replace(/'/g, '');
                      templateUrl = join(fileBase, fileExtension);
                    }
                  }
                }
              });
            }
          });

          if (template != null && template.length > 0) {
            // TODO: Make this check more robust
            containsMezzuriteDirective = template.indexOf('mezzurite') > -1;
          } else if (templateUrl != null && templateUrl.length > 0) {
            // In the case of both template and templateUrl are found, template is used.
            try {
              containsMezzuriteDirective = readFileSync(templateUrl).toString().indexOf('mezzurite') > -1;
            } catch {
              // TODO: Graceful exit?
            }
          }
        }
      }
    }
  }

  return containsMezzuriteDirective;
}

export default generateNgComponent;
