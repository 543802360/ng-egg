import { NzMessageService } from 'ng-zorro-antd/message';
import { Component, OnInit, ViewChild } from '@angular/core';
import { LoadingService, STColumn, STComponent, STPage } from '@delon/abc';
import { _HttpClient } from '@delon/theme';
import { NsrmcSuggestionComponent } from '@shared';

interface itemInfo {
  KMMC?: string
  PAYER_ID?: string,
  PAYMENT_NAME?: string,
  P_DATE?: string,
  TAX_BEGIN_DATE?: string,
  TAX_END_DATE?: string,
  UNIT_AMT?: string,
  ZSXMMC?: string,
}


@Component({
  selector: 'app-deductsum-details',
  templateUrl: './details.component.html',
})
export class DeductsumDetailsComponent implements OnInit {

  startDate: Date;
  endDate: Date;
  url = 'deductsum/detail';
  infoData: itemInfo[];
  @ViewChild('nsrSug') nsrSug: NsrmcSuggestionComponent;
  @ViewChild('st') st: STComponent;


  // 表头设置
  columns: STColumn[] = [
    {
      index: 'ZSXMMC',
      title: '征收项目',
      className: 'text-center',
      width: 120,
      sort: {
        compare: (a, b) => {
          const val1 = a.ZSXMMC;
          const val2 = b.ZSXMMC;
          if (val1 < val2) {
            return 1;
          } else if (val1 > val2) {
            return -1;
          } else {
            return 0
          }
        }
      },

    },
    {
      index: 'KMMC',
      title: '征收科目',
      className: 'text-center',
      width: 120
    },
    {
      index: 'P_DATE',
      title: '入库日期',
      className: 'text-center',
      type: 'date',
      width: 120,
      sort: {
        compare: (a, b) => {
          const val1 = a.P_DATE;
          const val2 = b.P_DATE;
          if (val1 < val2) {
            return 1;
          } else if (val1 > val2) {
            return -1;
          } else {
            return 0
          }
        }
      },
    },

    {
      index: 'TAX_BEGIN_DATE',
      title: '税款所属期起',
      className: 'text-center',
      width: 120

    },
    {
      index: 'TAX_END_DATE',
      title: '税款所属期止',
      className: 'text-center',
      width: 120

    },
    {
      index: 'UNIT_AMT',
      title: '税票金额',
      className: 'text-center',
      width: 120,
      sort: {
        compare: (a, b) => {
          const val1 = parseFloat(a.UNIT_AMT);
          const val2 = parseFloat(b.UNIT_AMT);
          if (val1 < val2) {
            return 1;
          } else if (val1 > val2) {
            return -1;
          } else {
            return 0
          }
        }
      },

    }

  ]
  // 分页设置
  page: STPage = {
    show: true,
    front: true,
    pageSizes: [10, 20, 30, 50, 100]
  }

  constructor(public http: _HttpClient,
    private msgSrv: NzMessageService,
    private loadSrv: LoadingService) { }

  ngOnInit() { }

  getData() {
    if (!this.nsrSug.nsrmc) {
      this.msgSrv.warning('请输入纳税人名称!');
      return;
    }
    if (!this.startDate || !this.endDate) {
      this.msgSrv.warning('请选择入库时间！');
    }
    this.loadSrv.open({ text: '正在查询……' });
    this.http.get(this.url, {
      nsrmc: this.nsrSug.nsrmc,
      startDate: this.startDate.toLocaleDateString(),
      endDate: this.endDate.toLocaleDateString()
    }).subscribe(resp => {
      this.loadSrv.close();
      this.infoData = resp.data;
      console.log(resp);
    })
  }

}
