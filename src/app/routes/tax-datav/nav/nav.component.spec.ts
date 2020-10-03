import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TaxDatavNavComponent } from './nav.component';

describe('TaxDatavNavComponent', () => {
  let component: TaxDatavNavComponent;
  let fixture: ComponentFixture<TaxDatavNavComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TaxDatavNavComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaxDatavNavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
