import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MobileTmBigEnterpriseComponent } from './tm-big-enterprise.component';

describe('MobileTmBigEnterpriseComponent', () => {
  let component: MobileTmBigEnterpriseComponent;
  let fixture: ComponentFixture<MobileTmBigEnterpriseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MobileTmBigEnterpriseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MobileTmBigEnterpriseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
