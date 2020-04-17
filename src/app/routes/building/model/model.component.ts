import { LoadingTypesService } from '@core/loading-types.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Component, OnInit, ViewChild } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { STColumn, STComponent } from '@delon/abc/table';
import { SFSchema } from '@delon/form';
import { BuildingModelEditComponent } from './edit/edit.component';
import * as dark from "../../geo/styles/dark.json";
import * as mapboxgl from "mapbox-gl";
import * as MapboxDraw from "@mapbox/mapbox-gl-draw";
import { LoadingService } from '@delon/abc';

@Component({
  selector: 'app-building-model',
  templateUrl: './model.component.html',
  styleUrls: ['./model.component.less']
})
export class BuildingModelComponent implements OnInit {


  //#region  mapbox map config
  style;
  center;
  zoom;
  map: mapboxgl.Map;
  //#endregion
  url = `/user`;
  searchSchema: SFSchema = {
    properties: {
      no: {
        type: 'string',
        title: '编号'
      }
    }
  };
  @ViewChild('st', { static: false }) st: STComponent;
  columns: STColumn[] = [
    { title: '编号', index: 'no' },
    { title: '调用次数', type: 'number', index: 'callNo' },
    { title: '头像', type: 'img', width: '50px', index: 'avatar' },
    { title: '时间', type: 'date', index: 'updatedAt' },
    {
      title: '',
      buttons: [
        // { text: '查看', click: (item: any) => `/form/${item.id}` },
        // { text: '编辑', type: 'static', component: FormEditComponent, click: 'reload' },
      ]
    }
  ];

  constructor(private http: _HttpClient,
    private modal: ModalHelper,
    private loadingSrv: LoadingService,
    private loadingTypeSrv: LoadingTypesService,
    private msgSrv: NzMessageService) { }

  ngOnInit() {
    this.style = (dark as any).default;
    this.loadingSrv.open({
      type: 'custom',
      custom: this.loadingTypeSrv.loadingTypes.Cubes,
      text: '正在加载，请稍后……'
    });

  }

  /**
   * mapboxgl map loaded event
   * @param e
   */
  mapboxglLoad(e) {
    this.map = e;
    this.loadingSrv.close();
    (window as any).mapboxglmap = this.map;
    // add draw control
    const draw = new MapboxDraw({
      keybindings: false,
      displayControlsDefault: false,
      controls: {
        polygon: true,
        trash: true
      }
    });
    this.map.addControl(draw, 'top-left');

    // add draw create event；edit building info and then save to db；
    this.map.on('draw.create', e => {
      console.log(e);
      this.modal
        .createStatic(BuildingModelEditComponent, { i: { id: 0 } }, {
          modalOptions: {
            nzStyle: {
              left: '26%',
              position: 'fixed'
            }
          }
        })
        .subscribe(() => this.st.reload());
    });
    // add draw update event;
    this.map.on('draw.update', e => {

    });
    // add delete evnet;delete from buildings db;
    this.map.on('draw.delete', e => {

    });
    setTimeout(() => {
      // mapbox-gl-draw_ctrl-draw-btn mapbox-gl-draw_trash
      // update tools tooltip
      (document.getElementsByClassName('mapbox-gl-draw_ctrl-draw-btn mapbox-gl-draw_trash')[0] as any).title = '删除';
      (document.getElementsByClassName('mapbox-gl-draw_ctrl-draw-btn mapbox-gl-draw_polygon')[0] as any).title = '绘制多边形';
    }, 100);
  }
}
