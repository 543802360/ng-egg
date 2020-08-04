import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { STColumn, STComponent, STPage } from '@delon/abc/st';
import { XlsxService } from '@delon/abc/xlsx';
import { LoadingService } from '@delon/abc';
import { deepCopy } from '@delon/util';
import { NzMessageService } from 'ng-zorro-antd';

@Component({
  selector: 'app-company-used-name',
  templateUrl: './used-name.component.html',
  styleUrls: ['./used-name.component.less']
})
export class CompanyUsedNameComponent implements OnInit {

  url = 'bdg/tools/usedname';
  data: any[];
  xlsxData: any[];
  page: STPage = {
    front: true,
    show: true,
    showSize: true,
    pageSizes: [10, 20, 30, 50, 100]

  }
  @ViewChild('st') st: STComponent;
  columns: STColumn[] = [
    // {
    //   title: '序号',
    //   type: 'no',
    //   className: 'text-center'

    // },
    {
      title: '企业曾用名',
      index: 'history_nsrmc',
      className: 'text-center',
      sort: {
        compare: (a, b) => a.history_nsrmc.length - b.history_nsrmc.length,
      },
      filter: {
        type: 'keyword',
        fn: (filter, record) => !filter.value || record.history_nsrmc.indexOf(filter.value) !== -1,
      }
    },
    {
      title: '企业现用名',
      index: 'current_nsrmc',
      className: 'text-center',
      sort: {
        compare: (a, b) => a.current_nsrmc.length - b.current_nsrmc.length,
      },
      filter: {
        type: 'keyword',
        fn: (filter, record) => !filter.value || record.current_nsrmc.indexOf(filter.value) !== -1,
      }
    }
  ];
  xlsxColumns: STColumn[] = this.columns;

  selectNodes: any[] = [];
  selectedField: string;

  constructor(private http: _HttpClient,
    private loadSrv: LoadingService,
    private msgSrv: NzMessageService,
    private xlsx: XlsxService,
    private cdr: ChangeDetectorRef) { }

  ngOnInit() {
    this.http.get(this.url).subscribe(resp => {
      this.data = resp.data;
    });
  }

  /**
   * 下载导出企业曾用名对照表
   */
  download() {
    const data = [this.columns.map(i => i.title)];
    this.data.forEach(i =>
      data.push(this.columns.map(c => i[c.index as string])),
    );
    this.xlsx.export({
      sheets: [
        {
          data,
          name: '企业曾用名',
        },
      ],
      filename: '企业曾用名.xlsx'
    });
  }

  /**
   * 
   * @param e 
   */
  change(e: Event) {

    this.loadSrv.open({ text: '正在处理……' });
    const node = e.target as HTMLInputElement;

    this.xlsx.import(node.files[0]).then(res => {
      this.loadSrv.close();
      // 默认获取表1为待匹配数据
      const sheetNames = Object.keys(res);
      const targetSheet = res[sheetNames[0]];
      const columns = deepCopy(targetSheet[0]);
      // 设置表头
      this.xlsxColumns = columns.map(col => {
        return {
          index: col,
          title: col,
          className: 'text-center',
        }
      });
      this.selectNodes = columns.map(col => {
        return {
          label: col,
          value: col
        }
      })
      this.st.resetColumns({ columns: this.xlsxColumns, emitReload: true })
      // 获取待匹配的数据
      targetSheet.shift();
      this.xlsxData = targetSheet.map(value => {
        const item = {};
        columns.forEach((el, index) => {
          console.log(value);
          item[el] = String(value[index]).trim();
        });
        return item;
      });

      this.cdr.detectChanges();

    });
  }

  match() {

    if (!this.selectedField) {
      this.msgSrv.warning('请选择匹配字段');
      return;
    }

    this.loadSrv.open({ text: '正在匹配……' });

    const matchedData = [];
    matchedData.push(['企业曾用名', '企业现用名', '是否变更']);
    this.xlsxData.forEach(el => {
      const value = el[this.selectedField];
      const matched = this.data.find(item => item.history_nsrmc === value);
      if (matched) {
        matchedData.push(
          [matched.history_nsrmc, matched.current_nsrmc, '是']);
      } else {
        matchedData.push(['', value, '否'])
      }
    });
    this.loadSrv.close();

    this.xlsx.export({
      sheets: [
        {
          data: matchedData,
          name: '企业名称匹配表',
        },
      ],
      filename: '企业名称匹配结果.xlsx'
    });
  }
}
