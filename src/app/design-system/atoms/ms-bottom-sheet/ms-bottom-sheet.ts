import { Component, Input, Inject, Injectable, TemplateRef } from '@angular/core';
import { MatBottomSheet, MatBottomSheetModule, MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { CommonModule } from '@angular/common';

export interface BottomSheetData {
  title?: string;
  subtitle?: string;
  content?: string;
  actions?: BottomSheetAction[];
  listItems?: BottomSheetListItem[];
  showHandle?: boolean;
  showHeader?: boolean;
  showFooter?: boolean;
  variant?: 'default' | 'list' | 'actions' | 'custom';
  size?: 'small' | 'medium' | 'large' | 'full';
  dismissible?: boolean;
  backdrop?: boolean;
  ariaLabel?: string;
  ariaDescribedBy?: string;
}

export interface BottomSheetAction {
  label: string;
  icon?: string;
  action: () => void;
  disabled?: boolean;
  primary?: boolean;
  destructive?: boolean;
}

export interface BottomSheetListItem {
  label: string;
  subtitle?: string;
  icon?: string;
  action?: () => void;
  disabled?: boolean;
  selected?: boolean;
  divider?: boolean;
}

@Component({
  selector: 'ms-bottom-sheet',
  standalone: true,
  imports: [CommonModule, MatBottomSheetModule, MatButtonModule, MatIconModule, MatListModule],
  templateUrl: './ms-bottom-sheet.html',
  styleUrl: './ms-bottom-sheet.scss'
})
export class MsBottomSheet {
  constructor(
    public bottomSheetRef: MatBottomSheetRef<MsBottomSheet>,
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: BottomSheetData
  ) {}

  get sheetClasses(): string {
    const classes = ['ms-bottom-sheet'];
    classes.push(`ms-bottom-sheet--${this.data.variant || 'default'}`);
    classes.push(`ms-bottom-sheet--${this.data.size || 'medium'}`);
    return classes.join(' ');
  }

  get hasHeader(): boolean {
    return this.data.showHeader !== false && (!!this.data.title || !!this.data.subtitle);
  }

  get hasContent(): boolean {
    return !!this.data.content || !!this.data.listItems?.length;
  }

  get hasFooter(): boolean {
    return this.data.showFooter !== false && !!this.data.actions?.length;
  }

  onAction(action: BottomSheetAction): void {
    if (!action.disabled) {
      action.action();
      if (!action.primary || this.data.dismissible !== false) {
        this.bottomSheetRef.dismiss();
      }
    }
  }

  onListItemClick(item: BottomSheetListItem): void {
    if (!item.disabled && item.action) {
      item.action();
      this.bottomSheetRef.dismiss();
    }
  }

  onDismiss(): void {
    if (this.data.dismissible !== false) {
      this.bottomSheetRef.dismiss();
    }
  }

  onBackdropClick(): void {
    if (this.data.backdrop !== false && this.data.dismissible !== false) {
      this.bottomSheetRef.dismiss();
    }
  }
}

@Injectable({
  providedIn: 'root'
})
export class MsBottomSheetService {
  constructor(private bottomSheet: MatBottomSheet) {}

  open(data: BottomSheetData, customComponent?: any): MatBottomSheetRef<any> {
    const config = {
      data,
      disableClose: data.dismissible === false,
      hasBackdrop: data.backdrop !== false,
      panelClass: [`ms-bottom-sheet--${data.variant || 'default'}`, `ms-bottom-sheet--${data.size || 'medium'}`],
      ariaLabel: data.ariaLabel,
      ariaDescribedBy: data.ariaDescribedBy
    };

    return this.bottomSheet.open(customComponent || MsBottomSheet, config);
  }

  openActionSheet(title: string, actions: BottomSheetAction[]): MatBottomSheetRef<MsBottomSheet> {
    return this.open({
      title,
      variant: 'actions',
      actions,
      showHandle: true,
      dismissible: true
    });
  }

  openListSheet(title: string, items: BottomSheetListItem[]): MatBottomSheetRef<MsBottomSheet> {
    return this.open({
      title,
      variant: 'list',
      listItems: items,
      showHandle: true,
      dismissible: true
    });
  }

  openCustomSheet(data: BottomSheetData, component?: any): MatBottomSheetRef<any> {
    return this.open(data, component);
  }

  // Mortgage-specific convenience methods
  openPropertyActions(propertyAddress: string): MatBottomSheetRef<MsBottomSheet> {
    return this.openActionSheet('Property Options', [
      {
        label: 'View Details',
        icon: 'visibility',
        action: () => console.log('View property details'),
        primary: true
      },
      {
        label: 'Save Property',
        icon: 'favorite_border',
        action: () => console.log('Save property')
      },
      {
        label: 'Schedule Tour',
        icon: 'calendar_month',
        action: () => console.log('Schedule tour')
      },
      {
        label: 'Contact Agent',
        icon: 'phone',
        action: () => console.log('Contact agent')
      },
      {
        label: 'Share Property',
        icon: 'share',
        action: () => console.log('Share property')
      }
    ]);
  }

  openLoanOptions(): MatBottomSheetRef<MsBottomSheet> {
    return this.openListSheet('Loan Products', [
      {
        label: '30-Year Fixed Rate',
        subtitle: '6.25% APR • $1,848/month',
        icon: 'home',
        action: () => console.log('30-year fixed selected')
      },
      {
        label: '15-Year Fixed Rate',
        subtitle: '5.95% APR • $2,515/month',
        icon: 'trending_up',
        action: () => console.log('15-year fixed selected')
      },
      {
        label: '5/1 Adjustable Rate',
        subtitle: '5.50% APR • $1,704/month initial',
        icon: 'timeline',
        action: () => console.log('ARM selected')
      },
      {
        label: 'FHA Loan',
        subtitle: '6.45% APR • 3.5% down payment',
        icon: 'account_balance',
        action: () => console.log('FHA selected')
      },
      {
        label: 'VA Loan',
        subtitle: '6.00% APR • No down payment',
        icon: 'military_tech',
        action: () => console.log('VA selected')
      }
    ]);
  }

  openDocumentActions(documentName: string): MatBottomSheetRef<MsBottomSheet> {
    return this.openActionSheet(`${documentName} Options`, [
      {
        label: 'View Document',
        icon: 'visibility',
        action: () => console.log('View document'),
        primary: true
      },
      {
        label: 'Download',
        icon: 'download',
        action: () => console.log('Download document')
      },
      {
        label: 'Replace',
        icon: 'upload',
        action: () => console.log('Replace document')
      },
      {
        label: 'Delete',
        icon: 'delete',
        action: () => console.log('Delete document'),
        destructive: true
      }
    ]);
  }

  openApplicationMenu(): MatBottomSheetRef<MsBottomSheet> {
    return this.openListSheet('Application Menu', [
      {
        label: 'Application Status',
        subtitle: 'View current progress',
        icon: 'assignment',
        action: () => console.log('View status')
      },
      {
        label: 'Upload Documents',
        subtitle: 'Add required documents',
        icon: 'cloud_upload',
        action: () => console.log('Upload documents')
      },
      {
        label: 'Contact Loan Officer',
        subtitle: 'Get help with your application',
        icon: 'support_agent',
        action: () => console.log('Contact loan officer')
      },
      {
        label: 'Calculator Tools',
        subtitle: 'Affordability and payment calculators',
        icon: 'calculate',
        action: () => console.log('Open calculators')
      },
      { divider: true } as BottomSheetListItem,
      {
        label: 'Settings',
        subtitle: 'Account and notification preferences',
        icon: 'settings',
        action: () => console.log('Open settings')
      }
    ]);
  }

  openCalculatorOptions(): MatBottomSheetRef<MsBottomSheet> {
    return this.openListSheet('Calculator Tools', [
      {
        label: 'Affordability Calculator',
        subtitle: 'How much home can you afford?',
        icon: 'account_balance_wallet',
        action: () => console.log('Affordability calculator')
      },
      {
        label: 'Mortgage Payment',
        subtitle: 'Calculate monthly payments',
        icon: 'payments',
        action: () => console.log('Payment calculator')
      },
      {
        label: 'Refinance Calculator',
        subtitle: 'Should you refinance?',
        icon: 'refresh',
        action: () => console.log('Refinance calculator')
      },
      {
        label: 'Extra Payment Calculator',
        subtitle: 'See the impact of extra payments',
        icon: 'add_circle',
        action: () => console.log('Extra payment calculator')
      },
      {
        label: 'Rent vs Buy',
        subtitle: 'Compare renting vs buying',
        icon: 'compare_arrows',
        action: () => console.log('Rent vs buy calculator')
      }
    ]);
  }
}
