import { Node, SyntaxKind, SourceFile, SyntaxList, Identifier } from 'ts-morph';

import MezzuriteComponent from '../../../models/mezzuriteComponent';

function generateReact (filePath: string, sourceFile: SourceFile): MezzuriteComponent {
  let component = null;

  if (filePath != null && sourceFile != null) {
    const exportContents = getExportContents(sourceFile);

    if (exportContents != null) {
      let hasWithMezzurite = false;
      let name = null;

      if (exportContents.getKind() === SyntaxKind.Identifier) {
        name = exportContents.getText();
      } else {
        const identifiers = exportContents.getDescendantsOfKind(SyntaxKind.Identifier);
        const lastIdentifier = identifiers[identifiers.length - 1];

        if (lastIdentifier != null) {
          name = lastIdentifier.getText();
        }

        if (exportContents.getText().indexOf('withMezzurite') > -1) {
          hasWithMezzurite = true;
        }
      }

      component = {
        checks: {
          hasWithMezzurite
        },
        filePath,
        name,
        type: 'react'
      };
    }
  }

  return component;
}

function getExportContents (sourceFile: SourceFile): Node {
  let exportContents = null;
  const fileContents = sourceFile.getChildSyntaxList();

  if (fileContents != null) {
    const exportAssignment = fileContents.getFirstChildByKind(SyntaxKind.ExportAssignment);
    if (exportAssignment != null) {
      const defaultKeyword = exportAssignment.getChildren().find((child: Node) => {
        return child.getKind() === SyntaxKind.DefaultKeyword;
      });

      if (defaultKeyword != null) {
        exportContents = defaultKeyword.getNextSibling();
      }
    }
  }

  return exportContents;
}

export default generateReact;
