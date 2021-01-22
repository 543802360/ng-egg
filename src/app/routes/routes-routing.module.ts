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
// single pages
import { CallbackComponent } from './callback/callback.component';
import { UserLockComponent } from './passport/lock/lock.component';
import { ACLGuard } from '@delon/acl';
import { DpLoginComponent } from './passport/dp_login/login.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutDefaultComponent,
    canActivate: [JWTGuard],
    children: [
      {
        path: '',
        redirectTo: 'economic',
        pathMatch: 'full'
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
      // 集团企业模块
      {
        path: 'enterprise-group',
        loadChildren: () => import('./enterprise-group/enterprise-group.module').then(m => m.EnterpriseGroupModule)
      },
      // 亩均税收
      {
        path: 'avg-tax',
        loadChildren: () => import('./avg-tax/avg-tax.module').then(m => m.AvgTaxModule)
      },
      // 专题分析
      {
        path: 'thematic-ana',
        loadChildren: () => import('./thematic-analysis/thematic-analysis.module').then(m => m.ThematicAnalysisModule)

      },
      // 异常处理模块
      {
        path: 'exception',
        loadChildren: () => import('./exception/exception.module').then(m => m.ExceptionModule)
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
  {
    path: 'fullscreen',
    component: LayoutFullScreenComponent,
    children: [
      {
        path: 'tax-datav',
        loadChildren: () => import('./tax-datav/tax-datav.module').then(m => m.TaxDatavModule)
      },
      {
        path: '',
        redirectTo: 'tax-datav',
        pathMatch: 'full'
      }
    ]
  },
  // passport
  {
    path: 'passport',
    component: LayoutPassportComponent,
    children: [
      { path: 'login', component: UserLoginComponent, data: { title: '登录' } },
      { path: 'dplogin', component: DpLoginComponent, data: { title: '大屏登录' } },
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
