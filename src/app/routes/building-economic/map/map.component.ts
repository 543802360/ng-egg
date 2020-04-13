import { Component, OnInit } from '@angular/core';
import { _HttpClient } from '@delon/theme';

@Component({
  selector: 'app-building-economic-map',
  templateUrl: './map.component.html',
})
export class BuildingEconomicMapComponent implements OnInit {

  constructor(private http: _HttpClient) { }

  ngOnInit() { }

}
