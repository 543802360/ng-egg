import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { EconomicAnalysisQybtqTopnComponent } from './qybtq-topn.component';

describe('EconomicAnalysisQybtqTopnComponent', () => {
  let component: EconomicAnalysisQybtqTopnComponent;
  let fixture: ComponentFixture<EconomicAnalysisQybtqTopnComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EconomicAnalysisQybtqTopnComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EconomicAnalysisQybtqTopnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
