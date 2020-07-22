import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ReportsFinanceAllComponent } from './finance-all/finance-all.component';
import { ReportsHyComponent } from './hy/hy.component';
import { ReportsTownComponent } from './town/town.component';
import { ReportsEnterpriseComponent } from './enterprise/enterprise.component';
import { ReportsBankingComponent } from './banking/banking.component';

const routes: Routes = [

  {
    path: 'finance-all',
    component: ReportsFinanceAllComponent,
    data: {
      title: '财政总收入报表'
    }
  },
  {
    path: 'hy',
    component: ReportsHyComponent,
    data: {
      title: '分产业行业收入报表'
    }
  },
  {
    path: 'town',
    component: ReportsTownComponent,
    data: {
      title: '街道一般公共预算收入'
    }
  },
  {
    path: 'enterprise',
    component: ReportsEnterpriseComponent,
    data: {
      title: '大企业收入报表'
    }
  },
  {
    path: 'banking',
    component: ReportsBankingComponent,
    data: {
      title: '银行、保险业税收报表'
    }
  }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportsRoutingModule { }
