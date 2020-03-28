import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BuildingEconomicBuildingMapComponent } from './building-map.component';

describe('BuildingEconomicBuildingMapComponent', () => {
  let component: BuildingEconomicBuildingMapComponent;
  let fixture: ComponentFixture<BuildingEconomicBuildingMapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BuildingEconomicBuildingMapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BuildingEconomicBuildingMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
