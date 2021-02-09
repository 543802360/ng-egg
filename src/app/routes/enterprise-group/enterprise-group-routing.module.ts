import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EnterpriseGroupGroupSummaryComponent } from './group-summary/group-summary.component';
import { EnterpriseGroupZgsListComponent } from './zgs-list/zgs-list.component';

const routes: Routes = [

  {
    path: 'group-summary',
    data: {
      title: '集团税收概况'
    },
    component: EnterpriseGroupGroupSummaryComponent
  },
  {
    path: 'zgs-list',
    data: {
      title: '子公司税收'
    },
    component: EnterpriseGroupZgsListComponent
  },
  {
    path: '',
    redirectTo: 'group-summary',
    pathMatch: 'full'
  }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EnterpriseGroupRoutingModule { }
