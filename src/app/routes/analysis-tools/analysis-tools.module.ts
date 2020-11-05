import { NgModule, Type } from '@angular/core';
import { SharedModule } from '@shared';
import { AnalysisToolsRoutingModule } from './analysis-tools-routing.module';

const COMPONENTS: Type<void>[] = [];
const COMPONENTS_NOROUNT: Type<void>[] = [];

@NgModule({
  imports: [
    SharedModule,
    AnalysisToolsRoutingModule
  ],
  declarations: [
    ...COMPONENTS,
    ...COMPONENTS_NOROUNT
  ],
})
export class AnalysisToolsModule { }
