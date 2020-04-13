import { Component, OnInit } from '@angular/core';
import { _HttpClient } from '@delon/theme';

@Component({
  selector: 'app-building-economic-create',
  templateUrl: './create.component.html',
})
export class BuildingEconomicCreateComponent implements OnInit {

  constructor(private http: _HttpClient) { }

  ngOnInit() { }

}
