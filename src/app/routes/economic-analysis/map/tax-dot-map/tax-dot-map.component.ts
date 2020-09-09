import { debounceTime, debounce } from 'rxjs/operators';
import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { BehaviorSubject, Observable, Subscription, from, timer } from 'rxjs';
import { NzMessageService, NzTreeSelectComponent } from 'ng-zorro-antd';
import * as mapboxgl from "mapbox-gl";
import { dark } from "@geo";
import { BdgSelectComponent, MonthRangeComponent } from '@shared';
import { LoadingService, ReuseTabService, ReuseHookTypes, ReuseComponentInstance } from '@delon/abc';
import { Router, ActivatedRoute } from '@angular/router';

interface ItemData {
  NSRMC: string,
  BNDSR: number,
  SNTQ: number,
  TBZJZ: number,
  TBZJF: string,
  LAT: number,
  LNG: number
}

@Component({
  selector: 'app-economic-analysis-map-tax-dot-map',
  templateUrl: './tax-dot-map.component.html',
  styleUrls: ['./tax-dot-map.component.less'],
})
export class EconomicAnalysisMapTaxDotMapComponent implements OnInit, AfterViewInit, ReuseComponentInstance {

  url = `analysis/taxdot`;
  @ViewChild('bdgSelect') bdgSelect: BdgSelectComponent;
  @ViewChild('monthRange') monthRange: MonthRangeComponent;
  @ViewChild('hyTreeSelect') hyTreeSelect: NzTreeSelectComponent;
  ds;
  selectedValue = 1000;
  selectedHy;
  style = dark;
  map: mapboxgl.Map;

  constructor(
    public http: _HttpClient,
    private loadSrv: LoadingService,
    private router: Router,
    private route: ActivatedRoute,
    private msgSrv: NzMessageService) { }
  _onReuseDestroy: () => void;
  destroy: () => void;

  ngOnInit() { }

  /**
   * 复用路由初始化，重复进入时
   */
  _onReuseInit() {
    console.log('_onReuseInit');
    if (this.map) {
      setTimeout(() => {
        this.map.resize();
      });
    }
  }

  ngAfterViewInit() {
    this.loadSrv.open({ text: '正在处理……' });
    setTimeout(() => {
      this.getData();
    });
  }

  click(i: ItemData) {
    this.router.navigate(['../../budget/single-query'], {
      queryParams: { nsrmc: i.NSRMC },
      relativeTo: this.route
    })
  }

  hyChange(e) {
    this.selectedHy = e;
  }

  getData() {
    this.http.get(this.url, this.getCondition()).subscribe(resp => {
      this.ds = new MyDataSource(resp.data);
      this.loadSrv.close();
    });
  }

  /**
   * 获取查询条件参数
   */
  getCondition() {
    this.bdgSelect.budgetValue.length == 0 ? this.bdgSelect.budgetValue = [4] : null;
    const { startDate, endDate } = this.monthRange;
    const year = startDate.getFullYear();
    const startMonth = startDate.getMonth() + 1;
    const endMonth = endDate.getMonth() + 1;
    const budgetValue = this.bdgSelect.budgetValue.toLocaleString();
    const value = this.selectedValue;

    // const adminCode = '3302130000';
    return this.selectedHy === null ? { year, startMonth, endMonth, budgetValue, value }
      : { year, startMonth, endMonth, budgetValue, value, ...this.selectedHy };

  }

  export() {

  }

  mapboxLoad(e) {
    this.map = e;

  }

}

class MyDataSource extends DataSource<ItemData>{

  private pageSize = 5;
  private cachedData: ItemData[];
  private fetchedPages = new Set<number>();
  private dataStream;
  private subscription = new Subscription();
  private data: ItemData[];
  constructor(data: ItemData[]) {
    super();
    this.data = data;
    this.cachedData = Array.from<ItemData>({ length: this.data.length });
    this.dataStream = new BehaviorSubject<ItemData[]>(this.cachedData);

  }

  connect(collectionViewer: CollectionViewer): Observable<ItemData[]> {
    this.subscription.add(
      collectionViewer.viewChange.subscribe(range => {
        const startPage = this.getPageForIndex(range.start);
        const endPage = this.getPageForIndex(range.end - 1);
        for (let i = startPage; i <= endPage; i++) {
          this.fetchPage(i);
        }
      })
    );
    return this.dataStream;
  }

  disconnect(): void {
    this.subscription.unsubscribe();
  }

  private getPageForIndex(index: number): number {
    return Math.floor(index / this.pageSize);
  }

  private fetchPage(page: number): void {
    if (this.fetchedPages.has(page)) {
      return;
    }
    this.fetchedPages.add(page);

    // from([]).pipe(debounce(() => timer(400))).subscribe(resp => {

    // });
    const appendData = this.data.slice(page * this.pageSize, (page + 1) * this.pageSize)
    this.cachedData.splice(page * this.pageSize, this.pageSize, ...appendData);
    this.dataStream.next(this.cachedData);
  }

}