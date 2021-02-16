import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { forkJoin } from 'rxjs';
import { MobileDrawerConditionComponent } from '../../mobile-shared/components/drawer-condition/drawer-condition.component';
import * as F2 from "@antv/f2";
import { numberToMoney } from '@shared';
const Global = F2.Global;

@Component({
  selector: 'app-eco-summary-hy-summary',
  templateUrl: './hy-summary.component.html',
})
export class EcoSummaryHySummaryComponent implements OnInit, AfterViewInit {

  @ViewChild('drawer') drawer: MobileDrawerConditionComponent;
  @ViewChild('chart') chartEl: ElementRef;

  hyUrl = `analysis/tax/hy`;
  cyUrl = `analysis/tax/cy`;
  listData: any[];
  bndsr: number = 0;
  sntq: number = 0;
  tbzjf;

  constructor(private http: _HttpClient) { }

  ngOnInit() { }

  ngAfterViewInit() {
    setTimeout(() => {
      this.drawer.onOk();
    });
  }

  getCondition(e) {
    this.bndsr = 0;
    this.sntq = 0;
    this.http.get(this.hyUrl, e).subscribe(resp => {
      console.log('行业税收：', resp);
      let itemData = resp.data.map(item => Object.assign({ const: 100 }, item))
      this.listData = [...itemData];

      for (const key of this.listData) {
        this.bndsr += key['bndsr'];
        this.sntq += key['sntq']
      }
      this.tbzjf = Math.round((this.bndsr / this.sntq - 1) * 10000) / 100;

      // 初始化图表
      let chart = new F2.Chart({
        id: this.chartEl.nativeElement,
        pixelRatio: window.devicePixelRatio
      });
      chart.source([...itemData].reverse());
      // 设置坐标系
      chart.coord({
        transposed: true
      });
      chart.axis(false);
      chart.legend(false);
      chart.tooltip(false);

      chart.interval().position('mlmc*const').color('#d9e4eb').size(10).animate(true);
      chart.interval().position('mlmc*bndsr').size(8);

      // chart.interval().position('const*tax').adjust('stack').color('zsxm_dm', ['#1890FF', '#13C2C2', '#2FC25B', '#FACC14', '#F04864', '#8543E0', '#3436C7', '#223273']);
      // 线注记

      // 绘制文本
      itemData.map((obj) => {
        chart.guide().text({
          position: [obj.mlmc, 'min'],
          content: obj.mlmc,
          style: {
            textAlign: 'start',
            textBaseline: 'bottom',
            fontWeight: 'normal',
            fontSize: 12
          },
          offsetY: -8
        });
        chart.guide().text({
          position: [obj.mlmc, 'max'],
          content: '¥' + numberToMoney(obj.bndsr),
          style: {
            textAlign: 'end',
            textBaseline: 'bottom',
            fontSize: 12
          },
          offsetY: -8
        });
      });
      chart.guide().text({
        position: ['max', 'min'],
        content: '单位（万元）',
        style: {
          textBaseline: 'middle',
          textAlign: 'start',
          fontWeight: 'bold',
          fontSize: 14
        },
        offsetY: -23
      });
      chart.render();
    })
  }




}
