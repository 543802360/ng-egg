import { Component, OnInit } from '@angular/core';
import { _HttpClient } from '@delon/theme';

@Component({
  selector: 'app-eco-summary-invoice-summary',
  templateUrl: './invoice-summary.component.html',
})
export class EcoSummaryInvoiceSummaryComponent implements OnInit {

  constructor(private http: _HttpClient) { }

  ngOnInit() { }

}
