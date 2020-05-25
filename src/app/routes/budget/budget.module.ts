import { NgModule } from '@angular/core';
import { SharedModule } from '@shared';
import { BudgetRoutingModule } from './budget-routing.module';

const COMPONENTS = [];
const COMPONENTS_NOROUNT = [];

@NgModule({
  imports: [
    SharedModule,
    BudgetRoutingModule
  ],
  declarations: [
    ...COMPONENTS,
    ...COMPONENTS_NOROUNT
  ],
  entryComponents: COMPONENTS_NOROUNT
})
export class BudgetModule { }
