import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { STColumn, STComponent } from '@delon/abc/st';
import { SFSchema } from '@delon/form';

import { NzMessageService } from 'ng-zorro-antd';
import * as mapboxgl from "mapbox-gl";
import { dark } from "@geo";
import { BdgSelectComponent, MonthRangeComponent } from '@shared';
import { G2BarData } from '@delon/chart/bar';
import { forkJoin } from 'rxjs';
import { LoadingService } from '@delon/abc';

@Component({
  selector: 'app-economic-analysis-map-tax-agg-map',
  templateUrl: './tax-agg-map.component.html',
  styleUrls: ['./tax-agg-map.component.less']

})
export class EconomicAnalysisMapTaxAggMapComponent implements OnInit, AfterViewInit {

  url = `analysis/town`;
  style = dark;
  townData: any[];
  townG2BarData: G2BarData[];
  map: mapboxgl.Map;
  @ViewChild('st') st: STComponent;
  @ViewChild('bdgSelect') bdgSelect: BdgSelectComponent;
  @ViewChild('monthRange') monthRange: MonthRangeComponent;
  tooltipStyle = { 'max-width': '400px' };
  columns: STColumn[] = [
    {
      title: '排名',
      type: 'no',
      width: 60,
      className: 'text-center'
    },
    {
      title: '镇街',
      index: 'jdxzmc',
      className: 'text-center'
    },
    {
      title: '本年度收入',
      index: 'bndsr',
      className: 'text-center'
    },
    {
      title: '上年同期',
      index: 'sntq',
      className: 'text-center'
    },
    {
      title: '同比增减',
      className: 'text-center',
      render: 'tbzjz-tpl'
    }
    // {
    //   title: '',
    //   buttons: [
    //   ]
    // }
  ];

  constructor(public http: _HttpClient,
    private loadSrv: LoadingService,
    private modal: ModalHelper,
    private msgSrv: NzMessageService) { }

  ngOnInit() { }

  ngAfterViewInit() {
    this.loadSrv.open({ text: '正在处理……' });
  }

  getData() {
    const $townJson = this.http.get('assets/data/CY_TOWN.json');
    const $townTaxData = this.http.get(this.url, this.getCondition());
    forkJoin([$townJson, $townTaxData])
      .subscribe(resp => {
        // 1、获取镇街税收数据
        this.townData = resp[1].data;
        this.townG2BarData = this.townData.map(item => {
          return {
            x: item.jdxzmc,
            y: item.bndsr
          }
        });
        // 2、获取Geometry
        const fc = resp[0];

        fc.features.forEach(f => {
          const target = this.townData.find(i => i.jdxzmc === f.properties.MC);
          if (target) {
            Object.defineProperty(f.properties, 'tax', {
              value: target,
              enumerable: true,
              configurable: true
            })
          }
        });


      });
  }

  /**
   * 
   */
  getCondition() {
    this.bdgSelect.budgetValue.length === 0 ? this.bdgSelect.budgetValue = [4] : null;
    const { startDate, endDate } = this.monthRange;
    const year = startDate.getFullYear();
    const startMonth = startDate.getMonth() + 1;
    const endMonth = endDate.getMonth() + 1;
    const budgetValue = this.bdgSelect.budgetValue.toLocaleString();
    return { year, startMonth, endMonth, budgetValue };

  }

  mapboxLoad(e) {
    this.loadSrv.close();
    this.map = e;
    setTimeout(() => {
      this.getData();
    });
  }

}
