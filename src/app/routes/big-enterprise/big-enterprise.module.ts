import { NgModule } from '@angular/core';
import { SharedModule } from '@shared';
import { BigEnterpriseRoutingModule } from './big-enterprise-routing.module';
import { BigEnterpriseListComponent } from './list/list.component';
import { BigEnterpriseListEditComponent } from './list/edit/edit.component';
import { BigEnterpriseListViewComponent } from './list/view/view.component';
import { BigEnterpriseTaxAnalysisComponent } from './tax-analysis/tax-analysis.component';
import { BigEnterpriseHyAnalysisComponent } from './hy-analysis/hy-analysis.component';
import { BigEnterpriseCreateComponent } from './create/create.component';
import { NgxMapboxGLModule } from 'ngx-mapbox-gl';

const COMPONENTS = [
  BigEnterpriseListComponent,
  BigEnterpriseTaxAnalysisComponent,
  BigEnterpriseHyAnalysisComponent,
  BigEnterpriseCreateComponent];
const COMPONENTS_NOROUNT = [
  BigEnterpriseListEditComponent,
  BigEnterpriseListViewComponent];

@NgModule({
  imports: [
    SharedModule,
    NgxMapboxGLModule,
    BigEnterpriseRoutingModule
  ],
  declarations: [
    ...COMPONENTS,
    ...COMPONENTS_NOROUNT
  ],
  entryComponents: COMPONENTS_NOROUNT
})
export class BigEnterpriseModule { }
