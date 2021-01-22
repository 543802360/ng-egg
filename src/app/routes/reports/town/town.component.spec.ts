import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReportsTownComponent } from './town.component';

describe('ReportsTownComponent', () => {
  let component: ReportsTownComponent;
  let fixture: ComponentFixture<ReportsTownComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportsTownComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportsTownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
