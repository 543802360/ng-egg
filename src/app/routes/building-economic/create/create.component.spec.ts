import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BuildingEconomicCreateComponent } from './create.component';

describe('BuildingEconomicCreateComponent', () => {
  let component: BuildingEconomicCreateComponent;
  let fixture: ComponentFixture<BuildingEconomicCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BuildingEconomicCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BuildingEconomicCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
