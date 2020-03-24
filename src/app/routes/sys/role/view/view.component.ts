import { Component, OnInit } from '@angular/core';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { NzMessageService } from 'ng-zorro-antd/message';
import { _HttpClient } from '@delon/theme';

@Component({
  selector: 'app-sys-role-view',
  templateUrl: './view.component.html',
})
export class SysRoleViewComponent implements OnInit {
  record: any = {};
  i: any;

  constructor(
    private modal: NzModalRef,
    public msgSrv: NzMessageService,
    public http: _HttpClient
  ) { }

  ngOnInit(): void {
    console.log(this.record);
    this.http.get(`sys/roles/${this.record.roleid}`).subscribe(res => {
      if (res.success) {
        this.i = res.data;
      }
    });
  }

  close() {
    this.modal.destroy();
  }
}
