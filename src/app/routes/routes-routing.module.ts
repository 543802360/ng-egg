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
import { LayoutDefaultComponent } from '../layout/default/default.component';
import { LayoutFullScreenComponent } from '../layout/fullscreen/fullscreen.component';
import { LayoutPassportComponent } from '../layout/passport/passport.component';
// dashboard pages
import { DashboardComponent } from './dashboard/dashboard.component';
// passport pages
import { UserLoginComponent } from './passport/login/login.component';
import { UserRegisterComponent } from './passport/register/register.component';
import { UserRegisterResultComponent } from './passport/register-result/register-result.component';
// single pages
import { CallbackComponent } from './callback/callback.component';
import { UserLockComponent } from './passport/lock/lock.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutDefaultComponent,
    canActivate: [JWTGuard],
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      // 系统首页仪表盘（一览性）
      {
        path: 'dashboard',
        component: DashboardComponent,
        data: { title: '税收仪表盘' }
      },
      // 异常处理模块
      {
        path: 'exception',
        loadChildren: () => import('./exception/exception.module').then(m => m.ExceptionModule)
      },
      // 税源管理模块
      {
        path: 'company',
        loadChildren: () => import('./company/company.module').then(m => m.CompanyModule)
      },
      // 税收分析模块
      {
        path: 'analysis',
        loadChildren: () => import('./tax-analysis/tax-analysis.module').then(m => m.TaxAnalysisModule)
      },
      // 楼宇经济子模块
      {
        path: 'building',
        loadChildren: () => import('./building/building.module').then(m => m.BuildingModule)
      },
      // 系统设置子模块
      {
        path: 'sys',
        loadChildren: () => import('./sys/sys.module').then(m => m.SysModule)
      },
      // 个人中心模块
      {
        path: 'account',
        loadChildren: () => import('./account/account.module').then(m => m.AccountModule)
      }
      // { path: 'widgets', loadChildren: () => import('./widgets/widgets.module').then(m => m.WidgetsModule) },
    ]
  },

  // 全屏布局
  // {
  //     path: 'fullscreen',
  //     component: LayoutFullScreenComponent,
  //     children: [
  //     ]
  // },
  // passport
  {
    path: 'passport',
    component: LayoutPassportComponent,
    children: [
      { path: 'login', component: UserLoginComponent, data: { title: '登录' } },
      { path: 'register', component: UserRegisterComponent, data: { title: '注册' } },
      { path: 'register-result', component: UserRegisterResultComponent, data: { title: '注册结果' } },
      { path: 'lock', component: UserLockComponent, data: { title: '锁屏' } },
    ]
  },
  // 单页不包裹Layout
  { path: 'callback/:type', component: CallbackComponent },
  { path: '**', redirectTo: 'exception/404' },
];

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
