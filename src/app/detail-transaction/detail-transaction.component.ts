import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { trigger, transition, style, animate } from '@angular/animations';

interface Transaction {
  id: number;
  montant: number;
  type: string;
  statut: string;
  frais: number;
  telephone: string;
  createdAt: string;
  reference: string;
  compte: {
    Client: any;
    telephone: string;
    nom: string;
    prenom: string;
  };
  emeteur?: {
    Client: any;
    id: number;
    telephone: string;
    nom: string;
    prenom: string;
  };
  operateur?: {
    nom: string;
    prenom: string;
  };
}

@Component({
  selector: 'app-transaction-detail',
  standalone: true,
  imports: [CommonModule],
  animations: [
    trigger('slideInOut', [
      transition(':enter', [
        style({ transform: 'translateX(100%)' }),
        animate('300ms ease-out', style({ transform: 'translateX(0)' }))
      ]),
      transition(':leave', [
        animate('300ms ease-in', style({ transform: 'translateX(100%)' }))
      ])
    ])
  ],
  template: `
    <div class="fixed inset-0 bg-black bg-opacity-50 z-40" (click)="close()">
      <div class="absolute inset-y-0 right-0 w-full max-w-2xl bg-white shadow-xl z-50"
           (click)="$event.stopPropagation()"
           @slideInOut>
        <!-- Header -->
        <div class="sticky top-0 bg-[#001B5D] border-b border-gray-200 px-6 py-4 flex items-center">
          <button (click)="close()"
                  class="mr-4 p-2 rounded-full hover:bg-gray-100 transition-colors duration-200">
            <i class="fas fa-times text-white"></i>
          </button>
          <h2 class="text-xl font-semibold text-white">Détails de la transaction</h2>
        </div>

        <!-- Content -->
        <div class="p-6">
          <!-- Transaction Icon and Type -->
          <div class="flex items-center gap-4 mb-8">
            <div [ngClass]="getTransactionColorClass(transaction.type)"
                 class="w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg">
              <i [ngClass]="getTransactionIcon(transaction.type) + ' text-white text-3xl'"></i>
            </div>
            <div>
              <h3 class="text-2xl font-bold text-[#001B5D]">{{ transaction.type }}</h3>
              <div class="flex items-center gap-2 mt-1">
                <span class="text-sm px-3 py-1 rounded-full"
                      [ngClass]="getStatusClass(transaction.statut)">
                  {{ transaction.statut }}
                </span>
              </div>
            </div>
          </div>

          <!-- Transaction Details -->
          <div class="space-y-6">
            <!-- Amount -->
            <div class="bg-blue-50 p-4 rounded-xl">
              <div class="text-sm text-[#001B5D] mb-1">Montant</div>
              <div class="text-2xl font-bold" [ngClass]="getAmountColorClass(transaction.type)">
                {{ formatAmount(transaction.montant, transaction.type) }}
              </div>
            </div>

            <!-- Details Grid -->
            <div class="grid grid-cols-2 gap-4">
              <!-- Date -->
              <div class="bg-white p-4 rounded-xl border border-gray-100">
                <div class="text-sm text-gray-500 mb-1">Date</div>
                <div class="font-medium">{{ formatDate(transaction.createdAt) }}</div>
              </div>

              <!-- Reference -->
              <div class="bg-white p-4 rounded-xl border border-gray-100">
                <div class="text-sm text-gray-500 mb-1">Référence</div>
                <div class="font-medium">{{ transaction.reference }}</div>
              </div>

              <!-- Emetteur ou Opérateur -->
              <div class="bg-white p-4 rounded-xl border border-gray-100">
                <div class="text-sm text-gray-500 mb-1">Emetteur / Opérateur</div>
                <div class="font-medium">
                  <ng-container *ngIf="isTransfer(transaction.type)">
                    <ng-container *ngIf="transaction.emeteur?.id === user.id; else receivedTemplate">
                      {{ transaction.telephone }} {{transaction.compte.Client[0]?.prenom+' '+ transaction.compte.Client[0]?.nom }} (Envoi)
                    </ng-container>
                    <ng-template #receivedTemplate>
                      {{ transaction.emeteur?.Client[0]?.prenom }} {{ transaction.emeteur?.Client[0]?.nom }} (Réception)
                    </ng-template>
                  </ng-container>
                  <ng-container *ngIf="!isTransfer(transaction.type)">
                    {{ transaction.operateur ? (transaction.operateur.prenom + ' ' + transaction.operateur.nom) : '' }}
                  </ng-container>
                </div>
              </div>

              <!-- Fees -->
              <div class="bg-white p-4 rounded-xl border border-gray-100">
                <div class="text-sm text-gray-500 mb-1">Frais</div>
                <div class="font-medium">{{ formatAmount(transaction.frais, 'FRAIS') }}</div>
              </div>
            </div>

            <!-- Total -->
            <div class="mt-8 pt-6 border-t border-gray-100">
              <div class="flex justify-between items-center">
                <span class="text-gray-600">Total (avec frais)</span>
                <span class="text-xl font-bold" [ngClass]="getAmountColorClass(transaction.type)">
                  {{ formatAmount(transaction.montant + transaction.frais, transaction.type) }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class TransactionDetailComponent {
  @Input() transaction!: Transaction;
  @Output() closeDetail = new EventEmitter<void>();
  @Input() user!: { id: number; nom: string; prenom: string }; // Ajout du type utilisateur

  getTransactionIcon(type: string): string {
    const icons: { [key: string]: string } = {
      'DEPOT': 'fas fa-arrow-down',
      'RETRAIT': 'fas fa-arrow-up',
      'PAIEMENT': 'fas fa-credit-card',
      'TRANSFERT': 'fas fa-exchange-alt',
      'TRANSFER_SENT': 'fas fa-long-arrow-alt-right',
      'TRANSFER_RECEIVED': 'fas fa-long-arrow-alt-left',
      'TRANSFER': 'fas fa-sync-alt'
    };
    return icons[type] || 'fas fa-question';
  }

  getTransactionColorClass(type: string): string {
    const classes: { [key: string]: string } = {
      'DEPOT': 'bg-emerald-700',
      'RETRAIT': 'bg-red-600',
      'PAIEMENT': 'bg-blue-400',
      'TRANSFERT': 'bg-blue-600',
      'TRANSFER_SENT': 'bg-red-500',
      'TRANSFER_RECEIVED': 'bg-emerald-700',
      'TRANSFER': 'bg-blue-500'
    };
    return `${classes[type] || 'bg-gray-500'} bg-opacity-90 backdrop-blur-sm`;
  }

  getAmountColorClass(type: string): string {
    switch (type) {
      case 'DEPOT':
        return 'text-emerald-700 font-medium';
      case 'RETRAIT':
      case 'TRANSFER_SENT':
        return 'text-red-700 font-medium';
      case 'TRANSFER_RECEIVED':
        return 'text-emerald-700 font-medium';
      case 'TRANSFERT':
        return 'text-blue-600 font-medium';
      default:
        return 'text-gray-600 font-medium';
    }
  }

  getStatusClass(status: string): string {
    const classes: { [key: string]: string } = {
      'COMPLETE': 'bg-emerald-100 text-emerald-700',
      'ENATTENTE': 'bg-amber-100 text-amber-700',
      'ECHEC': 'bg-red-100 text-red-700'
    };
    return classes[status] || 'bg-gray-100 text-gray-700';
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  formatAmount(amount: number, type: string): string {
    const formattedAmount = new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      maximumFractionDigits: 0
    }).format(Math.abs(amount));

    // Ajouter le signe négatif pour les retraits et transferts sortants
    if (type === 'RETRAIT' || type === 'TRANSFER_SENT') {
      return `-${formattedAmount}`;
    }
    return formattedAmount;
  }

  close(): void {
    this.closeDetail.emit();
  }

  isTransfer(type: string): boolean {
    return type === 'TRANSFERT' || type === 'TRANSFER_SENT' || type === 'TRANSFER_RECEIVED';
  }
}
