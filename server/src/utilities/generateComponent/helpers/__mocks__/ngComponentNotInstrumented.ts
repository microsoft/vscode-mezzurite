// This file is being ignored by typescript because it is only used in tests.

// @ts-ignore
@Component({
  selector: 'barrel',
  template: `
    <div>
    <h1 component-title="barrelComponent">Hello from Barrel</h1>
    <span>
      <a [routerLink]=" ['./child-barrel'] ">
        Child Barrel
      </a>
    </span>
    <router-outlet></router-outlet>
    </div>
  `
})
// @ts-ignore
export class NotInstrumentedComponent implements OnInit {
  public ngOnInit () {
    console.log('hello `Barrel` component');
  }
}
