import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AccountSettingComponent } from './setting/setting.component';
import { AccountBaseComponent } from './base/base.component';
import { AccountSecurityComponent } from './security/security.component';
import { ACLGuard } from '@delon/acl';

const routes: Routes = [

  {
    path: 'setting',
    component: AccountSettingComponent,
    canActivateChild: [ACLGuard],
    children: [
      {
        path: 'base',
        component: AccountBaseComponent,
        data: {
          title: '基本设置',
          guard: {
            ability: ['/account/setting/base']
          },
          guard_url: 'exception/403'
        }
      },
      {
        path: 'security',
        component: AccountSecurityComponent,
        data: {
          title: '安全设置',
          guard: {
            ability: ['/account/setting/security']
          },
          guard_url: 'exception/403'
        }
      },
      {
        path: '',
        redirectTo: 'base',
        pathMatch: 'full'
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountRoutingModule { }
