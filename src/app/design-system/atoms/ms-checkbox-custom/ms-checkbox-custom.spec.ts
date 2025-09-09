import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MsCheckboxCustomComponent } from './ms-checkbox-custom';
import { FormsModule, ReactiveFormsModule, FormControl } from '@angular/forms';

describe('MsCheckboxCustomComponent', () => {
  let component: MsCheckboxCustomComponent;
  let fixture: ComponentFixture<MsCheckboxCustomComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MsCheckboxCustomComponent, FormsModule, ReactiveFormsModule]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MsCheckboxCustomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have default properties', () => {
    expect(component.size).toBe('medium');
    expect(component.surface).toBe('default');
    expect(component.disabled).toBe(false);
    expect(component.error).toBe(false);
    expect(component.required).toBe(false);
    expect(component.indeterminate).toBe(false);
    expect(component.isChecked).toBe(false);
  });

  it('should apply correct host classes', () => {
    component.size = 'large';
    component.surface = 'dark';
    component.error = true;
    component.helperText = 'Helper text';
    
    const hostClasses = component.hostClasses;
    expect(hostClasses).toContain('ms-checkbox-custom');
    expect(hostClasses).toContain('ms-checkbox-custom--large');
    expect(hostClasses).toContain('ms-checkbox-custom--surface-dark');
    expect(hostClasses).toContain('ms-checkbox-custom--error');
    expect(hostClasses).toContain('ms-checkbox-custom--has-helper');
  });

  it('should toggle checked state on input change', () => {
    const inputElement = fixture.nativeElement.querySelector('input[type="checkbox"]');
    const changeEvent = new Event('change');
    
    spyOn(component.valueChange, 'emit');
    
    // Initially unchecked
    expect(component.isChecked).toBe(false);
    
    // Simulate checking
    inputElement.checked = true;
    component.onInputChange(changeEvent);
    
    expect(component.isChecked).toBe(true);
    expect(component.valueChange.emit).toHaveBeenCalledWith(true);
  });

  it('should not toggle when disabled', () => {
    component.disabled = true;
    const inputElement = fixture.nativeElement.querySelector('input[type="checkbox"]');
    const changeEvent = new Event('change');
    
    spyOn(component.valueChange, 'emit');
    
    inputElement.checked = true;
    component.onInputChange(changeEvent);
    
    expect(component.isChecked).toBe(false);
    expect(component.valueChange.emit).not.toHaveBeenCalled();
  });

  it('should handle indeterminate state', () => {
    component.indeterminate = true;
    component.ngOnInit();
    fixture.detectChanges();
    
    const inputElement = fixture.nativeElement.querySelector('input[type="checkbox"]');
    expect(inputElement.indeterminate).toBe(true);
  });

  it('should clear indeterminate state when toggled', () => {
    component.indeterminate = true;
    component.ngOnInit();
    
    const changeEvent = new Event('change');
    const inputElement = fixture.nativeElement.querySelector('input[type="checkbox"]');
    inputElement.checked = true;
    
    component.onInputChange(changeEvent);
    
    expect(component.indeterminate).toBe(false);
  });

  it('should implement ControlValueAccessor correctly', () => {
    // Test writeValue
    component.writeValue(true);
    expect(component.isChecked).toBe(true);
    
    component.writeValue(false);
    expect(component.isChecked).toBe(false);
    
    // Test registerOnChange
    let lastValue: boolean | undefined;
    component.registerOnChange((value: boolean) => {
      lastValue = value;
    });
    
    component.toggle();
    expect(lastValue).toBe(true);
    
    // Test registerOnTouched
    let touched = false;
    component.registerOnTouched(() => {
      touched = true;
    });
    
    component.onInputFocus();
    expect(touched).toBe(true);
    
    // Test setDisabledState
    component.setDisabledState(true);
    expect(component.disabled).toBe(true);
  });

  it('should show helper text when provided', () => {
    component.helperText = 'Test helper text';
    fixture.detectChanges();
    
    const helperElement = fixture.nativeElement.querySelector('ms-helper');
    expect(helperElement).toBeTruthy();
  });

  it('should not show helper text when not provided', () => {
    component.helperText = '';
    fixture.detectChanges();
    
    const helperElement = fixture.nativeElement.querySelector('ms-helper');
    expect(helperElement).toBeFalsy();
  });

  it('should show label when provided', () => {
    component.label = 'Test label';
    fixture.detectChanges();
    
    const labelElement = fixture.nativeElement.querySelector('.checkbox__label');
    expect(labelElement).toBeTruthy();
    expect(labelElement.textContent).toContain('Test label');
  });

  it('should apply disabled class when disabled', () => {
    component.disabled = true;
    fixture.detectChanges();
    
    const checkboxElement = fixture.nativeElement.querySelector('.ms-checkbox');
    expect(checkboxElement.classList.contains('ms-checkbox--disabled')).toBe(true);
  });

  it('should apply size classes correctly', () => {
    component.size = 'small';
    fixture.detectChanges();
    
    const checkboxElement = fixture.nativeElement.querySelector('.ms-checkbox');
    expect(checkboxElement.classList.contains('ms-checkbox--small')).toBe(true);
    
    component.size = 'large';
    fixture.detectChanges();
    
    expect(checkboxElement.classList.contains('ms-checkbox--large')).toBe(true);
    expect(checkboxElement.classList.contains('ms-checkbox--small')).toBe(false);
  });

  it('should work with reactive forms', () => {
    const formControl = new FormControl(false);
    
    // Simulate FormControl binding
    component.writeValue(!!formControl.value);
    component.registerOnChange((value) => formControl.setValue(value));
    component.registerOnTouched(() => formControl.markAsTouched());
    
    expect(component.isChecked).toBe(false);
    
    // Simulate user interaction
    component.toggle();
    
    expect(formControl.value).toBe(true);
  });

  it('should handle public toggle method', () => {
    spyOn(component.valueChange, 'emit');
    
    expect(component.isChecked).toBe(false);
    
    component.toggle();
    
    expect(component.isChecked).toBe(true);
    expect(component.valueChange.emit).toHaveBeenCalledWith(true);
    
    component.toggle();
    
    expect(component.isChecked).toBe(false);
    expect(component.valueChange.emit).toHaveBeenCalledWith(false);
  });

  it('should not toggle when disabled via toggle method', () => {
    component.disabled = true;
    spyOn(component.valueChange, 'emit');
    
    component.toggle();
    
    expect(component.isChecked).toBe(false);
    expect(component.valueChange.emit).not.toHaveBeenCalled();
  });
}); 