import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CajeroRoutingModule } from './cajero-routing.module';
import { GestionarClientComponent } from './pages/gestionar-client/gestionar-client.component';
import { SharedModule } from '../../../shared/shared.module';
import { TablesComponent } from './components/tables/tables.component';
import { ClientModalComponent } from './components/client-modal/client-modal.component';
import { ComponentsModule } from '../../shared/components/components.module';

@NgModule({
  declarations: [
    GestionarClientComponent,
    TablesComponent,
    ClientModalComponent,
  ],
  imports: [
    CommonModule,
    ComponentsModule,
    CajeroRoutingModule,
    SharedModule,
    ComponentsModule,
  ],
})
export class CajeroModule {}
