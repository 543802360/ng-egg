import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { JrySummaryComponent } from './jry-summary/jry-summary.component';
import { JryZgsListComponent } from './zgs-list/zgs-list.component';

const routes: Routes = [

  {
    path: 'summary',
    data: {
      title: '金融业税收概况'
    },
    component: JrySummaryComponent
  },
  {
    path: 'list',
    data: {
      title: '金融业税收明细'
    },
    component: JryZgsListComponent
  },
  {
    path: '',
    redirectTo: 'summary',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ThematicJryRoutingModule { }
