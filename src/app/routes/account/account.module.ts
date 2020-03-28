import { NgModule } from '@angular/core';
import { SharedModule } from '@shared';
import { AccountRoutingModule } from './account-routing.module';
import { AccountAccountSettingComponent } from './account-setting/account-setting.component';
import { AccountAccountSettingBaseComponent } from './account-setting-base/account-setting-base.component';
import { AccountAccountSettingSecurityComponent } from './account-setting-security/account-setting-security.component';

const COMPONENTS = [
  AccountAccountSettingComponent,
  AccountAccountSettingBaseComponent,
  AccountAccountSettingSecurityComponent];
const COMPONENTS_NOROUNT = [];

@NgModule({
  imports: [
    SharedModule,
    AccountRoutingModule
  ],
  declarations: [
    ...COMPONENTS,
    ...COMPONENTS_NOROUNT
  ],
  entryComponents: COMPONENTS_NOROUNT
})
export class AccountModule { }
