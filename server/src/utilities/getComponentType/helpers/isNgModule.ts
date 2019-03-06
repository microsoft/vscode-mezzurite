function isNgModule (fileContents: string): boolean {
  let isNgModule = false;

  if (fileContents != null) {
    isNgModule = fileContents.indexOf('@NgModule') >= 0;
  }

  return isNgModule;
}

export default isNgModule;
