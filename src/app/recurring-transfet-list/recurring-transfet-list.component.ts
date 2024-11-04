// recurring-transfer-list.component.ts
import {Component, Output, EventEmitter, Input, OnInit} from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';
import {
  faTimes,
  faCalendar,
  faClock,
  faUser,
  faMoneyBill,
  faSearch,
  faFilter,
  faChevronDown
} from '@fortawesome/free-solid-svg-icons';
import {FaIconComponent} from '@fortawesome/angular-fontawesome';
import {FormsModule} from '@angular/forms';
import {CurrencyPipe, DatePipe, NgForOf, NgIf} from '@angular/common';
import {TransactionService} from '../transaction.service';
import {finalize} from 'rxjs';

interface TransfertRecurrent {
  id: number;
  montant: number;
  idEmeteur: number;
  idRecepteur: number;
  jourDuMois: number;
  heure: number;
  minute: number;
  type: 'JOURNALIERE' | 'HEBDOMADAIRE' | 'MENSUELLE';
  statut: 'ACTIF' | 'SUSPENDU' | 'TERMINE';
  emmeteur: { nom: string; telephone: string };
  recepteur: { nom: string; telephone: string };
  createdAt: Date;
  updatedAt: Date;
  dernierExecutionDate?: Date;
  prochainExecutionDate: Date;
}

@Component({
  selector: 'app-recurring-transfer-list',
  template: `
    <div class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" (click)="onClose()">
      <div
        class="fixed inset-x-0 top-0 max-w-5xl mx-auto bg-white rounded-b-2xl shadow-2xl"
        [@slideDown]
        (click)="$event.stopPropagation()"
      >
        <!-- Header avec dégradé -->
        <div class="bg-gradient-to-r from-blue-900 to-blue-700 px-6 py-4 rounded-t-lg">
          <div class="flex items-center justify-between">
            <div>
              <h2 class="text-2xl font-semibold text-white">Transferts Récurrents</h2>
              <p class="text-blue-100 text-sm mt-1">Gérez vos transferts automatiques</p>
            </div>
            <button
              (click)="onClose()"
              class="p-2 hover:bg-white/10 rounded-full transition-colors"
            >
              <fa-icon [icon]="faTimes" class="text-white text-xl"></fa-icon>
            </button>
          </div>
        </div>

        <!-- Section des filtres -->
        <div class="bg-gray-50/80 border-b p-6 space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <!-- Filtre Type -->
            <div class="relative">
              <label class="text-sm font-medium text-gray-700 mb-1 block">
                Type de transfert
              </label>
              <div class="relative">
                <select
                  [(ngModel)]="filters.type"
                  (ngModelChange)="applyFilters()"
                  class="w-full pl-4 pr-10 py-2.5 bg-white border border-gray-200 rounded-lg text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                >
                  <option value="">Tous les types</option>
                  <option value="JOURNALIERE">Journalier</option>
                  <option value="HEBDOMADAIRE">Hebdomadaire</option>
                  <option value="MENSUELLE">Mensuel</option>
                </select>
                <fa-icon
                  [icon]="faChevronDown"
                  class="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none">
                </fa-icon>
              </div>
            </div>

            <!-- Filtre Statut -->
            <div class="relative">
              <label class="text-sm font-medium text-gray-700 mb-1 block">
                Statut
              </label>
              <div class="relative">
                <select
                  [(ngModel)]="filters.statut"
                  (ngModelChange)="applyFilters()"
                  class="w-full pl-4 pr-10 py-2.5 bg-white border border-gray-200 rounded-lg text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                >
                  <option value="">Tous les statuts</option>
                  <option value="ACTIF">Actif</option>
                  <option value="SUSPENDU">Suspendu</option>
                  <option value="TERMINE">Terminé</option>
                </select>
                <fa-icon
                  [icon]="faChevronDown"
                  class="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none">
                </fa-icon>
              </div>
            </div>

            <!-- Barre de recherche -->
            <div class="relative">
              <label class="text-sm font-medium text-gray-700 mb-1 block">
                Recherche
              </label>
              <div class="relative">
                <input
                  type="text"
                  [(ngModel)]="filters.search"
                  (ngModelChange)="applyFilters()"
                  placeholder="Rechercher un bénéficiaire..."
                  class="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                <fa-icon
                  [icon]="faSearch"
                  class="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400">
                </fa-icon>
              </div>
            </div>
          </div>

          <button
            (click)="resetFilters()"
            class="w-full flex items-center justify-center px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-all group"
          >
            <fa-icon [icon]="faFilter" class="h-4 w-4 mr-2 transform group-hover:rotate-180 transition-transform"></fa-icon>
            Réinitialiser les filtres
          </button>
        </div>

        <!-- Liste des transferts -->
        <div class="max-h-[calc(100vh-300px)] overflow-y-auto px-6">
          <div *ngIf="isLoading" class="flex items-center justify-center py-8">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
          <div
            *ngFor="let transfer of filteredTransfers"
            class="my-4 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
          >
            <div class="p-4">
              <div class="flex items-start justify-between">
                <div class="space-y-3">
                  <!-- Info bénéficiaire -->
                  <div class="flex items-center space-x-3">
                    <div class="bg-blue-100 p-2 rounded-full">
                      <fa-icon [icon]="faUser" class="h-5 w-5 text-blue-600"></fa-icon>
                    </div>
                    <div>
                      <h3 class="font-medium text-gray-900">{{ transfer.recepteur.nom }}</h3>
                      <p class="text-sm text-gray-500">{{ transfer.recepteur.telephone }}</p>
                    </div>
                  </div>

                  <!-- Montant et fréquence -->
                  <div class="flex items-center space-x-6">
                    <div class="flex items-center space-x-2">
                      <fa-icon [icon]="faMoneyBill" class="h-5 w-5 text-gray-400"></fa-icon>
                      <span class="font-semibold text-gray-900">
                    {{ transfer.montant | currency:'XOF':'symbol':'1.0-0' }}
                  </span>
                    </div>
                    <div class="flex items-center space-x-2">
                      <fa-icon [icon]="faClock" class="h-5 w-5 text-gray-400"></fa-icon>
                      <span class="text-gray-600">{{ formatSchedule(transfer) }}</span>
                    </div>
                  </div>

                  <!-- Date prochain transfert -->
                  <div class="flex items-center space-x-2 text-sm text-gray-500">
                    <fa-icon [icon]="faCalendar" class="h-4 w-4"></fa-icon>
                    <span>
                  Prochain: {{ transfer.prochainExecutionDate | date:'dd/MM/yyyy HH:mm' }}
                </span>
                  </div>
                </div>

                <!-- Badge statut -->
                <div
                  [class]="getStatusClass(transfer.statut)"
                  class="px-3 py-1 rounded-full text-sm font-medium"
                >
                  {{ transfer.statut }}
                </div>
              </div>
            </div>
          </div>

          <!-- État vide -->
          <div
            *ngIf="filteredTransfers.length === 0"
            class="text-center py-12"
          >
            <div class="bg-gray-100 rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-4">
              <fa-icon [icon]="faSearch" class="h-8 w-8 text-gray-400"></fa-icon>
            </div>
            <h3 class="text-lg font-medium text-gray-900">Aucun transfert trouvé</h3>
            <p class="text-gray-500 mt-1">Modifiez vos filtres pour voir plus de résultats</p>
          </div>
        </div>
      </div>
    </div>`,
  styles: [`
    :host {
      display: block;
    }
  `],
  standalone: true,
  imports: [
    FaIconComponent,
    FormsModule,
    NgForOf,
    CurrencyPipe,
    DatePipe,
    NgIf
  ],
  animations: [
    trigger('slideDown', [
      transition(':enter', [
        style({transform: 'translateY(-100%)'}),
        animate('300ms ease-out', style({transform: 'translateY(0)'}))
      ]),
      transition(':leave', [
        animate('300ms ease-in', style({transform: 'translateY(-100%)'}))
      ])
    ])
  ]
})
export class RecurringTransferListComponent implements OnInit {
  @Input() transfers: TransfertRecurrent[] = [];
  @Output() close = new EventEmitter<void>();
  isLoading:boolean = false;

  constructor(private readonly transactionService : TransactionService) {
  }


  getTransfertRecurrent() {
    this.isLoading = true;
    this.transactionService.getTransfertRecurrent()
      .pipe(
        finalize(() => this.isLoading = false) // Arrête le chargement une fois la requête terminée
      )
      .subscribe({
        next: (data) => this.transfers = data.data,
        error: (error) => console.error('Erreur lors de la récupération des transferts :', error)
      });
  }

  // Icons
  faTimes = faTimes;
  faCalendar = faCalendar;
  faClock = faClock;
  faUser = faUser;
  faMoneyBill = faMoneyBill;

  // Filters
  filters = {
    type: '',
    statut: '',
    search: ''
  };

  get filteredTransfers(): TransfertRecurrent[] {
    return this.transfers.filter(transfer => {
      const matchType = !this.filters.type || transfer.type === this.filters.type;
      const matchStatut = !this.filters.statut || transfer.statut === this.filters.statut;
      const matchSearch = !this.filters.search ||
        transfer.recepteur.nom.toLowerCase().includes(this.filters.search.toLowerCase()) ||
        transfer.recepteur.telephone.includes(this.filters.search);

      return matchType && matchStatut && matchSearch;
    });
  }

  formatSchedule(transfer: TransfertRecurrent): string {
    switch (transfer.type) {
      case 'JOURNALIERE':
        return `Tous les jours à ${this.padZero(transfer.heure)}:${this.padZero(transfer.minute)}`;
      case 'HEBDOMADAIRE':
        return `Chaque semaine à ${this.padZero(transfer.heure)}:${this.padZero(transfer.minute)}`;
      case 'MENSUELLE':
        return `Le ${transfer.jourDuMois} du mois à ${this.padZero(transfer.heure)}:${this.padZero(transfer.minute)}`;
      default:
        return '';
    }
  }

  getStatusClass(statut: string): string {
    switch (statut) {
      case 'ACTIF':
        return 'bg-green-100 text-green-800';
      case 'SUSPENDU':
        return 'bg-yellow-100 text-yellow-800';
      case 'TERMINE':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  padZero(num: number): string {
    return num.toString().padStart(2, '0');
  }

  onClose(): void {
    this.close.emit();
  }

  applyFilters(): void {
    // Les filtres sont appliqués automatiquement via le getter filteredTransfers
  }

  resetFilters(): void {
    this.filters = {
      type: '',
      statut: '',
      search: ''
    };
  }

  ngOnInit(): void {
    this.getTransfertRecurrent();
  }

  protected readonly faSearch = faSearch;
  protected readonly faFilter = faFilter;
  protected readonly faChevronDown = faChevronDown;
}
