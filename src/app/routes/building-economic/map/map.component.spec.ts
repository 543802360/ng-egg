import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BuildingEconomicMapComponent } from './map.component';

describe('BuildingEconomicMapComponent', () => {
  let component: BuildingEconomicMapComponent;
  let fixture: ComponentFixture<BuildingEconomicMapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BuildingEconomicMapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BuildingEconomicMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
