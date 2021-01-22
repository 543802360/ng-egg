import { LoadingTypesService } from '@core';
import { CompanyListEditComponent } from './../list/edit/edit.component';
import { CompanyListViewComponent } from './../list/view/view.component';
import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { STColumn, STComponent, STPage, STReq, STRequestOptions, STRes, STData, STChange } from '@delon/abc/st';
import { NzMessageService } from 'ng-zorro-antd';
import { LoadingService } from '@delon/abc';
import { ActivatedRoute } from '@angular/router';
import { CacheService } from '@delon/cache';

// import * as L from "leaflet";

interface IDjnsrxx {
  UUID?: string; // UUID,存在同一企业几个街道共享
  DJXH?: string; // 登记序号
  NSRMC?: string;
  NSRSBH?: string;
  SHXYDM?: string;
  NSRZTMC?: string;
  SCJYDZ?: string;
  ZCDZ?: string;
  SWJGJC?: string;
  SWSKFJJC?: string;
  HYMC?: string;
  DJZCLXMC?: string;
  JDXZDM?: string;
  JDXZMC?: string;
  FDDBRXM?: string;
  DJRQ?: Date;
  LRRQ?: Date;
  XGRQ?: Date;
  SSFC?: number;// 税收分成
  YXBZ?: string; // 有效标志
  QBLCBZ?: string; // 全部留存标志
  BZ?: string; // 备注
  LAT?: string;
  LNG?: string;
}
@Component({
  selector: 'app-company-position',
  templateUrl: './position.component.html',
  styleUrls: ['./position.component.less']
})
export class CompanyPositionComponent implements OnInit, AfterViewInit {

  //#region 地图相关参数
  center;
  // 纳税人位置marker
  nsrMarker;
  // 纳税人默认坐标
  nsrDefPosition;
  // 当前所选纳税人
  selected;
  // 纳税人位置可编辑图层
  editableLayer = L.featureGroup();
  // leafletMap: L.Map;
  leafletMap;


  //#endregion
  i: IDjnsrxx;

  constructor(
    private cacheSrv: CacheService,
    public http: _HttpClient,
    private loadingSrv: LoadingService,
    private loadingTypeSrv: LoadingTypesService,
    private msgSrv: NzMessageService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.loadingSrv.open({
      type: 'custom',
      custom: this.loadingTypeSrv.loadingTypes.Cubes
    });
  }

  ngAfterViewInit() {
    this.route.queryParams.subscribe(params => {
      const nsrInfo: IDjnsrxx = JSON.parse(params.nsrInfo);
      setTimeout(() => {
        this.i = nsrInfo;
        const center = {
          lat: nsrInfo.LAT,
          lng: nsrInfo.LNG
        };
        this.nsrDefPosition = center;
        this.leafletMap.flyTo([center.lat, center.lng], 16);

        const popupContent = `
        <h5>纳税人名称：${nsrInfo.NSRMC}</h5>
        <h5>纳税人识别号：${nsrInfo.NSRSBH}</h5>
        <h5>登记注册类型：${nsrInfo.DJZCLXMC}</h5>
        <h5>主管税务局：${nsrInfo.SWJGJC}</h5>
        <h5>主管税务所科分局：${nsrInfo.SWSKFJJC}</h5>
        <h5>法定代表人：${nsrInfo.FDDBRXM}</h5>
        <h5>登记日期：${nsrInfo.DJRQ}</h5>
        <h5>生产经营地址：${nsrInfo.SCJYDZ}</h5>
        `;

        if (this.nsrMarker) {
          // L.marker([center.lat,center.lng]).
          this.nsrMarker.setLatLng([center.lat, center.lng]).bindPopup(popupContent, { maxWidth: 600 });

        } else {

          this.nsrMarker = L.marker([center.lat, center.lng]).addTo(this.leafletMap).bindPopup(popupContent, { maxWidth: 600 });
          this.editableLayer.addLayer(this.nsrMarker);
        }
      }, 500);
    });
  }

  /**
   *
   * @param e
   */
  mapboxglLoad(e) {

    const { map } = e
    this.leafletMap = map;
    this.loadingSrv.close();
    //#region 添加draw 控件

    //#endregion
    this.leafletMap.addLayer(this.editableLayer);
    const defaultDrawOptions = {
      position: 'topleft',
      draw: {
        polyline: false,
        polygon: false,
        rectangle: false,
        circle: false,
        circlemarker: false
      },
      edit: {
        featureGroup: this.editableLayer,
        remove: false
      }
    };
    const drawCtrl = new L.Control.Draw(defaultDrawOptions);
    this.leafletMap.addControl(drawCtrl);

    this.leafletMap.on(L.Draw.Event.CREATED, e => {
      const type = e.layerType;
      const layer = e.layer;

      if (type === 'marker') {
      }

      this.editableLayer.addLayer(layer);
    });

    this.leafletMap.on('draw:edited', e => {
      const layers = e.layers;
      layers.eachLayer(layer => {
        // console.log(layer);
        const latlng = layer.getLatLng();
        const property = {
          ...layer.property,
          LAT: latlng.lat,
          LNG: latlng.lng
        }
        // 更新
        // this.http.put(`hx/nsr/${property.UUID}`, property).subscribe(res => {
        //   this.msgSrv.success(res.msg);
        // });

      });
    });


  }

  /** 确认位置
   */
  confirmPos() {
    const { lat, lng } = this.nsrMarker.getLngLat();
    // 更新
    this.http.put(`hx/nsr/${this.selected.UUID}`, { ...this.selected, LNG: lng, LAT: lat }).subscribe(res => {
      if (res.success) {
        this.msgSrv.success(res.msg);
      } else {
        this.msgSrv.error(res.msg);
      }
    });
  }

  /** 重置位置
   */
  resetPos() {
    this.nsrMarker.setLngLat(this.nsrDefPosition);
    // this.mapboxMap.flyTo({ center: this.nsrDefPosition, zoom: 16 });
  }

  onStChange(e: STChange) {
    if (e.loaded) {
      this.editableLayer.clearLayers();
      e.loaded.forEach(item => {
        const { NSRMC, ZCDZ, NSRSBH, DJZCLXMC, HYMC, LXR, LXDH, JDXZMC, LAT, LNG } = item;

        const popupContent = `
        <h5>纳税人名称：${NSRMC}</h5>
        <h5>纳税人识别号：${NSRSBH}</h5>
        <h5>登记注册类型：${DJZCLXMC}</h5>
        <h5>所属行业：${HYMC}</h5>
        <h5>所属街道：${JDXZMC}</h5>
        <h5>联系人：${LXR}</h5>
        <h5>联系电话：${LXDH}</h5>
        <h5>注册地址：${ZCDZ}</h5>
        `;
        // const marker = L.marker([LAT, LNG]).bindPopup(popupContent).addTo(this.editableLayer);

        const marker = L.marker([LAT, LNG], {
          icon: L.BeautifyIcon.icon({
            icon: 'building',
            // iconSize: [28, 28],
            // isAlphaNumericIcon: true,
            iconShape: 'marker',
            borderColor: '#00ABCD',
            textColor: 'red'
          })
        }).bindPopup(popupContent).addTo(this.editableLayer);

        Object.defineProperty(marker, 'property', {
          value: item,
          enumerable: true
        });
      })
    }
  }

}
