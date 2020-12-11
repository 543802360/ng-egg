import { LoginComponent } from './login/login.component';
import { NgModule } from '@angular/core';
import { UserRoutingModule } from './user-routing.module';
import { SharedModule } from '@shared';
import { NavBarModule, InputItemModule } from 'ng-zorro-antd-mobile';

const COMPONENTS = [LoginComponent];
const COMPONENTS_NOROUNT = [LoginComponent];

@NgModule({
  imports: [
    SharedModule,
    UserRoutingModule,
    NavBarModule,
    InputItemModule
  ],
  declarations: [
    ...COMPONENTS,
    ...COMPONENTS_NOROUNT
  ],
})
export class UserModule { }
