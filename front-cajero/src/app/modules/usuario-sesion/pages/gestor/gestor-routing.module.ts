import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from '../../shared/pages/dashboard/dashboard.component';
import { GestionarTurnosComponent } from './pages/gestionar-turnos/gestionar-turnos.component';
import { NgModule } from '@angular/core';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    children: [
      {
        path: 'gestionar-turno',
        component: GestionarTurnosComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GestorRoutingModule {}
