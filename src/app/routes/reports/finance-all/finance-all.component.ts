import { Component, OnInit } from '@angular/core';
import { _HttpClient } from '@delon/theme';

@Component({
  selector: 'app-reports-finance-all',
  templateUrl: './finance-all.component.html',
})
export class ReportsFinanceAllComponent implements OnInit {

  constructor(private http: _HttpClient) { }

  ngOnInit() { }

}
