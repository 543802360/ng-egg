import { Component, OnInit } from '@angular/core';
import { _HttpClient } from '@delon/theme';

@Component({
  selector: 'app-eco-map-dot-map',
  templateUrl: './dot-map.component.html',
})
export class EcoMapDotMapComponent implements OnInit {

  constructor(private http: _HttpClient) { }

  ngOnInit() { }

}
