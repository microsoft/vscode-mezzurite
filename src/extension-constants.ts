
const ExtensionConstants = {
        
     mezzuritePath : '/node_modules/@microsoft/',
     mezzuriteDirectories : ["mezzurite-angular", "mezzurite-react", "mezzurite-angularjs"], 
     mezzuriteFrameworks : ["@microsoft/mezzurite-angular", "@microsoft/mezzurite-react", "@microsoft/mezzurite-angularjs"],
     pathForAppsPackageJson : "**/package.json",
     pathForNodeModules : "**/node_modules/**",
     titleForWelcomePage : "Mezzurite Extension",
     placeholderForStyleTag : "##StyleLink##",
     webviewStyleName : "style.css",
     webviewHtmlFileName : "landingPage.html",
     clientFolderName : "client",
     validateMezzuriteCommand : "extension.validateMezzurite",
     displayLandingPageCommand : "extension.displayLandingPage",

     mezzuriteAngularJs:"@microsoft/mezzurite-angularjs",
     mezzuriteAngular:"@microsoft/mezzurite-angular",
     mezzuriteReact:"@microsoft/mezzurite-react",
}

export { ExtensionConstants };