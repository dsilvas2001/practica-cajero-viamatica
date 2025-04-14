import { Component } from '@angular/core';

@Component({
  selector: 'app-gestionar-turnos',
  templateUrl: './gestionar-turnos.component.html',
  styles: ``,
})
export class GestionarTurnosComponent {
  activeTab = 'asignacion-turnos';

  tabs = [
    { id: 'asignacion-turnos', label: 'Asignación de Turnos' },
    { id: 'asignacion-cajeros', label: 'Asignación de Cajeros' },
  ];

  // Datos de ejemplo (deberías obtenerlos de servicios)
  cajas = [
    {
      id: 1,
      numero: 1,
      estado: 'activa',
      cajero: { id: 1, nombre: 'Juan Pérez', identificacion: '12345678' },
    },
    { id: 2, numero: 2, estado: 'activa', cajero: null },
    { id: 3, numero: 3, estado: 'inactiva', cajero: null },
  ];

  cajeros = [
    { id: 1, nombre: 'Juan Pérez', identificacion: '12345678' },
    { id: 2, nombre: 'María García', identificacion: '87654321' },
    { id: 3, nombre: 'Carlos López', identificacion: '56781234' },
  ];

  turnosPendientes = [
    {
      id: 101,
      cliente: 'Ana Rodríguez',
      servicio: 'Pago de factura',
      hora: new Date(),
    },
    {
      id: 102,
      cliente: 'Luis Martínez',
      servicio: 'Retiro de dinero',
      hora: new Date(),
    },
    {
      id: 103,
      cliente: 'Sofía González',
      servicio: 'Depósito',
      hora: new Date(),
    },
  ];
  totalTurnos = 15;

  cajaSeleccionada: any = null;
  cajeroSeleccionado: any = null;

  seleccionarCaja(caja: any) {
    this.cajaSeleccionada = caja;
  }

  seleccionarCajero(cajero: any) {
    this.cajeroSeleccionado = cajero;
  }

  asignarTurno(turno: any) {
    // Lógica para asignar turno a caja
    console.log(
      `Turno ${turno.id} asignado a caja ${this.cajaSeleccionada.numero}`
    );
    // Aquí llamarías al servicio correspondiente
  }

  asignarCajeroACaja(caja: any) {
    // Lógica para asignar cajero a caja
    caja.cajero = this.cajeroSeleccionado;
    this.cajeroSeleccionado = null;
    // Aquí llamarías al servicio correspondiente
  }

  removerCajero(caja: any) {
    caja.cajero = null;
    // Aquí llamarías al servicio correspondiente
  }

  toggleEstadoCaja(caja: any) {
    caja.estado = caja.estado === 'activa' ? 'inactiva' : 'activa';
    // Aquí llamarías al servicio correspondiente
  }
}
