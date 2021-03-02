import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { EconomicAnalysisHyAnalysisComponent } from './hy-analysis/hy-analysis.component';
import { EconomicAnalysisMapTaxDotMapComponent } from './map/tax-dot-map/tax-dot-map.component';
import { EconomicAnalysisMapTaxAggMapComponent } from './map/tax-agg-map/tax-agg-map.component';
import { EconomicAnalysisBillAnalysisComponent } from './bill-analysis/bill-analysis.component';
import { EconomicAnalysisMapTaxHyMapComponent } from './map/tax-hy-map/tax-hy-map.component';
import { EconomicAnalysisQybtqTopnComponent } from './qybtq-topn/qybtq-topn.component';
import { EconomicAnalysisZsxmAnalysisComponent } from './zsxm-analysis/zsxm-analysis.component';

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
    path: 'zsxm-analysis',
    component: EconomicAnalysisZsxmAnalysisComponent,
    data: {
      title: '分税种分析'
    }
  },
  {
    path: 'tax-dot-map',
    component: EconomicAnalysisMapTaxDotMapComponent,
    data: {
      title: '税源区域分布情况'
    }
  },
  {
    path: 'tax-agg-map',
    component: EconomicAnalysisMapTaxAggMapComponent,
    data: {
      title: '税收收入区域分布'
    }
  },
  {
    path: 'tax-hy-map',
    component: EconomicAnalysisMapTaxHyMapComponent,
    data: {
      title: '税收收入行业分布'
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
    path: 'qybtq-topn',
    data: {
      title: '同期税收分析'
    },
    component: EconomicAnalysisQybtqTopnComponent
  },
  {
    path: '',
    redirectTo: 'tax-dot-map',
    pathMatch: 'full'
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EconomicAnalysisRoutingModule { }
