import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { NgZorroAntdModule } from "ng-zorro-antd";
import { LeafletDirective } from "./directives/leaflet.directive";
import { LeafletService } from "./services/leaflet.service";
import { HttpClientModule } from "@angular/common/http";
// import * as L from "leaflet";

@NgModule({
  imports: [CommonModule,
    FormsModule,
    HttpClientModule
  ],
  declarations: [
    LeafletDirective
  ],
  exports: [
    LeafletDirective,
  ]
})
export class NgLeafletModule {

}
