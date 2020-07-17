import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BudgetBdgSettingBdgCountyComponent } from './bdg-setting/bdg-county/bdg-county.component';
import { BudgetBdgSettingBdgTownComponent } from './bdg-setting/bdg-town/bdg-town.component';

const routes: Routes = [

  { path: 'bdg-county', component: BudgetBdgSettingBdgCountyComponent },
  { path: 'bdg-town', component: BudgetBdgSettingBdgTownComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BudgetRoutingModule { }
