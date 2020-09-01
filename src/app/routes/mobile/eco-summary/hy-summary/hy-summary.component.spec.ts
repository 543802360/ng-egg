import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { EcoSummaryHySummaryComponent } from './hy-summary.component';

describe('EcoSummaryHySummaryComponent', () => {
  let component: EcoSummaryHySummaryComponent;
  let fixture: ComponentFixture<EcoSummaryHySummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EcoSummaryHySummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EcoSummaryHySummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
