import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TransactionService } from "../transaction.service";
import { trigger, transition, style, animate, query, stagger } from '@angular/animations';
import { TransactionDetailComponent } from "../detail-transaction/detail-transaction.component";
import { TransactionFilterComponent } from '../transaction-filter/transaction-filter.component';
import {
  faArrowRight,
  faArrowLeft,
  faMoneyBillTrendUp,
  faMoneyBillWave,
  faCartShopping,
  faArrowRightArrowLeft,
} from '@fortawesome/free-solid-svg-icons';
import {FaIconComponent} from '@fortawesome/angular-fontawesome';

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
  selector: 'app-transactions',
  templateUrl: './transaction-list.component.html',
  imports: [CommonModule, TransactionDetailComponent, TransactionFilterComponent, FaIconComponent],
  standalone: true,
  animations: [
    trigger('listAnimation', [
      transition('* => *', [
        query(':enter', [
          style({ opacity: 0, transform: 'translateX(-15px)' }),
          stagger(100, [
            animate('300ms ease-out', style({ opacity: 1, transform: 'translateX(0)' }))
          ])
        ], { optional: true })
      ])
    ])
  ]
})
export class TransactionsComponent implements OnInit {
  faArrowRight = faArrowRight;
  faArrowLeft = faArrowLeft;
  faMoneyBillTrendUp = faMoneyBillTrendUp;
  faMoneyBillWave = faMoneyBillWave;
  faCartShopping = faCartShopping;
  faArrowRightArrowLeft = faArrowRightArrowLeft;


  private _allTransactions: Transaction[] = [];
  transactions: Transaction[] = [];
  isLoading: boolean = true;
  error: string | null = null;
  currentPage: number = 1;
  itemsPerPage: number = 3;
  showAllTransactions: boolean = false;
  totalTransactions: number = 0;
  selectedTransaction: Transaction | null = null;
  showFilterPage: boolean = false;
  allTransactions: boolean = false;
  user: any = null;

  constructor(private transactionService: TransactionService) {}

  ngOnInit(): void {
    this.loadUserProfile();
    this.loadTransactions();
  }

  loadUserProfile(): void {
    this.transactionService.getProfile().subscribe({
      next: (response) => {
        this.user = response.data;
      },
      error: (error) => {
        console.error('Erreur de chargement du profil utilisateur :', error);
        this.error = 'Impossible de charger le profil. Veuillez réessayer.';
      }
    });
  }

  loadTransactions(page: number = 1): void {
    this.isLoading = true;
    this.error = null;
    this.currentPage = page;

    this.transactionService.getTransactionsbyprofile().subscribe({
      next: (response) => {
        this._allTransactions = response.data;
        this.transactions = [...this._allTransactions];
        this.totalTransactions = this._allTransactions.length;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error fetching transactions:', error);
        this.error = 'Impossible de charger les transactions. Veuillez réessayer.';
        this.isLoading = false;
      }
    });
  }

  onFilteredTransactionsChange(filteredTransactions: Transaction[]): void {
    this.transactions = filteredTransactions;
    this.totalTransactions = filteredTransactions.length;
    this.currentPage = 1;
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

  openTransactionDetail(transaction: Transaction): void {
    this.selectedTransaction = transaction;
  }

  closeTransactionDetail(): void {
    this.selectedTransaction = null;
  }

  toggleShowMore(): void {
    this.showFilterPage = !this.showFilterPage;
    if (!this.showFilterPage) {
      this.transactions = [...this._allTransactions];
      this.totalTransactions = this._allTransactions.length;
    }
  }

  closeTransactionFilter(): void {
    this.showFilterPage = false;
    this.allTransactions = false;
    this.transactions = [...this._allTransactions];
    this.totalTransactions = this._allTransactions.length;
    this.currentPage = 1;
  }

  getStatusDotClass(status: string): string {
    const classes: { [key: string]: string } = {
      'COMPLETEE': 'bg-emerald-400',
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

    return iconMap[type] || 'faArrowLeft';
  }


  calculateTransactionFees(transaction: Transaction): number {
    if (transaction.type === 'RETRAIT') {
      return transaction.montant * 0.02;
    } else if (transaction.type === 'DEPOT') {
      return transaction.montant * 0.01;
    }
    return 0;
  }

  getTransactionStatusColor(statut: string): string {
    switch (statut) {
      case 'SUCCESS':
        return 'green';
      case 'PENDING':
        return 'orange';
      case 'FAILED':
        return 'red';
      default:
        return 'gray';
    }
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

  formatTransactionDate(date: string): string {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(date).toLocaleDateString('fr-FR', options);
  }

  toggleTransactionDetails(transaction: Transaction): void {
    this.selectedTransaction = transaction;
    this.closeTransactionDetail();
    this.openTransactionDetail(transaction);
  }

  getTransactionOperator(transaction: Transaction): string {
    return transaction.operateur ? `${transaction.operateur.nom} ${transaction.operateur.prenom}` : 'N/A';
  }



  refreshTransactions(): void {
    this.loadTransactions(this.currentPage);
  }

  get paginatedTransactions(): Transaction[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.transactions.slice(start, start + this.itemsPerPage);
  }

  get totalPages(): number {
    return Math.ceil(this.totalTransactions / this.itemsPerPage);
  }

  get remainingTransactions(): number {
    return this.totalTransactions - this.itemsPerPage;
  }

  toggleAllTransactions(): void {
    this.allTransactions = true;
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
}
