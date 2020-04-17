import { NgModule } from '@angular/core';
import { SharedModule } from '@shared';
import { BuildingRoutingModule } from './building-routing.module';
import { BuildingModelComponent } from './model/model.component';
import { BuildingModelEditComponent } from './model/edit/edit.component';
import { BuildingModelViewComponent } from './model/view/view.component';
import { NgxMapboxGLModule } from 'ngx-mapbox-gl';

const COMPONENTS = [
  BuildingModelComponent];
const COMPONENTS_NOROUNT = [
  BuildingModelEditComponent,
  BuildingModelViewComponent];

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
