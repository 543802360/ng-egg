/*
 * @Author: 刘硕
 * @Date: 2020-03-10 16:15:36
 * @LastEditTime: 2020-03-10 16:25:19
 * @LastEditors: Please set LastEditors
 * @Description: 系统设置模块
 * @FilePath: /ng-egg/src/app/routes/sys/sys.module.ts
 */

import { NgModule } from '@angular/core';
import { SharedModule } from '@shared';
import { SysRoutingModule } from './sys-routing.module';
import { SysRoleComponent } from './role/role.component';
import { SysRoleEditComponent } from './role/edit/edit.component';
import { SysRoleViewComponent } from './role/view/view.component';
import { SysDepartmentComponent } from './department/department.component';
import { SysDepartmentEditComponent } from './department/edit/edit.component';
import { SysDepartmentViewComponent } from './department/view/view.component';
import { SysMenuComponent } from './menu/menu.component';
import { SysMenuEditComponent } from './menu/edit/edit.component';
import { SysMenuViewComponent } from './menu/view/view.component';
import { SysUserComponent } from './user/user.component';
import { SysUserEditComponent } from './user/edit/edit.component';
import { SysUserViewComponent } from './user/view/view.component';
import { SysLogComponent } from './log/log.component';

const COMPONENTS = [
  SysRoleComponent,
  SysDepartmentComponent,
  SysMenuComponent,
  SysUserComponent,
  SysLogComponent];
const COMPONENTS_NOROUNT = [
  SysRoleEditComponent,
  SysRoleViewComponent,
  SysDepartmentEditComponent,
  SysDepartmentViewComponent,
  SysMenuEditComponent,
  SysMenuViewComponent,
  SysUserEditComponent,
  SysUserViewComponent];

@NgModule({
  imports: [
    SharedModule,
    SysRoutingModule
  ],
  declarations: [
    ...COMPONENTS,
    ...COMPONENTS_NOROUNT
  ],
  entryComponents: COMPONENTS_NOROUNT
})
export class SysModule { }
