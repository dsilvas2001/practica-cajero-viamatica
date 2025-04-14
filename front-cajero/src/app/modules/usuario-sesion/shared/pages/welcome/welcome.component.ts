import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../../../core/auth/auth.service';
import { ActivatedRoute } from '@angular/router';
import { SharedModule } from '../../../../shared/shared.module';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styles: ``,
})
export class WelcomeComponent implements OnInit {
  statusnotification: boolean = false;
  notificationTitle: string = '';
  notificationMessage: string = '';
  notificationType: string = '';
  userEmail: unknown = 'email';
  rolName: unknown = 'email';

  cards = [
    {
      title: 'CARGANDO DATOS...',
      count: 0,
      icon: 'fa-solid fa-spinner fa-spin',
    },
  ];
  constructor(
    private authServices: AuthService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.loadUserData();

    this.loadDashboardData();
  }

  private loadUserData(): void {
    if (typeof localStorage !== 'undefined') {
      if (localStorage.getItem('prueba') === 'true') {
        const infoUser = this.authServices.getUserInfo();
        this.userEmail = infoUser.email;
        this.rolName = infoUser.rol;
        this.statusnotification = true;
        this.showNotification(
          `Bienvenido, ${this.userEmail}`,
          'Has iniciado sesión correctamente. ¡Nos alegra verte de nuevo!',
          'success'
        );

        localStorage.setItem('prueba', 'false');
      }
    }
  }

  private loadDashboardData(): void {
    const userInfo = this.authServices.getUserInfo();
    if (!userInfo.id || !userInfo.rol) return;

    this.authServices.getUserFunctionRol(userInfo.id, userInfo.rol).subscribe({
      next: (data) => {
        if (userInfo.rol) {
          this.updateCards(data, userInfo.rol);
        } else {
          console.error('Role is null or undefined');
        }
      },
      error: (error) => {
        console.error('Error loading dashboard data:', error);
        this.showNotification(
          'Error',
          'No se pudo cargar la información del dashboard.',
          'error'
        );
      },
    });
  }

  private updateCards(data: any, rol: string): void {
    switch (rol.toLowerCase()) {
      case 'gestor':
        this.cards = [
          {
            title: 'TURNOS ATENDIDOS',
            count: data.totalTurnosAtendidosHoy,
            icon: 'fa-solid fa-calendar-check',
          },
          {
            title: 'TURNOS ASIGNADOS',
            count: data.turnosAsignadosPorEl,
            icon: 'fa-solid fa-user-tag',
          },
          {
            title: 'USUARIOS PENDIENTES',
            count: data.usuariosPendientesAprobacion,
            icon: 'fa-solid fa-user-clock',
          },
        ];
        break;

      case 'cajero':
        this.cards = [
          {
            title: 'TURNOS ATENDIDOS',
            count: data.totalTurnosAtendidosHoy,
            icon: 'fa-solid fa-calendar-check',
          },
          {
            title: 'MIS TURNOS',
            count: data.turnosAtendidosPorMi,
            icon: 'fa-solid fa-clipboard-user',
          },
        ];
        break;

      case 'administrador':
        this.cards = [
          {
            title: 'TURNOS ATENDIDOS',
            count: data.totalTurnosAtendidosHoy,
            icon: 'fa-solid fa-calendar-check',
          },
          {
            title: 'TURNOS CREADOS',
            count: data.totalTurnosCreadosHoy,
            icon: 'fa-solid fa-calendar-plus',
          },
          {
            title: 'USUARIOS PENDIENTES',
            count: data.usuariosPendientesAprobacion,
            icon: 'fa-solid fa-user-clock',
          },
        ];
        break;

      default:
        this.cards = [
          {
            title: 'TURNOS ATENDIDOS',
            count: data.totalTurnosAtendidosHoy || 0,
            icon: 'fa-solid fa-calendar-check',
          },
        ];
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
