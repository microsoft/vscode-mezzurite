interface MezzuriteComponent {
  checks: {
    [key: string]: boolean;
  };
  filePath: string;
  name: string;
  type: string;
}

export default MezzuriteComponent;
