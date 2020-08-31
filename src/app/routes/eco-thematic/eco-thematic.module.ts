import { NgModule } from '@angular/core';
import { SharedModule } from '@shared';
import { EcoThematicRoutingModule } from './eco-thematic-routing.module';

const COMPONENTS = [];
const COMPONENTS_NOROUNT = [];

@NgModule({
  imports: [
    SharedModule,
    EcoThematicRoutingModule
  ],
  declarations: [
    ...COMPONENTS,
    ...COMPONENTS_NOROUNT
  ],
})
export class EcoThematicModule { }
