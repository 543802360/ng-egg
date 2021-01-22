import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { EnterpriseGroupMapComponent } from './map.component';

describe('EnterpriseGroupMapComponent', () => {
  let component: EnterpriseGroupMapComponent;
  let fixture: ComponentFixture<EnterpriseGroupMapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EnterpriseGroupMapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EnterpriseGroupMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
