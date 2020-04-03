import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AccountBaseComponent } from './base.component';

describe('AccountBaseComponent', () => {
  let component: AccountBaseComponent;
  let fixture: ComponentFixture<AccountBaseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccountBaseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountBaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
