import { G2BarData } from '@delon/chart/bar';
import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { STColumn, STComponent } from '@delon/abc/st';
import { SFSchema } from '@delon/form';
import { BdgSelectComponent } from 'src/app/shared/components/bdg-select/bdg-select.component';
import { MonthRangeComponent } from 'src/app/shared/components/month-range/month-range.component';
import { forkJoin, Observable, Subject } from 'rxjs';
import { NzMessageService } from 'ng-zorro-antd/message';
import { EOrder, export2excel, order, ZSXM } from '@shared';
import { delay } from 'rxjs/operators';
import { LoadingService } from '@delon/abc';
import { deepCopy } from '@delon/util';
import { ActivatedRoute } from '@angular/router';
import { NsrmcSuggestionComponent } from 'src/app/shared/components/nsrmc-suggestion/nsrmc-suggestion.component';
import { CacheService } from '@delon/cache';

@Component({
  selector: 'app-budget-bdg-analysis-single-query',
  templateUrl: './single-query.component.html',
  styleUrls: ['./single-query.component.less']
})
export class BudgetBdgAnalysisSingleQueryComponent implements OnInit, AfterViewInit {
  zsxmUrl = `bdg/enterprise/tax/zsxm`;
  taxByZsxmData;
  zsxmBarData;

  total: number;
  historyUrl = `bdg/enterprise/tax/history`;
  taxByYearData: G2BarData[];

  djnsrxxUrl = 'nsr/info/show';

  @ViewChild('nsrSug') nsrSug: NsrmcSuggestionComponent;
  @ViewChild('bdgSelect') bdgSelect: BdgSelectComponent;
  @ViewChild('monthRange') monthRange: MonthRangeComponent;

  @ViewChild('st') st: STComponent;
  columns: STColumn[];

  mapSubject = new Subject();
  map;
  layerGroup = new L.layerGroup();
  constructor(public http: _HttpClient,
    private cacheSrv: CacheService,
    private loadSrv: LoadingService,
    private msgSrv: NzMessageService,
    private route: ActivatedRoute) { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.route.queryParams.subscribe(params => {
      const { nsrmc } = params;
      setTimeout(() => {

        if (nsrmc) {
          this.cacheSrv.set('currentNsrmc', nsrmc);
          this.nsrSug.nsrmc = nsrmc;
        } else {

          this.cacheSrv.get('currentNsrmc', { mode: 'none' }) ? this.nsrSug.nsrmc = this.cacheSrv.get('currentNsrmc', { mode: 'none' }) : '';

        }

        if (this.nsrSug.nsrmc && this.bdgSelect.budgetValue) {
          this.search();
        }
      });
    });
  }
  /**
   * 
   */
  getCondition() {
    const { startDate, endDate } = this.monthRange;
    const year = startDate.getFullYear();
    const startMonth = startDate.getMonth() + 1;
    const endMonth = endDate.getMonth() + 1;
    const budgetValue = this.bdgSelect.budgetValue.toLocaleString();

    // const adminCode = this.cacheSrv.get('userInfo', { mode: 'none' }).department_id;

    return { nsrmc: this.nsrSug.nsrmc.trim(), year, startMonth, endMonth, budgetValue };
  }


  /**
   * 查询
   * @param e 
   */
  search() {

    if (!this.nsrSug.nsrmc) {
      this.msgSrv.warning('请输入纳税人名称!');
      return;
    }
    if (!this.bdgSelect.budgetValue.length) {
      this.msgSrv.warning('请选择预算级次');
      return;
    }
    this.cacheSrv.set('currentNsrmc', this.nsrSug.nsrmc);
    this.loadSrv.open({ text: '正在查询……' });

    const $stream1 = this.http.get(this.zsxmUrl, this.getCondition());
    const $stream2 = this.http.get(this.historyUrl, {
      nsrmc: this.nsrSug.nsrmc.trim(),
      ...this.getCondition()
    });

    const $stream3 = this.http.get(this.djnsrxxUrl, {
      nsrmc: this.nsrSug.nsrmc.trim()
    });

    forkJoin([$stream1, $stream2, $stream3]).pipe(delay(50)).subscribe(resp => {
      this.loadSrv.close();
      // 分税种明细
      const zsxmMap = new Map(Object.entries(resp[0].data).filter(item => item[1] !== 0));
      const zsxmData = (Object as any).fromEntries(zsxmMap);

      // 设置征收项目表头
      this.columns = Object.keys(zsxmData).map(item => {
        return {
          title: item,
          index: item,
          className: 'text-center',
          type: 'number'
        }
      });
      // 计算合计数
      this.total = Object.values(zsxmData).reduce((prev: number, cur: number) => {
        return prev + cur;
      }) as number;
      this.taxByZsxmData = [zsxmData];
      // 设置G2 Bar、Pie 数据
      const data = Object.entries(zsxmData).map(item => {
        return {
          x: item[0],
          y: item[1]
        }
      }).filter(item => item.y !== 0).sort(order('y'));
      this.zsxmBarData = deepCopy(data);
      // 获取历年税收
      this.taxByYearData = resp[1].data.map(item => {
        return {
          x: item.YEAR,
          y: item.VALUE
        }
      });
      // 获取登记信息并添加至地图
      const djnsrxxRes = resp[2].data;

      if (this.map) {
        const { NSRMC, NSRSBH, ZCDZ, DJZCLXMC, HYMC, LAT, LNG } = djnsrxxRes;
        const marker = L.marker([LAT, LNG]).bindPopup(`
          <h5>纳税人名称：${NSRMC}</h5>
          <h5>纳税人识别号：${NSRSBH}</h5>
          <h5>注册地址：${ZCDZ}</h5>
          <h5>登记注册类型：${DJZCLXMC}</h5>
          <h5>所属行业：${HYMC}</h5>
        `);
        this.layerGroup.clearLayers();

        setTimeout(() => {
          this.layerGroup.addLayer(marker);
          (this.map as any).flyTo([LAT, LNG], 7)
        });
      }
      (this.mapSubject.asObservable()).subscribe(map => {

        const { NSRMC, NSRSBH, ZCDZ, DJZCLXMC, HYMC, LAT, LNG } = djnsrxxRes;
        const marker = L.marker([LAT, LNG]).bindPopup(`
          <h5>纳税人名称：${NSRMC}</h5>
          <h5>纳税人识别号：${NSRSBH}</h5>
          <h5>注册地址：${ZCDZ}</h5>
          <h5>登记注册类型：${DJZCLXMC}</h5>
          <h5>所属行业：${HYMC}</h5>
        `);
        this.layerGroup.clearLayers();

        setTimeout(() => {
          this.layerGroup.addLayer(marker);
          (map as any).flyTo([LAT, LNG], 7)
        }, 1000);

      });

    });
  }
  mapload(e) {
    const { map, layerControl } = e;
    this.map = map;
    this.map.addLayer(this.layerGroup);

    console.log('leaflet map loaded!!');
    this.mapSubject.next(map);
  }
  /**
   * 查询结果导出
   * @param e 
   */

  export() {

    if (!this.nsrSug.nsrmc) {
      this.msgSrv.warning('请选择纳税人');
      return;
    }
    if (!this.bdgSelect.budgetValue.length) {
      this.msgSrv.warning('请选择预算级次');
      return;
    }
    this.loadSrv.open({
      text: '正在处理……'
    });
    // 批量查询税收
    const nsrmcs = [this.nsrSug.nsrmc.trim()];
    this.http.post('bdg/tools/batchQuery', {
      nsrmcs,
      ...this.getCondition()
    }).subscribe(resp => {
      // 查询结果按指定字典排序映射
      const rowData = resp.data.map(item => {
        const el = {};
        Object.keys(EOrder).forEach(key => {
          el[EOrder[key]] = item[key];
        });
        Object.keys(ZSXM).forEach(key => {
          el[ZSXM[key]] = item[key] ? item[key] : 0;
        });
        return el;
      });
      this.loadSrv.close();
      export2excel(`${this.nsrSug.nsrmc}-${new Date().toLocaleString()}.xlsx`, [{
        sheetName: `${this.nsrSug.nsrmc}`,
        rowData
      }]);

    });
  }

}
