/*
 * @Author:刘硕
 * @Date: 2020-03-10 16:15:36
 * @LastEditTime: 2020-03-10 16:25:31
 * @LastEditors: Please set LastEditors
 * @Description: 系统设置模块 路由注册口
 * @FilePath: /ng-egg/src/app/routes/sys/sys-routing.module.ts
 */

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SysRoleComponent } from './role/role.component';
import { SysMenuComponent } from './menu/menu.component';
import { SysUserComponent } from './user/user.component';
import { SysLogComponent } from './log/log.component';
import { ACLGuard } from '@delon/acl';

const routes: Routes = [
  {
    path: '',
    canActivateChild: [ACLGuard],
    children: [
      {
        path: 'role',
        component: SysRoleComponent,
        data: {
          title: '角色管理',
          guard: {
            ability: ['sys:role:add']
          },
          guard_url: '/exception/403'

        }
      },
      {
        path: 'menu',
        component: SysMenuComponent,
        data: { title: '菜单管理' }
      },
      {
        path: 'user',
        component: SysUserComponent,
        data: { title: '用户管理' }
      },
      {
        path: 'log',
        component: SysLogComponent,
        data: { title: '日志管理' }
      },
      {
        path: '',
        redirectTo: 'role',
        pathMatch: 'full'
      }
    ]
  }, {

  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SysRoutingModule { }
