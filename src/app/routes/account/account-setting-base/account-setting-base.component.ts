import { Component, OnInit } from '@angular/core';
import { _HttpClient } from '@delon/theme';

@Component({
  selector: 'app-account-account-setting-base',
  templateUrl: './account-setting-base.component.html',
})
export class AccountAccountSettingBaseComponent implements OnInit {

  constructor(private http: _HttpClient) { }

  ngOnInit() { }

}
