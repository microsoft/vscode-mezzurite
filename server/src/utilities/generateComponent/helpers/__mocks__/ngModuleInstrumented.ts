// This file is being ignored by typescript because it is only used in tests.

// @ts-ignore
import { AngularPerfModule, RoutingService } from '@microsoft/mezzurite-angular';

// @ts-ignore
@NgModule({
  imports: [
    AngularPerfModule.forRoot()
  ]
})
// @ts-ignore
export class InstrumentedModule {
  // @ts-ignore
  constructor (@Inject(RoutingService) private router: typeof RoutingService) {
    // @ts-ignore
    router.start();
  }
}
