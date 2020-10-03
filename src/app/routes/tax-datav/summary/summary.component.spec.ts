import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TaxDatavSummaryComponent } from './summary.component';

describe('TaxDatavSummaryComponent', () => {
  let component: TaxDatavSummaryComponent;
  let fixture: ComponentFixture<TaxDatavSummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TaxDatavSummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaxDatavSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
