// src/app/core/services/notification.service.ts
import { Injectable, OnDestroy, signal } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Notificat, TypeNotification } from './model/notification.model';
import {WrappedSocket} from './wrapped-socket.service';
import {Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificationService implements OnDestroy {
  private notifications = signal<Notificat[]>([]);
  private unreadCount = signal<number>(0);
  private newNotification = new Subject<Notificat>();
  constructor(private socket: WrappedSocket) {
    this.initializeSocketConnection();
  }

  private initializeSocketConnection() {
    // Connexion avec le token d'authentification
    this.socket.ioSocket.auth = { token: localStorage.getItem('access_token') };
    this.socket.connect();

    // Écouter les notifications existantes
    this.socket.on('notifications', (notifications: Notificat[]) => {
      this.notifications.set(notifications);
      console.log('notifi',this.notifications);
      this.updateUnreadCount();
    });

    // Écouter les nouvelles notifications
    this.socket.on('newNotification', (notification: Notificat) => {
      this.notifications.update(current => [notification, ...current]);
      this.updateUnreadCount();
      this.showNotificationToast(notification);
    });

    // Écouter les mises à jour du compteur
    this.socket.on('unreadCount', (count: number) => {
      this.unreadCount.set(count);
    });

    this.socket.on('newNotification', (notification: Notificat) => {
      this.notifications.update(current => [notification, ...current]);
      this.updateUnreadCount();
      this.newNotification.next(notification); // Émettre la nouvelle notification
    });
  }

  private updateUnreadCount() {
    const count = this.notifications().filter(n => !n.estLue).length;
    this.unreadCount.set(count);
  }

  private showNotificationToast(notification: Notificat) {
    // Vérifier si les notifications sont supportées par le navigateur
    if ('Notification' in window) {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          new Notification(notification.titre, {
            body: notification.message,
            icon: this.getIconForType(notification.type)
          });
        }
      });
    }
  }

  private getIconForType(type: TypeNotification): string {
    const icons = {
      [TypeNotification.TRANSACTION]: 'assets/icons/transaction.png',
      [TypeNotification.SECURITE]: 'assets/icons/security.png',
      [TypeNotification.COMPTE]: 'assets/icons/account.png',
      [TypeNotification.PROMOTION]: 'assets/icons/promotion.png'
    };
    return icons[type];
  }

  markAsRead(notificationId: number) {
    this.socket.emit('markAsRead', { notificationId });
  }

  getNotifications() {
    return this.notifications;
  }

  getUnreadCount() {
    return this.unreadCount;
  }

  ngOnDestroy() {
    this.socket.disconnect();
  }

  // Nouvelle méthode pour observer les notifications
  onNewNotification() {
    console.log('onNewNotification')
    return this.newNotification.asObservable();
  }
}
