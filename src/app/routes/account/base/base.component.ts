import { Component, OnInit } from '@angular/core';
import { _HttpClient } from '@delon/theme';

@Component({
  selector: 'app-account-base',
  templateUrl: './base.component.html',
})
export class AccountBaseComponent implements OnInit {
  i: any = {};
  constructor(private http: _HttpClient) { }

  ngOnInit() { }

}
