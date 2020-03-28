import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BuildingEconomicCreateBuildingComponent } from './create-building.component';

describe('BuildingEconomicCreateBuildingComponent', () => {
  let component: BuildingEconomicCreateBuildingComponent;
  let fixture: ComponentFixture<BuildingEconomicCreateBuildingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BuildingEconomicCreateBuildingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BuildingEconomicCreateBuildingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
