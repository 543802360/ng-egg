import { GeoUtilService } from './../../../../core/geo-util.service';
import { CacheService } from '@delon/cache';
import { IBuilding, geojson2wkt } from '@shared';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { NzMessageService } from 'ng-zorro-antd/message';
import { _HttpClient } from '@delon/theme';
import { SFSchema, SFUISchema } from '@delon/form';
import { deepCopy } from '@delon/util';
import * as dark from "../../../geo/styles/dark.json";
import * as mapboxgl from "mapbox-gl";
import * as MapboxDraw from "@mapbox/mapbox-gl-draw";
import { LoadingService } from '@delon/abc';

@Component({
  selector: 'app-building-model-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.less']
})
export class BuildingModelEditComponent implements OnInit {
  style = (dark as any).default;
  map: mapboxgl.Map;

  record: any;
  i: IBuilding;
  schema: SFSchema = {
    properties: {
      building_name: {
        type: 'string',
        title: '楼宇名称'
      },
      building_address: {
        type: 'string',
        title: '楼宇地址'
      },
      building_floor: {
        type: 'number',
        title: '楼宇层数'
      },
      building_height: {
        type: 'number',
        title: '楼宇高度'
      },
      building_bz: {
        type: 'string',
        title: '备注'
      },
    },
    required: ['building_name', 'building_height'],
  };
  ui: SFUISchema = {
    '*': {
      spanLabelFixed: 100,
      grid: { span: 12 },
    },
    $building_name: {
      widget: 'string'
    },
    $building_address: {
      widget: 'string'
    },
    $building_height: {
      widget: 'number',
      unit: '米',
      grid: { span: 12 },
    },
    $building_floor: {
      widget: 'number',
      grid: { span: 12 },
    },
    $building_bz: {
      widget: 'textarea',
      grid: { span: 24 },
    },
  };

  constructor(
    private modal: NzModalRef,
    private msgSrv: NzMessageService,
    public http: _HttpClient,
    private loadingSrv: LoadingService,
    private cacheSrv: CacheService,
    private geoUtilSrv: GeoUtilService
  ) { }

  ngOnInit(): void {
    if (this.record) {
      this.i = deepCopy(this.record);
    }
    this.loadingSrv.open();
  }

  /**
   * 保存
   * @param value
   */
  save(value: any) {

    const { department_id } = this.cacheSrv.get('userInfo', { mode: 'none' });
    Object.assign(this.i, {
      ...value,
      jdxz_dm: department_id
    });

    const buildingFeature = {
      id: this.i.building_id,
      type: 'Feature',
      properties: this.i,
      geometry: this.i.shape
    }

    // 创建楼宇
    this.http.post('building/create', this.i).subscribe(resp => {
      if (resp.success) {
        this.msgSrv.success(resp.msg);
        this.modal.close({ feature: buildingFeature })
      } else {
        this.msgSrv.error(resp.msg);
      }
    });

  }

  mapboxglLoad(e) {
    this.loadingSrv.close();
    this.map = e;
    const drawCtrl = new MapboxDraw({
      keybindings: false,
      displayControlsDefault: false,
      controls: {
        polygon: false,
        trash: false
      }
    });
    this.map.addControl(drawCtrl, 'top-left');
    const feature = {
      type: 'Feature',
      properties: this.i,
      geometry: this.i.shape
    }
    const center = this.geoUtilSrv.center(feature);
    console.log('center:', center);
    this.map.flyTo({
      center: center.geometry.coordinates as mapboxgl.LngLatLike,
      zoom: 16
    });
    drawCtrl.add(feature);
    // add draw update event;
    this.map.on('draw.update', e => {
      this.i.shape = e.features[0].geometry;
    });
    // add delete evnet;delete from buildings db;
    this.map.on('draw.delete', e => {

    });
    setTimeout(() => {
      // mapbox-gl-draw_ctrl-draw-btn mapbox-gl-draw_trash
      // update tools tooltip
      // (document.getElementsByClassName('mapbox-gl-draw_ctrl-draw-btn mapbox-gl-draw_trash')[0] as any).title = '删除';
      (document.getElementsByClassName('mapbox-gl-draw_ctrl-draw-btn mapbox-gl-draw_polygon')[0] as any).title = '绘制多边形';
    }, 100);
  }

  close() {
    this.modal.destroy();
  }
}
