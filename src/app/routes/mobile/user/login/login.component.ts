import { Component, Inject } from '@angular/core';
import { ToastService } from 'ng-zorro-antd-mobile';
import { _HttpClient, SettingsService } from '@delon/theme';
import { ITokenService, DA_SERVICE_TOKEN } from '@delon/auth';
import { StartupService } from '@core';
import { CacheService } from '@delon/cache';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.less']
})
export class LoginComponent {
  title = '城阳智慧财源';
  username: string;
  password: string;

  constructor(
    private _toast: ToastService,
    public _http: _HttpClient,
    @Inject(DA_SERVICE_TOKEN) private tokenSrv: ITokenService,
    private startupSrv: StartupService,
    private settingSrv: SettingsService,
    private cacheSrv: CacheService,
    private router: Router) { }

  login() {
    if (!(this.username && this.password && this.username.trim())) {
      this._toast.info('请输入用户名密码！');
      return;
    }

    // /api/sys/user/permmenu
    // 默认配置中对所有HTTP请求都会强制 [校验](https://ng-alain.com/auth/getting-started) 用户 Token
    // 然一般来说登录请求不需要校验，因此可以在请求URL加上：`/login?_allow_anonymous=true` 表示不触发用户 Token 校验
    this._http
      .post('sys/user/login?_allow_anonymous=true', {
        username: this.username,
        password: this.password,
      })
      .subscribe(
        (res: any) => {
          // 清空路由复用信息
          // 设置用户Token信息
          this.tokenSrv.set({ token: res.data.token });
          // 设置user信息，
          const { name, email, photo } = res.data;
          this.settingSrv.setUser({ name, email, avatar: photo });
          // 持久化userInfo
          this.cacheSrv.set('userInfo', res.data);

          // 重新获取 StartupService 内容，我们始终认为应用信息一般都会受当前用户授权范围而影响
          this.startupSrv.load().then((result) => {
            let url = this.tokenSrv.referrer!.url || '/';
            if (url.includes('/passport')) {
              url = '/';
            }
            this.router.navigateByUrl(url);
          }).catch(error => { });
        });


  }
}
