
import { deepCopy } from '@delon/util';
import { Component, OnInit, ViewChild, AfterViewInit, Renderer2, ElementRef } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { STColumn, STComponent, STData, STPage, STReq, STRequestOptions, STRes } from '@delon/abc/st';
import { SFSchema } from '@delon/form';

import { NzMessageService } from 'ng-zorro-antd/message';
import * as mapboxgl from "mapbox-gl";
import { dark } from "@geo";
import { BdgSelectComponent, MonthRangeComponent, getColorRange, ExcelData, export2excel, ColorTypes } from '@shared';
import { G2BarData } from '@delon/chart/bar';
import { forkJoin } from 'rxjs';
import { LoadingService, OnboardingService, ReuseComponentInstance, STChange } from '@delon/abc';
import { ActivatedRoute, Router } from '@angular/router';

interface itemInfo {
  jdxzmc?: string;
  nsrmc?: string;
  bndsr?: number;
  sntq?: number;
  tbzjz?: number;
  tbzjf?: string
}

const jdxzmcs = [
  '城阳街道办事处',
  '棘洪滩街道办事处',
  '流亭街道办事处',
  '夏庄街道办事处',
  '惜福镇街道办事处',
  '上马街道办事处',
  '红岛街道办事处',
  '河套街道办事处',
  '青岛高新技术产业开发区'
]




@Component({
  selector: 'app-mobile-map-jdxz-map',
  templateUrl: './jdxz-map.component.html',
  styleUrls: ['./jdxz-map.component.less']
})
export class MobileMapJdxzMapComponent implements OnInit, AfterViewInit, ReuseComponentInstance {


  townTaxUrl = `analysis/mobile/town`;
  // 是否打开drawer
  state = {
    open: true
  };
  // 时间及预算级次选择
  startTime: Date;
  endTime: Date;
  budgetValue = [];

  height: number = document.documentElement.clientHeight - 45;
  style = dark;
  // 有镇街所属的数据
  townData: itemInfo[];
  // 其他镇街数据
  noTownTaxData: itemInfo[];
  map: mapboxgl.Map;

  tooltipStyle = { 'max-width': '400px' };

  colorStops =
    [
      "rgb(1, 152, 189)",
      "rgb(73, 227, 206)",
      "rgb(216, 254, 181)",
      "rgb(254, 237, 177)",
      "rgb(254, 173, 84)",
      "rgb(209, 55, 78)"
    ];
  heightStop = 4000;
  gridActive = {
    type: "FeatureCollection",
    features: []
  };
  empty = {
    type: "FeatureCollection",
    features: []
  };
  colorActive = "gold";


  constructor(
    public http: _HttpClient,
    private loadSrv: LoadingService,
    private msgSrv: NzMessageService) {


    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();

    this.startTime = new Date(year, 0);
    this.endTime = new Date(year, month);
  }


  _onReuseDestroy: () => void;
  destroy: () => void;

  ngOnInit() { }
  _onReuseInit() {
    if (this.map) {
      setTimeout(() => {
        this.map.resize();
      });
    }
  }

  ngAfterViewInit() {
    this.loadSrv.open({ text: '正在处理……' });

  }
  currentDateFormat(date, format: string = 'yyyy-mm-dd HH:MM'): any {
    const pad = (n: number): string => (n < 10 ? `0${n}` : n.toString());
    return format
      .replace('yyyy', date.getFullYear())
      .replace('mm', pad(date.getMonth() + 1))
      .replace('dd', pad(date.getDate()))
      .replace('HH', pad(date.getHours()))
      .replace('MM', pad(date.getMinutes()))
      .replace('ss', pad(date.getSeconds()));
  }

  onOk() {
    this.state.open = false;
    this.getData();
  }
  /**
   * 获取区域聚合数据
   */
  getData() {
    this.loadSrv.open({
      text: '正在处理……'
    })
    const $townJson = this.http.get('assets/data/CY_TOWN.json');
    const $townTaxData = this.http.get(this.townTaxUrl, this.getCondition());
    forkJoin([$townJson, $townTaxData])
      .subscribe(resp => {
        this.loadSrv.close();
        this.state.open = false;
        // 1、获取镇街税收数据,处理成包含8个街道的
        const townTaxData: itemInfo[] = resp[1].data;

        this.townData = townTaxData.filter(i => jdxzmcs.includes(i.jdxzmc));
        this.noTownTaxData = townTaxData.filter(i => !jdxzmcs.includes(i.jdxzmc));
        let noTownBndsr = 0;
        let noTownSntq = 0;
        this.noTownTaxData.forEach(i => {
          noTownBndsr += i.bndsr;
          noTownSntq += i.sntq;
        });
        const tbzjz = Math.floor((noTownBndsr - noTownSntq) * 100) / 100;
        const tbzjf = `${Math.floor(tbzjz / noTownSntq * 10000) / 100}%`;

        this.townData.push({
          jdxzmc: '其他',
          bndsr: noTownBndsr,
          sntq: noTownSntq,
          tbzjz,
          tbzjf
        });

        // 2、获取Geometry
        const fc = resp[0];
        const taxArray = [];
        fc.features.forEach(f => {
          const target = this.townData.find(i => i.jdxzmc === f.properties.MC);
          if (target) {
            taxArray.push(target.bndsr);

            Object.defineProperties(f.properties, {
              'tax': {
                value: target.bndsr,
                enumerable: true,
                configurable: true
              },
              'item': {
                value: target,
                enumerable: true,
                configurable: true
              }
            });
          }
        });
        const mintax = Math.min(...taxArray);
        const maxtax = Math.max(...taxArray);
        const colorRange = getColorRange(mintax, maxtax, ColorTypes.success);
        if (this.map.getSource('town-geo')) {
          (this.map.getSource('town-geo') as mapboxgl.GeoJSONSource).setData(fc);
        } else {
          this.map.addSource('town-geo', {
            type: 'geojson',
            data: fc as any
          });
        }
        // 判断是否存在高亮区域块数据源及图层
        if (this.map.getLayer('grid-active')) {
          this.map.removeLayer('grid-active');
        }
        if (this.map.getSource('grid-active')) {
          this.map.removeSource('grid-active')
        }
        // 添加高亮数据源及图层
        this.map.addSource("grid-active", {
          type: "geojson",
          data: this.gridActive as any
        });
        this.map.addLayer({
          id: "grid-active",
          type: "fill-extrusion",
          source: "grid-active",
          paint: {
            "fill-extrusion-color": this.colorActive,
            "fill-extrusion-opacity": 0.9,
            "fill-extrusion-height-transition": {
              duration: 1500
            },
            "fill-extrusion-color-transition": {
              duration: 1500
            }
          }
        });
        if (!this.map.getLayer('town-layer')) {
          this.map.addLayer({
            id: 'town-layer',
            source: 'town-geo',
            type: 'fill-extrusion',
            paint: {
              "fill-extrusion-color": {
                property: "tax",
                stops: colorRange
              },
              "fill-extrusion-height": {
                property: "tax",
                stops: [[0, 0], [maxtax, this.heightStop]]
              }, "fill-extrusion-opacity": 0.7,
              "fill-extrusion-height-transition": {
                duration: 1500
              }
            }
          });
        }
        // mousemove
        const popup = new mapboxgl.Popup({
          closeButton: false,
          closeOnClick: false,
          anchor: "top"
        });
        this.map.on("mousemove", e => {
          let html = "";
          const coords = [e.lngLat.lng, e.lngLat.lat];
          // console.log(e);
          const queryPoint = this.map.queryRenderedFeatures(e.point, {
            layers: ["town-layer"]
          });
          if (queryPoint.length) {
            this.map.setPaintProperty("grid-active", "fill-extrusion-height", {
              property: "tax",
              stops: [[0, 0], [maxtax, this.heightStop]]
            });
            this.gridActive.features = [queryPoint[0]];
            (this.map.getSource("grid-active") as any).setData(this.gridActive);
            this.map.getCanvas().style.cursor = "pointer";
            if (queryPoint[0].properties.item) {
              const p = JSON.parse(queryPoint[0].properties.item);
              html = `<h5>镇街：${p.jdxzmc}</h5>
              <h5>本年度税收：${p.bndsr}&nbsp;万元</h5>
              <h5>上年同期：${p.sntq}&nbsp;万元</h5>
              <h5>同比增减幅：${p.tbzjf}</h5>`;

              popup
                .setLngLat(coords as any)
                .setHTML(html)
                .addTo(this.map);

            }
          } else {
            // selectNsr = "";
            (this.map.getSource("grid-active") as any).setData(this.empty);
            this.map.getCanvas().style.cursor = "";
            popup.remove();
          }
        });

      });
  }

  /**
   * 获取查询条件
   */
  getCondition() {


    const year = this.startTime.getFullYear();
    const startMonth = this.startTime.getMonth() + 1;
    const endMonth = this.endTime.getMonth() + 1;
    const budgetValue = '4';
    return { year, startMonth, endMonth, budgetValue };

  }

  /**
   * mapbox load
   * @param e 
   */
  mapboxLoad(e) {
    this.loadSrv.close();
    this.map = e;
    setTimeout(() => {
      this.getData();
      this.fly2target();
    });

    (window as any).map = e;

  }

  /**
   * 飞行至指定点
   * @param center 
   * @param pitch 
   * @param zoom 
   * @param bearing 
   */
  fly2target(center?, pitch?, zoom?, bearing?) {
    this.map.flyTo({
      center: center ? center : [120.3544046484028, 36.23808290181792],
      zoom: zoom ? zoom : 8.688,
      bearing: bearing ? bearing : -0,
      pitch: pitch ? pitch : 46.5,
      speed: 0.8
    });
  }



}
