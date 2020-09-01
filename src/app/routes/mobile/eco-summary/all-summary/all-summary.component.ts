import { Component, OnInit } from '@angular/core';
import { _HttpClient } from '@delon/theme';

@Component({
  selector: 'app-eco-summary-all-summary',
  templateUrl: './all-summary.component.html',
})
export class EcoSummaryAllSummaryComponent implements OnInit {

  constructor(private http: _HttpClient) { }

  ngOnInit() { }

}
