import {ExtensionConstants} from './constants/extension-constants';
import {MezzuriteAngular} from './frameworks/mezzurite-angular';
import {MezzuriteReact} from './frameworks/mezzurite-react';
import {MezzuriteUtils} from './utils/mezzurite-utils';

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
                mezzuriteFramework = new MezzuriteAngular(this.filePath);
            break;
            case ExtensionConstants.mezzuriteReact:
                mezzuriteFramework = new MezzuriteReact(this.filePath);
            break;
            default: console.log('Mezzurite framework name '+ this.frameworkName + ' or version '+ this.frameworkversion +' is invalid!');
        }
        if(mezzuriteFramework){
            return await mezzuriteFramework.executeFrameworkSpecificRules();
        }
        return MezzuriteUtils.createOutputObject([], []);
    }
  }
  
  export function ValidateRules(name: string, version: number, filePath: any) {
    return new ExecuteMezzuriteFrameworkRules(name, version, filePath);
  }