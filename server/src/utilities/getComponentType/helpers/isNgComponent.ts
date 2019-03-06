function isNgComponent (fileContents: string): boolean {
  let isNgComponent = false;

  if (fileContents != null) {
    isNgComponent = fileContents.indexOf('@Component') >= 0;
  }

  return isNgComponent;
}

export default isNgComponent;
