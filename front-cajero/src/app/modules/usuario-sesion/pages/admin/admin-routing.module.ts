import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from '../../shared/pages/dashboard/dashboard.component';
import { GestionarUsuarioComponent } from './pages/gestionar-usuario/gestionar-usuario.component';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    children: [
      {
        path: 'gestionar-usuario',
        component: GestionarUsuarioComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}
