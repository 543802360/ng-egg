import { NgModule } from '@angular/core';
import { SharedModule } from '@shared';
import { ReportsRoutingModule } from './reports-routing.module';
import { ReportsFinanceAllComponent } from './finance-all/finance-all.component';
import { ReportsHyComponent } from './hy/hy.component';
import { ReportsTownComponent } from './town/town.component';
import { ReportsEnterpriseComponent } from './enterprise/enterprise.component';
import { ReportsBankingComponent } from './banking/banking.component';

const COMPONENTS = [
  ReportsFinanceAllComponent,
  ReportsHyComponent,
  ReportsTownComponent,
  ReportsEnterpriseComponent,
  ReportsBankingComponent];
const COMPONENTS_NOROUNT = [];

@NgModule({
  imports: [
    SharedModule,
    ReportsRoutingModule
  ],
  declarations: [
    ...COMPONENTS,
    ...COMPONENTS_NOROUNT
  ],
  entryComponents: COMPONENTS_NOROUNT
})
export class ReportsModule { }
