import { BuildingEconomicCompanyEditComponent } from './../company/edit/edit.component';
import { Component, OnInit } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { BuildingEconomicCreateEditComponent } from '../create/edit/edit.component';

@Component({
  selector: 'app-building-economic-map',
  templateUrl: './map.component.html',
})
export class BuildingEconomicMapComponent implements OnInit {

  constructor(private http: _HttpClient, private modal: ModalHelper) { }

  ngOnInit() {
    console.log(' 楼与经济地图 init：');
  }

  add() {
    this.modal.createStatic(BuildingEconomicCompanyEditComponent, { record: {} });

  }

}
