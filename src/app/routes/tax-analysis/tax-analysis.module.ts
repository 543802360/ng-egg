import { NgModule } from '@angular/core';
import { SharedModule } from '@shared';
import { TaxAnalysisRoutingModule } from './tax-analysis-routing.module';
import { TaxAnalysisOrderComponent } from './order/order.component';
import { TaxAnalysisOrderEditComponent } from './order/edit/edit.component';
import { TaxAnalysisOrderViewComponent } from './order/view/view.component';
import { TaxAnalysisSingleComponent } from './single/single.component';
import { TaxAnalysisSingleEditComponent } from './single/edit/edit.component';
import { TaxAnalysisSingleViewComponent } from './single/view/view.component';
import { TaxAnalysisBatchComponent } from './batch/batch.component';

const COMPONENTS = [
  TaxAnalysisOrderComponent,
  TaxAnalysisSingleComponent,
  TaxAnalysisBatchComponent];
const COMPONENTS_NOROUNT = [
  TaxAnalysisOrderEditComponent,
  TaxAnalysisOrderViewComponent,
  TaxAnalysisSingleEditComponent,
  TaxAnalysisSingleViewComponent];

@NgModule({
  imports: [
    SharedModule,
    TaxAnalysisRoutingModule
  ],
  declarations: [
    ...COMPONENTS,
    ...COMPONENTS_NOROUNT
  ],
  entryComponents: COMPONENTS_NOROUNT
})
export class TaxAnalysisModule { }
