import { Component, OnInit } from '@angular/core';
import { _HttpClient } from '@delon/theme';

@Component({
  selector: 'app-building-economic-building-map',
  templateUrl: './building-map.component.html',
})
export class BuildingEconomicBuildingMapComponent implements OnInit {

  constructor(private http: _HttpClient) { }

  ngOnInit() { }

}
