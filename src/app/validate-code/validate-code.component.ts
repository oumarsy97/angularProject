import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import {NgClass, NgForOf, NgIf} from '@angular/common';
import { AuthServiceService } from '../auth-service.service';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-validate-code',
  templateUrl: './validate-code.component.html',
  styleUrls: ['./validate-code.component.css'],
  imports: [
    NgIf,
    ReactiveFormsModule,
    NgForOf,
    NgClass
  ],
  standalone: true
})
export class ValidateCodeComponent implements OnInit, OnDestroy {
  codeForm: FormGroup;
  isSubmitting = false;
  isErrorState = false;
  timeLeft = 60;
  timer?: number;
  showCode = false;
  telephone!: string;
  idCompte!: number;


  constructor(
    private readonly fb: FormBuilder,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly authService: AuthServiceService
  ) {
    this.codeForm = this.fb.group({
      digit0: ['', [Validators.required, Validators.pattern('^[0-9]$')]],
      digit1: ['', [Validators.required, Validators.pattern('^[0-9]$')]],
      digit2: ['', [Validators.required, Validators.pattern('^[0-9]$')]],
      digit3: ['', [Validators.required, Validators.pattern('^[0-9]$')]]
    });
  }

  ngOnInit(): void {
    // Suppression de la vérification du téléphone car on appelle directement fetchTelephoneFromToken
    this.fetchTelephoneFromToken();
  }

  private fetchTelephoneFromToken(): void {
    const token = localStorage.getItem('access_token');

    if (token) {
      this.authService.fetchTelephoneFromToken()
        .pipe(
          catchError(error => {
            console.error('Erreur lors de la récupération du téléphone', error);
            this.router.navigate(['/login']);
            return of(null);
          })
        )
        .subscribe(response => {
          if (response?.data?.telephone) {
            this.telephone = response.data.telephone;
            this.idCompte = response.data.id;
            this.startTimer();
          } else {
            console.error('Aucun téléphone trouvé dans la réponse');
            this.router.navigate(['/login']);
          }
        });
    } else {
      console.error('Aucun token trouvé dans localStorage');
      this.router.navigate(['/login']);
    }
  }

  onDigitInput(event: any, index: number): void {
    const input = event.target as HTMLInputElement;
    const value = input.value;

    if (value && !/^\d$/.test(value)) {
      input.value = '';
      return;
    }

    if (value && index < 3) {
      const nextInput = input.parentElement?.nextElementSibling?.querySelector('input');
      if (nextInput) {
        nextInput.focus();
      }
    }

    // Soumettre automatiquement si tous les champs sont remplis
    if (this.codeForm.valid) {
      this.onSubmit();
    }
  }

  onKeyDown(event: KeyboardEvent, index: number): void {
    if (event.key === 'Backspace') {
      const input = event.target as HTMLInputElement;

      if (!input.value && index > 0) {
        event.preventDefault();
        const prevInput = input.parentElement?.previousElementSibling?.querySelector('input');
        if (prevInput) {
          prevInput.focus();
          prevInput.value = '';
          this.codeForm.get(`digit${index - 1}`)?.setValue('');
        }
      }
    }
  }

  onDigitFocus(event: FocusEvent): void {
    const input = event.target as HTMLInputElement;
    setTimeout(() => {
      input.select();
    }, 100);
  }

  handlePaste(event: ClipboardEvent): void {
    event.preventDefault();
    const pastedData = event.clipboardData?.getData('text');

    if (pastedData && /^\d{4}$/.test(pastedData)) {
      Array.from(pastedData).forEach((digit, index) => {
        this.codeForm.get(`digit${index}`)?.setValue(digit);
      });
      // Soumettre automatiquement après le collage
      if (this.codeForm.valid) {
        this.onSubmit();
      }
    }
  }

  toggleCodeVisibility(): void {
    this.showCode = !this.showCode;
  }

  getInputType(): string {
    return this.showCode ? 'text' : 'password';
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.codeForm.get(fieldName);
    return field ? field.invalid && (field.dirty || field.touched) : false;
  }

  hasDigitError(): boolean {
    return this.isFieldInvalid('digit0') ||
      this.isFieldInvalid('digit1') ||
      this.isFieldInvalid('digit2') ||
      this.isFieldInvalid('digit3');
  }

  private startTimer(): void {
    if (this.timer) {
      clearInterval(this.timer);
    }

    this.timeLeft = 60;
    this.timer = window.setInterval(() => {
      if (this.timeLeft > 0) {
        this.timeLeft--;
      } else {
        if (this.timer) {
          clearInterval(this.timer);
        }
      }
    }, 1000);
  }

  async onSubmit(): Promise<void> {
    if (this.codeForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;
      this.isErrorState = false;

      try {
        const code = Object.values(this.codeForm.value).join('');
        await this.validateCode(code);
      } catch (error) {
        this.handleError();
      } finally {
        this.isSubmitting = false;
      }
    }
  }

  private async validateCode(code: string): Promise<void> {
    this.authService.validateCode(this.idCompte, code)
      .pipe(
        catchError(error => {
          console.error('Erreur lors de la validation du code', error);
          this.isErrorState = true;
          this.handleError();
          throw error;
        })
      )
      .subscribe({
        next: (response) => {
          console.log('Code validé avec succès:', response);
          this.router.navigate(['/home']);
        },
        error: (error) => {
          console.error('Erreur:', error);
          this.handleError();
        },
        complete: () => {
          this.isSubmitting = false;
        }
      });
  }

  private handleError(): void {
    this.isErrorState = true;
    this.codeForm.reset();
    const firstInput = document.querySelector<HTMLInputElement>('input[formControlName=digit0]');
    if (firstInput) {
      firstInput.focus();
    }
  }

  resendCode(): void {
    if (this.timeLeft > 0 || !this.telephone) return;

    this.isSubmitting = true;  // Ajoutez ceci

    this.authService.resendCode(this.telephone,this.idCompte)
      .pipe(
        catchError(error => {
          console.error('Erreur lors du renvoi du code', error);
          return of(null);
        })
      )
      .subscribe(response => {
        if (response) {
          this.startTimer();
        }
        this.isSubmitting = false;  // Et ceci
      });
  }
  ngOnDestroy(): void {
    if (this.timer) {
      clearInterval(this.timer);
    }
  }
}
