import { Component, OnInit } from '@angular/core';
import { CacheService } from '@delon/cache';
import { _HttpClient } from '@delon/theme';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-account-security',
  templateUrl: './security.component.html',
  styleUrls: ['./security.component.less']
})
export class AccountSecurityComponent implements OnInit {
  i: any = {};
  url = 'sys/user/updatepwd';
  constructor(private http: _HttpClient,
    private cacheSrv: CacheService,
    private msgSrv: NzMessageService) { }

  ngOnInit() { }

  ngSubmit() {
    debugger;
    if (this.i.pwd && this.i.repwd && this.i.pwd && this.i.repwd) {
      const username = (this.cacheSrv.get('userInfo', { mode: 'none' })).username;
      this.http.post(this.url, {
        newPwd: this.i.pwd,
        username
      }).subscribe(resp => {
        this.msgSrv.info(resp.msg)
      })
    } else {
      this.msgSrv.warning('密码不一致，请核实！');
    }


  }

}
