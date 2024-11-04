import { Component, Input, Output, EventEmitter } from '@angular/core';
import { trigger, transition, style, animate, state } from '@angular/animations';
import { NgForOf } from '@angular/common';

interface ProfileOption {
  id: string;
  name: string;
  icon: string;
  gradient: string;
}

@Component({
  selector: 'app-profile',
  template: `
    <!-- Overlay -->
    <div class="fixed inset-0 bg-blue-950/50 z-30"
         [@overlayAnimation]="isOpen ? 'visible' : 'hidden'"
         (click)="close()">
    </div>

    <!-- Panel -->
    <div class="fixed inset-y-0 left-0 w-[80%] max-w-md bg-white z-40"
         [@slideAnimation]="isOpen ? 'visible' : 'hidden'">

      <div class="p-6 space-y-6">
        <!-- En-tête du profil -->
        <div class="flex items-center justify-between">
          <h2 class="text-2xl font-bold text-blue-950">Profil</h2>
          <button class="p-2 hover:bg-blue-50 rounded-full transition-all duration-300 hover:rotate-90"
                  (click)="close()">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-gray-600" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <!-- Info utilisateur avec animation -->
        <div class="flex items-center gap-4" [@fadeInUp]>
          <div class="w-20 h-20 rounded-full bg-gradient-to-br from-blue-100 to-blue-200
                      flex items-center justify-center transform hover:scale-105 transition-all duration-300
                      shadow-lg hover:shadow-xl">
            <span class="text-3xl font-bold text-blue-950">{{ userInitials }}</span>
          </div>
          <div>
            <h3 class="font-bold text-xl text-blue-950">{{ userName }}</h3>
            <p class="text-blue-600">{{ userId }}</p>
          </div>
        </div>

        <!-- Menu options avec hover effects -->
        <div class="space-y-2">
          <button *ngFor="let option of profileOptions; let i = index"
                  [@listAnimation]="{value: '*', params: {delay: i * 100}}"
                  (click)="onOptionClick(option)"
                  class="w-full flex items-center gap-4 p-4 hover:bg-blue-50 rounded-xl transition-all duration-300
                         hover:translate-x-2 hover:shadow-md group">
            <div class="w-10 h-10 rounded-full flex items-center justify-center
                        group-hover:scale-110 transition-all duration-300
                        bg-gradient-to-br from-blue-100 to-blue-200">
              <span class="text-xl text-blue-600">{{ option.icon }}</span>
            </div>
            <span class="text-blue-950 group-hover:text-blue-600 transition-colors duration-300">
              {{ option.name }}
            </span>
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: contents;
    }
  `],
  animations: [
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
    trigger('slideAnimation', [
      state('hidden', style({
        transform: 'translateX(-100%)'
      })),
      state('visible', style({
        transform: 'translateX(0)'
      })),
      transition('hidden => visible', animate('300ms cubic-bezier(0.4, 0, 0.2, 1)')),
      transition('visible => hidden', animate('200ms cubic-bezier(0.4, 0, 0.2, 1)'))
    ]),
    trigger('fadeInUp', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('500ms cubic-bezier(0.4, 0, 0.2, 1)',
          style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ]),
    trigger('listAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateX(-20px)' }),
        animate('{{delay}}ms cubic-bezier(0.4, 0, 0.2, 1)',
          style({ opacity: 1, transform: 'translateX(0)' }))
      ])
    ])
  ],
  standalone: true,
  imports: [NgForOf]
})
export class ProfileComponent {
  @Input() isOpen = false;
  @Input() userName = '';
  @Input() userId = '';
  @Input() profileOptions: ProfileOption[] = [];
  @Output() closeProfile = new EventEmitter<void>();
  @Output() optionSelected = new EventEmitter<ProfileOption>();

  get userInitials(): string {
    return this.userName
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  }

  close() {
    this.closeProfile.emit();
  }

  onOptionClick(option: ProfileOption) {
    this.optionSelected.emit(option);
    if (option.name === 'Se déconnecter') {
      this.close();
    }
  }
}
