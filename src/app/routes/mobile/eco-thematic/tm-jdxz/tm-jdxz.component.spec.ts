import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MobileTmJdxzComponent } from './tm-jdxz.component';

describe('MobileTmJdxzComponent', () => {
  let component: MobileTmJdxzComponent;
  let fixture: ComponentFixture<MobileTmJdxzComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MobileTmJdxzComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MobileTmJdxzComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
