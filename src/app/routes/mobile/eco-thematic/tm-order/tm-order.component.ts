import { Component, OnInit } from '@angular/core';
import { _HttpClient } from '@delon/theme';

@Component({
  selector: 'app-mobile-tm-order',
  templateUrl: './tm-order.component.html',
})
export class MobileTmOrderComponent implements OnInit {

  constructor(private http: _HttpClient) { }

  ngOnInit() { }

}
