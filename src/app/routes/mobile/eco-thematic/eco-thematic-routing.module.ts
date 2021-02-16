import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MobileTmOrderComponent } from './tm-order/tm-order.component';
import { MobileTmJdxzComponent } from './tm-jdxz/tm-jdxz.component';
import { MobileTmBigEnterpriseComponent } from './tm-big-enterprise/tm-big-enterprise.component';
import { MobileTmNavComponent } from './tm-nav/tm-nav.component';
import { MobileTmSingleComponent } from './tm-single/tm-single.component';

const routes: Routes =
  [
    {
      path: '',
      component: MobileTmNavComponent,
      children: [
        {
          path: 'order',
          component: MobileTmOrderComponent
        },
        {
          path: 'big-enterprise',
          component: MobileTmBigEnterpriseComponent
        },
        {
          path: 'jdxz',
          component: MobileTmJdxzComponent
        },
        {
          path: 'single',
          component: MobileTmSingleComponent
        },
        {
          path: '',
          redirectTo: 'order',
          pathMatch: 'full'
        }
      ]
    }
  ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EcoThematicRoutingModule { }
