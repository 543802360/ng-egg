import { Component, OnInit } from '@angular/core';
import { _HttpClient } from '@delon/theme';

@Component({
  selector: 'app-deductsum-details',
  templateUrl: './details.component.html',
})
export class DeductsumDetailsComponent implements OnInit {

  constructor(private http: _HttpClient) { }

  ngOnInit() { }

}
