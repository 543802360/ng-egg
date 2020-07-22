import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReportsEnterpriseComponent } from './enterprise.component';

describe('ReportsEnterpriseComponent', () => {
  let component: ReportsEnterpriseComponent;
  let fixture: ComponentFixture<ReportsEnterpriseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportsEnterpriseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportsEnterpriseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
