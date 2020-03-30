import { Component, OnInit, ViewChild } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { STColumn, STComponent, STData } from '@delon/abc/table';
import { SFSchema } from '@delon/form';
import { IPayer } from '@shared/models/IPayer';

@Component({
  selector: 'app-company-list',
  templateUrl: './list.component.html',
})
export class CompanyListComponent implements OnInit {
  importTypes = ['下载模板', '追加导入', '重新导入'];
  url = `/user`;
  q: IPayer = {
    NSRMC: '',
    NSRSBH: '',
    SHXYDM: '',
    NSRZT: ''
  };
  data: any[] = [];
  loading = false;
  selectedRows: STData[] = [];

  expandForm = false;

  @ViewChild('st', { static: false }) st: STComponent;
  columns: STColumn[] = [
    { title: '编号', index: 'no' },
    { title: '调用次数', type: 'number', index: 'callNo' },
    { title: '头像', type: 'img', width: '50px', index: 'avatar' },
    { title: '时间', type: 'date', index: 'updatedAt' },
    {
      title: '',
      buttons: [
        // { text: '查看', click: (item: any) => `/form/${item.id}` },
        // { text: '编辑', type: 'static', component: FormEditComponent, click: 'reload' },
      ]
    }
  ];

  constructor(private http: _HttpClient, private modal: ModalHelper) { }

  ngOnInit() { }

  add() {
    // this.modal
    //   .createStatic(FormEditComponent, { i: { id: 0 } })
    //   .subscribe(() => this.st.reload());
  }

  getData() {

  }

}
