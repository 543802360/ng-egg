import { LoadingTypesService } from '@core/loading-types.service';
import { CacheService } from '@delon/cache';
import { Component, OnInit, ViewChild } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { STColumn, STComponent, STPage, STSingleSort } from '@delon/abc/table';
import { SFSchema, SFUISchema } from '@delon/form';

import { NzMessageService } from 'ng-zorro-antd';
import * as mapnboxgl from "mapbox-gl";
import { dark } from "@geo";
import { LoadingService } from '@delon/abc';
import { yuan, order } from '@shared';

@Component({
  selector: 'app-permu-tax-perm-hy',
  templateUrl: './perm-hy.component.html',
  styleUrls: ['./perm-hy.component.less']
})
export class PermuTaxPermHyComponent implements OnInit {

  style = dark;
  map: mapboxgl.Map;

  //#region 表单搜索
  searchSchema: SFSchema = {
    properties: {
      hymc: {
        type: 'string',
        title: '行业名称',
        enum: this.cacheSrv.get('hymc', { mode: 'none' })

      }
    }
  };
  ui: SFUISchema = {
    $hymc: {
      widget: 'tree-select',
      checkable: false,
      showLine: false,
      allowClear: true,
      dropdownStyle: {
        'max-height': '300px'
      },
      width: 360
    }
  }
  //#endregion

  //#region 行业亩均税收表格
  hyPermTaxData;
  @ViewChild('st') st: STComponent;
  columns: STColumn[] = [
    {
      title: '排名',
      type: 'no',
      className: 'text-center',
      width: 60,
      fixed: 'left'
    },
    {
      title: '门类名称',
      index: 'MLMC',
      className: 'text-center',
      width: 260,
      fixed: 'left'
    },
    {
      title: '全口径税收',
      index: 'ALL_VALUE',
      className: 'text-center',
      width: 120,
      sort: true,
      format: (item, column, index) => {
        return yuan(item.ALL_VALUE, 2);
      }
    },
    {
      title: '区级税收',
      index: 'COUNTY_VALUE',
      className: 'text-center',
      width: 120,
      format: (item, column, index) => {
        return yuan(item.COUNTY_VALUE, 2);
      }
    },
    {
      title: '占地面积(亩)',
      index: 'ZYMJ_MU',
      className: 'text-center',
      width: 120,
      format: (item, column, index) => {
        return yuan(item.ZYMJ_MU, 2);
      }
    },
    {
      title: '全口径亩均税收(亩/万元)',
      index: 'PERM_ALL',
      className: 'text-center',
      width: 120,
      format: (item, column, index) => {
        return yuan(item.PERM_ALL, 2);
      }
    },
    {
      title: '区级亩均税收(亩/万元)',
      index: 'PERM_COUNTY',
      className: 'text-center',
      width: 120,
      format: (item, column, index) => {
        return yuan(item.PERM_COUNTY, 2);
      }
    },
    {
      title: '操作',
      width: 100,
      fixed: 'right',
      className: 'text-center',
      buttons: [
        {
          icon: 'global',
          type: 'drawer',
          tooltip: '空间分布',
          click: () => {
            console.log('行业亩均空间分布')
          }
        },
        {
          icon: 'info',
          type: 'drawer',
          tooltip: '企业明细'
        },
      ]
    }
  ];
  page: STPage = {
    show: false,
  }

  singleSort: STSingleSort = {

  }

  //#endregion

  //#region 行业亩均概览
  hyPermSummaryData = [];
  permSummarycolumns: STColumn[] = [
    {
      title: '门类名称',
      index: 'MLMC',
      className: 'text-center',
      width: 260,
      fixed: 'left'
    },
    {
      title: '亩均税收排名',
      index: 'TAX_ORDER',
      className: 'text-center',
      width: 120,
      type: 'tag',
      sort: {
        key: 'TAX_ORDER',
        compare: (a, b) => {
          const val1 = a.TAX_ORDER;
          const val2 = b.TAX_ORDER;

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
      title: '占地面积排名',
      index: 'AREA_ORDER',
      className: 'text-center',
      width: 120,
      sort: {
        key: 'AREA_ORDER',
        compare: (a, b) => {
          const val1 = a.AREA_ORDER;
          const val2 = b.AREA_ORDER;

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
      title: '占地面积(亩)',
      index: 'ZYMJ_MU',
      className: 'text-center',
      width: 120,
      format: (item, column, index) => {
        return yuan(item.ZYMJ_MU, 2);
      },
      sort: {
        key: 'ZYMJ_MU',
        compare: (a, b) => {
          const val1 = a.ZYMJ_MU;
          const val2 = b.ZYMJ_MU;

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
      title: '区级亩均税收(亩/万元)',
      index: 'PERM_COUNTY',
      className: 'text-center',
      width: 120,
      format: (item, column, index) => {
        return yuan(item.PERM_COUNTY, 2);
      },
      sort: {
        key: 'PERM_COUNTY',
        compare: (a, b) => {
          const val1 = a.PERM_COUNTY;
          const val2 = b.PERM_COUNTY;

          if (val1 < val2) {
            return 1;
          } else if (val1 > val2) {
            return -1;
          } else {
            return 0
          }
        }
      }
    }

  ];
  //#endregion


  constructor(private http: _HttpClient,
    private modal: ModalHelper,
    private msgSrv: NzMessageService,
    private cacheSrv: CacheService,
    private loadingSrv: LoadingService,
    private loadingTypesSrv: LoadingTypesService) { }

  ngOnInit() {
    // this.loadingSrv.open({
    //   type: 'custom',
    //   custom: this.loadingTypesSrv.loadingTypes.Cubes
    // });
    this.initHyPerm();

  }

  add() {
    // this.modal
    //   .createStatic(FormEditComponent, { i: { id: 0 } })
    //   .subscribe(() => this.st.reload());
  }

  mapboxLoad(e) {
    this.loadingSrv.close();
    this.map = e;
  }

  initHyPerm() {
    this.http.get('perm/mlmc').subscribe(resp => {
      console.table(resp.data);
      this.hyPermTaxData = resp.data;

      // 
      const taxSortData = [...this.hyPermTaxData].sort(order('PERM_COUNTY'));
      const areaSortData = [...this.hyPermTaxData].sort(order('ZYMJ_MU'));

      console.log('--------按区级亩均税收排名-----------');
      console.table(taxSortData);
      console.log('--------按占地面积排名-----------');
      console.table(areaSortData);

      console.log('--------merge-----------------');
      const permMergeData = [];
      taxSortData.forEach((val1, idx1, arr1) => {
        areaSortData.forEach((val2, idx2, arr2) => {
          if (val1.MLMC === val2.MLMC) {
            permMergeData.push({
              MLMC: val1.MLMC,
              TAX_ORDER: idx1 + 1,
              AREA_ORDER: idx2 + 1,
              PERM_COUNTY: val1.PERM_COUNTY,
              ZYMJ_MU: val1.ZYMJ_MU
            });
          }
        });

      });
      this.hyPermSummaryData = permMergeData;
      console.log(permMergeData);
    });
  }

}
