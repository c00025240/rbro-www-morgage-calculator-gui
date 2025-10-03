import { Component, EventEmitter, Input, Output, ViewEncapsulation, HostListener, ElementRef, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MsButtonPrimary } from '../../atoms/ms-button-primary/ms-button-primary';
import { MsButtonSecondary } from '../../atoms/ms-button-secondary/ms-button-secondary';

@Component({
  selector: 'ms-mobile-summary-modal',
  standalone: true,
  imports: [CommonModule, MsButtonPrimary, MsButtonSecondary],
  templateUrl: './ms-mobile-summary-modal.html',
  styleUrls: ['./ms-mobile-summary-modal.scss'],
  encapsulation: ViewEncapsulation.None
})
export class MsMobileSummaryModalComponent {
  @Input() offers: Array<{
    title: string;
    monthlyInstallment: string;
    fixedRate: string;
    variableRate: string;
    variableInstallment: string;
    dae: string;
    installmentType: string;
    downPayment: string;
    loanAmount: string;
    totalAmount: string;
    noDocAmount?: string;
    housePriceMin?: string;
  }> = [];
  @Output() closed = new EventEmitter<void>();

  currentOfferIndex: number = 0;
  private lastDirection: 'next' | 'prev' | 'none' = 'none';
  private animationNonce: number = 0;

  // Swipe gesture properties
  private touchStartX: number = 0;
  private touchStartY: number = 0;
  private touchEndX: number = 0;
  private touchEndY: number = 0;
  private readonly minSwipeDistance: number = 50;
  private readonly maxVerticalDistance: number = 100;
  private isMouseDown: boolean = false;

  constructor(private elementRef: ElementRef, private cdr: ChangeDetectorRef) {}

  onBackdropClick(): void { this.closed.emit(); }
  onCloseClick(): void { this.closed.emit(); }

  getCurrentOffer() {
    return this.offers[this.currentOfferIndex] || this.getDefaultOffer();
  }

  getDefaultOffer() {
    return {
      title: 'Cea mai mica rata',
      monthlyInstallment: '3.598 Lei',
      fixedRate: '5,69%',
      variableRate: '6,78%',
      variableInstallment: '5.171 Lei',
      dae: '7,73%',
      installmentType: 'Rate egale',
      downPayment: '200.342 Lei (30%)',
      loanAmount: '661.453 Lei',
      totalAmount: '1.835.632 Lei'
    };
  }

  getMonthlyInstallment(): string {
    return this.getCurrentOffer().monthlyInstallment;
  }

  getFixedRate(): string {
    return this.getCurrentOffer().fixedRate;
  }

  getVariableRate(): string {
    return this.getCurrentOffer().variableRate;
  }

  getVariableInstallment(): string {
    return this.getCurrentOffer().variableInstallment;
  }

  getDAE(): string {
    return this.getCurrentOffer().dae;
  }

  getInstallmentType(): string {
    return this.getCurrentOffer().installmentType;
  }

  getDownPayment(): string {
    return this.getCurrentOffer().downPayment;
  }

  getLoanAmount(): string {
    return this.getCurrentOffer().loanAmount;
  }

  getTotalAmount(): string {
    return this.getCurrentOffer().totalAmount;
  }

  getTitle(): string {
    return this.getCurrentOffer().title;
  }

  getBadgeClass(): string {
    // Use the same visual style for all offers as the personalized offer
    return 'ms-badge--primary';
  }

  onPreviousOffer(): void {
    if (this.currentOfferIndex > 0) {
      this.currentOfferIndex--;
    } else {
      this.currentOfferIndex = this.offers.length - 1;
    }
    this.lastDirection = 'prev';
    this.animationNonce++;
    this.cdr.markForCheck();
  }

  onNextOffer(): void {
    if (this.currentOfferIndex < this.offers.length - 1) {
      this.currentOfferIndex++;
    } else {
      this.currentOfferIndex = 0;
    }
    this.lastDirection = 'next';
    this.animationNonce++;
    this.cdr.markForCheck();
  }

  canGoPrevious(): boolean {
    return this.offers.length > 1;
  }

  canGoNext(): boolean {
    return this.offers.length > 1;
  }

  onApplyClick(): void {
    // Emit event for parent component to handle
    this.closed.emit();
  }

  // Touch event handlers for swipe gestures
  @HostListener('touchstart', ['$event'])
  onTouchStart(event: TouchEvent): void {
    this.touchStartX = event.touches[0].clientX;
    this.touchStartY = event.touches[0].clientY;
  }

  @HostListener('touchend', ['$event'])
  onTouchEnd(event: TouchEvent): void {
    this.touchEndX = event.changedTouches[0].clientX;
    this.touchEndY = event.changedTouches[0].clientY;
    this.handleSwipe();
  }

  // Mouse event handlers for desktop touchpad support
  @HostListener('mousedown', ['$event'])
  onMouseDown(event: MouseEvent): void {
    this.isMouseDown = true;
    this.touchStartX = event.clientX;
    this.touchStartY = event.clientY;
  }

  @HostListener('mouseup', ['$event'])
  onMouseUp(event: MouseEvent): void {
    if (this.isMouseDown) {
      this.isMouseDown = false;
      this.touchEndX = event.clientX;
      this.touchEndY = event.clientY;
      this.handleSwipe();
    }
  }

  @HostListener('mouseleave', ['$event'])
  onMouseLeave(event: MouseEvent): void {
    this.isMouseDown = false;
  }

  private handleSwipe(): void {
    const deltaX = this.touchEndX - this.touchStartX;
    const deltaY = this.touchEndY - this.touchStartY;
    
    // Check if it's a horizontal swipe (not vertical scroll)
    if (Math.abs(deltaY) > this.maxVerticalDistance) {
      return; // Ignore vertical swipes
    }

    // Check if swipe distance is sufficient
    if (Math.abs(deltaX) < this.minSwipeDistance) {
      return; // Swipe too short
    }

    // Determine swipe direction and navigate
    if (deltaX > 0) {
      // Swipe right - go to previous offer
      this.onPreviousOffer();
    } else {
      // Swipe left - go to next offer
      this.onNextOffer();
    }
  }

  getTransitionClass(): string {
    const alt = (this.animationNonce % 2) === 0 ? '' : '-alt';
    if (this.lastDirection === 'next') return `slide-in-left${alt}`;
    if (this.lastDirection === 'prev') return `slide-in-right${alt}`;
    return '';
  }
}


