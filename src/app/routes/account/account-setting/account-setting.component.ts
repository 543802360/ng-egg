import { Component, OnInit } from '@angular/core';
import { _HttpClient } from '@delon/theme';

@Component({
  selector: 'app-account-account-setting',
  templateUrl: './account-setting.component.html',
})
export class AccountAccountSettingComponent implements OnInit {

  constructor(private http: _HttpClient) { }

  ngOnInit() { }

}
