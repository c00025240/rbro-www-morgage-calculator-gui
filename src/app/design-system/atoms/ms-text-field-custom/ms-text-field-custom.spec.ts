import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { MsTextFieldCustomComponent } from './ms-text-field-custom';

describe('MsTextFieldCustomComponent', () => {
  let component: MsTextFieldCustomComponent;
  let fixture: ComponentFixture<MsTextFieldCustomComponent>;
  let inputElement: HTMLInputElement;
  let textareaElement: HTMLTextAreaElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MsTextFieldCustomComponent, ReactiveFormsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(MsTextFieldCustomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render input element by default', () => {
    const inputDE = fixture.debugElement.query(By.css('.ms-text-field__input'));
    expect(inputDE).toBeTruthy();
    inputElement = inputDE.nativeElement;
    expect(inputElement.type).toBe('text');
  });

  it('should render textarea when rows is set', () => {
    component.rows = 3;
    fixture.detectChanges();

    const textareaDE = fixture.debugElement.query(By.css('.ms-text-field__textarea'));
    expect(textareaDE).toBeTruthy();
    textareaElement = textareaDE.nativeElement;
    expect(textareaElement.rows).toBe(3);
  });

  it('should display label when provided', () => {
    component.label = 'Test Label';
    fixture.detectChanges();

    const labelDE = fixture.debugElement.query(By.css('.ms-text-field__label'));
    expect(labelDE).toBeTruthy();
    expect(labelDE.nativeElement.textContent.trim()).toBe('Test Label');
  });

  it('should show required asterisk when required is true', () => {
    component.label = 'Required Field';
    component.required = true;
    fixture.detectChanges();

    const labelDE = fixture.debugElement.query(By.css('.ms-text-field__label--required'));
    expect(labelDE).toBeTruthy();
  });

  it('should emit valueChange when input value changes', () => {
    spyOn(component.valueChange, 'emit');
    
    const inputDE = fixture.debugElement.query(By.css('.ms-text-field__input'));
    inputElement = inputDE.nativeElement;
    
    inputElement.value = 'test value';
    inputElement.dispatchEvent(new Event('input'));
    
    expect(component.valueChange.emit).toHaveBeenCalledWith('test value');
  });

  it('should set focused state on focus', () => {
    const inputDE = fixture.debugElement.query(By.css('.ms-text-field__input'));
    inputElement = inputDE.nativeElement;
    
    inputElement.dispatchEvent(new Event('focus'));
    fixture.detectChanges();
    
    expect(component.isFocused).toBe(true);
    
    const containerDE = fixture.debugElement.query(By.css('.ms-text-field__input-container--focused'));
    expect(containerDE).toBeTruthy();
  });

  it('should show suffix text when provided', () => {
    component.suffixText = 'EUR';
    fixture.detectChanges();

    const suffixDE = fixture.debugElement.query(By.css('.ms-text-field__suffix-text'));
    expect(suffixDE).toBeTruthy();
    expect(suffixDE.nativeElement.textContent.trim()).toBe('EUR');
  });

  it('should show character count when enabled', () => {
    component.showCharacterCount = true;
    component.maxLength = 100;
    component.value = 'test';
    fixture.detectChanges();

    const countDE = fixture.debugElement.query(By.css('.ms-text-field__character-count'));
    expect(countDE).toBeTruthy();
    expect(countDE.nativeElement.textContent.trim()).toBe('4/100');
  });

  it('should apply error styling when error is true', () => {
    component.error = true;
    fixture.detectChanges();

    const containerDE = fixture.debugElement.query(By.css('.ms-text-field__input-container--error'));
    expect(containerDE).toBeTruthy();
    
    expect(component.hostClasses).toContain('ms-text-field-custom--error');
  });

  it('should apply disabled styling when disabled is true', () => {
    component.disabled = true;
    fixture.detectChanges();

    const containerDE = fixture.debugElement.query(By.css('.ms-text-field__input-container--disabled'));
    expect(containerDE).toBeTruthy();
    
    expect(component.hostClasses).toContain('ms-text-field-custom--disabled');
  });

  it('should work with FormControl', () => {
    const formControl = new FormControl('initial value');
    
    // Simulate writeValue
    component.writeValue('initial value');
    expect(component.value).toBe('initial value');
    
    // Simulate registerOnChange
    let changeValue: string = '';
    component.registerOnChange((value: string) => {
      changeValue = value;
    });
    
    // Simulate user input
    const inputEvent = new Event('input');
    const inputDE = fixture.debugElement.query(By.css('.ms-text-field__input'));
    inputElement = inputDE.nativeElement;
    inputElement.value = 'new value';
    component.onInput(inputEvent);
    
    expect(changeValue).toBe('new value');
  });

  it('should handle different input types', () => {
    component.type = 'email';
    fixture.detectChanges();

    const inputDE = fixture.debugElement.query(By.css('.ms-text-field__input'));
    inputElement = inputDE.nativeElement;
    expect(inputElement.type).toBe('email');
  });

  it('should apply surface classes', () => {
    component.surface = 'dark';
    fixture.detectChanges();
    
    expect(component.hostClasses).toContain('ms-text-field-custom--surface-dark');
  });

  it('should show helper text when provided', () => {
    component.helperText = 'This is helper text';
    fixture.detectChanges();

    const helperDE = fixture.debugElement.query(By.css('ms-helper'));
    expect(helperDE).toBeTruthy();
  });
}); 