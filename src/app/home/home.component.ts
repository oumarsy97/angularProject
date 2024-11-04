import {Component, OnInit, Signal} from '@angular/core';
import { DatePipe, DecimalPipe, NgClass, NgForOf, NgStyle, NgIf } from '@angular/common';
import { trigger, transition, style, animate, state } from '@angular/animations';
import { AuthServiceService } from '../auth-service.service';
import { BalanceComponent } from '../balance/balance.component';
import { ProfileComponent } from '../profile/profile.component';
import { TransactionsComponent } from '../transaction-list/transaction-list.component';
import { Router } from '@angular/router';
import {EnvoyeprogComponent} from '../envoyeprog/envoyeprog.component';
import {NotificationListComponent} from '../notification-list/notification-list.component';
import {NotificationService} from '../notification.service';
import {NotificationToastComponent} from '../notification-toast/notification-toast.component';
import {OrangeMoneyIconComponent} from '../orange-money-icon/orange-money-icon.component';
import {RecurringTransferListComponent} from '../recurring-transfet-list/recurring-transfet-list.component';
import { EnvoyeOmComponent} from '../envoye-om/envoye-om.component';
import {EnvoyeComponent} from '../envoye/envoye.component';

interface ProfileOption {
  id: string;
  name: string;
  icon: string;
  gradient: string;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  animations: [
    trigger('slideFromRight', [
      state('hidden', style({
        transform: 'translateX(100%)',
        opacity: 0
      })),
      state('visible', style({
        transform: 'translateX(0)',
        opacity: 1
      })),
      transition('hidden => visible', animate('300ms cubic-bezier(0.4, 0, 0.2, 1)')),
      transition('visible => hidden', animate('200ms cubic-bezier(0.4, 0, 0.2, 1)'))
    ]),
    trigger('overlayAnimation', [
      state('hidden', style({
        opacity: 0,
        visibility: 'hidden'
      })),
      state('visible', style({
        opacity: 1,
        visibility: 'visible'
      })),
      transition('hidden => visible', animate('300ms cubic-bezier(0.4, 0, 0.2, 1)')),
      transition('visible => hidden', animate('200ms cubic-bezier(0.4, 0, 0.2, 1)'))
    ]),
    trigger('fadeInUp', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('500ms cubic-bezier(0.4, 0, 0.2, 1)', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ]),
    trigger('listAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('{{delay}}ms cubic-bezier(0.4, 0, 0.2, 1)', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ]),
    trigger('slideDown', [
      transition(':enter', [
        style({ transform: 'translateY(-100%)' }),
        animate('500ms cubic-bezier(0.4, 0, 0.2, 1)', style({ transform: 'translateY(0)' }))
      ]),
      transition(':leave', [
        animate('300ms cubic-bezier(0.4, 0, 0.2, 1)', style({ transform: 'translateY(-100%)' }))
      ])
    ])
  ],
  standalone: true,
  imports: [
    NgForOf,
    DecimalPipe,
    DatePipe,
    NgClass,
    NgStyle,
    NgIf,
    BalanceComponent,
    ProfileComponent,
    TransactionsComponent,
    EnvoyeprogComponent,
    NotificationListComponent,
    NotificationToastComponent,
    OrangeMoneyIconComponent,
    RecurringTransferListComponent,

    EnvoyeOmComponent,
    EnvoyeComponent,

  ]
})
export class HomeComponent implements OnInit {
  userName = '';
  userId = 'EU-23451';
  solde = 0;
  isProfileOpen = false;
  showAudioPub = true;
  showBalance = true;
  qrCode: String = '';
  currency = 'FCFA';
  showSendForm = false;
  showEnvoyeComponent = false;
  showEnvoyeOMComponent:boolean = false;
   showScheduledSend= false;
  unreadCount!: Signal<number>;
  private showOrangeMoney: boolean =false;



  constructor(
    private readonly authServie: AuthServiceService,
    private readonly router: Router,
    private notificationService:NotificationService
  ) {
    this.unreadCount = this.notificationService.getUnreadCount();
  }

  profileOptions: ProfileOption[] = [
    {
      id: 'profile',
      name: 'Mon Profil',
      icon: '👤',
      gradient: 'from-blue-100 to-blue-200'
    },
    {
      id: 'trfp',
      name: 'Transferts Programmés',
      icon: '📅',
      gradient: 'from-blue-100 to-blue-200'
    },
    {
      id: 'settings',
      name: 'Paramètres',
      icon: '⚙️',
      gradient: 'from-blue-100 to-blue-200'
    },

    {
      id: 'logout',
      name: 'Se déconnecter',
      icon: '🚪',
      gradient: 'from-blue-100 to-blue-200'
    }
  ];

  async onProfileOptionSelected(option: ProfileOption): Promise<void> {
    switch (option.id) {
      case 'logout':
        try {
          await this.handleLogout();
        } catch (error) {
          console.error('Erreur lors de la déconnexion:', error);
          // Gérer l'erreur (afficher un message à l'utilisateur par exemple)
        }
        break;
        case 'trfp':
          this.showRecurringTransfet = !this.showRecurringTransfet;
          break;

      case 'settings':
        this.router.navigate(['/settings']);
        break;

      case 'profile':
        await this.router.navigate(['/profile']);
        break;
    }
  }

  actions = [
    {
      name: 'Envoyé',
      icon: '📤',
      action: () => this.showEnvoyeComponent = true
    },
    {
      name: 'Envoyé programmé',
      icon: '📅',
      action: () => this.showScheduledSend = true
    },
    {
      name: 'Orange Money',
      icon: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <path d="M15 85 L45 55 L45 75 L75 75 L75 85 L45 85 L45 105 Z" fill="black" transform="rotate(-45, 45, 55)"/>
      <path d="M85 15 L55 45 L55 25 L25 25 L25 15 L55 15 L55 -5 Z" fill="#FF7900" transform="rotate(-45, 55, 45)"/>
    </svg>`,
      action: () => this.showEnvoyeOMComponent = true
    },
    {
      name: 'Paiement',
      icon: '💳',
      action: () => console.log('Paiement clicked')
    },
    {
      name: 'Recharge',
      icon: '📱',
      action: () => console.log('Recharge clicked')
    }
  ];
  showRecurringTransfet: boolean = false;

  handleActionClick(action: any): void {
    action.action();
  }

  trackByName(index: number, action: any): string {
    return action.name;
  }

  ngOnInit() {
    setTimeout(() => {
      this.showAudioPub = true;
    }, 3000);
    this.loadUserProfile();
  }

  getUserInitials(): string {
    return this.userName
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  }

  closeAudioPub() {
    this.showAudioPub = false;
  }

  toggleProfile() {
    this.isProfileOpen = !this.isProfileOpen;
  }

  loadUserProfile() {
    this.authServie.getProfile().subscribe((userData) => {
      console.log(userData)
      this.userName = userData.data.client.prenom + ' ' + userData.data.client.nom;
      this.solde = userData.data.montant;
      this.qrCode = userData.data.qrcode;
    });
  }

  onCloseProfile() {
    this.isProfileOpen = false;
  }

  private async handleLogout(): Promise<void> {
    try {
      // 1. Fermer le menu profile
      this.isProfileOpen = false;

      // 2. Déconnecter l'utilisateur via le service d'authentification
      await this.authServie.logout();

      // 3. Nettoyer les données locales si nécessaire
      localStorage.clear(); // Ou cibler des clés spécifiques
      sessionStorage.clear();

      // 4. Rediriger vers la page de connexion
      await this.router.navigate(['/login']);

    } catch (error) {
      // Remonter l'erreur pour la gérer dans le composant
      throw error;
    }
  }



  onSendClicke() {
    this.showSendForm = true;
  }

  onSendFormClose() {
    this.showSendForm = false;
  }

  onSendClicked() {
    this.showEnvoyeComponent = true;
    console.log('onSendClicked')
  }
  onshowScheduledSendClose(){
  this.showScheduledSend = false;
  }
  onOrangeMoneyClose() {
    this.showOrangeMoney = false;
  }
  onshowEnvoyeComponentClose() {
    this.showEnvoyeComponent = false;
  }

  onshowEnvoyeOMComponentClose() {
    this.showEnvoyeOMComponent = false;
  }

  onRecurringTransfetClose() {
    this.showRecurringTransfet = false;
  }
}
