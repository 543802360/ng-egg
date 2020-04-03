import { Component, OnInit } from '@angular/core';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { NzMessageService } from 'ng-zorro-antd/message';
import { _HttpClient } from '@delon/theme';
import { IDjnsrxx } from '@shared';

@Component({
  selector: 'app-company-djnsrxx-view',
  templateUrl: './view.component.html',
})
export class CompanyDjnsrxxViewComponent implements OnInit {
  record: IDjnsrxx = {};
  i: IDjnsrxx;

  constructor(
    private modal: NzModalRef,
    public msgSrv: NzMessageService,
    public http: _HttpClient
  ) { }

  ngOnInit(): void {
    this.http.get(`nsr/${this.record.DJXH}`).subscribe(res => this.i = res.data);
  }

  close() {
    this.modal.destroy();
  }
}
