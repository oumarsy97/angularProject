import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';
import { AuthServiceService } from '../auth-service.service';
import { NgForOf, NgIf } from '@angular/common';
import {Contact, SendtoComponent} from '../sendto/sendto.component';
import {TransactionDetailComponent} from '../detail-transaction/detail-transaction.component';
import {TransactionFilterComponent} from '../transaction-filter/transaction-filter.component';
import {FormsModule} from '@angular/forms';
import {SendtoprogComponent} from '../sendtoprog/sendtoprog.component';
import {NotificationToastComponent} from '../notification-toast/notification-toast.component'; // Import Contact interface

@Component({
  selector: 'app-envoye',
  templateUrl: 'envoye.component.html',
  standalone: true,
  imports: [NgIf, NgForOf, SendtoComponent, TransactionDetailComponent, TransactionFilterComponent, FormsModule, SendtoComponent, SendtoprogComponent, NotificationToastComponent],
  animations: [
    trigger('slideFromRight', [
      transition(':enter', [
        style({ transform: 'translateX(100%)' }),
        animate('300ms ease-out', style({ transform: 'translateX(0)' }))
      ]),
      transition(':leave', [
        animate('200ms ease-in', style({ transform: 'translateX(100%)' }))
      ])
    ])
  ]
})
export class EnvoyeComponent implements OnInit {
  @Output() closeComponent = new EventEmitter<void>();

  contacts: any  = [];
  selectedContact: Contact | null = null; // Variable pour le contact sélectionné
  isLoading = false;
  errorMessage: string | null = null;
  monsolde!: number;
  filteredContacts: any;
  searchTerm: string | null = null;
  monId: number = 0;


  constructor(private authService: AuthServiceService) {}

  getContacts(): void {
    this.isLoading = true;
    this.errorMessage = null;

    this.authService.getContacts().subscribe({
      next: (data) => {
        this.contacts = data.data;
        console.log(data.data)
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'Une erreur est survenue lors de la récupération des contacts.';
        this.isLoading = false;
        console.error(error);
      }
    });
  }
  getSolde(): void {
    this.isLoading = true;
    this.errorMessage = null;

    this.authService.getProfile().subscribe({
      next: (data) => {
        this.monsolde = data.data.montant;
        this.monId = data.data.id;
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'Une erreur est survenue lors de la récupération du solde.';
        this.isLoading = false;
        console.error(error);
      }
    });
  }

  selectContact(contact: Contact): void {
    this.selectedContact = contact; // Définir le contact sélectionné
  }

  closeSendtoComponent(): void {
    this.selectedContact = null; // Réinitialiser le contact sélectionné pour fermer SendtoComponent
  }

  closeEnvoyeComponent(): void {
    this.closeComponent.emit();
  }

  ngOnInit(): void {
    this.getContacts();
    this.getSolde();
  }
}
