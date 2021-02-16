import { Component, OnInit, AfterViewInit } from '@angular/core';
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

  constructor(private _toast: ToastService, private favorService: FavorService) { }


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

    // this.oldpassword == "" ? this._toast.info('请输入旧密码',1500)
    //   : this.newpassword == "" || this.repassword == "" ? this._toast.info('请输入新密码',1500)
    //     : this.newpassword != this.repassword ? this._toast.info('两次输入密码不同，请检查',1500) : null;

    // this.favorService.modifyPwd(this.oldpassword, this.newpassword).subscribe(resp => {
    //   resp['flag'] == "success" ? this._toast.success(resp['message'], 1500) : this._toast.fail(resp['message'], 1500)
    // }, error => {
    //   this._toast.offline('网络错误，请检查链接', 2000);
    // });

  }

}
