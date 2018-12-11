import {ExtensionConstants} from './constants/extension-constants';
import {MezzuriteAngularV1} from './frameworks/mezzurite-angular';

export class ExecuteMezzuriteFrameworkRules {
    private frameworkName: string;
    private frameworkversion: number;
    private filePath: any;
  
    constructor(name: string, version: number, filePath: any) {
      this.frameworkName = name;
      this.frameworkversion = version;
      this.filePath = filePath;
    }
  
    async executeRules() {
        let mezzuriteFramework: any;
        switch(this.frameworkName){
            case ExtensionConstants.mezzuriteAngularJs:
            break;
            case ExtensionConstants.mezzuriteAngular:
                mezzuriteFramework = new MezzuriteAngularV1(this.filePath);
            break;
            case ExtensionConstants.mezzuriteReact:
            break;
            default: console.log('Mezzurite framework name '+ this.frameworkName + ' or version '+ this.frameworkversion +' is invalid!');
        }
        return await mezzuriteFramework.executeFrameworkSpecificRules();
    }
  }
  
  export function ValidateRules(name: string, version: number, filePath: any) {
    return new ExecuteMezzuriteFrameworkRules(name, version, filePath);
  }