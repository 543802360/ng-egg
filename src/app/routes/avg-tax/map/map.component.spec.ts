import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AvgTaxMapComponent } from './map.component';

describe('AvgTaxMapComponent', () => {
  let component: AvgTaxMapComponent;
  let fixture: ComponentFixture<AvgTaxMapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AvgTaxMapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AvgTaxMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
