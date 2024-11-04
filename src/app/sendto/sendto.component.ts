// sendto.component.ts
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';
import { NgForOf, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {TransactionService} from '../transaction.service';
import {AlertService} from '../alert-service.service';

export interface Contact {
  id: number;
  Client: [{nom: string; prenom: string}];
  telephone: string;
}

@Component({
  selector: 'app-sendto',
  templateUrl: './sendto.component.html',
  standalone: true,
  imports: [NgForOf, NgIf, FormsModule],
  animations: [
    trigger('fadeAnimation', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('300ms ease-out', style({ opacity: 1 }))
      ]),
      transition(':leave', [
        animate('200ms ease-in', style({ opacity: 0 }))
      ])
    ]),
    trigger('slideAnimation', [
      transition(':enter', [
        style({ transform: 'translateX(100%)', opacity: 0 }),
        animate('400ms cubic-bezier(0.4, 0, 0.2, 1)',
          style({ transform: 'translateX(0)', opacity: 1 }))
      ]),
      transition(':leave', [
        animate('300ms cubic-bezier(0.4, 0, 0.2, 1)',
          style({ transform: 'translateX(100%)', opacity: 0 }))
      ])
    ])
  ]
})
export class SendtoComponent {
  @Input() contact!: Contact;
  @Input() monsolde: number = 0;
  @Input() monId: number = 0;

  @Output() closeComponent = new EventEmitter<void>();

  montantRecu: number = 0;
  montant: number = 0;
  frais: number = 0;
  errorMessage: string = '';
  loading: boolean = false;

  constructor(private readonly transactionService: TransactionService,private readonly alertSrvice:AlertService) {}

  calculateMontantTotal() {
    if (this.montantRecu < 0) {
      this.montantRecu = 0;
      return;
    }

    // Calcul des frais selon les règles spécifiées
    if (this.montantRecu <= 500) {
      this.frais = 5;
    } else {
      this.frais = Math.min(this.montantRecu * 0.01, 5000);
    }

    // Calcul du montant total
    this.montant = this.montantRecu + this.frais;
    this.validateAmount();
  }

  validateAmount() {
    if (this.montant > this.monsolde) {
      this.errorMessage = `Solde insuffisant. Votre solde actuel est de ${this.monsolde} FCFA`;
      return false;
    }
    if (this.montantRecu <= 0) {
      this.errorMessage = 'Le montant doit être supérieur à 0';
      return false;
    }
    this.errorMessage = '';
    return true;
  }

  isFormValid(): boolean {
    return this.validateAmount();
  }

  async envoyerArgent() {
    if (!this.isFormValid()) return;

    try {
      this.loading = true;
      const transfert = {
        idEmetteur: this.monId,
        idRecepteur: this.contact.id,
        montant: this.montant,
      };

      // Simuler un appel API
      await new Promise(resolve => setTimeout(resolve, 1000));
     this.transactionService.transfert(transfert).subscribe({
        next: () => {
          this.errorMessage = 'Transfert réussi';
          this.loading = false;
          this.alertSrvice.success();
        },
        error: (error) => {
          this.errorMessage = 'Une erreur est survenue lors du transfert';
          this.loading = false;
          this.alertSrvice.error();
          console.error('Erreur lors du transfert:', error);
          this.loading = false;
        }
      });

      console.log('Transfert effectué:', transfert);

      // Fermer le composant après succès
      this.closseComponent();
    } catch (error) {
      this.errorMessage = "Une erreur est survenue lors du transfert";
      await this.alertSrvice.error()
      console.error('Erreur lors du transfert:', error);
    } finally {
      this.loading = false;
    }
  }

  closseComponent() {
    this.closeComponent.emit();
  }
}
