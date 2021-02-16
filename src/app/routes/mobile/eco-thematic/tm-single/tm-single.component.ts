import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { _HttpClient } from '@delon/theme';
import { Modal, ToastService } from 'ng-zorro-antd-mobile';
import { MobileQypmConditionComponent } from '../../mobile-shared/components/qypm-condition/qypm-condition.component';
import { forkJoin, pipe } from 'rxjs';
import F2 from "@antv/f2/lib/index-all";
import { numberToMoney, order } from '@shared';
import { LoadingService } from '@delon/abc';
import { debounceTime, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-mobile-tm-order',
  templateUrl: './tm-single.component.html',
  styleUrls: ['./tm-single.component.less']
})
export class MobileTmSingleComponent implements OnInit, AfterViewInit {

  zsxmUrl = `bdg/enterprise/tax/zsxm`;
  historyUrl = `bdg/enterprise/tax/history`;


  currentNsrmc: string;
  startTime: Date;
  endTime: Date;
  singleHistoryTaxData: any[] = []; //当年税收
  singleCurTaxData: any[] = [];
  nsrmcSuggestions: string[] = [];
  nsrSuggestVisible = false;

  state = {
    open: false,
    refreshing: false,
    height: window.innerHeight - ((63 + 47) * window.devicePixelRatio) / 2,
    data: []
  };
  constructor(
    private http: _HttpClient,
    private route: ActivatedRoute,
    private toastSrv: ToastService,
    private loadSrv: LoadingService
  ) {
    const currentDate = new Date();
    this.startTime = new Date(currentDate.getFullYear(), 0);
    this.endTime = new Date(currentDate.getFullYear(), currentDate.getMonth());
  }

  ngOnInit() {

  }

  ngAfterViewInit() {
    this.route.queryParams.subscribe(params => {
      setTimeout(() => {
        this.currentNsrmc = params.nsrmc;
        if (this.currentNsrmc) {
          this.submitSearch();
        } else {
          this.state.open = true;
        }
      });
    });
  }
  currentDateFormat(date, format: string = 'yyyy-mm-dd HH:MM'): any {
    const pad = (n: number): string => (n < 10 ? `0${n}` : n.toString());
    return format
      .replace('yyyy', date.getFullYear())
      .replace('mm', pad(date.getMonth() + 1))
      .replace('dd', pad(date.getDate()))
      .replace('HH', pad(date.getHours()))
      .replace('MM', pad(date.getMinutes()))
      .replace('ss', pad(date.getSeconds()));
  }

  submitSearch() {


    if (!this.currentNsrmc) {
      this.toastSrv.info('请输入纳税人名称！', 2000);
      return;
    }
    const year = this.startTime.getFullYear();
    const startMonth = this.startTime.getMonth() + 1;
    const endMonth = this.endTime.getMonth() + 1;
    const qkjParams = {
      nsrmc: this.currentNsrmc,
      year,
      startMonth,
      endMonth,
      budgetValue: '1,3,4'
    };
    const dfkjParams = {
      nsrmc: this.currentNsrmc,
      year,
      startMonth,
      endMonth,
      budgetValue: '4'
    }
    this.nsrSuggestVisible = false;
    this.nsrmcSuggestions.length = 0;
    this.loadSrv.open({
      text: '正在加载'
    });
    this.singleHistoryTaxData.length = 0;
    let $history_stream_qkj = this.http.get(this.historyUrl, qkjParams);
    let $history_stream_dfkj = this.http.get(this.historyUrl, dfkjParams);

    let $cur_stream_qkj = this.http.get(this.zsxmUrl, qkjParams);
    let $cur_stream_dfkj = this.http.get(this.zsxmUrl, dfkjParams);

    let $history_stream = forkJoin([$history_stream_qkj, $history_stream_dfkj]);
    let $cur_stream = forkJoin([$cur_stream_qkj, $cur_stream_dfkj]);
    //获取历年税收，全+地方口径
    $history_stream.subscribe(resp => {
      this.loadSrv.close();
      this.state.open = false;
      let data1 = resp[0]['data'].map(item => {
        return {
          year: item.YEAR,
          type: '全口径',
          tax: item.VALUE
        }
      }).reverse();
      let data2 = resp[1]['data'].map(item => {
        return {
          year: item.YEAR,
          type: '地方口径',
          tax: item.VALUE
        }
      }).reverse();
      resp[0]['data'].forEach((item, index) => {
        this.singleHistoryTaxData.push({
          qkj: item.VALUE,
          dfkj: resp[1]['data'][index].VALUE,
          year: item.YEAR
        });
      });
      // console.log(this.singleHistoryTaxData);
      this.initChart([...data1, ...data2]);

    });

    //获取本年度分税种税收
    $cur_stream.subscribe(resp => {

      const data = resp[1]['data'];
      const bndZsxmData = Object.keys(data).map(key => {
        return {
          zsxm: key,
          tax: data[key]
        }
      });
      bndZsxmData.sort(order('tax'));
      this.singleCurTaxData = [...bndZsxmData];

    });
  }

  clearSearch() {
    this.currentNsrmc = '';
    this.nsrSuggestVisible = false;
  }

  getNsrSuggestions(nsrmc: string) {
    if (nsrmc && nsrmc.length >= 2) {

      this.http.get('nsr/suggestion', { NSRMC: nsrmc }).pipe(
        debounceTime(400))
        .subscribe(resp => {
          this.nsrmcSuggestions = resp['data'];
          this.getNsrSuggestions.length ? this.nsrSuggestVisible = true : this.nsrSuggestVisible = false;
        });
    }
  }

  initChart(taxData: any[]) {

    // console.log(itemData);
    // this.listData = itemData;
    // 初始化图表
    let chart = new F2.Chart({
      id: 'qy-single-chart',
      pixelRatio: window.devicePixelRatio
    });
    chart.source(taxData);

    chart.axis('year', {
      label: (text, index, total) => {
        let textCfg = {};
        if (index === 0) {
          textCfg['textAlign'] = "left";
        } else if (index === total - 1) {
          textCfg['textAlign'] = "right";
        }
        return textCfg;
      }
    });
    (chart as any).legend('type', {
      position: 'bottom',
      align: 'left',
      nameStyle: {
        fontSize: '14'
      },
      valueStyle: {
        fontSize: '14'
      }
    });
    chart.tooltip({
      custom: true,
      onChange: obj => {
        let legend = chart.get('legendController').legends.bottom[0];
        let tooltipItems = obj.items.map(item => Object.assign(item, { value: numberToMoney(item.value) }));
        let legendItems = legend.items;
        let map = {};
        legendItems.map(item => {
          map[item.name] = Object.assign({}, item);
        });
        tooltipItems.map(item => {
          let name = item.name;
          let value = item.value;
          if (map[name]) {
            map[name].value = value;
          }
        });
        console.log(map);
        legend.setItems(Object.values(map));
      },
      onHide: () => {
        let legend = chart.get('legendController').legends.bottom[0];
        legend.setItems(chart.getLegendItems().country);

      }
    });

    chart.line().position('year*tax').color('type').shape('smooth');
    chart.point().position('year*tax').color('type').shape('smooth').style({
      stroke: '#fff',
      lineWidth: 1
    });

    chart.guide().text({
      position: ['min', 'max'],
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
  }

}


