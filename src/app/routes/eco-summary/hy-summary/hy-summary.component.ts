import { Component, OnInit } from '@angular/core';
import { _HttpClient } from '@delon/theme';

@Component({
  selector: 'app-eco-summary-hy-summary',
  templateUrl: './hy-summary.component.html',
})
export class EcoSummaryHySummaryComponent implements OnInit {

  constructor(private http: _HttpClient) { }

  ngOnInit() { }

}
