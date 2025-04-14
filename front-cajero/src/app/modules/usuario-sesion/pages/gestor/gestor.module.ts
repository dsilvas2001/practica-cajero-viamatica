import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AsignacionCajerosComponent } from './components/asignacion-cajeros/asignacion-cajeros.component';
import { AsignacionTurnosComponent } from './components/asignacion-turnos/asignacion-turnos.component';
import { GestionarTurnosComponent } from './pages/gestionar-turnos/gestionar-turnos.component';
import { SharedModule } from '../../../shared/shared.module';
import { ComponentsModule } from '../../shared/components/components.module';
import { GestorRoutingModule } from './gestor-routing.module';

@NgModule({
  declarations: [
    GestionarTurnosComponent,
    AsignacionTurnosComponent,
    AsignacionCajerosComponent,
  ],
  imports: [CommonModule, ComponentsModule, GestorRoutingModule, SharedModule],
})
export class GestorModule {}
