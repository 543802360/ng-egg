import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AccountAccountSettingBaseComponent } from './account-setting-base.component';

describe('AccountAccountSettingBaseComponent', () => {
  let component: AccountAccountSettingBaseComponent;
  let fixture: ComponentFixture<AccountAccountSettingBaseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccountAccountSettingBaseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountAccountSettingBaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
