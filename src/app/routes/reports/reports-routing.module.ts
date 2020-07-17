import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ReportsFinanceAllComponent } from './finance-all/finance-all.component';
import { ReportsHyComponent } from './hy/hy.component';
import { ReportsTownComponent } from './town/town.component';
import { ReportsEnterpriseComponent } from './enterprise/enterprise.component';
import { ReportsBankingComponent } from './banking/banking.component';

const routes: Routes = [

  { path: 'finance-all', component: ReportsFinanceAllComponent },
  { path: 'hy', component: ReportsHyComponent },
  { path: 'town', component: ReportsTownComponent },
  { path: 'enterprise', component: ReportsEnterpriseComponent },
  { path: 'banking', component: ReportsBankingComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportsRoutingModule { }
