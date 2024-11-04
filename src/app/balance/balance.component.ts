import { Component, Input } from '@angular/core';
import { DecimalPipe, NgIf, NgOptimizedImage, NgStyle } from '@angular/common';

@Component({
  selector: 'app-balance',
  template: `
    <div class="bg-blue-50 rounded-lg shadow p-3 transform hover:scale-[1.02] transition-all duration-300 cursor-pointer border border-blue-200">
      <!-- En-tête avec solde -->
      <div class="flex justify-between items-center mb-2">
        <span class="text-[#001B5D] text-xs">Solde disponible</span>
        <button (click)="toggleBalanceVisibility()"
                class="hover:bg-blue-100 p-1 rounded-full transition-colors duration-300">
  <span class="text-sm">
    <ng-container *ngIf="showBalance; else hiddenIcon">
      <!-- Rond ovale -->
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-blue-950 bg-blue-150" fill="currentColor" viewBox="0 0 24 24">
        <ellipse cx="12" cy="12" rx="8" ry="5" stroke="currentColor" stroke-width="2" fill="none" />
      </svg>
    </ng-container>
    <ng-template #hiddenIcon>
      <!-- Ovale barré -->
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-blue-950" fill="currentColor" viewBox="0 0 24 24">
        <ellipse cx="12" cy="12" rx="8" ry="5" stroke="currentColor" stroke-width="2" fill="none" />
        <line x1="4" y1="4" x2="20" y2="20" stroke="currentColor" stroke-width="2" />
      </svg>
    </ng-template>
  </span>
        </button>

      </div>

      <div class="text-xl font-bold tracking-tight text-center text-[#001B5D] mb-2">
        <ng-container *ngIf="showBalance; else maskedBalance">
          {{ solde | number }} FCFA
        </ng-container>
        <ng-template #maskedBalance>
          <span class="text-xl">●●●●●●</span>
        </ng-template>
      </div>

      <!-- QR Code plus petit -->
      <div class="flex items-center gap-2">
        <div class="relative w-1/4 aspect-square bg-blue-100 rounded-lg overflow-hidden">
          <img [src]="code"
               alt="QR Code"
               class="w-full h-full object-cover absolute inset-0"
               [ngStyle]="{
                 'filter': 'brightness(1.1) contrast(1.1)'
               }"/>
          <div class="absolute inset-0 bg-gradient-to-t from-blue-100/50 to-transparent"></div>
        </div>
        <span class="text-[10px] text-[#001B5D]/70 flex-1">
          Scannez pour effectuer un paiement
        </span>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      width: 100%;
    }
  `],
  imports: [
    DecimalPipe,
    NgIf,
    NgOptimizedImage,
    NgStyle
  ],
  standalone: true
})
export class BalanceComponent {
  @Input() solde: number = 0;
  @Input() code: String = '';
  showBalance: boolean = true;

  toggleBalanceVisibility(): void {
    this.showBalance = !this.showBalance;
  }
}
