# Mezzurite Extension
This is just an initial base extension. We are working on to provide the features mentioned in the Roadmap section in near future.

##Overview

The Mezzurite API standardizes the collection, logging and reporting of performance markers for Single Page Applications (SPA). Mezzurite allows you to collect Real User Monitoring (RUM) data allowing you access to real world insight on performance issues your customers might be facing.

For more information on Mezzurite, please checkout our wiki page [here](https://osgwiki.com/wiki/Mezzurite)

##Frameworks supported

AngularJs

Angular 2-5

Angular 6

React

##Loggers supported

1DS : First Party logging which enables our internal reporting and analysis

Application Insights: Third party offering with data showing up in Azure AppInsights

JSLL: This is mostly to enable those which can not move off JSLL to 1DS at this time.

Dev Tool Console: Used for debugging, doesn't omit telemetry

Custom Loggers: Mezzurite now supports the ability to send it's timing data to any data point you would like. To get more information on this, please checkout our wiki page [here](https://osgwiki.com/wiki/Mezzurite#Custom_Loggers)

##Roadmap
We are working on to provide the following features:-

Displaying marked and unmarked components for tracking

Code completion snippets

Mezzurite syntax suggestions and more information while typing

Verifying loggers

Error diagnostics

##Shortcuts

Validate mezzurite configuration with a shortcut command:- ctrl + alt + m or through command pallete with ctrl + shift + p and type "Validate Mezzurite Configuration"

Get mezzurite extension's guide through command pallete with ctrl + shift + p and type "Mezzurite Extension Guide"

##Metric timing values

Mezzurite vs code extension does not provides details about metric timing values for Application Load Time (ALT), Viewport Load Time (VLT) and Component Load Time (CLT). 

For more details on these metrics and their values, please checkout our Chrome extension [here](https://www.linkToChromeExtension.com)

##Github Repo's

Mezzurite Development:- [https://github.com/Microsoft/Mezzurite](https://github.com/Microsoft/Mezzurite)

Vs code extension for Mezzurite:- [https://github.com/Microsoft/vscode-mezzurite](https://github.com/Microsoft/vscode-mezzurite)

Application Insights Web SDK Mezzurite Extension:- [https://github.com/Microsoft/ApplicationInsights-JS-Mezzurite](https://github.com/Microsoft/ApplicationInsights-JS-Mezzurite)

##Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

##License

Copyright (c) Microsoft Corporation. All rights reserved.

Licensed under the MIT License.

##Support

For more information and feedback on Mezzurite and its extensions. Please contact us at:- [mezzurite@microsoft.com](mailto:mezzurite@microsoft.com)

