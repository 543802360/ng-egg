import { Component, OnInit } from '@angular/core';
import { _HttpClient } from '@delon/theme';

@Component({
  selector: 'app-mobile-tm-nav',
  templateUrl: './tm-nav.component.html',
  styleUrls: ['./tm-nav.component.less']
})
export class MobileTmNavComponent implements OnInit {

  constructor(private http: _HttpClient) { }

  ngOnInit() { }

}
