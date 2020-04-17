import { LoadingService } from '@delon/abc';
import { Component, OnInit } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import * as dark from "../../geo/styles/dark.json";
import * as mapboxgl from "mapbox-gl";
import * as MapboxDraw from "@mapbox/mapbox-gl-draw";
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { BuildingEconomicCreateEditComponent } from './edit/edit.component';

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



  constructor(
    private loadSrv: LoadingService,
    private modal: ModalHelper,
    private modalSrv: NzModalService,
    private msgSrv: NzMessageService) { }

  ngOnInit() {
    this.style = (dark as any).default;
    // this.loadSrv.open();
    this.modal.createStatic(BuildingEconomicCreateEditComponent, { record: null })


  }

  add() {
    // this.modal
    //   .createStatic(FormEditComponent, { i: { id: 0 } })
    //   .subscribe(() => this.st.reload());
  }


  /**
   * mapboxgl map loaded
   * @param e
   */
  mapboxglLoad(e) {
    this.map = e;
    (window as any).mapboxmap = e;
    this.loadSrv.close();
    const draw = new MapboxDraw({
      keybindings: false,
      displayControlsDefault: false,
      controls: {
        polygon: true,
        trash: true
      }
    });
    this.map.addControl(draw, 'top-left');

    // 注册绘制事件
    this.map.on('draw.create', e => {
      console.log(e);
      this.modalSrv.success({ nzTitle: '楼宇信息！' });

    });
    this.map.on('draw.update', e => {

    });
    this.map.on('draw.delete', e => {

    });

    setTimeout(() => {
      this.modal.createStatic(BuildingEconomicCreateEditComponent, { record: null })
    }, 1000);
    setTimeout(() => {
      // mapbox-gl-draw_ctrl-draw-btn mapbox-gl-draw_trash
      (document.getElementsByClassName('mapbox-gl-draw_ctrl-draw-btn mapbox-gl-draw_trash')[0] as any).title = '删除';
      (document.getElementsByClassName('mapbox-gl-draw_ctrl-draw-btn mapbox-gl-draw_polygon')[0] as any).title = '绘制多边形';
    }, 100);
  }

  mapresize() {

  }

}
