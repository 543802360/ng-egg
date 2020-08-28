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
// passport pages
import { UserLoginComponent } from './passport/login/login.component';
import { UserRegisterComponent } from './passport/register/register.component';
import { UserRegisterResultComponent } from './passport/register-result/register-result.component';
// single pages
import { CallbackComponent } from './callback/callback.component';
import { UserLockComponent } from './passport/lock/lock.component';
import { ACLGuard } from '@delon/acl';

const routes: Routes = [
  {
    path: '',
    canActivate: [JWTGuard],
    children: [
      {
        path: '',
        redirectTo: 'mobile',
        pathMatch: 'full'
      },
      // 移动端
      {
        path: 'mobile',
        loadChildren: () => import('./mobile/mobile.module').then(m => m.MobileModule)
      },
      // 经济运行分析
      {
        path: 'economic',
        loadChildren: () => import('./economic-analysis/economic-analysis.module').then(m => m.EconomicAnalysisModule)
      },
      // 预算管理
      {
        path: 'budget',
        loadChildren: () => import('./budget/budget.module').then(m => m.BudgetModule)
      },
      // 大企业管理模块
      {
        path: 'big-enterprise',
        loadChildren: () => import('./big-enterprise/big-enterprise.module').then(m => m.BigEnterpriseModule)
      },
      // 自动化分析报表模块
      {
        path: 'reports',
        loadChildren: () => import('./reports/reports.module').then(m => m.ReportsModule)
      },
      // 异常处理模块
      {
        path: 'exception',
        loadChildren: () => import('./exception/exception.module').then(m => m.ExceptionModule)
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
    ]
  },
  // passport
  {
    path: 'passport',
    loadChildren: () => import('./user/user.module').then(m => m.UserModule)
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
