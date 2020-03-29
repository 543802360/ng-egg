import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CompanyListComponent } from './list/list.component';
import { CompanyPositionComponent } from './position/position.component';
import { CompanyUsedNameComponent } from './used-name/used-name.component';
import { ACLGuard } from '@delon/acl';

const routes: Routes = [
  {
    path: '',
    canActivateChild: [ACLGuard],
    children:
      [
        {
          path: 'list',
          component: CompanyListComponent,
          data: {
            title: '企业名录管理',
            guard: {
              ability: ['/company/list'],
            },
            guard_url: 'exception/403'
          }
        },
        {
          path: 'position',
          component: CompanyPositionComponent,
          data: {
            title: '企业位置管理',
            guard: {
              ability: ['/company/position'],
            },
            guard_url: 'exception/403'
          }
        },
        {
          path: 'used-name',
          component: CompanyUsedNameComponent,
          data: {
            title: '企业曾用名管理',
            guard: {
              ability: ['/company/used-name'],
            },
            guard_url: 'exception/403'
          }
        }
      ]
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CompanyRoutingModule { }
