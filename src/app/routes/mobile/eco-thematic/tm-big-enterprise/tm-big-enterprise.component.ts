import { Component, OnInit } from '@angular/core';
import { _HttpClient } from '@delon/theme';

@Component({
  selector: 'app-mobile-tm-big-enterprise',
  templateUrl: './tm-big-enterprise.component.html',
})
export class MobileTmBigEnterpriseComponent implements OnInit {

  constructor(private http: _HttpClient) { }

  ngOnInit() { }

}
