import { NgModule, ModuleWithProviders } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MapboxService } from "./services/mapbox/mapbox.service";
import { MapboxDirective } from "./directives/mapbox/mapbox.directive";
import { HttpClientModule } from "@angular/common/http";

/**
 * angular mapbox封装模块
 *
 * @export
 * @class NgMapboxModule
 */
@NgModule({
  imports: [CommonModule, HttpClientModule],
  declarations: [MapboxDirective],
  exports: [MapboxDirective]
})
export class NgMapboxModule {

}
