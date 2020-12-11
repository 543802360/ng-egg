import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { EcoSummaryInvoiceSummaryComponent } from './invoice-summary.component';

describe('EcoSummaryInvoiceSummaryComponent', () => {
  let component: EcoSummaryInvoiceSummaryComponent;
  let fixture: ComponentFixture<EcoSummaryInvoiceSummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EcoSummaryInvoiceSummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EcoSummaryInvoiceSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
