import {Component, OnInit, signal, Signal} from '@angular/core';
import { NotificationService } from '../notification.service';
import { DatePipe } from '@angular/common';
import { TypeNotification } from '../model/notification.model';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-notification-list',
  standalone: true,
  imports: [DatePipe],
  animations: [
    trigger('notificationAnimation', [
      transition(':enter', [
        style({
          opacity: 0,
          transform: 'translateY(-50%)'
        }),
        animate('300ms ease-out', style({
          opacity: 1,
          transform: 'translateY(0)'
        }))
      ]),
      transition(':leave', [
        animate('300ms ease-in', style({
          opacity: 0,
          transform: 'translateY(-50%)'
        }))
      ])
    ])
  ],
  template: `
    @if (isVisible()) {
      <div class="fixed top-0 right-0 w-full max-w-sm bg-white border border-blue-100 shadow-lg rounded-lg p-4 m-4">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-bold text-blue-900">
            Notifications
            @if (unreadCount() > 0) {
              <span class="ml-2 text-sm bg-red-500 text-white rounded-full px-2 py-0.5">
                {{ unreadCount() }}
              </span>
            }
          </h2>
          <button
            (click)="toggleVisibility()"
            class="text-gray-600 hover:text-blue-700 hover:bg-blue-50 p-2 rounded-full transition-colors duration-200"
          >
            ✕
          </button>
        </div>

        @if (notifications().length) {
          <div class="space-y-3">
            @for (notification of notifications(); track notification.id) {
              <div
                [@notificationAnimation]
                class="bg-white rounded-md p-3 flex items-start space-x-3 border border-blue-50 hover:bg-blue-50 hover:border-blue-100 transition-all duration-200 cursor-pointer"
                (click)="markAsRead(notification.id)"
              >
                <div class="flex-shrink-0">
                  <i [class]="getTypeIcon(notification.type)"></i>
                </div>
                <div class="flex-grow">
                  <div class="font-semibold text-blue-900">{{ notification.titre }}</div>
                  <div class="text-sm text-gray-700">{{ notification.message }}</div>
                  <div class="text-xs text-blue-600 mt-1">
                    {{ notification.createdAt | date:'short' }}
                  </div>
                </div>
              </div>
            }
          </div>
        } @else {
          <div class="text-blue-800 text-center p-4 bg-blue-50 rounded-md">
            Aucune notification
          </div>
        }
      </div>
    }
  `,
  styles: [`
    :host {
      position: relative;
      z-index: 50;
    }
  `]
})
export class NotificationListComponent implements OnInit {
  notifications: Signal<any[]>;
  unreadCount: Signal<number>;
  isVisible = signal(false);

  constructor(private readonly notificationService: NotificationService) {
    this.notifications = this.notificationService.getNotifications();
    this.unreadCount = this.notificationService.getUnreadCount();
  }

  ngOnInit() {}

  toggleVisibility() {

    this.isVisible.set(!this.isVisible());
  }

  markAsRead(id: number) {
    console.log('id: ' + id);
    this.notificationService.markAsRead(id);
  }

  getTypeIcon(type: TypeNotification): string {
    const iconClasses = {
      [TypeNotification.TRANSACTION]: 'text-green-500 i-lucide-credit-card',
      [TypeNotification.SECURITE]: 'text-red-500 i-lucide-shield',
      [TypeNotification.COMPTE]: 'text-blue-500 i-lucide-user',
      [TypeNotification.PROMOTION]: 'text-purple-500 i-lucide-gift'
    };
    return `text-2xl ${iconClasses[type]}`;
  }
}
