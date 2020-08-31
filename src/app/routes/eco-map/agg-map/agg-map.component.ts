import { Component, OnInit } from '@angular/core';
import { _HttpClient } from '@delon/theme';

@Component({
  selector: 'app-eco-map-agg-map',
  templateUrl: './agg-map.component.html',
})
export class EcoMapAggMapComponent implements OnInit {

  constructor(private http: _HttpClient) { }

  ngOnInit() { }

}
