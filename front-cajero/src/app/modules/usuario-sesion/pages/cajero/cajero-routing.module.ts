import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from '../../shared/pages/dashboard/dashboard.component';
import { GestionarClientComponent } from './pages/gestionar-client/gestionar-client.component';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    children: [
      {
        path: 'gestionar-client',
        component: GestionarClientComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CajeroRoutingModule {}
