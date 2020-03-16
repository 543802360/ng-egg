import { Component, OnInit, ViewChild } from '@angular/core';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { NzMessageService } from 'ng-zorro-antd/message';
import { _HttpClient } from '@delon/theme';
import { SFSchema, SFUISchema } from '@delon/form';

@Component({
  selector: 'app-sys-role-edit',
  templateUrl: './edit.component.html',
})
export class SysRoleEditComponent implements OnInit {
  record: any = {};
  i: any;
  schema: SFSchema = {
    properties: {
      rolename: { type: 'string', title: '角色名称' },
      remark: { type: 'string', title: '角色说明' },
      functionPermission: { type: 'string', title: '功能权限' },
      dataPermission: { type: 'string', title: '数据权限' },
    },
    required: ['rolename', 'functionPermission'],
  };
  ui: SFUISchema = {
    '*': {
      spanLabelFixed: 100,
      grid: { span: 12 },
    },
    $rolename: {
      widget: 'text'
    },
    $remark: {
      widget: 'string',
    },

  };

  constructor(
    private modal: NzModalRef,
    private msgSrv: NzMessageService,
    public http: _HttpClient,
  ) { }

  ngOnInit(): void {
    if (this.record.id > 0)
      this.http.get(`sys/roles/${this.record.roleid}`).subscribe(res => (this.i = res));
  }

  save(value: any) {
    // this.http.post(`/user/${this.record.id}`, value).subscribe(res => {
    //   this.msgSrv.success('保存成功');
    //   this.modal.close(true);
    // });
  }

  close() {
    this.modal.destroy();
  }
}
