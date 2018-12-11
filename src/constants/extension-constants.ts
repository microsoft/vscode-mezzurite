
const ExtensionConstants = {
     mezzuritePath : '/node_modules/@microsoft/',
     mezzuriteDirectories : ["mezzurite-angular", "mezzurite-react", "mezzurite-angularjs"], 
     mezzuriteFrameworks : ["@microsoft/mezzurite-angular", "@microsoft/mezzurite-react", "@microsoft/mezzurite-angularjs"],
     pathForAppsPackageJson : "**/package.json",
     pathForNodeModules : "**/node_modules/**",
     pathForTypescriptFiles : "**/*.ts",
     titleForWelcomePage : "Mezzurite Extension",
     placeholderForStyleTag : "##StyleLink##",
     webviewStyleName : "style.css",
     webviewHtmlFileName : "landingPage.html",
     clientFolderName : "client",
     componentDecorator: "@Component",
     moduleDecorator: "@NgModule",
     componentDecoratorName: "Component",
     moduleDecoratorName: "NgModule",
     routingService: "RoutingService",
     angularPerfModule:"AngularPerfModule.forRoot()",
     template: "template",
     templateUrl: "templateUrl",
     marked: "Marked",
     unmarked : "UnMarked",
     htmlTemplateProvided : "Inline Html Template Provided",
     mezzuriteDirective: "mezzurite",
     componentTitleDirective: "component-title",
     importsText: "imports",
     startText : "start()",
     expressionStatment: "ExpressionStatement",
     callExpression: "CallExpression",
     componentsTreeview:"componentsTreeView",
     modulesTreeview:"modulesTreeView",
     typescript:"typescript",
     html:"html",
     resourcesFolder:"resources",
     greenIcon:"marked.png",
     redIcon:"unmarked.png",

     mezzuriteAngularJs:"@microsoft/mezzurite-angularjs",
     mezzuriteAngular:"@microsoft/mezzurite-angular",
     mezzuriteReact:"@microsoft/mezzurite-react",
}

const CommandConstants = {
     validateMezzuriteCommand : "extension.validateMezzurite",
     displayLandingPageCommand : "extension.displayLandingPage",
     trackComponentCommand: "componentTreeView.selectNode",
     trackModuleCommand:"moduleTreeView.selectNode"
}

const TreeviewTitleConstants = {
     markedComponent:"This component is marked for performance tracking.",
     unmarkedComponent:"Missing 'mezzurite' directive. Missing 'component-title' directive.",
     markedModule:"This module is marked for performance tracking.",
     missingMezzuImport:"Missing mezzurite import declaration.",
     missingMezzuForRoot:"Missing AngularPerfModule.forRoot() statement.",
     missingMezzuStart:"Missing router.start() inside constructor."
}
export { ExtensionConstants, CommandConstants, TreeviewTitleConstants };