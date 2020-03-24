import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { Exception403Component } from './403.component';
import { Exception404Component } from './404.component';
import { Exception500Component } from './500.component';
import { ExceptionTriggerComponent } from './trigger.component';

const routes: Routes = [
  { path: '403', component: Exception403Component, data: { title: '无权访问' } },
  { path: '404', component: Exception404Component, data: { title: '找不到该页面' } },
  { path: '500', component: Exception500Component, data: { title: '服务器响应失败' } },
  { path: 'trigger', component: ExceptionTriggerComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ExceptionRoutingModule { }
