import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { EconomicAnalysisMapTaxDotMapComponent } from './tax-dot-map.component';

describe('EconomicAnalysisMapTaxDotMapComponent', () => {
  let component: EconomicAnalysisMapTaxDotMapComponent;
  let fixture: ComponentFixture<EconomicAnalysisMapTaxDotMapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EconomicAnalysisMapTaxDotMapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EconomicAnalysisMapTaxDotMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
