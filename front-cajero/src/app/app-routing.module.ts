import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PagesModule } from './modules/usuario-sesion/shared/pages/pages.module';
import { GestorModule } from './modules/usuario-sesion/pages/gestor/gestor.module';
import { CajeroModule } from './modules/usuario-sesion/pages/cajero/cajero.module';
import { NoAuthGuard } from './core/guards/no-auth.guard';
import { AuthGuard } from './core/guards/auth.guard';

const routes: Routes = [
  {
    path: 'Auth',
    canActivate: [NoAuthGuard], // Solo accesible sin token
    loadChildren: () =>
      import('./modules/auth/auth.module').then((m) => m.AuthModule),
  },
  {
    path: 'Usuario',
    canActivate: [AuthGuard], // Requiere token
    loadChildren: () =>
      import('./modules/usuario-sesion/shared/pages/pages.module').then(
        (m) => m.PagesModule
      ),
  },
  {
    path: 'Admin',
    canActivate: [AuthGuard], // Requiere token
    loadChildren: () =>
      import('./modules/usuario-sesion/pages/admin/admin.module').then(
        (m) => m.AdminModule
      ),
  },
  {
    path: 'Gestor',
    canActivate: [AuthGuard], // Requiere token
    loadChildren: () =>
      import('./modules/usuario-sesion/pages/gestor/gestor.module').then(
        (m) => m.GestorModule
      ),
  },
  {
    path: 'Client',
    canActivate: [AuthGuard], // Requiere token
    loadChildren: () =>
      import('./modules/usuario-sesion/pages/cajero/cajero.module').then(
        (m) => m.CajeroModule
      ),
  },
  {
    path: '**',
    redirectTo: 'Auth',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
