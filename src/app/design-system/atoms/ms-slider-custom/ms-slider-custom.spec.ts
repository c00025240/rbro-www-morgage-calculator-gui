import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { MsSliderCustomComponent } from './ms-slider-custom';

describe('MsSliderCustomComponent', () => {
  let component: MsSliderCustomComponent;
  let fixture: ComponentFixture<MsSliderCustomComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MsSliderCustomComponent, ReactiveFormsModule]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MsSliderCustomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Basic Properties', () => {
    it('should have default values', () => {
      expect(component.min).toBe(0);
      expect(component.max).toBe(100);
      expect(component.step).toBe(1);
      expect(component.surface).toBe('default');
      expect(component.disabled).toBe(false);
      expect(component.error).toBe(false);
      expect(component.showValue).toBe(true);
      expect(component.alwaysShowValue).toBe(false);
      expect(component.showMinMax).toBe(false);
    });

    it('should accept input properties', () => {
      component.min = 10;
      component.max = 50;
      component.step = 5;
      component.surface = 'dark';
      component.disabled = true;
      component.error = true;
      component.label = 'Test Slider';
      component.helperText = 'Helper text';
      
      fixture.detectChanges();
      
      expect(component.min).toBe(10);
      expect(component.max).toBe(50);
      expect(component.step).toBe(5);
      expect(component.surface).toBe('dark');
      expect(component.disabled).toBe(true);
      expect(component.error).toBe(true);
      expect(component.label).toBe('Test Slider');
      expect(component.helperText).toBe('Helper text');
    });
  });

  describe('Value Handling', () => {
    it('should set and get value correctly', () => {
      component.value = 50;
      expect(component.value).toBe(50);
    });

    it('should clamp value within min/max bounds', () => {
      component.min = 0;
      component.max = 100;
      
      component.value = -10;
      expect(component.value).toBe(0);
      
      component.value = 150;
      expect(component.value).toBe(100);
    });

    it('should round value to step increments', () => {
      component.min = 0;
      component.max = 100;
      component.step = 5;
      
      component.value = 23;
      expect(component.value).toBe(25);
      
      component.value = 27;
      expect(component.value).toBe(25);
    });

    it('should calculate progress percentage correctly', () => {
      component.min = 0;
      component.max = 100;
      component.value = 25;
      
      expect(component.progressPercentage).toBe(25);
      
      component.min = 10;
      component.max = 20;
      component.value = 15;
      
      expect(component.progressPercentage).toBe(50);
    });

    it('should handle edge case when min equals max', () => {
      component.min = 50;
      component.max = 50;
      component.value = 50;
      
      expect(component.progressPercentage).toBe(0);
    });
  });

  describe('ControlValueAccessor', () => {
    it('should implement ControlValueAccessor correctly', () => {
      const onChange = jasmine.createSpy('onChange');
      const onTouched = jasmine.createSpy('onTouched');
      
      component.registerOnChange(onChange);
      component.registerOnTouched(onTouched);
      
      component.value = 75;
      expect(onChange).toHaveBeenCalledWith(75);
    });

    it('should update value via writeValue', () => {
      component.writeValue(40);
      expect(component.value).toBe(40);
    });

    it('should handle null value in writeValue', () => {
      component.writeValue(null as any);
      expect(component.value).toBe(0);
    });

    it('should set disabled state', () => {
      component.setDisabledState(true);
      expect(component.disabled).toBe(true);
      
      component.setDisabledState(false);
      expect(component.disabled).toBe(false);
    });
  });

  describe('Reactive Forms Integration', () => {
    it('should work with FormControl', async () => {
      const formControl = new FormControl(30);
      
      const testFixture = TestBed.createComponent(MsSliderCustomComponent);
      const testComponent = testFixture.componentInstance;
      
      // Simulate form control binding
      testComponent.writeValue(formControl.value || 0);
      testComponent.registerOnChange((value) => formControl.setValue(value));
      
      testFixture.detectChanges();
      
      expect(testComponent.value).toBe(30);
      
      testComponent.value = 60;
      expect(formControl.value).toBe(60);
    });
  });

  describe('DOM Rendering', () => {
    it('should render label when provided', () => {
      component.label = 'Test Label';
      fixture.detectChanges();
      
      const labelElement = fixture.debugElement.query(By.css('.ms-slider__label'));
      expect(labelElement).toBeTruthy();
      expect(labelElement.nativeElement.textContent.trim()).toBe('Test Label');
    });

    it('should not render label when not provided', () => {
      component.label = undefined;
      fixture.detectChanges();
      
      const labelElement = fixture.debugElement.query(By.css('.ms-slider__label'));
      expect(labelElement).toBeFalsy();
    });

    it('should render helper text when provided', () => {
      component.helperText = 'Helper text';
      fixture.detectChanges();
      
      const helperElement = fixture.debugElement.query(By.css('ms-helper'));
      expect(helperElement).toBeTruthy();
    });

    it('should render min/max labels when showMinMax is true', () => {
      component.showMinMax = true;
      component.min = 0;
      component.max = 100;
      fixture.detectChanges();
      
      const labelsElement = fixture.debugElement.query(By.css('.ms-slider__labels'));
      expect(labelsElement).toBeTruthy();
      
      const minLabel = fixture.debugElement.query(By.css('.ms-slider__label-min'));
      const maxLabel = fixture.debugElement.query(By.css('.ms-slider__label-max'));
      
      expect(minLabel.nativeElement.textContent.trim()).toBe('0');
      expect(maxLabel.nativeElement.textContent.trim()).toBe('100');
    });

    it('should show value display when active and showValue is true', () => {
      component.showValue = true;
      component.value = 50;
      component.isActive = true;
      fixture.detectChanges();
      
      const valueDisplay = fixture.debugElement.query(By.css('.ms-slider__value-display'));
      expect(valueDisplay).toBeTruthy();
      expect(valueDisplay.nativeElement.textContent.trim()).toBe('50');
    });

    it('should always show value when alwaysShowValue is true', () => {
      component.showValue = true;
      component.alwaysShowValue = true;
      component.value = 75;
      component.isActive = false;
      fixture.detectChanges();
      
      const valueDisplay = fixture.debugElement.query(By.css('.ms-slider__value-display'));
      expect(valueDisplay).toBeTruthy();
      expect(valueDisplay.nativeElement.textContent.trim()).toBe('75');
    });
  });

  describe('Host Classes', () => {
    it('should apply correct host classes', () => {
      component.surface = 'dark';
      component.disabled = true;
      component.error = true;
      
      const hostClasses = component.hostClasses;
      
      expect(hostClasses).toContain('ms-slider-custom');
      expect(hostClasses).toContain('ms-slider-custom--surface-dark');
      expect(hostClasses).toContain('ms-slider-custom--disabled');
      expect(hostClasses).toContain('ms-slider-custom--error');
    });

    it('should include active class when active', () => {
      component.isActive = true;
      
      const hostClasses = component.hostClasses;
      expect(hostClasses).toContain('ms-slider-custom--active');
    });
  });

  describe('Keyboard Navigation', () => {
    beforeEach(() => {
      component.min = 0;
      component.max = 100;
      component.step = 1;
      component.value = 50;
    });

    it('should increment value on ArrowRight', () => {
      const event = new KeyboardEvent('keydown', { key: 'ArrowRight' });
      spyOn(event, 'preventDefault');
      
      component.onKeyDown(event);
      
      expect(component.value).toBe(51);
      expect(event.preventDefault).toHaveBeenCalled();
    });

    it('should increment value on ArrowUp', () => {
      const event = new KeyboardEvent('keydown', { key: 'ArrowUp' });
      spyOn(event, 'preventDefault');
      
      component.onKeyDown(event);
      
      expect(component.value).toBe(51);
      expect(event.preventDefault).toHaveBeenCalled();
    });

    it('should decrement value on ArrowLeft', () => {
      const event = new KeyboardEvent('keydown', { key: 'ArrowLeft' });
      spyOn(event, 'preventDefault');
      
      component.onKeyDown(event);
      
      expect(component.value).toBe(49);
      expect(event.preventDefault).toHaveBeenCalled();
    });

    it('should decrement value on ArrowDown', () => {
      const event = new KeyboardEvent('keydown', { key: 'ArrowDown' });
      spyOn(event, 'preventDefault');
      
      component.onKeyDown(event);
      
      expect(component.value).toBe(49);
      expect(event.preventDefault).toHaveBeenCalled();
    });

    it('should jump to min on Home key', () => {
      const event = new KeyboardEvent('keydown', { key: 'Home' });
      spyOn(event, 'preventDefault');
      
      component.onKeyDown(event);
      
      expect(component.value).toBe(0);
      expect(event.preventDefault).toHaveBeenCalled();
    });

    it('should jump to max on End key', () => {
      const event = new KeyboardEvent('keydown', { key: 'End' });
      spyOn(event, 'preventDefault');
      
      component.onKeyDown(event);
      
      expect(component.value).toBe(100);
      expect(event.preventDefault).toHaveBeenCalled();
    });

    it('should use large steps for PageUp/PageDown', () => {
      component.step = 5;
      
      let event = new KeyboardEvent('keydown', { key: 'PageUp' });
      spyOn(event, 'preventDefault');
      component.onKeyDown(event);
      expect(component.value).toBe(100); // 50 + (5 * 10) = 100 (clamped)
      
      component.value = 50;
      event = new KeyboardEvent('keydown', { key: 'PageDown' });
      spyOn(event, 'preventDefault');
      component.onKeyDown(event);
      expect(component.value).toBe(0); // 50 - (5 * 10) = 0 (clamped)
    });

    it('should not respond to keyboard when disabled', () => {
      component.disabled = true;
      const originalValue = component.value;
      
      const event = new KeyboardEvent('keydown', { key: 'ArrowRight' });
      component.onKeyDown(event);
      
      expect(component.value).toBe(originalValue);
    });
  });

  describe('Value Formatting', () => {
    it('should use default format function', () => {
      component.value = 42;
      expect(component.formattedValue).toBe('42');
    });

    it('should use custom format function', () => {
      component.formatValue = (value: number) => `${value}%`;
      component.value = 75;
      expect(component.formattedValue).toBe('75%');
    });
  });

  describe('Input Validation', () => {
    it('should validate min/max relationship', () => {
      spyOn(console, 'warn');
      
      component.min = 100;
      component.max = 50;
      component.ngOnInit();
      
      expect(console.warn).toHaveBeenCalledWith(
        'MsSliderCustom: min value should be less than max value'
      );
    });

    it('should validate step value', () => {
      spyOn(console, 'warn');
      
      component.step = 0;
      component.ngOnInit();
      
      expect(console.warn).toHaveBeenCalledWith(
        'MsSliderCustom: step should be greater than 0'
      );
    });
  });

  describe('Focus and Blur', () => {
    it('should set active state on focus', () => {
      component.onFocus();
      expect(component.isActive).toBe(true);
    });

    it('should clear active state on blur', () => {
      component.isActive = true;
      component.onBlur();
      expect(component.isActive).toBe(false);
    });

    it('should mark as touched on blur', () => {
      const onTouched = jasmine.createSpy('onTouched');
      component.registerOnTouched(onTouched);
      
      component.onBlur();
      expect(onTouched).toHaveBeenCalled();
    });
  });
}); 