import { Component, OnInit, ViewChild } from '@angular/core';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { NzMessageService } from 'ng-zorro-antd/message';
import { _HttpClient } from '@delon/theme';
import { SFSchema, SFUISchema } from '@delon/form';
import { CacheService } from '@delon/cache';

@Component({
  selector: 'app-company-djnsrxx-add',
  templateUrl: './add.component.html',
})
export class CompanyDjnsrxxAddComponent implements OnInit {

  i: any;
  schema: SFSchema = {
    properties: {
      JDXZ_DM: {
        type: 'string',
        title: '镇街',
        enum: this.cacheSrv.get('departments', { mode: 'none' })
      },
      SSFC: {
        type: 'number',
        title: '税收留存比例',
        maximum: 100,
        minimum: 0,
        default: 100,
        ui: {
          unit: '%',
          optionalHelp: '此数值为该企业税收留存比例',
          spanLabelFixed: 150
        }
      },
    },
    required: ['SSFC', 'JDXZ_DM'],
  };
  ui: SFUISchema = {
    '*': {
      spanLabelFixed: 100,
      grid: { span: 12 },
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
    }
  };

  constructor(
    private cacheSrv: CacheService,
    private modal: NzModalRef,
    private msgSrv: NzMessageService,
    public http: _HttpClient,
  ) { }

  ngOnInit(): void {

  }

  save(value: any) {
    this.modal.close(value);
  }

  close() {
    this.modal.destroy();
  }
}
