import { IDjnsrxx } from '@shared';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { NzMessageService } from 'ng-zorro-antd/message';
import { _HttpClient } from '@delon/theme';
import { SFSchema, SFUISchema, SFNumberWidgetSchema } from '@delon/form';

@Component({
  selector: 'app-company-djnsrxx-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.less']

})
export class CompanyDjnsrxxEditComponent implements OnInit {
  record: IDjnsrxx = {};
  i: IDjnsrxx;
  schema: SFSchema = {
    properties: {
      NSRMC: {
        type: 'string',
        title: '纳税人名称',
        readOnly: true
      },
      NSRSBH: {
        type: 'string',
        title: '纳税人识别号',
        readOnly: true
      },
      SHXYDM: {
        type: 'string',
        title: '社会信用代码',
        readOnly: true
      },
      ZCDZ: {
        type: 'string',
        title: '注册地址',
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
        maximum: 100,
        minimum: 0,
        default: 100,
        ui: {
          unit: '%',
          optionalHelp: '此数值为该企业税收留在本辖区的比例',
          spanLabelFixed: 150
        }
      },

    },
    required: ['NSRMC', 'NSRSBH', 'SSFC'],
  };
  ui: SFUISchema = {
    '*': {
      spanLabelFixed: 120,
      grid: { span: 12 },
    }
  };

  constructor(
    private modal: NzModalRef,
    private msgSrv: NzMessageService,
    public http: _HttpClient,
  ) { }

  ngOnInit(): void {
    this.http.get(`nsr/${this.record.DJXH}`).subscribe(res => { this.i = res.data; console.log(this.i) });
  }

  save(value: any) {
    // 确认为本街道企业
    this.http.post('hx/nsr', [value]).subscribe(res => {
      if (res.success) {
        this.msgSrv.success(res.msg);
      } else {
        this.msgSrv.error(res.msg);

      }
      this.modal.close(true);
    });
  }

  close() {
    this.modal.destroy();
  }
}
