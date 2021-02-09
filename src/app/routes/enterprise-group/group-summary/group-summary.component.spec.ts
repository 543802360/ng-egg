import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { EnterpriseGroupGroupSummaryComponent } from './group-summary.component';

describe('EnterpriseGroupGroupSummaryComponent', () => {
  let component: EnterpriseGroupGroupSummaryComponent;
  let fixture: ComponentFixture<EnterpriseGroupGroupSummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EnterpriseGroupGroupSummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EnterpriseGroupGroupSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
