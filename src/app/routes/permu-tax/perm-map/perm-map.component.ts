import { Component, OnInit } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { NzMessageService } from 'ng-zorro-antd';

@Component({
  selector: 'app-permu-tax-perm-map',
  templateUrl: './perm-map.component.html',
})
export class PermuTaxPermMapComponent implements OnInit {

  constructor(private http: _HttpClient, private msg: NzMessageService) { }

  ngOnInit() { }

}
