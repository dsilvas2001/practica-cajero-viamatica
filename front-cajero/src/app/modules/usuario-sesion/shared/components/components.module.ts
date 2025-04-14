import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './navbar/navbar.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { SharedModule } from '../../../shared/shared.module';
import { RouterModule } from '@angular/router';
import { CardsComponent } from './cards/cards.component';
import { TablesComponent } from '../../pages/admin/components/tables/tables.component';
import { PaginationComponent } from './pagination/pagination.component';

@NgModule({
  declarations: [
    NavbarComponent,
    SidebarComponent,
    CardsComponent,
    PaginationComponent,
  ],
  imports: [CommonModule, RouterModule, SharedModule],
  exports: [
    SidebarComponent,
    NavbarComponent,
    CardsComponent,
    PaginationComponent,
  ],
})
export class ComponentsModule {}
