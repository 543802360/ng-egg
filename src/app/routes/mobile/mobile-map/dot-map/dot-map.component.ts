import { Component, OnInit } from '@angular/core';
import { _HttpClient } from '@delon/theme';

@Component({
  selector: 'app-mobile-map-dot-map',
  templateUrl: './dot-map.component.html',
})
export class MobileMapDotMapComponent implements OnInit {

  constructor(private http: _HttpClient) { }

  ngOnInit() { }

}
