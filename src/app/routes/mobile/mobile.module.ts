import { SharedModule } from '@shared';
import { HomeComponent } from './home/home.component';
import { NgModule } from '@angular/core';
import { MobileRoutingModule } from './mobile-routing.module';

const COMPONENTS = [HomeComponent];
const COMPONENTS_NOROUNT = [];

@NgModule({
  imports: [
    SharedModule,
    MobileRoutingModule
  ],
  declarations: [
    ...COMPONENTS,
    ...COMPONENTS_NOROUNT
  ],
})
export class MobileModule { }
