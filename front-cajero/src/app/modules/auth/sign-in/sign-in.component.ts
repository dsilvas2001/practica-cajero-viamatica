import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../core/auth/auth.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { LoadingService } from '../../../core/loading/loading.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styles: ``,
})
export class SignInComponent implements OnInit {
  statusnotification: boolean = false;
  isLoading = false;
  notificationTitle: string = '';
  notificationMessage: string = '';
  notificationType: string = '';

  authForm: FormGroup;
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authServices: AuthService,
    private loadingService: LoadingService
  ) {
    this.authForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
    this.loadingService.isLoading.subscribe((state) => {
      this.isLoading = state;
    });
  }

  sesionActive() {
    console.log('Sesión activa');

    localStorage.setItem('prueba', 'true');
  }

  ngOnInit(): void {
    // Verifica si 'localStorage' está definido (solo navegador)
    if (typeof localStorage !== 'undefined') {
      if (localStorage.getItem('prueba') === 'false') {
        this.statusnotification = true;
        this.showNotification(
          'Sesión Cerrada',
          'Has cerrado sesión exitosamente. Esperamos verte pronto. ¡Cuídate!',
          'logout'
        );
        localStorage.removeItem('prueba');
      }
    }
  }

  onSubmit(): void {
    if (this.authForm.valid) {
      const userDto = this.authForm.value;
      this.loadingService.show();

      this.authServices.loginUser(userDto).subscribe(
        (response) => {
          console.log('Inicio de sesión exitoso:', response);
          localStorage.setItem('token', response.token);
          this.sesionActive();
          this.loadingService.hide();
          this.router.navigate(['/Usuario/welcome']);
        },
        (error: HttpErrorResponse) => {
          console.log('Error capturado al autenticar usuario:', error);

          if (typeof error.error === 'object') {
            this.loadingService.hide();

            this.showNotification('Error', error.error.error, 'error');
          }
        }
      );
    } else {
      console.log('Formulario inválido:', this.authForm);
    }
  }

  showNotification(title: string, message: string, type: string) {
    this.statusnotification = true;
    this.notificationTitle = title;
    this.notificationMessage = message;
    this.notificationType = type;

    setTimeout(() => {
      this.statusnotification = false;
    }, 3000);
  }
}
