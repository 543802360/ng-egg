import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { EconomicAnalysisHyAnalysisComponent } from './hy-analysis/hy-analysis.component';
import { EconomicAnalysisMapTaxDotMapComponent } from './map/tax-dot-map/tax-dot-map.component';
import { EconomicAnalysisMapTaxAggMapComponent } from './map/tax-agg-map/tax-agg-map.component';
import { EconomicAnalysisBillAnalysisComponent } from './bill-analysis/bill-analysis.component';
import { EconomicAnalysisMapTaxHyMapComponent } from './map/tax-hy-map/tax-hy-map.component';

const routes: Routes = [
  {
    path: 'dashboard',
    component: DashboardComponent,
    data: {
      title: '财政总收入'
    }
  },
  {
    path: 'hy-analysis',
    component: EconomicAnalysisHyAnalysisComponent,
    data: {
      title: '分产业行业分析'
    }
  },
  {
    path: 'tax-dot-map',
    component: EconomicAnalysisMapTaxDotMapComponent,
    data: {
      title: '税源地图'
    }
  },
  {
    path: 'tax-agg-map',
    component: EconomicAnalysisMapTaxAggMapComponent,
    data: {
      title: '镇街收入地图'
    }
  },
  {
    path: 'tax-hy-map',
    component: EconomicAnalysisMapTaxHyMapComponent,
    data: {
      title: '行业收入地图'
    }
  },
  {
    path: 'bill-analysis',
    component: EconomicAnalysisBillAnalysisComponent,
    data: {
      title: '税票分析'
    }
  },
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EconomicAnalysisRoutingModule { }
