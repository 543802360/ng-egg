import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { EnterpriseGroupZgsListComponent } from './zgs-list.component';

describe('EnterpriseGroupZgsListComponent', () => {
  let component: EnterpriseGroupZgsListComponent;
  let fixture: ComponentFixture<EnterpriseGroupZgsListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EnterpriseGroupZgsListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EnterpriseGroupZgsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
