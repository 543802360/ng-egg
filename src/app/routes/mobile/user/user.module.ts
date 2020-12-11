import { LoginComponent } from './login/login.component';
import { NgModule } from '@angular/core';
import { UserRoutingModule } from './user-routing.module';
import { SharedModule } from '@shared';
import { NgZorroAntdMobileModule } from 'ng-zorro-antd-mobile';

const COMPONENTS = [LoginComponent];
const COMPONENTS_NOROUNT = [LoginComponent];

@NgModule({
  imports: [
    SharedModule,
    UserRoutingModule,
    NgZorroAntdMobileModule
  ],
  declarations: [
    ...COMPONENTS,
    ...COMPONENTS_NOROUNT
  ],
})
export class UserModule { }
