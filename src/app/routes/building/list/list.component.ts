import { Component, OnInit, ViewChild } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { STColumn, STComponent, STRes, STData, STReq } from '@delon/abc/table';
import { SFSchema } from '@delon/form';
import { BuildingModelEditComponent } from '../model/edit/edit.component';

@Component({
  selector: 'app-building-list',
  templateUrl: './list.component.html',
})
export class BuildingListComponent implements OnInit {
  url = `building/list`;
  total;
  searchSchema: SFSchema = {
    properties: {
      no: {
        type: 'string',
        title: '编号'
      }
    }
  };
  @ViewChild('st', { static: false }) st: STComponent;
  // 数据列配置
  columns: STColumn[] = [
    // {
    //   index: 'building_id',
    //   title: '编号',
    //   type: 'checkbox',
    //   format: (item, col, index) => `${index + 1} `,
    //   fixed: 'left',
    //   width: 40,
    //   exported: false,
    //   className: 'text-center'
    // },
    {
      title: '序号',
      type: 'no',
      fixed: 'left',
      width: 60,
      className: 'text-center'

    },
    {
      title: '楼宇名称',
      index: 'building_name',
      fixed: 'left',
      width: 150,
      className: 'text-center'
    },
    {
      title: '楼宇地址',
      index: 'building_address',
      fixed: 'left',
      width: 150,
      className: 'text-center'
    },
    {
      title: '楼宇高度',
      width: 100,
      format: (item, col, index) => `${item.building_height} 米`,
      index: 'building_height',
      className: 'text-center'
    },
    {
      title: '楼宇层数',
      index: 'building_floor',
      className: 'text-center',
      width: 100,
      format: (item, col, index) => `${item.building_floor} 层`

    },
    {
      title: '所属街道',
      width: 100,
      index: 'jdxz_dm',
      className: 'text-center',
      // 超管可见
      acl: {
        role: ['1']
      }
    },
    {
      title: '有效标志',
      index: 'yxbz',
      width: 100,
      className: 'text-center',
      // 超管可见
      acl: {
        role: ['1']
      },
      type: "tag",
      tag: {
        'Y': { text: '有效', color: 'green' },
        'N': { text: '无效', color: 'red' },
      },
    },
    {
      title: '创建日期',
      type: 'date',
      index: 'created_at',
      width: 100,
      dateFormat: 'YYYY-MM-DD',
      className: 'text-center'
    },
    {
      title: '说明',
      index: 'building_bz',
      className: 'text-center',
      width: 180,
    },
    {
      title: '操作',
      fixed: 'right',
      width: 140,
      className: 'text-center',
      buttons: [
        {
          // text: '查看',
          icon: 'eye',
          tooltip: '查看楼宇信息',
          type: 'modal',
          // acl: {
          //   ability: ['company:hxnsrxx:view']
          // },
          modal: {
            component: BuildingModelEditComponent,
            params: record => ({ record }),
            modalOptions: {
              nzStyle: {
                left: '26%',
                position: 'fixed'
              }
            }
          },
          click: (_record, modal, comp) => {
            // modal 为回传值，可自定义回传值

          }
        },
        {
          icon: 'edit',
          tooltip: '编辑纳税人信息',
          // acl: {
          //   ability: ['company:hxnsrxx:edit']
          // },
          type: "modal",
          modal: {
            component: '',
            params: record => record,
            modalOptions: {
              nzStyle: {
                left: '26%',
                position: 'fixed'
              }
            }
          },
          click: (_record, modal, comp) => {
            // modal 为回传值，可自定义回传值

          }
        },
        {
          icon: 'delete',
          tooltip: '删除',
          type: 'del',
          // acl: {
          //   ability: ['company:hxnsrxx:delete']
          // },
          click: (record, _modal, comp) => {
            // this.http.post('hx/nsr/del', [record.UUID]).subscribe(resp => {
            //   if (resp.success) {
            //     this.msgSrv.success(`${resp.msg}`);
            //     comp!.removeRow(record);
            //   }
            //   else {
            //     this.msgSrv.error(resp.msg);
            //   };
            // });

          },
        },
      ]
    }
  ];

  // 请求配置
  companyReq: STReq = {
    type: 'page',
    method: 'GET',
    reName: {
      pi: 'pageNum',
      ps: 'pageSize'
    },

  };
  // response 配置
  companyRes: STRes = {
    process: (data: STData[], rawData?: any) => {
      this.total = rawData.data.count;
      return rawData.data.rows;
    }
  };

  constructor(private http: _HttpClient, private modal: ModalHelper) { }

  ngOnInit() { }

  add() {
    // this.modal
    //   .createStatic(FormEditComponent, { i: { id: 0 } })
    //   .subscribe(() => this.st.reload());
  }

}
