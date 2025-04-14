import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../core/auth/auth.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styles: ``,
})
export class ResetPasswordComponent implements OnInit {
  resetForm: FormGroup;
  token: string = '';
  isLoading = false;
  statusnotification = false;
  notificationTitle = '';
  notificationMessage = '';
  notificationType = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.resetForm = this.fb.group(
      {
        newPassword: [
          '',
          [
            Validators.required,
            Validators.minLength(8),
            this.passwordValidator,
          ],
        ],
        confirmPassword: ['', Validators.required],
      },
      { validator: this.passwordMatchValidator }
    );
  }

  ngOnInit() {
    this.token = this.route.snapshot.queryParamMap.get('token') || '';
    if (!this.token) {
      this.showNotification(
        'Error',
        'Token de recuperación no válido',
        'error'
      );
      setTimeout(() => {
        this.router.navigate(['/Auth/forgot-password']);
      }, 3000);
    }

    // Escuchar cambios para validar en tiempo real
    this.resetForm.get('newPassword')?.valueChanges.subscribe(() => {
      this.resetForm.get('confirmPassword')?.updateValueAndValidity();
    });
  }

  // Validador personalizado para la contraseña
  passwordValidator(control: any) {
    const value = control.value;
    if (!value) return null;

    const hasNumber = /[0-9]/.test(value);
    const hasUpper = /[A-Z]/.test(value);
    const validLength = value.length >= 8 && value.length <= 30;

    const passwordValid = hasNumber && hasUpper && validLength;
    return passwordValid ? null : { passwordRequirements: true };
  }

  // Validador para coincidencia de contraseñas
  passwordMatchValidator(form: FormGroup) {
    const password = form.get('newPassword')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;

    if (!password || !confirmPassword) return null;

    return password === confirmPassword ? null : { mismatch: true };
  }

  onSubmit() {
    if (this.resetForm.invalid || !this.token) return;

    this.isLoading = true;
    const newPassword = this.resetForm.get('newPassword')?.value;

    this.authService.resetPassword(this.token, newPassword).subscribe({
      next: () => {
        this.showNotification(
          'Éxito',
          'Contraseña actualizada correctamente',
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
          err.error?.message || 'Error al restablecer contraseña',
          'error'
        );
        this.isLoading = false;
      },
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

  // Método para obtener el estado del campo
  getFieldStatus(fieldName: string) {
    const field = this.resetForm.get(fieldName);
    if (!field) return 'neutral';

    if (fieldName === 'confirmPassword' && field.touched) {
      if (this.resetForm.errors?.['mismatch']) return 'invalid';
      if (field.value && this.resetForm.valid) return 'valid';
    }

    if (fieldName === 'newPassword' && field.touched) {
      if (field.invalid) return 'invalid';
      if (field.valid) return 'valid';
    }

    return 'neutral';
  }
}
