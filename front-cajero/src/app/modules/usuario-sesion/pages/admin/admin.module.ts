import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GestionarUsuarioComponent } from './pages/gestionar-usuario/gestionar-usuario.component';
import { ComponentsModule } from '../../shared/components/components.module';
import { AdminRoutingModule } from './admin-routing.module';
import { SharedModule } from '../../../shared/shared.module';
import { UserModalComponent } from './components/user-modal/user-modal.component';
import { TablesComponent } from './components/tables/tables.component';

@NgModule({
  declarations: [
    GestionarUsuarioComponent,
    UserModalComponent,
    TablesComponent,
  ],
  imports: [CommonModule, ComponentsModule, AdminRoutingModule, SharedModule],
})
export class AdminModule {}
