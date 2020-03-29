import { NgModule } from '@angular/core';
import { SharedModule } from '@shared';
import { CompanyRoutingModule } from './company-routing.module';
import { CompanyListComponent } from './list/list.component';
import { CompanyListEditComponent } from './list/edit/edit.component';
import { CompanyListViewComponent } from './list/view/view.component';
import { CompanyPositionComponent } from './position/position.component';
import { CompanyPositionEditComponent } from './position/edit/edit.component';
import { CompanyPositionViewComponent } from './position/view/view.component';


const COMPONENTS = [
  CompanyListComponent,
  CompanyPositionComponent,
];
const COMPONENTS_NOROUNT = [
  CompanyListEditComponent,
  CompanyListViewComponent,
  CompanyPositionEditComponent,
  CompanyPositionViewComponent];

@NgModule({
  imports: [
    SharedModule,
    CompanyRoutingModule
  ],
  declarations: [
    ...COMPONENTS,
    ...COMPONENTS_NOROUNT
  ],
  entryComponents: COMPONENTS_NOROUNT
})
export class CompanyModule { }
