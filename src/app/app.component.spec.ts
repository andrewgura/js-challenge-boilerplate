import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AppComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
  });

  it('should return correct value if policyNumber is valid', () => {
    expect(component.isValidPolicyNumber(457500000)).toBeFalse();
    expect(component.isValidPolicyNumber(664371495)).toBeFalse();
    expect(component.isValidPolicyNumber(333333333)).toBeFalse();
    expect(component.isValidPolicyNumber(45750800)).toBeFalse();
    expect(component.isValidPolicyNumber(555555555)).toBeFalse();
    expect(component.isValidPolicyNumber(666666666)).toBeFalse();
    expect(component.isValidPolicyNumber(777777777)).toBeFalse();
    expect(component.isValidPolicyNumber(861100036)).toBeFalse();
    expect(component.isValidPolicyNumber(861100036)).toBeFalse();
    expect(component.isValidPolicyNumber(123456789)).toBeTrue();
    expect(component.isValidPolicyNumber(457508000)).toBeTrue();
  });
});
