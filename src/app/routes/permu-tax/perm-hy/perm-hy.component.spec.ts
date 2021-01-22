import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { PermuTaxPermHyComponent } from './perm-hy.component';

describe('PermuTaxPermHyComponent', () => {
  let component: PermuTaxPermHyComponent;
  let fixture: ComponentFixture<PermuTaxPermHyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PermuTaxPermHyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PermuTaxPermHyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
