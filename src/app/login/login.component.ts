import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgClass, NgForOf, NgIf } from '@angular/common';
import { AuthServiceService } from '../auth-service.service';
import { Router } from '@angular/router';
import {DataResponse} from '../model/data-response.model';

interface LoginResponse {
  success: boolean;
  message: string;
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgIf,
    NgForOf,
    NgClass
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginForm: FormGroup;
  showPin: boolean = false;
  isLoading: boolean = false;
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthServiceService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      phone: ['', [Validators.required, Validators.pattern('^7[0-9]{8}$')]],
      pin0: ['', [Validators.required, Validators.pattern('^[0-9]$')]],
      pin1: ['', [Validators.required, Validators.pattern('^[0-9]$')]],
      pin2: ['', [Validators.required, Validators.pattern('^[0-9]$')]],
      pin3: ['', [Validators.required, Validators.pattern('^[0-9]$')]],
      pin4: ['', [Validators.required, Validators.pattern('^[0-9]$')]],
      pin5: ['', [Validators.required, Validators.pattern('^[0-9]$')]]
    });
  }

  onPinInput(event: any, index: number) {
    const input = event.target;
    const value = input.value;

    // Ensure only numbers
    if (value && !/^\d+$/.test(value)) {
      input.value = '';
      return;
    }

    if (value) {
      // Automatically move to next input
      if (index < 5) {
        const nextInput = input.parentElement.nextElementSibling?.querySelector('input');
        if (nextInput) {
          nextInput.focus();
        }
      }
    }
  }

  onKeyDown(event: KeyboardEvent, index: number) {
    if (event.key === 'Backspace') {
      const currentInput = event.target as HTMLInputElement;

      if (!currentInput.value && index > 0) {
        event.preventDefault();
        const prevInput = currentInput.parentElement?.previousElementSibling?.querySelector('input');
        if (prevInput) {
          prevInput.focus();
          prevInput.value = '';
          this.loginForm.get('pin' + (index - 1))?.setValue('');
        }
      }
    }
  }

  onPinFocus(event: FocusEvent) {
    const input = event.target as HTMLInputElement;
    setTimeout(() => {
      input.select();
    }, 100);
  }

  togglePinVisibility() {
    this.showPin = !this.showPin;
  }

  handlePaste(event: ClipboardEvent) {
    event.preventDefault();
    const pastedData = event.clipboardData?.getData('text');
    if (pastedData && /^\d{6}$/.test(pastedData)) {
      for (let i = 0; i < 6; i++) {
        this.loginForm.get('pin' + i)?.setValue(pastedData[i]);
      }
    }
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.loginForm.get(fieldName);
    return field ? field.invalid && (field.dirty || field.touched) : false;
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';

      const phone = this.loginForm.get('phone')?.value;
      const pin = Array(6).fill(0)
        .map((_, i) => this.loginForm.get('pin' + i)?.value)
        .join('');

      this.authService.login(phone, pin).subscribe({
        next: (response) => {
          console.log(response.data);

          // Stockage du token
          localStorage.setItem('access_token', response.data.access_token);

          // Using Router service
          this.router.navigate(['/validecode']);
        },
        error: (error) => {
          this.errorMessage = error.error?.message || 'Une erreur est survenue lors de la connexion';
        },
        complete: () => {
          this.isLoading = false;
        },
      });
    }
  }


  hasPinError() {
      return this.isFieldInvalid('pin0') || this.isFieldInvalid('pin1') || this.isFieldInvalid('pin2') ||
             this.isFieldInvalid('pin3') || this.isFieldInvalid('pin4') || this.isFieldInvalid('pin5');
  }
}
