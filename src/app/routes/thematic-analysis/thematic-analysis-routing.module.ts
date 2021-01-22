import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DjsEnterpriseGroupOrderComponent } from './djs/djs.component';
import { FdcEnterpriseGroupOrderComponent } from './fdc/fdc.component';
import { GsqyfwEnterpriseGroupOrderComponent } from './gsqy-fw/gsqy-fw.component';
import { GsqygyEnterpriseGroupOrderComponent } from './gsqy-gy/gsqy-gy.component';
import { GxjsEnterpriseGroupOrderComponent } from './gxjs/gxjs.component';
import { JzqyEnterpriseGroupOrderComponent } from './jzqy/jzqy.component';
import { KjxzxEnterpriseGroupOrderComponent } from './kjxzx/kjxzx.component';
import { XsqyplsyEnterpriseGroupOrderComponent } from './xsqy-plsy/xsqy-plsy.component';
import { EnterpriseGroupDetailComponent } from './detail/detail.component';
import { EnterpriseGroupMapComponent } from './map/map.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'djs',
        component: DjsEnterpriseGroupOrderComponent
      },
      {
        path: 'fdc',
        component: FdcEnterpriseGroupOrderComponent,
        data: {
          title: '房地产分析'
        }
      },
      {
        path: 'gsqy-fw',
        component: GsqyfwEnterpriseGroupOrderComponent,
        data: {
          title: '规上企业-服务'
        }
      },
      {
        path: 'gsqy-gy',
        component: GsqygyEnterpriseGroupOrderComponent,
        data: {
          title: '规上企业-工业'
        }
      },
      {
        path: 'gxjs',
        component: GxjsEnterpriseGroupOrderComponent,
        data: {
          title: '高新技术'
        }
      },
      {
        path: 'jzqy',
        component: JzqyEnterpriseGroupOrderComponent,
        data: {
          title: '建筑企业'
        }
      },
      {
        path: 'kjxzx',
        component: KjxzxEnterpriseGroupOrderComponent,
        data: {
          title: '科技型中小企业'
        }
      },
      {
        path: 'xsqy-plsy',
        component: XsqyplsyEnterpriseGroupOrderComponent,
        data: {
          title: '限上企业-批零商业'
        }
      },
      {
        path: 'detail',
        component: EnterpriseGroupDetailComponent
      },
      {
        path: 'map',
        component: EnterpriseGroupMapComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ThematicAnalysisRoutingModule { }
