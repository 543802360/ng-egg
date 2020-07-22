import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReportsBankingComponent } from './banking.component';

describe('ReportsBankingComponent', () => {
  let component: ReportsBankingComponent;
  let fixture: ComponentFixture<ReportsBankingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportsBankingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportsBankingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
