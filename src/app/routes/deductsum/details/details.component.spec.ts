import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DeductsumDetailsComponent } from './details.component';

describe('DeductsumDetailsComponent', () => {
  let component: DeductsumDetailsComponent;
  let fixture: ComponentFixture<DeductsumDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeductsumDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeductsumDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
