import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { EconomicAnalysisMapTaxAggMapComponent } from './tax-agg-map.component';

describe('EconomicAnalysisMapTaxAggMapComponent', () => {
  let component: EconomicAnalysisMapTaxAggMapComponent;
  let fixture: ComponentFixture<EconomicAnalysisMapTaxAggMapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EconomicAnalysisMapTaxAggMapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EconomicAnalysisMapTaxAggMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
