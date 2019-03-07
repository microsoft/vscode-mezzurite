// This file is being ignored by typescript because it is only used in tests.

// @ts-ignore
@Component({
  selector: 'barrel',
  templateUrl: './templateNotInstrumented.html'
})
// @ts-ignore
export class TemplateUrlInstrumentedComponent implements OnInit {
  public ngOnInit () {
    console.log('hello `Barrel` component');
  }
}
