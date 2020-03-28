import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AccountAccountSettingComponent } from './account-setting/account-setting.component';
import { AccountAccountSettingBaseComponent } from './account-setting-base/account-setting-base.component';
import { AccountAccountSettingSecurityComponent } from './account-setting-security/account-setting-security.component';

const routes: Routes = [

  { path: 'account-setting', component: AccountAccountSettingComponent },
  { path: 'account-setting-base', component: AccountAccountSettingBaseComponent },
  { path: 'account-setting-security', component: AccountAccountSettingSecurityComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountRoutingModule { }
