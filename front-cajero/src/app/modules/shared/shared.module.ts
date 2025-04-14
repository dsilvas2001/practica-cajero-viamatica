import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NotificationsComponent } from './components/notifications/notifications.component';
import { HttpClientModule } from '@angular/common/http';
import { LoadingComponent } from './components/loading/loading.component';
import { MatTooltipModule } from '@angular/material/tooltip';

@NgModule({
  declarations: [NotificationsComponent, LoadingComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    MatTooltipModule,
  ],
  exports: [
    NotificationsComponent,
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    MatTooltipModule,
  ],
})
export class SharedModule {}
