import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AccountAccountSettingSecurityComponent } from './account-setting-security.component';

describe('AccountAccountSettingSecurityComponent', () => {
  let component: AccountAccountSettingSecurityComponent;
  let fixture: ComponentFixture<AccountAccountSettingSecurityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccountAccountSettingSecurityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountAccountSettingSecurityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
