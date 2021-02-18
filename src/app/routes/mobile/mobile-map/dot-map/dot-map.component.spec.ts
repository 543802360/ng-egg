import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MobileMapDotMapComponent } from './dot-map.component';

describe('MobileMapDotMapComponent', () => {
  let component: MobileMapDotMapComponent;
  let fixture: ComponentFixture<MobileMapDotMapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MobileMapDotMapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MobileMapDotMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
