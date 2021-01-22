import { Component, OnInit } from '@angular/core';
import { _HttpClient } from '@delon/theme';

@Component({
  selector: 'app-enterprise-group-map',
  templateUrl: './map.component.html',
})
export class EnterpriseGroupMapComponent implements OnInit {

  constructor(private http: _HttpClient) { }

  ngOnInit() { }

}
