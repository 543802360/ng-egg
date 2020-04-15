import { LoadingService } from '@delon/abc';
import { Component, OnInit } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import * as dark from "../../geo/styles/dark.json";
import * as mapboxgl from "mapbox-gl";


@Component({
  selector: 'app-building-economic-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.less']
})
export class BuildingEconomicCreateComponent implements OnInit {

  style;
  center;
  zoom;
  map: mapboxgl.Map;

  mapboxDraw = require('@mapbox/mapbox-gl-draw');


  constructor(private loadSrv: LoadingService) { }

  ngOnInit() {
    this.style = (dark as any).default;
    this.loadSrv.open();

    console.log('mapbox draw:', this.mapboxDraw);
  }

  add() {
    // this.modal
    //   .createStatic(FormEditComponent, { i: { id: 0 } })
    //   .subscribe(() => this.st.reload());
  }


  mapboxglLoad(e) {
    this.map = e;
    this.loadSrv.close();
    // const draw = new mapboxDraw();
    // this.map.addControl(draw, 'top-left');
  }

  mapresize() {

  }

}
