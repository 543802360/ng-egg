import { Component, OnInit } from '@angular/core';
import { _HttpClient } from '@delon/theme';

@Component({
  selector: 'app-tax-datav-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.less']
})
export class TaxDatavNavComponent implements OnInit {

  constructor(private http: _HttpClient) { }

  ngOnInit() { }

}
