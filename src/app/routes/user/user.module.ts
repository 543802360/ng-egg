import { NgModule } from '@angular/core';
import { SharedModule } from '@shared';
import { UserRoutingModule } from './user-routing.module';

const COMPONENTS = [];
const COMPONENTS_NOROUNT = [];

@NgModule({
  imports: [
    SharedModule,
    UserRoutingModule
  ],
  declarations: [
    ...COMPONENTS,
    ...COMPONENTS_NOROUNT
  ],
})
export class UserModule { }
