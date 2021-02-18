import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MobileMapJdxzMapComponent } from './jdxz-map.component';

describe('MobileMapJdxzMapComponent', () => {
  let component: MobileMapJdxzMapComponent;
  let fixture: ComponentFixture<MobileMapJdxzMapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MobileMapJdxzMapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MobileMapJdxzMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
