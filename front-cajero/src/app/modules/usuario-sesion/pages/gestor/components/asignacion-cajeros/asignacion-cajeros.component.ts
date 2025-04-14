import { Component, OnInit } from '@angular/core';
import { TurnService } from '../../../../../../core/turn/turn.service';
import { AuthService } from '../../../../../../core/auth/auth.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-asignacion-cajeros',
  templateUrl: './asignacion-cajeros.component.html',
  styles: ``,
})
export class AsignacionCajerosComponent implements OnInit {
  // Notificación
  statusnotification = false;
  notificationTitle = '';
  notificationMessage = '';
  notificationType = '';

  // Datos
  cajas: any[] = [];
  cajeros: any[] = [];
  cajerosDisponibles: any[] = [];
  cajaSeleccionada: any = null;
  cajeroSeleccionado: any = null;
  isLoading = false;
  filtroCajas = '';
  filtroCajeros = '';

  constructor(
    private turnService: TurnService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.isLoading = true;

    // Cargar cajas con usuarios asignados
    this.turnService.getAllCashWithUsers().subscribe({
      next: (cajas) => {
        this.cajas = cajas;

        // Cargar todos los usuarios y filtrar por rol Cajero
        this.authService.getAllUser().subscribe({
          next: (usuarios) => {
            this.cajeros = usuarios.filter(
              (user) => user.rol?.rolName === 'Cajero'
            );
            this.updateCajerosDisponibles();
            this.isLoading = false;
          },
          error: (err) => {
            this.showNotification('Error', 'Error cargando cajeros', 'error');
            this.isLoading = false;
          },
        });
      },
      error: (err) => {
        this.showNotification('Error', 'Error cargando cajas', 'error');
        this.isLoading = false;
      },
    });
  }

  seleccionarCaja(caja: any): void {
    // Si ya está seleccionada, la deseleccionamos
    if (this.cajaSeleccionada?.cashId === caja.cashId) {
      this.cajaSeleccionada = null;
      this.cajeroSeleccionado = null;
    } else {
      this.cajaSeleccionada = caja;

      this.updateCajerosDisponibles();
    }
  }

  seleccionarCajero(cajero: any): void {
    if (this.cajeroSeleccionado?.userid === cajero.userid) {
      this.cajeroSeleccionado = null;
    } else {
      this.cajeroSeleccionado = cajero;
    }
  }

  asignarCajeroACaja(): void {
    if (!this.cajaSeleccionada || !this.cajeroSeleccionado) {
      this.showNotification(
        'Advertencia',
        'Seleccione una caja y un cajero',
        'warning'
      );
      return;
    }

    if (this.getCajaStatus(this.cajaSeleccionada) === 'full') {
      this.showNotification(
        'Error',
        'Esta caja ya tiene el máximo de cajeros asignados',
        'error'
      );
      return;
    }

    this.isLoading = true;
    this.turnService
      .assignUserToCash(
        this.cajaSeleccionada.cashId,
        this.cajeroSeleccionado.userid
      )
      .subscribe({
        next: () => {
          this.showNotification(
            'Éxito',
            'Cajero asignado correctamente',
            'success'
          );
          this.loadData();
          this.cajeroSeleccionado = null;
        },
        error: (err) => {
          let errorMessage = 'Error al crear turno';

          if (err instanceof HttpErrorResponse) {
            errorMessage = err.error.error || err.message;
          } else if (err.message) {
            errorMessage = err.message;
          }

          this.showNotification('Error', errorMessage, 'error');
          this.isLoading = false;
        },
      });
  }
  getCajerosFiltrados(): any[] {
    if (!this.filtroCajeros) return this.cajerosDisponibles;

    return this.cajerosDisponibles.filter(
      (cajero) =>
        cajero.username
          .toLowerCase()
          .includes(this.filtroCajeros.toLowerCase()) ||
        cajero.userid.toLowerCase().includes(this.filtroCajeros.toLowerCase())
    );
  }

  updateCajerosDisponibles(): void {
    if (!this.cajaSeleccionada) {
      this.cajerosDisponibles = [...this.cajeros];
      return;
    }

    const assignedUserIds =
      this.cajaSeleccionada.assignedUsers?.map(
        (u: { userid: string }) => u.userid
      ) || [];

    this.cajerosDisponibles = this.cajeros.filter(
      (cajero) => !assignedUserIds.includes(cajero.userid)
    );
  }

  getCajaStatus(caja: any): string {
    const userCount = caja.assignedUsers?.length || 0;
    if (userCount >= 2) return 'full';
    if (userCount === 1) return 'partial';
    return 'empty';
  }

  getCajasFiltradas(): any[] {
    if (!this.filtroCajas) return this.cajas;

    return this.cajas.filter(
      (caja) =>
        caja.cashDescription
          .toLowerCase()
          .includes(this.filtroCajas.toLowerCase()) ||
        caja.cashId.toLowerCase().includes(this.filtroCajas.toLowerCase())
    );
  }

  trackByCajaId(index: number, caja: any): string {
    return caja.cashId;
  }

  trackByUserId(index: number, user: any): string {
    return user.userid;
  }

  showNotification(title: string, message: string, type: string): void {
    this.statusnotification = true;
    this.notificationTitle = title;
    this.notificationMessage = message;
    this.notificationType = type;

    setTimeout(() => {
      this.statusnotification = false;
    }, 3000);
  }
}
