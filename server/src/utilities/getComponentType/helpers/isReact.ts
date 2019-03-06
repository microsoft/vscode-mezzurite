function isReact (fileContents: string): boolean {
  let hasReactImport = false;

  if (fileContents != null) {
    const importIndex = fileContents.indexOf(`from 'react'`);

    if (importIndex > 0) {
      hasReactImport = fileContents.substring(0, importIndex).indexOf(' React ') > 0
        || fileContents.substring(0, importIndex).indexOf(' React,') > 0;
    }
  }

  return hasReactImport;
}

export default isReact;
