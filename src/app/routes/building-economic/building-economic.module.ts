import { NgModule } from '@angular/core';
import { SharedModule } from '@shared';
import { BuildingEconomicRoutingModule } from './building-economic-routing.module';
import { BuildingEconomicCreateBuildingComponent } from './create-building/create-building.component';
import { BuildingEconomicBuildingListComponent } from './building-list/building-list.component';
import { BuildingEconomicBuildingListEditComponent } from './building-list/edit/edit.component';
import { BuildingEconomicBuildingListViewComponent } from './building-list/view/view.component';
import { BuildingEconomicBuildingMapComponent } from './building-map/building-map.component';
import { NgxMapboxGLModule } from "ngx-mapbox-gl";
const COMPONENTS = [
  BuildingEconomicCreateBuildingComponent,
  BuildingEconomicBuildingListComponent,
  BuildingEconomicBuildingMapComponent];
const COMPONENTS_NOROUNT = [
  BuildingEconomicBuildingListEditComponent,
  BuildingEconomicBuildingListViewComponent,
];

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
