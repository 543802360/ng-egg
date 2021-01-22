import { Component, OnInit } from '@angular/core';
import { _HttpClient } from '@delon/theme';

@Component({
  selector: 'app-reports-enterprise',
  templateUrl: './enterprise.component.html',
})
export class ReportsEnterpriseComponent implements OnInit {

  constructor(private http: _HttpClient) { }

  ngOnInit() { }

}
