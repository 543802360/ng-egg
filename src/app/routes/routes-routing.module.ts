/*
 * @Author: your name
 * @Date: 2020-03-10 09:05:00
 * @LastEditTime: 2020-03-10 22:21:44
 * @LastEditors: Please set LastEditors
 * @Description: 路由注册入口
 * @FilePath: /ng-egg/src/app/routes/routes-routing.module.ts
 */
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SimpleGuard, JWTGuard } from '@delon/auth';
import { environment } from '@env/environment';
// layout
// passport pages
// single pages

const routes: Routes = [

  // passport
  {
    path: 'passport',
    children: [
      {
        path: 'login',
        loadChildren: () => import('./mobile/user/user.module').then(m => m.UserModule),
        data: { title: '登录' }
      }, {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: 'mobile',
    loadChildren: () => import('./mobile/mobile.module').then(m => m.MobileModule)
  },
  {
    path: '',
    redirectTo: 'mobile',
    pathMatch: 'full'
  },
  // 单页不包裹Layout
  { path: '**', redirectTo: 'exception/404' },
];

// console.log('platforms:', platforms)
// alert(JSON.stringify(platforms.os))
@NgModule({
  imports: [
    RouterModule.forRoot(
      routes, {
      useHash: environment.useHash,
      // NOTICE: If you use `reuse-tab` component and turn on keepingScroll you can set to `disabled`
      // Pls refer to https://ng-alain.com/components/reuse-tab
      scrollPositionRestoration: 'top',
    }
    )],
  exports: [RouterModule],
})
export class RouteRoutingModule { }
