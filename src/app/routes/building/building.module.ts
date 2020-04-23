import { NgModule } from '@angular/core';
import { SharedModule } from '@shared';
import { BuildingRoutingModule } from './building-routing.module';
import { BuildingModelComponent } from './model/model.component';
import { BuildingModelEditComponent } from './model/edit/edit.component';
import { BuildingModelViewComponent } from './model/view/view.component';
import { NgxMapboxGLModule } from 'ngx-mapbox-gl';
import { BuildingListComponent } from './list/list.component';
import { BuildingListEditComponent } from './list/edit/edit.component';
import { BuildingListViewComponent } from './list/view/view.component';
import { BuildingMapComponent } from './map/map.component';

const COMPONENTS = [
  BuildingModelComponent,
  BuildingListComponent,
  BuildingMapComponent];
const COMPONENTS_NOROUNT = [
  BuildingModelEditComponent,
  BuildingModelViewComponent,
  BuildingListEditComponent,
  BuildingListViewComponent];

@NgModule({
  imports: [
    SharedModule,
    NgxMapboxGLModule,
    BuildingRoutingModule
  ],
  declarations: [
    ...COMPONENTS,
    ...COMPONENTS_NOROUNT
  ],
  entryComponents: COMPONENTS_NOROUNT
})
export class BuildingModule { }
