import { Component, OnInit } from '@angular/core';
import { _HttpClient } from '@delon/theme';

@Component({
  selector: 'app-reports-hy',
  templateUrl: './hy.component.html',
})
export class ReportsHyComponent implements OnInit {

  constructor(private http: _HttpClient) { }

  ngOnInit() { }

}
