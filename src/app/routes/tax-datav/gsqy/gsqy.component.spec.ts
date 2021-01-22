import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TaxDatavGsqyComponent } from './gsqy.component';

describe('TaxDatavGsqyComponent', () => {
  let component: TaxDatavGsqyComponent;
  let fixture: ComponentFixture<TaxDatavGsqyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TaxDatavGsqyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaxDatavGsqyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
