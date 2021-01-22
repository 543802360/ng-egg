import { Component, OnInit } from '@angular/core';
import { _HttpClient } from '@delon/theme';

@Component({
  selector: 'app-building-map',
  templateUrl: './map.component.html',
})
export class BuildingMapComponent implements OnInit {

  constructor(private http: _HttpClient) { }

  ngOnInit() { }

}
