import { Component, OnInit } from '@angular/core';
import { _HttpClient, TitleService } from '@delon/theme';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-account-setting',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.less']
})
export class AccountSettingComponent implements OnInit {
  title: string;
  constructor(private http: _HttpClient,
    private route: ActivatedRoute) { }

  ngOnInit() {
    // this.title = this.titleSrv;
    this.route.data.subscribe(data => {
      console.log(data);
    })
  }

}
