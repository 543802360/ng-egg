import { Component, OnInit } from '@angular/core';
import { _HttpClient } from '@delon/theme';

@Component({
  selector: 'app-eco-summary-cy-summary',
  templateUrl: './cy-summary.component.html',
})
export class EcoSummaryCySummaryComponent implements OnInit {

  constructor(private http: _HttpClient) { }

  ngOnInit() { }

}
