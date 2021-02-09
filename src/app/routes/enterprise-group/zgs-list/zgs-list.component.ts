import { Component, OnInit } from '@angular/core';
import { _HttpClient } from '@delon/theme';

@Component({
  selector: 'app-enterprise-group-zgs-list',
  templateUrl: './zgs-list.component.html',
})
export class EnterpriseGroupZgsListComponent implements OnInit {

  constructor(private http: _HttpClient) { }

  ngOnInit() { }

}
