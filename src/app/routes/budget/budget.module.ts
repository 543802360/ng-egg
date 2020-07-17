import { NgModule } from '@angular/core';
import { SharedModule } from '@shared';
import { BudgetRoutingModule } from './budget-routing.module';
import { BudgetBdgSettingBdgCountyComponent } from './bdg-setting/bdg-county/bdg-county.component';
import { BudgetBdgSettingBdgTownComponent } from './bdg-setting/bdg-town/bdg-town.component';

const COMPONENTS = [
  BudgetBdgSettingBdgCountyComponent,
  BudgetBdgSettingBdgTownComponent];
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
