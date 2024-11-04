import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { trigger, transition, style, animate } from '@angular/animations';
import { TransactionService } from '../transaction.service';
import { TransactionDetailComponent } from '../detail-transaction/detail-transaction.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faMoneyBillTransfer,
  faArrowRight,
  faArrowLeft,
  faMoneyBillTrendUp,
  faMoneyBillWave,
  faCartShopping,
  faArrowRightArrowLeft,
  faCircleQuestion,
  faClose,
  faFilter,
  faCalendar,
  faPhone,
  faCircleDot,
  faChevronLeft,
  faEye
} from '@fortawesome/free-solid-svg-icons';

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

interface FilterState {
  dateDebut: string;
  dateFin: string;
  telephone: string;
  status: string;
}

@Component({
  selector: 'app-transaction-filter',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TransactionDetailComponent,
    FontAwesomeModule
  ],
  animations: [
    trigger('slideInOut', [
      transition(':enter', [
        style({ transform: 'translateX(100%)' }),
        animate('300ms ease-out', style({ transform: 'translateX(0%)' }))
      ]),
      transition(':leave', [
        animate('300ms ease-in', style({ transform: 'translateX(100%)' }))
      ])
    ])
  ],
  templateUrl: './transaction-filter.component.html',
  styles: [`
    :host {
      display: block;
      position: fixed;
      top: 0;
      right: 0;
      bottom: 0;
      width: 100%;
      background-color: rgba(0, 0, 0, 0.5);
      z-index: 1000;
    }
  `]
})
export class TransactionFilterComponent implements OnInit {
  // Font Awesome icons
  faMoneyBillTransfer = faMoneyBillTransfer;
  faArrowRight = faArrowRight;
  faArrowLeft = faArrowLeft;
  faMoneyBillTrendUp = faMoneyBillTrendUp;
  faMoneyBillWave = faMoneyBillWave;
  faCartShopping = faCartShopping;
  faArrowRightArrowLeft = faArrowRightArrowLeft;
  faCircleQuestion = faCircleQuestion;
  faClose = faClose;
  faFilter = faFilter;
  faCalendar = faCalendar;
  faPhone = faPhone;
  faCircleDot = faCircleDot;
  faChevronLeft = faChevronLeft;
  faEye = faEye;

  allTransactions: Transaction[] = [];
  transactions: Transaction[] = [];
  @Output() closeFilter = new EventEmitter<void>();

  filters: FilterState = {
    dateDebut: '',
    dateFin: '',
    telephone: '',
    status: ''
  };

  isLoading: boolean = true;
  error: string | null = null;
  selectedTransaction: Transaction | null = null;
  user: any = null;

  constructor(private transactionService: TransactionService) {
    this.transactionService.getProfile().pipe().subscribe({
      next: (response) => {
        this.user = response.data;
        this.loadTransactions();
      },
      error: (error) => {
        console.error('Error fetching profile:', error);
        this.error = 'Impossible de charger votre profile. Veuillez réessayer.';
      }
    });
  }

  ngOnInit() {
    this.loadTransactions();
  }

  loadTransactions(page: number = 1): void {
    this.isLoading = true;
    this.error = null;

    this.transactionService.getTransactionsbyprofile().subscribe({
      next: (response) => {
        this.allTransactions = response.data;
        this.applyFilters();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error fetching transactions:', error);
        this.error = 'Impossible de charger les transactions. Veuillez réessayer.';
        this.isLoading = false;
      }
    });
  }

  applyFilters() {
    this.transactions = this.allTransactions.filter(transaction => {
      let matches = true;

      if (this.filters.telephone.trim()) {
        const searchTerm = this.filters.telephone.toLowerCase().trim();
        matches = matches && (
          transaction.compte.telephone?.toLowerCase().includes(searchTerm) ||
          transaction.emeteur?.telephone?.toLowerCase().includes(searchTerm) ||
          transaction.telephone?.toLowerCase().includes(searchTerm)
        );
      }

      if (this.filters.status) {
        matches = matches && transaction.statut === this.filters.status;
      }

      if (this.filters.dateDebut) {
        const dateDebut = new Date(this.filters.dateDebut);
        dateDebut.setHours(0, 0, 0, 0);
        const transactionDate = new Date(transaction.createdAt);
        matches = matches && transactionDate >= dateDebut;
      }

      if (this.filters.dateFin) {
        const dateFin = new Date(this.filters.dateFin);
        dateFin.setHours(23, 59, 59, 999);
        const transactionDate = new Date(transaction.createdAt);
        matches = matches && transactionDate <= dateFin;
      }

      return matches;
    });
  }

  resetFilters() {
    this.filters = {
      dateDebut: '',
      dateFin: '',
      telephone: '',
      status: ''
    };
    this.transactions = [...this.allTransactions];
  }

  getTransactionIcon(type: string, transaction: Transaction): any {
    if ( type === 'TRANSFERT') {
      if (transaction.emeteur && this.user) {
        if (transaction.emeteur.id === this.user.id) {
          return this.faArrowLeft;
        } else {
          return this.faArrowRight;
        }
      }
      return this.faArrowRightArrowLeft;
    }

    const iconMap: { [key: string]: any } = {
      'DEPOT': this.faMoneyBillTrendUp,
      'RETRAIT': this.faMoneyBillWave,
      'PAIEMENT': this.faCartShopping
    };

    return iconMap[type] || this.faCircleQuestion;
  }

  getAmountColorClass(type: string, transaction: Transaction): string {
    if (type === 'TRANSFER' || type === 'TRANSFERT') {
      if (transaction.emeteur && this.user) {
        return transaction.emeteur.id === this.user.id
          ? 'text-red-600 font-medium'
          : 'text-emerald-600 font-medium';
      }
    }

    switch (type) {
      case 'DEPOT':
        return 'text-emerald-600 font-medium';
      case 'RETRAIT':
        return 'text-red-600 font-medium';
      default:
        return 'text-blue-600 font-medium';
    }
  }

  getStatusDotClass(status: string): string {
    const classes: { [key: string]: string } = {
      'COMPLETE': 'bg-emerald-400',
      'ENATTENTE': 'bg-amber-400',
      'ECHEC': 'bg-red-400'
    };
    return `${classes[status] || 'bg-gray-400'} animate-pulse`;
  }

  getTransactionColorClass(type: string, transaction: Transaction): string {
    if (type === 'TRANSFER' || type === 'TRANSFERT') {
      if (transaction.emeteur && this.user) {
        return transaction.emeteur.id === this.user.id
          ? 'bg-orange-500'
          : 'bg-green-500';
      }
      return 'bg-blue-500';
    }

    const classes: { [key: string]: string } = {
      'DEPOT': 'bg-emerald-500',
      'RETRAIT': 'bg-red-600',
      'PAIEMENT': 'bg-violet-500'
    };
    return `${classes[type] || 'bg-gray-500'} bg-opacity-90 backdrop-blur-sm`;
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

  formatAmount(amount: number, type: string, transaction: Transaction): string {
    const formattedAmount = new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      maximumFractionDigits: 0
    }).format(Math.abs(amount));

    if (type === 'TRANSFER' || type === 'TRANSFERT') {
      if (transaction.emeteur && this.user && transaction.emeteur.id === this.user.id) {
        return `-${formattedAmount}`;
      }
      return formattedAmount;
    }

    if (type === 'RETRAIT') {
      return `-${formattedAmount}`;
    }
    return formattedAmount;
  }

  close() {
    this.closeFilter.emit();
  }

  goBack() {
    this.closeFilter.emit();
  }

  openTransactionDetail(transaction: Transaction) {
    this.selectedTransaction = transaction;
  }

  closeTransactionDetail(): void {
    this.selectedTransaction = null;
  }
}
