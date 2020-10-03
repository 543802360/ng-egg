import { Component, OnInit } from '@angular/core';
import { _HttpClient } from '@delon/theme';

@Component({
  selector: 'app-tax-datav-summary',
  templateUrl: './summary.component.html',
})
export class TaxDatavSummaryComponent implements OnInit {

  constructor(private http: _HttpClient) { }

  ngOnInit() { }

}
