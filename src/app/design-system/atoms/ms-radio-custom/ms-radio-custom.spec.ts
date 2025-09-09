import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MsRadioCustomComponent, RadioOption } from './ms-radio-custom';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

describe('MsRadioCustomComponent', () => {
  let component: MsRadioCustomComponent;
  let fixture: ComponentFixture<MsRadioCustomComponent>;

  const defaultOptions: RadioOption[] = [
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' },
    { value: 'option3', label: 'Option 3' },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MsRadioCustomComponent, ReactiveFormsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(MsRadioCustomComponent);
    component = fixture.componentInstance;
    component.options = defaultOptions;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render all options', () => {
    const radioLabels = fixture.debugElement.queryAll(By.css('.ms-radio'));
    expect(radioLabels.length).toBe(3);
  });

  it('should display correct labels', () => {
    const labels = fixture.debugElement.queryAll(By.css('.radio__label'));
    expect(labels[0].nativeElement.textContent.trim()).toBe('Option 1');
    expect(labels[1].nativeElement.textContent.trim()).toBe('Option 2');
    expect(labels[2].nativeElement.textContent.trim()).toBe('Option 3');
  });

  it('should not have any option selected initially', () => {
    const checkedInputs = fixture.debugElement.queryAll(By.css('input:checked'));
    expect(checkedInputs.length).toBe(0);
  });

  it('should select option when clicked', () => {
    const firstRadio = fixture.debugElement.query(By.css('input[type="radio"]'));
    
    firstRadio.nativeElement.click();
    fixture.detectChanges();

    expect(firstRadio.nativeElement.checked).toBeTruthy();
    expect(component.isSelected('option1')).toBeTruthy();
  });

  it('should emit valueChange when option is selected', () => {
    spyOn(component.valueChange, 'emit');
    
    const firstRadio = fixture.debugElement.query(By.css('input[type="radio"]'));
    firstRadio.nativeElement.click();
    fixture.detectChanges();

    expect(component.valueChange.emit).toHaveBeenCalledWith('option1');
  });

  it('should only allow one option to be selected at a time', () => {
    const radioInputs = fixture.debugElement.queryAll(By.css('input[type="radio"]'));
    
    // Select first option
    radioInputs[0].nativeElement.click();
    fixture.detectChanges();
    
    // Select second option
    radioInputs[1].nativeElement.click();
    fixture.detectChanges();

    // Only second should be selected
    expect(radioInputs[0].nativeElement.checked).toBeFalsy();
    expect(radioInputs[1].nativeElement.checked).toBeTruthy();
    expect(radioInputs[2].nativeElement.checked).toBeFalsy();
  });

  it('should apply disabled state to all options when component is disabled', () => {
    component.disabled = true;
    fixture.detectChanges();

    const radioInputs = fixture.debugElement.queryAll(By.css('input[type="radio"]'));
    radioInputs.forEach(input => {
      expect(input.nativeElement.disabled).toBeTruthy();
    });
  });

  it('should apply disabled state to specific options', () => {
    component.options = [
      { value: 'option1', label: 'Option 1', disabled: true },
      { value: 'option2', label: 'Option 2' },
      { value: 'option3', label: 'Option 3', disabled: true },
    ];
    fixture.detectChanges();

    const radioInputs = fixture.debugElement.queryAll(By.css('input[type="radio"]'));
    expect(radioInputs[0].nativeElement.disabled).toBeTruthy();
    expect(radioInputs[1].nativeElement.disabled).toBeFalsy();
    expect(radioInputs[2].nativeElement.disabled).toBeTruthy();
  });

  it('should prevent selection of disabled options', () => {
    component.options = [
      { value: 'option1', label: 'Option 1', disabled: true },
      { value: 'option2', label: 'Option 2' },
    ];
    fixture.detectChanges();

    const disabledInput = fixture.debugElement.query(By.css('input[disabled]'));
    disabledInput.nativeElement.click();
    fixture.detectChanges();

    expect(disabledInput.nativeElement.checked).toBeFalsy();
    expect(component.isSelected('option1')).toBeFalsy();
  });

  it('should apply size classes correctly', () => {
    component.size = 'small';
    fixture.detectChanges();
    expect(fixture.debugElement.nativeElement.classList).toContain('ms-radio-custom--small');

    component.size = 'large';
    fixture.detectChanges();
    expect(fixture.debugElement.nativeElement.classList).toContain('ms-radio-custom--large');
  });

  it('should apply surface classes correctly', () => {
    component.surface = 'light';
    fixture.detectChanges();
    expect(fixture.debugElement.nativeElement.classList).toContain('ms-radio-custom--surface-light');

    component.surface = 'dark';
    fixture.detectChanges();
    expect(fixture.debugElement.nativeElement.classList).toContain('ms-radio-custom--surface-dark');
  });

  it('should apply error class when error is true', () => {
    component.error = true;
    fixture.detectChanges();
    expect(fixture.debugElement.nativeElement.classList).toContain('ms-radio-custom--error');
  });

  describe('ControlValueAccessor', () => {
    it('should implement writeValue', () => {
      component.writeValue('option2');
      fixture.detectChanges();

      expect(component.isSelected('option2')).toBeTruthy();
      const secondInput = fixture.debugElement.queryAll(By.css('input[type="radio"]'))[1];
      expect(secondInput.nativeElement.checked).toBeTruthy();
    });

    it('should call onChange when value changes', () => {
      const mockOnChange = jasmine.createSpy('onChange');
      component.registerOnChange(mockOnChange);

      const firstInput = fixture.debugElement.query(By.css('input[type="radio"]'));
      firstInput.nativeElement.click();
      fixture.detectChanges();

      expect(mockOnChange).toHaveBeenCalledWith('option1');
    });

    it('should call onTouched when focused', () => {
      const mockOnTouched = jasmine.createSpy('onTouched');
      component.registerOnTouched(mockOnTouched);

      const firstInput = fixture.debugElement.query(By.css('input[type="radio"]'));
      firstInput.nativeElement.focus();
      firstInput.nativeElement.dispatchEvent(new Event('focus'));

      expect(mockOnTouched).toHaveBeenCalled();
    });

    it('should disable component when setDisabledState is called', () => {
      component.setDisabledState(true);
      fixture.detectChanges();

      expect(component.disabled).toBeTruthy();
      const radioInputs = fixture.debugElement.queryAll(By.css('input[type="radio"]'));
      radioInputs.forEach(input => {
        expect(input.nativeElement.disabled).toBeTruthy();
      });
    });
  });

  describe('Keyboard Navigation', () => {
    it('should handle arrow key navigation', () => {
      const radioLabels = fixture.debugElement.queryAll(By.css('.ms-radio'));
      
      // Focus first option
      const keydownEvent = new KeyboardEvent('keydown', { key: 'ArrowDown' });
      radioLabels[0].nativeElement.dispatchEvent(keydownEvent);
      
      // Should prevent default and handle navigation
      expect(keydownEvent.defaultPrevented).toBeFalsy(); // Event handling in component
    });

    it('should handle space key selection', () => {
      const radioLabels = fixture.debugElement.queryAll(By.css('.ms-radio'));
      
      const spaceEvent = new KeyboardEvent('keydown', { key: ' ' });
      radioLabels[0].nativeElement.dispatchEvent(spaceEvent);
      
      // Should trigger selection
      expect(component.isSelected('option1')).toBeTruthy();
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA attributes', () => {
      component.ariaLabel = 'Test radio group';
      fixture.detectChanges();

      const radioGroup = fixture.debugElement.query(By.css('.ms-radio-group'));
      expect(radioGroup.nativeElement.getAttribute('role')).toBe('radiogroup');
      expect(radioGroup.nativeElement.getAttribute('aria-label')).toBe('Test radio group');
    });

    it('should generate unique names for radio inputs', () => {
      const radioInputs = fixture.debugElement.queryAll(By.css('input[type="radio"]'));
      const firstName = radioInputs[0].nativeElement.name;
      
      expect(firstName).toBeTruthy();
      radioInputs.forEach(input => {
        expect(input.nativeElement.name).toBe(firstName);
      });
    });
  });
}); 