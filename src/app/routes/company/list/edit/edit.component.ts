import { Component, OnInit, ViewChild } from '@angular/core';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { NzMessageService } from 'ng-zorro-antd/message';
import { _HttpClient } from '@delon/theme';
import { SFSchema, SFUISchema } from '@delon/form';
import { IDjnsrxx, array2tree } from '@shared';
import { map } from 'rxjs/operators';
import { CacheService } from '@delon/cache';

@Component({
  selector: 'app-company-list-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.less']

})
export class CompanyListEditComponent implements OnInit {
  record: IDjnsrxx = {};
  i: IDjnsrxx;
  schema: SFSchema = {
    properties: {
      NSRMC: {
        type: 'string',
        title: '纳税人名称'
      },
      NSRSBH: {
        type: 'string',
        title: '纳税人识别号'
      },
      SHXYDM: {
        type: 'string',
        title: '社会信用代码'
      },
      LXR: {
        type: 'string',
        title: '联系人'
      },
      LXDH: {
        type: 'string',
        title: '联系电话'
      },
      SSFC: {
        type: 'number',
        title: '税收留存比例',
        default: 100,
        minimum: 0,
        maximum: 100
      },
      JDXZ_DM: {
        type: 'string',
        title: '镇街',
        enum: this.cacheSrv.get('departments', { mode: 'none' })
      },
      ZCDZ: { type: 'string', title: '注册地址' },
      BZ: { type: 'string', title: '备注' }
    },
    required: ['NSRMC', 'NSRSBH', 'SSFC'],
  };
  ui: SFUISchema = {
    '*': {
      spanLabelFixed: 100,
      grid: { span: 8, gutter: 16 },
    },
    $NSRMC: {
      widget: 'string'
    },
    $NSRSBH: {
      widget: 'string'
    },
    $SHXYDM: {
      widget: 'string'
    },
    $LXR: {
      widget: 'string'
    },
    $LXDH: {
      widget: 'string'
    },
    $SSFC: {
      widget: 'number',
      unit: '%',
      optionalHelp: '此数值为该企业税收在本辖区的留存比例',
      spanLabelFixed: 150
    },
    $JDXZ_DM: {
      widget: 'tree-select',
      checkable: false,
      showLine: false,
      allowClear: true,
      dropdownStyle: {
        'max-height': '300px'
      },
      grid: {
        span: 12
      }
    },
    $ZCDZ: {
      widget: 'string',
      grid: {
        span: 12
      }
    },
    $BZ: {
      widget: 'textarea',
      grid: {
        span: 24
      }
    }
  };

  constructor(
    private cacheSrv: CacheService,
    private modal: NzModalRef,
    private msgSrv: NzMessageService,
    public http: _HttpClient,
  ) { }

  ngOnInit(): void {
    if (this.record) {
      this.http.get(`hx/nsr/show`, { id: this.record.UUID }).subscribe(res => (this.i = res.data))
    } else {
      this.i = {};
      this.record = {};
    }
  }


  /**
   * 保存
   * @param value
   */
  save(value: any) {
    if (this.record.UUID) {
      // 更新
      this.http.put(`hx/nsr/${this.record.UUID}`, value).subscribe(res => {
        if (res.success) {
          this.msgSrv.success(res.msg);
        } else {
          this.msgSrv.error(res.msg);
        }
        this.modal.close(true);
      });
    } else {
      // 创建
      this.http.post('hx/nsr', [value]).subscribe(res => {
        if (res.success) {
          this.msgSrv.success(res.msg);
        } else {
          this.msgSrv.error(res.msg);
        }
        this.modal.close(true);
      });
    }

  }

  close() {
    this.modal.destroy();
  }
}
