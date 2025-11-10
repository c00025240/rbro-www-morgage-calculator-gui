import { Component, OnInit, Input, SecurityContext } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';
import { iconNames, type IconName } from './icons.generated';

export type IconStyle = 'filled' | 'outlined' | 'half';

export interface IconDefinition {
  name: string;
  displayName: string;
  category: string;
  styles: IconStyle[];
  content?: { [key in IconStyle]?: SafeHtml };
  description: string;
  usage: string;
  // Adding new properties for asset path information
  assetPath?: string;
  filenames?: { [key in IconStyle]?: string };
}

@Component({
  selector: 'ms-ms-icons',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ms-icons.html',
  styleUrl: './ms-icons.scss'
})
export class MsIcons implements OnInit {
  // Storybook Controls Inputs
  @Input() selectedIcon: string = 'money-bag';
  @Input() selectedStyle: IconStyle = 'outlined';
  @Input() selectedCategory: string = 'all';
  @Input() iconSize: string = 'medium';
  @Input() iconColor: string = 'default';
  @Input() showGrid: boolean = true;
  @Input() showUsageExamples: boolean = true;
  @Input() showImplementation: boolean = true;
  @Input() searchTerm: string = '';

  styles: IconStyle[] = ['outlined', 'filled'];

  allIcons: IconDefinition[] = [];
  filteredIcons: IconDefinition[] = [];
  categories: string[] = ['all', 'financial', 'ui', 'communication', 'navigation', 'documents', 'social', 'misc'];
  
  // expose generated names for template/controls if needed
  generatedIconNames: IconName[] = iconNames;
  
  iconSizes = [
    { name: 'Small', value: 'small', size: '16px' },
    { name: 'Medium', value: 'medium', size: '24px' },
    { name: 'Large', value: 'large', size: '32px' },
    { name: 'X-Large', value: 'xl', size: '48px' }
  ];

  // Complete list of ALL 674 SVG files from the actual icons directory
  private allSvgFiles = [
'Art.svg',
'Book.svg',
'Certificate.svg',
'Cryptocurrency.svg',
'Face-ID-icon-simplified.svg',
'In.svg',
'Luggage.svg',
'NFC Payment Icon.svg',
'No internet.svg',
'Out.svg',
'Style=filled.svg',
'Style=outlined.svg',
'a-fine.svg',
'acc-operations-2.svg',
'acc-operations.svg',
'acc-save.svg',
'acc-special.svg',
'acc-target.svg',
'accessories.svg',
'acquiring-1.svg',
'acquiring-2.svg',
'acquiring-3.svg',
'add-person-2.svg',
'add-person.svg',
'add-ring.svg',
'add-to-dic.svg',
'add.svg',
'airplane.svg',
'alcohol-and-tobacco.svg',
'alcohol-cheers.svg',
'ambulance.svg',
'anker.svg',
'apple-inc.svg',
'apple-wallet.svg',
'apple.svg',
'archer.svg',
'archive.svg',
'army-cap.svg',
'arrows-diag Style=filled.svg',
'arrows-diag Style=outlined.svg',
'arrows-left-right Style=filled.svg',
'arrows-left-right Style=outlined.svg',
'arrows-top-down.svg',
'art-and-literature.svg',
'asterix.svg',
'atm Style=Filled.svg',
'atm Style=Outlined.svg',
'atm-cards.svg',
'atm-cash-1 Style=Filled.svg',
'atm-cash-1 Style=Outlined.svg',
'atm-cash-2.svg',
'attach.svg',
'autoservice-1.svg',
'autoservice-2.svg',
'autoservice-3.svg',
'autotransport-front.svg',
'autotransport-side.svg',
'back-ring.svg',
'back.svg',
'backpack.svg',
'balance-hidden-1.svg',
'balance-hidden-2.svg',
'balance-hidden-3.svg',
'balloon.svg',
'bank-and-home.svg',
'bank-building-1.svg',
'bank-building-2.svg',
'bank-service-profile-1.svg',
'bank-service-profile-2.svg',
'bank-service-security.svg',
'bank-transfer-to-budget.svg',
'barbell.svg',
'barrel.svg',
'basket.svg',
'basketball ball.svg',
'batch.svg',
'batch_right.svg',
'bear-2.svg',
'bear.svg',
'beauty.svg',
'bicycle-1.svg',
'bicycle-2.svg',
'binoculars-1.svg',
'binoculars-2.svg',
'blocked.svg',
'bookmark Style=filled.svg',
'bookmark Style=outline.svg',
'books-shelf-1.svg',
'books-shelf-2.svg',
'bowling.svg',
'boxing.svg',
'branch-in.svg',
'branch.svg',
'brand-symbol.svg',
'bridge.svg',
'briefcase-interest.svg',
'broker.svg',
'brush.svg',
'bulb.svg',
'bull.svg',
'bullet - L.svg',
'bullet - M.svg',
'bundle-of-money.svg',
'burger-hor.svg',
'burger.svg',
'bus.svg',
'bust.svg',
'cafe.svg',
'cake.svg',
'calculator-currency-1.svg',
'calculator-currency-2.svg',
'calculator-currency-3.svg',
'calculator.svg',
'calendar-add.svg',
'calendar-close.svg',
'calendar.svg',
'call-in.svg',
'call-out.svg',
'camera-photo.svg',
'camera-video-2.svg',
'camera-video.svg',
'cancel.svg',
'candy.svg',
'canister.svg',
'car-credit.svg',
'car-dealers.svg',
'car-parts.svg',
'car-rent-1.svg',
'car-rent-2.svg',
'card-credit Style=filled.svg',
'card-credit Style=outlined.svg',
'card-scanner.svg',
'card-to-other-bank-right Style=filled.svg',
'card-to-other-bank-right Style=outlined.svg',
'cardio.svg',
'case Style=Filled.svg',
'case Style=Outlined.svg',
'cash-operation.svg',
'cash-transactions.svg',
'cash-transfer.svg',
'cashbox.svg',
'castle.svg',
'cat.svg',
'chair.svg',
'change-down.svg',
'change-language.svg',
'change-theme.svg',
'change-up.svg',
'chart-bar-1.svg',
'chart-bar-2.svg',
'chart-bar-3.svg',
'chart-bar-grow-2.svg',
'chart-line-grow-1.svg',
'chart-line.svg',
'chart-pie.svg',
'chat-1.svg',
'chat-2.svg',
'chat-ask-brand-symbol.svg',
'chat-ask.svg',
'chat-brand-symbol Style=filled.svg',
'chat-brand-symbol Style=outlined.svg',
'chat-group.svg',
'checkmark Style=filled.svg',
'checkmark Style=outlined.svg',
'checkmark-part.svg',
'checkmark-progress.svg',
'checkmark-ring Style=filled.svg',
'checkmark-ring Style=outlined.svg',
'chess.svg',
'cinema.svg',
'city.svg',
'clear-rec.svg',
'clear-ring Style=filled.svg',
'clear-ring Style=outlined.svg',
'click-2-pay.svg',
'clipboard.svg',
'close.svg',
'clothes-1.svg',
'clothes-2.svg',
'clothes-3.svg',
'clothes-baby.svg',
'cloud.svg',
'cocktail.svg',
'code-bar 1.svg',
'code-bar 2.svg',
'code-bar-ring.svg',
'code-qr.svg',
'coffee.svg',
'collapse-left.svg',
'collapse-right.svg',
'columns.svg',
'compass.svg',
'concrete-mixer.svg',
'connection-1.svg',
'console.svg',
'consultation.svg',
'consumer-credit.svg',
'conversion.svg',
'cook.svg',
'coordinates.svg',
'copy.svg',
'cosmetics-1.svg',
'cosmetics-2.svg',
'countdown.svg',
'courses.svg',
'court.svg',
'crane-1.svg',
'crane-2.svg',
'credit-cash.svg',
'credit-consumer Style=Filled.svg',
'credit-consumer Style=Outlined.svg',
'credit-operations-1.svg',
'credit-operations-2.svg',
'credit-operations.svg',
'credit-pay-full.svg',
'credit-pay-part.svg',
'cube.svg',
'cup-sport.svg',
'cup.svg',
'cupboard.svg',
'currency-lek.svg',
'currency-transfer.svg',
'current-ring.svg',
'customer-support Style=Filled.svg',
'customer-support Style=Outlined.svg',
'darts.svg',
'debt-fcpp.svg',
'deposit Outlined=filled.svg',
'deposit Outlined=outlined.svg',
'deposit-operations.svg',
'design.svg',
'device-left.svg',
'device-right.svg',
'dic.svg',
'disability-wheelchair-ramp.svg',
'disability-wheelchair.svg',
'dislike Style=filled.svg',
'dislike Style=outlined.svg',
'divide.svg',
'doc-attachment.svg',
'doc-edit.svg',
'doc-error.svg',
'doc-fav.svg',
'doc-history.svg',
'doc-new.svg',
'doc-nmb.svg',
'doc-preview.svg',
'doc-recieve.svg',
'doc-reissue.svg',
'doc-rouble.svg',
'doc-seal.svg',
'doc-search.svg',
'doc-send.svg',
'doc-sent.svg',
'doc-sign-and-send.svg',
'doc-sign-checked.svg',
'doc-sign-remove.svg',
'doc-sign-visa.svg',
'doc-sign.svg',
'doc-verified.svg',
'doc.svg',
'docs-2 Property 1=Filled.svg',
'docs-2 Property 1=Outlined.svg',
'docs-rouble.svg',
'docs.svg',
'document.svg',
'docx.svg',
'dollar-us.svg',
'dolphin.svg',
'down-ring.svg',
'down.svg',
'download.svg',
'drag-1.svg',
'drag.svg',
'driver-license.svg',
'early-payment.svg',
'edi.svg',
'edit.svg',
'education.svg',
'enter.svg',
'entertainment-1.svg',
'entertainment-2.svg',
'equally.svg',
'equipment.svg',
'euro.svg',
'excavator.svg',
'exchange-1.svg',
'exchange-2.svg',
'exit.svg',
'eye-closed.svg',
'eye-opened.svg',
'face-happy.svg',
'face-neutral.svg',
'face-no-mouth.svg',
'face-sad.svg',
'facebook.svg',
'factory.svg',
'fav Style=filled.svg',
'fav Style=half.svg',
'fav Style=outlined.svg',
'feedback-positive.svg',
'fence.svg',
'filter Style=filled.svg',
'filter Style=outlined.svg',
'filter.svg',
'fingerprint-1.svg',
'fingerprint-2.svg',
'fire.svg',
'fireplace.svg',
'fish.svg',
'fishing.svg',
'flag.svg',
'flasher.svg',
'flip-arrow.svg',
'flower.svg',
'folder.svg',
'food-service.svg',
'footwear-1.svg',
'footwear-2.svg',
'foreign-currency-account-dollar.svg',
'foreign-currency-account-euro-2 Style=filled.svg',
'foreign-currency-account-euro-2 Style=outlined.svg',
'foreign-currency-account-euro.svg',
'forward-ring.svg',
'forward.svg',
'frame.svg',
'furniture.svg',
'gas-station.svg',
'gas.svg',
'gears.svg',
'girl.svg',
'glasses.svg',
'globe-1.svg',
'globe-2.svg',
'go-left.svg',
'go-right.svg',
'goals.svg',
'golf.svg',
'google.svg',
'grandfather.svg',
'grandmother.svg',
'grid Style=filled.svg',
'grid Style=outlined.svg',
'grocery 1 Style=filled.svg',
'grocery 1 Style=outlined.svg',
'grocery-2.svg',
'gym.svg',
'hand-cash-1.svg',
'hand-cash.svg',
'headphones-1.svg',
'headphones-2.svg',
'headphones-3.svg',
'headphones-4.svg',
'heart Style=filled.svg',
'heart Style=outlined.svg',
'heart-broken.svg',
'heating-1.svg',
'heating-2.svg',
'helicopter.svg',
'hint Styke=outlined.svg',
'hint Style=filled.svg',
'history-partial.svg',
'history.svg',
'hit.svg',
'home Style=outlined.svg',
'home tyle=filled.svg',
'home-equipment.svg',
'home-services.svg',
'hotels.svg',
'house-wap.svg',
'house.svg',
'houses.svg',
'ic_sorting_a-z.svg',
'ic_sorting_z-a.svg',
'ice-cream.svg',
'ideas-raiting.svg',
'import-person-1.svg',
'import-person-2.svg',
'in-progress-ring.svg',
'in-progress.svg',
'in-queue.svg',
'infinity.svg',
'info Style=filled.svg',
'info Style=outlined.svg',
'info-letter.svg',
'instagram.svg',
'insurance-1.svg',
'insurance-2.svg',
'insurance.svg',
'internet.svg',
'invoice-1.svg',
'invoice-2.svg',
'invoice-data.svg',
'invoice-filter.svg',
'invoice-info.svg',
'invoice-pay.svg',
'invoice-percent-sign-1.svg',
'invoice-percent-sign-2.svg',
'invoice-seal.svg',
'invoice-search.svg',
'jpeg.svg',
'jpg.svg',
'keyboard-settings.svg',
'keyboard.svg',
'kids.svg',
'knowledge.svg',
'lamp.svg',
'laptop.svg',
'leaf.svg',
'libra.svg',
'lightning-off.svg',
'lightning.svg',
'like Style=filled.svg',
'like Style=outlined.svg',
'link.svg',
'linkedin.svg',
'literature.svg',
'location-1.svg',
'location-2.svg',
'location.svg',
'locked.svg',
'mail Style=filled.svg',
'mail Style=outlined.svg',
'mail-in.svg',
'mail-out.svg',
'mail-read.svg',
'mail-service-1.svg',
'mail-service-2.svg',
'man Style=filled.svg',
'man Style=outlined.svg',
'man-butterfly.svg',
'man-ring.svg',
'map-2.svg',
'map-search.svg',
'medal.svg',
'menu-down.svg',
'menu-up.svg',
'metro.svg',
'microphone.svg',
'microscope.svg',
'minus.svg',
'mirror-1.svg',
'mirror-2.svg',
'mirror-3.svg',
'mobile-connecting.svg',
'mobile-info.svg',
'mobile-my-devices.svg',
'mobile-send-money.svg',
'mobile.svg',
'money-account-czk-2.svg',
'money-account-czk.svg',
'money-bag Style=filled.svg',
'money-bag Style=outlined.svg',
'money-bag-incoming.svg',
'money-bag-outgoing.svg',
'money-bag-rouble.svg',
'money-drop.svg',
'money-investment.svg',
'money-loan.svg',
'money-return.svg',
'money-transfer-accounts.svg',
'money.svg',
'monitor.svg',
'moon.svg',
'more-hor Style=filled.svg',
'more-hor Style=outlined.svg',
'more-info.svg',
'more-vert.svg',
'mortgage.svg',
'moto-1.svg',
'moto-2.svg',
'mountains.svg',
'movie.svg',
'music-1.svg',
'music-2.svg',
'name-plate.svg',
'navigation.svg',
'new-tab.svg',
'nmb-send.svg',
'notification Style=filled.svg',
'notification Style=outlined.svg',
'offer Style=Filled.svg',
'offer Style=Outlined.svg',
'offer-top.svg',
'office-supplies.svg',
'oil.svg',
'on-laptop.svg',
'onboarding.svg',
'organization-company.svg',
'other-goods.svg',
'pad-hor.svg',
'pad-vert.svg',
'palm.svg',
'parachute.svg',
'paris.svg',
'parking.svg',
'passport.svg',
'payment-auto.svg',
'payment-in-line.svg',
'payment-partly-signed.svg',
'payment-signature-error.svg',
'payment-signed-1.svg',
'payment-signed-2.svg',
'pdf.svg',
'pear.svg',
'pen.svg',
'people-1.svg',
'people-2.svg',
'people-search.svg',
'percent.svg',
'person-block.svg',
'person-level.svg',
'person-percent.svg',
'person-phone.svg',
'person-service.svg',
'pet.svg',
'pharmacy.svg',
'phone Style=filled.svg',
'phone Style=outlined.svg',
'phone-active.svg',
'picture-1.svg',
'picture-2.svg',
'picture-3.svg',
'pif-1.svg',
'pif-2.svg',
'pin-1.svg',
'pin-2.svg',
'ping-pong.svg',
'pipes.svg',
'plant.svg',
'plus-minus.svg',
'police-cap-1.svg',
'police-cap-2.svg',
'police-car-1.svg',
'police-car-2.svg',
'police-car-3.svg',
'pound-gb.svg',
'premium.svg',
'printer.svg',
'prints-3.svg',
'public-service-1.svg',
'public-service-2.svg',
'public-service-3.svg',
'public-service-4.svg',
'purchases.svg',
'railway-1.svg',
'railway-2.svg',
'rain.svg',
'rating.svg',
'refresh_repeat.svg',
'rejected.svg',
'remove-person.svg',
'repair-1.svg',
'repair-2.svg',
'repair-home.svg',
'reply.svg',
'restaurant-2.svg',
'restaurant.svg',
'retry-1.svg',
'retry-2.svg',
'retry-with-errors.svg',
'rewind-left.svg',
'rewind-right.svg',
'robot.svg',
'rouble-2.svg',
'rouble-cashflow.svg',
'rouble-gear.svg',
'rouble-return.svg',
'rouble-ring.svg',
'rouble-send.svg',
'rouble.svg',
'route-1.svg',
'route-2.svg',
'safari.svg',
'safe.svg',
'satellite-1.svg',
'satellite-2.svg',
'satellite-3.svg',
'save-1.svg',
'save-2.svg',
'savings.svg',
'scheme-1.svg',
'scheme-2.svg',
'screw.svg',
'seal-1.svg',
'seal-2.svg',
'search-person.svg',
'search-star.svg',
'search.svg',
'select-hide.svg',
'select-open-down.svg',
'send-to-company.svg',
'services.svg',
'share.svg',
'shield.svg',
'shield_check.svg',
'ship.svg',
'sorting.svg',
'sound-mute.svg',
'sound.svg',
'star-person-1.svg',
'star-person-2.svg',
'star-reward.svg',
'sticker.svg',
'string.svg',
'stroller.svg',
'suitcase-close.svg',
'suitcase.svg',
'tag price Style=filled.svg',
'tag price Style=outlined.svg',
'tag-price-2.svg',
'tag-price-3.svg',
'tag-price-4.svg',
'target-operations.svg',
'task-done.svg',
'task-send.svg',
'task.svg',
'telegram.svg',
'telephone.svg',
'template-save.svg',
'template-saved.svg',
'template.svg',
'terminal-on-map.svg',
'terminal.svg',
'theater-in.svg',
'theater-out.svg',
'theater.svg',
'to-pay.svg',
'to-people.svg',
'to-person.svg',
'tower.svg',
'tractor.svg',
'transport.svg',
'trash.svg',
'treatment-1.svg',
'treatment-2.svg',
'truck.svg',
'tv.svg',
'twitter-new.svg',
'twitter.svg',
'umbrella-closed.svg',
'umbrella-opened.svg',
'unarchive.svg',
'unlocked.svg',
'up-ring.svg',
'up.svg',
'upload.svg',
'veterinarian-2.svg',
'viber.svg',
'violin.svg',
'volleyball.svg',
'wacom.svg',
'wallet-1.svg',
'wallet-2 Style=filled.svg',
'wallet-2 Style=outlined.svg',
'warning Style=filled.svg',
'warning Style=outlined.svg',
'warning-exclamation.svg',
'warning-tr Style=filled.svg',
'warning-tr Style=outlined.svg',
'watch-apple.svg',
'water.svg',
'watering-can.svg',
'wave.svg',
'web-site.svg',
'whale.svg',
'wheelbarrow.svg',
'window.svg',
'women.svg',
'world.svg',
'wrench.svg',
'xls.svg',
'yen-jp.svg',
'zoo-store.svg'
  ];

  constructor(
    private sanitizer: DomSanitizer,
    private http: HttpClient
  ) {}

  ngOnInit() {
    this.loadAllIcons();
  }

  private loadAllIcons(): void {
    console.log('🔍 Loading all SVG icons...');
    
    // Group files by base icon name
    const iconGroups = this.groupIconsByBaseName(this.allSvgFiles);
    
    // Create icon definitions
    this.allIcons = Object.entries(iconGroups).map(([baseName, files]) => {
      const styles = this.determineAvailableStyles(files);
      const category = this.categorizeIcon(baseName);
      
      return {
        name: baseName,
        displayName: this.formatDisplayName(baseName),
        category: category,
        styles: styles,
        description: this.generateDescription(baseName, category),
        usage: this.generateUsage(baseName, category)
      };
    });

    // Sort icons alphabetically
    this.allIcons.sort((a, b) => a.name.localeCompare(b.name));
    
    console.log(`🎨 Created ${this.allIcons.length} icon definitions`);
    
    // Load SVG content for all icons
    this.loadAllSvgContent();
    
    this.updateFilteredIcons();
  }

  private groupIconsByBaseName(files: string[]): { [baseName: string]: string[] } {
    const groups: { [baseName: string]: string[] } = {};
    
    files.forEach(file => {
      const baseName = this.extractBaseName(file);
      if (!groups[baseName]) {
        groups[baseName] = [];
      }
      groups[baseName].push(file);
    });
    
    return groups;
  }

  private extractBaseName(filename: string): string {
    // Remove .svg extension
    let name = filename.replace('.svg', '');
    
    // Handle various style patterns
    const stylePatterns = [
      / Style=.+$/,
      / Property 1=.+$/,
      / Outlined=.+$/,
      / tyle=.+$/ // Handle typos like "tyle" instead of "Style"
    ];
    
    for (const pattern of stylePatterns) {
      name = name.replace(pattern, '');
    }
    
    return name.toLowerCase().trim();
  }

  private determineAvailableStyles(files: string[]): IconStyle[] {
    const styles: Set<IconStyle> = new Set();
    
    // If only one file and no style indicators, it's outlined
    if (files.length === 1 && !this.hasStyleIndicators(files[0])) {
      styles.add('outlined');
      return Array.from(styles);
    }
    
    files.forEach(file => {
      if (file.includes('filled') || file.includes('Filled')) {
        styles.add('filled');
      } else if (file.includes('outlined') || file.includes('Outlined') || file.includes('outline')) {
        styles.add('outlined');
      } else if (file.includes('half')) {
        styles.add('half');
      } else {
        styles.add('outlined'); // Default to outlined
      }
    });
    
    if (styles.size === 0) {
      styles.add('outlined');
    }
    
    return Array.from(styles);
  }

  private hasStyleIndicators(filename: string): boolean {
    const styleIndicators = [
      'Style=', 'Property 1=', 'Outlined=', 'tyle=',
      'filled', 'outlined', 'outline', 'half'
    ];
    return styleIndicators.some(indicator => filename.includes(indicator));
  }

  private loadAllSvgContent(): void {
    console.log(`📥 Loading SVG content for ${this.allIcons.length} icons...`);
    
    this.allIcons.forEach(async (icon) => {
      icon.content = {};
      icon.filenames = {};
      icon.assetPath = '/assets/icons/'; // Set the asset path
      
      for (const style of icon.styles) {
        const filename = this.getFilenameForStyle(icon.name, style);
        icon.filenames[style] = filename; // Store the filename for each style
        
        try {
          const svgContent = await this.http.get(`icons/${filename}`, { responseType: 'text' }).toPromise();
          if (svgContent) {
            // Sanitize SVG content to prevent XSS attacks
            const sanitized = this.sanitizer.sanitize(SecurityContext.HTML, svgContent);
            icon.content[style] = sanitized ? this.sanitizer.bypassSecurityTrustHtml(sanitized) : null;
            console.log(`✅ Loaded ${icon.name} ${style}`);
          }
        } catch (error) {
          console.warn(`❌ Failed to load ${icon.name} ${style}:`, error);
          // Provide fallback SVG (pre-sanitized, static content)
          const fallbackSvg = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" stroke-width="2" fill="none"/>
            <text x="12" y="16" text-anchor="middle" font-size="10" fill="currentColor">${icon.name.charAt(0).toUpperCase()}</text>
          </svg>`;
          const sanitized = this.sanitizer.sanitize(SecurityContext.HTML, fallbackSvg);
          icon.content[style] = sanitized ? this.sanitizer.bypassSecurityTrustHtml(sanitized) : null;
        }
      }
    });
  }

  private getFilenameForStyle(iconName: string, style: IconStyle): string {
    // Find the actual filename for this icon and style
    const matchingFiles = this.allSvgFiles.filter(file => {
      const baseName = this.extractBaseName(file);
      const fileStyle = this.getFileStyle(file);
      return baseName === iconName && fileStyle === style;
    });
    
    if (matchingFiles.length > 0) {
      return matchingFiles[0];
    }
    
    // Fallback - try to construct the filename
    if (style === 'outlined' && this.isSingleFileIcon(iconName)) {
      return `${iconName}.svg`;
    }
    
    return `${iconName} Style=${style}.svg`;
  }

  private getFileStyle(filename: string): IconStyle {
    if (filename.includes('filled') || filename.includes('Filled')) {
      return 'filled';
    } else if (filename.includes('outlined') || filename.includes('Outlined') || filename.includes('outline')) {
      return 'outlined';
    } else if (filename.includes('half')) {
      return 'half';
    }
    return 'outlined'; // Default
  }

  private isSingleFileIcon(iconName: string): boolean {
    const singleFileIcons = [
      'lightning-off', 'dolphin', 'lightning', 'moon', 'whale', 'leaf', 'pet',
      'umbrella-closed', 'umbrella-opened', 'bull', 'fish', 'rain', 'cloud',
      'plant', 'bear-2', 'cat', 'zoo-store', 'basketball ball', 'luggage',
      'palm', 'ping-pong', 'wave', 'volleyball', 'gym', 'medal', 'flag',
      'goals', 'golf', 'darts', 'fishing', 'cup-sport', 'paris', 'chess',
      'mountains', 'parachute', 'bowling', 'boxing', 'barbell', 'archer',
      'backpack', 'court', 'columns', 'passport', 'burger-hor', 'search',
      'other-goods', 'code-bar-ring', 'crane-1', 'nfc payment icon', 'task',
      'branch-in', 'violin', 'bank-service-security', 'map-2', 'chart-line',
      'equipment', 'bulb'
    ];
    return singleFileIcons.includes(iconName);
  }

  private categorizeIcon(baseName: string): string {
    const categories: { [key: string]: string[] } = {
      'financial': ['money', 'bank', 'card', 'credit', 'debit', 'cash', 'atm', 'wallet', 'deposit', 'currency'],
      'communication': ['phone', 'mail', 'chat', 'message'],
      'navigation': ['home', 'arrows', 'left', 'right', 'up', 'down'],
      'documents': ['docs', 'file', 'case', 'folder'],
      'ui': ['checkmark', 'warning', 'info', 'notification', 'filter', 'grid', 'more', 'bookmark'],
      'social': ['fav', 'star']
    };
    
    for (const [category, keywords] of Object.entries(categories)) {
      if (keywords.some(keyword => baseName.includes(keyword))) {
        return category;
      }
    }
    
    return 'misc';
  }

  private formatDisplayName(baseName: string): string {
    return baseName
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  private generateDescription(baseName: string, category: string): string {
    return `${this.formatDisplayName(baseName)} icon for ${category} purposes`;
  }

  private generateUsage(baseName: string, category: string): string {
    const usages: { [key: string]: string } = {
      'financial': 'Banking apps, payment forms, financial dashboards',
      'communication': 'Contact forms, messaging, social features',
      'navigation': 'Menus, breadcrumbs, directional controls',
      'documents': 'File management, document uploads',
      'ui': 'Interface elements, notifications, controls',
      'social': 'Social features, ratings, favorites'
    };
    
    return usages[category] || 'General purpose applications';
  }

  private updateFilteredIcons() {
    this.filteredIcons = this.allIcons.filter(icon => {
      const matchesCategory = this.selectedCategory === 'all' || icon.category === this.selectedCategory;
      const matchesSearch = !this.searchTerm || 
        icon.displayName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        icon.description.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        icon.name.toLowerCase().includes(this.searchTerm.toLowerCase());
      
      return matchesCategory && matchesSearch;
    });
  }

  onCategoryChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    this.selectedCategory = target.value;
    this.updateFilteredIcons();
  }

  onSearchChange(event: Event) {
    const target = event.target as HTMLInputElement;
    this.searchTerm = target.value;
    this.updateFilteredIcons();
  }

  onIconSelect(iconName: string) {
    this.selectedIcon = iconName;
  }

  onStyleChange(style: IconStyle) {
    this.selectedStyle = style;
  }

  getSelectedIconDefinition(): IconDefinition | null {
    return this.allIcons.find(icon => icon.name === this.selectedIcon) || null;
  }

  getIconContent(icon: IconDefinition, style: IconStyle): SafeHtml | null {
    return icon.content?.[style] || null;
  }

  getSizePixels(): string {
    const sizeMap: { [key: string]: string } = {
      'small': '16px',
      'medium': '24px', 
      'large': '32px',
      'xl': '48px'
    };
    return sizeMap[this.iconSize] || '24px';
  }

  getSizeNumber(): number {
    const sizeMap: { [key: string]: number } = {
      'small': 16,
      'medium': 24, 
      'large': 32,
      'xl': 48
    };
    return sizeMap[this.iconSize] || 24;
  }

  formatCategoryName(category: string): string {
    if (category === 'all') return 'All Categories';
    return category.charAt(0).toUpperCase() + category.slice(1);
  }

  getFilledIconsCount(): number {
    return this.allIcons.filter(icon => icon.styles.includes('filled')).length;
  }

  selectedIconSupportsStyle(style: IconStyle): boolean {
    const selectedIcon = this.getSelectedIconDefinition();
    return selectedIcon ? selectedIcon.styles.includes(style) : true;
  }

  getAngularCode(): string {
    const selectedIcon = this.getSelectedIconDefinition();
    if (!selectedIcon) return '';
    
    const filenames = this.getSelectedIconFilenames();
    const fullPaths = this.getSelectedIconFullPaths();
    
    return `<!-- Using the icon directly -->
<div class="icon-${this.iconSize}" 
     [innerHTML]="iconContent">
</div>

<!-- Icon Information -->
<!-- Name: ${selectedIcon.name} -->
<!-- Display Name: ${selectedIcon.displayName} -->
<!-- Category: ${selectedIcon.category} -->
<!-- Available styles: ${selectedIcon.styles.join(', ')} -->
<!-- Current style: ${this.selectedStyle} -->
<!-- Size: ${this.getSizePixels()} -->

<!-- Asset Path Information -->
<!-- Base Path: ${this.getAssetPath()} -->
<!-- Current Style Filename: ${filenames[this.selectedStyle] || 'N/A'} -->
<!-- Current Style Full Path: ${fullPaths[this.selectedStyle] || 'N/A'} -->

<!-- All Available Files -->
${selectedIcon.styles.map(style => 
  `<!-- ${style}: ${filenames[style] || 'N/A'} -->`
).join('\n')}`;
  }

  copyToClipboard(text: string): void {
    navigator.clipboard.writeText(text).then(() => {
      console.log('Code copied to clipboard');
    }).catch(err => {
      console.error('Failed to copy: ', err);
    });
  }

  // New methods for asset path information
  getAssetPath(): string {
    return '/assets/icons/';
  }

  getFullAssetPath(): string {
    return '/Users/sep-dev/Desktop/msim/mortgage-simulator/src/assets/icons/';
  }

  getIconFilename(iconName: string, style: IconStyle): string {
    return this.getFilenameForStyle(iconName, style);
  }

  getSelectedIconFilenames(): { [key in IconStyle]?: string } {
    const selectedIcon = this.getSelectedIconDefinition();
    if (!selectedIcon || !selectedIcon.filenames) return {};
    return selectedIcon.filenames;
  }

  getSelectedIconFullPaths(): { [key in IconStyle]?: string } {
    const selectedIcon = this.getSelectedIconDefinition();
    if (!selectedIcon || !selectedIcon.filenames) return {};
    
    const fullPaths: { [key in IconStyle]?: string } = {};
    for (const [style, filename] of Object.entries(selectedIcon.filenames)) {
      if (filename) {
        fullPaths[style as IconStyle] = `${this.getAssetPath()}${filename}`;
      }
    }
    return fullPaths;
  }
}
