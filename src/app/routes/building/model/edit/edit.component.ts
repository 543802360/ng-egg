import { IBuilding } from '@shared';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { NzMessageService } from 'ng-zorro-antd/message';
import { _HttpClient } from '@delon/theme';
import { SFSchema, SFUISchema } from '@delon/form';

@Component({
  selector: 'app-building-model-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.less']
})
export class BuildingModelEditComponent implements OnInit {
  record: IBuilding;
  i: IBuilding;
  schema: SFSchema = {
    properties: {
      building_name: {
        type: 'string',
        title: '楼宇名称'
      },
      building_address: {
        type: 'string',
        title: '楼宇地址'
      },
      building_floor: {
        type: 'number',
        title: '楼宇层数'
      },
      building_height: {
        type: 'number',
        title: '楼宇高度'
      },
      building_bz: {
        type: 'string',
        title: '备注'
      },
    },
    required: ['building_name', 'building_height'],
  };
  ui: SFUISchema = {
    '*': {
      spanLabelFixed: 100,
      grid: { span: 12 },
    },
    $building_name: {
      widget: 'string'
    },
    $building_address: {
      widget: 'string'
    },
    $building_height: {
      widget: 'number',
      unit: '米',
      grid: { span: 12 },
    },
    $building_floor: {
      widget: 'number',
      grid: { span: 12 },
    },
    $building_bz: {
      widget: 'textarea',
      grid: { span: 24 },
    },
  };

  constructor(
    private modal: NzModalRef,
    private msgSrv: NzMessageService,
    public http: _HttpClient,
  ) { }

  ngOnInit(): void {
    // console.log('edit init:', this.record);
    // if (this.record) {

    // } else {
    //   this.i = {}
    // }
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
