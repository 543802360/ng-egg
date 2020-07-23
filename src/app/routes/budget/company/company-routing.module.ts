import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CompanyListComponent } from './list/list.component';
import { CompanyPositionComponent } from './position/position.component';
import { CompanyUsedNameComponent } from './used-name/used-name.component';
import { ACLGuard } from '@delon/acl';
import { CompanyDjnsrxxComponent } from './djnsrxx/djnsrxx.component';
import { CompanyNewComponent } from './new/new.component';

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
            title: '分街道企业库',
            guard: {
              ability: ['/company/list'],
            },
            guard_url: 'exception/403'
          }
        },
        {
          path: 'new',
          component: CompanyNewComponent,
          data: {
            title: '新设立企业',
            guard: {
              ability: ['company/new']
            },
            guard_url: 'exception/403'
          }
        },
        {
          path: 'position',
          component: CompanyPositionComponent,
          data: {
            title: '税源位置管理',
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
            title: '企业曾用名分析',
            guard: {
              ability: ['/company/used-name'],
            },
            guard_url: 'exception/403'
          }
        },
        {
          path: 'djnsrxx',
          component: CompanyDjnsrxxComponent,
          data: {
            title: '税务登记信息',
            guard: {
              ability: ['/company/djnsrxx'],
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
