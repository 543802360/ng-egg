import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CacheService } from '@delon/cache';
import { _HttpClient } from '@delon/theme';
import { ToastService } from 'ng-zorro-antd-mobile';
import { FavorService } from '../../service/favor.service';

@Component({
  selector: 'modify-pwd',
  templateUrl: './modify-pwd.component.html',
  styleUrls: ['./modify-pwd.component.css']
})
export class ModifyPwdComponent implements OnInit, AfterViewInit {

  oldpassword = "";
  newpassword = "";
  repassword = "";

  constructor(
    private cacheSrv: CacheService,
    private http: _HttpClient,
    private _toast: ToastService,
    private favorService: FavorService) { }


  ngOnInit() {
    this.favorService.segControlObservable.subscribe(e => {
      setTimeout(() => {
        e.selectedIndex = 1;
      });
    });
  }

  ngAfterViewInit() {
    this.favorService.segControlInstance.selectedIndex = 1;
  }

  confirm() {
    const username = this.cacheSrv.get('userInfo', { mode: 'none' }).username;

    this.oldpassword == "" ? this._toast.info('请输入旧密码', 1500)
      : this.newpassword == "" || this.repassword == "" ? this._toast.info('请输入新密码', 1500)
        : this.newpassword != this.repassword ? this._toast.info('两次输入密码不同，请检查', 1500) : null;
    this.http.post('sys/user/updatepwd', {
      username, oldpassword: this.oldpassword, newpassword: this.newpassword
    }).subscribe(resp => {
      this._toast.info(resp.msg)
    })


  }

}
