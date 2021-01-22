import { ZSXM, EOrder, export2excel } from '@shared';
import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { STColumn, STComponent, STPage } from '@delon/abc/st';
import { SFSchema } from '@delon/form';
import { XlsxService, LoadingService } from '@delon/abc';
import { deepCopy } from '@delon/util';
import { BdgSelectComponent } from 'src/app/shared/components/bdg-select/bdg-select.component';
import { MonthRangeComponent } from 'src/app/shared/components/month-range/month-range.component';
import { NzMessageService } from 'ng-zorro-antd';

@Component({
  selector: 'app-budget-bdg-analysis-batch-query',
  templateUrl: './batch-query.component.html',
  styleUrls: ['./batch-query.component.less']
})
export class BudgetBdgAnalysisBatchQueryComponent implements OnInit {
  url = `bdg/tools/batchQuery`;
  xlsxColumns: STColumn[] = [];
  xlsxData: any[] = [];

  @ViewChild('bdgSelect') bdgSelect: BdgSelectComponent;
  @ViewChild('monthRange') monthRange: MonthRangeComponent;

  page: STPage = {
    show: true,
  }


  matchNodes: any[] = [];
  selectedMatchedField: string; @ViewChild('st') st: STComponent;


  constructor(
    private cdr: ChangeDetectorRef,
    public http: _HttpClient,
    private loadSrv: LoadingService,
    private xlsx: XlsxService,
    private msgSrv: NzMessageService) { }

  ngOnInit() { }


  getCondition() {
    const { startDate, endDate } = this.monthRange;
    const year = startDate.getFullYear();
    const startMonth = startDate.getMonth() + 1;
    const endMonth = endDate.getMonth() + 1;
    const budgetValue = this.bdgSelect.budgetValue.toLocaleString();

    return { year, startMonth, endMonth, budgetValue };


  }

  export() {

    if (!this.selectedMatchedField) {
      this.msgSrv.warning('请选择查询字段');
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
    const nsrmcs = this.xlsxData.map(item => item[this.selectedMatchedField]);
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
      export2excel(`税收导出-${new Date().toLocaleString()}.xlsx`, [{
        sheetName: '税收导出',
        rowData
      }]);

    });
  }

  /**
   * 读取excel表格数据
   * @param e 
   */
  change(e) {
    this.loadSrv.open({ text: '正在处理……' });
    const node = e.target as HTMLInputElement;

    this.xlsx.import(node.files[0]).then(res => {
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
      this.matchNodes = columns.map(col => {
        return {
          label: col,
          value: col
        }
      });

      setTimeout(() => {
        this.st.resetColumns({ columns: this.xlsxColumns, emitReload: true })
        // 获取待匹配的数据
        targetSheet.shift();
        this.xlsxData = targetSheet.map(value => {
          const item = {};
          columns.forEach((el, index) => {
            item[el] = value[index] ? String(value[index]).trim() : 0;
          });
          return item;
        });
        this.loadSrv.close();

      });
    });
  }
}
