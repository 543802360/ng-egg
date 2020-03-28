import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AccountAccountSettingComponent } from './account-setting.component';

describe('AccountAccountSettingComponent', () => {
  let component: AccountAccountSettingComponent;
  let fixture: ComponentFixture<AccountAccountSettingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccountAccountSettingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountAccountSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
