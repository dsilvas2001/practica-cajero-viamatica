import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WelcomeComponent } from './welcome/welcome.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { PagesRoutingModule } from './pages-routing.module';
import { ComponentsModule } from '../components/components.module';
import { SharedModule } from '../../../shared/shared.module';

@NgModule({
  declarations: [WelcomeComponent, DashboardComponent],
  imports: [CommonModule, PagesRoutingModule, ComponentsModule, SharedModule],
})
export class PagesModule {}
