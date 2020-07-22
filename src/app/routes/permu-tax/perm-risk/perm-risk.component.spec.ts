import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { PermuTaxPermRiskComponent } from './perm-risk.component';

describe('PermuTaxPermRiskComponent', () => {
  let component: PermuTaxPermRiskComponent;
  let fixture: ComponentFixture<PermuTaxPermRiskComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PermuTaxPermRiskComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PermuTaxPermRiskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
