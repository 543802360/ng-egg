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

const routes: Routes = [

  { path: 'role', component: SysRoleComponent },
  { path: 'menu', component: SysMenuComponent },
  { path: 'user', component: SysUserComponent },
  { path: 'log', component: SysLogComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SysRoutingModule { }
