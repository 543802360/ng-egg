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
import * as syncMove from "@mapbox/mapbox-gl-sync-move";
import { LoadingService } from '@delon/abc';
import { Subject, combineLatest, forkJoin, BehaviorSubject } from 'rxjs';
import { NzButtonGroupComponent, NzModalService } from 'ng-zorro-antd';
import { EBuildingOperation } from '../dics/buildingOperation';


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
  map_2d: mapboxgl.Map;
  map_3d: mapboxgl.Map;
  map_2d_subject = new BehaviorSubject({});
  map_3d_subject = new BehaviorSubject({});

  @ViewChild('buildingEdit', { static: false }) buildingEdit: HTMLDivElement;

  // draw
  drawCtrl;
  buildingFeatures = [];
  selectedFeature;
  infoPopup: mapboxgl.Popup;
  //#endregion


  constructor(
    private http: _HttpClient,
    private modal: ModalHelper,
    private modalSrv: NzModalService,
    private loadingSrv: LoadingService,
    private loadingTypeSrv: LoadingTypesService,
    private msgSrv: NzMessageService) {
  }

  // public get map2dObservable(): Observable<mapboxgl.Map> {
  //   return this.map_2d_subject.asObservable();
  // }

  // public get map3dObservable(): Observable<mapboxgl.Map> {
  //   return this.map_2d_subject.asObservable();
  // }

  ngOnInit() {
    this.style = (dark as any).default;
    this.loadingSrv.open({
      type: 'custom',
      custom: this.loadingTypeSrv.loadingTypes.Cubes,
      text: '正在加载，请稍后……'
    });
    // 两幅地图都loaded后，设置同步
    const mapObservable = forkJoin([this.map_2d_subject, this.map_3d_subject]);
    mapObservable.subscribe(
      resp => {
        this.loadingSrv.close();
        syncMove(this.map_2d, this.map_3d);
        this.loadBuildings();

      },
      error => {

      })

  }

  /**
   * mapboxgl map loaded event
   * @param e
   */
  mapboxglLoad(e, type) {
    if (type === '2d') {
      this.map_2d = e;
      // next 发射数据；后要complete
      this.map_2d_subject.next(this.map_2d);
      this.map_2d_subject.complete();
      (window as any).mapboxglmap = this.map_2d;

      // add draw control
      this.drawCtrl = new MapboxDraw({
        keybindings: false,
        displayControlsDefault: false,
        controls: {
          polygon: true,
          trash: false
        }
      });
      this.map_2d.addControl(this.drawCtrl, 'top-left');

      // add draw create event；edit building info and then save to db；
      this.map_2d.on('draw.create', e => {
        console.log('created features:', e);
        const feature = e.features[0];
        this.modal
          .createStatic(BuildingModelEditComponent, {
            record:
            {
              building_id: feature.id,
              shape: feature.geometry
            },
            type: EBuildingOperation.CREATE
          }, {
            modalOptions: {
              nzStyle: {
                left: '26%',
                position: 'fixed'
              }
            }
          })
          .subscribe((res) => {
            if (res.type === EBuildingOperation.CREATE && res.feature) {
              this.selectedFeature = res.feature;
              console.log('create feature:', res);
              this.drawCtrl.delete(res.feature.id);
              setTimeout(() => {
                this.buildingFeatures.push(res.feature);
                this.updateBuildingSource();
              });

            }
          });
      });
      // add draw update event;
      this.map_2d.on('draw.update', e => {

      });
      // add delete evnet;delete from buildings db;
      this.map_2d.on('draw.delete', e => {

      });
      setTimeout(() => {
        // mapbox-gl-draw_ctrl-draw-btn mapbox-gl-draw_trash
        // update tools tooltip
        // (document.getElementsByClassName('mapbox-gl-draw_ctrl-draw-btn mapbox-gl-draw_trash')[0] as any).title = '删除';
        (document.getElementsByClassName('mapbox-gl-draw_ctrl-draw-btn mapbox-gl-draw_polygon')[0] as any).title = '绘制多边形';
      }, 100);
    } else {
      console.log('map 3d init');
      this.map_3d = e;
      this.map_3d_subject.next(this.map_3d);
      this.map_3d_subject.complete();
    }

  }


  /**
   * 加载楼宇数据
   */
  loadBuildings() {
    // 初始化时加载可编辑的楼宇2维底图
    this.http.get('building/listAllBuildingGeo').subscribe(resp => {
      // this.drawCtrl.add(resp.data);
      this.buildingFeatures = resp.data.features;
      const bounds = resp.bounds;
      const v2 = new mapboxgl.LngLatBounds([bounds[0], bounds[1]], [bounds[2], bounds[3]]);
      this.map_2d.fitBounds(v2);

      this.initBuilding2D();
      this.initBuilding3D();

    });
  }

  /**
   * 初始化3D building
   */
  initBuilding3D() {
    this.map_3d.addSource('building3d-source', {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: this.buildingFeatures
      }
    });

    this.map_3d.addLayer({
      id: 'building_3d',
      type: "fill-extrusion",
      source: 'building3d-source',
      layout: { visibility: 'visible' },
      paint: {
        'fill-extrusion-color': '#aaa',

        // use an 'interpolate' expression to add a smooth transition effect to the
        // buildings as the user zooms in
        'fill-extrusion-height': [
          'interpolate',
          ['linear'],
          ['zoom'],
          11,
          0,
          11.05,
          ['get', 'building_height']
        ],
        'fill-extrusion-opacity': 0.6
      }
    });
  }

  /**
   * 初始化2D building
   */
  initBuilding2D() {

    this.infoPopup = new mapboxgl.Popup({ maxWidth: '300px' });
    const html = `<a id="building_edit">编辑属性</a><a id="building_delete">删除</a>`
    this.map_2d.addSource('building2d-source', {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: this.buildingFeatures
      }
    });

    // fill
    this.map_2d.addLayer({
      id: 'building_2d',
      type: 'fill',
      source: 'building2d-source',
      layout: { visibility: 'visible' },
      paint: {
        "fill-color": 'blue',
        "fill-opacity": 0.1,
        "fill-outline-color": 'rgb(65,163,197)',

      }
    });
    // line
    this.map_2d.addLayer({
      id: 'building_2d_line',
      type: "line",
      source: 'building2d-source',
      layout: { visibility: 'visible' },
      paint: {
        "line-color": 'rgb(65,163,197)',
        "line-width": 2
      }
    });

    this.map_2d.on('click', "building_2d", e => {
      const feature = e.features[0];
      this.selectedFeature = feature;
      this.infoPopup.setLngLat(e.lngLat).setDOMContent((this.buildingEdit as any).nativeElement).addTo(this.map_2d);
    });
  }

  /**
   * 编辑楼宇属性信息和几何
   */
  edit() {
    this.modal
      .createStatic(BuildingModelEditComponent, {
        record:
          { ...this.selectedFeature.properties, shape: this.selectedFeature.geometry },
        type: EBuildingOperation.UPDATE
      }, {
        modalOptions: {
          nzStyle: {
            left: '26%',
            position: 'fixed'
          }
        }
      })
      .subscribe((res) => {
        if (res.type === EBuildingOperation.UPDATE && res.feature) {
          this.selectedFeature = res.feature;
          const { building_id } = res.feature.properties;
          // 从图层中移除该楼宇
          for (let i = 0; i < this.buildingFeatures.length; i++) {
            const f = this.buildingFeatures[i];
            if (f.properties.building_id === building_id) {
              this.buildingFeatures.splice(i, 1);
              this.updateBuildingSource();

              setTimeout(() => {
                this.buildingFeatures.unshift(res.feature);
                this.updateBuildingSource();
              });

              break;
            }

          }

        }
      });
  }

  /**
   * 删除楼宇
   */
  delete() {
    const { building_id } = this.selectedFeature.properties
    this.modalSrv.warning({
      nzTitle: '提示',
      nzContent: '确认删除此楼宇吗？',
      nzCancelText: '取消',
      nzOkText: '确认',
      nzOnOk: () => {
        this.http.delete(`building/delete/${building_id}`).subscribe(resp => {
          this.infoPopup.remove();
          // tslint:disable-next-line: prefer-for-of
          // 从图层中移除该楼宇
          for (let i = 0; i < this.buildingFeatures.length; i++) {
            const f = this.buildingFeatures[i];
            if (f.properties.building_id === building_id) {
              this.buildingFeatures.splice(i, 1);
              this.updateBuildingSource();
              break;
            }

          }



        });
      },
      nzOnCancel: () => {

      }
    })
  }


  /**
   * 更新楼宇数据源
   */
  updateBuildingSource() {

    // this.infoPopup.remove();
    (this.map_2d.getSource('building2d-source') as any).setData({
      type: 'FeatureCollection',
      features: this.buildingFeatures
    });
    (this.map_3d.getSource('building3d-source') as any).setData({
      type: 'FeatureCollection',
      features: this.buildingFeatures
    });
  }

}
