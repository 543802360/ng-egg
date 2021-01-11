import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MobileDrawerConditionComponent } from './drawer-condition.component';

describe('MobileDrawerConditionComponent', () => {
  let component: MobileDrawerConditionComponent;
  let fixture: ComponentFixture<MobileDrawerConditionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MobileDrawerConditionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MobileDrawerConditionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
