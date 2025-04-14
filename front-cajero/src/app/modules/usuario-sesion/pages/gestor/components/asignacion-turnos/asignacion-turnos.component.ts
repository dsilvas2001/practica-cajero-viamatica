import { Component, OnInit } from '@angular/core';
import { TurnService } from '../../../../../../core/turn/turn.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-asignacion-turnos',
  templateUrl: './asignacion-turnos.component.html',
  styles: ``,
})
export class AsignacionTurnosComponent implements OnInit {
  // Notificación
  statusnotification = false;
  notificationTitle = '';
  notificationMessage = '';
  notificationType = '';

  // Tabla y paginación
  turnos: any[] = [];
  displayedTurnos: any[] = [];
  currentPage = 1;
  itemsPerPage = 5;

  // Cajas y filtros
  cajas: any[] = [];
  turnosFiltrados: any[] = [];
  cajaSeleccionada: any = null;
  nuevoTurnoDescripcion = '';
  buscador = '';
  isLoading = false;

  constructor(
    private turnService: TurnService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadCajas();
    this.cargarTurnos();
  }

  loadCajas(): void {
    this.isLoading = true;
    this.turnService.getAllCashWithUsers().subscribe({
      next: (cajas) => {
        this.cajas = cajas.map((caja) => ({
          ...caja,
          estado: caja.active ? 'activa' : 'inactiva',
        }));
        this.isLoading = false;
      },
      error: (err) => {
        this.showNotification(
          'Error',
          'No se pudieron cargar las cajas',
          'error'
        );
        this.isLoading = false;
      },
    });
  }

  cargarTurnos(): void {
    this.isLoading = true;
    if (this.cajaSeleccionada) {
      this.turnService.getTurnsByCash(this.cajaSeleccionada.cashId).subscribe({
        next: (turnos) => {
          this.turnos = turnos;
          this.filtrarTurnos();
          this.updateDisplayedTurnos();
          this.isLoading = false;
        },
        error: (err) => {
          let errorMessage = 'Error al crear turno';

          if (err instanceof HttpErrorResponse) {
            errorMessage = err.error.error || err.message;
            this.turnos = [];
          } else if (err.message) {
            errorMessage = err.message;
          }

          this.showNotification('Error', errorMessage, 'error');
        },
      });
    } else {
      this.turnService.getAllTurns().subscribe({
        next: (turnos) => {
          this.turnos = turnos;
          this.filtrarTurnos();
          this.updateDisplayedTurnos();
          this.isLoading = false;
        },
        error: (err) => {
          this.showNotification(
            'Error',
            'Error cargando todos los turnos',
            'error'
          );
          this.isLoading = false;
        },
      });
    }
  }

  seleccionarCaja(caja: any): void {
    this.cajaSeleccionada = caja;

    this.cargarTurnos();
  }

  crearNuevoTurno(): void {
    if (!this.nuevoTurnoDescripcion || !this.cajaSeleccionada) {
      this.showNotification(
        'Advertencia',
        'Descripción y caja son requeridos',
        'warning'
      );
      return;
    }

    this.isLoading = true;
    this.turnService
      .createTurn(this.nuevoTurnoDescripcion, this.cajaSeleccionada.cashId)
      .subscribe({
        next: () => {
          this.showNotification(
            'Éxito',
            'Turno creado correctamente',
            'success'
          );
          this.cargarTurnos();
          this.isLoading = false;
          this.nuevoTurnoDescripcion = '';
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

  agruparCajas(): any[] {
    // Agrupar por el tipo de caja (asumiendo que cashDescription contiene el tipo)
    const grupos: { [key: string]: any } = {};

    this.cajas.forEach((caja) => {
      // Extraer el tipo de la descripción (ej: "Serie A" -> "Serie")
      const tipo = caja.cashDescription.split(' ')[0] || 'General';

      if (!grupos[tipo]) {
        grupos[tipo] = {
          tipo,
          cajas: [],
          abierto: true,
        };
      }
      grupos[tipo].cajas.push(caja);
    });

    return Object.values(grupos);
  }

  filtrarTurnos(): void {
    if (!this.buscador) {
      this.turnosFiltrados = [...this.turnos];
    } else {
      const busqueda = this.buscador.toLowerCase();
      this.turnosFiltrados = this.turnos.filter(
        (turno) =>
          turno.description.toLowerCase().includes(busqueda) ||
          turno.turnId.toLowerCase().includes(busqueda) ||
          turno.gestor.username.toLowerCase().includes(busqueda)
      );
    }
    this.updateDisplayedTurnos();
  }

  showNotification(title: string, message: string, type: string): void {
    this.statusnotification = true;
    this.notificationTitle = title;
    this.notificationMessage = message;
    this.notificationType = type;

    if (type !== 'delete') {
      setTimeout(() => {
        this.statusnotification = false;
      }, 3000);
    }
  }

  updateDisplayedTurnos(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.displayedTurnos = this.turnosFiltrados.slice(startIndex, endIndex);
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.updateDisplayedTurnos();
  }

  get totalPages(): number {
    return Math.ceil(this.turnosFiltrados.length / this.itemsPerPage);
  }

  getCajaStatus(caja: any): string {
    const userCount = caja.assignedUsers?.length || 0;
    if (userCount >= 2) return 'full';
    if (userCount === 1) return 'partial';
    return 'empty';
  }
}
