import { Component, OnInit } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import * as dark from "../../geo/styles/dark.json";
@Component({
  selector: 'app-building-economic-create-building',
  templateUrl: './create-building.component.html',
})
export class BuildingEconomicCreateBuildingComponent implements OnInit {
  style;
  center;
  zoom;
  constructor(private http: _HttpClient) { }

  ngOnInit() {
    this.style = dark;
  }

}
