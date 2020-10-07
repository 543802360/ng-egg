import { Component, Input, OnInit } from '@angular/core';
import { dark_T as dark, decimal_T as decimal } from "../../../geo";

@Component({
  selector: 'app-mapbox-style-control',
  templateUrl: './mapbox-style-control.component.html',
  styles: [
  ]
})
export class MapboxStyleControlComponent implements OnInit {
  @Input() map: mapboxgl.Map;
  style;

  constructor() { }

  ngOnInit(): void {
  }
  ngModelChange(e) {
    switch (e) {
      case 'dark':
        this.map.setStyle(dark as any);
        break;
      case 'decimal':
        this.map.setStyle(decimal as any);

        break;

      default:
        break;
    }
  }

}
