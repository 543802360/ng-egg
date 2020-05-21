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
import { CacheService } from '@delon/cache';

/**
 * Used for application startup
 * Generally used to get the basic data of the application, like: Menu Data, User Data, etc.
 */
@Injectable()
export class StartupService {
  constructor(
    iconSrv: NzIconService,
    private cacheSrv: CacheService,
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
      this.httpClient.get('sys/user/admin/permmenu'),
      this.httpClient.get('sys/departments')
    ).subscribe(([permsData, deparments]) => {
      // this.settingService.setApp(res.app);
      // this.settingService.setUser(res.user);
      // this.aclService.setFull(true);


      //#region  持久化部门行政区划数据

      const node = (deparments as any).data.map(item => {
        return {
          title: item.department_name,
          key: item.department_id,
          parent_id: item.parent_id,
          parent_name: item.parent_name
        };
      });
      const depTreeNodes = array2tree(node, 'key', 'parent_id', 'children');
      this.cacheSrv.set('departments', depTreeNodes);
      //#endregion



      //#region 持久化角色权限
      // 设置角色对应的权限
      const { perms, menus, departments } = (permsData as any).data;
      this.aclService.setAbility(perms);
      const groupid = this.cacheSrv.get('userInfo', { mode: 'none' }).groupid;
      /////// 若为超管，直接设置当前用户为全量，不受限制
      if (groupid === 1) {
        this.aclService.setFull(true);
      }
      // 持久化权限数据
      this.cacheSrv.set('perms', perms);
      //#endregion


      // 设置角色对应的菜单
      const menusArray = menus.filter(item => item.menutype !== MenuType.PERMISSION).map(item => {
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
      const menusTree = array2tree(menusArray, 'key', 'parent_id', 'children');
      this.menuService.add([
        {
          "text": "主导航",
          "group": true,
          hideInBreadcrumb: true,
          children: menusTree

        }]);
      setTimeout(() => {
        resolve(null);
      }, 100);


      // this.titleService.suffix = res.app.name;
    },
      () => {
        resolve(null);
      },
    );
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
