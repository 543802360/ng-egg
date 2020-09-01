import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { EcoSummaryAllSummaryComponent } from './all-summary.component';

describe('EcoSummaryAllSummaryComponent', () => {
  let component: EcoSummaryAllSummaryComponent;
  let fixture: ComponentFixture<EcoSummaryAllSummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EcoSummaryAllSummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EcoSummaryAllSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
