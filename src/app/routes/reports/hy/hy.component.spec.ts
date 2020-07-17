import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReportsHyComponent } from './hy.component';

describe('ReportsHyComponent', () => {
  let component: ReportsHyComponent;
  let fixture: ComponentFixture<ReportsHyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportsHyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportsHyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
