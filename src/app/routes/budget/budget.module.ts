import { NgModule } from '@angular/core';
import { SharedModule } from '@shared';
import { BudgetRoutingModule } from './budget-routing.module';
import { BudgetBdgSettingBdgCountyComponent } from './bdg-setting/bdg-county/bdg-county.component';
import { BudgetBdgSettingBdgTownComponent } from './bdg-setting/bdg-town/bdg-town.component';
import { BudgetBdgAnalysisCompanyOrderComponent } from './bdg-analysis/company-order/company-order.component';
import { BudgetCompanyOrderEditComponent } from "./bdg-analysis/company-order/edit/edit.component";
import { BudgetCompanyOrderViewComponent } from './bdg-analysis/company-order/view/view.component';
import { BudgetBdgAnalysisBatchQueryComponent } from './bdg-analysis/batch-query/batch-query.component';
import { BudgetBdgAnalysisSingleQueryComponent } from './bdg-analysis/single-query/single-query.component';
import { NgLeafletModule } from '../../ng-leaflet/ng-leaflet.module';
import { OnboardingModule } from '@delon/abc';

const COMPONENTS = [
  BudgetBdgSettingBdgCountyComponent,
  BudgetBdgSettingBdgTownComponent,
  BudgetBdgAnalysisCompanyOrderComponent,
  BudgetBdgAnalysisBatchQueryComponent,
  BudgetBdgAnalysisSingleQueryComponent];
const COMPONENTS_NOROUNT = [
  BudgetCompanyOrderEditComponent,
  BudgetCompanyOrderViewComponent];

@NgModule({
  imports: [
    NgLeafletModule,
    SharedModule,
    BudgetRoutingModule,
    OnboardingModule,
  ],
  declarations: [
    ...COMPONENTS,
    ...COMPONENTS_NOROUNT
  ],
  entryComponents: COMPONENTS_NOROUNT
})
export class BudgetModule { }
