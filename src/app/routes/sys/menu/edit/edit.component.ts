import { Component, OnInit, ViewChild, Input, AfterViewInit, EventEmitter } from '@angular/core';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { NzMessageService } from 'ng-zorro-antd/message';
import { _HttpClient } from '@delon/theme';
import { SFSchema, SFUISchema, SFComponent } from '@delon/form';
import { IMenu, array2tree, TableOperator, MenuType } from '@shared';
import { delay, map } from 'rxjs/operators';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NzTreeSelectComponent } from 'ng-zorro-antd';


@Component({
  selector: 'app-sys-menu-edit',
  templateUrl: './edit.component.html',
})
export class SysMenuEditComponent implements OnInit, AfterViewInit {
  // 菜单
  @Input() menu: IMenu;
  menuGroup: FormGroup;
  menuTreeNodes = [];
  parentMenu; // 父级菜单
  menutype: MenuType;  // 节点类型
  selectedIcon: string; // 所选图标 font-awesome

  @ViewChild('menuTree', { static: false }) menuTree: NzTreeSelectComponent;

  constructor(
    private modal: NzModalRef,
    private msgSrv: NzMessageService,
    public http: _HttpClient,
    private fb: FormBuilder,
    private modalSrv: NzModalService
  ) { }

  ngOnInit(): void {
    if (this.menu) {
      this.menuGroup = this.fb.group({
        menuname: [this.menu.menuname, [Validators.required]],
        menutype: [this.menutype],
        parent_name: ['',],
        route_path: [this.menu.route_path],
        icon: [this.menu.icon],
        order_num: [this.menu.order_num],
        perms: [this.menu.perms]
      });
      this.menutype = this.menu.menutype;
    } else {
      this.menuGroup = this.fb.group({
        menuname: [null, [Validators.required]],
        menutype: [0],
        parent_name: [null],
        route_path: [null],
        icon: [null],
        order_num: [null],
        perms: [null]
      });

      this.menutype = MenuType.DIR;
    }

    // 初始化菜单树
    this.http.get('sys/menus').pipe(
      map(resp => {
        const menuData = resp.data.map((menu: IMenu) => {
          return { title: menu.menuname, 'key': menu.menu_id, 'parent_id': menu.parent_id };

        });
        return array2tree(menuData, 'key', 'parent_id', 'children');
      })
    ).subscribe(resp => {
      setTimeout(() => {
        this.menuTreeNodes = resp;
        if (this.menu) {
          this.menuGroup.controls.icon.setValue(this.menu.icon);
          this.parentMenu = this.menu.parent_id;
        }
      });
    });
  }

  ngAfterViewInit() {
  }

  menunameValidator(control: FormControl): { [s: string]: boolean } {
    if (control.value && control.value !== this.menuGroup.controls.menuname.value) {
      return { error: true };
    }
    return {};
  };

  onIconPickerSelect(e) {
    this.menuGroup.controls.icon.setValue(e);
  }
  /**
   * 保存修改菜单
   * @param menu
   */
  save() {

    // tslint:disable-next-line: forin
    for (const i in this.menuGroup.controls) {
      this.menuGroup.controls[i].markAsDirty();
      this.menuGroup.controls[i].updateValueAndValidity();
    }
    if (!this.menuGroup.value.menuname) return;

    if (this.menu && this.menu.menu_id) {
      // 更新
      let editedMenu: IMenu = { ...this.menu, ...this.menuGroup.value };
      // 获取父节点id
      if (this.menuGroup.value.parent_name) {
        const selectedMenuNode = this.menuTree.getSelectedNodeList()[0];
        editedMenu = { ...editedMenu, parent_id: selectedMenuNode.key, parent_name: selectedMenuNode.title };
      }
      if (editedMenu.menuname === editedMenu.parent_name) {
        this.msgSrv.warning('节点名称不能与上级节点名称相同！');
        return;
      };
      this.http.put(`sys/menus/${this.menu.menu_id}`, editedMenu).subscribe(resp => {
        this.success(resp);
      }, error => {

      });
    } else {
      // 创建
      let newMenu = {
        ...this.menuGroup.value
      };
      // 获取父节点id
      if (this.menuGroup.value.parent_name) {
        const selectedMenuNode = this.menuTree.getSelectedNodeList()[0];
        newMenu = { ...newMenu, parent_id: selectedMenuNode.key, parent_name: selectedMenuNode.title };
      };
      if (newMenu.menuname === newMenu.parent_name) {
        this.msgSrv.warning('节点名称不能与上级节点名称相同！');
        return;
      };
      this.http.post(`sys/menus`, newMenu).subscribe(resp => {
        this.success(resp);
      }, error => {

      });
    }
  }

  close(result?: any) {
    this.modal.destroy(result);
  }

  /**
   * 菜单保存成功响应处理
   * @param resp :http response
   */
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
