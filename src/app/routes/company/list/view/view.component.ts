import { IDjnsrxx } from '@shared';
import { Component, OnInit } from '@angular/core';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { NzMessageService } from 'ng-zorro-antd/message';
import { _HttpClient } from '@delon/theme';

@Component({
  selector: 'app-company-list-view',
  templateUrl: './view.component.html',
})
export class CompanyListViewComponent implements OnInit {
  //  默认参数名
  record: IDjnsrxx = {};
  i: IDjnsrxx;

  constructor(
    private modal: NzModalRef,
    public msgSrv: NzMessageService,
    public http: _HttpClient
  ) { }

  ngOnInit(): void {
    this.http.get(`hx/nsr/show`, { id: this.record.UUID }).subscribe(res => this.i = res.data);
  }

  close() {
    this.modal.destroy();
  }
}
