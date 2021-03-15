import { Component, OnInit } from '@angular/core';
import { _HttpClient } from '@delon/theme';

@Component({
  selector: 'app-deductsum-tax-refund',
  templateUrl: './tax-refund.component.html',
})
export class DeductsumTaxRefundComponent implements OnInit {

  constructor(private http: _HttpClient) { }

  ngOnInit() { }

}
