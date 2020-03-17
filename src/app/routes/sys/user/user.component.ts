import { Component, OnInit, ViewChild } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { STColumn, STComponent } from '@delon/abc/table';
import { SFSchema } from '@delon/form';
import { IDepartment, array2tree } from '@shared';

@Component({
  selector: 'app-sys-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.less']
})
export class SysUserComponent implements OnInit {

  departmentTreeNodes: any[];

  constructor(private http: _HttpClient, private modal: ModalHelper) { }

  ngOnInit() {
    this.initDepartmentTree();
  }

  add() {
    // this.modal
    //   .createStatic(FormEditComponent, { i: { id: 0 } })
    //   .subscribe(() => this.st.reload());
  }

  initDepartmentTree() {
    this.http.get('sys/departments').subscribe(resp => {
      const menuData = resp.data.map((dpartment: IDepartment) => {
        return {
          title: dpartment.department_name,
          'key': dpartment.department_id,
          'parent_id': dpartment.parent_id,
          'parent_name': dpartment.parent_name
        };
      });
      this.departmentTreeNodes = array2tree(menuData, 'key', 'parent_id', 'children');
      console.log(this.departmentTreeNodes);
    });
  }

  addDepartment() {

  }
  departmentSelected(e) {
    console.log(e);
  };
  refreshDepartment() {


  }

  addUser() {

  }
}
