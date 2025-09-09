import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MsHelperComponent } from './ms-helper';

describe('MsHelperComponent', () => {
  let component: MsHelperComponent;
  let fixture: ComponentFixture<MsHelperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MsHelperComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MsHelperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have default surface as "default"', () => {
    expect(component.surface).toBe('default');
  });

  it('should have default state as "regular"', () => {
    expect(component.state).toBe('regular');
  });

  it('should apply correct host classes', () => {
    component.surface = 'light';
    component.state = 'error';
    
    const hostClasses = component.hostClasses;
    expect(hostClasses).toContain('ms-helper-wrapper');
    expect(hostClasses).toContain('ms-helper-wrapper--light');
    expect(hostClasses).toContain('ms-helper-wrapper--error');
  });

  it('should render content projected into helper text', () => {
    fixture.detectChanges();
    
    const compiled = fixture.nativeElement as HTMLElement;
    const textElement = compiled.querySelector('.ms-helper__text');
    expect(textElement).toBeTruthy();
  });

  it('should have info icon', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const iconElement = compiled.querySelector('.ms-helper__icon svg');
    expect(iconElement).toBeTruthy();
    expect(iconElement?.getAttribute('width')).toBe('14');
    expect(iconElement?.getAttribute('height')).toBe('14');
  });

  it('should apply error class when state is error', () => {
    component.state = 'error';
    fixture.detectChanges();
    
    const compiled = fixture.nativeElement as HTMLElement;
    const helperElement = compiled.querySelector('.ms-helper');
    expect(helperElement?.classList.contains('ms-helper--error')).toBeTruthy();
  });

  it('should apply surface classes correctly', () => {
    component.surface = 'dark';
    fixture.detectChanges();
    
    const compiled = fixture.nativeElement as HTMLElement;
    const helperElement = compiled.querySelector('.ms-helper');
    expect(helperElement?.classList.contains('ms-helper--surface-dark')).toBeTruthy();
  });
}); 