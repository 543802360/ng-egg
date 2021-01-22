import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { EnterpriseGroupDetailComponent } from './detail.component';

describe('EnterpriseGroupDetailComponent', () => {
  let component: EnterpriseGroupDetailComponent;
  let fixture: ComponentFixture<EnterpriseGroupDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EnterpriseGroupDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EnterpriseGroupDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
