<h1 align="center">
  <br>
    <img src="https://github.com/Microsoft/vscode-mezzurite/blob/master/icon.png?raw=true" alt="logo" width="200">
  <br>
  Mezzurite SDK Extension for Visual Studio Code
  <br>
  <br>
</h1>

This plugin improves the Mezzurite SDK implementation experience.  The Mezzurite SDK provides a consistent way to collect performance metrics of Single Page Applications across a variety of frameworks. Learn more about Mezzurite by visiting our [GitHub Repository](https://github.com/Microsoft/Mezzurite)!

## Features
 
 #### Components Tracking
 Displaying the marked and unmarked components for performance tracking from the application code currently active in editor workspace.

 Updates in Component Tracking Status on the fly whenever a component file or its external html template is changed, deleted or a new component is created.

 ##### Demo
 ![Components Demo](https://github.com/Microsoft/vscode-mezzurite/blob/master/resources/components_demo.gif?raw=true)
 
 ####  Modules Tracking
 Displaying the modules configured with mezzurite performance markers to capture ALT and VLT for the application code currently active in editor workspace.

 Updates in Modules Tracking Status on the fly whenever a module file is changed, deleted or a new module is created. Hovering over the module name displays the missing condition to track that module.

 ##### Demo
 ![Modules Demo](https://github.com/Microsoft/vscode-mezzurite/blob/master/resources/modules_demo.gif?raw=true)

## RoadMap
We are working on to provide the following features:-
 
 #### Intellisense and autocomplete
 Suggestion are provided for mezzurite syntaxes while typing imports and other mezzurite syntaxes. Code completion would be performed automatically while hitting Ctrl+Space on specific syntaxes.
 
 #### Verifying Loggers
 This feature verifies whether logging options for captured metrics is enabled or not. This also provides suggestions on required mandatory properties in logging config.



## Configuration

This extension will be Activated automatically for the active workspace in vs code editor, provided the workspace have a mezzurite dependency.

## Installation

To install, click on the "Install" button above and open with visual studio code, which will bring up the Extensions view in the editor.

You can also reach to this page by clicking on the Extensions icon in the Activity Bar on the side of VS Code or the command Ctrl+Shift+X and typing "mezzurite" keyword in the search bar.

After a successful install, you'll see a Reload button. Clicking on this will restart VS Code to enable the extension.

## Limitations
- Currently tracking Components and Modules feature is only supported for mezzurite-angular framework.
- Explorer views are fixed and therefore are always visible. In the case of React, the modules section would not be needed.

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License

Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT License.

## Support

For more information and feedback on Mezzurite and its extensions. Please contact us at:- [mezzurite@microsoft.com](mailto:mezzurite@microsoft.com)

