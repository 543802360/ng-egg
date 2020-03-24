import { Injectable, Injector, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { zip } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { MenuService, MenuIcon, SettingsService, TitleService, ALAIN_I18N_TOKEN } from '@delon/theme';
import { DA_SERVICE_TOKEN, ITokenService } from '@delon/auth';
import { ACLService } from '@delon/acl';
import { TranslateService } from '@ngx-translate/core';
import { I18NService } from '../i18n/i18n.service';

import { NzIconService } from 'ng-zorro-antd/icon';
import { ICONS_AUTO } from '../../../style-icons-auto';
import { ICONS } from '../../../style-icons';
import { array2tree, MenuType } from '@shared';
import { ArrayService } from '@delon/util';

/**
 * Used for application startup
 * Generally used to get the basic data of the application, like: Menu Data, User Data, etc.
 */
@Injectable()
export class StartupService {
  constructor(
    iconSrv: NzIconService,
    private menuService: MenuService,
    private translate: TranslateService,
    @Inject(ALAIN_I18N_TOKEN) private i18n: I18NService,
    private settingService: SettingsService,
    private aclService: ACLService,
    private arrayService: ArrayService,
    private titleService: TitleService,
    @Inject(DA_SERVICE_TOKEN) private tokenService: ITokenService,
    private httpClient: HttpClient,
    private injector: Injector
  ) {
    iconSrv.addIcon(...ICONS_AUTO, ...ICONS);
  }

  private viaHttp(resolve: any, reject: any) {
    zip(
      this.httpClient.get('sys/user/admin/permmenu')
    ).pipe(
      catchError(([permsData]) => {
        resolve(null);
        return [permsData];
      })
    ).subscribe(([permsData]) => {

      // Application data
      // Application information: including site name, description, year
      // this.settingService.setApp(res.app);
      // User information: including name, avatar, email address
      // this.settingService.setUser(res.user);
      // ACL: Set the permissions to full, https://ng-alain.com/acl/getting-started
      // this.aclService.setFull(true);
      // Menu data, https://ng-alain.com/theme/menu
      // console.log('perms', permsData.data.perms);
      // const perms = permsData.data.perms.map(item => `ability.${item}`);
      // 设置角色对应的权限
      this.aclService.setAbility(permsData.data.perms);
      // 设置角色对应的菜单
      const menusArray = permsData.data.menus.filter(item => item.menutype !== MenuType.PERMISSION).map(item => {
        let menu;
        item.parent_id ?
          menu = {
            text: item.menuname, // 菜单名称
            key: item.menu_id,  // 菜单id
            parent_id: item.parent_id, // 父菜单id
            link: item.route_path, // 路由
            reuse: true,// 路由复用，所有菜单均使用
            group: false
          } : menu = {
            text: item.menuname, // 菜单名称
            key: item.menu_id,  // 菜单id
            parent_id: item.parent_id, // 父菜单id
            link: item.route_path, // 路由
            icon: item.icon,
            group: false
          };

        return menu;

      });
      const menus = array2tree(menusArray, 'key', 'parent_id', 'children');
      this.menuService.add([
        {
          "text": "主导航",
          "group": true,
          hideInBreadcrumb: true,
          children: menus
        }]);
      // resolve(null);

      // Can be set page suffix title, https://ng-alain.com/theme/title
      // this.titleService.suffix = res.app.name;
    },
      () => { },
      () => {
        resolve(null);
      });
  }

  load(): Promise<any> {
    // only works with promises
    // https://github.com/angular/angular/issues/15088
    return new Promise((resolve, reject) => {
      // http
      this.viaHttp(resolve, reject);
    });
  }
}
