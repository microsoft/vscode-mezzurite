import { sync } from 'globby';
import { join } from 'path';

function extractSourceFiles (rootDirectory: string): string[] {
  let normalized = rootDirectory;

  const colonIndex = normalized.lastIndexOf(':');
  if (colonIndex > -1) {
    normalized = normalized.substring(colonIndex + 1);
  }

  const escapedColonIndex = normalized.lastIndexOf('%3A');

  if (escapedColonIndex > -1) {
    normalized = normalized.substring(escapedColonIndex + 3);
  }

  const files = sync([ join(normalized, '**', '*.+(js|jsx|ts|tsx)'), join('!**', 'node_modules') ]);
  return files;
}

export default extractSourceFiles;
