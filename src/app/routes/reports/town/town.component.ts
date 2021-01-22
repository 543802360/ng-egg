import { Component, OnInit } from '@angular/core';
import { _HttpClient } from '@delon/theme';

@Component({
  selector: 'app-reports-town',
  templateUrl: './town.component.html',
})
export class ReportsTownComponent implements OnInit {

  constructor(private http: _HttpClient) { }

  ngOnInit() { }

}
