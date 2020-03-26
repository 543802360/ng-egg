import { NgModule } from '@angular/core';
import { SharedModule } from '@shared';
import { BuildingEconomicRoutingModule } from './building-economic-routing.module';

const COMPONENTS = [];
const COMPONENTS_NOROUNT = [];

@NgModule({
  imports: [
    SharedModule,
    BuildingEconomicRoutingModule
  ],
  declarations: [
    ...COMPONENTS,
    ...COMPONENTS_NOROUNT
  ],
  entryComponents: COMPONENTS_NOROUNT
})
export class BuildingEconomicModule { }
