import {ExtensionConstants} from './extension-constants';
import {MezzuriteAngularV1} from './mezzurite-angular-version1';

export class ExecuteMezzuriteFrameworkRules {
    private frameworkName: string;
    private frameworkversion: number;
  
    constructor(name: string, health: number) {
      this.frameworkName = name;
      this.frameworkversion = health;
    }
  
    async executeRules() {
        let mezzuriteFramework: any;
        switch(this.frameworkName){
            case ExtensionConstants.mezzuriteAngularJs:
            break;
            case ExtensionConstants.mezzuriteAngular:
                mezzuriteFramework = new MezzuriteAngularV1();
            break;
            case ExtensionConstants.mezzuriteReact:
            break;
            default: console.log('Mezzurite framework name '+ this.frameworkName + ' or version '+ this.frameworkversion +' is invalid!');
        }
        return await mezzuriteFramework.executeFrameworkSpecificRules();
    }
  }
  
  export function ValidateRules(name: string, version: number) {
    return new ExecuteMezzuriteFrameworkRules(name, version);
  }