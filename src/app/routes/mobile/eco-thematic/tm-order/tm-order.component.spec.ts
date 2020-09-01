import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MobileTmOrderComponent } from './tm-order.component';

describe('MobileTmOrderComponent', () => {
  let component: MobileTmOrderComponent;
  let fixture: ComponentFixture<MobileTmOrderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MobileTmOrderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MobileTmOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
