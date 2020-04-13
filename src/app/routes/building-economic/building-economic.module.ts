import { NgModule } from '@angular/core';
import { SharedModule } from '@shared';
import { BuildingEconomicRoutingModule } from './building-economic-routing.module';
import { NgxMapboxGLModule } from "ngx-mapbox-gl";
import { BuildingEconomicListComponent } from './list/list.component';
import { BuildingEconomicListEditComponent } from './list/edit/edit.component';
import { BuildingEconomicListViewComponent } from './list/view/view.component';
import { BuildingEconomicMapComponent } from './map/map.component';
import { BuildingEconomicCompanyComponent } from './company/company.component';
import { BuildingEconomicCompanyEditComponent } from './company/edit/edit.component';
import { BuildingEconomicCompanyViewComponent } from './company/view/view.component';
import { BuildingEconomicCreateComponent } from './create/create.component';

const COMPONENTS = [
  BuildingEconomicListComponent,
  BuildingEconomicMapComponent,
  BuildingEconomicCompanyComponent,
  BuildingEconomicCreateComponent];
  
const COMPONENTS_NOROUNT = [
  BuildingEconomicListEditComponent,
  BuildingEconomicListViewComponent,
  BuildingEconomicCompanyEditComponent,
  BuildingEconomicCompanyViewComponent];

@NgModule({
  imports: [
    SharedModule,
    NgxMapboxGLModule,
    BuildingEconomicRoutingModule
  ],
  declarations: [
    ...COMPONENTS,
    ...COMPONENTS_NOROUNT
  ],
  entryComponents: COMPONENTS_NOROUNT
})
export class BuildingEconomicModule { }
