import { Component, EventEmitter, Input, Output } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';
import { AuthServiceService } from '../auth-service.service';
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
  selector: 'app-sendtoprog',
  templateUrl: './sendtoprog.component.html',
  standalone: true,
  imports: [NgForOf, NgIf, FormsModule],
  animations: [
    trigger('fadeAnimation', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('300ms ease-in', style({ opacity: 1 })),
      ]),
      transition(':leave', [
        animate('300ms ease-out', style({ opacity: 0 })),
      ]),
    ]),
    trigger('slideAnimation', [
      transition(':enter', [
        style({ transform: 'translateX(100%)' }),
        animate('300ms ease-out', style({ transform: 'translateX(0)' })),
      ]),
      transition(':leave', [
        animate('300ms ease-in', style({ transform: 'translateX(100%)' })),
      ]),
    ]),
  ],
})
export class SendtoprogComponent {
  @Input() contact!: Contact;
  @Input() monsolde: number = 0;
  @Input() monId: number = 0;
  @Output() closeComponent = new EventEmitter<void>();

  montant: number = 0; // Total amount to send
  montantRecu: number = 0; // Amount recipient will receive
  frais: number = 0;
  isProgramme: boolean = false;
  frequence: string = 'journalier';
  dateEnvoi: string = '';
  heureEnvoi: string = '';
  errorMessage: string = '';
  minDate: string;
  loading: boolean = false;

  constructor(private readonly transactionService: TransactionService,private readonly alerservice:AlertService ) {
    const today = new Date();
    this.minDate = today.toISOString().split('T')[0];
    // Initialize default time
    const now = new Date();
    this.heureEnvoi = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  }

  calculateMontantTotal() {
    if (this.montantRecu <= 0) {
      this.montantRecu = 0;
      this.frais = 0;
      this.montant = 0;
      return;
    }

    // Calculate fees according to new rules
    if (this.montantRecu <= 500) {
      this.frais = 5; // Fixed fee of 5 FCFA
    } else {
      // 1% of amount with a maximum of 5000 FCFA
      this.frais = Math.min(this.montantRecu * 0.01, 5000);
    }

    // Round fees to nearest integer
    this.frais = Math.round(this.frais);

    // Calculate total amount
    this.montant = this.montantRecu + this.frais;

    this.validateAmount();
  }

  validateAmount() {

    if (this.montantRecu <= 0) {
      this.errorMessage = 'Le montant à recevoir doit être supérieur à 0';
      return false;
    }
    this.errorMessage = '';
    return true;
  }
  isButtonEnabled(): boolean {
    // Validate amount
    if (this.montantRecu <= 0) return false;

    // Validate total amount against balance
    if (this.montant > this.monsolde) return false;

    // Validate date
    if (!this.dateEnvoi) return false;

    // If programmed transfer, validate time
    if (this.isProgramme && !this.heureEnvoi) return false;

    return true;
  }


  isFormValid(): boolean {
    if (!this.validateAmount()) return false;
    if (!this.dateEnvoi) {
      this.errorMessage = 'Veuillez sélectionner une date d\'envoi';
      return false;
    }
    // Make date and time mandatory when isProgramme is true
    if (this.isProgramme) {

      if (!this.heureEnvoi) {
        this.errorMessage = 'Veuillez sélectionner une heure d\'envoi';
        return false;
      }
      return true;

    }

    return true;
  }

  async envoyerArgent() {
    if (!this.isButtonEnabled()) return;

    try {
      this.loading = true;




      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      if(this.isProgramme)  {
        const transfert = {
          idEmetteur: this.monId,
          idRecepteur: this.contact.id,
          montant: this.montant,
          jourDuMois: new Date(this.dateEnvoi).getDate(), // Extrait uniquement le jour (1-31)
          heure: +this.heureEnvoi.split(':')[0],
          minute: +this.heureEnvoi.split(':')[1],
          type: this.isProgramme ? this.frequence : ''
        };
        this.transactionService.transfertProg(transfert).subscribe({
          next: () => {
            this.alerservice.success();
            console.log('Programme d\'envoi enregistré');
            this.closseComponent();
          },
          error: (error) => {
            console.error('Erreur lors de l\'enregistrement du programme d\'envoi:', error);
          }
        })
      }else{
        const transfert = {
          idEmetteur: this.monId,
          idRecepteur: this.contact.id,
          montant: this.montant,
          dateExecution: new Date( this.dateEnvoi)
        };
        this.transactionService.transfertulterieur(transfert).subscribe({
          next: () => {
            this.alerservice.success();
            console.log('Transfert effectué');
            this.closseComponent();
          },
          error: (error) => {
            console.error('Erreur lors du transfert:', error);
          }
        })
      }


      // Close component after success

    } catch (error) {
      this.errorMessage = "Une erreur est survenue lors du transfert";
      console.error('Erreur lors du transfert:', error);
    } finally {
      this.loading = false;
    }
  }

  closseComponent() {
    this.closeComponent.emit();
  }
}
