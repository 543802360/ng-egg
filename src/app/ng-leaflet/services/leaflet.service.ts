import { LazyService } from '@delon/util';
import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";

@Injectable({
  providedIn: "root"
})
export class LeafletService {

  constructor(private http: HttpClient,
    private lazySrv: LazyService) {

  }

  addMeasureCtrl() {
    // L.control
    //   .measure({
    //     position: "topleft",
    //     primaryLengthUnit: "meters",
    //     secondaryLengthUnit: undefined,
    //     primaryAreaUnit: "sqmeters",
    //     secondaryAreaUnit: undefined,
    //     activeColor: "#08316F",
    //     completedColor: "#08316F",
    //     localization: "cn"
    //   })
    //   .addTo(this.map);
  }

  addDrawControl(drawOptions?: any) {
    const editableLayer = L.featureGroup();
    const defaultDrawOptions = {
      position: 'topleft',
      draw: {
        polyline: false,
        polygon: false,
        rectangle: false,
        circle: false,
      },
      edit: {
        featureGroup: editableLayer,
        remove: false
      }
    }

  }

}
