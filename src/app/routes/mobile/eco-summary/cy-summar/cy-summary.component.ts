
import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { MobileDrawerConditionComponent } from '../../mobile-shared/components/drawer-condition/drawer-condition.component';
import * as F2 from "@antv/f2/lib/index-all";
import { numberToMoney } from '@shared';
const Global = F2.Global;

@Component({
  selector: 'app-eco-summary-cy-summary',
  templateUrl: './cy-summary.component.html',
  styleUrls: ['./cy-summary.component.less']
})
export class EcoSummaryCySummaryComponent implements OnInit, AfterViewInit {

  @ViewChild('drawer') drawer: MobileDrawerConditionComponent;
  @ViewChild('chart') chartEl: ElementRef;

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
    this.total = 0;
    this.http.get(this.cyUrl, e).subscribe(resp => {

      let itemData = resp.data.map(item => Object.assign({ const: 100 }, item))
      this.listData = [...itemData];

      for (const key of this.listData) {
        this.total += key['bndsr']
      }
      // 初始化图表
      let chart = new F2.Chart({
        id: this.chartEl.nativeElement,
        pixelRatio: window.devicePixelRatio
      });

      chart.source(itemData);
      // 设置坐标系为极坐标系
      chart.coord('polar', {
        transposed: true,
        radius: 0.62,
        innerRadius: 0.6
      });
      chart.axis(false);
      // chart.legend(false);
      chart.tooltip(false);

      // 饼状图
      chart.interval().position('const*bndsr').adjust('stack').color('cymc', '#1890FF-#13C2C2-#2FC25B-#FACC14-#F04864-#8543E0-#3436C7-#223273');
      // 线注记
      chart.pieLabel({
        skipOverlapLabels: true,
        anchorOffset: -10,
        inflectionOffset: 0,
        sidePadding: 15,
        activeShape: true,
        label2: function label1(data, color) {
          return {
            text: '￥' + numberToMoney(data.bndsr) + '万',
            fill: '#343434',
            fontWeight: 'bold',
            fontSize: 12
          };
        },
        label1: function label2(data, color) {
          return {
            text: data.cymc,
            fill: color,
            fontSize: 12
          };
        },
        onClick: function onClick(ev) {
          var data = ev.data;
          if (data) {
            document.getElementById('qkj-title').innerHTML = data.cymc;
            document.getElementById('qkj-tax').innerHTML = data.bndsr;
            // $('#title').text(data.type);
            // $('#money').text(data.money);
          }
        }
      });
      // chart.guide().text({
      //   top: true,
      //   position: ['max', 'min'],
      //   content: '分产业税收（单位：万元）',
      //   style: {
      //     textBaseline: 'top',
      //     textAlign: 'start',
      //     fontWeight: 'bold',
      //     fontSize: 14
      //   },
      //   offsetY: -23,
      //   offsetX: 0
      // });
      chart.render();

    })
  }




}
