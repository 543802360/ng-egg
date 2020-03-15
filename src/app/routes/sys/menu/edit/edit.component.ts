import { Component, OnInit, ViewChild, Input, AfterViewInit, EventEmitter } from '@angular/core';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { NzMessageService } from 'ng-zorro-antd/message';
import { _HttpClient } from '@delon/theme';
import { SFSchema, SFUISchema, SFComponent } from '@delon/form';
import { IMenu, array2tree, TableOperator } from '@shared';
import { delay, map } from 'rxjs/operators';
import { IconPickerComponent } from '@shared/components/icon-picker.component';
import { FormControl, FormGroup, FormBuilder } from '@angular/forms';


@Component({
  selector: 'app-sys-menu-edit',
  templateUrl: './edit.component.html',
})
export class SysMenuEditComponent implements OnInit, AfterViewInit {
  @ViewChild('sf', { static: false }) menuSf: SFComponent;
  // 菜单
  @Input() menu: IMenu = {};
  menuGroup: FormGroup;
  menuTreeNodes = [];
  parentMenu;
  // 菜单表单json schema定义
  schema: SFSchema = {
    properties: {
      menuname: {
        type: 'string',
        title: '菜单名称'
      },
      parent_name: {
        type: 'string',
        title: '上级菜单',
        enum: [
          { title: '一级菜单', key: '' }
        ]
      },
      // parent_id: {
      //   type: 'string',
      //   title: '上级菜单ID',
      // },
      route_path: {
        type: 'string',
        title: '节点路由'
      },
      // menutype: {
      //   type: 'string',
      //   title: '节点类型',
      //   enum: [
      //     { label: '目录', value: 'DIR' },
      //     {
      //       label: '菜单', value: 'MENU',
      //     }
      //   ]
      // },
      icon: {
        type: 'string',
        title: '节点图标',
        // ui: {
        //   widget: 'custom_icon'
        // }
      },
      order_num: {
        type: 'number',
        title: '排序号'
      },
    },
    required: ['menuname'],
  };
  // 表单ui定义
  ui: SFUISchema = {

    '*': {
      spanLabelFixed: 100,
      grid: { span: 24 },
    },
    $menuname: {
      widget: 'string'
    },
    // $parent_id: {
    //   widget: 'string',
    // },
    $parent_name: {
      widget: 'tree-select',
      multiple: false,
      allowClear: true,
      asyncData: () => {
        return this.http.get('sys/menus').pipe(
          map(resp => {
            const menuData = resp.data.map((menu: IMenu) => {
              return { title: menu.menuname, 'key': menu.menu_id, 'parent_id': menu.parent_id };

            });
            return array2tree(menuData, 'key', 'parent_id', 'children');
          })
        );
      }
    },
    $icon: {
      widget: 'fontawesome',
      position: 'right',
      onIconPickerSelect: (icon) => {
        console.log(icon, this.menuSf);
      }
    },
    $order_num: {
      widget: 'number',
      grid: {
        span: 24
      }
    },

  };

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
        menuname: [this.menu.menuname],
        parent_name: [''],
        route_path: [this.menu.route_path],
        icon: [this.menu.icon],
        order_num: [this.menu.order_num]
      });
    } else {

    }


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
        this.parentMenu = this.menu.parent_id;
      });
    });
  }

  ngAfterViewInit() {



    // if (this.menu) {
    //   Object.assign(this.schema.properties, {
    //     parent_name: {
    //       type: 'string',
    //       title: '上级菜单',
    //       enum: [
    //         { title: '一级菜单', key: '' }
    //       ],
    //       default: this.menu.parent_id
    //     },
    //     icon: {
    //       type: 'string',
    //       title: '节点图标',
    //       enum: [''],
    //       default: this.menu.icon
    //     },
    //   });
    //   setTimeout(() => {
    //     this.menuSf.refreshSchema();
    //   }, 200);
    // }
  }

  iconSelect() {
    console.log('choose icon start');
    this.modalSrv.create({
      nzTitle: '选择菜单图标',
      nzContent: IconPickerComponent,
      nzComponentParams: {
        position: 'bottom',
        onIconPickerSelect: (icon) => {
          console.log('choose :', icon);
        }
      }
    }).open();
  }
  /**
   * 保存修改菜单
   * @param menu
   */
  save(menu: IMenu) {
    // 获取父节点id，为空或存在
    Object.assign(menu, { parent_id: menu.parent_name });
    if (menu.menu_id) {
      // 更新
      this.http.put(`sys/menus/${menu.menu_id}`, menu).subscribe(resp => {
        this.success(resp);
      }, error => {

      });
    } else {
      // 创建
      this.http.post(`sys/menus`, menu).subscribe(resp => {
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
