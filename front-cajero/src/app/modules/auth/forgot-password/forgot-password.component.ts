import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../core/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styles: ``,
})
export class ForgotPasswordComponent {
  authForm: FormGroup;
  isLoading = false;
  statusnotification = false;
  notificationTitle = '';
  notificationMessage = '';
  notificationType = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.authForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  onSubmit() {
    if (this.authForm.invalid) {
      this.markFormAsTouched();
      return;
    }

    this.isLoading = true;
    const email = this.authForm.get('email')?.value;

    this.authService.forgotPassword(email).subscribe({
      next: () => {
        this.showNotification(
          'Éxito',
          'Se ha enviado un correo con instrucciones para restablecer tu contraseña',
          'success'
        );
        this.isLoading = false;
        setTimeout(() => {
          this.router.navigate(['/Auth/sign-in']);
        }, 3000);
      },
      error: (err) => {
        console.error(err);
        this.showNotification(
          'Error',
          err.error?.message || 'Ocurrió un error al enviar el correo',
          'error'
        );
        this.isLoading = false;
      },
    });
  }

  markFormAsTouched() {
    Object.values(this.authForm.controls).forEach((control) => {
      control.markAsTouched();
    });
  }

  showNotification(title: string, message: string, type: string) {
    this.notificationTitle = title;
    this.notificationMessage = message;
    this.notificationType = type;
    this.statusnotification = true;

    if (type !== 'error') {
      setTimeout(() => {
        this.statusnotification = false;
      }, 5000);
    }
  }
}
