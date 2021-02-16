import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FavorMainComponent } from './components/favor-main/favor-main.component';
import { FavorQyComponent } from './components/favor-qy/favor-qy.component';
import { ModifyPwdComponent } from './components/modify-pwd/modify-pwd.component';

const routes: Routes = [
  {
    path: '',
    component: FavorMainComponent,
    children: [
      {
        path: 'favorQy',
        component: FavorQyComponent
      },
      {
        path: 'modifyPwd',
        component: ModifyPwdComponent
      },
      {
        path: '',
        redirectTo: 'favorQy',
        pathMatch: 'full'
      }]
  }]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FavorRoutingModule { }
