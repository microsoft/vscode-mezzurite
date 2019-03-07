// @ts-ignore
@Component({
  selector: 'barrel',
  templateUrl: './templateInstrumented.html'
})
// @ts-ignore
export class TemplateUrlInstrumentedComponent implements OnInit {

  public ngOnInit () {
    console.log('hello `Barrel` component');
  }

}
