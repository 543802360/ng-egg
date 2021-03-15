import { NgModule, Type } from '@angular/core';
import { SharedModule } from '@shared';
import { DeductsumRoutingModule } from './deductsum-routing.module';
import { DeductsumDetailsComponent } from './details/details.component';
import { DeductsumTaxRefundComponent } from './tax-refund/tax-refund.component';

const COMPONENTS: Type<void>[] = [
  DeductsumDetailsComponent,
  DeductsumTaxRefundComponent];
const COMPONENTS_NOROUNT: Type<void>[] = [];

@NgModule({
  imports: [
    SharedModule,
    DeductsumRoutingModule
  ],
  declarations: [
    ...COMPONENTS,
    ...COMPONENTS_NOROUNT
  ],
})
export class DeductsumModule { }
