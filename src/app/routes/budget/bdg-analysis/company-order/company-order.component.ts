import { Component, OnInit, ViewChild, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { STColumn, STComponent, STRes, STData, STPage, STChange } from '@delon/abc/st';
import { NzMessageService, NzTreeSelectComponent } from 'ng-zorro-antd';
import { CacheService } from '@delon/cache';
import { yuan, IEOrder, export2excel, EOrder, ZSXM } from '@shared';
import { BdgSelectComponent } from 'src/app/shared/components/bdg-select/bdg-select.component';
import { MonthRangeComponent } from 'src/app/shared/components/month-range/month-range.component';
import { Router, ActivatedRoute } from '@angular/router';
import { XlsxService } from '@delon/abc/xlsx';
import { LoadingService } from '@delon/abc';

@Component({
  selector: 'app-budget-bdg-analysis-company-order',
  templateUrl: './company-order.component.html',
  styleUrls: ['./company-order.component.less']
})
export class BudgetBdgAnalysisCompanyOrderComponent implements OnInit, AfterViewInit {

  //#region 地图相关

  map;
  nsrFeatureGroup;

  //#endregion

  @ViewChild('bdgSelect') bdgSelect: BdgSelectComponent;
  @ViewChild('monthRange') monthRange: MonthRangeComponent;

  // 行业名称tree-select
  @ViewChild('hyTreeSelect') hyTreeSelect: NzTreeSelectComponent;
  hymcNodes;
  selectedHymc: string;
  selectedOrder = 100;

  //#endregion
  @ViewChild('st') st: STComponent;
  url = "bdg/enterprise/order";
  data: IEOrder[];

  total = 0;
  // response预处理
  res: STRes = {
    process: (data: STData[], rawData?: any) => {
      this.total = rawData.data.length;
      return rawData.data;
    }
  };
  // 表头设置
  columns: STColumn[] = [
    {
      title: '排名',
      width: 60,
      className: 'text-center',
      fixed: 'left',
      format: (item: STData, col: STColumn, index: number) => {
        // console.log('index', index, item, col);
        // console.log(this.st);
        return `${(this.st.pi - 1) * this.st.ps + index + 1}`;

      }

    },
    {
      index: 'NSRMC',
      title: '纳税人名称',
      className: 'text-center',
      fixed: 'left',
      // width: 400
    },
    {
      index: 'BNDSR',
      title: '本年度',
      className: 'text-center',
      type: 'number',
      width: 120
    },
    {
      index: 'SNTQ',
      title: '上年同期',
      className: 'text-center',
      type: 'number',
      width: 120
    },
    {
      index: 'TBZJZ',
      title: '同比增减',
      className: 'text-center',
      // type: 'number'
      render: 'tbzjz-tpl',
      width: 120
    },
    {
      index: 'TBZJF',
      title: '同比增减幅',
      className: 'text-center',
      render: 'tbzjf-tpl',
      width: 120

    },
    {
      title: '操作',
      className: 'text-center',
      width: 60,
      fixed: 'right',
      buttons: [
        {
          // tooltip: '详情',
          icon: 'eye',
          // 点击查询详细税收
          click: (record: STData, modal: true) => {
            this.router.navigate(['../single-query'], {
              queryParams: { nsrmc: record.NSRMC },
              relativeTo: this.route
            });
          }
        }
      ]
    }
  ]
  // 分页设置
  page: STPage = {
    show: true,
    front: true,
    pageSizes: [10, 20, 30, 50, 100]
  }

  constructor(public http: _HttpClient,
    public msg: NzMessageService,
    private cdr: ChangeDetectorRef,
    private cacheSrv: CacheService,
    private router: Router,
    private route: ActivatedRoute,
    private loadSrv: LoadingService,
  ) {
    this.hymcNodes = this.cacheSrv.get('hymc', { mode: 'none' });
    this.nsrFeatureGroup = L.markerClusterGroup();
  }

  ngOnInit() {

  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.getData();
    });
  }

  /**
   * 设置日期
   * @param type: 时间段类型
   * @param flag
   */
  setDate(type: any) {
    // this.date_range = getTimeDistance(type);
    // this.startDate = this.date_range[0];
    // this.endDate = this.date_range[1];
    setTimeout(() => this.cdr.detectChanges());
  }


  /**
   * 获取税收统计概况（电子税票）
   */
  getData() {
    this.nsrFeatureGroup.clearLayers();
    this.bdgSelect.budgetValue.length === 0 ? this.bdgSelect.budgetValue = [4] : null;
    this.http.get(this.url, this.getCondition()).subscribe(resp => {
      this.data = resp.data;
      this.total = resp.data.length;

      // 添加至地图
      this.data.forEach((item, index) => {
        const marker = L.marker([item.lat, item.lng], {
          icon: L.BeautifyIcon.icon({
            icon: 'leaf',
            // iconSize: [28, 28],
            isAlphaNumericIcon: true,
            text: index + 1,
            iconShape: 'marker',
            borderColor: '#00ABCD',
            textColor: 'red'
          })
        });


        Object.defineProperty(marker, 'NSRMC', {
          enumerable: true,
          value: item.NSRMC
        });

        const popupContent = `
        <h5>纳税人名称：${item.NSRMC}</h5>
        <h5>本年度收入：${item.BNDSR}</h5>
        <h5>上年同期：${item.SNTQ}</h5>
        <h5>同比增减值：${item.TBZJZ}</h5>
        <h5>同比增减幅：${item.TBZJF}</h5>
        `;
        marker.bindPopup(popupContent);
        this.nsrFeatureGroup.addLayer(marker);

      });
      // 
      this.map.fitBounds(this.nsrFeatureGroup.getBounds());
    });


  }
  /**
   * 获取查询条件参数
   */
  getCondition() {
    const { startDate, endDate } = this.monthRange;
    const year = startDate.getFullYear();
    const startMonth = startDate.getMonth() + 1;
    const endMonth = endDate.getMonth() + 1;
    const budgetValue = this.bdgSelect.budgetValue.toLocaleString();
    const mlmc = this.hyTreeSelect.getSelectedNodeList();
    const count = this.selectedOrder;
    const adminCode = '3302130000';

    // const adminCode = this.cacheSrv.get('userInfo', { mode: 'none' }).department_id;

    if (!this.hyTreeSelect.getSelectedNodeList().length) {
      return { adminCode, year, startMonth, endMonth, budgetValue, count };
    }
    if (this.hyTreeSelect.getSelectedNodeList().length !== 0) {
      const selectedNode = this.hyTreeSelect.getSelectedNodeList()[0];
      return selectedNode.parentNode ? { adminCode, year, startMonth, endMonth, budgetValue, count, hymc: selectedNode.title } :
        { adminCode, year, startMonth, endMonth, budgetValue, count, mlmc: selectedNode.title };
    }

  }
  /**
   * G2 PIE 图表tooltip
   * @param value
   */
  change(e: STChange) {
    console.log(e);
    if (e.click && e.click.item) {

      const { NSRMC, lat, lng } = e.click.item;

      this.nsrFeatureGroup.eachLayer(layer => {
        if (layer.NSRMC === NSRMC) {
          this.map.setView([lat, lng], 8);
          setTimeout(() => {
            layer.openPopup();
          });
        }
      })
    }
  }

  /**
   * leaflet map load event
   * @param e 
   */
  mapload(e) {
    const { map, layerControl } = e;
    this.map = map;
    this.map.addLayer(this.nsrFeatureGroup);
    layerControl.addOverlay(this.nsrFeatureGroup, '企业分布');
  }

  /**
   * 导出查询结果
   */
  download() {
    this.loadSrv.open({
      text: '正在处理……'
    });
    const nsrmcs = this.data.map(item => item.NSRMC);

    this.http.post('bdg/tools/batchQuery', {
      nsrmcs,
      ...this.getCondition()
    }).subscribe(resp => {

      const rawData = resp.data.map(item => {
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
      export2excel(`税收排名-${new Date().toLocaleString()}.xlsx`, '税收排名', rawData);

    });

  }

  boarding() {


  }
}
