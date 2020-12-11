import { Component, OnInit, AfterViewInit } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { F2PieData } from 'ng-antv-f2';

@Component({
  selector: 'app-eco-summary-zsxm-summary',
  templateUrl: './zsxm-summary.component.html',
})
export class EcoSummaryZsxmSummaryComponent implements OnInit, AfterViewInit {

  pieData: F2PieData[];
  constructor(private http: _HttpClient) { }

  ngOnInit() {
    setTimeout(() => {
      this.init();
    });

  }

  ngAfterViewInit() {
    // setTimeout(() => {
    //   this.init();
    // });
  }

  init() {
    const data = [{
      amount: 20,
      ratio: 0.1,
      memo: '学习',
      const: 'const'
    }, {
      amount: 100,
      ratio: 0.5,
      memo: '睡觉',
      const: 'const'
    }, {
      amount: 10,
      ratio: 0.05,
      memo: '吃饭',
      const: 'const'
    }, {
      amount: 30,
      ratio: 0.15,
      memo: '讲礼貌',
      const: 'const'
    }, {
      amount: 10,
      ratio: 0.05,
      memo: '其他',
      const: 'const'
    }, {
      amount: 20,
      ratio: 0.1,
      memo: '运动',
      const: 'const'
    }, {
      amount: 10,
      ratio: 0.05,
      memo: '暂无备注',
      const: 'const'
    }];
    const _data = data.map(i => {
      return {
        x: i.memo,
        y: i.amount
      }
    });
    this.pieData = [..._data];
    console.log(this.pieData);

  }

}
