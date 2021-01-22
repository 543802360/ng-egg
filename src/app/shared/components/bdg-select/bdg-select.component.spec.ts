import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BdgSelectComponent } from './bdg-select.component';

describe('BudgetComponentsBdgSelectComponent', () => {
  let component: BdgSelectComponent;
  let fixture: ComponentFixture<BdgSelectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BdgSelectComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BdgSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
