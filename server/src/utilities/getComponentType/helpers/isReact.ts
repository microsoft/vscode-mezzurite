function isReact (fileContents: string): boolean {
  let hasReactImport = false;

  if (fileContents != null) {
    const importIndex = fileContents.indexOf(`from 'react'`);

    if (importIndex > 0) {
      const importPortion = fileContents.substring(0, importIndex);
      hasReactImport = importPortion.indexOf(' React ') > 0
        || importPortion.indexOf(' React,') > 0;
    }
  }

  return hasReactImport;
}

export default isReact;
