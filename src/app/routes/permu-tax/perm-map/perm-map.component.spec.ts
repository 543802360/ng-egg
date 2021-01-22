import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { PermuTaxPermMapComponent } from './perm-map.component';

describe('PermuTaxPermMapComponent', () => {
  let component: PermuTaxPermMapComponent;
  let fixture: ComponentFixture<PermuTaxPermMapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PermuTaxPermMapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PermuTaxPermMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
