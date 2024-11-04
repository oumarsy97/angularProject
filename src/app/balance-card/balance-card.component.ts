// src/components/balance-card/balance-card.component.ts
import { Component, Input } from '@angular/core';
import {DecimalPipe, NgIf} from '@angular/common';

@Component({
  selector: 'app-balance-card',
  standalone: true,
  imports: [DecimalPipe, NgIf],
  template: `
    <div class="bg-white/10 backdrop-blur-md rounded-2xl p-6 text-white border border-white/20
                transform hover:scale-[1.02] transition-all duration-300 cursor-pointer relative overflow-hidden">
      <div class="absolute -right-20 -top-20 w-40 h-40 bg-white/5 rounded-full blur-2xl"></div>
      <div class="absolute -left-20 -bottom-20 w-40 h-40 bg-white/5 rounded-full blur-2xl"></div>

      <div class="flex justify-between items-center mb-3">
        <span class="text-white/80">Solde disponible</span>
        <button (click)="toggleVisibility()"
                class="text-white/80 hover:text-white transition-colors duration-300 flex items-center gap-2">
          <span>{{ isHidden ? 'Afficher' : 'Masquer' }}</span>
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path *ngIf="!isHidden" d="M10 12a2 2 0 100-4 2 2 0 000 4z"/>
            <path *ngIf="!isHidden" fill-rule="evenodd"
                  d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                  clip-rule="evenodd"/>
            <path *ngIf="isHidden" fill-rule="evenodd"
                  d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z"
                  clip-rule="evenodd"/>
            <path *ngIf="isHidden" d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z"/>
          </svg>
        </button>
      </div>

      <div class="relative">
        <div class="text-3xl font-bold tracking-tight" [class.blur-sm]="isHidden">
          {{ solde | number }} FCFA
        </div>
        <div class="mt-2 text-sm text-white/70">
          <span [class.text-green-400]="monthlyChange > 0"
                [class.text-red-400]="monthlyChange < 0">
            {{ monthlyChange > 0 ? '↗' : '↘' }} {{ monthlyChange }}% ce mois
          </span>
        </div>
      </div>

      <div class="flex gap-4 mt-4">
        <button class="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-lg hover:bg-white/30 transition-colors">
          <span>📊</span>
          <span>Statistiques</span>
        </button>
        <button class="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-lg hover:bg-white/30 transition-colors">
          <span>📥</span>
          <span>Relevé</span>
        </button>
      </div>
    </div>
  `
})
export class BalanceCardComponent {
  @Input() solde = 0;
  @Input() monthlyChange = 0;
  isHidden = false;

  toggleVisibility() {
    this.isHidden = !this.isHidden;
  }
}
