import { Component, OnInit, ViewChild, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { STColumn, STComponent, STPage, STData, STChange, STRes } from '@delon/abc/st';
import { SFSchema } from '@delon/form';
import { BdgSelectComponent } from 'src/app/shared/components/bdg-select/bdg-select.component';
import { MonthRangeComponent } from 'src/app/shared/components/month-range/month-range.component';
import { NzTreeSelectComponent, NzMessageService } from 'ng-zorro-antd';
import { IEOrder } from '@shared';
import { CacheService } from '@delon/cache';
import { Router, ActivatedRoute } from '@angular/router';
import { LoadingService } from '@delon/abc';

@Component({
  selector: 'app-big-enterprise-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.less']
})
export class BigEnterpriseListComponent implements OnInit, AfterViewInit {
  url = `manage/big-enterprises`;
  @ViewChild('st') st: STComponent;
  data: any[];
  total: number;
  // 表头设置
  columns: STColumn[] = [
    {
      index: 'NSRMC',
      title: '纳税人名称',
      className: 'text-center',
      sort: {
        compare: (a, b) => a.NSRMC.length - b.NSRMC.length,
      },
      filter: {
        type: 'keyword',
        fn: (filter, record) => !filter.value || record.NSRMC.indexOf(filter.value) !== -1,
      }
    },
    {
      index: 'NSRSBH',
      title: '纳税人识别号',
      className: 'text-center',
    },
    {
      index: 'SHXYDM',
      title: '社会信用代码',
      className: 'text-center',
    },
    {
      index: 'MLMC',
      title: '所属门类',
      className: 'text-center',
      sort: {
        compare: (a, b) => {
          const val1 = a.MLMC;
          const val2 = b.MLMC;
          if (val1 < val2) {
            return 1;
          } else if (val1 > val2) {
            return -1;
          } else {
            return 0
          }
        }
      },
      filter: {
        multiple: false,
        menus: [
          { text: '制造业', value: '制造业' },
          { text: '建筑业', value: '建筑业' },
          { text: '金融业', value: '金融业' },
          { text: '房地产业', value: '房地产业' },
          { text: '批发和零售业', value: '批发和零售业' },
          { text: '交通运输、仓储和邮政业', value: '交通运输、仓储和邮政业' }
        ],
        fn: (filter, record) => !filter.value || record.MLMC.indexOf(filter.value) !== -1,

      }
    },
    {
      index: 'HYMC',
      title: '所属行业',
      className: 'text-center',

    },
    {
      index: 'CYMC',
      title: '所属产业',
      className: 'text-center',
      sort: {
        compare: (a, b) => {
          const val1 = a.CYMC;
          const val2 = b.CYMC;
          if (val1 < val2) {
            return 1;
          } else if (val1 > val2) {
            return -1;
          } else {
            return 0
          }
        }
      },
      filter: {
        multiple: false,
        menus: [
          { text: '第一产业', value: '第一产业' },
          { text: '第二产业', value: '第二产业' },
          { text: '第三产业', value: '第三产业' }
        ],
        fn: (filter, record) => !filter.value || record.CYMC.indexOf(filter.value) !== -1,

      }
    },
    {
      index: 'YEAR',
      title: '年度',
      className: 'text-center',
    },
    {
      index: 'RANK',
      title: '年度排名',
      className: 'text-center',
      sort: {
        compare: (a, b) => {
          const val1 = a.RANK;
          const val2 = b.RANK;
          if (val1 < val2) {
            return 1;
          } else if (val1 > val2) {
            return -1;
          } else {
            return 0
          }
        }
      }
    },
    {
      title: '操作',
      className: 'text-center',
      buttons: [
        {
          // tooltip: '详情',
          icon: 'eye',
          // 点击查询详细税收
          click: (record: STData, modal: true) => {
            this.router.navigate(['../../budget/single-query'], {
              queryParams: { nsrmc: record.NSRMC },
              relativeTo: this.route
            });
          }
        }
      ]
    }
  ]
  // response
  res: STRes = {
    process: (data: STData, rawData: any) => {
      this.total = rawData.data.count;
      return rawData.data.rows;
    }
  }
  // 分页设置
  page: STPage = {
    show: true,
    front: true,
    showSize: true,
    pageSizes: [10, 20, 30, 50, 100]
  }

  selectedYear: Date;

  constructor(public http: _HttpClient,
    public msg: NzMessageService,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private route: ActivatedRoute,
  ) {
    this.selectedYear = new Date();
  }


  ngOnInit() {

  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.search();
    });
  }


  search() {
    this.http.get('big-enterprises/list', {
      year: this.selectedYear.getFullYear()
    }).subscribe(res => {
      this.data = res.data;
    });
  }

  change(e: STChange) {
    console.log(e);
    if (e.click && e.click.item) {
      const { NSRMC, lat, lng } = e.click.item;
    }
  }

  download() {

  }


}
