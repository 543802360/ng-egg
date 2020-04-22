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
import { geojson2wkt } from "@shared"
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

  // draw
  drawCtrl;
  buildingFeatures = [];
  //#endregion


  constructor(
    private http: _HttpClient,
    private modal: ModalHelper,
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
    // this.map2dObservable.subscribe(resp => {
    //   console.log('map 2d received', resp);
    // });
    // this.map3dObservable.subscribe(resp => {
    //   console.log('map 3d received', resp);
    // });
    const mapObservable = forkJoin([this.map_2d_subject, this.map_3d_subject]);
    mapObservable.subscribe(
      resp => {
        this.loadingSrv.close();
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
      console.log('map 2d init');
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
          trash: true
        }
      });
      this.map_2d.addControl(this.drawCtrl, 'top-left');

      // 初始化时加载可编辑的楼宇2维底图
      this.http.get('building/listAllBuildingGeo').subscribe(resp => {
        console.log('获取所有楼宇geometry：', resp);
        if (resp.success) {
          // this.drawCtrl.add(resp.data);
          this.buildingFeatures = resp.data.features;
          this.initBuilding2D();

        } else {
          this.msgSrv.error(resp.msg);
        }
      });

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
            }
          }, {
            modalOptions: {
              nzStyle: {
                left: '26%',
                position: 'fixed'
              }
            }
          })
          .subscribe((res) => {
            if (res && res.feature) {
              console.log('create feature:', res);
              this.drawCtrl.delete(res.feature.id);
              this.buildingFeatures.push(res.feature);

              (this.map_2d.getSource('building2d-source') as any).setData({
                type: 'FeatureCollection',
                features: this.buildingFeatures
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
      this.initBuilding3D();
      setTimeout(() => {
        syncMove(this.map_2d, this.map_3d);
      }, 1200);
    }

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
    this.map_2d.addSource('building2d-source', {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: this.buildingFeatures
      }
    });

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
      this.modal
        .createStatic(BuildingModelEditComponent, {
          record:
            { ...feature.properties, shape: feature.geometry }

        }, {
          modalOptions: {
            nzStyle: {
              left: '26%',
              position: 'fixed'
            }
          }
        })
        .subscribe((res) => {
          if (res && res.feature) {
            console.log('create feature:', res);
            this.drawCtrl.delete(res.feature.id);
            this.buildingFeatures.push(res.feature);

            (this.map_2d.getSource('building2d-source') as any).setData({
              type: 'FeatureCollection',
              features: this.buildingFeatures
            });
          }
        });

    });
  }


}
