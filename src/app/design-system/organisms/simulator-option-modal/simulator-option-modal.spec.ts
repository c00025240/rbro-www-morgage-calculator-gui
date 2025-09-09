import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SimulatorOptionModal } from './simulator-option-modal';

describe('SimulatorOptionModal', () => {
  let component: SimulatorOptionModal;
  let fixture: ComponentFixture<SimulatorOptionModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SimulatorOptionModal]
    }).compileComponents();

    fixture = TestBed.createComponent(SimulatorOptionModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have default options with first option selected', () => {
    const options = component.options();
    expect(options.length).toBe(3);
    expect(options[0].selected).toBe(true);
    expect(options[1].selected).toBe(false);
    expect(options[2].selected).toBe(false);
  });

  it('should update selection when option is clicked', () => {
    component.onOptionClick('refinantare');
    const options = component.options();
    expect(options[0].selected).toBe(false);
    expect(options[1].selected).toBe(true);
    expect(options[2].selected).toBe(false);
  });

  it('should emit optionSelected event when option is clicked', () => {
    spyOn(component.optionSelected, 'emit');
    component.onOptionClick('constructie-renovare');
    expect(component.optionSelected.emit).toHaveBeenCalledWith('constructie-renovare');
  });

  it('should emit closeModal event when modal is closed', () => {
    spyOn(component.closeModal, 'emit');
    component.onModalClose();
    expect(component.closeModal.emit).toHaveBeenCalled();
  });
}); 