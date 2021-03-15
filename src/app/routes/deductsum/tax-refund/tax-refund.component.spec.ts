import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DeductsumTaxRefundComponent } from './tax-refund.component';

describe('DeductsumTaxRefundComponent', () => {
  let component: DeductsumTaxRefundComponent;
  let fixture: ComponentFixture<DeductsumTaxRefundComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeductsumTaxRefundComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeductsumTaxRefundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
