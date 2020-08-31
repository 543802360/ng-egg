import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { EcoMapDotMapComponent } from './dot-map.component';

describe('EcoMapDotMapComponent', () => {
  let component: EcoMapDotMapComponent;
  let fixture: ComponentFixture<EcoMapDotMapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EcoMapDotMapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EcoMapDotMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
