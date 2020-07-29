import { NgLeafletModule } from './../../../ng-leaflet/ng-leaflet.module';
import { NgModule } from '@angular/core';
import { SharedModule } from '@shared';
import { CompanyRoutingModule } from './company-routing.module';
import { CompanyListComponent } from './list/list.component';
import { CompanyListEditComponent } from './list/edit/edit.component';
import { CompanyListViewComponent } from './list/view/view.component';
import { CompanyPositionComponent } from './position/position.component';
import { CompanyPositionEditComponent } from './position/edit/edit.component';
import { CompanyPositionViewComponent } from './position/view/view.component';
import { CompanyUsedNameComponent } from './used-name/used-name.component';
import { CompanyUsedNameEditComponent } from './used-name/edit/edit.component';
import { CompanyUsedNameViewComponent } from './used-name/view/view.component';
import { NgxMapboxGLModule } from 'ngx-mapbox-gl';
import { CompanyDjnsrxxComponent } from './djnsrxx/djnsrxx.component';
import { CompanyDjnsrxxEditComponent } from './djnsrxx/edit/edit.component';
import { CompanyDjnsrxxViewComponent } from './djnsrxx/view/view.component';
import { CompanyNewComponent } from './new/new.component';
import { CompanyNewEditComponent } from './new/edit/edit.component';
import { CompanyNewViewComponent } from './new/view/view.component';
import { CompanyDjnsrxxAddComponent } from './djnsrxx/add/add.component';


const COMPONENTS = [
  CompanyListComponent,
  CompanyPositionComponent,
  CompanyUsedNameComponent,
  CompanyDjnsrxxComponent,
  CompanyNewComponent];
const COMPONENTS_NOROUNT = [
  CompanyListEditComponent,
  CompanyListViewComponent,
  CompanyPositionEditComponent,
  CompanyPositionViewComponent,
  CompanyUsedNameEditComponent,
  CompanyUsedNameViewComponent,
  CompanyDjnsrxxEditComponent,
  CompanyDjnsrxxViewComponent,
  CompanyNewEditComponent,
  CompanyNewViewComponent,
  CompanyDjnsrxxAddComponent];

@NgModule({
  imports: [
    SharedModule,
    CompanyRoutingModule,
    NgxMapboxGLModule,
    NgLeafletModule,
  ],
  declarations: [
    ...COMPONENTS,
    ...COMPONENTS_NOROUNT
  ],
  entryComponents: COMPONENTS_NOROUNT
})
export class CompanyModule { }
