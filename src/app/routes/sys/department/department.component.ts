import { Component, OnInit, Input } from '@angular/core';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { NzMessageService } from 'ng-zorro-antd/message';
import { _HttpClient } from '@delon/theme';
import { SFSchema, SFUISchema } from '@delon/form';
import { IDepartment, TableOperator } from '@shared';

@Component({
  selector: 'app-sys-department',
  templateUrl: './department.component.html',
})
export class SysDepartmentComponent implements OnInit {
  @Input() record: IDepartment;
  schema: SFSchema = {
    properties: {
      department_name: { type: 'string', title: '部门名称' },
      parent_name: { type: 'string', title: '上级部门', readOnly: true }
    },
    required: ['department_name'],
  };
  ui: SFUISchema = {
    '*': {
      spanLabelFixed: 100,
      grid: { span: 24 },
    },
    $department_name: {
      widget: 'string'
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
    if (depart.department_id) {
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
