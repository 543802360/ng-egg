import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { EcoSummaryZsxmSummaryComponent } from './zsxm-summary.component';

describe('EcoSummaryZsxmSummaryComponent', () => {
  let component: EcoSummaryZsxmSummaryComponent;
  let fixture: ComponentFixture<EcoSummaryZsxmSummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EcoSummaryZsxmSummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EcoSummaryZsxmSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
