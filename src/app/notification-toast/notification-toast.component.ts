import { Component, OnInit, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../notification.service';
import { TypeNotification, Notificat } from '../model/notification.model';
import { trigger, transition, style, animate } from '@angular/animations';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-notification-toast',
  standalone: true,
  imports: [CommonModule],
  animations: [
    trigger('toastAnimation', [
      transition(':enter', [
        style({
          opacity: 0,
          transform: 'translateY(-100%)'
        }),
        animate('300ms ease-out', style({
          opacity: 1,
          transform: 'translateY(0)'
        }))
      ]),
      transition(':leave', [
        animate('300ms ease-in', style({
          opacity: 0,
          transform: 'translateY(-100%)'
        }))
      ])
    ])
  ],
  template: `
    <div class="fixed top-0 right-0 left-0 z-50 pointer-events-none">
      <div class="max-w-xl mx-auto p-4 space-y-2">
        @for (toast of activeToasts; track toast.id) {
          <div
            @toastAnimation
            class="bg-white border border-blue-100 shadow-lg rounded-lg p-4 pointer-events-auto flex items-start gap-3 relative"
          >
            <!-- Icône basée sur le type -->
            <div
              [ngClass]="getIconColorClass(toast.type)"
              class="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center"
            >
              <i [class]="getTypeIcon(toast.type)"></i>
            </div>

            <!-- Contenu -->
            <div class="flex-grow">
              <h3 class="font-semibold text-gray-900">{{ toast.titre }}</h3>
              <p class="text-gray-600 text-sm">{{ toast.message }}</p>
            </div>

            <!-- Bouton fermer -->
            <button
              (click)="closeToast(toast)"
              class="absolute top-2 right-2 text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors duration-200"
            >
              ✕
            </button>
          </div>
        }
      </div>
    </div>
  `,
  styles: []
})
export class NotificationToastComponent implements OnInit {
  activeToasts: Notificat[] = [];
  private readonly TOAST_DURATION = 5000; // 5 secondes

  constructor(
    private notificationService: NotificationService,
    private destroyRef: DestroyRef
  ) {}

  ngOnInit() {
    // Écouter les nouvelles notifications
    this.notificationService.onNewNotification()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(notification => {
        this.showToast(notification);
      });
  }

  showToast(notification: Notificat) {
    // Ajouter le toast à la liste
    this.activeToasts = [...this.activeToasts, notification];

    // Supprimer automatiquement après TOAST_DURATION
    setTimeout(() => {
      this.closeToast(notification);
    }, this.TOAST_DURATION);
  }

  closeToast(toast: Notificat) {
    this.activeToasts = this.activeToasts.filter(t => t.id !== toast.id);
  }

  getTypeIcon(type: TypeNotification): string {
    const iconClasses = {
      [TypeNotification.TRANSACTION]: 'i-lucide-credit-card text-lg',
      [TypeNotification.SECURITE]: 'i-lucide-shield text-lg',
      [TypeNotification.COMPTE]: 'i-lucide-user text-lg',
      [TypeNotification.PROMOTION]: 'i-lucide-gift text-lg'
    };
    return iconClasses[type];
  }

  getIconColorClass(type: TypeNotification): string {
    const colorClasses = {
      [TypeNotification.TRANSACTION]: 'bg-green-100 text-green-600',
      [TypeNotification.SECURITE]: 'bg-red-100 text-red-600',
      [TypeNotification.COMPTE]: 'bg-blue-100 text-blue-600',
      [TypeNotification.PROMOTION]: 'bg-purple-100 text-purple-600'
    };
    return colorClasses[type];
  }
}
