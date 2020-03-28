import { Component, OnInit } from '@angular/core';
import { _HttpClient } from '@delon/theme';

@Component({
  selector: 'app-account-account-setting-security',
  templateUrl: './account-setting-security.component.html',
})
export class AccountAccountSettingSecurityComponent implements OnInit {

  constructor(private http: _HttpClient) { }

  ngOnInit() { }

}
