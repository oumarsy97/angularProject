// src/components/profile-sidebar/profile-sidebar.component.ts
import { Component, EventEmitter, Input, Output } from '@angular/core';
import {NgForOf, NgIf, NgOptimizedImage} from '@angular/common';
import { User } from '../../types/transaction.interface';

@Component({
  selector: 'app-profile-sidebar',
  standalone: true,
  imports: [NgForOf, NgIf, NgOptimizedImage],
  template: `
    <div class="fixed inset-0 bg-black/50 z-30 transition-opacity duration-300"
         [class.opacity-0]="!isOpen"
         [class.pointer-events-none]="!isOpen"
         (click)="close.emit()">
    </div>

    <div
      class="fixed inset-y-0 left-0 w-[80%] max-w-md bg-white z-40 transform transition-transform duration-300 ease-out"
      [class.translate-x-0]="isOpen"
      [class.translate-x-[-100%]]="!isOpen">

      <div class="p-6 space-y-6">
        <div class="flex items-center justify-between">
          <h2 class="text-2xl font-bold">Profil</h2>
          <button class="p-2 hover:bg-gray-100 rounded-full" (click)="close.emit()">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24"
                 stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <div class="flex items-center gap-4">
          <div class="relative group">
            <div class="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center overflow-hidden">
              <img *ngIf="user.avatar" ngSrc="user.avatar" alt="Profile" class="w-full h-full object-cover">
              <span *ngIf="!user.avatar" class="text-3xl font-bold text-blue-600">{{ getUserInitials() }}</span>
            </div>
            <button class="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full
                         opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path
                  d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"/>
              </svg>
            </button>
          </div>
          <div>
            <h3 class="font-bold text-xl">{{ user.name }}</h3>
            <p class="text-gray-500">{{ user.email }}</p>
            <p class="text-sm text-gray-400">{{ user.phoneNumber }}</p>
          </div>
        </div>

        <div class="space-y-4">
          <div class="bg-blue-50 p-4 rounded-xl">
            <h4 class="font-semibold mb-2">Préférences</h4>
            <div class="flex items-center justify-between">
              <span>Notifications</span>
              <label class="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" [checked]="user.notificationsEnabled" class="sr-only peer"
                       (change)="toggleNotifications()">
                <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300
                          dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700
                          peer-checked:after:translate-x-full peer-checked:after:border-white
                          after:content-[''] after:absolute after:top-[2px] after:left-[2px]
                          after:bg-white after:border-gray-300 after:border after:rounded-full
                          after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600">
                </div>
              </label>
            </div>
          </div>

          <div class="space-y-2">
            <button *ngFor="let option of profileOptions"
                    class="w-full flex items-center gap-4 p-4 hover:bg-gray-50 rounded-xl transition-colors">
              <span class="text-xl">{{ option.icon }}</span>
              <span>{{ option.name }}</span>
            </button>
          </div>
        </div>

        <div class="mt-auto">
          <p class="text-sm text-gray-400 text-center">Version 2.1.0</p>
        </div>
      </div>
    </div>
  `
})
export class ProfileSidebarComponent {
  @Input() isOpen = false;
  @Input() user!: User;
  @Output() close = new EventEmitter<void>();

  profileOptions = [
    { name: 'Paramètres', icon: '⚙️' },
    { name: 'Sécurité', icon: '🔒' },
    { name: 'Aide & Support', icon: '❓' },
    { name: 'Partager', icon: '📤' },
    { name: 'Se déconnecter', icon: '🚪' }
  ];

  getUserInitials(): string {
    return this.user.name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  }

  toggleNotifications() {
    // Implement notification toggle logic
  }
}
