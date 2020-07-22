import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReportsFinanceAllComponent } from './finance-all.component';

describe('ReportsFinanceAllComponent', () => {
  let component: ReportsFinanceAllComponent;
  let fixture: ComponentFixture<ReportsFinanceAllComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportsFinanceAllComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportsFinanceAllComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
