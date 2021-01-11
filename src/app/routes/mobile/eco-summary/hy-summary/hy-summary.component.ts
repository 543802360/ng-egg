import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { forkJoin } from 'rxjs';
import { MobileDrawerConditionComponent } from '../../mobile-shared/components/drawer-condition/drawer-condition.component';
import * as F2 from "@antv/f2";
@Component({
  selector: 'app-eco-summary-hy-summary',
  templateUrl: './hy-summary.component.html',
})
export class EcoSummaryHySummaryComponent implements OnInit, AfterViewInit {

  @ViewChild('drawer') drawer: MobileDrawerConditionComponent;
  @ViewChild('chart') chartEl: ElementRef;

  hyUrl = `analysis/tax/hy`;
  cyUrl = `analysis/tax/cy`;

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

      let Global = F2.Global;
      let data = resp.data.splice(0, 10).reverse();
      let chart = new F2.Chart({
        // id: 'mountNode',
        el: this.chartEl.nativeElement,
        pixelRatio: window.devicePixelRatio
      });

      chart.source(data);
      chart.coord({
        transposed: true
      });
      chart.axis('mlmc', {
        line: Global._defaultAxis.line,
        grid: null
      });
      chart.axis('bndsr', {
        line: null,
        grid: Global._defaultAxis.grid,
        label: function label(text, index, total) {
          let textCfg = {};
          if (index === 0) {
            textCfg['textAlign'] = 'left';
          } else if (index === total - 1) {
            textCfg['textAlign'] = 'right';
          }
          return textCfg;
        }
      });
      chart.interval().position('mlmc*bndsr');
      chart.render();
    })
  }




}
