// This file is being ignored by typescript because it is only used in tests.

// @ts-ignore
@Component({
  selector: 'barrel',
  templateUrl: './badTemplateUrl.html'
})
// @ts-ignore
export class BadTemplateUrlInstrumentedComponent implements OnInit {
  public ngOnInit () {
    console.log('hello `Barrel` component');
  }
}
