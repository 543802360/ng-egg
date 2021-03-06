import { IDepartment, TableOperator } from '@shared';
import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { NzMessageService } from 'ng-zorro-antd/message';
import { _HttpClient } from '@delon/theme';
import { SFSchema, SFUISchema } from '@delon/form';
import { v4 as uuidv4 } from "uuid";
@Component({
  selector: 'app-sys-department-edit',
  templateUrl: './edit.component.html',
})
export class SysDepartmentEditComponent implements OnInit {
  @Input() record: IDepartment;
  @Input() type: string;
  schema: SFSchema = {
    properties: {
      department_id: { type: 'string', title: '部门ID', default: uuidv4() },
      department_name: { type: 'string', title: '部门名称' },
      parent_name: { type: 'string', title: '上级部门', readOnly: true }
    },
    required: ['department_id', 'department_name'],
  };
  ui: SFUISchema = {
    '*': {
      spanLabelFixed: 100,
      grid: { span: 24 },
    },
    $department_id: {
      widget: 'string',
      optionalHelp: '一般为行政区划代码，与业务数据关联'
    },
    $department_name: {
      widget: 'string'
    },
    $department_code: {
      widget: 'select',
      // optional: '(可选)',
      // optionalHelp: '一般为行政区划代码，与业务数据关联'
    },
    $parent_name: {
      widget: 'string',
    },

  };

  constructor(
    private modal: NzModalRef,
    private msgSrv: NzMessageService,
    public http: _HttpClient,
  ) { }

  ngOnInit(): void {
    console.log('edited department:', this.record);
  }

  save(depart: IDepartment) {
    if (this.type === 'update') {
      this.http.put(`sys/departments/${depart.department_id}`, depart).subscribe(resp => {
        this.success(resp);
      }, error => {

      });
    } else {
      this.http.post('sys/departments', depart).subscribe(resp => {
        this.success(resp);
      }, error => {

      });
    }
  }

  close(result?: any) {
    this.modal.destroy(result);
  }


  success(resp) {
    if (resp.success) {
      setTimeout(() => {
        this.close({ type: TableOperator.EDITED });
      });
      this.msgSrv.success(resp.msg, { nzDuration: 4000 });
    } else {
      this.msgSrv.error(resp.msg, { nzDuration: 4000 });
    }
  }

}
