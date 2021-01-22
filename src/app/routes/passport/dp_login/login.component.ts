import { map } from 'rxjs/operators';
import { SettingsService, _HttpClient } from '@delon/theme';
import { Component, OnDestroy, Inject, Optional } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { ITokenService, DA_SERVICE_TOKEN } from '@delon/auth';
import { ReuseTabService } from '@delon/abc';
import { StartupService } from '@core';
import { CacheService } from '@delon/cache';
import { ACLService } from '@delon/acl';

@Component({
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.less'],
})
export class DpLoginComponent implements OnDestroy {

  constructor(
    private activeRoute: ActivatedRoute,
    private router: Router,
    private settingsService: SettingsService,
    @Inject(DA_SERVICE_TOKEN) private tokenService: ITokenService,
    private startupSrv: StartupService,
    private cacheSrv: CacheService,
    public http: _HttpClient,
    public msg: NzMessageService,
  ) {
    this.activeRoute.queryParams.subscribe(params => {
      const { username, password } = params;
      this.login(username, password);
      console.log(params, 'login');
    });
  }
  count = 0;
  interval$: any;

  login(username, password) {

    // /api/sys/user/permmenu
    // 默认配置中对所有HTTP请求都会强制 [校验](https://ng-alain.com/auth/getting-started) 用户 Token
    // 然一般来说登录请求不需要校验，因此可以在请求URL加上：`/login?_allow_anonymous=true` 表示不触发用户 Token 校验
    this.http
      .post('sys/user/login?_allow_anonymous=true', {
        // http://76.68.16.192/prod-api/login
        // .post('http://140.68.16.96:10010/prod-api/login', {
        username,
        password
      })
      .subscribe(
        (res: any) => {
          // 设置用户Token信息
          this.tokenService.set({ token: res.data.token });
          // 设置user信息，
          // const { name, email, photo } = res.data;
          // this.settingsService.setUser({ name, email, avatar: photo });
          // 持久化userInfo
          this.cacheSrv.set('userInfo', res.data);

          // 重新获取 StartupService 内容，我们始终认为应用信息一般都会受当前用户授权范围而影响
          this.startupSrv.load().then((result) => {
            console.log(' this.tokenService.referrer!.url', this.tokenService.referrer!.url);
            let url = '/fullscreen';
            // let url = this.tokenService.referrer!.url || '/full';
            if (url.includes('/passport')) {
              url = '/';
            }
            this.router.navigateByUrl(url);
          }).catch(error => { });
        });
  }

  // #region social


  // #endregion

  ngOnDestroy(): void {
    if (this.interval$) {
      clearInterval(this.interval$);
    }
  }
}
