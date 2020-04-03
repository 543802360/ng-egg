import { Component, OnInit } from '@angular/core';
import { _HttpClient } from '@delon/theme';

@Component({
  selector: 'app-account-security',
  templateUrl: './security.component.html',
  styleUrls: ['./security.component.less']
})
export class AccountSecurityComponent implements OnInit {
  i: any = {};
  constructor(private http: _HttpClient) { }

  ngOnInit() { }

}
