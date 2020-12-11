import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';

const routes: Routes = [
  {
    path: 'home',
    component: HomeComponent,
    children:
      [
        {
          path: 'eco-summary',
          loadChildren: () => import('./eco-summary/eco-summary.module').then(m => m.EcoSummaryModule),
        },
        {
          path: 'eco-thematic',
          loadChildren: () => import('./eco-thematic/eco-thematic.module').then(m => m.EcoThematicModule),
        },
        {
          path: '',
          redirectTo: 'eco-summary',
          pathMatch: 'full'
        }
      ]
  },
  {
    path: 'passport',
    loadChildren: () => import('./user/user.module').then(m => m.UserModule)
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MobileRoutingModule { }
