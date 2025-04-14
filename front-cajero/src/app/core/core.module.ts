import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { loggingInterceptor } from './interceptors/logging.interceptor';
import { errorHandlingInterceptor } from './interceptors/error-handling.interceptor';
import { AuthInterceptor } from './interceptors/auth.interceptor';

@NgModule({
  declarations: [],
  imports: [CommonModule],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: loggingInterceptor, multi: true },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: errorHandlingInterceptor,
      multi: true,
    },
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
  ],
})
export class CoreModule {}
