import { NgModule } from '@angular/core';

import { SharedModule } from '@shared';

import { RouteRoutingModule } from './routes-routing.module';
// dashboard pages
// passport pages
import { UserLoginComponent } from './passport/login/login.component';
import { DpLoginComponent } from './passport/dp_login/login.component';
// single pages
import { CallbackComponent } from './callback/callback.component';
import { UserLockComponent } from './passport/lock/lock.component';

const COMPONENTS = [
  // passport pages
  DpLoginComponent,
  UserLoginComponent,
  // single pages
  CallbackComponent,
  UserLockComponent,
];
const COMPONENTS_NOROUNT = [];

@NgModule({
  imports: [SharedModule, RouteRoutingModule],
  declarations: [
    ...COMPONENTS,
    ...COMPONENTS_NOROUNT
  ],
  entryComponents: COMPONENTS_NOROUNT
})
export class RoutesModule { }
