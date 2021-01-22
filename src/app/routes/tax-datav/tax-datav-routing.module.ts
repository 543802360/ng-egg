import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TaxDatavNavComponent } from './nav/nav.component';
import { TaxDatavSummaryComponent } from './summary/summary.component';
import { TaxDatavGsqyComponent } from './gsqy/gsqy.component';
import { TaxDatavBwqyphbComponent } from './bwqyphb/bwqyphb.component';
import { TaxDatavMjsh0Component } from './mjsh0/mjsh0.component';
import { TaxDatavJtqyComponent } from './jtqy/jtqy.component';
import { TaxDatavZtDjsComponent } from './zt_djs/zt_djs.component';
import { TaxDatavZtSyjgComponent } from './zt_syjg/zt_syjg.component';
import { TaxDatavZtGxjsComponent } from './zt_gxjs/zt_gxjs.component';
import { TaxDatavZtFdcComponent } from './zt_fdc/zt_fdc.component';
import { TaxDatavZtGsqyGyComponent } from './zt_gsqy_gy/zt_gsqy_gy.component';


const routes: Routes = [

  {
    path: 'nav',
    component: TaxDatavNavComponent,
    children: [
      {
        path: 'summary',
        component: TaxDatavSummaryComponent,
        data: {
          title: '税收数据空间可视化分析平台'
        }
      },
      {
        path: 'gsqy',
        component: TaxDatavGsqyComponent,
        data: {
          title: '规上工业分布图'
        }
      },
      {
        path: 'bwqyph',
        component: TaxDatavBwqyphbComponent,
        data: {
          title: '规上工业分布图'
        }
      },
      {
        path: 'mjsh0',
        component: TaxDatavMjsh0Component,
        data: {
          title: '亩均税收分布图'
        }
      },
      {
        path: 'jtqy',
        component: TaxDatavJtqyComponent,
        data: {
          title: '集团企业分布图'
        }
      },
      {
        path: 'zt_djs',
        component: TaxDatavZtDjsComponent,
        data: {
          title: '独角兽和瞪羚企业分布图'
        }
      },
      {
        path: 'zt_gsqy_gy',
        component: TaxDatavZtGsqyGyComponent,
        data: {
          title: '规上企业工业'
        }
      },
      {
        path: 'zt_gxjs',
        component: TaxDatavZtGxjsComponent,
        data: {
          title: '高新技术企业分布图'
        }
      },
      {
        path: 'zt_syjg',
        component: TaxDatavZtSyjgComponent,
        data: {
          title: '税源结构分布图'
        }
      },
      {
        path: 'zt_fdc',
        component: TaxDatavZtFdcComponent,
        data: {
          title: '房地产企业分布图'
        }
      },
      {
        path: '',
        redirectTo: 'summary',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: 'nav',
    pathMatch: 'full'
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TaxDatavRoutingModule { }
