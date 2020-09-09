import { EconomicAnalysisMapTaxHyMapComponent } from './map/tax-hy-map/tax-hy-map.component';
import { NgModule } from '@angular/core';
import { SharedModule } from '@shared';
import { EconomicAnalysisRoutingModule } from './economic-analysis-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { EconomicAnalysisHyAnalysisComponent } from './hy-analysis/hy-analysis.component';
import { EconomicAnalysisMapTaxDotMapComponent } from './map/tax-dot-map/tax-dot-map.component';
import { EconomicAnalysisMapTaxAggMapComponent } from './map/tax-agg-map/tax-agg-map.component';
import { EconomicAnalysisBillAnalysisComponent } from './bill-analysis/bill-analysis.component';
import { NgxMapboxGLModule } from 'ngx-mapbox-gl';
import { DragDropModule } from "@angular/cdk/drag-drop";
import { ScrollingModule } from "@angular/cdk/scrolling";
const COMPONENTS = [DashboardComponent,
  EconomicAnalysisHyAnalysisComponent,
  EconomicAnalysisMapTaxDotMapComponent,
  EconomicAnalysisMapTaxAggMapComponent,
  EconomicAnalysisMapTaxHyMapComponent,
  EconomicAnalysisBillAnalysisComponent];
const COMPONENTS_NOROUNT = [];

@NgModule({
  imports: [
    DragDropModule,
    ScrollingModule,
    SharedModule,
    NgxMapboxGLModule,
    EconomicAnalysisRoutingModule
  ],
  declarations: [
    ...COMPONENTS,
    ...COMPONENTS_NOROUNT
  ],
  entryComponents: COMPONENTS_NOROUNT
})
export class EconomicAnalysisModule { }
