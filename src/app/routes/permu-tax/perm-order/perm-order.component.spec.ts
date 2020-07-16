import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { PermuTaxPermOrderComponent } from './perm-order.component';

describe('PermuTaxPermOrderComponent', () => {
  let component: PermuTaxPermOrderComponent;
  let fixture: ComponentFixture<PermuTaxPermOrderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PermuTaxPermOrderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PermuTaxPermOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
