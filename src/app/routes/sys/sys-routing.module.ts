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
import { SysDepartmentComponent } from './department/department.component';

const routes: Routes = [

  {
    path: 'role',
    component: SysRoleComponent,
    canActivate: [ACLGuard],
    data: {
      title: '角色管理',
      guard: {
        ability: ['/sys/role'],
      },
      guard_url: 'exception/403'
    }
  },
  {
    path: 'menu',
    component: SysMenuComponent,
    canActivate: [ACLGuard],
    data:
    {
      title: '菜单管理',
      guard: {
        ability: ['/sys/menu'],
      },
      guard_url: 'exception/403'
    }
  },
  {
    path: 'user',
    component: SysUserComponent,
    canActivate: [ACLGuard],
    data: {
      title: '用户管理',
      guard: {
        ability: ['/sys/user'],
      },
      guard_url: 'exception/403'
    }
  },
  {
    path: 'department',
    component: SysDepartmentComponent,
    canActivate: [ACLGuard],
    data: {
      title: '部门管理',
      guard: {
        ability: ['/sys/department'],
      },
      guard_url: 'exception/403'
    }
  },
  {
    path: 'log',
    component: SysLogComponent,
    canActivate: [ACLGuard],
    data: { title: '日志管理' }
  },
  {
    path: '',
    redirectTo: 'user',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SysRoutingModule { }
