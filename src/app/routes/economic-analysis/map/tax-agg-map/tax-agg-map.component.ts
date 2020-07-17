import { Component, OnInit, ViewChild } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { STColumn, STComponent } from '@delon/abc/table';
import { SFSchema } from '@delon/form';

import { NzMessageService } from 'ng-zorro-antd';
import * as mapboxgl from "mapbox-gl";
import { dark } from "@geo";

@Component({
  selector: 'app-economic-analysis-map-tax-agg-map',
  templateUrl: './tax-agg-map.component.html',
  styleUrls: ['./tax-agg-map.component.less']

})
export class EconomicAnalysisMapTaxAggMapComponent implements OnInit {

  url = `/user`;
  style = dark;
  map: mapboxgl.Map;
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

  constructor(private http: _HttpClient, private modal: ModalHelper, private msgSrv: NzMessageService) { }

  ngOnInit() { }

  add() {
    // this.modal
    //   .createStatic(FormEditComponent, { i: { id: 0 } })
    //   .subscribe(() => this.st.reload());
  }

  mapboxLoad(e) {
    this.map = e;
  }

}
