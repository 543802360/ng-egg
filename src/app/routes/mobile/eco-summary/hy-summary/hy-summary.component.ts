import { Component, OnInit, AfterViewInit } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { forkJoin } from 'rxjs';
@Component({
  selector: 'app-eco-summary-hy-summary',
  templateUrl: './hy-summary.component.html',
})
export class EcoSummaryHySummaryComponent implements OnInit, AfterViewInit {
  hyUrl = `analysis/tax/hy`;
  cyUrl = `analysis/tax/cy`;

  constructor(private http: _HttpClient) { }

  ngOnInit() { }

  ngAfterViewInit() {
    setTimeout(() => {
      // this.getData();
    });
  }




}
