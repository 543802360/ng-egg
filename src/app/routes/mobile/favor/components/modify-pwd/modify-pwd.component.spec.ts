import { fakeAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { ModifyPwdComponent } from './modify-pwd.component';

describe('ModifyPwdComponent', () => {
  let component: ModifyPwdComponent;
  let fixture: ComponentFixture<ModifyPwdComponent>;

  beforeEach(fakeAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ModifyPwdComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModifyPwdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should compile', () => {
    expect(component).toBeTruthy();
  });
});
