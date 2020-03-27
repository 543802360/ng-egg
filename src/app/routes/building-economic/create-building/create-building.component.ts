import { Component, OnInit } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import * as dark from "../../geo/styles/dark.json";
@Component({
  selector: 'app-building-economic-create-building',
  templateUrl: './create-building.component.html',
  styleUrls: ['./create-building.component.less']
})
export class BuildingEconomicCreateBuildingComponent implements OnInit {
  style;
  center;
  zoom;
  constructor(private http: _HttpClient) { }

  ngOnInit() {
    console.log(dark);
    this.style = (dark as any).default;
  }

}
