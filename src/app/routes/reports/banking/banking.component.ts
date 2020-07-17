import { Component, OnInit } from '@angular/core';
import { _HttpClient } from '@delon/theme';

@Component({
  selector: 'app-reports-banking',
  templateUrl: './banking.component.html',
})
export class ReportsBankingComponent implements OnInit {

  constructor(private http: _HttpClient) { }

  ngOnInit() { }

}
