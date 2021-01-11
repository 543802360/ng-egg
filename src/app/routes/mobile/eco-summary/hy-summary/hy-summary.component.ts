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
  total: number = 0;

  constructor(private http: _HttpClient) { }

  ngOnInit() { }

  ngAfterViewInit() {
    setTimeout(() => {
      this.drawer.onOk();
    });
  }

  getCondition(e) {
    // console.log('condition:', e);
    this.http.get(this.hyUrl, e).subscribe(resp => {
      console.log('行业税收：', resp);
      let itemData = resp.data.map(item => Object.assign({ const: 100 }, item))
      this.listData = [...itemData];

      for (const key of this.listData) {
        this.total += key['bndsr']
      }
      // this.total = this.listData.reduce((x, y) => {
      //   return x.bndsr + y.bndsr;
      // })
      console.log('total:', this.total);
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
      chart.interval().position('mlmc*bndsr').size(10);

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
            fontWeight: 'bold',
            fontSize: 14
          },
          offsetY: -8
        });
        chart.guide().text({
          position: [obj.mlmc, 'max'],
          content: '¥' + numberToMoney(obj.bndsr),
          style: {
            textAlign: 'end',
            textBaseline: 'bottom',
            fontSize: 14
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
